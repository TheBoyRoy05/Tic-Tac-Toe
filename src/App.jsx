import PropTypes from "prop-types";
import { useState } from "react";
import Board from "./Board";
import "./styles.css";

const NUM_SQUARES = 4;
document.documentElement.style.setProperty('--num-squares', NUM_SQUARES);

// Option button component
function Option({ text, handleClick }) {
  return (
    <button className="option" onClick={handleClick}>
      {text}
    </button>
  );
}

// Prop Validation for Option component
Option.propTypes = {
  text: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};

// Component for the entire app
export default function App() {
  // Initialize the board as a 2D array of empty strings
  const initBoard = Array.from({ length: NUM_SQUARES }, () =>
    Array.from({ length: NUM_SQUARES }, () => "")
  );

  const [history, setHistory] = useState([initBoard]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const board = history[currentMove];

  // Update status
  const winner = calculateWinner(board);
  const status = winner
    ? "Winner: " + winner
    : "Next player: " + (xIsNext ? "X" : "O");

  // Update the board and add it to history on square click event
  function squareClick(rowIndex, columnIndex) {
    // Validate the click
    if (winner || board[rowIndex][columnIndex]) return;

    // Update board
    const newBoard = board.map((row) => row.slice());
    newBoard[rowIndex][columnIndex] = xIsNext ? "X" : "O";
    
    // Update history
    const newHistory = [...history.slice(0, currentMove + 1), newBoard];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
  }

  // Restarts the game
  function Restart() {
    setHistory([initBoard]);
    setCurrentMove(0);
  }

  // Create buttons to jump to past moves
  const moves = history.map((board, move) => {
    if (move <= 0) return;
    const description = "Go to move #" + move;
    return (
      <li key={move}>
        <button className="move" onClick={() => setCurrentMove(move)}>{description}</button>
      </li>
    );
  });

  // Render the entire app
  return (
    <div className="game">
      <div className="status">{status}</div>
      <Board board={board} squareClick={squareClick} />
      <div className="game-info">
        <ol className="moves">{moves}</ol>
      </div>
      <div className="options">
        <Option text="Restart" handleClick={Restart} />
        <Option text="Time Travel" handleClick={Restart} />
      </div>
    </div>
  );
}

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