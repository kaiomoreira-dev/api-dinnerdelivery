import { hash } from "bcrypt";
import { DataSource } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { createConnection } from "..";

async function create() {
  const connection: DataSource = await createConnection("localhost");

  const id = uuidv4();
  const email = "useradmin@admin.com";
  const password = await hash("adminAdmin@!", 8);

  connection.query(
    `
        INSERT INTO users(id, name, password, email, address, "admin", created_at, updated_at)
        values('${id}', 'user admin', '${password}', '${email}', 'rua test 66 99999', true, 'now()', 'now()')
    `
  );
}

create()
  .then(() => {
    console.log("User created successfully");
  })
  .catch((err) => {
    console.log(err);
  });
