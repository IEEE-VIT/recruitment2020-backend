const Sequelize = require("sequelize");

let sequelize;
if (process.env.NODE_ENV === "development") {
  sequelize = new Sequelize(
    process.env.DB_SCHEMA,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      dialect: "postgres",
      host: "localhost",
    }
  );
}
if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}
module.exports = sequelize;
