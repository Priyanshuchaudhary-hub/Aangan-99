const fs = require('fs');

const content = `import React from 'react';
import { Home } from './pages/Home.tsx';
import { MusicProvider } from './context/MusicContext.tsx';
import { PersistentMediaLayer } from './components/PersistentMediaLayer.tsx';
import { MusicDebugPanel } from './components/MusicDebugPanel.tsx';

export default function App() {
  return (
    <MusicProvider>
      <PersistentMediaLayer />
      <MusicDebugPanel />
      <div className="min-h-screen bg-[#0E0E0D] text-[#f7f1e5] relative selection:bg-[#f59e0b] selection:text-[#0E0E0D]">
        <Home />
      </div>
    </MusicProvider>
  );
}
`
fs.writeFileSync('src/App.tsx', content);
