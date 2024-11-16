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

  // Check for missing fields
  if (!puzzle || !coordinate || !value) {
    return res.json({ error: 'Required field(s) missing' });
  }

  // Validate the puzzle string
  const validation = solver.validate(puzzle);
  if (validation !== true) {
    return res.json(validation);
  }

  // Validate the coordinate format
  if (!/^[A-I][1-9]$/.test(coordinate)) {
    return res.json({ error: 'Invalid coordinate' });
  }

  // Validate the value format
  if (!/^[1-9]$/.test(value)) {
    return res.json({ error: 'Invalid value' });
  }

  // Convert row and column from coordinate
  const row = coordinate[0]; // Letter (A-I)
  const column = parseInt(coordinate[1], 10); // Number (1-9)
  const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0); // Convert A-I to 0-8
  const colIndex = column - 1; // Convert 1-9 to 0-8

  // Check if the value is already placed at the given coordinate
  const puzzleArray = puzzle.split('');
  const currentValue = puzzleArray[rowIndex * 9 + colIndex];
  if (currentValue === value) {
    return res.json({ valid: true });
  }

  // Perform row, column, and region placement checks
  const isRowValid = solver.checkRowPlacement(puzzle, row, column, value);
  const isColValid = solver.checkColPlacement(puzzle, row, column, value);
  const isRegionValid = solver.checkRegionPlacement(puzzle, row, column, value);

  // Gather conflicts if any
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
