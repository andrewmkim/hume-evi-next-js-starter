import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { transcript, emotions } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Missing OpenAI API key.');
      return NextResponse.json({ error: "Missing OpenAI API key." }, { status: 500 });
    }

    // Only use the top 5 emotions
    const topEmotions = Object.fromEntries(
      Object.entries(emotions || {})
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
    );

    const prompt = `You are an expert emotional wellness therapist. Given the following transcript and emotion readings, provide a response in two short paragraphs:

Paragraph 1: Briefly summarize the user's emotional state and patterns based on the transcript and top emotions.
Paragraph 2: Offer gentle, supportive feedback and advice for the user's emotional well-being, as a compassionate therapist would. Be concise and empathetic.

Transcript:
${transcript}

Top 5 Emotion readings (0-1):
${JSON.stringify(topEmotions, null, 2)}

Respond with only two short paragraphs.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert emotional wellness therapist who provides empathetic, supportive analysis and guidance." },
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || "";
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: error?.toString() || "Unknown error" }, { status: 500 });
  }
} 