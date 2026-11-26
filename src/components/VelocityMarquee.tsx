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

      if (!isHovered) {
        offsetRef.current += baseVelocity;

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
      className={`relative w-full overflow-hidden border-y border-slate-200 dark:border-neutral-900 bg-white dark:bg-[#070709] py-4 select-none cursor-default group transition-colors ${className}`}
      title="Pasa el cursor para pausar la lectura"
    >
      <div
        ref={containerRef}
        className="flex w-max flex-nowrap will-change-transform"
        style={{ transform: 'translateX(0%)' }}
      >
        {[0, 1, 2, 3].map((copyIdx) => (
          <div key={copyIdx} className="flex shrink-0 items-center">
            {words.map((word, wordIdx) => (
              <React.Fragment key={wordIdx}>
                <span
                  className={`px-8 font-display text-xl sm:text-3xl font-extrabold uppercase tracking-widest transition-colors ${
                    word.toLowerCase().includes('sueños')
                      ? 'text-[#E6002B] font-black'
                      : 'text-slate-700 dark:text-neutral-300 group-hover:text-slate-950 dark:group-hover:text-white'
                  }`}
                >
                  {word}
                </span>
                <span className="text-[#E6002B] font-bold mx-2">·</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
