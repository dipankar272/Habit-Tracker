const Habit = require('../models/Habit');

let lastResetDate = null;

const getHabits = (req, res) => {
  try {
    const currentDate = new Date().toLocaleDateString();

    if (lastResetDate !== currentDate) {
      Habit.resetCompleted(req.user.id);
      lastResetDate = currentDate;
    }

    const habits = Habit.findAllByUser(req.user.id);
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving habits', error: error.message });
  }
};

const createHabit = (req, res) => {
  const { name, category } = req.body;

  try {
    const createdHabit = Habit.create({ name, userId: req.user.id, category });
    res.status(201).json({ message: 'Success', data: createdHabit });
  } catch (error) {
    res.status(400).json({ message: 'Error creating habit', error: error.message });
  }
};

const updateHabit = (req, res) => {
  const { name, progress, completed } = req.body;

  try {
    const habit = Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (habit.completed) {
      return res.status(400).json({ message: 'Habit is already completed and cannot be updated' });
    }

    const newProgressEntry = {
      date: new Date().toISOString().split('T')[0],
      progress,
    };

    const updatedProgressLog = [...habit.progressLog, newProgressEntry];

    let newCompleted = habit.completed;
    let newStreak = habit.streak;

    if (completed === true) {
      newCompleted = true;
      newStreak += 1;
    } else {
      newCompleted = progress === 100;
    }

    const updatedHabit = Habit.update(req.params.id, {
      name: name || habit.name,
      completed: newCompleted,
      streak: newStreak,
      progressLog: updatedProgressLog,
      updatedAt: new Date().toISOString(),
    });

    res.json({ message: 'Success', data: updatedHabit });
  } catch (error) {
    res.status(400).json({ message: 'Error updating habit', error: error.message });
  }
};

const deleteHabit = (req, res) => {
  const { id } = req.params;

  try {
    const deleted = Habit.deleteById(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHabitById = (req, res) => {
  const { id } = req.params;

  try {
    const habit = Habit.findById(id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (habit.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving habit', error: error.message });
  }
};

module.exports = { getHabits, createHabit, updateHabit, deleteHabit, getHabitById };
