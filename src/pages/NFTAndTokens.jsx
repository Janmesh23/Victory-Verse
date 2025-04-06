import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";
import EventManagerABI from "../contracts/EventManagerABI.json";

const contractAddress = "0xfCE92d5Ae12694Bf335f85f415093fC8efEEF135";

const convertToGatewayUrl = (ipfsUri) => ipfsUri.replace("ipfs://", "https://ipfs.io/ipfs/");

const fetchImageFromMetadata = async (metadataURI) => {
  try {
    const gatewayUrl = convertToGatewayUrl(metadataURI);
    const response = await fetch(gatewayUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const metadata = await response.json();
    return metadata.image;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return null;
  }
};

const NFTAndTokens = () => {
  const [events, setEvents] = useState([]);
  const [buyAmounts, setBuyAmounts] = useState({});
  const [sortOrder, setSortOrder] = useState("default");
  const [loading, setLoading] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) setNavbarHeight(navbar.offsetHeight);

    const fetchEvents = async () => {
      if (!window.ethereum) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, EventManagerABI.abi, signer);

        const count = await contract.eventCount();
        const all = [];
        for (let i = 1; i <= count; i++) {
          const eventData = await contract.events(i);
          const imageUrl = await fetchImageFromMetadata(eventData.meta_uri);
          all.push({
            id: i,
            name: eventData.eventName,
            winner: eventData.winner,
            img: imageUrl,
            tokenPrice: ethers.formatEther(eventData.fanTokenPrice),
            tokenAddress: eventData.fanTokenAddress,
          });
        }
        setEvents(all);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getSortedEvents = () => {
    switch (sortOrder) {
      case "highToLow":
        return [...events].sort((a, b) => parseFloat(b.tokenPrice) - parseFloat(a.tokenPrice));
      case "lowToHigh":
        return [...events].sort((a, b) => parseFloat(a.tokenPrice) - parseFloat(b.tokenPrice));
      default:
        return events;
    }
  };

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

  const SkeletonCard = () => (
    <div className="bg-gray-800 rounded-xl shadow-md p-5 flex flex-col justify-between animate-pulse">
      <div className="w-full h-48 bg-gray-700 rounded-xl"></div>
      <div className="mt-4 space-y-2">
        <div className="h-6 bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
        <div className="h-3 bg-gray-600 rounded w-full"></div>
        <div className="h-4 bg-gray-600 rounded w-1/3"></div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-10 bg-gray-600 rounded-md"></div>
        <div className="h-10 bg-gray-600 rounded-md"></div>
      </div>
    </div>
  );

  const SkeletonNFTCard = () => (
    <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-700"></div>
      <div className="p-4 space-y-2">
        <div className="h-6 bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-600 rounded w-2/3"></div>
        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="px-6 py-10 min-h-screen" style={{ paddingTop: `calc(${navbarHeight}px + 2rem)` }}>
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white">Fan Tokens & NFTs</h2>
        </section>

        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-3xl font-semibold">Fan Tokens</h2>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <label htmlFor="sort" className="text-gray-300">Sort by price:</label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-md px-3 py-1 text-white"
              disabled={loading}
            >
              <option value="default">Default</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, index) => <SkeletonCard key={index} />)
          ) : (
            getSortedEvents().map((event) => (
              <div key={event.id} className="bg-gray-800 rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                <img
                  src={event.img}
                  alt={event.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available";
                  }}
                />
                <div>
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">Token Address:</p>
                  <p className="text-xs break-words text-gray-500">{event.tokenAddress}</p>
                  <p className="mt-2 text-sm text-gray-300">Price: {event.tokenPrice} ETH / token</p>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <input
                    type="number"
                    placeholder="Enter Number of Tokens"
                    value={buyAmounts[event.id] || ""}
                    onChange={(e) => setBuyAmounts({ ...buyAmounts, [event.id]: e.target.value })}
                    className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400"
                  />
                  <button
                    onClick={() => handleBuyTokens(event.id, event.tokenPrice)}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-md py-2 font-medium"
                  >
                    Buy Tokens
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-16 mb-8 text-center">
          <h2 className="text-3xl font-semibold">Winning NFTs</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, index) => <SkeletonNFTCard key={index} />)
          ) : (
            events
              .filter((e) => e.winner !== "0x0000000000000000000000000000000000000000")
              .map((event) => (
                <div key={event.id} className="bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={event.img}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available";
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{event.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">Winner: {event.winner.slice(0, 6)}...{event.winner.slice(-4)}</p>
                    <p className="text-xs text-gray-500 mt-1">NFT ID: #{event.id}</p>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTAndTokens;
