import { Sequelize } from "sequelize/types";
import { DATABASE_URL } from "../env";

// Create, configure, and export the sequelize instance to use.
/** The instance of Sequelize to use. */
export const sequelize = new Sequelize(
    DATABASE_URL,
    {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        dialect: "postgres"
    }
);