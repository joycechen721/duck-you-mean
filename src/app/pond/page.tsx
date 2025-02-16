"use client";

import { useState } from "react";
import axios from "axios";

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
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.error("Response error:", err.response);
              setError(`Zoom API error: ${err.response.data.message}`);
            } else if (err.request) {
              // The request was made but no response was received
              console.error("Request error:", err.request);
              setError("No response received from Zoom API.");
            } else {
              // Something happened in setting up the request that triggered an Error
              console.error("Error", err.message);
              setError("Failed to create meeting. Try again.");
            }
          }
        }
    

    return (
        <div className="p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold text-center">Welcome to the Pond</h1>
            <p className="text-gray-600 text-center mt-2">Explore different subjects here.</p>

            <button 
                onClick={createMeeting} 
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={loading}
            >
                {loading ? "Creating..." : "Create Zoom Meeting"}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {meetingLink && (
                <p className="mt-4 text-center">
                    ✅ Meeting Created! Join here:{" "}
                    <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        {meetingLink}
                    </a>
                </p>
            )}
        </div>
    );
};