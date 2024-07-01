import { useState } from "react";
import "./styles.css";

const BOARD_SIZE = 3;

// Square component for each cell
function Square({ value, handleClick }) {
  return (
    <button className="square" onClick={handleClick}>
      <p className={value}>{value}</p>
    </button>
  );
}

// Board component for the entire board
function Board({ xIsNext, board, update }) {
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

// Option button component
function Option({ text, handleClick }) {
  return (
    <button className="option" onClick={handleClick}>
      {text}
    </button>
  );
}

// Component for the entire app
export default function App() {
  // Initialize the board as a 2D array of empty strings
  const initBoard = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => "")
  );

  const [history, setHistory] = useState([initBoard]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const board = history[currentMove];

  // Update the board and add it to history
  function update(newBoard) {
    const newHistory = [...history.slice(0, currentMove + 1), newBoard];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
  }

  // Restarts the game
  function Restart(){
    setHistory([initBoard]);
    setCurrentMove(0);
  }

  // Create buttons to jump to past moves
  const moves = history.map((board, move) => {
    if (move <= 0) return;
    const description = "Go to move #" + move;
    return (
      <li key={move}>
        <button onClick={() => setCurrentMove(move)}>{description}</button>
      </li>
    );
  });

  // Render the entire app
  return (
    <div className="game">
      <Board xIsNext={xIsNext} board={board} update={update} />
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
  for (let i = 0; i < BOARD_SIZE; i++) {
    diagonal1.push(board[i][i]);
    diagonal2.push(board[BOARD_SIZE - i - 1][i]);
  }
  if (diagonal1[0] && diagonal1.every((elem) => elem === diagonal1[0]))
    return diagonal1[0];
  if (diagonal2[0] && diagonal2.every((elem) => elem === diagonal2[0]))
    return diagonal2[0];

  return null;
}
