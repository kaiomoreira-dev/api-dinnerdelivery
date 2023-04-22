import { Users } from "@modules/accounts/infra/typeorm/entities/Users";
import { DataSource } from "typeorm";

import { CreateUsers1681917942698 } from "./migrations/1681917942698-CreateUsers";

const dataSource = new DataSource({
  type: "postgres",
  port: 1999,
  username: "docker",
  password: "YWfv44186uG6oBetxJC7sOAxJttd6aLe0zpmb_xdwpQ",
  database:
    process.env.NODE_ENV === "test" ? "dinnerdelivery_test" : "dinnerDelivery",

  // importar entidades ex: [Recipes]
  entities: [Users],
  // importar migrations ex: [CreateRecipes102348998]
  migrations: [CreateUsers1681917942698],
});

export function createConnection(host = "localhost"): Promise<DataSource> {
  return dataSource.setOptions({ host }).initialize();
}

export default dataSource;
