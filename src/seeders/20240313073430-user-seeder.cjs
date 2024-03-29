'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const db = await import('../models/v1/index.js');
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);
    return await db.default.User.bulkCreate([
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'example@example.com',
        created_at: currentTimestamp,
        updated_at: currentTimestamp
      }
    ]);
  },
  
  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
    *
    * Example:
    * await queryInterface.bulkDelete('People', null, {});
    */
    const db = await import('../models/v1/index.js');
    await db.default.User.truncate();
  }
};
