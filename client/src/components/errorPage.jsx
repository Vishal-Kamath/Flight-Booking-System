import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return ( 
    <div className='notfound'>
      <h1>404</h1> 
      <p>Not Found</p> 
      <Link to="/" className='btn'>Back Home</Link>
    </div>
  );
}
 
export default ErrorPage;