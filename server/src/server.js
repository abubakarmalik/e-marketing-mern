const app = require('./app');
const connection = require('../config/connection');
const env = require('../config/env');

(async () => {
  await connection();
  app.listen(env.PORT, () =>
    console.log(`🚀 Server running at http://localhost:${env.PORT}`),
  );
})();
