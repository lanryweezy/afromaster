import React from 'react';
import BackgroundMusicPlayer from './BackgroundMusicPlayer';
import { 
  IconTwitter, 
  IconInstagram, 
  IconFacebook, 
  IconGlobe,
  IconMusicNote,
  IconMail,
  IconPhone,
  IconMapPin,
  IconHeart,
  IconBolt,
  IconShield,
  IconAward
} from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-studio-dark border-t border-gray-700 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-5"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center">
                <IconMusicNote className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black gradient-text-hero">Afromaster</h3>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Professional AI-powered mastering for artists worldwide. Specially trained on 
              <span className="text-primary font-semibold"> Afrobeats, Amapiano & Trap</span> music 
              with expertise in 50+ global genres.
            </p>
            
            {/* Global Reach Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="card-studio p-4 text-center">
                <div className="text-2xl font-bold gradient-text-spectrum">195+</div>
                <div className="text-xs text-gray-400">Countries</div>
              </div>
              <div className="card-studio p-4 text-center">
                <div className="text-2xl font-bold gradient-text-spectrum">500K+</div>
                <div className="text-xs text-gray-400">Tracks Mastered</div>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-console-glow">
                <IconShield className="w-4 h-4" />
                <span className="text-xs">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-1 text-console-glow">
                <IconAward className="w-4 h-4" />
                <span className="text-xs">99.8% Success</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <IconBolt className="w-4 h-4 mr-2 text-primary" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                'Upload Track',
                'Pricing',
                'How It Works',
                'API Documentation',
                'Help Center',
                'Status Page'
              ].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Global Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <IconGlobe className="w-4 h-4 mr-2 text-secondary" />
              Global Support
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <IconMail className="w-4 h-4 text-primary" />
                <span>support@afromaster.ai</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <IconPhone className="w-4 h-4 text-secondary" />
                <span>24/7 Global Support</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <IconMapPin className="w-4 h-4 text-accent" />
                <span>Lagos • Atlanta • London</span>
              </div>
            </div>
            
            {/* Language Support */}
            <div className="mt-6">
              <div className="text-xs text-gray-500 mb-2">Languages Supported:</div>
              <div className="flex flex-wrap gap-2">
                {['🇺🇸 EN', '🇳🇬 IG', '🇿🇦 AF', '🇬🇭 TW', '🇫🇷 FR', '🇪🇸 ES'].map((lang) => (
                  <span 
                    key={lang} 
                    className="px-2 py-1 bg-glass-bg border border-glass-border rounded text-xs"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Social Media & Music Player */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Follow our global community:</span>
              <div className="flex items-center space-x-4">
                <a 
                  href="#" 
                  aria-label="Follow us on Twitter" 
                  className="w-10 h-10 bg-glass-bg border border-glass-border rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-primary transition-all group"
                >
                  <IconTwitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="#" 
                  aria-label="Follow us on Instagram" 
                  className="w-10 h-10 bg-glass-bg border border-glass-border rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-secondary transition-all group"
                >
                  <IconInstagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="#" 
                  aria-label="Follow us on Facebook" 
                  className="w-10 h-10 bg-glass-bg border border-glass-border rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-accent transition-all group"
                >
                  <IconFacebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
            
            {/* Background Music Player */}
            <BackgroundMusicPlayer />
          </div>
        </div>
        
        {/* Countries Showcase */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h4 className="text-white font-semibold mb-2">Powering Music Across The Globe</h4>
            <p className="text-gray-400 text-sm">Artists from these countries trust Afromaster</p>
          </div>
          <div className="flex justify-center items-center space-x-4 text-2xl">
            <span title="Nigeria" className="hover:scale-125 transition-transform cursor-pointer">🇳🇬</span>
            <span title="South Africa" className="hover:scale-125 transition-transform cursor-pointer">🇿🇦</span>
            <span title="Ghana" className="hover:scale-125 transition-transform cursor-pointer">🇬🇭</span>
            <span title="Kenya" className="hover:scale-125 transition-transform cursor-pointer">🇰🇪</span>
            <span title="United States" className="hover:scale-125 transition-transform cursor-pointer">🇺🇸</span>
            <span title="United Kingdom" className="hover:scale-125 transition-transform cursor-pointer">🇬🇧</span>
            <span title="Canada" className="hover:scale-125 transition-transform cursor-pointer">🇨🇦</span>
            <span title="Brazil" className="hover:scale-125 transition-transform cursor-pointer">🇧🇷</span>
            <span title="France" className="hover:scale-125 transition-transform cursor-pointer">🇫🇷</span>
            <span title="Germany" className="hover:scale-125 transition-transform cursor-pointer">🇩🇪</span>
            <span title="India" className="hover:scale-125 transition-transform cursor-pointer">🇮🇳</span>
            <span title="Jamaica" className="hover:scale-125 transition-transform cursor-pointer">🇯🇲</span>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>&copy; {new Date().getFullYear()} Afromaster AI</span>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">GDPR Compliant</a>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <IconHeart className="w-4 h-4 text-red-500 animate-pulse-glow" />
              <span>for global artists</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
