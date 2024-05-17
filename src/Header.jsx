import React from 'react';
import aybuLogo from './resources/aybulogo.png';
import Button from './Button.jsx';
import './Header.css';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/CreateSchedule');
  };

  return (
    <header>
      <center>
        <h1>ANKARA YILDIRIM BEYAZIT UNIVERSITY</h1>
      </center>
      <center>
        <h2>COMPUTER ENGINEERING</h2>
      </center>
      <center>
        <img src={aybuLogo} alt="" width="400" />
      </center>
      <nav>
        <center>
          <li>
            <Button onClick={handleClick} />
          </li>
          <li className="contributor-li">
            Contributors
            <div className="bubble">
              <p>John Doe</p>
              <p>Jane Smith</p>
            </div>
          </li>
        </center>
      </nav>
    </header>
  );
}

export default Header;