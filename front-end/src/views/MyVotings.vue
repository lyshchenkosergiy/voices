<template>
  <div>
    <CardsList
      v-if="profile"
      :items="myVotings"
      itemKey="_id"
      emptyText="Any your own votings!"
      :loading="loading">
      <template #card="{item}" >
        <VotingCard
          :voting="item"
          :userId="profile.userId"
          my
          @remove="remove"/>
      </template>
    </CardsList>
    <CreateVotingDialog />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  MY_VOTINGS,
  MY_VOTINGS_LOADING,
  GET_MY_VOTINGS,
  DELETE_VOTING
} from '../store/actions/votings';
import { PROFILE } from '../store/actions/user';

import CreateVotingDialog from '../components/CreateVotingDialog';
import VotingCard from '../components/VotingCard';
import CardsList from '../components/CardsList';

export default {
  components: {
    CreateVotingDialog,
    VotingCard,
    CardsList
  },
  computed: {
    ...mapGetters({
      myVotings: MY_VOTINGS,
      loading: MY_VOTINGS_LOADING,
      profile: PROFILE
    })
  },
  methods: {
    ...mapActions({
      getMyVotings: GET_MY_VOTINGS,
      deleteVoting: DELETE_VOTING
    }),
    async remove({ _id }) {
      await this.deleteVoting(_id);
    }
  },
  mounted() {
    this.getMyVotings();
  }
};
</script>
