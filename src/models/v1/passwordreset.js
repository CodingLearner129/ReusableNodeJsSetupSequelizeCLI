'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PasswordReset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PasswordReset.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    expired_at: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    reset_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    reset_requested_at: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'PasswordReset',
    tableName: 'PasswordResets',
    timestamps: false,
  });
  return PasswordReset;
};