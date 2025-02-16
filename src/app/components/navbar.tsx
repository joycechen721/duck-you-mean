import React from 'react';
import { Heart, User, Book } from 'lucide-react';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-green-400 shadow-lg rounded-xl p-4 flex justify-center mb-8">
            <ul className="flex space-x-6">
                <li>
                    <a 
                        href="/" 
                        className="flex items-center space-x-2 px-4 py-2 bg-white text-yellow-900 rounded-full shadow-md transition-transform transform hover:scale-110 hover:bg-yellow-200"
                    >
                        <Heart className="w-5 h-5" />
                        <span>Home</span>
                    </a>
                </li>
                <li>
                    <a 
                        href="/learn" 
                        className="flex items-center space-x-2 px-4 py-2 bg-white text-yellow-900 rounded-full shadow-md transition-transform transform hover:scale-110 hover:bg-yellow-200"
                    >
                        <User className="w-5 h-5" />
                        <span>Learn</span>
                    </a>
                </li>
                <li>
                    <a 
                        href="/pond" 
                        className="flex items-center space-x-2 px-4 py-2 bg-white text-yellow-900 rounded-full shadow-md transition-transform transform hover:scale-110 hover:bg-yellow-200"
                    >
                        <Book className="w-5 h-5" />
                        <span>Pond</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
