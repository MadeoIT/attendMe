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
    Address.belongsTo(models.Tenant, {
      foreignKey: 'tenantId'
    });
    Address.belongsTo(models.Employee, {
      foreignKey: 'employeeId'
    });
  };
  return Address;
};