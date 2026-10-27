import { GoogleGenAI, Type } from '@google/genai';

// Lazy Gemini Client with 'aistudio-build' User-Agent header per skill guidelines
let cachedAiClient = null;
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!cachedAiClient) {
    cachedAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return cachedAiClient;
}

/**
 * 1. Generate Complete Outfit Suggestions via Gemini 3.8 Flash
 */
export async function generateOutfitSuggestions(
  productContext,
  occasion,
  gender,
  catalogSummary = []
) {
  const prompt = `You are a world-class luxury fashion stylist for Apparellex, a 10-minute on-demand high-fashion delivery house in New York City.
Given the target product/focus: "${productContext}",
Target occasion/vibe: "${occasion}",
Gender preference: "${gender}",
Available catalog items: ${JSON.stringify(catalogSummary)}

Recommend a cohesive, fashion-forward ensemble from the available catalog items (pick 2-3 item IDs that best match).
Provide a sharp stylist rationale explaining silhouette proportions, color harmony, and why it fits a rapid 10-minute doorstep dispatch.`;

  try {
    const ai = getAiClient();
    if (!ai) throw new Error('GEMINI_API_KEY is not configured');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a high-fashion stylist for Apparellex NYC. Respond strictly in valid JSON format.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            aesthetic: { type: Type.STRING },
            occasion: { type: Type.STRING },
            stylistRationale: { type: Type.STRING },
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            stylingTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            colorHarmony: { type: Type.STRING },
          },
          required: [
            'title',
            'aesthetic',
            'occasion',
            'stylistRationale',
            'recommendedProductIds',
            'stylingTips',
            'colorHarmony',
          ],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    throw new Error('Empty model response');
  } catch (err) {
    console.warn('Gemini outfit generation fallback engaged:', err?.message);
    const firstTwoIds = catalogSummary.slice(0, 3).map((p) => p.id);
    return {
      title: `${occasion || 'Downtown Metropolitan'} Formulation`,
      aesthetic: 'Modern Urban Street Minimalist',
      occasion: occasion || 'SoHo Gallery & Evening Transit',
      stylistRationale:
        'Balanced architectural proportions pairing structured technical textures with fluid draping. Designed for high-speed transit and immediate doorstep fit.',
      recommendedProductIds: firstTwoIds.length > 0 ? firstTwoIds : ['prod-1', 'prod-4', 'prod-6'],
      stylingTips: [
        'Layer the technical outerwear unzipped for relaxed volume.',
        'Pair with minimalist leather sneakers or lug-sole combat boots.',
        'Roll the trouser cuff slightly to emphasize footwear silhouette.',
      ],
      colorHarmony: 'Matte Obsidian, Industrial Mineral Grey, and Coral Accents',
    };
  }
}

/**
 * 2. Generate Personalized Fit & Sizing Suggestions via Gemini 3.8 Flash
 */
export async function generateFitSuggestions(
  productName,
  productFit,
  height,
  weight,
  bodyType,
  preferredDrape
) {
  const prompt = `You are a master bespoke tailor for Apparellex luxury fashion.
Product: "${productName}" (Standard Cut: "${productFit}")
Customer dimensions:
- Height: ${height}
- Weight: ${weight}
- Body Profile: ${bodyType}
- Desired Drape: ${preferredDrape} (e.g. Slim Tailored, Relaxed Everyday, Voluminous Streetwear)

Determine the optimal size (XS, S, M, L, XL, or XXL) and explain how the garment will drape on their frame.`;

  try {
    const ai = getAiClient();
    if (!ai) throw new Error('GEMINI_API_KEY is not configured');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert luxury fashion tailor. Return strictly valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedSize: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            fitAnalysis: { type: Type.STRING },
            drapeDescription: { type: Type.STRING },
            alternativeSizeNote: { type: Type.STRING },
          },
          required: [
            'recommendedSize',
            'confidenceScore',
            'fitAnalysis',
            'drapeDescription',
            'alternativeSizeNote',
          ],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    throw new Error('Empty model response');
  } catch (err) {
    console.warn('Gemini fit suggestion fallback engaged:', err?.message);
    return {
      recommendedSize: 'M',
      confidenceScore: 94,
      fitAnalysis: `For ${height || 'average height'} and a ${preferredDrape || 'relaxed'} silhouette preference, size M offers a clean shoulder drop with comfortable room across the chest without ballooning.`,
      drapeDescription:
        'Hits right at the mid-hip with natural fabric drape along the torso. Zero tension when seated.',
      alternativeSizeNote:
        'If you prefer a pronounced oversized streetwear drape with extra sleeve stacking, size up to L. Remember: our 10-minute courier brings complimentary size swap backups for your 5-minute doorstep try-on!',
    };
  }
}

/**
 * 3. Generate Trending Fashion Aesthetics via Gemini 3.8 Flash
 */
export async function generateTrendSuggestions(vibe, catalogSummary = []) {
  const prompt = `You are a fashion trend forecaster in Lower Manhattan (SoHo / DUMBO).
Analyze current metropolitan trends for the aesthetic: "${vibe}".
Catalog available: ${JSON.stringify(catalogSummary)}
Select 2-4 product IDs that capture this trend and list the styling rules.`;

  try {
    const ai = getAiClient();
    if (!ai) throw new Error('GEMINI_API_KEY is not configured');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an NYC fashion trend forecaster. Return strictly valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            trendingAesthetics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            vibeDescription: { type: Type.STRING },
            featuredProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyStylingRules: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'headline',
            'trendingAesthetics',
            'vibeDescription',
            'featuredProductIds',
            'keyStylingRules',
          ],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    throw new Error('Empty model response');
  } catch (err) {
    console.warn('Gemini trend suggestion fallback engaged:', err?.message);
    return {
      headline: 'Architectural Tech-Minimalism',
      trendingAesthetics: [
        'Quiet Luxury Outerwear',
        'Deconstructed Utility Pants',
        'Raw-Edge Heavy Cottons',
        'Monochrome Layering',
      ],
      vibeDescription:
        'High-density Japanese fabrics meets utilitarian hardware. Sharp tailored lines designed to transition effortlessly from creative studio to evening dinner.',
      featuredProductIds: catalogSummary.slice(0, 3).map((p) => p.id),
      keyStylingRules: [
        'Balance oversized top layers with tapered technical bottoms.',
        'Limit outfit color palette to 2 core neutrals with 1 vibrant accent.',
        'Focus on texture contrast: smooth technical poplin against heavy loopback cotton.',
      ],
    };
  }
}

/**
 * 4. Natural Language Smart Search via Gemini 3.8 Flash
 */
export async function generateSmartSearch(userQuery, catalogSummary = []) {
  const prompt = `A user searched for: "${userQuery}".
Available store catalog: ${JSON.stringify(catalogSummary)}
Interpret the user's intent (aesthetic, weather, occasion, garment type).
Return the IDs of the best matching products (up to 4) with a personalized stylist note.`;

  try {
    const ai = getAiClient();
    if (!ai) throw new Error('GEMINI_API_KEY is not configured');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a smart shopping concierge for Apparellex. Return strictly valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interpretation: { type: Type.STRING },
            matchedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            stylistNote: { type: Type.STRING },
            suggestedTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['interpretation', 'matchedProductIds', 'stylistNote', 'suggestedTags'],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    throw new Error('Empty model response');
  } catch (err) {
    console.warn('Gemini smart search fallback engaged:', err?.message);
    const q = (userQuery || '').toLowerCase();
    const matched = catalogSummary
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      )
      .map((p) => p.id);

    return {
      interpretation: `Looking for curated fashion matching: "${userQuery}"`,
      matchedProductIds: matched.length > 0 ? matched.slice(0, 4) : catalogSummary.slice(0, 3).map((p) => p.id),
      stylistNote: `Hand-selected pieces aligned with your search query for rapid 10-minute dispatch.`,
      suggestedTags: ['Urban Streetwear', 'Minimalist Zen', 'Heavyweight Cottons', 'Luxury Fit'],
    };
  }
}
