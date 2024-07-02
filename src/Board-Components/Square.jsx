import PropTypes from "prop-types";

// Square component for each cell
export default function Square({ value, handleClick }) {
  return (
    <button className="square" onClick={handleClick}>
      <p className={value}>{value}</p>
    </button>
  );
}

// Prop validation for Square component
Square.propTypes = {
  value: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};
