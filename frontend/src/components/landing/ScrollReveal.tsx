"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  style?: React.CSSProperties;
  offsetY?: number;
}

export function ScrollReveal({
  children,
  delayMs = 0,
  className = "",
  style = {},
  offsetY = 28
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : `translateY(${offsetY}px)`,
        transition: `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        willChange: "opacity, transform"
      }}
    >
      {children}
    </div>
  );
}
