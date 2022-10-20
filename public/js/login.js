document.getElementById("loginForm").addEventListener('submit', validateAndPost);

function validateAndPost(e) {
  // prevents it from submiting to a file
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
      accessExpireDate.toISOString;

      // let refreshExpireDate = new Date()
      // refreshExpireDate.setFullYear(refreshExpireDate.getFullYear() + 1)
      // refreshExpireDate.toISOString;

      document.cookie = `accessToken=${data.accessToken}; path=/; expires=${accessExpireDate}`
      // document.cookie = `refreshToken=${data.refreshToken}; path=/; expires=${refreshExpireDate}`

      // Redirect
      window.location.assign(`http://localhost:5000`);
    })
    .catch(err => {
      console.log(err)
    })
}