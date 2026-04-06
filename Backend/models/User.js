const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const findByEmail = (email) =>
  db.get('users').find({ email }).value();

const findById = (id) => {
  const user = db.get('users').find({ id }).value();
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

const findByIdWithPassword = (id) =>
  db.get('users').find({ id }).value();

const createUser = ({ username, email, password }) => {
  const user = { id: uuidv4(), username, email, password };
  db.get('users').push(user).write();
  const { password: _, ...rest } = user;
  return rest;
};

module.exports = { findByEmail, findById, findByIdWithPassword, createUser };