'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tenant = sequelize.define('Tenant', {
    googleId: DataTypes.STRING,
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
    },
    confirmed : {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    blocked : {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  Tenant.associate = (models) => {
    Tenant.hasMany(models.Todo, {
      foreignKey: 'tenantId'
    })
  };
  return Tenant;
};