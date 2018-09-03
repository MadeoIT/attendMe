'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserInfo = sequelize.define('UserInfo', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userName: DataTypes.STRING
  }, {});
  UserInfo.associate = function(models) {
    UserInfo.belongsTo(models.Tenant, {
      foreignKey: 'tenantId'
    });
    UserInfo.belongsTo(models.Employee, {
      foreignKey: 'employeeId'
    });
  };
  return UserInfo;
};