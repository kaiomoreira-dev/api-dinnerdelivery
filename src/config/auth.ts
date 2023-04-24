import "dotenv/config";

export default {
  secret_token: process.env.SECRET_TOKEN,
  expire_in_token: process.env.EXPIRE_IN_TOKEN,
  //   secret_refresh_token: "4537f8e0a1134a4722aeaa326a05446964ca56d0",
  //   expire_in_refresh_token: "30d",
  //   expire_days_refresh_token: 30,
};
