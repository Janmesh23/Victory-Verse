import React from 'react';

const EventCard = ({ title, date, description,image }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-600 hover:scale-105 transition-transform duration-300">
       <div className="w-full h-60 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-sm text-gray-300 mb-4">{date}</p>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default EventCard;
