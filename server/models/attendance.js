'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    day: DataTypes.INTEGER, 
    year: DataTypes.INTEGER,
    month: DataTypes.STRING,
    startTime: DataTypes.STRING, //Added recently, TODO: put it in hooks
    finishTime: DataTypes.STRING,
    timeAttendedMinutes: Sequelize.INTEGER //Could be trasformed in a VIRTUAL field
  }, {
    hooks: {
      beforeCreate: (attendance, options) => {
        const monthArray = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ];
        const date = new Date().toISOString().split('T')[0].split('-');
        const month = Number(date[1]);
        const day = Number(date[2]);
        const year = Number(date[0]);

        attendance.month = monthArray[month];
        attendance.day = day;
        attendance.year = year;
      }
    }
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