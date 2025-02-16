import React from 'react';
import { Heart, User, Book } from 'lucide-react';

const logoImage = '/logo.png';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-green-400 shadow-lg rounded-xl p-4 flex items-center justify-between">
            <div className="flex-shrink-0">
                <a href="/" className="block">
                    <img src={logoImage} alt="Logo" style={{ width: "15rem", position: 'absolute', marginTop: '-75px' }}/>
                </a>
            </div>

            {/* Navigation links centered */}
            <ul className="flex space-x-6">
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
