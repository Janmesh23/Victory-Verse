
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";
import EventManagerABI from "../contracts/EventManagerABI.json";

const contractAddress = "0xd23D5CA18541789329D48CFDDEd9eb802Ca55096";

// Helper to convert an IPFS URI (ipfs://CID) to a gateway URL.
const convertToGatewayUrl = (ipfsUri) => {
  return ipfsUri.replace("ipfs://", "https://ipfs.io/ipfs/");
};

// Fetch metadata JSON from IPFS and return the "image" field.
const fetchImageFromMetadata = async (metadataURI) => {
  try {
    const gatewayUrl = convertToGatewayUrl(metadataURI);
    const response = await fetch(gatewayUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const metadata = await response.json();
    return metadata.image; // Return the image URL stored in metadata.
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return null;
  }
};

const MyEvents = () => {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, EventManagerABI.abi, signer);

      try {
        const count = await contract.eventCount();
        const myCreated = [];
        const myParticipated = [];

        for (let i = 1; i <= count; i++) {
          const event = await contract.events(i);
          // Fetch image from event metadata URI
          const image = await fetchImageFromMetadata(event.meta_uri);
          const eventData = {
            id: i,
            name: event.eventName,
            creator: event.creator,
            winner: event.winner,
            winnerDeclared: event.winnerDeclared,
            meta_uri: event.meta_uri,
            img: image, // store each event's image separately
          };

          if (event.creator.toLowerCase() === userAddress.toLowerCase()) {
            myCreated.push(eventData);
          }
          const registered = await contract.isRegistered(i, userAddress);
          if (registered) {
            myParticipated.push(eventData);
          }
        }

        setCreatedEvents(myCreated);
        setParticipatedEvents(myParticipated);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const openDeclareWinner = async (eventId) => {
    setSelectedEventId(eventId);
    setLoadingParticipants(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, EventManagerABI.abi, signer);
      const addresses = await contract.getParticipants(eventId);
      setParticipants(addresses);
    } catch (err) {
      console.error("Error fetching participants:", err);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const declareWinner = async (participantAddress) => {
    if (!window.ethereum || !selectedEventId) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, EventManagerABI.abi, signer);
      const tx = await contract.declareWinner(selectedEventId, participantAddress);
      await tx.wait();

      alert("Winner declared successfully!");
      setSelectedEventId(null);
      window.location.reload();
    } catch (err) {
      console.error("Declare winner error:", err);
      alert("Failed to declare winner");
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="relative min-h-screen text-white p-8"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-vector/glowing-hexagonal-pattern-digital-background-web-data-visualization_1017-49560.jpg')`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed', // 💫 This makes it stay while scrolling
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >


        <section className="mb-12 mt-12">
        <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-4 mb-10">
          <h2 className="text-5xl  text-cyan-300 font-bold text-center ">Created Events</h2>
        </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {createdEvents.map((event) => (
              <div
                key={event.id}
                className="bg-black bg-opacity-50 border border-cyan-700 rounded-2xl shadow-lg p-4"
              >
                <img
                  src={event.img}
                  alt={event.name}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <h3 className="text-xl font-semibold text-cyan-300">{event.name}</h3>
                <p className="text-sm text-gray-400 mt-1">Event ID: #{event.id}</p>
                {event.winnerDeclared ? (
                  <div className="mt-3 text-green-400">
                    <p className="font-semibold">✅ Winner Declared</p>
                    <p className="text-sm text-gray-300 break-all">
                      👑 {event.winner.slice(0, 6)}...{event.winner.slice(-4)}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => openDeclareWinner(event.id)}
                    className="mt-4 bg-cyan-600 hover:bg-cyan-400 text-white rounded-lg px-4 py-2"
                  >
                    Declare Winner
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
        <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-4 mb-10">
          <h2 className="text-5xl  text-cyan-300 font-bold text-center ">Participated Events</h2>
        </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {participatedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-black bg-opacity-50 border border-cyan-700 rounded-2xl shadow-lg p-4"
              >
                <img
                  src={event.img}
                  alt={event.name}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <h3 className="text-xl font-semibold text-cyan-300">{event.name}</h3>
                <p className="text-sm text-gray-400 mt-1">Event ID: #{event.id}</p>
              </div>
            ))}
          </div>
        </section>

        {selectedEventId && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-2xl w-96 border border-cyan-600">
              <h3 className="text-xl font-bold text-cyan-300 mb-4">Select Winner</h3>
              {loadingParticipants ? (
                <p className="text-white">Loading participants...</p>
              ) : participants.length > 0 ? (
                <ul className="space-y-3">
                  {participants.map((addr, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-md">
                      <span className="text-sm text-white">{addr.slice(0, 6)}...{addr.slice(-4)}</span>
                      <button
                        onClick={() => declareWinner(addr)}
                        className="bg-cyan-500 hover:bg-cyan-300 text-black px-3 py-1 rounded-md text-sm"
                      >
                        Declare
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">No participants registered</p>
              )}
              <button
                className="mt-4 text-sm text-cyan-400 underline"
                onClick={() => setSelectedEventId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyEvents;
