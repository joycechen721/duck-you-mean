import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export async function POST(req: any) {
    try {
        console.log("HERE")
        const { question, userAnswer, previousScore } = await req.json(); // Get the AI's question & user's answer

        // Step 1: Evaluate how well the user answered the question
        const evaluationResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are an AI evaluator that assigns a score from 0-100 based on how well the user's response answers the given question. Consider relevance, clarity, and completeness. Return only the number, no extra text." },
                { role: "user", content: `Question: "${question}"\nUser's Answer: "${userAnswer}"\nScore (0-100):` }
            ],
            max_tokens: 10,
        });
        console.log(evaluationResponse)

        let newScore = evaluationResponse.choices[0].message && evaluationResponse.choices[0].message.content ? parseInt(evaluationResponse.choices[0].message.content.trim(), 10) : 0;

        // Step 2: Ensure the score never decreases
        if (previousScore !== undefined && newScore < previousScore) {
            newScore = previousScore + 1; // Keep the highest score
        }

        return Response.json({ score: newScore }, { status: 200 });

    } catch (error) {
        console.error("Error calculating score:", error);
        return Response.json({ error: "Failed to calculate score" }, { status: 500 });
    }
}
