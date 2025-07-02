export default () => ({
  port: parseInt(process.env.PORT || "3000", 10),
  database: {
    uri:
      process.env.MONGODB_URI || "mongodb://localhost:27017/nestjs-api-key-db",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-jwt-secret-key-here",
  },
  apiKey: {
    prefix: process.env.API_KEY_PREFIX || "ak_",
  },
});
