import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
    threshold?: number; // How much of the element should be visible before it's considered "in view"
    rootMargin?: string; // Margin around viewport to trigger earlier/later
    once?: boolean; // if true, stops observing after first trigger
}

export const useInView = <T extends HTMLElement = HTMLDivElement>({
    threshold = 0.15,
    rootMargin = "0px 0px -60px 0px",
    once = true,
}: UseInViewOptions = {}) => {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    if (once) observer.unobserve(element); // stops watching after first trigger if once=true
                } else {
                    if (!once) setInView(false); // only reset if we're not in "once" mode
                }
            },
            { threshold, rootMargin },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return { ref, inView };
}

// NOTE:
// The key detail here is once: true as the default — bars animate in on scroll, and stay animated. They don't reset every time you scroll up and back down, which would feel janky and cheap.
// The rootMargin: "0px 0px -60px 0px" means the animation fires slightly before the element fully enters the viewport - so it feels responsive rather than late