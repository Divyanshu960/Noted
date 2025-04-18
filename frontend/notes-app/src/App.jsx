import React from 'react'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp"
import { Analytics } from '@vercel/analytics/react';

const routes = (  
  <Router>
    <Routes>
      <Route path="/" exact element={<Home/>}/>
      <Route path="/login" exact element={<Login />}/>
      <Route path="/signup" exact element={<SignUp />}/>
    </Routes>
  </Router>
)


const App = () => {
  return (
    <div>
      {routes}
      <Analytics />
    </div>
  )
}

export default App