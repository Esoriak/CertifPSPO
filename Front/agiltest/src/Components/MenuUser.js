import React from 'react';
import logome from '../imgs/Logo--users-MG.png'
import {Link} from 'react-router-dom'

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

function MenuUser() {
  const [anchorEl, setAnchorEl] = React.useState(null);

 const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const Logout = () => {
    sessionStorage.clear()
    setAnchorEl(null);
  }

  return (
    <div>

<div className="logo-user" id="menu-profil" onClick={handleClick}><img src={logome}  alt="logo espace perso" className="logo-me"/></div>
      <Menu
        id="menu-profil"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Link to='/test' className="link"><MenuItem onClick={handleClose}>Quizz</MenuItem></Link>
        <Link to='/me' className="link"><MenuItem onClick={handleClose}>My account</MenuItem></Link>
        <Link to='/' className="link"><MenuItem onClick={Logout}>Logout</MenuItem></Link>
      </Menu>
    </div>
  );
}

export default MenuUser