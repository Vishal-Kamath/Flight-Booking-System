const cookies = document.cookie.split('; ');
let accessToken = '';
let seats = [];
let passengerIndex = 0;

cookies.forEach(cookie => {
  cookiePair = cookie.split('=');
  if (cookiePair[0] === 'accessToken')
  return accessToken = cookiePair[1];
});

const display = document.getElementById('displayResults');
let tempSearch = ``;

function fetchResults() {
  const sort = document.getElementById('sort').value;
  const source = document.getElementById('source').value;
  const destination = document.getElementById('destination').value;
  const date = document.getElementById('date').value;

  if (source === destination) 
    return alert('Source and Destination cannot be the same');

  if(!date) 
    return alert('Please specify the date');

  fetch(`http://localhost:5000/api/search/?source=${source}&destination=${destination}&date=${date}`)
    .then(res => res.json()) 
    .then(data => {
      let displayResults = ``;
      data
      .sort((a,b) => {
        if(sort == 'time') {
          return a.start - b.start
        }
        if(sort == 'price') {
          return a.price - b.price
        }
      })
      .forEach(result => {
        let startTime = new Date(result.startDateTime);
        let endTime = new Date(result.endDateTime);
        let travelTime = (endTime.getHours() - startTime.getHours()) + "h " + (endTime.getMinutes() - startTime.getMinutes()) + "m";
        displayResults += `
        <p>startTime: ${startTime.toLocaleTimeString()}</p>
        <p>source: ${result.source}</p>
        <p>travel time: ${travelTime}</p>
        <p>endTime: ${endTime.toLocaleTimeString()}</p>
        <p>destination: ${result.destination}</p>
        <p>price: &#X20B9;${result.price}</p>
        <button onclick="booking('${result.flight_id}')">Book</button>
        `;
      });
      tempSearch = displayResults;
      display.innerHTML = displayResults;
    })
};

function displayTemp() {
  display.innerHTML = tempSearch;
}

function booking(flight_id) {
  seats = [];
  passengerIndex = 0;
  const passengers = document.getElementById('passengers').value; 
  for (let i = 1; i <= passengers; i++) {
    seats.push(`P${i}`);
  }

  fetch(`http://localhost:5000/api/search/?flight_id=${flight_id}`)
    .then(res => res.json()) 
    .then(data => {
      let displayResults = `
      <button onclick="displayTemp()">Back</button>
      <p>source: ${data[0].source}</p>
      <p>source airport: ${data[0].sourceAirport}</p>
      <p>startDateTime: ${data[0].startDateTime}</p>
      <p>destination: ${data[0].destination}</p>
      <p>destination airport: ${data[0].destinationAirport}</p>
      <p>endDateTime: ${data[0].startDateTime}</p>
      <p>price: ${data[0].price}</p>`;

      for(let i = 1; i <= passengers; i++) {
        displayResults += `
        <h3>Passenger ${i}</h3>
        <label for="passengerFName${i}">First & Middle Name:</label>
        <input type="text" id="passengerFName${i}">

        <label for="passengerLName${i}">Last Name:</label>
        <input type="text" id="passengerLName${i}">

        <button onclick="passengerIndex = ${i - 1}">select</button>`;

      }

      // Sorting
      const seatsArray = data[1].sort((a, b) => {
        return a.seatRow - b.seatRow || a.seatColumn.localeCompare(b.seatColumn);
      });

      displayResults += `<div class="seatContainer">`;
      seatsArray.forEach(seat => {
        let status = '';
        if (seat.status === 'Active') status = "active";
        if (seat.status === 'Booked') status = "booked";
        displayResults += `<button class="seat ${status}" id="${seat.seatRow + seat.seatColumn}" onclick="switchValue('${seat.seatRow + seat.seatColumn}')">${seat.seatRow + seat.seatColumn}</button>`;
      });
      displayResults += `</div>`;
      
      displayResults += `<button onclick="book('${passengers}', '${flight_id}')">Book</button>`;
      display.innerHTML = displayResults;
    })
}

function switchValue(buttonId) {
  let passengerNumber = passengerIndex + 1;
  if (seats[passengerIndex] !== `P${passengerNumber}`) {
    const prevButton = document.getElementById(seats[passengerIndex]);
    prevButton.innerHTML = seats[passengerIndex];
    prevButton.classList.toggle("passenger");
  }
  const currentButton = document.getElementById(buttonId);
  if(currentButton.innerHTML[0] === 'P') {
    let psgNumber = parseInt(currentButton.innerHTML[1])
    currentButton.innerHTML = seats[psgNumber - 1];
    currentButton.classList.toggle("passenger");
    seats[psgNumber - 1] = `P${psgNumber}`;
  }
  seats[passengerIndex] = currentButton.innerHTML; 
  currentButton.innerHTML = `P${(passengerNumber)}`;
  currentButton.classList.toggle("passenger");
}

async function book(passengers, flight_id) {
  const groupUUID = generateUUID();
  const successPromise = [];
  for(let i = 1; i <= passengers; i++) {
    const passengerFName = document.getElementById(`passengerFName${i}`).value;
    const passengerLName = document.getElementById(`passengerLName${i}`).value;

    if (!passengerFName || !passengerLName || seats[i - 1] === `P${i}`) 
      return alert('please fill all details');
  }

  for(let i = 1; i <= passengers; i++) {
    const passengerFName = document.getElementById(`passengerFName${i}`).value;
    const passengerLName = document.getElementById(`passengerLName${i}`).value;

    let seatRow = seats[i - 1].slice(0, -1);
    let seatColumn = seats[i - 1].slice(-1);
    console.log('loop working');
    let fetchPromise = await fetch(`http://localhost:5000/api/book/?flight_id=${flight_id}`, {
      method: 'POST',
      headers: {
        // 'Accept': 'application/json, text/plain, */*', Causes error
        "Authorization": "Bearer " + accessToken,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        groupUUID: groupUUID,
        passengerFName: passengerFName,
        passengerLName: passengerLName,
        seatRow: seatRow,
        seatColumn: seatColumn
      })
    })
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res);
        }
      })
    successPromise.push(fetchPromise);
  }
  Promise.all(successPromise)
    .then(data => {
      alert('success')
      window.location.assign(`http://localhost:5000/user`);
    })
}