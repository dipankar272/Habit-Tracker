const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const findAllByUser = (userId) =>
  db.get('habits').filter({ userId }).value();

const findById = (id) =>
  db.get('habits').find({ id }).value();

const create = ({ name, userId, category }) => {
  const habit = {
    id: uuidv4(),
    name,
    category: category || 'General',
    progressLog: [],
    completed: false,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    streak: 0,
  };
  db.get('habits').push(habit).write();
  return habit;
};

const update = (id, fields) => {
  db.get('habits').find({ id }).assign(fields).write();
  return findById(id);
};

const resetCompleted = (userId) => {
  db.get('habits')
    .filter({ userId, completed: true })
    .each((h) => {
      h.completed = false;
    })
    .value();
  db.write();
};

const deleteById = (id) => {
  const habit = findById(id);
  if (!habit) return false;
  db.get('habits').remove({ id }).write();
  return true;
};

module.exports = { findAllByUser, findById, create, update, resetCompleted, deleteById };