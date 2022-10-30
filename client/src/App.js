import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavBar from './components/navbar';
import Home from './components/home';
import UserPage from './components/userPage';
import SignInPage from './components/signInPage';
import SignUpPage from './components/signUpPage';
import SearchTab from './components/searchTab';
import ErrorPage from './components/errorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<NavBar />}>
          <Route path='user' element={<UserPage />}/>
          <Route path='/' element={<SearchTab />}>
            <Route index element={<Home />} />
            <Route path='search' element={<h1>search</h1>} />
            <Route path='book' element={<h1>book</h1>} />
          </Route>
        </Route>
        <Route path='signin' element={<SignInPage />}/>
        <Route path='signup' element={<SignUpPage />}/>
        <Route path='*' element={<ErrorPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
