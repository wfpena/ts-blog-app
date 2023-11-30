import { PostgreStrategy } from './databases/postgres/postgres';

export class DatabaseInstanceStrategy {
	static _instance: PostgreStrategy;

	static getInstance(): any {
		return this._instance;
	}

	static async setInstanceByEnv(env: string) {
		switch (env) {
			case 'postgres':
				this._instance = new PostgreStrategy();
				break;
			default:
				throw new Error(`DB type ${env} is not supported`);
		}
	}
}
