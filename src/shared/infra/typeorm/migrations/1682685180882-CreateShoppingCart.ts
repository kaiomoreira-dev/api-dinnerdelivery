import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateShoppingCart1682685180882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "shoppingCarts",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "id_users",
            type: "uuid",
            isNullable: true,
          },

          {
            name: "subtotal",
            type: "decimal",
            default: 0,
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
    await queryRunner.dropTable("shoppingCarts");
  }
}
