import dotenv from "dotenv";
import {dbAccessInfo} from "../config.js";

dotenv.config();

const sequelize = (process.env.NODE_ENV === 'production') ? dbAccessInfo.real : dbAccessInfo.test;

export async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}
export default sequelize;