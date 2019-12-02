<template>
  <div>
    <CardsList
      v-if="profile"
      :items="votings"
      itemKey="_id"
      emptyText="Any available voting for you!"
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
  computed: {
    ...mapGetters({
      votings: VOTINGS,
      loading: VOTINGS_LOADING,
      profile: PROFILE
    })
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
