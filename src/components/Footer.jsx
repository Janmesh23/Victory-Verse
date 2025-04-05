import React from 'react';
import logo1 from '../assets/logo1.png'
const Footer = () => {
  return (
    <footer className="bg-black bg-opacity-50 backdrop-blur-md text-white pt-8 pb-4 mt-10 border-t border-gray-700 shadow-inner">
        <div>
            <img src={logo1} alt="logo" className='w-25 h-20' />
        </div>
      <div className="container mx-auto px-4 flex flex-col items-center">

        {/* Centered Navigation Links */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-300 mb-6">
          <a href="#about" className="hover:text-purple-400 transition">About</a>
          <a href="#events" className="hover:text-purple-400 transition">Events</a>
          <a href="#nfts" className="hover:text-purple-400 transition">NFTs</a>
          <a href="#contact" className="hover:text-purple-400 transition">Contact</a>
        </div>

        {/* Bottom-Centered Copyright */}
        <div className="text-xs text-gray-500 text-center">
          &copy; {new Date().getFullYear()} VictoryVerse. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
