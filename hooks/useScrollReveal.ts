import { useEffect, useRef } from 'react';

export function useScrollReveal(rootMargin = '-50px') {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // We only want to trigger the animation once.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add .is-visible to the container itself if it has .sr
          if (el.classList.contains('sr')) {
            el.classList.add('is-visible');
          }
          // Add .is-visible to all .sr children
          const children = el.querySelectorAll('.sr');
          children.forEach((child) => child.classList.add('is-visible'));
          observer.unobserve(el);
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return ref;
}
