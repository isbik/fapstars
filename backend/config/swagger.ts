// for AdonisJS v6
import path from 'node:path';
import url from 'node:url';
// ---

export default {
  // path: __dirname + "/../", for AdonisJS v5
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../', // for AdonisJS v6
  title: 'FapStars', // use info instead
  version: '1.0.0', // use info instead
  description: '', // use info instead
  tagIndex: 3,
  info: {
    title: 'FapStars',
    version: '1.0.0',
    description: '',
  },
  snakeCase: true,

  debug: false, // set to true, to get some useful debug output
  ignore: ['/swagger', '/docs', '/test/_'],
  preferredPutPatch: 'PATCH', // if PUT/PATCH are provided for the same route, prefer PUT
  common: {
    parameters: {}, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI conform headers that are commonly used
  },
  securitySchemes: {
    ApiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'X-Token',
    },
  }, // optional
  authMiddlewares: ['verifyUser'], // optional
  defaultSecurityScheme: 'ApiKeyAuth', // optional
  persistAuthorization: true, // persist authorization between reloads on the swagger page
  showFullPath: false, // the path displayed after endpoint summary
};
