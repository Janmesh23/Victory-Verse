import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Metaverse from '../assets/Metaverse.jpg';
import Cyber from '../assets/Cyber.jpeg';
import Glitch from '../assets/Glitchimg.jpg';
import Registerbg from '../assets/Register-bg (4).mp4';



const mockEvents = [
    { id: 1, name: "Metaverse Music Fest", location: "Virtual Arena", date: "2025-05-01", image: Metaverse },
    { id: 2, name: "Cyber Carnival", location: "Neo-Tokyo Hub", date: "2025-05-10", image: Cyber },
    { id: 3, name: "Glitch Hackathon", location: "Silicon Shard City", date: "2025-06-02", image: Glitch },
    { id: 4, name: "Metaverse Music Fest", location: "Virtual Arena", date: "2025-05-01", image: Metaverse },
    { id: 5, name: "Cyber Carnival", location: "Neo-Tokyo Hub", date: "2025-05-10", image: Cyber },
    { id: 6, name: "Glitch Hackathon", location: "Silicon Shard City", date: "2025-06-02", image: Glitch },
    { id: 7, name: "Metaverse Music Fest", location: "Virtual Arena", date: "2025-05-01", image: Metaverse },
    { id: 8, name: "Cyber Carnival", location: "Neo-Tokyo Hub", date: "2025-05-10", image: Cyber },
    { id: 9, name: "Glitch Hackathon", location: "Silicon Shard City", date: "2025-06-02", image: Glitch },
    { id: 10, name: "Metaverse Music Fest", location: "Virtual Arena", date: "2025-05-01", image: Metaverse },
    { id: 11, name: "Cyber Carnival", location: "Neo-Tokyo Hub", date: "2025-05-10", image: Cyber },
    { id: 12, name: "Glitch Hackathon", location: "Silicon Shard City", date: "2025-06-02", image: Glitch },

];

const Register = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredEvents = mockEvents.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRegister = (eventName) => {
        alert(`Successfully registered for ${eventName}!`);
    };

    return (
        <>
            <Navbar />

            <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
                <video
                    src={Registerbg}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
                {/* Optional dark overlay for better text readability */}
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm" />
            </div>

            <div className="relative z-5 min-h-screen text-white px-6 py-10">

                <h1 className="text-4xl font-bold mb-10 text-center text-cyan-400 font-SDGlitch">Register for Events</h1>

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
                            className="bg-black bg-opacity-50 border border-cyan-700 rounded-2xl shadow-lg backdrop-blur-md bg-opacity-30 hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col justify-between"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img src={event.image} alt={event.name} className="rounded-t-2xl h-48 w-full object-cover" />
                            <div className="p-4 flex flex-col gap-2">
                                <h3 className="text-xl font-semibold text-cyan-300">{event.name}</h3>
                                <p className="text-sm text-gray-400">{event.location}</p>
                                <p className="text-sm text-gray-500">{event.date}</p>
                                <button
                                    onClick={() => handleRegister(event.name)}
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

export default Register;
