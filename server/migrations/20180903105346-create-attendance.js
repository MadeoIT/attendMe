'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Attendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      day: Sequelize.INTEGER,
      year: Sequelize.INTEGER,
      month: Sequelize.STRING,
      startTime: Sequelize.ARRAY(Sequelize.INTEGER), 
      finishTime: Sequelize.ARRAY(Sequelize.INTEGER),
      timeZone: Sequelize.INTEGER,
      timeAttendedMinutes: Sequelize.INTEGER,
      tenantId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Tenants',
          key: 'id',
          as: 'tenantId'
        }
      },
      employeeId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Employees',
          key: 'id',
          as: 'employeeId'
        }
      }
    }, {
      timestamps: false
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Attendances');
  }
};