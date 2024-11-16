const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

let solver = new Solver();

suite('Unit Tests', () => {
     test('Logic handles a valid puzzle string of 81 characters', () => {
          const puzzle = puzzlesAndSolutions[0][0];
          assert.equal(solver.validate(puzzle), true);
     });

     test('Logic handles a puzzle string with invalid characters', () => {
          const puzzle = '1.5..2.84..63.12.7.2..5....abc..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
          assert.deepEqual(solver.validate(puzzle), { error: 'Invalid characters in puzzle' });
     });

     test('Logic handles a puzzle string that is not 81 characters in length', () => {
          const puzzle = '1.5..2.84..63.12.7.2..5....9..1...8.2.3674.3.7.2..9.47...8..1..16.';
          assert.deepEqual(solver.validate(puzzle), { error: 'Expected puzzle to be 81 characters long' });
     });

     test('Logic correctly identifies a valid row placement', () => {
          const puzzle = puzzlesAndSolutions[0][0];
          assert.isTrue(solver.checkRowPlacement(puzzle, 'A', '3', '3'));
     });

     test('Logic correctly identifies an invalid row placement', () => {
          const puzzle = puzzlesAndSolutions[0][0];
          assert.isFalse(solver.checkRowPlacement(puzzle, 'A', '3', '1'));
     });

     test('Logic correctly identifies a valid column placement', () => {
          const puzzle = puzzlesAndSolutions[0][0];
          assert.isTrue(solver.checkColPlacement(puzzle, 'A', '3', '3'));
     });

     test('Logic correctly identifies an invalid column placement', () => {
          const puzzle = puzzlesAndSolutions[0][0];
          assert.isFalse(solver.checkColPlacement(puzzle, 'A', '3', '8'));
     });

     test('Logic correctly identifies a valid region placement', () => {
          const puzzle = puzzlesAndSolutions[0][0];
          assert.isTrue(solver.checkRegionPlacement(puzzle, 'A', '3', '3'));
     });

     test('Logic correctly identifies an invalid region placement', () => {
          const puzzle = puzzlesAndSolutions[0][0];
          assert.isFalse(solver.checkRegionPlacement(puzzle, 'A', '3', '9'));
     });

     test('Valid puzzle strings pass the solver', () => {
          const puzzle = puzzlesAndSolutions[0][0];
          const solution = puzzlesAndSolutions[0][1];
          assert.equal(solver.solve(puzzle), solution);
     });

     test('Invalid puzzles fail the solver', () => {
          const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'; // Missing one character
          assert.isNull(solver.solve(invalidPuzzle));
     });
});
