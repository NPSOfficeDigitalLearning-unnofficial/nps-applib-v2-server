import Sequelize, { DataTypes } from "sequelize";
import { sequelize } from "../sequelize";

class Admin extends Sequelize.Model {}
Admin.init({
    id: { type: DataTypes.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    hashedpass: { type: DataTypes.STRING, allowNull: false }
},{
    sequelize
});
Admin.sync();

export default Admin;
