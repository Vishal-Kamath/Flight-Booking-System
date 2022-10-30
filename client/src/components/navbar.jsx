import React, { Component, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import UserContainer from './userContainer';
import Cookies from 'js-cookie';


const fetchCookie = () => {
  const accessToken = Cookies.get('accessToken');
  if (accessToken) return accessToken;
  return null
}

async function fetchUser(accessToken, setState) {
  const response = await fetch('http://localhost:5000/api/users', {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + accessToken
    }
  })
  const data = await response.json();
  return data
}

class NavBar extends Component {
  state = { 
    username: '',
    loggedIn: false,
    user: ''
  } 

  async componentDidMount() {
    const accessToken = fetchCookie();
    if (!accessToken) {
      return
    }
    const data = await fetchUser(accessToken);
    if (data.username)
      this.setState({ username: data.username, loggedIn: true, user: data})
  }

  render() { 
    return (
      <React.Fragment>
        <div className="navbar">
          <div className="logo">
            <Link 
              to='/' 
              className='logo'>
                <span style={{color: 'hsl(200, 100%, 50%)'}}>Air</span>Easy
            </Link>
          </div>
          <UserContainer username={this.state.username} loggedIn={this.state.loggedIn}/>
        </div>
        <Outlet />
      </React.Fragment>
    );
  }
}
 
export default NavBar;