import { Sequelize } from "sequelize";
import dotenv from 'dotenv'

dotenv.config({ path: 'db.env' })

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, '', {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log,
})


async function testDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Panggil function testDatabaseConnection
testDatabaseConnection();

export default sequelize;