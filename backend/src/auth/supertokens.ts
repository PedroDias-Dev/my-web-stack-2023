import supertokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';

supertokens.init({
  framework: 'fastify',
  supertokens: {
    connectionURI: 'http://localhost:3567'
  },
  appInfo: {
    appName: 'trpc-auth',
    apiDomain: 'http://localhost:3333',
    websiteDomain: 'http://localhost:5173',
    apiBasePath: '/api/auth',
    websiteBasePath: '/auth'
  },
  recipeList: [EmailPassword.init(), Session.init()]
});
