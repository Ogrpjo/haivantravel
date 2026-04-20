"use client"; // This is REQUIRED in Next.js for animations and hooks!

import { useRef, useEffect, useState, ElementType, CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

interface SplitHTMLElement extends HTMLElement {
  _rbsplitInstance?: GSAPSplitText | null;
}

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines' | string; 
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties['textAlign'];
  tag?: ElementType;
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean | (() => void);
}

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag: Tag = 'p',
  onLetterAnimationComplete,
  showCallback
}: SplitTextProps) => {
  const ref = useRef<SplitHTMLElement>(null);
  const animationCompletedRef = useRef<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false;
    return document.fonts?.status === 'loaded';
  });

  // Safely store the callback in a ref to prevent stale closures in React
  const onCompleteRef = useRef(onLetterAnimationComplete);
  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  // Wait for fonts to load before splitting text (prevents layout shifts)
  useEffect(() => {
    if (fontsLoaded) return;
    if (typeof document === 'undefined') return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setFontsLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [fontsLoaded]);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded || animationCompletedRef.current) return;
      
      const el = ref.current;

      // Clean up any old GSAP instances if React re-renders strictly
      if (el._rbsplitInstance) {
        el._rbsplitInstance.revert();
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign = marginValue === 0 ? '' : marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
      const startTrigger = `top ${startPct}%${sign}`;

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
      });

      // Safely check what GSAP actually split based on your splitType
      const targets = 
        (splitType?.includes('chars') && splitInstance.chars) || 
        (splitType?.includes('words') && splitInstance.words) || 
        splitInstance.lines;

      // Failsafe: If no text was split, abort the animation to prevent crashes
      if (!targets || targets.length === 0) return;

      gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: {
            each: delay / 1000,
            onComplete: () => {
              // Trigger your handleAnimationComplete here safely
              if (onCompleteRef.current) {
                onCompleteRef.current();
              }
            }
          },
          scrollTrigger: {
            trigger: el,
            start: startTrigger,
            once: true,
            onEnter: () => {
              if (typeof showCallback === 'function') {
                showCallback();
              }
            }
          },
          onComplete: () => {
            animationCompletedRef.current = true;
          },
          willChange: 'transform, opacity',
        }
      );

      el._rbsplitInstance = splitInstance;

      return () => {
        if (el._rbsplitInstance) el._rbsplitInstance.revert();
      };
    },
    { 
      dependencies: [text, fontsLoaded, delay, duration, ease, splitType, threshold, rootMargin], 
      scope: ref 
    }
  );

  const style: CSSProperties = {
    textAlign,
    display: 'inline-block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    willChange: 'transform, opacity'
  };

  const CustomTag = Tag;

  return (
    <CustomTag ref={ref} style={style} className={`split-parent ${className}`}>
      {text}
    </CustomTag>
  );
};

export default SplitText;