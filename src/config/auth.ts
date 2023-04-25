import "dotenv/config";

export default {
  secret_token: process.env.SECRET_TOKEN,
  expire_in_token: process.env.EXPIRE_IN_TOKEN,
  secret_refresh_token: process.env.SECRET_REFRESH_TOKEN,
  expire_refresh_token: process.env.EXPIRE_REFRESH_TOKEN,
  days_refresh_token: Number(process.env.DAYS_REFRESH_TOKEN),
};
