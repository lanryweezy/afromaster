import React from 'react';
import BackgroundMusicPlayer from './BackgroundMusicPlayer';
import { IconTwitter, IconInstagram, IconFacebook } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950/60 backdrop-blur-lg text-slate-500 p-4 mt-auto border-t border-slate-800/50">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
           <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} Afromaster.</p>
           <p className="text-xs mt-1 text-slate-500">Powered by Gemini API & React</p>
        </div>
        <div className="flex items-center space-x-4">
            <BackgroundMusicPlayer />
            <a href="#" aria-label="Follow us on Twitter" className="text-slate-500 hover:text-white transition-colors"><IconTwitter className="w-5 h-5" /></a>
            <a href="#" aria-label="Follow us on Instagram" className="text-slate-500 hover:text-white transition-colors"><IconInstagram className="w-5 h-5" /></a>
            <a href="#" aria-label="Follow us on Facebook" className="text-slate-500 hover:text-white transition-colors"><IconFacebook className="w-5 h-5" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
