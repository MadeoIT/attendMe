'use strict';
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    isEmployee: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {});
  Employee.associate = function(models) {
    Employee.hasMany(models.Address, {
      foreignKey: 'employeeId'
    });
    Employee.hasMany(models.Attendance, {
      foreignKey: 'employeeId'
    });
    Employee.hasOne(models.UserInfo, {
      foreignKey: 'employeeId'
    });
    Employee.hasOne(models.Identity, {
      foreignKey: 'employeeId'
    });
    Employee.belongsTo(models.Tenant, {
      foreignKey: 'tenantId'
    });
  };
  return Employee;
};