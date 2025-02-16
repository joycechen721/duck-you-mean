"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function SubjectsPage() {
    const [meetingLink, setMeetingLink] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createMeeting = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("/api/zoom");
            setMeetingLink(response.data.join_url);
        } catch (err) {
            if (err.response) {
                console.error("Response error:", err.response);
                setError(`Zoom API error: ${err.response.data.message}`);
            } else if (err.request) {
                console.error("Request error:", err.request);
                setError("No response received from Zoom API.");
            } else {
                console.error("Error", err.message);
                setError("Failed to create meeting. Try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen">
            {/* Background Image */}
            <Image
                src="/pond.PNG"
                alt="Pond Background"
                fill
                className="object-cover"
                priority
            />
            
            {/* Content Overlay */}
            <div className="relative z-10 p-6 flex flex-col items-center min-h-screen">
                <h1 className="text-4xl font-bold text-center text-blue-800">Welcome to the Pond</h1>
                <p className="text-gray-800 text-center mt-2">
                    Study with friends, enjoy some ducks, or chill after a tough lesson.
                </p>

                <button 
                    onClick={createMeeting} 
                    className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-lg disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create a Zoom Study Room"}
                </button>

                {error && (
                    <p className="text-red-600 mt-4 p-2 bg-white/90 rounded">{error}</p>
                )}

                {meetingLink && (
                    <div className="mt-4 text-center p-4 bg-white/90 rounded-lg shadow-lg max-w-xl mx-auto">
                        <p className="text-green-600 font-semibold">✅ Meeting Created!</p>
                        <p className="mt-2 text-blue-700">Join here:</p>
                        <a 
                            href={meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-500 underline hover:text-blue-700"
                        >
                            {meetingLink}
                        </a>
                    </div>
                )}

                {/* Vertical Cards with Image for Study Rooms */}
                <div className="mt-8 w-full max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Notional Card 1 */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <Image 
                            src="/pond-image.jpg" 
                            alt="Math 101" 
                            width={300} 
                            height={200} 
                            className="object-cover w-full h-48"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-blue-800">Math 101</h3>
                            <a 
                                href="https://zoom.us/j/1234567890" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 font-semibold hover:text-blue-800 underline mt-2 block"
                            >
                                Join Study Room
                            </a>
                        </div>
                    </div>
                    
                    {/* Notional Card 2 */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <Image 
                            src="/pond-image.jpg" 
                            alt="Computer Science Basics" 
                            width={300} 
                            height={200} 
                            className="object-cover w-full h-48"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-blue-800">Computer Science Basics</h3>
                            <a 
                                href="https://zoom.us/j/2345678901" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 font-semibold hover:text-blue-800 underline mt-2 block"
                            >
                                Join Study Room
                            </a>
                        </div>
                    </div>

                    {/* Notional Card 3 */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <Image 
                            src="/pond-image.jpg" 
                            alt="History of Science" 
                            width={300} 
                            height={200} 
                            className="object-cover w-full h-48"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-blue-800">History of Science</h3>
                            <a 
                                href="https://zoom.us/j/3456789012" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 font-semibold hover:text-blue-800 underline mt-2 block"
                            >
                                Join Study Room
                            </a>
                        </div>
                    </div>

                    {/* Notional Card 4 */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <Image 
                            src="/pond-image.jpg" 
                            alt="Literature Review Techniques" 
                            width={300} 
                            height={200} 
                            className="object-cover w-full h-48"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-blue-800">Literature Review Techniques</h3>
                            <a 
                                href="https://zoom.us/j/4567890123" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 font-semibold hover:text-blue-800 underline mt-2 block"
                            >
                                Join Study Room
                            </a>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};
