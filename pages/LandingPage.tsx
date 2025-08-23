import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import Button from '../components/Button';
import { 
  IconArrowRight, 
  IconMusicNote, 
  IconSparkles, 
  IconUpload, 
  IconPlay, 
  IconCog, 
  IconDownload, 
  IconCheckCircle,
  IconStar,
  IconTrendingUp,
  IconUsers,
  IconAward,
  IconBolt,
  IconHeart,
  IconFire
} from '../constants';

// Animated Hero Text with Stunning Effects
const AnimatedHeroText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <h1 className={`${className} ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <span className="gradient-text-hero">{text}</span>
    </h1>
  );
};

// Floating Audio Visualizer Component
const AudioVisualizer: React.FC = () => {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateBars = () => {
      if (barsRef.current) {
        const bars = barsRef.current.children;
        for (let i = 0; i < bars.length; i++) {
          const height = Math.random() * 60 + 10;
          (bars[i] as HTMLElement).style.height = `${height}px`;
        }
      }
    };

    const interval = setInterval(animateBars, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="spectrum-analyzer animate-float" ref={barsRef}>
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="spectrum-bar"
          style={{
            height: Math.random() * 60 + 10,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

// Premium Feature Card with Hover Effects
const FeatureCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  gradient?: string;
  glowColor?: string;
}> = ({ icon, title, description, gradient = "card", glowColor = "primary" }) => (
  <div className={`card ${gradient === "spectrum" ? "card-spectrum" : ""} hover-glow animate-on-scroll group cursor-pointer`}>
    <div className="flex flex-col items-center text-center space-y-4">
      <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${glowColor} to-${glowColor}-dark flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform duration-300 animate-pulse-glow`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  </div>
);

// Interactive Step with Animation
const ProcessStep: React.FC<{ 
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive?: boolean;
}> = ({ number, icon, title, description, isActive = false }) => (
  <div className={`card-studio p-6 text-center animate-on-scroll group cursor-pointer ${isActive ? 'audio-reactive-border' : ''}`}>
    <div className="relative mb-6">
      <div className="w-20 h-20 mx-auto bg-gradient-hero rounded-full flex items-center justify-center text-3xl text-white mb-2 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-black rounded-full flex items-center justify-center text-sm font-bold">
        {number}
      </div>
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

// Stats Counter Component
const StatsCounter: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => {
  const [count, setCount] = useState(0);
  const targetValue = parseInt(value.replace(/[^0-9]/g, ''));

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetValue]);

  return (
    <div className="text-center animate-on-scroll">
      <div className="text-4xl mb-2 text-primary">{icon}</div>
      <div className="text-3xl font-bold gradient-text-spectrum mb-1">
        {count.toLocaleString()}{value.replace(/[0-9]/g, '')}
      </div>
      <div className="text-gray-400 text-sm uppercase tracking-wider">{label}</div>
    </div>
  );
};

// Testimonial Card with Premium Design
const TestimonialCard: React.FC<{
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
}> = ({ name, role, content, avatar, rating }) => (
  <div className="card hover-glow animate-on-scroll">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold mr-4">
        {avatar || name[0]}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-white">{name}</div>
        <div className="text-sm text-gray-400">{role}</div>
      </div>
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <IconStar 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-accent' : 'text-gray-600'}`} 
          />
        ))}
      </div>
    </div>
    <p className="text-gray-300 italic">"{content}"</p>
  </div>
);

const LandingPage: React.FC = () => {
  const { setCurrentPage } = useAppContext();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <IconBolt />,
      title: "AI-Powered Mastering",
      description: "Advanced machine learning algorithms optimize your tracks for maximum impact and commercial success.",
      gradient: "spectrum",
      glowColor: "spectrum-1"
    },
    {
      icon: <IconFire />,
      title: "Global Genre Intelligence",
      description: "Specialized mastering for Afrobeats, Amapiano, Trap, and 50+ other genres from around the world.",
      glowColor: "spectrum-2"
    },
    {
      icon: <IconTrendingUp />,
      title: "Real-Time Analysis",
      description: "Professional-grade audio analysis with LUFS metering, spectral display, and dynamic range optimization.",
      glowColor: "spectrum-3"
    },
    {
      icon: <IconHeart />,
      title: "Universal Accessibility",
      description: "Intuitive design that makes professional mastering accessible to creators from every corner of the globe.",
      glowColor: "spectrum-4"
    }
  ];

  const processSteps = [
    {
      icon: <IconUpload />,
      title: "Upload Your Track",
      description: "Drag & drop your audio file and let our AI analyze its characteristics"
    },
    {
      icon: <IconCog />,
      title: "AI Processing",
      description: "Our advanced algorithms apply genre-specific mastering techniques"
    },
    {
      icon: <IconPlay />,
      title: "Preview & Compare",
      description: "Listen to before/after comparisons and fine-tune your master"
    },
    {
      icon: <IconDownload />,
      title: "Download Master",
      description: "Get your professional master ready for streaming and distribution"
    }
  ];

  const stats = [
    { value: "500K+", label: "Global Tracks Mastered", icon: <IconMusicNote /> },
    { value: "195+", label: "Countries Served", icon: <IconUsers /> },
    { value: "99.8%", label: "Success Rate", icon: <IconAward /> },
    { value: "4.9★", label: "Artist Rating", icon: <IconStar /> }
  ];

  const testimonials = [
    {
      name: "Kwame Asante",
      role: "Afrobeats Producer • Ghana",
      content: "Afromaster transformed my sound completely. The AI knows exactly how to make Afrobeats hit different on global charts!",
      rating: 5
    },
    {
      name: "Maya Johnson", 
      role: "Trap Artist • Atlanta",
      content: "From local clubs to worldwide streaming - Afromaster gets my trap beats ready for any platform, anywhere.",
      rating: 5
    },
    {
      name: "Thabo Molefe",
      role: "Amapiano Producer • South Africa", 
      content: "Finally, an AI that understands the soul of Amapiano while meeting international standards. Pure magic!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-studio-dark relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="particles-container">
        <div className="absolute inset-0 bg-gradient-glow opacity-20 animate-pulse-glow"></div>
      </div>
      
      {/* Hero Section - Stunning & Addictive */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="mb-8 animate-fade-in-up">
            <AudioVisualizer />
          </div>
          
          <AnimatedHeroText 
            text="Master Your Sound Like a Pro" 
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          />
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Professional AI mastering for <span className="gradient-text-spectrum font-semibold">artists worldwide</span>. 
            Specially trained on <span className="text-primary font-semibold">Afrobeats, Amapiano & Trap</span> but perfected for every genre.
            Get studio-quality masters in minutes, not hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up">
            <Button 
              onClick={() => setCurrentPage(AppPage.UPLOAD)} 
              className="btn btn-primary btn-lg group"
            >
              <IconUpload className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Start Mastering Now
              <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              onClick={() => setCurrentPage(AppPage.AUTH)} 
              className="btn btn-secondary btn-lg"
            >
              <IconPlay className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up">
            {stats.map((stat, index) => (
              <StatsCounter 
                key={index}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Premium & Engaging */}
      <section className="py-20 px-4 relative">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text-hero">
              Why Global Artists Choose Afromaster
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              AI mastering technology trained on cultural music nuances, perfected for worldwide success
            </p>
          </div>
          
          <div className="grid grid-2 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Interactive & Visual */}
      <section className="py-20 px-4 bg-studio-medium relative">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text-spectrum">
              Master Your Track in 4 Simple Steps
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our streamlined process gets you professional results in minutes
            </p>
          </div>
          
          <div className="grid grid-4 gap-6">
            {processSteps.map((step, index) => (
              <ProcessStep 
                key={index}
                number={index + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                isActive={activeStep === index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Social Proof */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text-hero">
              What Artists Are Saying
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied artists who trust Afromaster with their music
            </p>
          </div>
          
          <div className="grid grid-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Irresistible */}
      <section className="py-20 px-4 bg-gradient-hero relative">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
            Ready to Transform Your Music?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join the revolution of AI-powered mastering. Get your first master FREE and experience the difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => setCurrentPage(AppPage.UPLOAD)} 
              className="btn btn-secondary btn-lg group bg-white text-primary hover:bg-gray-100"
            >
              <IconSparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Get Your FREE Master
              <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <p className="text-sm text-white/70 mt-4">
            No credit card required • 100% satisfaction guaranteed
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
