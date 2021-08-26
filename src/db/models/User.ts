import Sequelize, { DataTypes } from "sequelize";
import { sequelize } from "../sequelize";

interface User {
    id:string; email:string; hashedPass:string; canEdit:boolean;
}

class User extends Sequelize.Model {
}
User.init({
    id: { type: DataTypes.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false },
    hashedpass: { type: DataTypes.STRING, allowNull: false },
    canEdit: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
},{
    sequelize
});
User.sync();

export default User;
