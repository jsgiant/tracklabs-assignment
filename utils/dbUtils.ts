const Pool = require("pg").Pool;

export const db = new Pool({
	user: "anil",
	host: "localhost",
	database: "trakinvest",
	password: "password",
	port: 5432,
});
