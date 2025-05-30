import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import MarketingManagerRegister from './Pages/MarketingManager/MarketingManagerRegister';
import Login from './Pages/Login/Login';
import AddNewLead from './Pages/AddNewLead';
import DailyReminder from './Pages/DailyReminder';
import Settings from './Pages/Settings';
// import Header from './components/Header/Header';
// import React from 'react';

const App = () => {
  return (
    <>

      <Router>
        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/marketing-manager/register' element={<MarketingManagerRegister />} />
          <Route path='/login' element={<Login />} />
          <Route path='/AddNewLead' element={<AddNewLead />} />
          <Route path='/DailyReminder' element={<DailyReminder />} />
          <Route path='/Settings' element={<Settings />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
