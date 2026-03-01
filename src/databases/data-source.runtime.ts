import { DataSource, type DataSourceOptions } from "typeorm";
import sqliteParams from "./sqlite-params";
// import * as entities from "./entities";
// import * as migrations from "./migrations";

// Author Database Name
const dbName = "react-sqlite";

const dataSourceConfig: DataSourceOptions = {
  name: "DBConnection",
  type: "capacitor",
  driver: sqliteParams.connection,
  database: dbName,
  mode: "no-encryption",
  // entities: entities,
  // migrations: migrations, //["../migrations/author/*{.ts,.js}"]
  entities: ["./src/databases/entities/*.ts"],
  migrations: ["./src/databases/migrations/*.ts"],
  subscribers: [],
  logging: [/*'query',*/ "error", "schema"],
  synchronize: true, // !!!You will lose all data in database if set to `true`
  migrationsRun: false,
};
export const dtSource = new DataSource(dataSourceConfig);

const dbSource = {
  dataSource: dtSource,
  dbName: dbName,
};

export default dbSource;
