/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — PLAYLIST SYSTEM
   Curated playlists linking verified YouTube tracks to 90s nostalgia themes.
   ========================================================================= */

import { PlaylistData } from '../music/youtube/youtubeTypes.ts';

export const CURATED_PLAYLISTS: PlaylistData[] = [
  {
    id: 'summer-vacation',
    title: 'SUMMER VACATION MIX',
    description: 'Songs that sound like endless summer afternoons, Rooh Afza, and cooling desert coolers.',
    cover: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
    era: '1993-1999',
    mood: 'Sunny & Carefree',
    tracks: [
      'tr-mile-sur',
      'tr-malgudi-theme',
      'tr-jungle-book',
      'tr-purani-jeans',
      'tr-yaaron',
      'tr-dil-chahta-hai'
    ]
  },
  {
    id: 'desi-childhood',
    title: 'SUNDAY DOORDARSHAN GOLD',
    description: 'The sacred Sunday morning 9:00 AM lineup on DD1 National.',
    cover: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80',
    era: '1990-1998',
    mood: 'Morning Nostalgia',
    tracks: [
      'tr-dd-motif',
      'tr-jungle-book',
      'tr-shaktimaan',
      'tr-malgudi-theme',
      'tr-mile-sur'
    ]
  },
  {
    id: 'indipop-gold',
    title: 'INDIPOP REVOLUTION ’98',
    description: 'Channel V and MTV India cassette hits played on Walkmans.',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    era: '1995-2002',
    mood: 'Energetic Pop',
    tracks: [
      'tr-made-in-india',
      'tr-purani-jeans',
      'tr-tanha-dil',
      'tr-dooba-dooba',
      'tr-yaaron'
    ]
  },
  {
    id: 'school-bus-radio',
    title: 'SCHOOL BUS WINDOW MIX',
    description: 'Singalongs on yellow Tata school buses during end-of-term trips.',
    cover: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    era: '1996-2004',
    mood: 'Joyful & Travel',
    tracks: [
      'tr-yaaron',
      'tr-dil-chahta-hai',
      'tr-jungle-book',
      'tr-purani-jeans'
    ]
  },
  {
    id: 'terrace-9pm',
    title: 'TERRACE NIGHTS & VHS MEMORIES',
    description: 'Soft starlight ballads listening to walkmans on cold terrace cot blankets.',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    era: '1992-2001',
    mood: 'Peaceful & Late-Night',
    tracks: [
      'tr-pehla-nasha',
      'tr-tanha-dil',
      'tr-dooba-dooba',
      'tr-malgudi-theme'
    ]
  }
];
