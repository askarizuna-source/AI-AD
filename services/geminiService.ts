import { GoogleGenAI, Type } from "@google/genai";
import { AdFormData, AdResult } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAdCopy = async (formData: AdFormData): Promise<AdResult[]> => {
  const modelId = 'gemini-2.5-flash';

  const systemInstruction = `
    You are an expert world-class marketing copywriter with 20 years of experience. 
    Your goal is to generate high-converting, persuasive, and creative advertisement copy.
    Strictly follow the user's constraints regarding platform, tone, and audience.
    
    Platform specific rules:
    - Instagram/TikTok: Visual, punchy, use hashtags if appropriate.
    - LinkedIn: Professional, value-driven.
    - Google Ads: Concise, keyword-rich headlines.
    - Email: Subject line (headline) and body content.
  `;

  const prompt = `
    Product/Service: ${formData.productName}
    Industry: ${formData.industry}
    Target Audience: ${formData.targetAudience}
    Platform: ${formData.platform}
    Tone: ${formData.tone}
    Desired CTA: ${formData.cta}
    Use Emojis: ${formData.includeEmojis ? "Yes, use relevant emojis" : "No emojis"}

    Generate 3 distinct variations (A/B/C testing) of ad copy.
    Variation 1 should focus on benefits.
    Variation 2 should focus on addressing a pain point.
    Variation 3 should be short and punchy.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8, // Slightly creative
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING, description: "The main hook or subject line" },
              body: { type: Type.STRING, description: "The main ad content" },
              ctaLine: { type: Type.STRING, description: "The closing call to action phrase" },
              explanation: { type: Type.STRING, description: "Brief marketing rationale for this variation" }
            },
            required: ["headline", "body", "ctaLine"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    const rawData = JSON.parse(jsonText);

    // Map response to our internal type and add IDs/Metadata
    return rawData.map((item: any) => ({
      id: crypto.randomUUID(),
      headline: item.headline,
      body: item.body,
      ctaLine: item.ctaLine,
      explanation: item.explanation,
      timestamp: Date.now(),
      metadata: formData
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate ad copy. Please try again.");
  }
};
