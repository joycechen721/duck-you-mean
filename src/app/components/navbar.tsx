import React from 'react';
import { Heart, Lightbulb, Cloud } from 'lucide-react';

const logoImage = '/logo.png';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-[#4f8d5e] shadow-lg p-4 flex items-center justify-between">
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
                className="flex cursor-pointer items-center space-x-2 px-4 py-2 bg-white text-black-900 rounded-full shadow-md transition-transform transform hover:scale-110 hover:bg-yellow-200"
                >
                <Lightbulb className="w-5 h-5" />
                <span>Learn</span>
                </a>
            </li>
            <li>
                <a 
                href="/pond" 
                className="flex items-center space-x-2 px-4 py-2 bg-white text-black-900 rounded-full shadow-md transition-transform transform hover:scale-110 hover:bg-yellow-200"
                >
                <Cloud className="w-5 h-5" />
                <span>Pond</span>
                </a>
            </li>
            </ul>
        </nav>
    );
};

export default Navbar;
