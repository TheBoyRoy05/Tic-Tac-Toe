import PropTypes from "prop-types";
import { useState } from "react";
import { NUM_SQUARES } from "./constants";
import Board from "./Board-Components/Board";
import "./styles.css";

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

  // Update the board and add it to history
  function update(newBoard) {
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
