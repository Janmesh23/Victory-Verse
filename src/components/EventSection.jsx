import React from 'react';
import EventCard from './EventCard';
import Hackathon from '../assets/Hackathon.jpg'
import Olympic from '../assets/Olympic.jpg'
import Marathon from '../assets/marathon.jpeg'

const pastEvents = [
  {
    title: 'Olympic Gold - 2024',
    date: 'July 28, 2024',
    description: 'Honoring the gold medal winner with a rare Victory NFT.',
    image : Olympic
  },
  {
    title: 'Hackathon Hero',
    date: 'March 15, 2025',
    description: 'Celebrating the winner of the national hackathon.',
    image: Hackathon
  },
  {
    title: 'Marathon Master',
    date: 'October 12, 2024',
    description: 'Rewarded for finishing first in the city marathon.',
    image: Marathon
  }
];
const ongoingEvents = [
    {
      title: "CyberChampionship",
      date: "April 5, 2025",
      description: "Battle of the best in the ultimate gaming event.",
      
    },
    {
      title: "Code Clash",
      date: "April 10, 2025",
      description: "A live coding competition across the country.",
      
    },
    {
      title: "ArtFusion",
      date: "April 12, 2025",
      description: "Celebrating NFT artists in a digital metaverse gallery.",
      
    },
  ];

  const EventSection = () => {
    return (
      <section className="px-8 py-16 bg-[#000000] text-white">
        {/* Past Events */}
        <h2 className="text-4xl font-extrabold text-center mb-10">Past Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {pastEvents.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
  
        {/* Ongoing Events */}
        <h2 className="text-4xl font-extrabold text-center mb-10">Ongoing Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ongoingEvents.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </section>
    );
  };

export default EventSection;
