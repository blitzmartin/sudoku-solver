class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return { error: 'Required field missing' };
    }

    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }

    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    const rowStart = rowIndex * 9;
    for (let i = rowStart; i < rowStart + 9; i++) {
      if (puzzleString[i] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colIndex = parseInt(column) - 1;
    for (let i = colIndex; i < 81; i += 9) {
      if (puzzleString[i] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    const colIndex = parseInt(column) - 1;

    const regionRowStart = Math.floor(rowIndex / 3) * 3;
    const regionColStart = Math.floor(colIndex / 3) * 3;

    for (let r = regionRowStart; r < regionRowStart + 3; r++) {
      for (let c = regionColStart; c < regionColStart + 3; c++) {
        const cellIndex = r * 9 + c;
        if (puzzleString[cellIndex] === value) {
          return false;
        }
      }
    }

    return true;
  }

  solve(puzzleString) {
    const findEmptyCell = (puzzle) => puzzle.indexOf('.');

    const solveHelper = (puzzle) => {
      const emptyIndex = findEmptyCell(puzzle);
      if (emptyIndex === -1) return puzzle; // No empty cells, puzzle solved

      const row = Math.floor(emptyIndex / 9);
      const col = emptyIndex % 9;
      const rowChar = String.fromCharCode('A'.charCodeAt(0) + row);
      const colChar = (col + 1).toString();

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (
          this.checkRowPlacement(puzzle, rowChar, colChar, value) &&
          this.checkColPlacement(puzzle, rowChar, colChar, value) &&
          this.checkRegionPlacement(puzzle, rowChar, colChar, value)
        ) {
          const updatedPuzzle = puzzle.slice(0, emptyIndex) + value + puzzle.slice(emptyIndex + 1);
          const solved = solveHelper(updatedPuzzle);
          if (solved) return solved;
        }
      }

      return null; // Unsolvable
    };

    return solveHelper(puzzleString);
  }
}

module.exports = SudokuSolver;
