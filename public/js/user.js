const cookies = document.cookie.split('; ');
let accessToken = '';
cookies.forEach(cookie => {
  cookiePair = cookie.split('=');
  if (cookiePair[0] === 'accessToken')
  return accessToken = cookiePair[1];
});

const userContainer = document.getElementById('userContainer');

window.addEventListener('load', fetchUser());

function fetchUser() {
  fetch('http://localhost:5000/api/users/bookingDetails/?booking=true', {
      method: 'GET',
      headers: {
        // 'Accept': 'application/json, text/plain, */*', Causes error
        // 'Content-type': 'application/json',
        "Authorization": "Bearer " + accessToken
      }
    })
      .then(res => res.json())
      .then(data => {
        const user = data[0];
        let display = `
        <p>${user.username}</p>
        <p>${user.name}</p>
        <p>${user.email}</p>
        <p>${user.mobNo}</p>
        <p>${user.coins}</p>
        <button onclick="logout()">Logout</button>`;

        const bookings = data[1];
        bookings.forEach(book => {
          display += `
          <p>${book.source}</p>
          <p>${book.destination}</p>
          <p>${book.startDateTime}</p>
          <button onclick="getBooking('${book.id}')">View</button>`;
        });
        userContainer.innerHTML = display;
  })
}

function logout() {
  document.cookie = "accessToken=; Max-Age=0"
  window.location.assign(`http://localhost:5000`);
}

function getBooking(bookingid) {
  fetch(`http://localhost:5000/api/users/bookingDetails/?bookingGroupId=${bookingid}`, {
    method: 'GET',
    headers: {
      // 'Accept': 'application/json, text/plain, */*', Causes error
      // 'Content-type': 'application/json',
      "Authorization": "Bearer " + accessToken
    }
  })
    .then(res => res.json())
    .then(data => {
      if(JSON.stringify(data) === '[]' || !data) return fetchUser();

      let display = `<button onclick="fetchUser()">Back</button>`;

      const bookings = data;
      bookings.forEach(book => {
        display += `
        <p>${book.bookingGroupId.source}</p>
        <p>${book.bookingGroupId.destination}</p>
        <p>${book.passengerFirstName}</p>
        <p>${book.passengerLastName}</p>
        <p>${book.seatRow}${book.seatColumn}</p>
        <p>${book.price}</p>
        <button onclick="cancelBooking('${book._id}')">Cancel</button>`;
      });

      userContainer.innerHTML = display;
    })
}

function cancelBooking(id) {
  fetch(`http://localhost:5000/api/users/bookingDetails/?bookingId=${id}`, {
    method: 'DELETE',
    headers: {
      // 'Accept': 'application/json, text/plain, */*', Causes error
      // 'Content-type': 'application/json',
      "Authorization": "Bearer " + accessToken
    }
  })
    .then(res => res.json())
    .then(data => {
      getBooking(data.id);
    })
}