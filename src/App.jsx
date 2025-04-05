import React from 'react'
import './index.css';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import EventSection from './components/EventSection';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateEvent from './pages/CreateEvent';
import TrendingTable from './components/TrendingTable';
import { ethers } from 'ethers';




const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Navbar/>
              <TrendingTable/>
              <EventSection/>
              <Footer />
            </>
          } />
          <Route path="/create" element={<CreateEvent />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
