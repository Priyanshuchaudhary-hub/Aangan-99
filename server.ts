import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Memory Postcard / Telegram Generator
app.post('/api/memory/telegram', async (req, res) => {
  try {
    const { year = '1998', city = 'Doordarshan Nagar', memoryType = 'monsoon' } = req.body;
    const ai = getAI();

    const prompt = `You are an evocative Indian nostalgia storyteller writing a short, authentic, deeply tactile Indian postcard from the year ${year} in ${city}.
Context/Topic: ${memoryType}.
Tone: Deeply poetic, sensory, warm, bittersweet, and authentic Indian 90s/early 2000s childhood.
Include hyper-specific tactile details of that era (e.g. Doordarshan black-and-white/color CRT antenna adjustments, Bajaj Chetak scooter kickstarts, Rooh Afza in steel tumblers, Natraj 621 pencils, Kismi toffees, Phantom cigarettes, power cuts during summer cricket match, cassette rewinding with Natraj pencil, smell of petrichor on red brick rooftops, sound of evening pressure cooker whistle, DD Metro at 8 PM, Phantom comics, Uncle Chipps packets).

Return your response strictly in JSON format with this exact schema:
{
  "sender": "A name like 'Bunty', 'Guddu', 'Pooja', 'Rohan', 'Monu', 'Bittu'",
  "locationStamp": "City and Year stamp (e.g. 'Kanpur GPO — Summer 1999')",
  "headline": "A short poetic 4-7 word title",
  "postcardBody": "A 3-4 sentence paragraph that makes the reader immediately smell and feel the memory.",
  "psNote": "A charming P.S. note about something typical (e.g. 'P.S. Shaktimaan is on at 12 noon tomorrow, don\\'t forget!')",
  "ambientSoundscape": "Suggested sensory audio in 3 words (e.g. 'Tin roof rain + Far-off whistle')"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating memory telegram:', error);
    // Graceful fallback if offline or API key pending
    return res.json({
      success: true,
      data: {
        sender: 'Guddu',
        locationStamp: 'Patna Junction GPO — July 1998',
        headline: 'Rain drops on the asbestos roof',
        postcardBody: 'The power just tripped right in the middle of Captain Vyom. Ma made hot kanda bhajiyas and poured steaming ginger chai into the brass cups while we floated newspaper boats down the veranda drain.',
        psNote: 'P.S. Keep the Natraj pencil ready; the cassette ribbon got tangled again in the tape deck!',
        ambientSoundscape: 'Monsoon Rain + Ceiling Fan Creak'
      }
    });
  }
});

// 90s Memory Oracle
app.post('/api/memory/oracle', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const ai = getAI();
    const prompt = `You are the guardian spirit of 90s & 2000s Indian childhood nostalgia (The Aangan Memory Oracle). 
A visitor asks: "${question}".
Answer in 2-3 sentences. Fill your answer with heartfelt, authentic 90s Indian memories (Natraj, Doordarshan, Gold Spot, Campa Cola, Malgudi Days, WWF trump cards, Milton water bottles, cassette tapes, afternoon gully cricket, slam books, monsoon holidays). Speak gently, affectionately, like an old childhood friend reminiscing.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    return res.json({ success: true, answer: response.text });
  } catch (error: any) {
    console.error('Error in memory oracle:', error);
    return res.json({
      success: true,
      answer: 'Remember when afternoon meant watching ants trail across the veranda floor while the Usha ceiling fan droned sleepily overhead? That time never truly ended; it is just waiting whenever you close your eyes and listen to the rain.'
    });
  }
});

// Layer 13: AI Memory Generator Endpoint ("Tell me something you remember")
app.post('/api/memory/generate-card', async (req, res) => {
  try {
    const { memoryInput = '' } = req.body;
    if (!memoryInput || typeof memoryInput !== 'string' || memoryInput.trim().length === 0) {
      return res.status(400).json({ error: 'Please share a short memory.' });
    }

    const rawInput = memoryInput.trim();
    const ai = getAI();

    const prompt = `You are the AI Nostalgia Engine for "Aangan '99", an evocative Indian childhood memory machine.
The visitor enters a short personal memory snippet: "${rawInput}".

Transform this raw visitor memory into a nostalgic memory card.

CRITICAL INSTRUCTIONS:
1. Do NOT invent personal facts, names, or real-life details about the visitor that were not supplied.
2. Clearly distinguish creative/poetic text from the visitor's raw memory.
3. Keep the tone deeply nostalgic, sensory, warm, bittersweet, and grounded in authentic 90s/2000s Indian childhood imagery.

Return strictly valid JSON with this exact schema:
{
  "poeticTitle": "A short, evocative uppercase title (e.g. 'CRICKET UNTIL THE STREETLIGHTS')",
  "yearEraEstimate": "Estimated year or era based on context (e.g. 'Circa 1999 — Summer Evening')",
  "emotionalDescription": "Every evening had the same rule:\\n\\nCome home when the streetlights turn on.\\n\\nExcept nobody actually went home.",
  "sensoryDetails": ["Dust on scraped knees", "Faroff whistle of Ma calling from balcony", "Smell of evening petrichor & street dust"],
  "suggestedVisualMood": "Golden hour sunset fading over red brick rooftops, faded polaroid tint",
  "suggestedAmbientSound": "Distant tennis ball bounce + Evening bird chirps",
  "relatedMemories": ["Drinking cold Rasna from steel glasses", "Hiding tennis ball in sewer drain"],
  "userRawMemory": "${rawInput.replace(/"/g, '\\"')}"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in AI Memory Generator:', error);

    // Fallback response preserving user's raw memory input
    const fallbackText = req.body?.memoryInput || 'Playing cricket outside in summer';
    return res.json({
      success: true,
      data: {
        poeticTitle: fallbackText.toUpperCase().slice(0, 32),
        yearEraEstimate: 'Circa 1999 — Childhood Summer',
        emotionalDescription: `${fallbackText}.\n\nThe shadows grew long on the street, but time stood still until the evening lights turned on.`,
        sensoryDetails: ['Warm evening breeze', 'Faroff kitchen sounds', 'Cold water from brass jug'],
        suggestedVisualMood: 'Sepia golden hour lighting on vintage paper',
        suggestedAmbientSound: 'Distant chatter + Ceiling fan rhythm',
        relatedMemories: ['Summer holidays at Nani’s house', 'Paper boats in monsoon drain'],
        userRawMemory: fallbackText
      }
    });
  }
});

// Helper to parse ISO 8601 duration string (e.g., PT4M22S -> 262)
function parseISO8601Duration(durationStr: string): number {
  if (!durationStr) return 180;
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 180;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

// YouTube Data API v3 Resolution Endpoint (verifies status.embeddable === true via videos.list)
app.get('/api/youtube/resolve', async (req, res) => {
  try {
    const title = (req.query.title as string) || '';
    const artist = (req.query.artist as string) || '';
    const rawQuery = (req.query.q as string) || `${title} ${artist} official`;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      console.warn('[YOUTUBE SERVER] YOUTUBE_API_KEY is missing on server.');
      return res.status(400).json({
        success: false,
        error: 'YOUTUBE_API_KEY is not configured on the server.'
      });
    }

    // Step 1: Search YouTube for candidates
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('key', apiKey);
    searchUrl.searchParams.set('q', rawQuery.trim());
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('videoEmbeddable', 'true');
    searchUrl.searchParams.set('regionCode', 'IN');
    searchUrl.searchParams.set('relevanceLanguage', 'en');
    searchUrl.searchParams.set('maxResults', '10');

    const searchResponse = await fetch(searchUrl.toString());
    if (!searchResponse.ok) {
      console.error('[YOUTUBE SERVER] Search status:', searchResponse.status);
      return res.status(searchResponse.status).json({
        success: false,
        error: `YouTube search API returned status ${searchResponse.status}`
      });
    }

    const searchData = await searchResponse.json();
    if (!searchData.items || !Array.isArray(searchData.items) || searchData.items.length === 0) {
      return res.json({ success: false, error: 'No YouTube search results found.' });
    }

    const candidateIds = searchData.items
      .map((item: any) => item.id?.videoId)
      .filter((id: string | undefined) => Boolean(id));

    if (candidateIds.length === 0) {
      return res.json({ success: false, error: 'No video IDs found in search results.' });
    }

    // Step 2: Fetch video details including status (embeddable check) and contentDetails
    const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videosUrl.searchParams.set('key', apiKey);
    videosUrl.searchParams.set('part', 'snippet,status,contentDetails');
    videosUrl.searchParams.set('id', candidateIds.join(','));

    const videosResponse = await fetch(videosUrl.toString());
    if (!videosResponse.ok) {
      console.error('[YOUTUBE SERVER] Videos list status:', videosResponse.status);
      return res.status(videosResponse.status).json({
        success: false,
        error: `YouTube videos.list API returned status ${videosResponse.status}`
      });
    }

    const videosData = await videosResponse.json();
    if (!videosData.items || !Array.isArray(videosData.items)) {
      return res.json({ success: false, error: 'Failed to retrieve video details from YouTube.' });
    }

    // Step 3: Filter & Rank candidates with status.embeddable === true
    const embeddableCandidates = videosData.items.filter((item: any) => {
      const isEmbeddable = item.status?.embeddable === true;
      const isPublic = item.status?.privacyStatus === 'public';
      return isEmbeddable && isPublic;
    });

    if (embeddableCandidates.length === 0) {
      console.warn('[YOUTUBE SERVER] All candidates failed embeddable check!');
      return res.json({
        success: false,
        error: 'No embeddable YouTube videos found for this search.',
        allCandidatesEmbeddableFalse: true
      });
    }

    const scored = embeddableCandidates.map((item: any) => {
      const videoId = item.id;
      const snippet = item.snippet || {};
      const contentDetails = item.contentDetails || {};
      const itemTitle = snippet.title || '';
      const channelTitle = snippet.channelTitle || '';
      const durationSeconds = parseISO8601Duration(contentDetails.duration);

      let score = 0;
      const combinedText = `${itemTitle} ${channelTitle}`.toLowerCase();

      // Official label score boost
      if (/official|vevo|t-series|tseries|arijit|sony music|saregama|yrf|zee music|tips|venus|topic/i.test(channelTitle)) {
        score += 50;
      }
      if (/official video/i.test(itemTitle)) score += 30;
      if (/official audio|full song/i.test(itemTitle)) score += 25;
      if (/lyric video/i.test(itemTitle)) score += 15;

      // Penalties for low quality / cover / reaction / pitch shifted
      if (/cover|remix|reaction|slowed|reverb|8d|status|shorts|10 min|loop|pitch|karaoke/i.test(itemTitle)) {
        score -= 40;
      }

      // Duration check: standard song length 120s - 450s
      if (durationSeconds >= 120 && durationSeconds <= 450) {
        score += 10;
      } else if (durationSeconds > 900 || durationSeconds < 60) {
        score -= 30;
      }

      const thumbnail =
        snippet.thumbnails?.high?.url ||
        snippet.thumbnails?.medium?.url ||
        snippet.thumbnails?.default?.url ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      return {
        videoId,
        title: itemTitle,
        artist: channelTitle,
        channelTitle,
        thumbnail,
        durationSeconds,
        embeddable: true,
        verified: true,
        verifiedAt: new Date().toISOString(),
        score
      };
    });

    // Sort by score descending
    scored.sort((a: any, b: any) => b.score - a.score);

    const bestMatch = scored[0];
    const alternatives = scored.slice(1);

    return res.json({
      success: true,
      track: bestMatch,
      alternatives
    });
  } catch (error: any) {
    console.error('[YOUTUBE SERVER] Error resolving track:', error?.message || error);
    return res.status(500).json({
      success: false,
      error: 'Failed to resolve YouTube video on server.'
    });
  }
});

// YouTube Data API v3 Server-Side Search Endpoint
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = (req.query.q as string) || 'Arijit Singh - Tum Hi Ho';
    const limit = Math.min(parseInt((req.query.maxResults as string) || '20', 10), 25);
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      console.warn('[YOUTUBE SEARCH] YOUTUBE_API_KEY is not configured on server.');
      return res.status(400).json({
        success: false,
        error: 'YOUTUBE_API_KEY is not configured on the server. Please configure YOUTUBE_API_KEY in server environment settings.',
        quotaExceeded: false,
        apiKeyMissing: true
      });
    }

    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('q', query.trim());
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('videoEmbeddable', 'true');
    url.searchParams.set('regionCode', 'IN');
    url.searchParams.set('relevanceLanguage', 'en');
    url.searchParams.set('maxResults', limit.toString());

    const ytResponse = await fetch(url.toString());

    if (!ytResponse.ok) {
      console.error('[YOUTUBE SEARCH] YouTube API Status:', ytResponse.status);
      const isQuota = ytResponse.status === 403;
      return res.status(ytResponse.status).json({
        success: false,
        error: isQuota
          ? 'THE ARCHIVE HAS REACHED ITS DAILY LIMIT.'
          : `YouTube API returned HTTP status ${ytResponse.status}`,
        quotaExceeded: isQuota
      });
    }

    const data = await ytResponse.json();
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return res.json({ success: true, results: [] });
    }

    const videoIds = data.items.map((item: any) => item.id?.videoId).filter(Boolean);

    // Step 2: Additional Video Validation via videos.list (part=snippet,status,contentDetails)
    let videoDetailsMap: Record<string, { embeddable: boolean; durationSeconds: number; duration: string; year: number }> = {};
    if (videoIds.length > 0) {
      const vUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
      vUrl.searchParams.set('key', apiKey);
      vUrl.searchParams.set('part', 'snippet,status,contentDetails');
      vUrl.searchParams.set('id', videoIds.join(','));

      const vRes = await fetch(vUrl.toString());
      if (vRes.ok) {
        const vData = await vRes.json();
        if (vData.items && Array.isArray(vData.items)) {
          vData.items.forEach((item: any) => {
            const isEmbeddable = item.status?.embeddable === true && item.status?.privacyStatus === 'public';
            const durationSec = parseISO8601Duration(item.contentDetails?.duration || 'PT3M45S');
            const mins = Math.floor(durationSec / 60);
            const secs = durationSec % 60;
            const durationStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            const pubDate = item.snippet?.publishedAt ? new Date(item.snippet.publishedAt) : new Date();
            const year = isNaN(pubDate.getFullYear()) ? 2024 : pubDate.getFullYear();

            videoDetailsMap[item.id] = {
              embeddable: isEmbeddable,
              durationSeconds: durationSec,
              duration: durationStr,
              year
            };
          });
        }
      }
    }

    // Step 3: Smart Song Ranking & Filtering
    const rawResults = data.items
      .map((item: any) => {
        const videoId = item.id?.videoId || '';
        const snippet = item.snippet || {};
        const title = snippet.title || 'Unknown Video';
        const channelTitle = snippet.channelTitle || '';
        const details = videoDetailsMap[videoId] || {
          embeddable: true,
          durationSeconds: 225,
          duration: '03:45',
          year: 2024
        };

        const thumbnail =
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          snippet.thumbnails?.default?.url ||
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        // Smart Ranking Score Calculation
        let score = 50;
        const lowerTitle = title.toLowerCase();
        const lowerChannel = channelTitle.toLowerCase();
        const lowerQuery = query.toLowerCase();

        // 1. Exact Title / Query match
        if (lowerTitle.includes(lowerQuery)) score += 40;
        if (lowerTitle.startsWith(lowerQuery)) score += 20;

        // 2. Official label / verified channel / topic
        if (/official|vevo|t-series|tseries|sony music|zee music|yrf|saregama|tips|venus|eros now|speed records|white hill|times music|speed audio|arijit|shreya ghoshal|sonu nigam|kk|sunidhi|pritam|a\.r\. rahman|rahman|anirudh|topic/i.test(lowerChannel)) {
          score += 45;
        }

        // 3. Official video / audio tags
        if (/official video|music video/i.test(lowerTitle)) score += 30;
        if (/official audio|full song|audio/i.test(lowerTitle)) score += 25;
        if (/lyric video|lyrics/i.test(lowerTitle)) score += 15;

        // 4. Penalties for low quality / covers / reactions / fan edits
        if (/cover|reaction|slowed|reverb|8d|remix|mashup|status|shorts|10 min|1 hour|loop|pitch|nightcore|karaoke|instrumental/i.test(lowerTitle) && !lowerQuery.includes('cover') && !lowerQuery.includes('remix')) {
          score -= 50;
        }

        // 5. Song duration sanity (between 90s and 600s is normal for songs)
        if (details.durationSeconds >= 90 && details.durationSeconds <= 480) {
          score += 15;
        } else if (details.durationSeconds > 900 || details.durationSeconds < 60) {
          score -= 35;
        }

        return {
          videoId,
          title,
          channelTitle,
          thumbnail,
          embeddable: details.embeddable,
          duration: details.duration,
          durationSeconds: details.durationSeconds,
          year: details.year,
          publishedAt: snippet.publishedAt,
          score,
          externalUrl: `https://www.youtube.com/watch?v=${videoId}`
        };
      })
      .filter((item: any) => item.embeddable && item.videoId);

    // Sort descending by calculated score
    rawResults.sort((a: any, b: any) => b.score - a.score);

    return res.json({ success: true, results: rawResults });
  } catch (error: any) {
    console.error('Error handling /api/youtube/search endpoint:', error?.message || error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search YouTube via server endpoint.'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aangan 99 Nostalgia Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
