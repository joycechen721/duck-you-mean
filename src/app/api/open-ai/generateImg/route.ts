import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req:any) {
    try {
        const { prompt } = await req.json();

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024",
        });

        return Response.json({ imageUrl: response.data[0].url }, { status: 200 });
    } catch (error) {
        console.error("Error generating image:", error);
        return Response.json({ error: "Failed to generate image" }, { status: 500 });
    }
}
