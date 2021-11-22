module.exports = (DataTypes) => ({
  userc_id: DataTypes.INTEGER,
  userd_id: DataTypes.INTEGER,
  useru_id: DataTypes.INTEGER,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE,
});
