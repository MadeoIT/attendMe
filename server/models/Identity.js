'use strict';

const identityHooks = require('./hooks/identityHooks');

module.exports = (sequelize, DataTypes) => {
  const Identity = sequelize.define('Identity', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        min: 8
      }
    },
    googleId: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    hooks: {
      beforeCreate: identityHooks.beforeCreateIdentity,
      beforeUpdate: identityHooks.beforeUpdateIdentity
    }
  });
  Identity.associate = function (models) {
    Identity.belongsTo(models.Tenant, {
      foreignKey: 'tenantId',
      onDelete: 'CASCADE'
    });
    Identity.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      onDelete: 'CASCADE'
    });
  };
  return Identity;
};