// import React from 'react';
// import EventCard from './EventCard';
// import Hackathon from '../assets/Hackathon.jpg'
// import Olympic from '../assets/Olympic.jpg'
// import Marathon from '../assets/marathon.jpeg'

// const pastEvents = [
//   {
//     title: 'Olympic Gold - 2024',
//     date: 'July 28, 2024',
//     description: 'Honoring the gold medal winner with a rare Victory NFT.',
//     image : Olympic
//   },
//   {
//     title: 'Hackathon Hero',
//     date: 'March 15, 2025',
//     description: 'Celebrating the winner of the national hackathon.',
//     image: Hackathon
//   },
//   {
//     title: 'Marathon Master',
//     date: 'October 12, 2024',
//     description: 'Rewarded for finishing first in the city marathon.',
//     image: Marathon
//   }
// ];
// const ongoingEvents = [
//     {
//       title: "CyberChampionship",
//       date: "April 5, 2025",
//       description: "Battle of the best in the ultimate gaming event.",
      
//     },
//     {
//       title: "Code Clash",
//       date: "April 10, 2025",
//       description: "A live coding competition across the country.",
      
//     },
//     {
//       title: "ArtFusion",
//       date: "April 12, 2025",
//       description: "Celebrating NFT artists in a digital metaverse gallery.",
      
//     },
//   ];

//   const EventSection = () => {
//     return (
//       <section className="px-8 py-16 bg-[#000000] text-white">
//         {/* Past Events */}
//         <h2 className="text-4xl font-extrabold text-center mb-10">Past Events</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
//           {pastEvents.map((event, index) => (
//             <EventCard key={index} {...event} />
//           ))}
//         </div>
  
//         {/* Ongoing Events */}
//         <h2 className="text-4xl font-extrabold text-center mb-10">Ongoing Events</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {ongoingEvents.map((event, index) => (
//             <EventCard key={index} {...event} />
//           ))}
//         </div>
//       </section>
//     );
//   };

// export default EventSection;

import React, { useEffect, useState, useContext } from 'react';
import { WalletContext } from '../context/WalletContext';
import { ethers } from "ethers";
import EventManagerABI from "../contracts/EventManagerABI.json";

const EventSection = () => {
  const [userNFTs, setUserNFTs] = useState([]);
  const { walletAddress } = useContext(WalletContext); // using already fetched contract
  const contractAddress = "0xd23D5CA18541789329D48CFDDEd9eb802Ca55096";

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!walletAddress) return;

      try {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await _provider.getSigner();
        const contract = new ethers.Contract(contractAddress, EventManagerABI.abi, signer);

        const eventCount = await contract.eventCount();

        const ownedNFTs = [];

        for (let eventId = 1; eventId <= eventCount; eventId++) {
          const tokenId = await contract.userNFTs(walletAddress, eventId);
          if (tokenId.toNumber() > 0) {
            const eventInfo = await contract.events(eventId);
            ownedNFTs.push({
              eventId,
              tokenId: tokenId.toString(),
              name: eventInfo.eventName,
              logo: eventInfo.img_uri,
            });
          }
        }

        setUserNFTs(ownedNFTs);
      } catch (error) {
        console.error('Error fetching user NFTs:', error);
      }
    };

    fetchNFTs();
  }, [walletAddress]);

  return (
    <div className="text-white p-6">
      <h2 className="text-2xl font-bold mb-4">My NFTs</h2>
      {userNFTs.length === 0 ? (
        <p>No NFTs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userNFTs.map((nft, index) => (
            <div key={index} className="bg-gray-900 rounded-xl p-4 shadow-lg">
              <img src={nft.logo} alt={nft.name} className="w-full h-40 object-cover rounded" />
              <h3 className="text-xl mt-3 font-semibold">{nft.name}</h3>
              <p>Event ID: {nft.eventId}</p>
              <p>Token ID: {nft.tokenId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventSection;
