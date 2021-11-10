import Sequelize, { DataTypes, Optional } from "sequelize";
import { APPROVAL_STATUSES, GRADE_LEVELS, PLATFORMS, PRIVACY_STATUSES, SUBJECTS } from "../../data/app/appdata-enums";
import AppDataInit from "../../data/app/AppDataInit";
import { sequelize } from "../sequelize";

type AppDataStruct = AppDataInit;

// This is here to type-merge the AppDataStruct into user.
interface App extends AppDataStruct {
    /**this does nothing and is here to make typescript shut up about duplicate types*/
    _doesnothingignorethis:never;
}
class App extends Sequelize.Model<AppDataStruct,Optional<AppDataStruct,"id">> {}
App.init({
    id: { type: DataTypes.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING },
    embed: { type: DataTypes.STRING },
    approval: { type: DataTypes.ENUM(...APPROVAL_STATUSES), defaultValue: APPROVAL_STATUSES[0], allowNull: false },
    privacy: { type: DataTypes.ENUM(...PRIVACY_STATUSES), defaultValue: PRIVACY_STATUSES[0], allowNull: false },
    platforms: { type: DataTypes.ARRAY(DataTypes.ENUM(...PLATFORMS)), defaultValue: [], allowNull: false },
    grades: { type: DataTypes.ARRAY(DataTypes.ENUM(...GRADE_LEVELS)), defaultValue: [], allowNull: false },
    subjects: { type: DataTypes.ARRAY(DataTypes.ENUM(...SUBJECTS)), defaultValue: [], allowNull: false }
},{
    sequelize
});
App.sync();

export default App;
