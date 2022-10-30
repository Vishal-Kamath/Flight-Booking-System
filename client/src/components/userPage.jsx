import React, { Component } from 'react';
import Cookies from 'js-cookie';
import userIcon from '../images/circle-user-solid.svg';
import ErrorPage from './errorPage';

const fetchCookie = () => {
  const accessToken = Cookies.get('accessToken');
  if (accessToken) return accessToken;
  return null
}

async function fetchUser(accessToken, setState) {
  const response = await fetch('http://localhost:5000/api/users/bookingDetails/?booking=true', {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + accessToken
    }
  })
  const data = await response.json();
  return data
}

class UserPage extends Component {
  state = { 
    username: '',
    name: '',
    email: '',
    mobNo: 0,
    coins: 0,
    bookings: []
  }

  async componentDidMount() {
    const accessToken = fetchCookie();
    if (!accessToken) {
      return
    }
    const data = await fetchUser(accessToken);
    const userDetails = data[0];
    const bookings = data[1]
    if (userDetails.username)
      this.setState(
        { 
          username: userDetails.username, 
          name: userDetails.name,
          email: userDetails.email,
          mobNo: userDetails.mobNo,
          coins: userDetails.coins,
          bookings: bookings
        })
  }

  logout() {
    const Confirm = window.confirm('Are you sure you want to logout');
    if (Confirm) {
      Cookies.remove('accessToken')
      this.setState({ 
        username: '',
        name: '',
        email: '',
        mobNo: 0,
        coins: 0,
        bookings: []
      });
      window.location.assign(`http://localhost:3000`);
    }
  }

  viewBooking = () => {

  } 

  render() { 
    const { username, name, email, mobNo, coins, bookings } = this.state;
    console.log(username)
    return (
      <React.Fragment>
        {
          username !== ''
          ? (<React.Fragment>
              <div className="userPageContainer">
                <div className="userTab">
                  <div className="imageContainer">
                    <img src={userIcon} alt="user Icon" className='userIconBig'/>
                  </div>
                  <div className="userPageDetails">
                    <div className="username">{ username }</div>
                    <table className='detailsTable'>
                      <tr>
                        <td>Name:</td>
                        <td>{ name }</td>
                      </tr>
                      <tr>
                        <td>Email</td>
                        <td>{ email }</td>
                      </tr>
                      <tr>
                        <td>Mobile Number:</td>
                        <td>{ mobNo }</td>
                      </tr>
                      <tr>
                        <td>Coins:</td>
                        <td>{ coins }	&#129689;</td>
                      </tr>
                    </table>
                    <button className="btn logout" onClick={() => {this.logout()}}>Logout</button>
                  </div>
                </div>
                {
                  bookings.map(booking => (
                    <div className="booking">
                      <div className="sourceToDestinationContainer">
                        <div className="sourceContainer">
                          <div className="starttime">{new Date(booking.startDateTime).getHours()}:{new Date(booking.startDateTime).getMinutes()}</div>
                          <div className="startdate">{booking.startDateTime.split('T')[0]}</div>
                          <div className="source">{booking.source}</div>
                        </div>

                        <div className="to">
                          To
                        </div>
                        
                        <div className="destinationContainer">
                          <div className="endtime">{new Date(booking.endDateTime).getHours()}:{new Date(booking.endDateTime).getMinutes()}</div>
                          <div className="enddate">{booking.endDateTime.split('T')[0]}</div>
                          <div className="destination">{booking.destination}</div>
                        </div>
                      </div>

                      <button className='btn view' onClick={() => {this.viewBooking()}}>View</button>
                    </div>
                  ))
                }
              </div>
            </React.Fragment>)
          : <ErrorPage />
        }
      </React.Fragment>
    );
  }
}
 
export default UserPage;
