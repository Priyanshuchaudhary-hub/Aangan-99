import { NOSTALGIA_IMAGES } from '../assets/imagePaths.ts';

export type MemoryViewerStyle = 'diary' | 'photograph' | 'cassette' | 'computer-folder' | 'television';

export interface MemoryItem {
  id: string;
  title: string;
  hindiTitle: string;
  year: number;
  location: string;
  category: 'vacation' | 'daily' | 'tech' | 'screen' | 'food' | 'games' | 'travel';
  emotionalDescription: string;
  extendedStory: string;
  visualImage?: string;
  visualEmoji: string;
  accentColor: string;
  viewerStyle: MemoryViewerStyle;
  audioEffect?: 'fan' | 'crthum' | 'keyboard' | 'radiostatic' | 'bus' | 'train' | 'schoolbell' | 'rain' | 'pencil' | 'melody';
  melodyKey?: 'doordarshan' | 'milesur' | 'malgudi' | 'junglebook' | 'indipop' | 'shaktimaan' | 'powercut' | 'gully';
  animationType: 'pulse-glow' | 'scanline-drift' | 'spool-spin' | 'ink-spread' | 'rain-shimmer' | 'flicker';
  hiddenDetail: {
    prompt: string;
    revealedText: string;
    secretItemName: string;
  };
  tags: string[];
  relatedMemoryIds: string[]; // Connected memory web
}

export const MEMORY_EXPLORER_ITEMS: MemoryItem[] = [
  {
    id: 'mem-summer-vacation',
    title: 'Summer Vacation',
    hindiTitle: 'गर्मियों की छुट्टियाँ और नानी का घर',
    year: 1996,
    location: 'Nani’s House Verandah, Bareilly',
    category: 'vacation',
    emotionalDescription: 'Two whole months with zero alarm clocks, mango juice dripping down sticky elbows, and board games on cold mosaic floors while the desert cooler hums.',
    extendedStory: 'The journey began with the breathless packing of steel VIP suitcases. Arriving at Nani’s courtyard meant unbounded freedom — climbing guava trees, sleeping on the open terrace under a sea of stars, sipping chilled Rooh Afza in silver tumblers, and counting days by how many cricket overs we played.',
    visualImage: NOSTALGIA_IMAGES.room,
    visualEmoji: '🥭',
    accentColor: '#f59e0b',
    viewerStyle: 'diary',
    audioEffect: 'fan',
    melodyKey: 'malgudi',
    animationType: 'ink-spread',
    hiddenDetail: {
      prompt: 'Scratch the back corner of Nani\'s diary...',
      revealedText: 'Found: A dried Peepal leaf with gold paint veins tucked inside page 42 alongside a handwritten recipe for raw mango aam panna.',
      secretItemName: 'Preserved Peepal Leaf Bookmark'
    },
    tags: ['Summer', 'Holidays', 'Rooh Afza', 'Cooler', 'Nani Ghar'],
    relatedMemoryIds: ['mem-cricket-mom-calls', 'mem-rain-terrace', 'mem-orange-candy', 'mem-railway-journey']
  },
  {
    id: 'mem-first-computer',
    title: 'First Computer',
    hindiTitle: 'पहला पर्सनल कंप्यूटर और Windows 98',
    year: 2000,
    location: 'Study Room Corner Table',
    category: 'tech',
    emotionalDescription: 'A heavy beige CRT monitor covered with an embroidered dust cloth, clicky mechanical keyboard, and the magical sound of Windows 98 booting up.',
    extendedStory: 'We spent hours drawing spray-paint masterpieces in MS Paint, panicking over the ticking clock in Minesweeper, and watching 3D Pipes screensavers snake endlessly across the screen. Touching the glass screen sent tiny static sparks dancing across your fingertips.',
    visualImage: NOSTALGIA_IMAGES.childhoodItems,
    visualEmoji: '🖥️',
    accentColor: '#38bdf8',
    viewerStyle: 'computer-folder',
    audioEffect: 'keyboard',
    melodyKey: 'indipop',
    animationType: 'scanline-drift',
    hiddenDetail: {
      prompt: 'Inspect C:\\MY_DOCUMENTS\\HIDDEN...',
      revealedText: 'Found: A 1.44MB Sony floppy disk containing 12 MIDI ringtone files and a scanned picture of Sachin Tendulkar in 256 colors.',
      secretItemName: '3.5" Floppy Disk with Road Rash Cheats'
    },
    tags: ['Windows 98', 'MS Paint', 'Minesweeper', 'Floppy', 'CRT'],
    relatedMemoryIds: ['mem-first-internet', 'mem-video-game-parlour', 'mem-first-mobile']
  },
  {
    id: 'mem-sunday-cartoon',
    title: 'Sunday Cartoon',
    hindiTitle: 'रविवार सुबह: जंगल बुक और डकटेल्स',
    year: 1994,
    location: 'Living Room Diwan, Front of Onida CRT',
    category: 'screen',
    emotionalDescription: 'Waking up before anyone else on Sunday morning, wrapping into a thin bedsheet, and waiting for "Chaddi Pehen Ke Phool Khila Hai" to start.',
    extendedStory: 'Sunday TV was an unbroken sacred ritual. From Mowgli howling in Seoni jungles to Scrooge McDuck swimming in gold coins, followed immediately by Shaktimaan spinning to defeat Kilwish. Lunch was always eaten cross-legged on the rug without moving eyes away from the screen.',
    visualImage: NOSTALGIA_IMAGES.childhoodItems,
    visualEmoji: '📺',
    accentColor: '#fbbf24',
    viewerStyle: 'television',
    audioEffect: 'crthum',
    melodyKey: 'junglebook',
    animationType: 'scanline-drift',
    hiddenDetail: {
      prompt: 'Adjust the rabbit-ear antenna angle...',
      revealedText: 'Found: The original handwritten Sunday TV timetable cut out from the Dainik Jagran newspaper folded into the TV guide slot.',
      secretItemName: '1995 DD Metro Program Schedule'
    },
    tags: ['Jungle Book', 'DuckTales', 'Shaktimaan', 'Doordarshan', 'Sunday'],
    relatedMemoryIds: ['mem-sunday-movie', 'mem-power-cut', 'mem-orange-candy']
  },
  {
    id: 'mem-orange-candy',
    title: '₹5 Orange Ice Candy',
    hindiTitle: 'पाँच रुपये वाली संतरा पेप्सी और आइस लॉली',
    year: 1997,
    location: 'Outside School Gate & Gali Corner',
    category: 'food',
    emotionalDescription: 'The icy sour tang of orange and kala khatta ice candies sucked straight out of narrow plastic sleeves after school dispersal.',
    extendedStory: 'Nothing tasted better after sweating through 8 periods of school. The vendor with his insulated thermocol wooden pushcart would break open blocks of ice covered in sawdust, pulling out neon-colored tubes that turned your whole tongue bright electric orange.',
    visualImage: NOSTALGIA_IMAGES.childhoodItems,
    visualEmoji: '🍧',
    accentColor: '#f97316',
    viewerStyle: 'photograph',
    audioEffect: 'fan',
    melodyKey: 'gully',
    animationType: 'pulse-glow',
    hiddenDetail: {
      prompt: 'Flip the faded Polaroid print over...',
      revealedText: 'Backnote: "May 1997 — Rohan challenged me to eat 3 Kala Khatta sticks back-to-back without making a sour face. I won."',
      secretItemName: 'Stained Wooden Ice Cream Stick with 2x Winner Token'
    },
    tags: ['Pepsi Cola', 'Ice Lolly', 'School Break', 'Kala Khatta', 'Summer'],
    relatedMemoryIds: ['mem-summer-vacation', 'mem-cricket-mom-calls', 'mem-school-assembly']
  },
  {
    id: 'mem-cricket-mom-calls',
    title: 'Cricket Until Mom Calls',
    hindiTitle: 'शाम का गली क्रिकेट जब तक माँ ना पुकारे',
    year: 1998,
    location: 'Colony Dead-End Gali',
    category: 'games',
    emotionalDescription: 'Using red bricks as wickets, arguing fiercely over "one-tip-one-hand" catches, and pretending not to hear mom shouting from the balcony.',
    extendedStory: 'Every evening at 4:30 PM sharp, tennis balls with taped seams bounced off boundary walls. Rules were customized on the spot: hitting the Sharma uncle\'s window was automatic out and ball-retrieval duty. The game only ended when daylight completely bled into dusk.',
    visualImage: NOSTALGIA_IMAGES.childhoodItems,
    visualEmoji: '🏏',
    accentColor: '#22c55e',
    viewerStyle: 'photograph',
    audioEffect: 'melody',
    melodyKey: 'gully',
    animationType: 'pulse-glow',
    hiddenDetail: {
      prompt: 'Inspect the seam on the tennis ball...',
      revealedText: 'Found: A yellow Cosco heavy-duty tennis ball wrapped with three layers of red electrical insulation tape for extra reverse swing.',
      secretItemName: 'Taped Heavy Tennis Ball'
    },
    tags: ['Gully Cricket', 'Evening', 'Cosco Ball', 'Brick Wickets', 'Dusk'],
    relatedMemoryIds: ['mem-summer-vacation', 'mem-neighbourhood-cricket', 'mem-rain-terrace', 'mem-power-cut']
  },
  {
    id: 'mem-std-booth',
    title: 'The Local STD PCO Booth',
    hindiTitle: 'लोकल एस.टी.डी / पी.सी.ओ बूथ',
    year: 1995,
    location: 'Yellow Painted Corner Shop',
    category: 'daily',
    emotionalDescription: 'Waiting in line while the red digital LED meter rapidly clicked up call units at ₹1.20 per pulse on the dot-matrix printed receipt.',
    extendedStory: 'Making an outstation trunk call to chacha in Mumbai was an event that required notes prepared on paper beforehand so no seconds were wasted. The small wooden soundproof booth smelled of hot dust, telephone plastic, and faint incense from the counter shrine.',
    visualImage: NOSTALGIA_IMAGES.room,
    visualEmoji: '☎️',
    accentColor: '#eab308',
    viewerStyle: 'photograph',
    audioEffect: 'radiostatic',
    melodyKey: 'milesur',
    animationType: 'flicker',
    hiddenDetail: {
      prompt: 'Look under the yellow rotary dial phone...',
      revealedText: 'Found: A crumpled slip of blue carbon paper with outstation STD dialing codes (011 for Delhi, 022 for Mumbai, 080 for Bangalore).',
      secretItemName: 'Carbon Paper STD Rate Receipt'
    },
    tags: ['STD PCO', 'Yellow Sign', 'Rotary Dial', 'Trunk Call', 'LED Meter'],
    relatedMemoryIds: ['mem-first-mobile', 'mem-railway-journey', 'mem-old-photo-album']
  },
  {
    id: 'mem-school-assembly',
    title: 'School Assembly',
    hindiTitle: 'सुबह की प्रार्थना और पीटी ड्रिल',
    year: 1999,
    location: 'School Quadrangle Ground (8:00 AM)',
    category: 'daily',
    emotionalDescription: 'Standing strictly in line by height order in freshly starched white uniforms, nervously hiding unpolished Bata shoes or untrimmed fingernails.',
    extendedStory: 'The smell of morning dew mixed with white chalk on blackboards. Reciting "Where the Mind is Without Fear", hands clasped in prayer, followed by left-right-left march past to the brass side-drum beat. If you felt dizzy under the scorching morning sun, you got escorted to the sick room for glucose water.',
    visualImage: NOSTALGIA_IMAGES.childhoodItems,
    visualEmoji: '🏫',
    accentColor: '#6366f1',
    viewerStyle: 'diary',
    audioEffect: 'schoolbell',
    melodyKey: 'milesur',
    animationType: 'ink-spread',
    hiddenDetail: {
      prompt: 'Check the inside back cover of the School Diary...',
      revealedText: 'Found: A stamped page of House Prefect merit stickers and a note signed in red ink: "Late arrival marked on 14th July — 5 mins delay due to rain."',
      secretItemName: '1999 School Almanac with Blue Badge'
    },
    tags: ['Assembly', 'White Uniform', 'Bata Shoes', 'March Past', 'Prayer'],
    relatedMemoryIds: ['mem-orange-candy', 'mem-cricket-mom-calls', 'mem-rain-terrace']
  },
  {
    id: 'mem-power-cut',
    title: 'Summer Night Power Cut',
    hindiTitle: 'गर्मियों की बिजली गुल और मोमबत्ती की छांव',
    year: 1996,
    location: 'Open Rooftop Terrace & Courtyard',
    category: 'daily',
    emotionalDescription: 'The sudden silence when the fans died, dragging folding cots onto the roof, listening to elders tell ghost stories by flickering candlelight.',
    extendedStory: 'The whole colony plunged into dark silhouette. Neighbors emerged onto balconies to chat across railings. Grandfather would wave a hand-woven bamboo hand-fan (pankha) while kids made shadow animals — wolves and flapping birds — against the whitewashed wall with candlelight.',
    visualImage: NOSTALGIA_IMAGES.room,
    visualEmoji: '🕯️',
    accentColor: '#fb923c',
    viewerStyle: 'diary',
    audioEffect: 'melody',
    melodyKey: 'powercut',
    animationType: 'flicker',
    hiddenDetail: {
      prompt: 'Gently scratch the wax drop on the diary page...',
      revealedText: 'Found: A brass safety matchbox with single unburned match and the lingering smell of petrichor and mosquito coils.',
      secretItemName: 'Tortoise Brand Mosquito Coil Stand'
    },
    tags: ['Power Cut', 'Candles', 'Terrace', 'Shadow Puppets', 'Night Stories'],
    relatedMemoryIds: ['mem-rain-terrace', 'mem-summer-vacation', 'mem-cricket-mom-calls', 'mem-sunday-movie']
  },
  {
    id: 'mem-first-mobile',
    title: 'First Mobile Phone (Nokia 3310)',
    hindiTitle: 'पहला नोकिया 3310 और स्नेक 2 गेम',
    year: 2002,
    location: 'Dad’s Belt Holster',
    category: 'tech',
    emotionalDescription: 'Indestructible monochrome blue brick with green backlight, monophonic ringtone composer, and endless sessions of Snake II.',
    extendedStory: 'Incoming calls cost ₹4 per minute, so we mastered the art of "missed calls" — one ring meant "I have arrived", two rings meant "Call me back". Composing custom Bollywood tunes using numbered keypresses was peak programmer status.',
    visualImage: NOSTALGIA_IMAGES.childhoodItems,
    visualEmoji: '📱',
    accentColor: '#10b981',
    viewerStyle: 'computer-folder',
    audioEffect: 'melody',
    melodyKey: 'indipop',
    animationType: 'scanline-drift',
    hiddenDetail: {
      prompt: 'Open the removable clip-on back panel...',
      revealedText: 'Found: High score of 1840 on Snake II (9 labyrinth mode) and an Airtel 16KB SIM card stored inside a plastic pouch.',
      secretItemName: 'Translucent Neon Blue Xpress-on Cover'
    },
    tags: ['Nokia 3310', 'Snake Game', 'Monophonic', 'Missed Call', 'SMS'],
    relatedMemoryIds: ['mem-first-computer', 'mem-first-internet', 'mem-std-booth']
  },
  {
    id: 'mem-rain-terrace',
    title: 'Rain on the Terrace',
    hindiTitle: 'छत पर पहली मानसूनी बारिश और कागज़ की कश्ती',
    year: 1999,
    location: 'Open Red Brick Terrace',
    category: 'vacation',
    emotionalDescription: 'The irresistible fragrance of dry hot earth drinking the first fat monsoon drops (mitti ki khushboo) as everyone ran upstairs to get soaked.',
    extendedStory: 'Drying chillies and papads were frantically gathered as grey thunderclouds rolled in. Getting drenched on the terrace until your lips turned blue, followed by steaming hot onion pakodas with sweet tamarind chutney while watching water gush down through the drain pipe.',
    visualImage: NOSTALGIA_IMAGES.monsoonBoat,
    visualEmoji: '🌧️',
    accentColor: '#0ea5e9',
    viewerStyle: 'photograph',
    audioEffect: 'rain',
    melodyKey: 'powercut',
    animationType: 'rain-shimmer',
    hiddenDetail: {
      prompt: 'Check the waterlogged puddle reflection...',
      revealedText: 'Found: An origami boat made from the comic pages of Diamond Comics (Pinki & Billoo) floating steadily past the drain grating.',
      secretItemName: 'Diamond Comics Waterproof Paper Boat'
    },
    tags: ['Monsoon', 'Petrichor', 'Pakodas', 'Paper Boats', 'Terrace'],
    relatedMemoryIds: ['mem-summer-vacation', 'mem-power-cut', 'mem-cricket-mom-calls', 'mem-railway-journey']
  },
  {
    id: 'mem-railway-journey',
    title: 'Railway Journey (Sleeper Class)',
    hindiTitle: 'स्लीपर क्लास की खिड़की वाली सीट और चाय-गरम',
    year: 1997,
    location: 'Indian Railways Coach S-4 Berth 53',
    category: 'travel',
    emotionalDescription: 'Blue Rexine berths, the wind rushing through horizontal iron bars, and the hypnotic chant of "Chai-Garam, Chai-Garam" at every station.',
    extendedStory: 'Unfolding the metal washbasin, eating cold puris wrapped in silver foil with spicy aloo sabzi, and fighting with cousins for the top berth. Counting electric poles as they whizzed past and waving excitedly at buffaloes and farmers in open mustard fields.',
    visualImage: NOSTALGIA_IMAGES.room,
    visualEmoji: '🚂',
    accentColor: '#15803d',
    viewerStyle: 'photograph',
    audioEffect: 'train',
    melodyKey: 'milesur',
    animationType: 'pulse-glow',
    hiddenDetail: {
      prompt: 'Inspect the reservation chart pasted near the door...',
      revealedText: 'Found: Computerized PNR printout slip showing "CNF S4-53 (MB) / 54 (UB) — Fare: ₹185 including sleeper surcharge".',
      secretItemName: '1997 PRS Computerized Reservation Chart'
    },
    tags: ['Indian Railways', 'Sleeper Class', 'Chai', 'Puris', 'Top Berth'],
    relatedMemoryIds: ['mem-summer-vacation', 'mem-std-booth', 'mem-rain-terrace', 'mem-old-photo-album']
  },
  {
    id: 'mem-video-game-parlour',
    title: 'Video Game Parlour',
    hindiTitle: 'वीडियो गेम पार्लर और 2 रुपये का टोकन',
    year: 2001,
    location: 'Dark Basement Arcade, Market Gali',
    category: 'games',
    emotionalDescription: 'Exchanging crumpled 2-rupee notes for brass tokens to play Street Fighter II, Mustapha (Cadillacs and Dinosaurs), and Tekken 3.',
    extendedStory: 'A dimly lit room buzzing with neon cathode tubes, joystick clicks, and sweaty quarters. A crowd of 15 kids would gather behind whoever had chosen Jin Kazama or Ken Masters to watch their flawless combo execution.',
    visualImage: NOSTALGIA_IMAGES.childhoodItems,
    visualEmoji: '🕹️',
    accentColor: '#ec4899',
    viewerStyle: 'television',
    audioEffect: 'crthum',
    melodyKey: 'indipop',
    animationType: 'scanline-drift',
    hiddenDetail: {
      prompt: 'Look into the coin return slot...',
      revealedText: 'Found: A stamped brass arcade token embossed with "SUPER FUN CITY — 1 PLAY ONLY" wedged into the mechanical coin mechanism.',
      secretItemName: 'Heavy Brass Arcade Coin Token'
    },
    tags: ['Arcade', 'Street Fighter', 'Tekken', 'Tokens', 'Mustapha'],
    relatedMemoryIds: ['mem-first-computer', 'mem-first-internet', 'mem-neighbourhood-cricket']
  },
  {
    id: 'mem-sunday-movie',
    title: 'Sunday 4 PM Movie on DD National',
    hindiTitle: 'रविवार शाम 4 बजे की दूरदर्शन हिंदी फीचर फिल्म',
    year: 1995,
    location: 'Living Room Packed with Neighbors',
    category: 'screen',
    emotionalDescription: 'The whole family gathered on the carpet with a bowl of salted roasted peanuts for the weekly Hindi feature film.',
    extendedStory: 'Whenever the movie approached a climactic fight scene, the signal would suddenly scramble into static snow, prompting someone to run out onto the balcony and shout: "Aaya? Aaya kya? Thoda aur ghumao!" while adjusting the antenna pole.',
    visualImage: NOSTALGIA_IMAGES.childhoodItems,
    visualEmoji: '🎬',
    accentColor: '#d97706',
    viewerStyle: 'television',
    audioEffect: 'crthum',
    melodyKey: 'doordarshan',
    animationType: 'scanline-drift',
    hiddenDetail: {
      prompt: 'Turn the TV fine-tuning knob on the wooden cabinet...',
      revealedText: 'Found: National Film Development Corporation (NFDC) opening swirl logo with pure analog tanpura drone and peacock feathers.',
      secretItemName: 'Doordarshan Swirl Broadcast Card'
    },
    tags: ['DD National', 'Hindi Movie', 'Antenna', 'Sholay', 'Family Time'],
    relatedMemoryIds: ['mem-sunday-cartoon', 'mem-power-cut', 'mem-old-photo-album']
  },
  {
    id: 'mem-old-photo-album',
    title: 'Old Velvet Photo Album',
    hindiTitle: 'मखमली फोटो एलबम और कॉर्नर स्टिकर्स',
    year: 1993,
    location: 'Godrej Steel Almirah Top Shelf',
    category: 'daily',
    emotionalDescription: 'Heavy maroon velvet album with transparent butter paper sheets separating glossy 4x6 Kodak prints with silver corner tabs.',
    extendedStory: 'Taking down the heavy album during guest visits. Pointing at embarrassing childhood photos where everyone squinted into the harsh sunlight because the camera only had one 36-exposure film roll that couldn\'t be wasted.',
    visualImage: NOSTALGIA_IMAGES.room,
    visualEmoji: '📷',
    accentColor: '#854d0e',
    viewerStyle: 'photograph',
    audioEffect: 'melody',
    melodyKey: 'malgudi',
    animationType: 'pulse-glow',
    hiddenDetail: {
      prompt: 'Peel back the adhesive corner sticker on the birthday photo...',
      revealedText: 'Backnote: "14th Nov 1993 — Priya\'s 7th Birthday. Black Forest cake from Crown Bakery. Flash failed on 3rd photo."',
      secretItemName: 'Negative Strip Kodak Gold 100 Envelope'
    },
    tags: ['Photo Album', 'Kodak 100', 'Butter Paper', 'Godrej Almirah', 'Memories'],
    relatedMemoryIds: ['mem-summer-vacation', 'mem-railway-journey', 'mem-std-booth', 'mem-sunday-movie']
  },
  {
    id: 'mem-first-internet',
    title: 'First Internet Connection (VSNL 56k)',
    hindiTitle: 'पहला 56k वी.एस.एन.एल डायल-अप कनेक्शन',
    year: 2001,
    location: 'Cyber Cafe Cabin 4 & Home Landline',
    category: 'tech',
    emotionalDescription: 'The screeching robotic alien song of the modem establishing connection, followed by the breathless joy of typing "yahoo.com".',
    extendedStory: 'We bought pre-paid VSNL Internet cards with scratch-off passwords (25 hours for ₹500). If someone picked up the home telephone receiver in the middle of a 1.2MB song download on Napster, the entire 45-minute progress was destroyed instantly.',
    visualImage: NOSTALGIA_IMAGES.childhoodItems,
    visualEmoji: '🌐',
    accentColor: '#6366f1',
    viewerStyle: 'computer-folder',
    audioEffect: 'keyboard',
    melodyKey: 'indipop',
    animationType: 'scanline-drift',
    hiddenDetail: {
      prompt: 'Check the scratch strip on the VSNL card...',
      revealedText: 'Found: Username: "vsnl_delhi_9921" | Remaining Balance: 4 Hours 12 Minutes | Proxy: 202.54.1.30:8080.',
      secretItemName: 'VSNL Sanchar Net Scratch Card'
    },
    tags: ['56k Modem', 'VSNL', 'Yahoo Mail', 'Dial-up', 'Cyber Cafe'],
    relatedMemoryIds: ['mem-first-computer', 'mem-first-mobile', 'mem-video-game-parlour']
  },
  {
    id: 'mem-neighbourhood-cricket',
    title: 'Neighbourhood Cricket Tournament',
    hindiTitle: 'मोहल्ला कप और चमचमाती 50 रुपये की ट्रॉफी',
    year: 1999,
    location: 'Vacant Plot Behind Shiva Temple',
    category: 'games',
    emotionalDescription: 'Pitch cleared of dry weeds with a hand broom, 10-over floodlit night match powered by a stolen halogen lamp wire.',
    extendedStory: 'Every boy pooled in 10 rupees for the winner\'s prize: a gold-colored plastic trophy with an eagle on top from the sports shop near railway station, plus two bottles of chilled Gold Spot for the man of the match.',
    visualImage: NOSTALGIA_IMAGES.childhoodItems,
    visualEmoji: '🏆',
    accentColor: '#16a34a',
    viewerStyle: 'photograph',
    audioEffect: 'melody',
    melodyKey: 'gully',
    animationType: 'pulse-glow',
    hiddenDetail: {
      prompt: 'Look under the base of the plastic trophy...',
      revealedText: 'Found: Engraved sticker: "CHAMPIONS — SHIVAJI NAGAR TIGERS 1999. Man of Match: Sachin for 42 not out."',
      secretItemName: 'Golden Eagle Mohalla Cup Trophy'
    },
    tags: ['Mohalla Cup', 'Gold Spot', 'Halogen Light', 'Trophy', 'Gully Cricket'],
    relatedMemoryIds: ['mem-cricket-mom-calls', 'mem-summer-vacation', 'mem-video-game-parlour']
  }
];

export const getMemorySlug = (item: MemoryItem): string => {
  return item.id.replace(/^mem-/, '');
};

export const findMemoryBySlug = (slug: string): MemoryItem | undefined => {
  if (!slug) return undefined;
  const normalized = slug
    .toLowerCase()
    .trim()
    .replace(/^\/memory\//, '')
    .replace(/^#memory-/, '')
    .replace(/^\?memory=/, '');

  return MEMORY_EXPLORER_ITEMS.find((item) => {
    const itemSlug = item.id.replace(/^mem-/, '').toLowerCase();
    const titleSlug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return (
      item.id.toLowerCase() === normalized ||
      itemSlug === normalized ||
      titleSlug === normalized
    );
  });
};

