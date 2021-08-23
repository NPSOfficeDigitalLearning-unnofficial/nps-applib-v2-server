import Sequelize, { DataTypes } from "sequelize";
import { sequelize } from "../sequelize";

class User extends Sequelize.Model {}
User.init({
    id: { type: DataTypes.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    hashedpass: { type: DataTypes.STRING, allowNull: false }
},{
    sequelize
});
User.sync();

export default User;
