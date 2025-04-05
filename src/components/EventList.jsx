import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import EventManagerABI from '../contracts/EventManagerABI.json';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const contractAddress = "0xcb14B7b438625a7b92F7972242Ef47b9e56d6FE0";

  useEffect(() => {
    const fetchEvents = async () => {
      if (!window.ethereum) return;
      
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, EventManagerABI.abi, signer);

        // Get the total number of events created
        const eventCount = await contract.eventCount();
        const fetchedEvents = [];

        // Loop through all event IDs (assuming event IDs start at 1)
        for (let i = 1; i <= eventCount; i++) {
          const eventData = await contract.events(i);
          fetchedEvents.push({
            id: eventData.id.toString(),
            creator: eventData.creator,
            eventName: eventData.eventName,
            eventLogo: eventData.eventLogo,
            winnerDeclared: eventData.winnerDeclared,
            winner: eventData.winner,
            winnerTokenAmount: eventData.winnerTokenAmount.toString(),
            fanTokenAmount: eventData.fanTokenAmount.toString(),
            fanTokenPrice: eventData.fanTokenPrice.toString(),
            fanTokenAddress: eventData.fanTokenAddress
          });
        }

        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="text-white p-6">
      <h2 className="text-2xl font-bold mb-4">All Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-gray-900 rounded-xl p-4 shadow-lg">
              <img src={event.eventLogo} alt={event.eventName} className="w-full h-40 object-cover rounded" />
              <h3 className="text-xl mt-3 font-semibold">{event.eventName}</h3>
              <p>Event ID: {event.id}</p>
              <p>Creator: {event.creator}</p>
              <p>Winner Declared: {event.winnerDeclared ? "Yes" : "No"}</p>
              {/* You can add more event details here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;
