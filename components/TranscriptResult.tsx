"use client";

import { decodeHtml } from "@/lib/utils";
import { Button } from "./ui/button";

interface Transcript {
  text: string;
  duration: number;
  offset: number;
}

interface TranscriptResultProps {
  transcripts: Transcript[];
  translations: string[];
  summary: string;
  onTranslate: () => Promise<void>;
  translating: boolean;
  isKorean?: boolean;
}

export default function TranscriptResult({
  transcripts,
  translations,
  summary,
  onTranslate,
  translating,
  isKorean,
}: TranscriptResultProps) {
  if (!transcripts || transcripts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold dark:text-gray-100">타임라인</h2>
        {!isKorean && (
          <Button
            onClick={onTranslate}
            disabled={translating || translations.length > 0}
          >
            {translations.length > 0
              ? "번역됨"
              : translating
              ? "번역중..."
              : "한국어로 번역"}
          </Button>
        )}
      </div>

      {summary && !isKorean && (
        <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">
            주요 내용 요약
          </h3>
          <div className="text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap leading-relaxed">
            {decodeHtml(summary)}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {transcripts.map((transcript, index) => (
          <div
            key={index}
            className="p-4 rounded-md bg-gray-50 dark:bg-gray-800/50 transition"
          >
            {translations[index] && !isKorean && (
              <p className="mb-4 text-blue-600 dark:text-blue-400 leading-relaxed">
                {decodeHtml(translations[index])}
              </p>
            )}
            <p
              className={`dark:text-gray-200 leading-relaxed ${
                translations[index] ? "text-gray-600 dark:text-gray-400" : ""
              }`}
            >
              {decodeHtml(transcript.text)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {Math.floor(transcript.offset / 60)}분{" "}
              {Math.floor(transcript.offset % 60)}초 -{" "}
              {Math.floor((transcript.offset + transcript.duration) / 60)}분{" "}
              {Math.floor((transcript.offset + transcript.duration) % 60)}초
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
