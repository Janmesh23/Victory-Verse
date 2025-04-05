import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Registerbg from "../assets/Register-bg (4).mp4";
import { WalletContext } from "../context/WalletContext";
import EventManagerABI from "../contracts/EventManagerABI.json";

// Replace with your deployed contract address
const contractAddress = "0xF96ef87aCC8F49a04D1e2BDF4De3949a79deB7C3";

const RegisterEvents = () => {
  const { walletAddress } = useContext(WalletContext);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      if (!window.ethereum) return;
      try {
        // Create provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, EventManagerABI.abi, signer);

        // Get total number of events
        const eventCount = await contract.eventCount();
        const fetchedEvents = [];

        // Loop through events (assuming event IDs start at 1)
        for (let i = 1; i <= eventCount; i++) {
          const eventData = await contract.events(i);
          fetchedEvents.push({
            id: eventData.id.toString(),
            creator: eventData.creator,
            eventName: eventData.eventName,
            // Assuming your contract stores the logo URL as img_uri
            img_uri: eventData.img_uri,
            description: eventData.description,
            // Add more fields if needed...
          });
        }
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search term
  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Register for an event using its eventId
  const handleRegister = async (eventId, eventName) => {
    if (!walletAddress) {
      alert("Please connect your wallet first!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, EventManagerABI.abi, signer);

      const tx = await contract.registerForEvent(eventId);
      await tx.wait();
      alert(`Successfully registered for ${eventName}!`);
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Registration failed. See console for details.");
    }
  };

  return (
    <>
      <Navbar />

      {/* Full-screen background video */}
      <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
        <video
          src={Registerbg}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm" />
      </div>

      {/* Content area */}
      <div className="relative z-10 min-h-screen text-white px-6 py-10">
        <h1 className="text-4xl font-bold mb-10 text-center text-cyan-400 font-SDGlitch">
          Register for Events
        </h1>

        <div className="flex flex-col md:flex-row mb-10 items-start md:items-center gap-6">
          <input
            type="text"
            placeholder="Search Events..."
            className="px-5 py-3 w-full md:w-1/3 rounded-lg bg-black bg-opacity-50 border-2 border-cyan-500 text-white placeholder-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              className="bg-black border border-cyan-700 rounded-2xl shadow-lg backdrop-blur-md bg-opacity-30 hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col justify-between"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={event.img_uri}
                alt={event.eventName}
                className="rounded-t-2xl h-48 w-full object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-cyan-300">{event.eventName}</h3>
                <h6 className="text-sm font-semibold text-white">{event.description}</h6>
                <button
                  onClick={() => handleRegister(event.id, event.eventName)}
                  className="mt-4 py-2 bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-600 hover:text-white transition-all duration-300 rounded-xl"
                >
                  Register
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RegisterEvents;
