import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";
import EventManagerABI from "../contracts/EventManagerABI.json";

// Replace with your deployed contract address
const contractAddress = "0xd23D5CA18541789329D48CFDDEd9eb802Ca55096";

// Convert an ipfs:// URI to a gateway URL (using ipfs.io here)
const convertToGatewayUrl = (ipfsUri) => {
  return ipfsUri.replace("ipfs://", "https://ipfs.io/ipfs/");
};

// Fetch metadata JSON from IPFS and extract the "image" field
const fetchImageFromMetadata = async (metadataURI) => {
  try {
    const gatewayUrl = convertToGatewayUrl(metadataURI);
    const response = await fetch(gatewayUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const metadata = await response.json();
    return metadata.image; // Return the image URL from the metadata
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return null;
  }
};

const NFTAndTokens = () => {
  const [events, setEvents] = useState([]);
  const [buyAmounts, setBuyAmounts] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      if (!window.ethereum) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, EventManagerABI.abi, signer);

        const count = await contract.eventCount();
        const all = [];

        // Loop through each event ID
        for (let i = 1; i <= count; i++) {
          const eventData = await contract.events(i);
          // Fetch the image URL from metadata
          const imageUrl = await fetchImageFromMetadata(eventData.meta_uri);
          all.push({
            id: i,
            name: eventData.eventName,
            winner: eventData.winner,
            img: imageUrl, // Store the fetched image URL for this event
            tokenPrice: ethers.formatEther(eventData.fanTokenPrice),
            tokenAddress: eventData.fanTokenAddress,
          });
        }
        setEvents(all);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const handleBuyTokens = async (eventId, priceInETH) => {
    if (!window.ethereum) return;
    const amount = buyAmounts[eventId] || 0;
    if (amount <= 0) return alert("Enter a valid amount");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, EventManagerABI.abi, signer);

      const totalCost = ethers.parseEther((amount * parseFloat(priceInETH)).toString());
      const tx = await contract.purchaseFanTokens(eventId, amount, { value: totalCost });
      await tx.wait();

      alert(`Successfully bought ${amount} tokens for event #${eventId}`);
    } catch (error) {
      console.error("Token purchase failed:", error);
      alert("Failed to purchase tokens.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="relative z-5 px-6 py-10 min-h-screen text-white"
        style={{
          backgroundImage: "url('https://c4.wallpaperflare.com/wallpaper/904/1022/350/hud-1-wallpaper-preview.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed", // <-- this makes it stay in place when scrolling
          backgroundPosition: "center",
        }}
      >
        <section className="mb-12 mt-10 border-2 border-black-700 rounded-3xl p-6 shadow-cyan-500/20 shadow-lg  mt-15">

          <div className="flex justify-center mb-6">
            <h2 className="text-6xl font-circular-web font-bold text-black-300 relative animate-pulse-glow">
              <span className="absolute -inset-2 bg-black-500 opacity-20 blur-2xl rounded-xl"></span>
              <span className="relative z-10 font-robert-medium">Fan Tokens & NFT's</span>
            </h2>
          </div>
        </section>



        {/* Fan Tokens Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-4 mb-10">
          <h2 className="text-5xl  text-cyan-300 font-bold text-center ">Fan Tokens</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-black bg-opacity-40 rounded-2xl border border-cyan-500 shadow-md p-5 flex flex-col justify-between transition-transform duration-300 transform hover:scale-105">
              <img src={event.img} alt={event.name} className="w-full h-48 object-cover rounded-t-2xl" />
              <div>
                <h3 className="text-xl font-bold text-cyan-200">{event.name}</h3>
                <p className="text-sm text-gray-400 mt-1">Token Address:</p>
                <p className="text-xs break-words text-gray-500">{event.tokenAddress}</p>
                <p className="mt-3 text-sm text-cyan-400">Price: {event.tokenPrice} ETH / token</p>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={buyAmounts[event.id] || ""}
                  onChange={(e) =>
                    setBuyAmounts({ ...buyAmounts, [event.id]: e.target.value })
                  }
                  className="bg-gray-900 border border-cyan-600 rounded-md px-4 py-2 text-white placeholder-cyan-300 outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button
                  onClick={() => handleBuyTokens(event.id, event.tokenPrice)}
                  className="bg-cyan-600 hover:bg-cyan-400 text-white rounded-xl py-2 font-medium transition-all duration-300"
                >
                  Buy Tokens
                </button>
              </div>
            </div>
          ))}
        </div>


        {/* Winner NFTs Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-4 mb-10 mt-10">
          <h2 className="text-5xl  text-cyan-300 font-bold text-center ">Winning NFTs</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-8 mb-16">
          {events
            .filter((e) => e.winner !== "0x0000000000000000000000000000000000000000")
            .map((event) => (
              <div key={event.id} className="bg-black bg-opacity-50 rounded-2xl border border-cyan-700 shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105">
                <img src={event.img} alt={event.name} className="w-full h-48 object-cover rounded-t-2xl" />
                <div className="p-4">
                  <h3 className="text-xl text-cyan-300 font-semibold">{event.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">Winner: {event.winner.slice(0, 6)}...{event.winner.slice(-4)}</p>
                  <p className="text-xs text-gray-500 mt-1">NFT ID: #{event.id}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default NFTAndTokens;
