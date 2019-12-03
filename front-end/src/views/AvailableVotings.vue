<template>
  <div>
    <v-switch
      class="mt-8"
      color="primary"
      v-model="isMember"
      label="I'm member of"/>
    <CardsList
      v-if="profile"
      :items="votingsToShow"
      itemKey="_id"
      emptyText="Any available voting!"
      :loading="loading">
      <template #card="{item}" >
        <VotingCard
          :voting="item"
          :userId="profile.userId"
          @join="join"/>
      </template>
    </CardsList>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  VOTINGS,
  VOTINGS_LOADING,
  GET_VOTINGS,
  JOIN_VOTING
} from '../store/actions/votings';
import { PROFILE } from '../store/actions/user';
import VotingCard from '../components/VotingCard';
import CardsList from '../components/CardsList';

export default {
  components: {
    VotingCard,
    CardsList
  },
  data: () => ({
    isMember: false
  }),
  computed: {
    ...mapGetters({
      votings: VOTINGS,
      loading: VOTINGS_LOADING,
      profile: PROFILE
    }),
    votingsToShow() {
      return this.isMember
        ? this.votings.filter(({ members }) => !!members.find(({ userId }) => userId === this.profile.userId))
        : this.votings;
    }
  },
  methods: {
    ...mapActions({
      getVotings: GET_VOTINGS,
      joinVoting: JOIN_VOTING
    }),
    async join({ _id }) {
      await this.joinVoting(_id);
      this.getVotings();
    }
  },
  mounted() {
    this.getVotings();
  }
};
</script>
