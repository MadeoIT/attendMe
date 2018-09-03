'use strict';
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    type: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    postCode: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING
  }, {});
  Address.associate = function(models) {
    Address.belogsTo(models.Tenant, {
      foreignKey: 'tenantId'
    });
    Address.belogsTo(models.Employee, {
      foreignKey: 'employeeId'
    });
  };
  return Address;
};