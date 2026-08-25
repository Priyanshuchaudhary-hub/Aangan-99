import { handleYouTubeResolve } from '../../server.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const title = (req.query?.title as string) || '';
    const artist = (req.query?.artist as string) || '';
    const rawQuery = (req.query?.q as string) || `${title} ${artist} official`;

    const { status, data } = await handleYouTubeResolve(rawQuery, title, artist);
    return res.status(status || 200).json(data);
  } catch (error: any) {
    console.error('[API YOUTUBE RESOLVE ERROR]', error?.message || error);
    return res.status(500).json({
      success: false,
      error: 'Failed to resolve YouTube track.'
    });
  }
}
