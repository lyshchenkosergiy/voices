<template>
  <div class="pa-6 py-md-0">
    <div class="mt-12 d-flex justify-space-around" v-if="loading">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"/>
    </div>
    <template v-else-if="votingDetails">
      <div class="d-flex flex-column-reverse align-center flex-sm-row justify-space-between">
        <div class="text-center text-sm-left mt-4 mt-md-0">
          <h2>Name</h2>
          <p>
            {{votingDetails.name}}
            <template v-if="votingDetails.anonymous">(Anonymous)</template>
          </p>
          <h2>Description</h2>
          <p>{{votingDetails.description}}</p>
          <h2>Current state</h2>
          <p>{{votingDetails.state}}</p>
        </div>
        <div class="d-flex flex-column align-center">
          <v-avatar :size="avatarSize" class="mt-4">
            <v-img :src="votingDetails.avatar || require('../assets/voting.jpg')"></v-img>
          </v-avatar>
          <FileUpload v-if="my && isCreated" :disabled="avatarUploading" @file="changeAvatar" class="my-4">
            <template #activator>
              <v-btn :disabled="avatarUploading" class="primary">
                {{avatarUploading ? 'Uploading...' : 'Change image'}}
              </v-btn>
            </template>
          </FileUpload>
        </div>
      </div>

      <v-divider class="my-4"></v-divider>
      <div class="d-flex justify-space-around">
        <v-btn v-if="isFinished" text color="primary">
          Voting finished
        </v-btn>
        <template v-else-if="my">
          <v-btn v-if="isCreated" @click="start" class="primary">
            Start voting
          </v-btn>
          <v-btn v-if="isStarted" @click="finish" class="primary">
            Finish voting
          </v-btn>
        </template>
        <template v-else>
          <v-btn v-if="!userMember && isCreated" @click="join" class="primary">
            Join voting
          </v-btn>
          <v-btn v-if="userMember && !isAcceptedMember" text color="primary">
            Your join request was sent
          </v-btn>
          <v-btn v-if="isAcceptedMember" text color="primary">
            You are member
          </v-btn>
        </template>
      </div>
      <v-divider class="my-4"></v-divider>

      <template v-if="isFinished">
        <h1>Winner</h1>
        <v-layout row wrap>
          <v-flex v-for="winner in winners" :key="'winner' + winner._id" sm6 md4 lg3 class="pa-2">
            <VariantCard
              :variant="winner"
              :canDelete="false"
              :canVote="false"
              :canEdit="false"
              :selected="userVote && userVote.variantId === winner._id"/>
          </v-flex>
        </v-layout>
        <h1>Results</h1>
        <v-layout row wrap>
          <v-flex sm12 md8 class="pa-2">
          <v-card>
            <PieChart :labels="variantsArray" :series="votesArray" />
          </v-card>
          </v-flex>
        </v-layout>
      </template>

      <h1>Blockchain info</h1>
      <div class="py-4">
        <h2>Contract</h2>
        <a class="d-block link ellipsis" target="_blank" :href="contractLink">{{contractLink}}</a>
        <template v-if="isFinished && !my">
          <h2>Your choise</h2>
          <template v-if="chooiseLink">
            <a class="d-block link ellipsis" target="_blank" :href="chooiseLink">{{chooiseLink}}</a>
          </template>
          <template v-else>
            <p>You have not choose any variant!</p>
          </template>
        </template>
        <template v-if="isFinished">
          <v-dialog v-model="resultsDialog">
            <VotingResults
              :anonymous="votingDetails.anonymous"
              :address="votingDetails.address"
              :votes="votingDetails.votes"
              :variants="votingDetails.variants"/>
          </v-dialog>
          <v-btn text @click="resultsDialog = true" class="mt-6 primary">
            See details
          </v-btn>
        </template>
      </div>

      <h1>Variants</h1>
      <CardsList :items="votingDetails.variants" itemKey="_id" emptyText="No variants specified!">
        <template #card="{item}" >
          <VariantCard
            :variant="item"
            :canDelete="isCreated && my"
            :canVote="!my && isStarted && isAcceptedMember && !userVote"
            :canEdit="my && isCreated"
            :selected="userVote && userVote.variantId === item._id"
            @remove="removeVariant"
            @edit="editVariant"
            @vote="voteVariant"/>
        </template>
      </CardsList>

      <h1>Members</h1>
      <CardsList :items="members" itemKey="_id" emptyText="No members yet!">
        <template #card="{item}" >
          <UserCard :profile="item.profile"/>
        </template>
      </CardsList>

      <template v-if="my && isCreated">
        <h1>Join requests</h1>
        <CardsList :items="requestsOrDeclined" itemKey="_id" emptyText="No requests yet!">
          <template #card="{item}" >
            <UserCard
              :profile="item.profile"
              isMemberCard
              :isRequested="item.state === 'Requested'"
              @accept="() => accept(item)"
              @decline="() => decline(item)"/>
          </template>
        </CardsList>
      </template>

      <v-dialog v-model="confirmDialog" max-width="300">
        <v-card>
          <v-card-title>
            <p class="mx-auto">Please confirm</p>
          </v-card-title>
          <v-card-text>
            <p class="mt-4 text-center mx-auto">{{ confirmText }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :loading="confirmLoading"
              text
              color="primary"
              class="mx-auto"
              @click="confirm">
              Confirm
            </v-btn>
            <v-btn
              v-if="!confirmLoading"
              text
              color="error"
              class="mx-auto"
              @click="confirmDialog = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <template v-if="my">
        <v-dialog v-model="variantDialog" max-width="600">
          <CreateVariant
          :loading="createVariantLoading"
          v-if="variantDialog"
          @create="createVariant"
          @cancel="variantDialog = false"
          @update="updateVariant"
          :editableVariant="editableVariant"/>
        </v-dialog>
        <v-btn v-if="isCreated" class="float-button" color="primary" fab @click="newVariant">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  VOTING_DETAILS,
  VOTING_DETAILS_LOADING,
  GET_VOTING_DETAILS,
  ADD_VARIANT,
  DELETE_VARIANT,
  UPDATE_VARIANT_REQUEST,
  START_VOTING,
  FINISH_VOTING,
  ACCEPT_MEMBER,
  DECLINE_MEMBER,
  VOTE,
  UPDATE_VOTING
} from '../store/actions/voting-details';
import { JOIN_VOTING } from '../store/actions/votings';
import { PROFILE } from '../store/actions/user';
import { UPLOAD_FILE } from '../store/actions/aws';

import CreateVariant from '../components/CreateVariant';
import VariantCard from '../components/VariantCard';
import UserCard from '../components/UserCard';
import CardsList from '../components/CardsList';
import FileUpload from '../components/FileUpload';
import PieChart from '../components/PieChart';
import VotingResults from '../components/VotingResults';

const etherscanUrl = 'https://kovan.etherscan.io';

export default {
  components: {
    CreateVariant,
    VariantCard,
    UserCard,
    CardsList,
    FileUpload,
    PieChart,
    VotingResults
  },
  data: () => ({
    variantDialog: false,
    createVariantLoading: false,
    avatarUploading: false,
    editableVariant: null,
    confirmDialog: false,
    confirmText: '',
    confirmLoading: false,
    confirm: () => {},
    resultsDialog: false
  }),
  computed: {
    ...mapGetters({
      votingDetails: VOTING_DETAILS,
      loading: VOTING_DETAILS_LOADING,
      profile: PROFILE
    }),
    avatarSize() {
      return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs ? 150 : 250;
    },
    my() {
      return this.profile.userId === this.votingDetails.userId;
    },
    isCreated() {
      return this.votingDetails.state === 'Created';
    },
    isStarted() {
      return this.votingDetails.state === 'Started';
    },
    isFinished() {
      return this.votingDetails.state === 'Finished';
    },
    members() {
      return this.votingDetails.members.filter(({ state }) => state === 'Accepted');
    },
    userMember() {
      return this.votingDetails.members.find(({ userId }) => userId === this.profile.userId);
    },
    isAcceptedMember() {
      return this.userMember && this.userMember.state === 'Accepted';
    },
    requestsOrDeclined() {
      return this.votingDetails.members.filter(({ state }) => state === 'Declined' || state === 'Requested');
    },
    userVote() {
      return this.userMember ? this.votingDetails.votes.find(({ memberId }) => memberId === this.userMember._id) : false;
    },
    contractLink() {
      return `${etherscanUrl}/address/${this.votingDetails.address}`;
    },
    chooiseLink() {
      return this.userVote ? `${etherscanUrl}/tx/${this.userVote.transactionHash}` : '';
    },
    variantsArray() {
      return this.votingDetails.variants.map(({ name }) => name);
    },
    votesArray() {
      return this.votingDetails.variants.map(({ _id }) => this.calculateVotes(_id));
    },
    winners() {
      const maxValue = Math.max(...this.votesArray);
      return this.votingDetails.variants.filter(({ _id }) => this.calculateVotes(_id) === maxValue);
    }
  },
  methods: {
    ...mapActions({
      getVotingDetails: GET_VOTING_DETAILS,
      addVariant: ADD_VARIANT,
      deleteVariant: DELETE_VARIANT,
      updateVariantRequest: UPDATE_VARIANT_REQUEST,
      startVoting: START_VOTING,
      finishVoting: FINISH_VOTING,
      acceptMember: ACCEPT_MEMBER,
      declineMember: DECLINE_MEMBER,
      joinVoting: JOIN_VOTING,
      vote: VOTE,
      uploadFile: UPLOAD_FILE,
      updateVoting: UPDATE_VOTING
    }),
    newVariant() {
      this.editableVariant = null;
      this.variantDialog = true;
    },
    editVariant(variant) {
      this.editableVariant = variant;
      this.variantDialog = true;
    },
    async updateVariant(variantData) {
      this.createVariantLoading = true;
      await this.updateVariantRequest({
        variantData,
        id: this.editableVariant._id
      });
      this.createVariantLoading = false;
      this.variantDialog = false;
      this.editableVariant = null;
    },
    async createVariant(variantData) {
      this.createVariantLoading = true;
      const result = await this.addVariant({ ...variantData, votingId: this.votingDetails._id });
      if (result) {
        this.variantDialog = false;
      }
      this.createVariantLoading = false;
    },
    async removeVariant({ _id }) {
      await this.deleteVariant(_id);
    },
    start() {
      this.openConfirmDialog(
        'Start of this voting.',
        async () => {
          await this.startVoting();
          this.getVotingDetails(this.$route.params.id);
        }
      );
    },
    finish() {
      this.openConfirmDialog(
        'Finish of this voting.',
        async () => {
          await this.finishVoting();
          this.getVotingDetails(this.$route.params.id);
        }
      );
    },
    accept(member) {
      this.openConfirmDialog(
        `Adding "${member.profile.firstName} ${member.profile.lastName}" to voting members.`,
        () => this.acceptMember(member)
      );
    },
    async decline({ _id }) {
      await this.declineMember(_id);
    },
    async join() {
      await this.joinVoting(this.votingDetails._id);
      this.getVotingDetails(this.$route.params.id);
    },
    voteVariant(variant) {
      this.openConfirmDialog(
        `Adding your vote for "${variant.name}".`,
        async () => {
          await this.vote({ votingId: this.votingDetails._id, variantId: variant._id });
          this.getVotingDetails(this.$route.params.id);
        }
      );
    },
    calculateVotes(id) {
      return this.votingDetails.votes.filter(({ variantId }) => variantId === id).length;
    },
    async changeAvatar({ file, url }) {
      this.avatarUploading = true;
      const previousValue = this.votingDetails.avatar;
      try {
        this.votingDetails.avatar = url;
        const avatar = await this.uploadFile({ file, name: this.votingDetails._id, scope: 'voices-votings' });
        await this.updateVoting({ avatar });
      } catch (e) {
        this.votingDetails.avatar = previousValue;
      }
      this.avatarUploading = false;
    },
    openConfirmDialog(text, cb) {
      this.confirmText = text;
      this.confirmDialog = true;
      this.confirm = async () => {
        this.confirmLoading = true;
        await cb();
        this.confirmLoading = false;
        this.confirmDialog = false;
      };
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.getVotingDetails(this.$route.params.id);
    }
  }
};
</script>
