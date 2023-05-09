import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductsShoppingCarts1682689664277
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "productsShoppingCarts",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },

          {
            name: "id_products",
            type: "uuid",
          },
          {
            name: "id_shoppingCarts",
            type: "uuid",
          },
          {
            name: "unit_price",
            type: "decimal",
          },
          {
            name: "quantity",
            type: "int",
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
            name: "FKProductsShoppingCarts",
            referencedTableName: "products",
            referencedColumnNames: ["id"],
            columnNames: ["id_products"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
          {
            name: "FKShoppingCartsProducts",
            referencedTableName: "shoppingCarts",
            referencedColumnNames: ["id"],
            columnNames: ["id_shoppingCarts"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("productsShoppingCarts");
  }
}
