import React from 'react';
import BackgroundMusicPlayer from './BackgroundMusicPlayer';
import { IconTwitter, IconInstagram, IconFacebook } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950/80 backdrop-blur-xl text-slate-500 p-6 mt-auto border-t border-slate-800/50 shadow-lg shadow-black/20">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
           <p className="text-sm text-slate-400 font-medium">
             &copy; {new Date().getFullYear()} Afromaster - Mastering for the Culture
           </p>
           <p className="text-xs text-slate-600 mt-1">
             Built with ❤️ for independent artists worldwide
           </p>
        </div>
        <div className="flex items-center space-x-6">
            <BackgroundMusicPlayer />
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                aria-label="Follow us on Twitter" 
                className="text-slate-500 hover:text-orange-400 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-slate-800/50"
              >
                <IconTwitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                aria-label="Follow us on Instagram" 
                className="text-slate-500 hover:text-orange-400 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-slate-800/50"
              >
                <IconInstagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                aria-label="Follow us on Facebook" 
                className="text-slate-500 hover:text-orange-400 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-slate-800/50"
              >
                <IconFacebook className="w-5 h-5" />
              </a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
