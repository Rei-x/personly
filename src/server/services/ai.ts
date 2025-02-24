import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

import { env } from "@/env";

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
});
export const smartModel = openai("gpt-4o");

export const fastModel = openai("gpt-4o-mini");

export const generateTitle = async (note: string) => {
  const { text } = await generateText({
    model: fastModel,
    system: `You are an assistant that helps the user with naming their notes based on the content. 
        
        You reply only with the proposed title. Title should by short and descriptive.
        
        Rules:
        - Title should be short and descriptive
        - Title should be based on the content of the note
        - You respond only with the proposed title
        - You reply in the same language as the note content

        Examples of good titles:
        - Project manager, zostanie frontendem, problemy z projektem
        - Wizyta u lekarza, badania krwi, wyniki
        - Integracja na łyżwach, nowy projekt, spotkanie z klientem
        `,
    prompt: `<note>
            ${note}
          </note>`,
  });

  return text;
};

export const polishNote = async (note: string) => {
  const { text } = await generateText({
    model: smartModel,
    system: `You are an expert editor who helps polish and improve text while maintaining its original meaning and language.

    Rules:
    - Fix any grammar and spelling errors
    - Improve text structure for better readability
    - Maintain the original language of the text
    - Keep the original meaning and key points
    - Add paragraphs and line breaks where appropriate
    - Do not add any editorial comments or explanations
    - Reply only with the improved text
    `,
    prompt: note,
  });

  return text;
};
