import { Storage } from 'aws-amplify';

import { UPLOAD_FILE } from '../actions/aws';

const { VUE_APP_IMAGES_S3_BUCKET } = process.env;
const bucketUrl = `https://${VUE_APP_IMAGES_S3_BUCKET}.s3.amazonaws.com/public`;

export default {
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    // eslint-disable-next-line
    [UPLOAD_FILE]: async ({}, { file, name, scope }) => {
      const fileType = file.name.split('.').reverse()[0];
      const { key } = await Storage.put(`${scope}/${name}.${fileType}`, file);
      return `${bucketUrl}/${key}`;
    }
  }
};
