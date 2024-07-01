import { useState } from "react";
import "./styles.css";

const BOARD_SIZE = 3;

function Square({ value, handleClick }) {
  return (
    <button className="square" onClick={handleClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, board, update }) {
  function handleClick(rowIndex, columnIndex) {
    if (calculateWinner(board) || board[rowIndex][columnIndex]) return;
    const newBoard = board.map((row) => row.slice());
    newBoard[rowIndex][columnIndex] = xIsNext ? "X" : "O";
    update(newBoard);
  }

  const winner = calculateWinner(board);
  const status = winner
    ? "Winner: " + winner
    : "Next player: " + (xIsNext ? "X" : "O");

  const renderSquares = (row, rowIndex) => {
    return row.map((column, columnIndex) => (
      <Square
        value={board[rowIndex][columnIndex]}
        handleClick={() => handleClick(rowIndex, columnIndex)}
        key={columnIndex}
      />
    ));
  };

  const renderRows = board.map((row, rowIndex) => {
    return (
      <div className="board-row" key={rowIndex}>
        {renderSquares(row, rowIndex)}
      </div>
    );
  });

  return (
    <div className="game-board">
      <div className="status">{status}</div>
      <div className="board">{renderRows}</div>
    </div>
  );
}

export default function App() {
  const initBoard = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => "")
  );
  const [history, setHistory] = useState([initBoard]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const board = history[currentMove];

  function update(newBoard) {
    const newHistory = [...history.slice(0, currentMove + 1), newBoard];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  const moves = history.map((board, move) => {
    const description = "Go to " + (move > 0 ? "move #" + move : "game start");
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <Board xIsNext={xIsNext} board={board} update={update} />
      <div className="game-info">
        <ol className="moves">{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(board) {
  // Check all rows for a win
  for (const row of board) {
    if (row.every((elem) => elem === row[0])) return row[0];
  }

  // Check all columns for a win
  const transpose = (matrix) =>
    matrix[0].map((col, i) => matrix.map((row) => row[i]));
  for (const col of transpose(board)) {
    if (col.every((elem) => elem === col[0])) return col[0];
  }

  // Check both diagonals for a win
  const primaryDiagonal = [];
  const secondaryDiagonal = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    primaryDiagonal.push(board[i][i]);
    secondaryDiagonal.push(board[BOARD_SIZE - i - 1][i]);
  }
  if (primaryDiagonal.every((elem) => elem === primaryDiagonal[0]))
    return primaryDiagonal[0];
  if (secondaryDiagonal.every((elem) => elem === secondaryDiagonal[0]))
    return secondaryDiagonal[0];

  return null;
}
