import React from 'react';
import './Button.css';

function Button({ onClick }) {
  return (
    <button className="button" onClick={onClick}>Click To Create Schedule</button>
  );
}

export default Button;