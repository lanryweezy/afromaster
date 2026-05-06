import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import Button from '../components/Button';
import { IconArrowRight, IconMusicNote, IconSparkles, IconUpload, IconPlay, IconCog, IconDownload, IconCheckCircle, IconXCircle } from '../constants';
import DemoAudioPlayer from '../components/DemoAudioPlayer';

// Staggered Text Animation Component
const StaggeredText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  useEffect(() => {
    const spans = document.querySelectorAll('.animate-reveal span');
    spans.forEach((span, index) => {
      (span as HTMLElement).style.animationDelay = `${index * 0.05}s`;
    });
  }, [text]);

  return (
    <h1 className={`${className} animate-reveal leading-tight`}>
      {text.split('').map((char, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.05}s` }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  );
};

// Redesigned Feature Card
const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string; className?: string; style?: React.CSSProperties }> = ({ icon, title, description, className, style }) => (
  <div className={`group bg-slate-900/40 backdrop-blur-md p-8 rounded-2xl border border-slate-800/50 hover:bg-slate-800/60 hover:border-primary/30 transition-all duration-300 card-accent ${className ?? ''}`} style={style}>
    <div className="inline-flex items-center justify-center w-14 h-14 mb-6 bg-slate-800/80 rounded-2xl text-primary shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);

// How It Works Step
const HowItWorksStep: React.FC<{ icon: React.ReactNode; title: string; description: string; delay: number; step: number }> = ({ icon, title, description, delay, step }) => (
    <div className="relative pl-0 sm:pl-6 animate-on-scroll flex flex-col items-center sm:items-start text-center sm:text-left" style={{ transitionDelay: `${delay}s`}}>
        <div className="w-16 h-16 flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl text-primary font-heading shadow-xl mb-4 relative z-10 group">
             {icon}
             <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-slate-900">
                 {step}
             </div>
        </div>
        <h3 className="text-xl font-heading font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </div>
);


const LandingPage: React.FC = () => {
  const { setCurrentPage } = useAppContext();
  
  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="text-center pt-20 pb-10 relative min-h-[85vh] flex flex-col justify-center items-center hero-background">
        <div className="relative z-10 flex flex-col justify-center items-center w-full max-w-5xl px-4">
            <div className="mb-6 animate-fadeIn opacity-0" style={{ animationDelay: '0.2s' }}>
                 <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wide uppercase">
                    v2.0 Now Live
                 </span>
            </div>
            
            <StaggeredText text="Mastering, Reimagined for the Culture." className="text-5xl sm:text-6xl md:text-8xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 pb-6 drop-shadow-sm" />

            <p className="mt-8 text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto animate-slideInUp font-light" style={{ animationDelay: '0.5s'}}>
             From a flat mix to a global hit. The AI mastering engine trained specifically on <span className="text-white font-medium">Afrobeats, Amapiano, and Trap</span>.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-slideInUp" style={{ animationDelay: '0.7s'}}>
              <Button 
                  onClick={() => setCurrentPage(AppPage.UPLOAD)} 
                  size="lg" 
                  variant="primary"
                  rightIcon={<IconArrowRight className="w-5 h-5"/>}
                  className="w-full sm:w-auto text-lg px-10 py-4 shadow-primary/30 shadow-2xl animate-pulse-glow"
              >
                  Start Mastering for Free
              </Button>
              <Button 
                  onClick={() => {
                      const demo = document.getElementById('demo-section');
                      if(demo) demo.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  size="lg" 
                  variant="glass"
                  leftIcon={<IconPlay className="w-5 h-5"/>}
                  className="w-full sm:w-auto"
              >
                  Hear the Difference
              </Button>
            </div>
            
             <div className="mt-12 animate-slideInUp opacity-0" style={{ animationDelay: '1s' }}>
                <p className="text-slate-500 text-sm font-medium mb-3">TRUSTED BY 10,000+ PRODUCERS</p>
                <div className="flex -space-x-3 justify-center">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*135}`} alt="User" />
                        </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                        +10k
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* "Hear the Difference" A/B Demo Section */}
      <section id="demo-section" className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white mb-4">Feel The Bounce</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Toggle between the raw mix and the Afromastered version. Hear the punch, clarity, and loudness our AI adds.</p>
        </div>
        <div className="animate-on-scroll" style={{ transitionDelay: '200ms' }}>
          <DemoAudioPlayer />
        </div>
      </section>
      
      {/* Why Afromaster Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-6">Stop Guessing, Start Finishing</h2>
                <p className="text-lg text-slate-400 mb-8">Afromaster bridges the gap between your final mix and a professional, release-ready track, so you can focus on creating.</p>
                
                 <div className="space-y-4">
                    <div className="flex items-start p-4 bg-slate-900/40 rounded-xl border border-slate-800/50">
                        <div className="bg-red-500/10 p-2 rounded-lg mr-4"><IconXCircle className="w-6 h-6 text-red-400"/></div>
                        <div>
                            <h4 className="font-bold text-slate-200">The Old Way</h4>
                            <p className="text-sm text-slate-500 mt-1">Hours wasted tweaking plugins, muddy mixes, expensive engineers.</p>
                        </div>
                    </div>
                    <div className="flex items-start p-4 bg-primary/5 rounded-xl border border-primary/20">
                         <div className="bg-primary/10 p-2 rounded-lg mr-4"><IconCheckCircle className="w-6 h-6 text-primary"/></div>
                        <div>
                            <h4 className="font-bold text-white">The Afromaster Way</h4>
                            <p className="text-sm text-slate-400 mt-1">Instant professional results, genre-specific AI, industry standard loudness.</p>
                        </div>
                    </div>
                </div>
            </div>
            
             <div className="grid grid-cols-2 gap-4 animate-on-scroll" style={{ transitionDelay: '200ms' }}>
                 <div className="space-y-4 mt-8">
                     <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 h-40 flex flex-col justify-between">
                         <IconMusicNote className="w-8 h-8 text-purple-400" />
                         <span className="font-bold text-slate-200">Crystal Clear Highs</span>
                     </div>
                     <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 h-48 flex flex-col justify-between">
                         <IconSparkles className="w-8 h-8 text-yellow-400" />
                         <span className="font-bold text-slate-200">AI Powered Magic</span>
                     </div>
                 </div>
                 <div className="space-y-4">
                     <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 h-48 flex flex-col justify-between">
                         <div className="w-8 h-8 rounded-full bg-green-500 animate-pulse"></div>
                         <span className="font-bold text-slate-200">Streaming Ready</span>
                     </div>
                     <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 h-40 flex flex-col justify-between">
                         <IconDownload className="w-8 h-8 text-blue-400" />
                         <span className="font-bold text-slate-200">Instant Download</span>
                     </div>
                 </div>
             </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white mb-4">Your Studio, Simplified</h2>
            <p className="text-slate-400">Get a release-ready master in 4 simple steps.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-slate-800 via-primary/50 to-slate-800 z-0"></div>
            
            <HowItWorksStep step={1} icon={<IconUpload className="w-6 h-6"/>} title="Upload" description="Drag & drop your mix. WAV, MP3, AIFF supported." delay={0.1}/>
            <HowItWorksStep step={2} icon={<IconCog className="w-6 h-6"/>} title="Customize" description="Select genre & AI presets or tweak manually." delay={0.2}/>
            <HowItWorksStep step={3} icon={<IconSparkles className="w-6 h-6"/>} title="Process" description="Our AI engine balances and boosts your track." delay={0.3}/>
            <HowItWorksStep step={4} icon={<IconDownload className="w-6 h-6"/>} title="Download" description="Preview, compare, and export your master." delay={0.4}/>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">Built for the Culture</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature 
            icon={<IconUpload className="w-7 h-7"/>}
            title="Vibe Matching"
            description="Got a hit track you love? Upload it as a reference, and our AI will match its sonic character for your master."
            className="animate-on-scroll"
            style={{ transitionDelay: '100ms' }}
          />
          <Feature 
            icon={<IconSparkles className="w-7 h-7"/>}
            title="Genre-Specific AI"
            description="Get presets from Gemini specifically for Amapiano, Drill, Afropop, and more. Your perfect starting point."
            className="animate-on-scroll"
            style={{ transitionDelay: '200ms' }}
          />
          <Feature 
            icon={<IconMusicNote className="w-7 h-7"/>}
            title="Loudness Standards"
            description="Ensures your tracks are perfectly loud for Spotify (-14 LUFS) or the Club (-8 LUFS) without clipping."
            className="animate-on-scroll"
            style={{ transitionDelay: '300ms' }}
          />
        </div>
      </section>

      {/* Final CTA */}
       <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-black max-w-6xl mx-auto text-center py-20 md:py-24 rounded-3xl shadow-2xl border border-slate-800/50 animate-on-scroll card-accent mb-20 mx-4">
         <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-40"></div>
         <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] opacity-40"></div>
        <div className="relative z-10 px-6">
            <h2 className="text-4xl sm:text-6xl font-heading font-bold text-white mb-6">Your Next Hit is Waiting</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">Join top producers using Afromaster to get their tracks radio-ready in minutes.</p>
            <Button 
                onClick={() => setCurrentPage(AppPage.UPLOAD)} 
                size="lg" 
                variant="primary"
                rightIcon={<IconArrowRight className="w-6 h-6"/>}
                className="text-lg px-12 py-5 shadow-2xl"
            >
                Start Mastering Now
            </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;