import React from 'react'
import './index.css';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateEvent from './pages/CreateEvent';
import TrendingTable from './components/TrendingTable';
import { ethers } from 'ethers';
import { WalletProvider } from './context/WalletContext';
// import EventsList from './components/EventList';
import Register from './pages/Register'
import NFTAndTokens from './pages/NFTAndTokens';
import MyEvents from './pages/MyEvents';


const App = () => {
  return (
    <WalletProvider>
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar/>
              <Hero />
              
              <Footer />
            </>
          } />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myevents" element={<MyEvents />} />
          <Route path="/nftandtokens" element={<NFTAndTokens />} />
        </Routes>
      </div>
    </Router>
    </WalletProvider>
  )
}

export default App
