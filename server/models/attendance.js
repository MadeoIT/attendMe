'use strict';
const attendanceHooks = require('./hooks/attendanceHooks')
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    day: DataTypes.INTEGER, 
    year: DataTypes.INTEGER,
    month: DataTypes.STRING,
    startTime: DataTypes.ARRAY(DataTypes.INTEGER),
    finishTime: DataTypes.ARRAY(DataTypes.INTEGER),
    timeZone: DataTypes.INTEGER,
    timeAttendedMinutes: DataTypes.INTEGER //Turned into HOUR
  }, {
    hooks: {
      beforeCreate: attendanceHooks.beforeCreateAttendance,
      beforeUpdate: attendanceHooks.beforeUpdateAttendance
    },
    timestamps: false
  });
  Attendance.associate = function (models) {
    Attendance.belongsTo(models.Employee, {
      foreignKey: 'employeeId'
    });
    Attendance.belongsTo(models.Tenant, {
      foreignKey: 'tenantId'
    });
  };
  return Attendance;
};