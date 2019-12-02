## Voices

Decentrilized app for online voting (blockchain based).

### Front-end

Required environment variables:

- VUE_APP_IMAGES_S3_BUCKET
- VUE_APP_AWS_REGION
- VUE_APP_USER_POOL_ID
- VUE_APP_USER_POOL_WEBCLIENT_ID
- VUE_APP_IDENTITY_POOL_ID
- VUE_APP_INFURA_URL
- VUE_APP_API_URL

For starting application locally setup `.env` file with a set of required variables(see above) and run: 

```
yarn install && yarn start
```

Build:
```
yarn install && yarn build
```
Running tests:
```
yarn install && yarn test
```

### Back-end

Required environment variables:

Required environment variables:

- BACK_END_OWNER_PRIVATE_KEY
- BACK_END_CONNECTION_STRING
- BACK_END_PORT
- VUE_APP_AWS_REGION
- VUE_APP_USER_POOL_ID
- VUE_APP_USER_POOL_WEBCLIENT_ID
- VUE_APP_INFURA_URL

For starting application locally setup `.env` file with a set of required variables(see above) and run: 

```
yarn install && yarn start
```
Running tests:
```
yarn install && yarn test
```

### Deploy using Travis CI

Required environment variables (except of specified above):

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- FRONT_END_S3_BUCKET

### TODO
#### Must have
1. Validation front
2. Validation back
3. data - image view (profile, voting-details)

#### Be good to have
1. Sockets
2. Storing only publicKey in user join request and then filtering only by that
3. Cascade deleting (voting -> variants/members, image, variants -> image)
4. Tests