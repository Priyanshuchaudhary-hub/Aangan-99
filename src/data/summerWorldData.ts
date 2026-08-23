import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Music,
  Tv,
  Phone,
  Gamepad2,
  Ticket,
  Calendar,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Terminal,
  Volume2,
  Flame,
  Coffee,
  HelpCircle,
  Clock,
  Disc,
  Play,
  RotateCcw
} from 'lucide-react';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

export type WorldItemCategory =
  | 'desktop'
  | 'school'
  | 'summer'
  | 'tv-cartoons'
  | 'music-tapes'
  | 'cricket-games'
  | 'travel-trips'
  | 'shops-snacks'
  | 'telephone'
  | 'evening-terrace';

export interface WorldInteractiveObject {
  id: string;
  name: string;
  hindiName: string;
  category: WorldItemCategory;
  type: 'folder' | 'executable' | 'tape' | 'ticket' | 'notebook' | 'phone' | 'photo' | 'postcard' | 'snack' | 'tv-clip' | 'game';
  icon: string; // emoji or code
  locationPrompt: string; // e.g. "Inside Blue Study Table Drawer"
  year: number;
  previewSnippet: string;
  fullStory: string;
  interactiveActionLabel: string;
  interactiveType: 'audio' | 'modal' | 'dial' | 'flip' | 'unfold' | 'jump';
  targetAnchor?: string; // jump to another artifact in the world
  audioKey?: 'doordarshan' | 'malgudi' | 'shaktimaan' | 'junglebook' | 'milesur' | 'indipop' | 'powercut' | 'gully';
  audioEffect?: 'dialup' | 'pencil' | 'crt' | 'bell';
  visualBadge?: string;
}

export const SUMMER_WORLD_ITEMS: WorldInteractiveObject[] = [
  // 1. Old Computer Desktop & Floppy Disks
  {
    id: 'obj-dialup',
    name: 'VSNL 56k Internet.exe',
    hindiName: 'विदेश संचार डायल-अप मॉडेम',
    category: 'desktop',
    type: 'executable',
    icon: '💾',
    locationPrompt: 'Desktop Icon • Cyber Cafe Windows 98',
    year: 1999,
    previewSnippet: 'Connecting to 172.29.3.1 ... Shh! Nobody pick up the landline telephone downstairs!',
    fullStory: 'The high-pitched electronic shriek of the VSNL 56kbps dial-up modem was the hymn of the late nineties. One 10MB file download took 45 minutes on GetRight. Every minute cost ₹1.20 pulse rate, and mom was yelling: "Disconnect it! Mamu is trying to call from Kanpur!"',
    interactiveActionLabel: 'Connect Modem & Handshake',
    interactiveType: 'audio',
    audioEffect: 'dialup',
    visualBadge: 'Windows 98'
  },
  {
    id: 'obj-recycle-bin',
    name: 'Summer_Holiday_Homework.doc',
    hindiName: 'छुट्टियों का गृहकार्य — 100 पन्ने',
    category: 'school',
    type: 'notebook',
    icon: '📝',
    locationPrompt: 'Recycle Bin • Postponed till June 29th',
    year: 1998,
    previewSnippet: '10 pages of Hindi Sulekh, 50 Maths long divisions, and 1 chart paper on Water Cycle.',
    fullStory: 'The golden rule of 90s summer vacation: "I will do 2 pages every morning before breakfast." Reality: On June 29th at 11:30 PM, with tears in eyes, entire family gathered together to finish 100 pages of cursive handwriting while the ceiling fan hummed.',
    interactiveActionLabel: 'Open Ruled Notebook (सुलिख कॉपी)',
    interactiveType: 'modal',
    visualBadge: 'Class 6B'
  },
  {
    id: 'obj-landline',
    name: 'BSNL Rotary Landline Telephone',
    hindiName: 'काली घंटी वाला लैंडलाइन फोन',
    category: 'telephone',
    type: 'phone',
    icon: '☎️',
    locationPrompt: 'Hallway Center Table on Embroidered Doily',
    year: 1996,
    previewSnippet: 'Ring ring! STD/ISD locked with a tiny brass key pad. 1-8-0-0 trunk call operator.',
    fullStory: 'Placed carefully on a crochet cloth doily next to a spiral telephone directory. Whenever an STD call from distant cousins came after 8 PM (half-rate rates!), dad would scream across the house: "Quick! STD call hai, jaldi baat karo!"',
    interactiveActionLabel: 'Dial Rotary & Ring (घंटी बजाएं)',
    interactiveType: 'audio',
    audioEffect: 'bell',
    visualBadge: 'P&T Dept'
  },
  {
    id: 'obj-rasna',
    name: 'Rasna Orange Pitcher Glass',
    hindiName: 'रसना — आई लव यू रसना!',
    category: 'summer',
    type: 'snack',
    icon: '🍹',
    locationPrompt: 'Clay Surahi Table in the Shaded Veranda',
    year: 1997,
    previewSnippet: 'Dual pack powder + liquid concentrate pouch, stirred in an aluminum jug with 1kg sugar.',
    fullStory: 'After coming home burning hot at 1:30 PM from playing cricket in the sun, mom would strictly forbid opening the fridge door immediately. Instead, a tall steel glass of cold orange Rasna with crushed ice from the neighborhood ice block shop was served.',
    interactiveActionLabel: 'Pour Glass & Smell Orange Oil',
    interactiveType: 'modal',
    visualBadge: '32 Glasses'
  },
  {
    id: 'obj-doordarshan',
    name: 'Sunday DD National Broadcast',
    hindiName: 'दूरदर्शन — रविवार सुबह ९ बजे',
    category: 'tv-cartoons',
    type: 'tv-clip',
    icon: '📺',
    locationPrompt: 'Living Room Onida 21" Color Television with Shutter',
    year: 1995,
    previewSnippet: 'Peacock animation spinning, "Rukawat Ke Liye Khed Hai" slide, Rangoli at 8 AM.',
    fullStory: 'Sunday mornings meant an unwritten national curfew. Streets emptied, colony children took baths early in hopes of getting TV permission, and someone had to stand on the terrace turning the aluminum Yagi antenna: "Aaya? Aaya? Thoda baayein ghumaao!"',
    interactiveActionLabel: 'Switch On CRT Screen (टीवी चालू करें)',
    interactiveType: 'jump',
    targetAnchor: '#crt-tv',
    audioKey: 'doordarshan',
    visualBadge: 'DD National'
  },
  {
    id: 'obj-phantom',
    name: 'Phantom Sweet Cigarettes & Kismi Bar',
    hindiName: 'फैंटम मीठी सिगरेट और किस्मी टॉफी',
    category: 'shops-snacks',
    type: 'snack',
    icon: '🍬',
    locationPrompt: 'Corner Kirana Store in Big Glass Jars',
    year: 1996,
    previewSnippet: 'Sugar candy sticks with red painted tips that made us pretend to be cool detectives.',
    fullStory: 'Standing in front of Gupta ji’s grocery store with a 50 paise coin clutched in sweaty palms. Glass jars filled with Kismi toffee, Poppins rolls, Magic Pops crackling candy, Mango Mood, and Phantom sweet cigarettes in red cardboard packs.',
    interactiveActionLabel: 'Inspect Jar Candies (टॉफी देखें)',
    interactiveType: 'modal',
    visualBadge: '50 Paise'
  },
  {
    id: 'obj-rail-journey',
    name: 'Non-AC Sleeper Berth Train Journey',
    hindiName: 'स्लीपर क्लास — खिड़की वाली सीट',
    category: 'travel-trips',
    type: 'ticket',
    icon: '🚂',
    locationPrompt: 'Upper Berth Luggage Rack • Blue Steel Trunk',
    year: 1998,
    previewSnippet: 'Iron flask tied to the window bar, hot poori-alu in silver foil, "Chai-Garam Chai!"',
    fullStory: 'Boarding the summer vacation train to Nani’s village. Reading Diamond Comics (Chacha Chaudhary & Sabu) on the middle berth. Cold metal water surahi, yellow halogen railway lights flashing past at midnight stations, and coal engine smoke smells.',
    interactiveActionLabel: 'Inspect Train Slip (रेल पर्ची खोलें)',
    interactiveType: 'jump',
    targetAnchor: '#ephemera-desk',
    visualBadge: 'Indian Railways'
  },
  {
    id: 'obj-gully-cricket',
    name: 'MRF Genius Rubber-Grip Bat & Cork Ball',
    hindiName: 'गली क्रिकेट — बैट जिसका, बैटिंग उसकी',
    category: 'cricket-games',
    type: 'game',
    icon: '🏏',
    locationPrompt: 'Under Staircase Behind Inverter Battery',
    year: 1999,
    previewSnippet: 'Rules: One tip one hand catch, direct hit on aunty’s car windshield is 6 runs & out.',
    fullStory: 'Every evening at 5:00 PM when the sun cooled slightly. Drawing three chalk stumps on a brick boundary wall. The golden rule of Indian childhood: "Whoever owns the bat bats first, and if he gets out in first ball, it is a trial ball!"',
    interactiveActionLabel: 'Hear Gully Match Audio (मैच की आवाज़)',
    interactiveType: 'audio',
    audioKey: 'gully',
    visualBadge: 'Sharjah ’98'
  },
  {
    id: 'obj-terrace-evening',
    name: 'Terrace Summer Night & Khatiya (Charpai)',
    hindiName: 'छत पर चारपाई और ठंडी हवा',
    category: 'evening-terrace',
    type: 'photo',
    icon: '🌙',
    locationPrompt: 'Rooftop Terrace with Watered Red Oxide Floor',
    year: 1997,
    previewSnippet: 'Sprinkling cool water from rubber pipe on burning terrace tiles, counting shooting stars.',
    fullStory: 'After sunset, the entire terrace was hosed down with pipe water till the smell of wet concrete filled the night. Charpais were carried upstairs, cotton bedsheets were dusted, and cousins slept under the open starry sky listening to cricket commentary on transistor radio.',
    interactiveActionLabel: 'Unfold Summer Night Memory',
    interactiveType: 'modal',
    visualBadge: 'Terrace Sky'
  },
  {
    id: 'obj-powercut',
    name: 'Monsoon Power Cut & Candle In Ceramic Saucer',
    hindiName: 'बिजली गुल — मोमबत्ती और हाथ का पंखा',
    category: 'evening-terrace',
    type: 'executable',
    icon: '🕯️',
    locationPrompt: 'Kitchen Window Sill Behind Matchbox',
    year: 1996,
    previewSnippet: 'The sudden pitch-black silence when inverter beeped. Everyone screaming "Aaaaaa!" in colony.',
    fullStory: 'The power cut ritual: colony children cheering together in the dark. Grandma bringing out woven bamboo hand-fans (pankha). Melting candle wax dropped into an old steel saucer to stick the candle. Shadow puppets of barking dogs on white lime walls.',
    interactiveActionLabel: 'Listen to Power Cut Silence & Rain',
    interactiveType: 'audio',
    audioKey: 'powercut',
    visualBadge: 'Load Shedding'
  },
  {
    id: 'obj-slambook',
    name: 'Class 10th Secret Slam Book',
    hindiName: 'गोल्डन स्लैम बुक — फेयरवेल डायरी',
    category: 'school',
    type: 'notebook',
    icon: '📖',
    locationPrompt: 'Locked Velvet Pouch Inside School Bag',
    year: 2005,
    previewSnippet: 'Filled with glitter gel pens, butterfly stickers, "Best Friend 4ever", and crush initials.',
    fullStory: 'The most sacred artifact of school farewell. Passing the heavy ruled diary under wooden school desks during Chemistry class. Pages decorated with scented sketch pens, zodiac signs, and answers to "Your Ambition in Life: To become an Astronaut / Software Engineer".',
    interactiveActionLabel: 'Open Slam Book (स्लैम बुक खोलें)',
    interactiveType: 'jump',
    targetAnchor: '#slam-book',
    visualBadge: 'Glitter Gel Pen'
  },
  {
    id: 'obj-nokia-3310',
    name: 'Nokia 3310 Snake II & Composer',
    hindiName: 'नोकिया ३३१० — स्नेक २ और रिंगटोन कंपोज़र',
    category: 'desktop',
    type: 'game',
    icon: '📱',
    locationPrompt: 'Dad’s Belt Holster Pouch (Leather Case)',
    year: 2004,
    previewSnippet: 'Green backlit monochrome LCD, unbreakable body, key codes for custom Airtel & Titanic ringtones.',
    fullStory: 'The legendary indestructible phone with interchangeable Xpress-on covers. Waiting for dad to come home from office to secretly play Snake II under the quilt. Carefully typing key sequences from newspaper inserts into Ringtone Composer: "4e1 4d1 8c1 8d1 4e1 4e1 2e1".',
    interactiveActionLabel: 'Play Snake II Chime & Keypad Tone',
    interactiveType: 'audio',
    audioEffect: 'bell',
    visualBadge: 'Nokia 2004'
  },
  {
    id: 'obj-cybercafe-messenger',
    name: 'Cyber Cafe Yahoo Messenger & Orkut',
    hindiName: 'साइबर कैफे — ₹१५ प्रति घंटा केबिन',
    category: 'desktop',
    type: 'executable',
    icon: '💬',
    locationPrompt: 'Subway Cyber Net • Cabin No. 04',
    year: 2004,
    previewSnippet: 'Heavy curtain dividers, Logitech ball mouse, Yahoo BUZZ! sound, "A/S/L please?", Orkut scraps.',
    fullStory: 'Entering the dimly lit cyber cafe smelling of AC and plastic mousepads. The cafe uncle noting down the start time in a rough diary: "Cabin 4 — 4:15 PM". Opening Yahoo Messenger, setting custom status to "Listening to Jal - Aadat on Winamp", and sending friends animated smileys.',
    interactiveActionLabel: 'Send Yahoo BUZZ & Hear Dialup',
    interactiveType: 'audio',
    audioEffect: 'dialup',
    visualBadge: 'Yahoo ’04'
  },
  {
    id: 'obj-multan-309',
    name: 'Multan Ka Sultan — Sehwag 309',
    hindiName: 'मुल्तान का सुल्तान — सहवाग ३०९',
    category: 'cricket-games',
    type: 'game',
    icon: '🏆',
    locationPrompt: 'India vs Pakistan 2004 Historic Friendship Series',
    year: 2004,
    previewSnippet: 'Stepping out on 295 to hit Saqlain Mushtaq for six to reach India’s first Test triple century.',
    fullStory: 'March 2004: The entire school watched cricket scorecards scribbled on classroom blackboards between periods. Virender Sehwag singing Bollywood songs while dispatching Shoaib Akhtar to the fence, carving his name into eternal cricket folklore as the first Indian to score 300 runs in a Test match.',
    interactiveActionLabel: 'Relive 2004 Historic Match Echo',
    interactiveType: 'audio',
    audioKey: 'gully',
    visualBadge: 'Multan 2004'
  },
  {
    id: 'obj-pokemon-tazos',
    name: 'Cheetos Pokémon Tazo Discs & Beyblade',
    hindiName: 'चीटोस टैटू, पोकेमॉन टैज़ो और बेब्लेड',
    category: 'shops-snacks',
    type: 'snack',
    icon: '⚡',
    locationPrompt: 'Plastic Pencil Box Compartment',
    year: 2004,
    previewSnippet: '3D lenticular spinning discs inside ₹10 Cheetos masala balls; Metal Driger vs Dragoon battles.',
    fullStory: 'Trading duplicate Charizard and Pikachu Tazos behind the school water cooler. Buying Cheetos packets not for the snack, but squeezing the bag to feel if it contained a rare gold Tazo. After 4 PM, screaming "3... 2... 1... Let it Rip!" with metal Beyblades in plastic washbasins.',
    interactiveActionLabel: 'Inspect Tazo Collection (टैज़ो देखें)',
    interactiveType: 'modal',
    visualBadge: 'Tazo ’04'
  },
  {
    id: 'obj-cassette-pencil',
    name: 'Natraj HB Pencil & TDK Cassette Tape',
    hindiName: 'नटराज पेंसिल से कैसेट रिवाइंड',
    category: 'music-tapes',
    type: 'tape',
    icon: '📼',
    locationPrompt: 'Walkman Pouch Inside Jeans Pocket',
    year: 1999,
    previewSnippet: 'Saving Walkman AA pencil battery power by spinning cassette spools by hand.',
    fullStory: 'Walkman 2x AA batteries cost ₹25 each, so using the electronic rewind button was considered a luxury crime. Instead, a hexagonal Natraj pencil was fitted into the cog teeth to wind the magnetic tape back to Side A before school bus arrived.',
    interactiveActionLabel: 'Rewind with Pencil Sound (पेंसिल घुमाएं)',
    interactiveType: 'audio',
    audioEffect: 'pencil',
    targetAnchor: '#cassette-deck',
    visualBadge: 'Side A / B'
  }
];
