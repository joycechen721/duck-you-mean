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
            <div className="relative z-10 p-6 flex flex-col items-center min-h-screen ">
                <h1 className="text-4xl font-bold text-center text-blue-800">Welcome to the Pond</h1>
                <p className="text-gray-800 text-center mt-2">Study with friends, enjoy some ducks, or chill after a tough lesson</p>

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
                    <div className="mt-4 text-center p-4 bg-white/90 rounded-lg shadow-lg">
                        <p className="text-green-600 font-semibold">✅ Meeting Created!</p>
                        <p className="mt-2">Join here:</p>
                        <a 
                            href={meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-500 underline break-all hover:text-blue-700"
                        >
                            {meetingLink}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};