import PropTypes from "prop-types";

// Square component for each cell
function Square({ value, squareClick }) {
  return (
    <button className="square" onClick={squareClick}>
      <p className={value}>{value}</p>
    </button>
  );
}

// Prop validation for Square component
Square.propTypes = {
  value: PropTypes.string.isRequired,
  squareClick: PropTypes.func.isRequired,
};


// Board component for the entire board
export default function Board({ board, squareClick }) {
  // Render each row
  const renderRow = (row, rowIndex) => {
    return row.map((column, columnIndex) => (
      <Square
        value={board[rowIndex][columnIndex]}
        squareClick={() => squareClick(rowIndex, columnIndex)}
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
  return <div className="board">{renderBoard}</div>;
}

// Prop Validation for Board component
Board.propTypes = {
  board: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  ).isRequired,
  squareClick: PropTypes.func.isRequired,
};
