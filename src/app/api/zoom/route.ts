import { NextResponse } from 'next/server';
import axios from 'axios';

// Export the POST handler
export async function POST(request: Request) {
  try {
    // Get access token
    const tokenResponse = await axios.post(
      "https://zoom.us/oauth/token",
      new URLSearchParams({
        grant_type: "account_credentials",
        account_id: process.env.ZOOM_ACCOUNT_ID || "",
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Token Response:", tokenResponse.data); // Debug log

    const accessToken = tokenResponse.data.access_token;

    // Create Zoom meeting
    const zoomResponse = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: "Scheduled Meeting",
        type: 2,
        start_time: new Date().toISOString(),
        duration: 30,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        settings: {
          host_video: true,
          participant_video: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Zoom Response:", zoomResponse.data); // Debug log

    return NextResponse.json({
      join_url: zoomResponse.data.join_url,
      meeting_id: zoomResponse.data.id,
      password: zoomResponse.data.password,
    });
  } catch (error: any) {
    console.error('Zoom API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to create Zoom meeting", details: error.message },
      { status: 500 }
    );
  }
}