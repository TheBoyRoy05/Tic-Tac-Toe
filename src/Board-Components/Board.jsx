import PropTypes from "prop-types";
import Square from "./Square";
import { NUM_SQUARES } from "../constants";

// Board component for the entire board
export default function Board({ xIsNext, board, update }) {
  // Update status
  const winner = calculateWinner(board);
  const status = winner
    ? "Winner: " + winner
    : "Next player: " + (xIsNext ? "X" : "O");

  function handleClick(rowIndex, columnIndex) {
    // Validate the click
    if (winner || board[rowIndex][columnIndex]) return;

    // Update board
    const newBoard = board.map((row) => row.slice());
    newBoard[rowIndex][columnIndex] = xIsNext ? "X" : "O";
    update(newBoard);
  }

  // Render each row
  const renderRow = (row, rowIndex) => {
    return row.map((column, columnIndex) => (
      <Square
        value={board[rowIndex][columnIndex]}
        handleClick={() => handleClick(rowIndex, columnIndex)}
        key={columnIndex}
      />
    ));
  };

  // Render the board
  const renderBoard = board.map((row, rowIndex) => {
    return (
      <div className="board-row" key={rowIndex}>
        {renderRow(row, rowIndex)}
      </div>
    );
  });

  // Render the board and status
  return (
    <div className="game-board">
      <div className="status">{status}</div>
      <div className="board">{renderBoard}</div>
    </div>
  );
}

// Prop Validation for Board component
Board.propTypes = {
  xIsNext: PropTypes.bool.isRequired,
  board: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  ).isRequired,
  update: PropTypes.func.isRequired,
};

// Returns the winner if there is one, or null if there isn't
function calculateWinner(board) {
  // Check all rows for a win
  for (const row of board) {
    if (row[0] && row.every((elem) => elem === row[0])) return row[0];
  }

  // Check all columns for a win
  const transpose = (matrix) =>
    matrix[0].map((col, i) => matrix.map((row) => row[i]));
  for (const col of transpose(board)) {
    if (col[0] && col.every((elem) => elem === col[0])) return col[0];
  }

  // Check both diagonals for a win
  const diagonal1 = [];
  const diagonal2 = [];
  for (let i = 0; i < NUM_SQUARES; i++) {
    diagonal1.push(board[i][i]);
    diagonal2.push(board[NUM_SQUARES - i - 1][i]);
  }
  if (diagonal1[0] && diagonal1.every((elem) => elem === diagonal1[0]))
    return diagonal1[0];
  if (diagonal2[0] && diagonal2.every((elem) => elem === diagonal2[0]))
    return diagonal2[0];

  return null;
}
