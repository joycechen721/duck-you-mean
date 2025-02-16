import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req:any) {
    try {
        const { text } = await req.json();

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are an AI assistant that extracts key concepts from text." },
                { role: "user", content: `Extract the main key concepts from the following text as a comma-separated list: "${text}"` }
            ],
            max_tokens: 50,
        });
        const keywords = response.choices[0].message.content ? response.choices[0].message.content.trim().split(", ") : [];
        
        return Response.json({ keywords }, { status: 200 });
    } catch (error) {
        console.error("Error extracting keywords:", error);
        return Response.json({ error: "Failed to extract keywords" }, { status: 500 });
    }
}
