'use strict';

const express = require('express');
const router = express.Router();
const SudokuSolver = require('../controllers/sudoku-solver');

const solver = new SudokuSolver();

// Route to solve a Sudoku puzzle
router.post('/solve', (req, res) => {
  const { puzzle } = req.body;

  const validation = solver.validate(puzzle);
  if (validation !== true) {
    return res.json(validation);
  }

  const solution = solver.solve(puzzle);
  if (!solution) {
    return res.json({ error: 'Puzzle cannot be solved' });
  }

  res.json({ solution });
});

// Route to check placement
router.post('/check', (req, res) => {
  const { puzzle, coordinate, value } = req.body;

  if (!puzzle || !coordinate || !value) {
    return res.json({ error: 'Required field(s) missing' });
  }

  const validation = solver.validate(puzzle);
  if (validation !== true) {
    return res.json(validation);
  }

  if (!/^[A-I][1-9]$/.test(coordinate)) {
    return res.json({ error: 'Invalid coordinate' });
  }

  if (!/^[1-9]$/.test(value)) {
    return res.json({ error: 'Invalid value' });
  }

  const row = coordinate[0];
  const column = coordinate[1];

  const isRowValid = solver.checkRowPlacement(puzzle, row, column, value);
  const isColValid = solver.checkColPlacement(puzzle, row, column, value);
  const isRegionValid = solver.checkRegionPlacement(puzzle, row, column, value);

  const conflicts = [];
  if (!isRowValid) conflicts.push('row');
  if (!isColValid) conflicts.push('column');
  if (!isRegionValid) conflicts.push('region');

  res.json({
    valid: conflicts.length === 0,
    ...(conflicts.length > 0 && { conflict: conflicts }),
  });
});

module.exports = router;
