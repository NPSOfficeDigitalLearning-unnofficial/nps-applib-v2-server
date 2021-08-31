import Sequelize, { DataTypes, Optional } from "sequelize";
import { sequelize } from "../sequelize";

type UserDataStruct = {
    id:string; email:string; hashedpass:string; iseditor:boolean;
};

// This is here to type-merge the UserDataStruct into user.
interface User extends UserDataStruct {
    /**this does nothing and is here to make typescript shut up about duplicate types*/
    _doesnothingignorethis:never;
}
class User extends Sequelize.Model<UserDataStruct,Optional<UserDataStruct,"id">> {}
User.init({
    id: { type: DataTypes.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false },
    hashedpass: { type: DataTypes.STRING, allowNull: false },
    iseditor: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
},{
    sequelize
});
User.sync();

export default User;
