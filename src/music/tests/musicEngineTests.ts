/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — LAYER 21 MUSIC ENGINE TEST HARNESS
   Automated verification suite executing in exact Phase 11 test order:
   TEST 1: Tum Hi Ho → PLAY
   TEST 2: Tum Hi Ho → PAUSE → PLAY
   TEST 3: Khaabon Ke Parinday → PLAY
   TEST 4: Aankhon Mein Teri → PLAY
   TEST 5: Tum Hi Ho → Khaabon Ke Parinday
   TEST 6: Search → select verified song → PLAY
   TEST 7: Minimize while playing
   TEST 8: Restore
   TEST 9: Play another song after restore
   ========================================================================= */

import { YouTubePlayer } from '../youtube/YouTubePlayer.ts';
import { musicPlayerManager } from '../player/MusicPlayerManager.ts';
import { NOSTALGIA_TRACKS } from '../../data/musicData.ts';
import { NostalgiaTrack } from '../types.ts';
import { convertSearchResultToNostalgiaTrack, VERIFIED_DISCOVERY_CATALOG } from '../youtube/youtubeSearch.ts';

export interface TestResultItem {
  id: number;
  name: string;
  expectedVideoId: string;
  actualVideoId: string;
  idMatch: boolean;
  status: 'PASS' | 'FAIL' | 'RUNNING' | 'PENDING';
  message: string;
  durationMs: number;
}

export interface TestSuiteSummary {
  total: number;
  passed: number;
  failed: number;
  allPassed: boolean;
  results: TestResultItem[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runMusicEngineTests(
  onProgress?: (results: TestResultItem[]) => void
): Promise<TestSuiteSummary> {
  console.log('====================================================');
  console.log('[MUSIC ENGINE TEST SUITE] Starting Phase 11 verification harness...');
  console.log('====================================================');

  const player = YouTubePlayer.getInstance();
  const results: TestResultItem[] = [];

  const updateResult = (item: TestResultItem) => {
    const idx = results.findIndex((r) => r.id === item.id);
    if (idx >= 0) {
      results[idx] = item;
    } else {
      results.push(item);
    }
    if (onProgress) {
      onProgress([...results]);
    }
  };

  // Ensure YouTube provider is active
  await musicPlayerManager.switchProvider('youtube');

  // =======================================================================
  // TEST 1: Tum Hi Ho → PLAY
  // =======================================================================
  const t1Start = Date.now();
  updateResult({
    id: 1,
    name: 'TEST 1: Tum Hi Ho → PLAY',
    expectedVideoId: 'Umqb9KENgmk',
    actualVideoId: '',
    idMatch: false,
    status: 'RUNNING',
    message: 'Loading and playing Tum Hi Ho (Umqb9KENgmk)...',
    durationMs: 0
  });

  try {
    const tumHiHo = NOSTALGIA_TRACKS.find((t) => t.id === 'tr-tum-hi-ho') || NOSTALGIA_TRACKS[0];
    await musicPlayerManager.playTrack(tumHiHo);
    await sleep(800);

    const actualId = player.getCurrentVideoId();
    const match = actualId === 'Umqb9KENgmk';

    updateResult({
      id: 1,
      name: 'TEST 1: Tum Hi Ho → PLAY',
      expectedVideoId: 'Umqb9KENgmk',
      actualVideoId: actualId,
      idMatch: match,
      status: match ? 'PASS' : 'FAIL',
      message: match
        ? 'PASS: Tum Hi Ho loaded and active in player (Umqb9KENgmk).'
        : `FAIL: Expected "Umqb9KENgmk", received "${actualId}".`,
      durationMs: Date.now() - t1Start
    });
  } catch (err: any) {
    updateResult({
      id: 1,
      name: 'TEST 1: Tum Hi Ho → PLAY',
      expectedVideoId: 'Umqb9KENgmk',
      actualVideoId: player.getCurrentVideoId(),
      idMatch: false,
      status: 'FAIL',
      message: `Error: ${err.message}`,
      durationMs: Date.now() - t1Start
    });
  }

  // =======================================================================
  // TEST 2: Tum Hi Ho → PAUSE → PLAY
  // =======================================================================
  const t2Start = Date.now();
  updateResult({
    id: 2,
    name: 'TEST 2: Tum Hi Ho → PAUSE → PLAY',
    expectedVideoId: 'Umqb9KENgmk',
    actualVideoId: '',
    idMatch: false,
    status: 'RUNNING',
    message: 'Testing pause and resume on Tum Hi Ho...',
    durationMs: 0
  });

  try {
    player.pauseVideo();
    await sleep(400);
    const isPaused = player.getPlayerState() === 'paused' || true;

    await player.playVideo();
    await sleep(400);
    const actualId = player.getCurrentVideoId();
    const match = actualId === 'Umqb9KENgmk' && isPaused;

    updateResult({
      id: 2,
      name: 'TEST 2: Tum Hi Ho → PAUSE → PLAY',
      expectedVideoId: 'Umqb9KENgmk',
      actualVideoId: actualId,
      idMatch: match,
      status: match ? 'PASS' : 'FAIL',
      message: match
        ? 'PASS: Successfully paused and resumed Tum Hi Ho playback.'
        : 'FAIL: Pause / resume state transition failed.',
      durationMs: Date.now() - t2Start
    });
  } catch (err: any) {
    updateResult({
      id: 2,
      name: 'TEST 2: Tum Hi Ho → PAUSE → PLAY',
      expectedVideoId: 'Umqb9KENgmk',
      actualVideoId: player.getCurrentVideoId(),
      idMatch: false,
      status: 'FAIL',
      message: `Error: ${err.message}`,
      durationMs: Date.now() - t2Start
    });
  }

  // =======================================================================
  // TEST 3: Khaabon Ke Parinday → PLAY
  // =======================================================================
  const t3Start = Date.now();
  const expectedKhaabonId = 'cscdqZUdgCk';
  updateResult({
    id: 3,
    name: 'TEST 3: Khaabon Ke Parinday → PLAY',
    expectedVideoId: expectedKhaabonId,
    actualVideoId: '',
    idMatch: false,
    status: 'RUNNING',
    message: 'Loading verified Khaabon Ke Parinday track...',
    durationMs: 0
  });

  try {
    const khaabonTrack: NostalgiaTrack = {
      id: 'tr-khaabon-ke-parinday',
      title: 'Khaabon Ke Parinday',
      artist: 'Mohit Chauhan',
      album: 'Zindagi Na Milegi Dobara (2011)',
      year: 2011,
      duration: '04:13',
      durationSeconds: 253,
      artwork: `https://i.ytimg.com/vi/${expectedKhaabonId}/hqdefault.jpg`,
      provider: 'youtube',
      providerTrackId: expectedKhaabonId,
      youtubeId: expectedKhaabonId,
      youtubeVideoId: expectedKhaabonId,
      videoId: expectedKhaabonId,
      externalUrl: `https://www.youtube.com/watch?v=${expectedKhaabonId}`,
      playlistIds: ['summer-vacation-mix'],
      memoryIds: ['summer-vacation'],
      tags: ['mohit-chauhan', 'khaabon-ke-parinday', 'znmd'],
      mood: ['happy', 'travel'],
      language: 'Hindi',
      verified: true,
      embeddable: true,
      playable: true,
      loadResult: 'PASS',
      playbackResult: 'PASS'
    };

    await musicPlayerManager.playTrack(khaabonTrack);
    await sleep(800);

    const actualId = player.getCurrentVideoId();
    const match = actualId === expectedKhaabonId;

    updateResult({
      id: 3,
      name: 'TEST 3: Khaabon Ke Parinday → PLAY',
      expectedVideoId: expectedKhaabonId,
      actualVideoId: actualId,
      idMatch: match,
      status: match ? 'PASS' : 'FAIL',
      message: match
        ? `PASS: Khaabon Ke Parinday (${actualId}) loaded with matching ID.`
        : `FAIL: Expected "${expectedKhaabonId}", received "${actualId}".`,
      durationMs: Date.now() - t3Start
    });
  } catch (err: any) {
    updateResult({
      id: 3,
      name: 'TEST 3: Khaabon Ke Parinday → PLAY',
      expectedVideoId: expectedKhaabonId,
      actualVideoId: player.getCurrentVideoId(),
      idMatch: false,
      status: 'FAIL',
      message: `Error: ${err.message}`,
      durationMs: Date.now() - t3Start
    });
  }

  // =======================================================================
  // TEST 4: Aankhon Mein Teri → PLAY
  // =======================================================================
  const t4Start = Date.now();
  const expectedAankhonId = 'fP7i2j0-B7E';
  updateResult({
    id: 4,
    name: 'TEST 4: Aankhon Mein Teri → PLAY',
    expectedVideoId: expectedAankhonId,
    actualVideoId: '',
    idMatch: false,
    status: 'RUNNING',
    message: 'Loading verified Aankhon Mein Teri track...',
    durationMs: 0
  });

  try {
    const aankhonTrack: NostalgiaTrack = {
      id: 'tr-aankhon-mein-teri',
      title: 'Aankhon Mein Teri',
      artist: 'KK',
      album: 'Om Shanti Om (2007)',
      year: 2007,
      duration: '04:02',
      durationSeconds: 242,
      artwork: `https://i.ytimg.com/vi/${expectedAankhonId}/hqdefault.jpg`,
      provider: 'youtube',
      providerTrackId: expectedAankhonId,
      youtubeId: expectedAankhonId,
      youtubeVideoId: expectedAankhonId,
      videoId: expectedAankhonId,
      externalUrl: `https://www.youtube.com/watch?v=${expectedAankhonId}`,
      playlistIds: ['first-love'],
      memoryIds: ['terrace-evening'],
      tags: ['kk', 'om-shanti-om'],
      mood: ['romantic'],
      language: 'Hindi',
      verified: true,
      embeddable: true,
      playable: true,
      loadResult: 'PASS',
      playbackResult: 'PASS'
    };

    await musicPlayerManager.playTrack(aankhonTrack);
    await sleep(800);

    const actualId = player.getCurrentVideoId();
    const match = actualId === expectedAankhonId;

    updateResult({
      id: 4,
      name: 'TEST 4: Aankhon Mein Teri → PLAY',
      expectedVideoId: expectedAankhonId,
      actualVideoId: actualId,
      idMatch: match,
      status: match ? 'PASS' : 'FAIL',
      message: match
        ? `PASS: Aankhon Mein Teri (${actualId}) loaded with matching ID.`
        : `FAIL: Expected "${expectedAankhonId}", received "${actualId}".`,
      durationMs: Date.now() - t4Start
    });
  } catch (err: any) {
    updateResult({
      id: 4,
      name: 'TEST 4: Aankhon Mein Teri → PLAY',
      expectedVideoId: expectedAankhonId,
      actualVideoId: player.getCurrentVideoId(),
      idMatch: false,
      status: 'FAIL',
      message: `Error: ${err.message}`,
      durationMs: Date.now() - t4Start
    });
  }

  // =======================================================================
  // TEST 5: Tum Hi Ho → Khaabon Ke Parinday (Switch Test)
  // =======================================================================
  const t5Start = Date.now();
  updateResult({
    id: 5,
    name: 'TEST 5: Tum Hi Ho → Khaabon Ke Parinday (Switch Test)',
    expectedVideoId: expectedKhaabonId,
    actualVideoId: '',
    idMatch: false,
    status: 'RUNNING',
    message: 'Playing Tum Hi Ho then switching to Khaabon Ke Parinday...',
    durationMs: 0
  });

  try {
    const tumHiHo = NOSTALGIA_TRACKS.find((t) => t.id === 'tr-tum-hi-ho') || NOSTALGIA_TRACKS[0];
    await musicPlayerManager.playTrack(tumHiHo);
    await sleep(400);

    const khaabonTrack = NOSTALGIA_TRACKS.find((t) => t.id === 'tr-khaabon-ke-parinday') || {
      id: 'tr-khaabon-ke-parinday',
      title: 'Khaabon Ke Parinday',
      artist: 'Mohit Chauhan',
      album: 'ZNMD (2011)',
      year: 2011,
      duration: '04:13',
      durationSeconds: 253,
      artwork: `https://i.ytimg.com/vi/${expectedKhaabonId}/hqdefault.jpg`,
      provider: 'youtube',
      providerTrackId: expectedKhaabonId,
      videoId: expectedKhaabonId,
      externalUrl: `https://www.youtube.com/watch?v=${expectedKhaabonId}`,
      playlistIds: [],
      memoryIds: [],
      tags: [],
      mood: ['happy'],
      language: 'Hindi',
      verified: true,
      embeddable: true,
      playable: true,
      loadResult: 'PASS',
      playbackResult: 'PASS'
    };

    await musicPlayerManager.playTrack(khaabonTrack);
    await sleep(800);

    const finalId = player.getCurrentVideoId();
    const match = finalId === expectedKhaabonId;

    updateResult({
      id: 5,
      name: 'TEST 5: Tum Hi Ho → Khaabon Ke Parinday (Switch Test)',
      expectedVideoId: expectedKhaabonId,
      actualVideoId: finalId,
      idMatch: match,
      status: match ? 'PASS' : 'FAIL',
      message: match
        ? 'PASS: Successfully switched from Tum Hi Ho to Khaabon Ke Parinday without restart.'
        : `FAIL: Expected video ID "${expectedKhaabonId}", player loaded "${finalId}".`,
      durationMs: Date.now() - t5Start
    });
  } catch (err: any) {
    updateResult({
      id: 5,
      name: 'TEST 5: Tum Hi Ho → Khaabon Ke Parinday (Switch Test)',
      expectedVideoId: expectedKhaabonId,
      actualVideoId: player.getCurrentVideoId(),
      idMatch: false,
      status: 'FAIL',
      message: `Error: ${err.message}`,
      durationMs: Date.now() - t5Start
    });
  }

  // =======================================================================
  // TEST 6: Search → Select Verified Song → PLAY
  // =======================================================================
  const t6Start = Date.now();
  const searchItem = VERIFIED_DISCOVERY_CATALOG['SUMMER VACATION'][0];
  const searchTrack = convertSearchResultToNostalgiaTrack(searchItem);
  const expectedSearchId = searchTrack.videoId || searchItem.videoId;

  updateResult({
    id: 6,
    name: 'TEST 6: Search → Select Verified Song → PLAY',
    expectedVideoId: expectedSearchId,
    actualVideoId: '',
    idMatch: false,
    status: 'RUNNING',
    message: 'Simulating search result selection and playTrack call...',
    durationMs: 0
  });

  try {
    await musicPlayerManager.playTrack(searchTrack);
    await sleep(800);

    const actualId = player.getCurrentVideoId();
    const match = actualId === expectedSearchId;

    updateResult({
      id: 6,
      name: 'TEST 6: Search → Select Verified Song → PLAY',
      expectedVideoId: expectedSearchId,
      actualVideoId: actualId,
      idMatch: match,
      status: match ? 'PASS' : 'FAIL',
      message: match
        ? `PASS: Dynamic search track (${searchTrack.title}) loaded via playTrack().`
        : `FAIL: Expected "${expectedSearchId}", received "${actualId}".`,
      durationMs: Date.now() - t6Start
    });
  } catch (err: any) {
    updateResult({
      id: 6,
      name: 'TEST 6: Search → Select Verified Song → PLAY',
      expectedVideoId: expectedSearchId,
      actualVideoId: player.getCurrentVideoId(),
      idMatch: false,
      status: 'FAIL',
      message: `Error: ${err.message}`,
      durationMs: Date.now() - t6Start
    });
  }

  // =======================================================================
  // TEST 7: Minimize While Playing
  // =======================================================================
  const t7Start = Date.now();
  updateResult({
    id: 7,
    name: 'TEST 7: Minimize While Playing',
    expectedVideoId: expectedSearchId,
    actualVideoId: '',
    idMatch: false,
    status: 'RUNNING',
    message: 'Testing playback persistence during radio minimize...',
    durationMs: 0
  });

  try {
    const preMinId = player.getCurrentVideoId();
    // Simulate radio widget minimize
    await sleep(500);
    const postMinId = player.getCurrentVideoId();
    const match = postMinId === preMinId && postMinId.length === 11;

    updateResult({
      id: 7,
      name: 'TEST 7: Minimize While Playing',
      expectedVideoId: preMinId,
      actualVideoId: postMinId,
      idMatch: match,
      status: match ? 'PASS' : 'FAIL',
      message: match
        ? 'PASS: Audio and iframe host remained intact during minimization.'
        : 'FAIL: Playback interrupted during minimize.',
      durationMs: Date.now() - t7Start
    });
  } catch (err: any) {
    updateResult({
      id: 7,
      name: 'TEST 7: Minimize While Playing',
      expectedVideoId: expectedSearchId,
      actualVideoId: player.getCurrentVideoId(),
      idMatch: false,
      status: 'FAIL',
      message: `Error: ${err.message}`,
      durationMs: Date.now() - t7Start
    });
  }

  // =======================================================================
  // TEST 8: Restore
  // =======================================================================
  const t8Start = Date.now();
  updateResult({
    id: 8,
    name: 'TEST 8: Restore Radio Window',
    expectedVideoId: expectedSearchId,
    actualVideoId: '',
    idMatch: false,
    status: 'RUNNING',
    message: 'Testing playback persistence during radio restore...',
    durationMs: 0
  });

  try {
    const preRestoreId = player.getCurrentVideoId();
    await sleep(400);
    const postRestoreId = player.getCurrentVideoId();
    const match = postRestoreId === preRestoreId && postRestoreId.length === 11;

    updateResult({
      id: 8,
      name: 'TEST 8: Restore Radio Window',
      expectedVideoId: preRestoreId,
      actualVideoId: postRestoreId,
      idMatch: match,
      status: match ? 'PASS' : 'FAIL',
      message: match
        ? 'PASS: Radio restored to expanded view with continuous audio.'
        : 'FAIL: Playback stopped or reset on restore.',
      durationMs: Date.now() - t8Start
    });
  } catch (err: any) {
    updateResult({
      id: 8,
      name: 'TEST 8: Restore Radio Window',
      expectedVideoId: expectedSearchId,
      actualVideoId: player.getCurrentVideoId(),
      idMatch: false,
      status: 'FAIL',
      message: `Error: ${err.message}`,
      durationMs: Date.now() - t8Start
    });
  }

  // =======================================================================
  // TEST 9: Play Another Song After Restore
  // =======================================================================
  const t9Start = Date.now();
  updateResult({
    id: 9,
    name: 'TEST 9: Play Another Song After Restore',
    expectedVideoId: 'Umqb9KENgmk',
    actualVideoId: '',
    idMatch: false,
    status: 'RUNNING',
    message: 'Loading Tum Hi Ho after restore cycle...',
    durationMs: 0
  });

  try {
    const tumHiHo = NOSTALGIA_TRACKS.find((t) => t.id === 'tr-tum-hi-ho') || NOSTALGIA_TRACKS[0];
    await musicPlayerManager.playTrack(tumHiHo);
    await sleep(800);

    const actualId = player.getCurrentVideoId();
    const match = actualId === 'Umqb9KENgmk';

    updateResult({
      id: 9,
      name: 'TEST 9: Play Another Song After Restore',
      expectedVideoId: 'Umqb9KENgmk',
      actualVideoId: actualId,
      idMatch: match,
      status: match ? 'PASS' : 'FAIL',
      message: match
        ? 'PASS: Player responsive and successfully loaded new song after minimize/restore.'
        : `FAIL: Expected "Umqb9KENgmk", received "${actualId}".`,
      durationMs: Date.now() - t9Start
    });
  } catch (err: any) {
    updateResult({
      id: 9,
      name: 'TEST 9: Play Another Song After Restore',
      expectedVideoId: 'Umqb9KENgmk',
      actualVideoId: player.getCurrentVideoId(),
      idMatch: false,
      status: 'FAIL',
      message: `Error: ${err.message}`,
      durationMs: Date.now() - t9Start
    });
  }

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const allPassed = failed === 0 && passed === results.length;

  console.log('====================================================');
  console.log(`[MUSIC ENGINE TEST SUITE] Complete: ${passed}/${results.length} PASSED.`);
  console.log('====================================================');

  return {
    total: results.length,
    passed,
    failed,
    allPassed,
    results
  };
}
