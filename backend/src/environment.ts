require('dotenv').config();

export const Environment = {
	port: process.env.PORT,
	db_type: process.env.DB_TYPE,
	run_seeds_on_startup: process.env.RUN_SEED_ON_STARTUP == 'true',
	swagger_enabled: process.env.SWAGGER_ENABLED == 'true',
};
