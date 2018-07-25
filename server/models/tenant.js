'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tenant = sequelize.define('Tenant', {
    fullName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    alias: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });
  Tenant.associate = (models) => {
    Tenant.hasMany(models.Todo, {
      foreignKey: 'tenantId'
    })
  };
  return Tenant;
};