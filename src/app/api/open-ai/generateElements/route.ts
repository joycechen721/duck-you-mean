import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const previousElements = new Set(); // Store tracked elements

export async function POST(req) {
    try {
        console.log(previousElements);
        const { prompt } = await req.json();

        // Extract key concepts from the prompt
        const data = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are an AI assistant that extracts key concepts from text." },
                { role: "user", content: `Extract the main key concepts from the following text as a comma-separated list: "${prompt}"` }
            ],
            max_tokens: 50,
        });
        
        const keywords = data.choices[0].message.content ? data.choices[0].message.content.trim().split(", ") : [];
        console.log(keywords);

        // Find new elements to add
        const newElements = keywords.filter(k => !previousElements.has(k));
        newElements.forEach(el => previousElements.add(el));
        console.log("New elements: ", newElements);

        if (newElements.length === 0) {
            return Response.json({ message: "No new elements to add." }, { status: 200 });
        }

        // Request only the new elements from DALL·E
        const elementPrompts = newElements.map(el => `A cute colorful sketch illustration of ${el} with white background`);
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: elementPrompts.join(", "), // Generate all in one image
            n: 1,
            size: "1024x1024",
        });

        const newImageUrl = response.data[0].url;
        
        return Response.json({ imageUrl: newImageUrl, newElements }, { status: 200 });

    } catch (error) {
        console.error("Error generating image:", error);
        return Response.json({ error: "Failed to generate image" }, { status: 500 });
    }
}
