import React from 'react';
import { Heart, User, Book } from 'lucide-react';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-yellow-200 shadow-lg rounded-xl p-4 flex justify-center mb-8">
            <ul className="flex space-x-6">
                <li>
                    <a 
                        href="/" 
                        className="flex items-center space-x-2 px-4 py-2 bg-white text-pink-600 rounded-full shadow-md transition-transform transform hover:scale-110 hover:bg-pink-100"
                    >
                        <Heart className="w-5 h-5" />
                        <span>Home</span>
                    </a>
                </li>
                <li>
                    <a 
                        href="/profile" 
                        className="flex items-center space-x-2 px-4 py-2 bg-white text-pink-600 rounded-full shadow-md transition-transform transform hover:scale-110 hover:bg-pink-100"
                    >
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                    </a>
                </li>
                <li>
                    <a 
                        href="/subjects" 
                        className="flex items-center space-x-2 px-4 py-2 bg-white text-pink-600 rounded-full shadow-md transition-transform transform hover:scale-110 hover:bg-pink-100"
                    >
                        <Book className="w-5 h-5" />
                        <span>Subjects</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
