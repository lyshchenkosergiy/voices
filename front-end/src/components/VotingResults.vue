<template>
  <v-card>
    <v-card-title>
      Results
    </v-card-title>
    <v-card-text>
      <template v-if="anonymous">Note: this voting is anonymous, so you can see only transactions info!</template>
      <v-data-table
        hide-default-footer
        :headers="headers"
        :items="votes"
        class="elevation-1">
        <template v-slot:item.transaction="{item}">
          <a class="d-block link ellipsis" target="_blank" :href="getLink(item.transactionHash)">Link</a>
        </template>
        <template v-slot:item.variant="{item}">
          {{item.variant.name}}
        </template>
        <template v-slot:item.member="{item}">
          <v-avatar class="mr-2" size="30">
            <v-img :src="item.member.profile.avatar || require('../assets/user.png')"></v-img>
          </v-avatar>
          {{item.member.profile.firstName}} {{item.member.profile.lastName}}
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-title>
      Contract state
    </v-card-title>
    <v-card-text>
    <div class="mt-4 d-flex justify-space-around" v-if="loading">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"/>
    </div>
    <PieChart
      v-else
      :labels="labels"
      :series="series"/>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  WEB3_RESULTS,
  WEB3_GET_RESULTS
} from '../store/actions/web3';

import PieChart from './PieChart';

const anonymousHeaders = [{
  text: 'Variant',
  align: 'left',
  value: 'variant'
}, {
  text: 'Transaction',
  align: 'left',
  value: 'transaction'
}];
const userHeader = {
  text: 'Member',
  align: 'left',
  value: 'member'
};

const etherscanUrl = 'https://kovan.etherscan.io';

export default {
  components: {
    PieChart
  },
  props: {
    anonymous: {
      type: Boolean,
      required: false,
      default: false
    },
    votes: {
      type: Array,
      required: true
    },
    variants: {
      type: Array,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  data: () => ({
    loading: false
  }),
  computed: {
    ...mapGetters({
      results: WEB3_RESULTS
    }),
    headers() {
      return this.anonymous ? anonymousHeaders : [userHeader, ...anonymousHeaders];
    },
    labels() {
      return this.results.map(({ name }) => name);
    },
    series() {
      return this.results.map(({ value }) => Number(value));
    }
  },
  methods: {
    getLink(txHash) {
      return `${etherscanUrl}/tx/${txHash}`;
    },
    ...mapActions({
      web3GetResults: WEB3_GET_RESULTS
    }),
    async getResults() {
      this.loading = true;
      await this.web3GetResults(this);
      this.loading = false;
    }
  },
  mounted() {
    this.getResults();
  }
};
</script>
