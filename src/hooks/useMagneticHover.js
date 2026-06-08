import { useEffect, useRef } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const useMagneticHover = (strength = 8) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const handleMouseMove = (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      const moveX = clamp((x / rect.width) * strength, -strength, strength);
      const moveY = clamp((y / rect.height) * strength, -strength, strength);
      element.style.setProperty('--mx', `${moveX}px`);
      element.style.setProperty('--my', `${moveY}px`);
    };

    const reset = () => {
      element.style.setProperty('--mx', '0px');
      element.style.setProperty('--my', '0px');
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', reset);
    element.addEventListener('blur', reset);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', reset);
      element.removeEventListener('blur', reset);
    };
  }, [strength]);

  return ref;
};

export default useMagneticHover;
