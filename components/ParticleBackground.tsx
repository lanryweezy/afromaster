import React, { useEffect, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';

const ParticleBackground: React.FC = () => {
    const { theme } = useAppContext();
    const particleCount = 40;

    const particles = useMemo(() => {
        return Array.from({ length: particleCount }).map((_, i) => {
            const size = Math.random() * 16 + 12; // 12px to 28px font size
            const duration = Math.random() * 25 + 15; // 15s to 40s
            const delay = Math.random() * -duration; // Start at a random point in the animation
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const endX = Math.random() * 100;
            const endY = Math.random() * 100;

            return {
                id: i,
                note: ['♪', '♫', '♩', '✦', '✧'][Math.floor(Math.random() * 5)],
                style: {
                    '--particle-size': `${size}px`,
                    '--start-x': `${startX}vw`,
                    '--start-y': `${startY}vh`,
                    '--end-x': `${endX}vw`,
                    '--end-y': `${endY}vh`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                } as React.CSSProperties,
            };
        });
    }, []);

    useEffect(() => {
        // The color is now handled by the CSS variable (--color-primary-focus) in index.html
        // which updates automatically when the theme changes via the data-theme attribute.
        // This effect can be simplified or used for other theme-dependent logic if needed.
    }, [theme]);

    return (
        <div id="particle-container" aria-hidden="true">
            {particles.map(p => (
                <div key={p.id} className="particle" style={p.style}>
                    {p.note}
                </div>
            ))}
        </div>
    );
};

export default ParticleBackground;
