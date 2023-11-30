import 'reflect-metadata';

import { Environment } from './environment';
import { createExpressServer } from 'routing-controllers';
import { DatabaseInstanceStrategy } from './database';
import * as SwaggerUI from 'swagger-ui-express';
import * as SwaggerJson from '../swagger.json';

const app = createExpressServer({
	routePrefix: '/api/v1',
	controllers: [`${__dirname}/controllers/*.controller.*`],
	validation: true,
	classTransformer: true,
	defaultErrorHandler: true,
	cors: true,
});

if (!Environment.db_type) {
	throw new Error(
		'DB type is not defined -- please set DB_TYPE in .env. Allowed values: mongo, postgres',
	);
}

DatabaseInstanceStrategy.setInstanceByEnv(Environment.db_type);

if (Environment.swagger_enabled == true) {
	console.log(`Serving swagger specs on '/api-docs' endpoint`);
	app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(SwaggerJson));
}

app.listen(Environment.port, () => {
	console.log(`Running at http://localhost:${Environment.port}`);
});

export default app;
