import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRefreshToken1682435280583 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "refreshTokens",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "id_users",
            type: "uuid",
          },
          {
            name: "refresh_token",
            type: "varchar",
          },
          {
            name: "expire_date",
            type: "timestamp",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "FKUsers",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["id_users"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("refreshTokens");
  }
}
