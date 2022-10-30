import React, { Component } from 'react'
import { Link, useLocation } from 'react-router-dom';
import userIcon from '../images/circle-user-solid.svg';

const UserContainer = (props) => {
  const location = useLocation();
  return ( 
    <div className="userContainer">
      {
      location.pathname === '/user'
      ? null
      : props.loggedIn 
        ? <React.Fragment>
              <Link to='user' className='btn user'>
                <img src={userIcon} alt="user Icon" className='userIcon'/>
                {props.username}
              </Link>
            </React.Fragment>
        : <React.Fragment>
            <Link to="signin" className='btn sign'>Sign In</Link>
            <Link to="signup" className='btn sign'>Sign up</Link>
          </React.Fragment>
      }
    </div>
  );
}
 
export default UserContainer;