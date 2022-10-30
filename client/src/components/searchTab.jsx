import React, { Component } from 'react';

class SearchTab extends Component {
  state = {  } 
  render() { 
    return (
      <React.Fragment>
        <div className="searchContainer">
          <select name="source" id="source">
            <option value="" selected disabled hidden>Source</option>
            <option value="Mumbai">Mumbai</option>
            <option value="New Delhi">New Delhi</option>
            <option value="Pune">Pune</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Chennai">Chennai</option>
            <option value="Goa">Goa</option>
            <option value="Bengaluru">Bengaluru</option>
          </select>

          <select name="destination" id="destination">
            <option value="" selected disabled hidden>Destination</option>
            <option value="Mumbai">Mumbai</option>
            <option value="New Delhi">New Delhi</option>
            <option value="Pune">Pune</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Chennai">Chennai</option>
            <option value="Goa">Goa</option>
            <option value="Bengaluru">Bengaluru</option>
          </select>

          <input type="number" id="passengers" min="1" max="9" placeholder='Passengers'/>

          <input type="date" id="date"/>

          <button>Search</button>
        </div>

      </React.Fragment>
    );
  }
}
 
export default SearchTab;