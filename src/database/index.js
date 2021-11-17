const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: 'ec2-54-73-110-26.eu-west-1.compute.amazonaws.com',
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
