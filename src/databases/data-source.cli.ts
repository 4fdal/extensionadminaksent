import "reflect-metadata";

import { DataSource } from "typeorm";

export default new DataSource({
  type: "sqlite",
  database: "./src/databases/dev.sqlite",

  entities: ["./src/databases/entities/*.ts"],
  migrations: ["./src/databases/migrations/*.ts"],

  synchronize: false,
  logging: true,
});
