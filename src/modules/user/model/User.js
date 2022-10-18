import Sequelize from "sequelize";

import sequelize from "../../../config/db/dbConfig.js";
import moment from 'moment'

const User = sequelize.define(
  "user",
  {
    id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
    name: {
			type: Sequelize.STRING,
			allowNull: false
		},
    cpf: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},
    birthDate: {
			type: Sequelize.DATE,
			allowNull: true,
		},
    email: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			},
		},
    password: {
			type: Sequelize.STRING,
			allowNull: false,
		},
  },
  {
		hooks: {
			afterCreate: (record) => {
				delete record.dataValues.password;
		},
			afterUpdate: (record) => {
				delete record.dataValues.password;
		},
		}
	}
);

export default User;