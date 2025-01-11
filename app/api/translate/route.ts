import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarizeText(text: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a professional summarizer. Your task is to provide a summary in Korean with the following requirements:\n\n" +
          "1. Summarize the text into 5 key points\n" +
          "2. Each point should start with a bullet point (•)\n" +
          "3. Write in natural, fluent Korean\n" +
          "4. Keep the original nuance and tone\n" +
          "5. Focus on the main ideas and key messages\n" +
          "6. Make each point a complete sentence\n" +
          "7. Keep it concise and clear",
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  return completion.choices[0].message.content ?? "";
}

export async function POST(request: Request) {
  try {
    const { transcripts, mode } = await request.json();

    // 텍스트 모드일 때는 전체 텍스트를 하나로 합쳐서 번역
    if (mode === "text") {
      const combinedText = transcripts
        .map((t: { text: string }) => t.text)
        .join(" ");

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a professional translator. Translate the following English text to Korean. Provide only the translation, no explanations.",
          },
          {
            role: "user",
            content: combinedText,
          },
        ],
      });

      const translation = completion.choices[0].message.content ?? "";
      const summary = await summarizeText(translation);

      return NextResponse.json({
        translations: [translation],
        summary,
      });
    }

    // 타임라인 모드일 때는 각 자막을 개별적으로 번역
    const combinedText = transcripts
      .map((t: { text: string }, i: number) => `${i + 1}. ${t.text}`)
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator. Translate the following English subtitles to Korean. Keep the line numbers and maintain the same format. Only provide the translations, no explanations.",
        },
        {
          role: "user",
          content: combinedText,
        },
      ],
    });

    const translatedText = completion.choices[0].message.content ?? "";

    // Parse the translated text back into array
    const translatedLines = translatedText
      .split("\n")
      .filter((line) => line.trim());
    const translations = translatedLines.map((line) => {
      const match = line.match(/^\d+\.\s*(.+)$/);
      return match ? match[1].trim() : line.trim();
    });

    // 타임라인 모드에서도 전체 번역본에 대한 요약 제공
    const fullTranslation = translations.join(" ");
    const summary = await summarizeText(fullTranslation);

    return NextResponse.json({ translations, summary });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Failed to translate text" },
      { status: 500 }
    );
  }
}
