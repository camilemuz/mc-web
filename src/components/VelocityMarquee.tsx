import React, { useEffect, useRef, useState } from 'react';

interface VelocityMarqueeProps {
  words: string[];
  baseVelocity?: number;
  className?: string;
}

export const VelocityMarquee: React.FC<VelocityMarqueeProps> = ({
  words,
  baseVelocity = -0.25,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // If hovered, pause smoothly so text is 100% comfortable to read
      if (!isHovered) {
        offsetRef.current += baseVelocity;

        // Wrap around percentage (-25% boundary)
        if (offsetRef.current <= -25) {
          offsetRef.current += 25;
        } else if (offsetRef.current >= 0) {
          offsetRef.current -= 25;
        }

        if (containerRef.current) {
          containerRef.current.style.transform = `translateX(${offsetRef.current}%)`;
        }
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [baseVelocity, isHovered]);

  return (
    <div
      aria-hidden="true"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full overflow-hidden border-y border-neutral-900 bg-[#070709] py-4 select-none cursor-default group ${className}`}
      title="Pasa el cursor para pausar la lectura"
    >
      <div
        ref={containerRef}
        className="flex w-max flex-nowrap will-change-transform"
        style={{ transform: 'translateX(0%)' }}
      >
        {/* Render 4 copies for seamless wrapping */}
        {[0, 1, 2, 3].map((copyIdx) => (
          <div key={copyIdx} className="flex shrink-0 items-center">
            {words.map((word, wordIdx) => (
              <React.Fragment key={wordIdx}>
                <span
                  className={`px-8 font-display text-xl sm:text-3xl font-extrabold uppercase tracking-widest transition-colors ${
                    word.toLowerCase().includes('sueños')
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF2E50] to-[#E6002B] drop-shadow-[0_0_18px_rgba(230,0,43,0.7)] font-black'
                      : 'text-neutral-300 group-hover:text-white'
                  }`}
                >
                  {word}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#E6002B] shrink-0 mx-3 shadow-[0_0_8px_#E6002B]" />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
