const cookies = document.cookie.split('; ');
let accessToken = '';
cookies.forEach(cookie => {
  cookiePair = cookie.split('=');
  if (cookiePair[0] === 'accessToken')
  return accessToken = cookiePair[1];
});

const userContainer = document.getElementById('userContainer');

fetch('http://localhost:5000/api/users/?select=username', {
    method: 'GET',
    headers: {
      // 'Accept': 'application/json, text/plain, */*', Causes error
      // 'Content-type': 'application/json',
      "Authorization": "Bearer " + accessToken
    }
  })
    .then(res => {
      if (!res.ok) {
        userContainer.innerHTML = `
        <a href="/user/login" onclick="alert('login before booking')">Book</a>
        <a href="/user/login">Login</a>`
        return
      }
      return res.json()
    })
    .then(data => {
      console.log(JSON.stringify(data));
      userContainer.innerHTML = `
      <a href="/search">Book</a>
      <a href="/user">${data.username}</a>`
    })