# DEPLOY BACK-END
npm install -g serverless
cd back-end && npm install && sls deploy
export VUE_APP_API_URL=`sls manifest --json | jq -r ".dev.urls.base"`
# DEPLOY FRONT-END
cd ../front-end && npm install && npm run build
aws s3 sync ./dist s3://${FRONT_END_S3_BUCKET}
