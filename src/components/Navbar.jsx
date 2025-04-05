
import './Navbar.css'
import logo1 from '../assets/logo1.png'
import React, { useState, useEffect } from 'react';


const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState('');

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
        <li>Home</li>
        <li><button
          onClick={connectWallet}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
        </button></li>
        <li>Winners</li>
        <li>AboutUs</li>

        <li><button className='btn'>Contact Us</button></li>

      </ul>
    </nav>
  )
}


export default Navbar
