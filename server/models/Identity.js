'use strict';
module.exports = (sequelize, DataTypes) => {
  const Identity = sequelize.define('Identity', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING,
    googleId: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN,
    blocked: DataTypes.BOOLEAN
  }, {});
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