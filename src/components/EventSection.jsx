import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import EventManagerABI from "../contracts/EventManagerABI.json";


const EventSection = () => {
  const [userNFTs, setUserNFTs] = useState([]);
  const { walletAddress } = useContext(WalletContext); // using already fetched contract
  const contractAddress = "0xd23D5CA18541789329D48CFDDEd9eb802Ca55096";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await _provider.getSigner();
        const contract = new ethers.Contract(contractAddress, EventManagerABI.abi, signer);

        const eventCount = await contract.eventCount();
        const past = [];
        const ongoing = [];

        for (let eventId = 1; eventId <= eventCount; eventId++) {
          const eventInfo = await contract.events(eventId);
          const winner = await contract.winners(eventId);

          const eventData = {
            id: eventId,
            name: eventInfo.eventName,
            image: eventInfo.img_uri,
            date: new Date(Number(eventInfo.date) * 1000).toLocaleDateString(),
            winner: winner,
          };
          const ZeroAddress = "0x0000000000000000000000000000000000000000";


          if (winner !== "0x0000000000000000000000000000000000000000")
            {
            past.push(eventData);
          } else {
            ongoing.push(eventData);
          }
        }

        setPastEvents(past);
        setOngoingEvents(ongoing);
      } catch (err) {
        console.error("Error fetching events: ", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="px-8 py-16 bg-black text-white">
      {/* Past Events */}
      <h2 className="text-4xl font-extrabold text-center mb-10">Past Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {pastEvents.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>

      {/* Ongoing Events */}
      <h2 className="text-4xl font-extrabold text-center mb-10">Ongoing Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {ongoingEvents.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </section>
  );
};

const EventCard = ({ name, image, date, id }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="bg-white/10 backdrop-blur-md hover:scale-105 transition transform duration-300 shadow-lg rounded-2xl p-4 cursor-pointer"
      >
        <img src={image} alt={name} className="w-full h-40 object-cover rounded-xl mb-3" />
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-gray-400">Date: {date}</p>
        <p className="text-sm text-purple-300 mt-1">Event ID: {id}</p>
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-xl shadow-2xl border border-purple-600 max-w-sm">
            <h2 className="text-2xl font-bold mb-2">{name}</h2>
            <p className="mb-3 text-sm text-gray-400">Date: {date}</p>
            <img src={image} alt={name} className="w-full h-48 object-cover rounded mb-4" />
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EventSection;
