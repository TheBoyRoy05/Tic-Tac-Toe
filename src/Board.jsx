import PropTypes from "prop-types";

// Square component for each cell
function Square({ value, squareClick, isMini }) {
  const prefix = isMini ? "mini-" : "";
  const token = <p className={prefix + "token " + value}>{value}</p>;
  return isMini ? (
    <div className={prefix + "square"}>{token}</div>
  ) : (
    <button className={prefix + "square"} onClick={squareClick}>
      {token}
    </button>
  );
}

// Prop validation for Square component
Square.propTypes = {
  value: PropTypes.string.isRequired,
  squareClick: PropTypes.func.isRequired,
  isMini: PropTypes.bool,
};

// Board component for the entire board
export default function Board({ board, squareClick }) {
  const className = squareClick ? "board" : "mini-board";

  // Render each row
  const renderRow = (row, rowIndex) => {
    return row.map((column, columnIndex) => (
      <Square
        value={board[rowIndex][columnIndex]}
        squareClick={
          squareClick ? () => squareClick(rowIndex, columnIndex) : () => {}
        }
        isMini={squareClick ? false : true}
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
  return <div className={className}>{renderBoard}</div>;
}

// Prop Validation for Board component
Board.propTypes = {
  board: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  ).isRequired,
  squareClick: PropTypes.func,
};
