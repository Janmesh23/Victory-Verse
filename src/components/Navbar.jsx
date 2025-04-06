
import './Navbar.css'
import logo1 from '../assets/logo1.png'
import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../context/WalletContext';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const { walletAddress, setWalletAddress } = useContext(WalletContext);


  // Check if MetaMask is already connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error('User rejected the request');
      }
    } else {
      alert('MetaMask not found. Please install it!');
    }
  };
  return (
    <nav className='container'>
      <img src={logo1} alt="" className='logo' />
      <ul>
        <li className='cursor-pointer'><Link to='/'>
            <button className="relative inline-block px-8 py-3 font-semibold rounded-xl group transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-blue-500/30 hover:shadow-xl">
              <span className="relative z-10">Home</span>
            </button>
          </Link></li>

        <li><Link to='/myevents'>
            <button className="relative inline-block px-8 py-3 font-semibold rounded-xl group transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-blue-500/30 hover:shadow-xl">
              <span className="relative z-10">My events</span>
            </button>
          </Link></li>
        <li><Link to='/nftandtokens'>
            <button className="relative inline-block px-8 py-3 font-semibold rounded-xl group transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-blue-500/30 hover:shadow-xl">
              <span className="relative z-10">NFTs & Tokens</span>
            </button>
          </Link></li>
          <li><button
          onClick={connectWallet}
          className="px-4 py-2 text-blue-400 border border-blue-500 rounded-xl group transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-blue-500/30 hover:shadow-xl"
        >
          {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
        </button></li>
        

      </ul>
    </nav>
  )
}


export default Navbar
