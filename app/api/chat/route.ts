import { NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const {
      messages,
      model = "gpt-4o",
      system = "한국어로 답변해줘",
    } = await request.json();

    // Claude 모델인 경우
    if (model.startsWith("claude")) {
      const messageHistory = messages.map(
        (msg: { text: string; isUser: boolean }) => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text,
        })
      );

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 8192,
        messages: messageHistory,
        system,
      });

      return NextResponse.json({ message: (response.content[0] as { type: string; text: string }).text });
    }

    // OpenAI 모델인 경우
    const completion = await openai.chat.completions.create({
      messages: messages.map((msg: { text: string; isUser: boolean }) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
      })),
      model: model as "gpt-4o" | "gpt-4o-mini",
    });

    const reply = completion.choices[0].message.content;
    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 }
    );
  }
}
