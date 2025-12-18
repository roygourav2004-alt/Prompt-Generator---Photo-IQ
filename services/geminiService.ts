import { GoogleGenAI } from "@google/genai";
import { DesignPromptResult } from "../types";

const GEMINI_MODEL = 'gemini-3-pro-preview';

/**
 * Generates a detailed design prompt based on a reference image and new text content.
 * Uses the thinking model to analyze layout deeply.
 */
export const generateDesignPrompt = async (
  imageBase64: string,
  textContent: string
): Promise<DesignPromptResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const mimeType = 'image/jpeg'; // Assuming standard conversion, can be dynamic if needed
  // Clean base64 string if it contains the data url prefix
  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const systemInstruction = `
    You are an advanced prompt-generator. Your job is to create a highly detailed design prompt by combining two inputs: (A) a reference image and (B) the text provided by the user.
    
    Follow these instructions strictly:

    1. **Analyze the Reference Image (Input A)**
    Carefully study the reference image and describe the following elements with precision:
    * Layout structure (top, middle, bottom sections)
    * Background style and textures
    * Colors and gradients used
    * Typography style, font weight, font decoration
    * Placement of photos, icons, shapes
    * Borders, shadows, lighting, highlights
    * Styling of headings, subheadings, and body text
    * Overall theme (modern, premium, traditional, glossy, minimal, etc.)
    
    Extract the full design language from the reference image. Your job is to transfer this same design style into a new prompt.

    2. **Integrate Content (Input B)**
    The user has provided new text content. You must seamlessly integrate this text into the design description you created in step 1. 
    * Replace the original text found in the reference image description with the user's new text.
    * Maintain the original hierarchy (e.g., if the user provides a short title, map it to the large heading style from the reference; if they provide a paragraph, map it to the body text style).
    
    3. **Construct Final Prompt**
    Write a single, cohesive, highly descriptive prompt that instructs an AI image generator (like Imagen 3, Midjourney, or Stable Diffusion) to recreate the *exact* look and feel of the reference but with the *new* text.
    * Include technical details like "photorealistic", "vector art", "minimalist", "studio lighting", "8k resolution", etc., as observed in the reference.
    * The output must be a ready-to-use prompt.

    Output Format:
    Return ONLY the final prompt string. Do not include markdown formatting, headers, or conversational text. Just the raw prompt text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: `(A) Reference Image provided above.\n\n(B) New Text Content to integrate: "${textContent}"\n\nGenerate the highly detailed design prompt now.`
          }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: {
          thinkingBudget: 10240 // Allocate higher budget for deep visual analysis and mapping
        }
      }
    });

    const outputText = response.text || "No prompt generated.";
    
    return {
      prompt: outputText.trim()
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Helper to convert file to base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};