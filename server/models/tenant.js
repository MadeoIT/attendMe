'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tenant = sequelize.define('Tenant', {
    isTenant: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    numberOfEmployes: {
      type: DataTypes.VIRTUAL(
        DataTypes.INTEGER, 
        '(SELECT COUNT(id) FROM employee WHERE tenantId = `tenant`.id) as numberOfEmployes'
      )
    }
  });
  Tenant.associate = (models) => {
    Tenant.hasOne(models.Identity, {
      foreignKey: 'tenantId'
    });
    Tenant.hasOne(models.UserInfo, {
      foreignKey: 'tenantId'
    });
    Tenant.hasMany(models.Employee, {
      foreignKey: 'tenantId'
    });
    Tenant.hasOne(models.Address, {
      foreignKey: 'tenantId'
    });
  };
  return Tenant;
};