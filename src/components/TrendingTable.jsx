import React from 'react';

const trendingData = [
  {
    rank: 1,
    name: 'Courtyard.io',
    logo: 'https://via.placeholder.com/40', // Replace with real image URLs
    price: '< 0.01 ETH',
    volume: '432 ETH',
  },
  {
    rank: 2,
    name: 'Ronkeverse',
    logo: 'https://via.placeholder.com/40',
    price: '127.60 RON',
    volume: '389K RON',
  },
  // ... add more collections
];

const TrendingTable = () => {
  return (
    <div className="text-white px-6 py-6 bg-black/80 backdrop-blur-md  shadow-xl w-full">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold "> Trending Collections</h2>
        <div className="flex gap-2 text-sm">
          <button className="bg-gray-800 px-3 py-1 rounded hover:bg-gray-700">1h</button>
          <button className="bg-gray-800 px-3 py-1 rounded hover:bg-gray-700">6h</button>
          <button className="bg-gray-800 px-3 py-1 rounded hover:bg-gray-700">24h</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="pb-2">Rank</th>
              <th className="pb-2">Collection</th>
              <th className="pb-2">Floor Price</th>
              <th className="pb-2">Volume</th>
            </tr>
          </thead>
          <tbody>
            {trendingData.map((item) => (
              <tr key={item.rank} className="border-b border-gray-800 hover:bg-gray-900">
                <td className="py-3">{item.rank}</td>
                <td className="flex items-center gap-3 py-3">
                  <img src={item.logo} alt="logo" className="w-8 h-8 rounded" />
                  <span>{item.name}</span>
                </td>
                <td className="py-3">{item.price}</td>
                <td className="py-3">{item.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrendingTable;
