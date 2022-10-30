import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const handleSignup = (e, navigate) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const mobNo = document.getElementById('mobNo').value;
  
  // check for emtpy inputs
  if ( !username  || !password || !confirmPassword || !name || !email || !mobNo)
  return alert('Fill all the details');
  
  // check username atleast 6
  if ( username.length < 6) 
  return alert('Username should aleast be 6 character')
  
  // check passwords are same
  if (!(password === confirmPassword)) 
  return alert('both passwords dont match');
  
  // POST
  fetch('http://localhost:5000/api/signup', {
    method: 'POST',
    headers: {
      // 'Accept': 'application/json, text/plain, */*', Causes error
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password,
      name: name,
      email: email,
      mobNo: mobNo
    })
  })
    .then(res => {
      if(!res.ok) return alert('error');
    })
    alert('success')
    navigate('/signin');
}

const SignUpPage = () => {
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
        <form id="signupForm"  className='signForm'>
          <div className="formGroup">  
            <input className='formInput' type="text" name="username" id="username" placeholder=' ' />
            <label htmlFor="username" className='formLabel'>Username</label>
          </div>

          <div className="formGroup">  
            <input className='formInput' type="password" name="password" id="password" placeholder=' ' />
            <label htmlFor="password" className='formLabel'>Password</label>
          </div>

          <div className="formGroup">  
            <input className='formInput' type="password" name="confirmPassword" id="confirmPassword" placeholder=' ' />
            <label htmlFor="confirmPassword" className='formLabel'>Confirm Password</label>
          </div>

          <div className="formGroup">  
            <input className='formInput' type="text" name="name" id="name" placeholder=' ' />
            <label htmlFor="name" className='formLabel'>Name</label>
          </div>

          <div className="formGroup">  
            <input className='formInput' type="email" name="email" id="email" placeholder=' ' />
            <label htmlFor="email" className='formLabel'>Email</label>
          </div>

          <div className="formGroup">  
            <input className='formInput' type="number" name="mobNo" id="mobNo" placeholder=' ' />
            <label htmlFor="mobNo" className='formLabel'>Mobile Number</label>
          </div>

          <input type="reset" value="reset" className='btn'/>
          <input type="submit" value="submit" className='btn' onClick={(e) => handleSignup(e, navigate)}/>
        </form>
      </div>

      <div className="signContainer">
        <p>Already have an account <Link to="/signin">Sign in</Link> here</p> 
      </div>
    </div>
  );
}
 
export default SignUpPage;