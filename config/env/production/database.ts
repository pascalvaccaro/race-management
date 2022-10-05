import { parse } from "pg-connection-string";

export default ({ env }) => {
  const config = parse(process.env.DATABASE_URL);
  return {
    connection: {
      client: "postgres",
      connection: {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password,
        ssl: {
          rejectUnauthorized: false,
        },
      },
      debug: false,
    },
  };
};
