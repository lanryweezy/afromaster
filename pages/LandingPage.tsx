import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import Button from '../components/Button';
import { IconPlay, IconStar, IconWave, IconMicrophone, IconHeadphones, IconTrendingUp, IconUsers, IconMusic, IconZap, IconShield, IconGlobe } from '../constants';

const LandingPage: React.FC = () => {
  const { setCurrentPage } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGetStarted = () => {
    setCurrentPage(AppPage.UPLOAD);
  };

  const handleTryDemo = () => {
    setCurrentPage(AppPage.UPLOAD);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse"
          style={{
            left: `${mousePosition.x * 0.1}%`,
            top: `${mousePosition.y * 0.1}%`,
            transition: 'all 0.3s ease',
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full opacity-15 blur-2xl bg-gradient-to-r from-pink-500 to-orange-500 animate-pulse"
          style={{
            right: `${(100 - mousePosition.x) * 0.05}%`,
            bottom: `${(100 - mousePosition.y) * 0.05}%`,
            transition: 'all 0.5s ease',
          }}
        />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          {/* Floating Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <IconStar className="w-4 h-4 text-yellow-400" />
            <span className="body-small text-white">Trusted by 10,000+ Artists Worldwide</span>
            <IconStar className="w-4 h-4 text-yellow-400" />
          </div>

          {/* Main Headline */}
          <h1 className={`heading-1 mb-6 max-w-4xl mx-auto animate-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            Master Your Music Like a
            <span className="block text-gradient animate-pulse">Professional Studio</span>
          </h1>

          {/* Subheadline */}
          <p className={`body-large mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            Transform your raw tracks into radio-ready masterpieces with AI-powered mastering. 
            Get that crisp, punchy sound that makes listeners hit replay.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            <Button
              onClick={handleGetStarted}
              className="btn-primary text-lg px-8 py-4 shadow-glow"
            >
              <IconZap className="w-5 h-5" />
              Start Mastering Free
            </Button>
            <Button
              onClick={handleTryDemo}
              className="btn-secondary text-lg px-8 py-4"
            >
              <IconPlay className="w-5 h-5" />
              Try Demo Track
            </Button>
          </div>

          {/* Audio Visualization Preview */}
          <div className={`glass-card p-8 max-w-4xl mx-auto mb-16 animate-scale-in ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center justify-center mb-4">
              <IconWave className="w-6 h-6 text-primary-400 mr-2" />
              <span className="heading-3">Live Audio Preview</span>
            </div>
            <AudioVisualizationDemo />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-6">Why Artists Choose Afromaster</h2>
            <p className="body-large max-w-2xl mx-auto">
              Experience the power of professional mastering with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<IconMicrophone className="w-8 h-8 text-primary-400" />}
              title="Studio-Quality Sound"
              description="Get that crisp, professional sound that makes your tracks stand out on any platform"
              delay="0s"
            />
            <FeatureCard
              icon={<IconZap className="w-8 h-8 text-accent-cyan" />}
              title="Lightning Fast"
              description="Master your tracks in minutes, not hours. Upload, process, and download instantly"
              delay="0.2s"
            />
            <FeatureCard
              icon={<IconShield className="w-8 h-8 text-accent-neon" />}
              title="Genre Optimized"
              description="Specialized algorithms for Afrobeats, Hip-Hop, R&B, and more musical styles"
              delay="0.4s"
            />
            <FeatureCard
              icon={<IconHeadphones className="w-8 h-8 text-accent-gold" />}
              title="A/B Comparison"
              description="Compare your original and mastered tracks side-by-side with real-time switching"
              delay="0.6s"
            />
            <FeatureCard
              icon={<IconTrendingUp className="w-8 h-8 text-accent-pink" />}
              title="Loudness Standards"
              description="Perfect loudness for Spotify, Apple Music, and all major streaming platforms"
              delay="0.8s"
            />
            <FeatureCard
              icon={<IconGlobe className="w-8 h-8 text-primary-400" />}
              title="Cloud Processing"
              description="Powerful cloud-based processing means no software to install or update"
              delay="1s"
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-6">Trusted by Artists Worldwide</h2>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <StatCard number="10,000+" label="Artists" />
              <StatCard number="50,000+" label="Tracks Mastered" />
              <StatCard number="99%" label="Satisfaction Rate" />
              <StatCard number="24/7" label="Support" />
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Afromaster gave my beats that professional punch I was missing. My streams increased 300% after using it!"
              author="Marcus Johnson"
              role="Hip-Hop Producer"
              rating={5}
            />
            <TestimonialCard
              quote="The AI understands Afrobeats like no other platform. It's like having a world-class engineer in my studio."
              author="Chioma Okafor"
              role="Afrobeats Artist"
              rating={5}
            />
            <TestimonialCard
              quote="Game changer! My indie tracks now sound radio-ready. The A/B comparison feature is incredible."
              author="Alex Rivera"
              role="Independent Artist"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12">
            <h2 className="heading-2 mb-6">Ready to Transform Your Sound?</h2>
            <p className="body-large mb-8">
              Join thousands of artists who've already elevated their music with Afromaster
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGetStarted}
                className="btn-primary text-lg px-8 py-4 shadow-glow"
              >
                <IconMusic className="w-5 h-5" />
                Start Your Free Master
              </Button>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <IconShield className="w-4 h-4" />
                No credit card required
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Audio Visualization Demo Component
const AudioVisualizationDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const bars = 64;
    const barWidth = canvas.offsetWidth / bars;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      for (let i = 0; i < bars; i++) {
        const height = Math.sin(time + i * 0.3) * 30 + 40;
        const hue = (i * 6 + time * 50) % 360;
        
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
        ctx.fillRect(
          i * barWidth,
          canvas.offsetHeight / 2 - height / 2,
          barWidth - 2,
          height
        );
      }
      
      time += 0.1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="audio-visualizer">
      <canvas
        ref={canvasRef}
        className="w-full h-24 rounded-lg"
        style={{ maxWidth: '100%' }}
      />
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="body-small">Before Mastering</span>
        </div>
        <div className="w-px h-4 bg-gray-600"></div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <span className="body-small">After Mastering</span>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300 animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="heading-3 mb-2 text-lg">{title}</h3>
      <p className="body-medium">{description}</p>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  number: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => {
  return (
    <div className="text-center">
      <div className="heading-2 text-gradient mb-2">{number}</div>
      <div className="body-medium">{label}</div>
    </div>
  );
};

// Testimonial Card Component
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role, rating }) => {
  return (
    <div className="glass-card p-6">
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <IconStar key={i} className="w-5 h-5 text-yellow-400" />
        ))}
      </div>
      <p className="body-medium mb-4 italic">"{quote}"</p>
      <div className="border-t border-gray-700 pt-4">
        <div className="font-semibold text-white">{author}</div>
        <div className="body-small">{role}</div>
      </div>
    </div>
  );
};

export default LandingPage;
