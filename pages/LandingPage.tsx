import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import Button from '../components/Button';
import { IconArrowRight, IconMusicNote, IconSparkles, IconUpload, IconPlay, IconCog, IconDownload, IconCheckCircle, IconXCircle } from '../constants';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';

// Staggered Text Animation Component
const StaggeredText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  useEffect(() => {
    const spans = document.querySelectorAll('.animate-reveal span');
    spans.forEach((span, index) => {
      (span as HTMLElement).style.animationDelay = `${index * 0.05}s`;
    });
  }, [text]);

  return (
    <h1 className={`${className} animate-reveal`}>
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
  <Card className={`text-center transform hover:-translate-y-2 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 ${className ?? ''}`} style={style}>
    <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-slate-800 rounded-full text-primary-focus transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-heading font-semibold text-primary">{title}</h3>
    <p className="text-slate-300 mt-1">{description}</p>
  </Card>
);

// How It Works Step
const HowItWorksStep: React.FC<{ icon: React.ReactNode; title: string; description: string; delay: number }> = ({ icon, title, description, delay }) => (
    <div className="relative pl-14 sm:pl-16 animate-on-scroll" style={{ transitionDelay: `${delay}s`}}>
        <div className="absolute left-0 top-0 w-12 h-12 flex items-center justify-center text-2xl font-bold bg-slate-800/80 border border-slate-700 rounded-full text-primary font-heading">{icon}</div>
        <h3 className="text-xl font-heading font-semibold text-primary">{title}</h3>
        <p className="mt-1 text-slate-300">{description}</p>
    </div>
);


const LandingPage: React.FC = () => {
  const { setCurrentPage } = useAppContext();
  
  return (
    <div className="w-full space-y-16 md:space-y-24">
      {/* Hero Section - Single, Beautiful Hero */}
      <section className="text-center pt-10 md:pt-16 relative min-h-[70vh] flex flex-col justify-center items-center hero-background">
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-4">
            <StaggeredText text="Mastering, Reimagined for the Culture." className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold text-gradient-primary pb-4" />

            <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl mx-auto animate-slideInUp" style={{ animationDelay: '0.5s'}}>
             From a flat mix to a global hit. The AI mastering engine trained on Afrobeats, Amapiano, and Trap.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slideInUp" style={{ animationDelay: '0.7s'}}>
              <Button 
                  onClick={() => setCurrentPage(AppPage.UPLOAD)} 
                  size="lg" 
                  rightIcon={<IconArrowRight className="w-5 h-5"/>}
                  className="animate-pulse-glow"
              >
                  Master Your Track Free
              </Button>
              <Button 
                  onClick={() => {
                      const demo = document.getElementById('demo-section');
                      if(demo) demo.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  size="lg" 
                  variant="ghost"
                  leftIcon={<IconPlay className="w-5 h-5"/>}
              >
                  Hear the Difference
              </Button>
            </div>
             <div className="mt-8 text-slate-400 text-sm animate-slideInUp" style={{ animationDelay: '0.9s' }}>
                <div className="flex items-center justify-center space-x-2">
                    <div className="flex text-yellow-400">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                    <span>Trusted by <strong>10,000+</strong> producers &amp; artists</span>
                </div>
            </div>
        </div>
      </section>

      {/* "Hear the Difference" A/B Demo Section */}
      <section id="demo-section" className="max-w-4xl mx-auto">
        <SectionHeader 
          title="Feel The Bounce"
          description="Toggle between the raw mix and the Afromastered version. Hear the punch, clarity, and loudness our AI adds, tailored for Afrobeats and Trap."
        />
        <div className="animate-on-scroll" style={{ transitionDelay: '200ms' }}>
          {/* <DemoAudioPlayer /> */}
        </div>
      </section>
      
      {/* Why Afromaster Section */}
      <section className="max-w-5xl mx-auto">
        <SectionHeader 
          title="Stop Guessing, Start Finishing"
          description="Afromaster bridges the gap between your final mix and a professional, release-ready track, so you can focus on creating."
        />
        <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-red-900/20 border border-red-500/30 animate-on-scroll" style={{ transitionDelay: '200ms' }}>
                <h3 className="text-2xl font-heading font-semibold text-red-400 mb-4">The Old Way</h3>
                <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start"><IconXCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0"/>Muddy mixes that lack punch and clarity.</li>
                    <li className="flex items-start"><IconXCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0"/>Tracks aren&apos;t loud enough for Spotify or Apple Music.</li>
                    <li className="flex items-start"><IconXCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0"/>Hours wasted tweaking complex mastering plugins.</li>
                    <li className="flex items-start"><IconXCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0"/>Paying expensive engineers for every single track.</li>
                </ul>
            </Card>
            <Card className="bg-green-900/20 border border-green-500/30 animate-on-scroll" style={{ transitionDelay: '300ms' }}>
                <h3 className="text-2xl font-heading font-semibold text-green-400 mb-4">The Afromaster Way</h3>
                 <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start"><IconCheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0"/>Punchy, clear, and perfectly balanced masters.</li>
                    <li className="flex items-start"><IconCheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0"/>Industry-standard loudness for all streaming platforms.</li>
                    <li className="flex items-start"><IconCheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0"/>A professional master in under 5 minutes.</li>
                    <li className="flex items-start"><IconCheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0"/>An affordable solution for unlimited tracks.</li>
                </ul>
            </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto">
        <SectionHeader 
          title="Your Studio, Simplified"
          description="Get a release-ready master in 4 simple steps."
        />
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
            <HowItWorksStep icon={<IconUpload className="w-6 h-6"/>} title="Upload Your Mix" description="Drag and drop your final mix in WAV, MP3, AIFF, or FLAC format. Our system will analyze it instantly." delay={0.1}/>
            <HowItWorksStep icon={<IconCog className="w-6 h-6"/>} title="Define Your Sound" description="Choose a genre, select an AI-suggested preset, or fine-tune the parameters manually for your perfect sound." delay={0.2}/>
            <HowItWorksStep icon={<IconSparkles className="w-6 h-6"/>} title="AI Masters Your Track" description="Our engine applies intelligent EQ, compression, and limiting to optimize your track for streaming and broadcast." delay={0.3}/>
            <HowItWorksStep icon={<IconDownload className="w-6 h-6"/>} title="Preview and Download" description="A/B compare your original mix with the new master. Once you&apos;re happy, download your high-resolution audio file." delay={0.4}/>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="max-w-5xl mx-auto">
        <SectionHeader 
          title="Built for the Culture"
          description="Features designed to make your Afrobeats and Trap tracks hit harder."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Feature 
            icon={<IconUpload className="w-6 h-6"/>}
            title="Vibe Matching"
            description="Got a hit track you love? Upload it as a reference, and our AI will match its sonic character for your master."
            className="animate-on-scroll"
            style={{ transitionDelay: '100ms' }}
          />
          <Feature 
            icon={<IconSparkles className="w-6 h-6"/>}
            title="Genre-Specific AI"
            description="Get presets from Gemini specifically for Amapiano, Drill, Afropop, and more. Your perfect starting point is one click away."
            className="animate-on-scroll"
            style={{ transitionDelay: '200ms' }}
          />
          <Feature 
            icon={<IconMusicNote className="w-6 h-6"/>}
            title="Industry Standard Loudness"
            description="Our engine ensures your tracks are perfectly loud for Spotify, Apple Music, and clubs, without sacrificing dynamics."
            className="animate-on-scroll"
            style={{ transitionDelay: '300ms' }}
          />
        </div>
      </section>

      {/* Final CTA */}
       <section className="relative overflow-hidden bg-slate-900/70 backdrop-blur-lg max-w-5xl mx-auto text-center py-16 md:py-20 rounded-2xl shadow-2xl shadow-black/20 border border-slate-800/50 animate-on-scroll card-accent">
         <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-primary/50 to-secondary/50 rounded-full blur-3xl opacity-30 transition-all duration-500"></div>
         <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-gradient-to-bl from-primary/50 to-secondary/50 rounded-full blur-3xl opacity-30 transition-all duration-500"></div>
        <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gradient-primary">Your Next Hit is One Click Away</h2>
            <p className="mt-4 text-slate-200 max-w-xl mx-auto">Join top producers and artists using Afromaster to get their tracks radio and playlist-ready.</p>
            <div className="mt-8">
              <Button 
                onClick={() => setCurrentPage(AppPage.UPLOAD)} 
                size="lg" 
                rightIcon={<IconArrowRight className="w-5 h-5"/>}
              >
                Start Mastering Now
              </Button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
