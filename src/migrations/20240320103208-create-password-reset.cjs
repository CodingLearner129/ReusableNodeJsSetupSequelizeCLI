'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PasswordResets', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      model: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      expired_at: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      reset_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      reset_requested_at: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PasswordResets');
  }
};