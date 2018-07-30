'use strict';
module.exports = (sequelize, DataTypes) => {
  var Todo = sequelize.define('Todo', {
    content: DataTypes.STRING,
    completed: {
      type: DataTypes.BOOLEAN,
      default: false
    }
  });
  Todo.associate = (models) => {
    Todo.belongsTo(models.Tenant, {
      foreignKey: 'tenantId',
      onDelete: 'CASCADE'
    })
  };
  return Todo;
};