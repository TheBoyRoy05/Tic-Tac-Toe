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
  function handleClick(row, col) {
    if (calculateWinner(board) || board[row][col]) return;
    const newBoard = board.slice();
    newBoard[row][col] = xIsNext ? "X" : "O";
    update(newBoard);
  }

  const winner = calculateWinner(board);
  const status = winner
    ? "Winner: " + winner
    : "Next player: " + (xIsNext ? "X" : "O");

  const renderSquares = (row, r) => {
    return row.map((col, c) => {
      <Square value={board[r][c]} handleClick={() => handleClick(r, c)} />;
    })
  };

  const renderRows = (board) =>
    board.map((row, r) => {
      return (
        <div className="board-row" key={r}>
          {renderSquares(row, r)}
        </div>
      );
    });

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">{renderRows(board)}</div>
    </>
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
    setHistory([...history.slice(0, currentMove + 1), newBoard]);
    setCurrentMove(history.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  return <Board xIsNext={xIsNext} board={board} update={update} />;
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
  for (let i = 0; i < board.length; i++) {
    primaryDiagonal.push(board[i][i]);
    secondaryDiagonal.push(board[-1 - i][i]);
  }
  if (primaryDiagonal.every((elem) => elem === primaryDiagonal[0]))
    return primaryDiagonal[0];
  if (secondaryDiagonal.every((elem) => elem === secondaryDiagonal[0]))
    return secondaryDiagonal[0];

  return null;
}
