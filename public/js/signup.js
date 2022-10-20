// Event listener
document.getElementById("signupForm").addEventListener('submit', validateAndPost);

function validateAndPost(e) {
  // prevents it from submiting to a file
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
      if(!res.ok) return reject(alert('error'))
      return resolve(alert('Login successful'));
    })
    .then(window.location.assign(`http://localhost:5000/user/login`))
}

