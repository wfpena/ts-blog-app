import 'reflect-metadata';

import { Environment } from './environment';
import { createExpressServer } from 'routing-controllers';
import { DatabaseInstanceStrategy } from './database';

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

//app.use(cors())
//app.use((req: any, res: any, next: any) => {
//	res.header("Access-Control-Allow-Origin", "*");
//	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//	next();
//});

const server = app.listen(Environment.port, () => {
	console.log(`Running at http://localhost:${Environment.port}`);
});

export default app;
