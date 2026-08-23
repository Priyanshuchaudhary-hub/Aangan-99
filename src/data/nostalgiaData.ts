import { CassetteTrack, TrumpCard, SlamBookEntry, CRTChannel, AmbientLayerConfig } from '../types.ts';

export const CASSETTE_TRACKS: CassetteTrack[] = [
  // Side A
  {
    id: 'track-1',
    title: 'Doordarshan Signature Motif',
    artistOrSource: 'National Television Broadcast — 1982/1995',
    duration: '1:45',
    side: 'A',
    themeColor: '#d97706',
    tag: 'Television Nostalgia',
    vibeDescription: 'The spinning peacock spiral on black & white and early color televisions before evening transmission begins.',
    synthMelodyKey: 'doordarshan'
  },
  {
    id: 'track-2',
    title: 'Mile Sur Mera Tumhara',
    artistOrSource: 'Lok Seva Sanchar Parishad (1988)',
    duration: '3:10',
    side: 'A',
    themeColor: '#059669',
    tag: 'National Anthem of Childhood',
    vibeDescription: 'Bhimsen Joshi, Lata Mangeshkar, and Amitabh Bachchan smiling across the TV on Republic Day morning.',
    synthMelodyKey: 'milesur'
  },
  {
    id: 'track-3',
    title: 'Malgudi Days — Ta Na Na Theme',
    artistOrSource: 'L. Vaidyanathan / Shankar Nag (1986)',
    duration: '2:20',
    side: 'A',
    themeColor: '#b45309',
    tag: 'Sunday Morning Classic',
    vibeDescription: 'Swami running down the dusty streets of Malgudi with his slate, tanpura drones in the background.',
    synthMelodyKey: 'malgudi'
  },
  {
    id: 'track-4',
    title: 'Chaddi Pehen Ke Phool Khila Hai',
    artistOrSource: 'Jungle Book / Gulzar / Vishal Bhardwaj',
    duration: '2:40',
    side: 'A',
    themeColor: '#16a34a',
    tag: 'DD1 Sunday 9:00 AM',
    vibeDescription: 'Mowgli swinging on vines while the entire colony sits glued to the television before breakfast.',
    synthMelodyKey: 'junglebook'
  },

  // Side B
  {
    id: 'track-5',
    title: 'Indipop Summer Wave ’99',
    artistOrSource: 'Lucky Ali, Alisha Chinai & Euphoria',
    duration: '3:05',
    side: 'B',
    themeColor: '#dc2626',
    tag: 'Cassette Tape Gold',
    vibeDescription: 'Recorded directly off AIR FM Radio using a dual cassette deck with play+record pressed together.',
    synthMelodyKey: 'indipop'
  },
  {
    id: 'track-6',
    title: 'Shaktimaan Heroic Anthem',
    artistOrSource: 'Mukesh Khanna / DD National (1997)',
    duration: '2:15',
    side: 'B',
    themeColor: '#ea580c',
    tag: 'Saturday 12:00 PM',
    vibeDescription: 'Spinning around until you feel dizzy trying to fly like Gangadhar, waiting for "Chhoti Chhoti Magar Moti Baatein".',
    synthMelodyKey: 'shaktimaan'
  },
  {
    id: 'track-7',
    title: 'Monsoon Power Cut Acoustic',
    artistOrSource: 'Veranda Harmonica & Asbestos Rain',
    duration: '2:50',
    side: 'B',
    themeColor: '#0284c7',
    tag: 'Rainy Afternoon',
    vibeDescription: 'Sitting on the veranda steps, smelling wet mud (petrichor) while mom fries potato pakodas in the kitchen.',
    synthMelodyKey: 'powercut'
  },
  {
    id: 'track-8',
    title: 'Gully Cricket Golden Evening',
    artistOrSource: 'Evening Tennis Ball Echoes (1998)',
    duration: '2:30',
    side: 'B',
    themeColor: '#ca8a04',
    tag: 'Street Legend',
    vibeDescription: 'One tip one hand out, whoever hits the ball under Sharma ji’s scooter goes to fetch it.',
    synthMelodyKey: 'gully'
  }
];

export const TRUMP_CARDS: TrumpCard[] = [
  // Cricket 90s
  {
    id: 'c-1',
    name: 'Sachin Tendulkar',
    category: 'cricket',
    subtitle: 'The Desert Storm Maestro (1998)',
    rank: 1,
    stats: {
      battingOrPower: 99,
      matchesOrWeight: 463,
      centuriesOrTitles: 100,
      staminaOrStrikeRate: 92
    },
    signatureMoveOrShot: 'Straight Drive through Mid-Off',
    flavorText: 'When Sachin batted, the entire nation stopped traffic. Sharjah 1998 against Australia remains eternal.'
  },
  {
    id: 'c-2',
    name: 'Sourav Ganguly',
    category: 'cricket',
    subtitle: 'God of the Offside',
    rank: 3,
    stats: {
      battingOrPower: 91,
      matchesOrWeight: 311,
      centuriesOrTitles: 22,
      staminaOrStrikeRate: 88
    },
    signatureMoveOrShot: 'Stepping out over long-on for six',
    flavorText: 'First there was God, then there was the offside, and then there was Dada.'
  },
  {
    id: 'c-3',
    name: 'Rahul Dravid',
    category: 'cricket',
    subtitle: 'The Wall',
    rank: 4,
    stats: {
      battingOrPower: 93,
      matchesOrWeight: 344,
      centuriesOrTitles: 48,
      staminaOrStrikeRate: 98
    },
    signatureMoveOrShot: 'Impenetrable forward defensive block',
    flavorText: 'You could set your watch by his forward defence. Undaunted by any bowling attack in the world.'
  },
  {
    id: 'c-4',
    name: 'Brian Lara',
    category: 'cricket',
    subtitle: 'The Prince of Trinidad',
    rank: 2,
    stats: {
      battingOrPower: 96,
      matchesOrWeight: 299,
      centuriesOrTitles: 53,
      staminaOrStrikeRate: 90
    },
    signatureMoveOrShot: 'High backlift cover drive',
    flavorText: '400 not out in Tests, 501 in first-class. The majestic Prince whose batting was pure poetry.'
  },

  // WWF 90s
  {
    id: 'w-1',
    name: 'The Undertaker',
    category: 'wwf',
    subtitle: 'The Deadman / Lord of Darkness',
    rank: 1,
    stats: {
      battingOrPower: 98,
      matchesOrWeight: 320, // lbs
      centuriesOrTitles: 7,
      staminaOrStrikeRate: 99
    },
    signatureMoveOrShot: 'Tombstone Piledriver & Chokeslam',
    flavorText: 'The gong tolling in the dark arena sent chills down every 90s kid spine. Rumored to have 7 lives!'
  },
  {
    id: 'w-2',
    name: 'Stone Cold Steve Austin',
    category: 'wwf',
    subtitle: 'The Texas Rattlesnake',
    rank: 2,
    stats: {
      battingOrPower: 97,
      matchesOrWeight: 252,
      centuriesOrTitles: 6,
      staminaOrStrikeRate: 94
    },
    signatureMoveOrShot: 'Stone Cold Stunner (Austin 3:16)',
    flavorText: 'Glass shattering sound on TV followed by the baddest SOB stomping down the entrance ramp.'
  },
  {
    id: 'w-3',
    name: 'The Rock',
    category: 'wwf',
    subtitle: "The People's Champion",
    rank: 3,
    stats: {
      battingOrPower: 95,
      matchesOrWeight: 260,
      centuriesOrTitles: 8,
      staminaOrStrikeRate: 96
    },
    signatureMoveOrShot: "Rock Bottom & The People's Elbow",
    flavorText: 'Raising the People’s Eyebrow in front of the mirror before going to school.'
  },
  {
    id: 'w-4',
    name: 'Kane',
    category: 'wwf',
    subtitle: 'The Big Red Machine',
    rank: 5,
    stats: {
      battingOrPower: 94,
      matchesOrWeight: 323,
      centuriesOrTitles: 3,
      staminaOrStrikeRate: 93
    },
    signatureMoveOrShot: 'Hellfire Chokeslam',
    flavorText: 'Walking through ring fires with his red-and-black mask and electronic voice box.'
  }
];

export const SLAM_BOOK_INITIAL_ENTRIES: SlamBookEntry[] = [
  {
    id: 'slam-1',
    name: 'Bunty (Rohan Sharma)',
    nickname: 'Bunti / Master Blaster',
    year: '1999',
    city: 'Jaipur',
    favoriteCartoon: 'SWAT Kats & DuckTales',
    oneRupeeCandy: 'Phantom Sweet Cigarettes & Mango Mood',
    year2000DreamCareer: 'Cricket Captain or NASA Astronaut',
    bestMemory: 'The day electricity went off during final exam study, and mom brought a candle and Rasna to the terrace.',
    penColor: 'blue',
    timestamp: Date.now() - 86400000 * 12,
    doodleEmoji: '🏏'
  },
  {
    id: 'slam-2',
    name: 'Pooja Verma',
    nickname: 'Gudia',
    year: '2001',
    city: 'Lucknow',
    favoriteCartoon: 'Captain Planet & TaleSpin',
    oneRupeeCandy: 'Kismi Bar & Magic Pop (popping candy)',
    year2000DreamCareer: 'Fashion Designer & Archaeologist',
    bestMemory: 'Trading glitter gel pen refills and scent erasers under the desk during social studies period.',
    penColor: 'pink',
    timestamp: Date.now() - 86400000 * 9,
    doodleEmoji: '✨'
  },
  {
    id: 'slam-3',
    name: 'Monu (Abhishek Banerjee)',
    nickname: 'Cheeku',
    year: '1998',
    city: 'Kolkata',
    favoriteCartoon: 'Centurions (Power Xtreme!)',
    oneRupeeCandy: 'Poppins (fighting for the purple blackcurrant one)',
    year2000DreamCareer: 'Video Game Creator',
    bestMemory: 'Playing WWF Trump cards on the school bus and hiding my Undertaker card in the socks so nobody could take it.',
    penColor: 'purple',
    timestamp: Date.now() - 86400000 * 5,
    doodleEmoji: '📼'
  },
  {
    id: 'slam-4',
    name: 'Ananya Deshmukh',
    nickname: 'Anu',
    year: '2002',
    city: 'Pune',
    favoriteCartoon: 'Dexter’s Laboratory & Shaka Laka Boom Boom',
    oneRupeeCandy: 'Lacto King & Big Babol (making the biggest bubble)',
    year2000DreamCareer: 'Pilot flying across the clouds',
    bestMemory: 'Making paper boats out of rough notebook pages and timing them down the gutter during a heavy July downpour.',
    penColor: 'green',
    timestamp: Date.now() - 86400000 * 2,
    doodleEmoji: '⛵'
  }
];

export const CRT_CHANNELS: CRTChannel[] = [
  {
    id: 1,
    name: 'DD National (DD1)',
    showTitle: 'Malgudi Days & Shaktimaan',
    yearRange: '1986 – 2002',
    quote: '"Andhera Kayam Rahe!" — Tamraj Kilvish',
    staticFrequency: 18,
    imageSnippet: 'Swami sitting on the banyan tree branch',
    broadcastAudioKey: 'malgudi',
    description: 'The heartbeat of Indian television. Sunday mornings at 9:00 AM meant dead silence on the streets.'
  },
  {
    id: 2,
    name: 'DD Metro (DD2)',
    showTitle: 'Superhit Muqabla & Alif Laila',
    yearRange: '1993 – 2000',
    quote: '"Dekh Bhai Dekh, Shekhar Suman at his finest!"',
    staticFrequency: 42,
    imageSnippet: 'Baba Sehgal and Alisha Chinai top 10 countdown countdown',
    broadcastAudioKey: 'indipop',
    description: 'The cooler, urban sibling of DD1 with non-stop film songs, Indipop countdowns, and evening comedy serials.'
  },
  {
    id: 3,
    name: 'Cartoon Network 90s',
    showTitle: 'SWAT Kats, The Flintstones & Dexter',
    yearRange: '1995 – 2003',
    quote: '"T-Bone and Razor in the Turbokat jet!"',
    staticFrequency: 68,
    imageSnippet: 'The iconic black & white checkered logo banner',
    broadcastAudioKey: 'junglebook',
    description: 'Returning home from school at 3:30 PM, dropping the heavy school bag, and turning on the TV with a plate of Parle-G and milk.'
  },
  {
    id: 4,
    name: 'Doordarshan Krishi Darshan',
    showTitle: 'Evening News & Samachar',
    yearRange: '1975 – 2000',
    quote: '"Namaskar. Aaj ke mukhya samachar..."',
    staticFrequency: 88,
    imageSnippet: 'Rotating 3D metallic globe spinning with DD logo',
    broadcastAudioKey: 'doordarshan',
    description: 'The clock ticks down from 8:29 PM. Father asks everyone to be quiet for the 8:30 PM prime time news bulletin.'
  }
];

export const AMBIENT_LAYERS: AmbientLayerConfig[] = [
  {
    id: 'fan',
    name: 'Afternoon Usha Ceiling Fan',
    hindiName: 'दोपहर का पंखा',
    iconName: 'Fan',
    defaultVolume: 0.35,
    description: 'The sleepy, rhythmic hum of a 3-blade ceiling fan on a hot afternoon.'
  },
  {
    id: 'rain',
    name: 'Monsoon Rain on Asbestos Roof',
    hindiName: 'बारिश और टिन की छत',
    iconName: 'CloudRain',
    defaultVolume: 0.25,
    description: 'Heavy July raindrops drumming on roof tiles, distant thunder rolling.'
  },
  {
    id: 'cooker',
    name: 'Kitchen Pressure Cooker Seeti',
    hindiName: 'कुकर की सीटी',
    iconName: 'Flame',
    defaultVolume: 0.3,
    description: 'Mom boiling potatoes for evening aloo tikki; counting the 3 whistles.'
  },
  {
    id: 'koel',
    name: 'Evening Koel Bird & Crickets',
    hindiName: 'कोयल और झींगुर',
    iconName: 'Bird',
    defaultVolume: 0.2,
    description: 'Twilight birds calling from mango trees as streetlights flicker on.'
  },
  {
    id: 'gola',
    name: 'Ice Gola Cart Brass Bell',
    hindiName: 'बर्फ के गोले की घंटी',
    iconName: 'Bell',
    defaultVolume: 0.2,
    description: 'The street vendor ringing his tinkling bell selling Kala Khatta & Khas gola.'
  },
  {
    id: 'crthum',
    name: 'CRT Television 50Hz Hum',
    hindiName: 'सी.आर.टी टीवी की गुनगुनाहट',
    iconName: 'Tv',
    defaultVolume: 0.25,
    description: 'The high-frequency flyback transformer coil buzz and static glass charge.'
  },
  {
    id: 'keyboard',
    name: 'Cyber Cafe Mechanical Keyboard',
    hindiName: 'साइबर कैफे का कीबोर्ड',
    iconName: 'Monitor',
    defaultVolume: 0.25,
    description: 'TVS Gold / IBM Model M mechanical switch typing clatter.'
  },
  {
    id: 'radiostatic',
    name: 'All India Radio AM Static',
    hindiName: 'रेडियो की सरसराहट',
    iconName: 'Radio',
    defaultVolume: 0.2,
    description: 'Analog MW/SW frequency dial tuning whistles and white noise.'
  },
  {
    id: 'bus',
    name: 'State Roadways Diesel Bus',
    hindiName: 'रोडवेज़ बस का इंजन',
    iconName: 'Bus',
    defaultVolume: 0.3,
    description: 'Tata 1210 low frequency engine rumble and vibrating window glass.'
  },
  {
    id: 'train',
    name: 'Sleeper Class Track Clacks',
    hindiName: 'रेलवे पटरी की धड़क-धड़क',
    iconName: 'Train',
    defaultVolume: 0.3,
    description: 'Indian Railways rhythmic wheel joint clatter and distant WDM-2 horn.'
  },
  {
    id: 'schoolbell',
    name: 'Recess Brass Gong Bell',
    hindiName: 'स्कूल की पीतल की घंटी',
    iconName: 'Bell',
    defaultVolume: 0.25,
    description: 'Peon ringing the heavy brass bell on the verandah for interval.'
  },
  {
    id: 'traffic',
    name: 'Distant Colony Traffic & Horns',
    hindiName: 'सड़क का दूर का शोर',
    iconName: 'Wind',
    defaultVolume: 0.15,
    description: 'Bajaj Chetak scooters and gentle Indian horn taps in the distance.'
  }
];
