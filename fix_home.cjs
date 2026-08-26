const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

// Replace everything up to the component body with clean code
const newPrefix = `import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useMusic } from '../context/MusicContext.tsx';
import { NOSTALGIA_TRACKS, NOSTALGIA_PLAYLISTS } from '../data/musicData.ts';
import { MEMORY_EXPLORER_ITEMS, MemoryItem } from '../data/memoryExplorerData.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

import { NostalgiaRadioPlayer } from '../components/NostalgiaRadioPlayer.tsx';
import { NostalgiaRadioModal } from '../components/NostalgiaRadioModal.tsx';
import { SongSearchModal } from '../components/SongSearchModal.tsx';
import { MusicSourceSetupModal } from '../components/MusicSourceSetupModal.tsx';
import { DeveloperDebugPanel } from '../components/DeveloperDebugPanel.tsx';
import { VerifyPlaylistModal } from '../components/VerifyPlaylistModal.tsx';

import { Search, Play, Pause, ChevronRight, MapPin, Calendar, Clock, Music } from 'lucide-react';

export const Home: React.FC = () => {
`;

content = content.replace(/import React[\s\S]*?export const Home[^\{]+\{([^\n]+)?\n([^\n]+)?\n([^\n]+)?\n([^\n]+)?\n([^\n]+)?\n([^\n]+)?\n([^\n]+)?\n\s*\}\) => \{/m, newPrefix);

fs.writeFileSync('src/pages/Home.tsx', content);
