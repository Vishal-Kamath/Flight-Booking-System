import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const handleSignIn = (e, navigate) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // check for emtpy inputs
  if ( !username  || !password )
  return alert('Fill all the details');



  // POST
  fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: {
      // 'Accept': 'application/json, text/plain, */*', Causes error
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then((res) => {
      if (res.status === 400) return alert('Check username and password');
      return res.json();
    })
    .then(data => {

      let accessExpireDate = new Date()
      accessExpireDate.setMonth(accessExpireDate.getMonth() + 1)
      accessExpireDate.toISOString();

      // let refreshExpireDate = new Date()
      // refreshExpireDate.setFullYear(refreshExpireDate.getFullYear() + 1)
      // refreshExpireDate.toISOString;

      document.cookie = `accessToken=${data.accessToken}; path=/; expires=${accessExpireDate}`
      // document.cookie = `refreshToken=${data.refreshToken}; path=/; expires=${refreshExpireDate}`

      // Redirect
      navigate('/');
    })
    .catch(err => {
      console.log(err)
    })
}

const SignInPage = () => {
  const navigate = useNavigate();
  return (
    <div className='signPage'>
      <div className="signContainer">
        <Link 
          to='/' 
          className='logo' 
          style={{color: 'hsl(0, 0%, 0%)'}}>
            <span style={{color: 'hsl(200, 100%, 50%)'}}>Air</span>Easy
        </Link>
        <form id="signinForm" className='signForm'>
          <div className="formGroup">
            <input className='formInput' type="text" name="username" id="username" placeholder=' '/>
            <label className='formLabel' htmlFor='username'>Username</label>
          </div>

          <div className="formGroup">
            <input className='formInput' type="password" name="password" id="password" placeholder=' '/>
            <label className='formLabel' htmlFor='password'>Password</label>
          </div>

          <input type="reset" value="reset" className='btn'/>
          <input type="submit" value="submit" className='btn' onClick={(e) => handleSignIn(e, navigate)}/>
        </form>
      </div>

      <div className="signContainer">
        <p>Don't have an account <Link to="/signup">Sign up</Link> here</p> 
      </div>
    </div>
  );
}
 
export default SignInPage;