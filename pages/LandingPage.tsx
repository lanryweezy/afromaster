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

// Redesigned Feature Card with enhanced styling
const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string; className?: string; style?: React.CSSProperties }> = ({ icon, title, description, className, style }) => (
  <Card className={`feature-card text-center p-6 rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 ${className ?? ''}`} style={style}>
    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-slate-800 rounded-full text-primary-focus transition-colors border border-slate-700">
      {icon}
    </div>
    <h3 className="text-xl font-heading font-semibold text-primary mb-2">{title}</h3>
    <p className="text-slate-300">{description}</p>
  </Card>
);

// How It Works Step with enhanced styling
const HowItWorksStep: React.FC<{ icon: React.ReactNode; title: string; description: string; delay: number }> = ({ icon, title, description, delay }) => (
    <div className="relative pl-16 animate-on-scroll" style={{ transitionDelay: `${delay}s`}}>
        <div className="absolute left-0 top-0 w-12 h-12 flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-primary to-secondary rounded-full text-white font-heading shadow-lg">
          {icon}
        </div>
        <h3 className="text-xl font-heading font-semibold text-primary mb-2">{title}</h3>
        <p className="text-slate-300">{description}</p>
    </div>
);

// Stats Counter Component
const StatsCounter: React.FC<{ number: string; label: string }> = ({ number, label }) => (
  <div className="text-center">
    <div className="text-3xl font-heading font-bold text-primary">{number}+</div>
    <div className="text-slate-300">{label}</div>
  </div>
);

const LandingPage: React.FC = () => {
  const { setCurrentPage } = useAppContext();
  
  return (
    <div className="animated-bg">
      {/* Hero Section */}
      <section className="text-center pt-16 md:pt-20 relative min-h-[80vh] flex flex-col justify-center items-center hero-background">
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-4">
            <StaggeredText text="Mastering, Reimagined for the Culture." className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-gradient-primary pb-4" />

            <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl mx-auto animate-slideInUp" style={{ animationDelay: '0.5s'}}>
             From a flat mix to a global hit. The AI mastering engine trained on Afrobeats, Amapiano, and Trap.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slideInUp" style={{ animationDelay: '0.7s'}}>
              <Button 
                  onClick={() => setCurrentPage(AppPage.UPLOAD)} 
                  size="lg" 
                  rightIcon={<IconArrowRight className="w-5 h-5"/>}
                  className="animate-pulse-glow glow-button"
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
                  className="glow-button"
              >
                  Hear the Difference
              </Button>
            </div>
             <div className="mt-8 text-slate-400 text-sm animate-slideInUp review-stars" style={{ animationDelay: '0.9s' }}>
                <div className="flex items-center justify-center space-x-2">
                    <div className="flex text-yellow-400">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                    <span>Trusted by <strong>10,000+</strong> producers &amp; artists</span>
                </div>
            </div>
        </div>
        
        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-6 h-6 rounded-full bg-primary/20 blur-xl float animate-float"></div>
        <div className="absolute bottom-20 right-10 w-8 h-8 rounded-full bg-secondary/20 blur-xl float animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-20 w-4 h-4 rounded-full bg-accent/20 blur-xl float animate-float" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Stats Section */}
      <section className="max-w-5xl mx-auto py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatsCounter number="10K" label="Tracks Mastered" />
          <StatsCounter number="50+" label="Genres Supported" />
          <StatsCounter number="99%" label="Satisfaction Rate" />
          <StatsCounter number="5M" label="Streams Generated" />
        </div>
      </section>

      {/* "Hear the Difference" A/B Demo Section */}
      <section id="demo-section" className="max-w-4xl mx-auto py-16">
        <SectionHeader 
          title="Feel The Bounce"
          description="Toggle between the raw mix and the Afromastered version. Hear the punch, clarity, and loudness our AI adds, tailored for Afrobeats and Trap."
        />
        <div className="animate-on-scroll" style={{ transitionDelay: '200ms' }}>
          {/* <DemoAudioPlayer /> */}
          <div className="mt-10 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 text-center">
                <h3 className="text-xl font-heading font-semibold text-red-400 mb-4">Before: Raw Mix</h3>
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 h-48 flex items-center justify-center">
                  <div className="text-slate-500">Audio Visualization</div>
                </div>
                <Button 
                  variant="ghost" 
                  className="mt-4 glow-button"
                  leftIcon={<IconPlay className="w-5 h-5"/>}
                >
                  Play Sample
                </Button>
              </div>
              <div className="text-2xl font-bold text-slate-500">VS</div>
              <div className="flex-1 text-center">
                <h3 className="text-xl font-heading font-semibold text-green-400 mb-4">After: Afromastered</h3>
                <div className="bg-slate-900/50 border border-primary/30 rounded-xl p-6 h-48 flex items-center justify-center">
                  <div className="text-slate-500">Audio Visualization</div>
                </div>
                <Button 
                  variant="primary" 
                  className="mt-4 glow-button"
                  leftIcon={<IconPlay className="w-5 h-5"/>}
                >
                  Play Sample
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Afromaster Section */}
      <section className="max-w-5xl mx-auto py-16">
        <SectionHeader 
          title="Stop Guessing, Start Finishing"
          description="Afromaster bridges the gap between your final mix and a professional, release-ready track, so you can focus on creating."
        />
        <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Card className="bg-gradient-to-br from-red-900/30 to-red-900/10 border border-red-500/30 rounded-2xl p-8 animate-on-scroll card-accent" style={{ transitionDelay: '200ms' }}>
                <h3 className="text-2xl font-heading font-semibold text-red-400 mb-6">The Old Way</h3>
                <ul className="space-y-4 text-slate-300">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-3 w-6 h-6 rounded-full bg-red-900/50 flex items-center justify-center">
                        <IconXCircle className="w-4 h-4 text-red-400" />
                      </div>
                      <span>Muddy mixes that lack punch and clarity.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-3 w-6 h-6 rounded-full bg-red-900/50 flex items-center justify-center">
                        <IconXCircle className="w-4 h-4 text-red-400" />
                      </div>
                      <span>Tracks aren't loud enough for Spotify or Apple Music.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-3 w-6 h-6 rounded-full bg-red-900/50 flex items-center justify-center">
                        <IconXCircle className="w-4 h-4 text-red-400" />
                      </div>
                      <span>Hours wasted tweaking complex mastering plugins.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-3 w-6 h-6 rounded-full bg-red-900/50 flex items-center justify-center">
                        <IconXCircle className="w-4 h-4 text-red-400" />
                      </div>
                      <span>Paying expensive engineers for every single track.</span>
                    </li>
                </ul>
            </Card>
            <Card className="bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-500/30 rounded-2xl p-8 animate-on-scroll card-accent" style={{ transitionDelay: '300ms' }}>
                <h3 className="text-2xl font-heading font-semibold text-green-400 mb-6">The Afromaster Way</h3>
                 <ul className="space-y-4 text-slate-300">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-3 w-6 h-6 rounded-full bg-green-900/50 flex items-center justify-center">
                        <IconCheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <span>Punchy, clear, and perfectly balanced masters.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-3 w-6 h-6 rounded-full bg-green-900/50 flex items-center justify-center">
                        <IconCheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <span>Industry-standard loudness for all streaming platforms.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-3 w-6 h-6 rounded-full bg-green-900/50 flex items-center justify-center">
                        <IconCheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <span>A professional master in under 5 minutes.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-3 w-6 h-6 rounded-full bg-green-900/50 flex items-center justify-center">
                        <IconCheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <span>An affordable solution for unlimited tracks.</span>
                    </li>
                </ul>
            </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto py-16">
        <SectionHeader 
          title="Your Studio, Simplified"
          description="Get a release-ready master in 4 simple steps."
        />
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 mt-12">
            <HowItWorksStep icon="1" title="Upload Your Mix" description="Drag and drop your final mix in WAV, MP3, AIFF, or FLAC format. Our system will analyze it instantly." delay={0.1}/>
            <HowItWorksStep icon="2" title="Define Your Sound" description="Choose a genre, select an AI-suggested preset, or fine-tune the parameters manually for your perfect sound." delay={0.2}/>
            <HowItWorksStep icon="3" title="AI Masters Your Track" description="Our engine applies intelligent EQ, compression, and limiting to optimize your track for streaming and broadcast." delay={0.3}/>
            <HowItWorksStep icon="4" title="Preview and Download" description="A/B compare your original mix with the new master. Once you're happy, download your high-resolution audio file." delay={0.4}/>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-16">
        <SectionHeader 
          title="Built for the Culture"
          description="Features designed to make your Afrobeats and Trap tracks hit harder."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <Feature 
            icon={<IconUpload className="w-8 h-8"/>}
            title="Vibe Matching"
            description="Got a hit track you love? Upload it as a reference, and our AI will match its sonic character for your master."
            className="animate-on-scroll"
            style={{ transitionDelay: '100ms' }}
          />
          <Feature 
            icon={<IconSparkles className="w-8 h-8"/>}
            title="Genre-Specific AI"
            description="Get presets from Gemini specifically for Amapiano, Drill, Afropop, and more. Your perfect starting point is one click away."
            className="animate-on-scroll"
            style={{ transitionDelay: '200ms' }}
          />
          <Feature 
            icon={<IconMusicNote className="w-8 h-8"/>}
            title="Industry Standard Loudness"
            description="Our engine ensures your tracks are perfectly loud for Spotify, Apple Music, and clubs, without sacrificing dynamics."
            className="animate-on-scroll"
            style={{ transitionDelay: '300ms' }}
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-5xl mx-auto py-16">
        <SectionHeader 
          title="What Artists Are Saying"
          description="Join thousands of producers and artists who trust Afromaster for their mastering needs."
        />
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <Card className="p-6 rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm animate-on-scroll" style={{ transitionDelay: '100ms' }}>
            <div className="flex text-yellow-400 mb-4">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="text-slate-300 italic">"Afromaster took my Afrobeat track to the next level. The bass is punchy, and the vocals sit perfectly in the mix. Saved me hours of work!"</p>
            <div className="flex items-center mt-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold mr-3">A</div>
              <div>
                <div className="font-semibold text-white">Adekunle Gold</div>
                <div className="text-sm text-slate-400">Afrobeats Artist</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm animate-on-scroll" style={{ transitionDelay: '200ms' }}>
            <div className="flex text-yellow-400 mb-4">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="text-slate-300 italic">"As a producer, I've tried many mastering tools. Afromaster is the first one that truly understands the energy of African music."</p>
            <div className="flex items-center mt-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold mr-3">B</div>
              <div>
                <div className="font-semibold text-white">Beatbox OG</div>
                <div className="text-sm text-slate-400">Hip Hop Producer</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm animate-on-scroll" style={{ transitionDelay: '300ms' }}>
            <div className="flex text-yellow-400 mb-4">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="text-slate-300 italic">"The genre-specific AI presets are incredible. My Amapiano track now has that club-ready sound that gets people moving."</p>
            <div className="flex items-center mt-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold mr-3">S</div>
              <div>
                <div className="font-semibold text-white">Sjava</div>
                <div className="text-sm text-slate-400">South African Artist</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
       <section className="relative overflow-hidden bg-gradient-to-br from-slate-900/70 to-slate-800/70 backdrop-blur-lg max-w-5xl mx-auto text-center py-20 rounded-2xl shadow-2xl shadow-black/30 border border-slate-800/50 animate-on-scroll card-accent my-20">
         <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-3xl opacity-50 transition-all duration-500"></div>
         <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-gradient-to-bl from-primary/30 to-secondary/30 rounded-full blur-3xl opacity-50 transition-all duration-500"></div>
        <div className="relative z-10 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-gradient-primary">Your Next Hit is One Click Away</h2>
            <p className="mt-6 text-lg text-slate-200 max-w-2xl mx-auto">Join top producers and artists using Afromaster to get their tracks radio and playlist-ready.</p>
            <div className="mt-10">
              <Button 
                onClick={() => setCurrentPage(AppPage.UPLOAD)} 
                size="lg" 
                rightIcon={<IconArrowRight className="w-5 h-5"/>}
                className="glow-button px-10 py-4 text-lg"
              >
                Start Mastering Now
              </Button>
            </div>
            <p className="mt-6 text-slate-400 text-sm">Free credits available for new users</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
