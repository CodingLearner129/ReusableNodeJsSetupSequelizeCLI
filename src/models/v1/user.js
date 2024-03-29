'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }

    // // Define getter method for fullName
    // get fullName() {
    //   return `${this.first_ame} ${this.last_ame}`;
    // }

    // // Define setter method for fullName (optional)
    // set fullName(value) {
    //   // You can implement custom logic here if needed
    //   throw new Error('Cannot set full_name directly. Use first_name and lastName.');
    // }
  }
  User.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      defaultValue: sequelize.literal('CONCAT(first_name, " ", last_name)'),
    },
    // full_name: { //set full name as virtual field
    //   type: DataTypes.VIRTUAL,
    //   get() {
    //     return `${this.first_name} ${this.last_name}`;
    //   },
    //   set(value) {
    //     throw new Error('Do not try to set the `full_name` value!');
    //   }
    //   // or you can apply getter and setter method like this
    //   get() {
    //     return this.fullName; // Call the getter method
    //   },
    //   set(value) {
    //     this.fullName = value; // Call the setter method
    //   }
    // },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    created_at: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    updated_at: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    deleted_at: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
  });
  return User;
};
