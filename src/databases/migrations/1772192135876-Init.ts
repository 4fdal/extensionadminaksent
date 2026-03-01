import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1772192135876 implements MigrationInterface {
    name = 'Init1772192135876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "paymentcustomers" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "nolayanan" varchar NOT NULL, "invoice" varchar NOT NULL, "tanggalbayar" varchar NOT NULL, "waktubayar" varchar NOT NULL, "gambar" varchar NOT NULL, "create_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "paymentcustomers"`);
    }

}
