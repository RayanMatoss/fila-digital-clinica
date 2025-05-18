import React, { useEffect, useRef, useState } from "react";

interface GooeyTextProps {
  texts: string[];
  morphTime?: number; // segundos
  cooldownTime?: number; // segundos
  className?: string;
}

export const GooeyText: React.FC<GooeyTextProps> = ({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [morph, setMorph] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    let animationFrame: number;
    let lastTime = lastTimeRef.current;

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      lastTimeRef.current = now;

      if (!cooldown) {
        setMorph((prev) => {
          const next = prev + dt / morphTime;
          if (next >= 1) {
            setCooldown(true);
            setTimeout(() => {
              setCurrentIndex((i) => (i + 1) % texts.length);
              setMorph(0);
              setCooldown(false);
            }, cooldownTime * 1000);
            return 1;
          }
          return next;
        });
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [cooldown, morphTime, cooldownTime, texts.length]);

  // Interpolação entre o texto atual e o próximo
  const current = texts[currentIndex];
  const next = texts[(currentIndex + 1) % texts.length];
  const progress = morph;

  // Efeito visual: fade entre os textos
  return (
    <span className={className} style={{ position: "relative", display: "inline-block", minWidth: 60 }}>
      <span
        style={{
          opacity: 1 - progress,
          position: "absolute",
          left: 0,
          top: 0,
          transition: "opacity 0.2s",
        }}
      >
        {current}
      </span>
      <span
        style={{
          opacity: progress,
          position: "absolute",
          left: 0,
          top: 0,
          transition: "opacity 0.2s",
        }}
      >
        {next}
      </span>
      <span style={{ opacity: 0 }}>{current}</span>
    </span>
  );
}; 