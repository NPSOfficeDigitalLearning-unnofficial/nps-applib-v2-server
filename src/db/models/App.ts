import Sequelize, { DataTypes } from "sequelize";
import { sequelize } from "../sequelize";

class App extends Sequelize.Model {}
App.init({
    id: { type: DataTypes.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING },
    approval: { type: DataTypes.ENUM(APPROVAL_STATUSES), defaultValue: APPROVAL_STATUSES[0], allowNull: false },
    privacy: { type: DataTypes.ENUM(PRIVACY_STATUSES), defaultValue: PRIVACY_STATUSES[0], allowNull: false },
    platforms: { type: DataTypes.ARRAY(DataTypes.ENUM(PLATFORMS)), defaultValue: [], allowNull: false },
    grades: { type: DataTypes.ARRAY(DataTypes.ENUM(GRADE_LEVELS)), defaultValue: [], allowNull: false },
    subjects: { type: DataTypes.ARRAY(DataTypes.ENUM(SUBJECTS)), defaultValue: [], allowNull: false }
},{
    sequelize
});
App.sync();

export default App;
