// app/api/generateImage/route.js
import fs from 'fs';
import path from 'path';
import { LumaAI } from 'lumaai';

const client = new LumaAI({ authToken: process.env.LUMALABS_API_KEY });

export async function POST(req:any) {
    try {
        const { prompt } = await req.json();
        let generation = await client.generations.image.create({
            prompt,
        });

        let completed = false;

        while (!completed) {
            generation = await client.generations.get(generation.id);

            if (generation.state === "completed") {
                completed = true;
            } else if (generation.state === "failed") {
                return Response.json({ error: `Generation failed: ${generation.failure_reason}` }, { status: 500 });
            } else {
                console.log("Dreaming...");
                await new Promise(r => setTimeout(r, 3000)); // Wait for 3 seconds
            }
        }

        const imageUrl = generation.assets.image;
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();

        // Define the public folder path
        const fileName = `${generation.id}.jpg`;
        const filePath = path.join(process.cwd(), 'public', 'images', fileName);

        // Ensure the directory exists
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        // Write the file to the public directory
        fs.writeFileSync(filePath, Buffer.from(buffer));

        // Return the public URL of the saved image
        return Response.json({ imageUrl: `/images/${fileName}` }, { status: 200 });

    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Failed to generate image' }, { status: 500 });
    }
}
