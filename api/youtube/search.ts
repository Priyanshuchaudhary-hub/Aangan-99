import { handleYouTubeSearch } from '../../server.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let query = '';
    let maxResults = 20;

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      query = body.query || body.q || '';
      maxResults = parseInt(body.maxResults || '20', 10);
    } else {
      query = (req.query?.q as string) || (req.query?.query as string) || '';
      maxResults = parseInt((req.query?.maxResults as string) || '20', 10);
    }

    const { status, data } = await handleYouTubeSearch(query, maxResults);

    const safeResults = (data.results || data.items || []).filter((item: any) => {
      return item && typeof item.videoId === 'string' && item.videoId.trim().length > 0;
    });

    return res.status(status || 200).json({
      success: data.success ?? true,
      items: safeResults,
      results: safeResults,
      primaryVideo: safeResults[0] || null,
      source: data.source || 'official_api'
    });
  } catch (error: any) {
    console.error('[API YOUTUBE SEARCH ERROR]', error?.message || error);
    return res.status(500).json({
      success: false,
      error: 'The YouTube archive search experienced an issue.',
      items: [],
      results: []
    });
  }
}
