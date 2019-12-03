const CognitoExpress = require('cognito-express');

const {
  VUE_APP_AWS_REGION,
  VUE_APP_USER_POOL_ID,
  VUE_APP_USER_POOL_WEBCLIENT_ID
} = process.env;

const cognitoExpress = new CognitoExpress({
  region: VUE_APP_AWS_REGION,
  cognitoUserPoolId: VUE_APP_USER_POOL_ID,
  userPoolWebClientId: VUE_APP_USER_POOL_WEBCLIENT_ID,
  tokenUse: 'access',
  tokenExpiration: 2592000000
});

const middleware = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: 'Access token missing from header!' });
  }

  await new Promise((resolve) =>
    cognitoExpress.validate(token, (err, response) => {
      if (err) {
        return res.status(401).send({ message: err.message || err });
      }
      req.userId = response.sub;
      resolve();
    })
  );
  next();
};

module.exports = { middleware };
