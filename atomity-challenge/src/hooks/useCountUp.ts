import { useEffect, useRef, useState } from "react";

interface UseCountOptions {
    end: number;        // target number to count up to
    duration?: number;  // animation durtion in ms
    start?: number;     // starting number (default 0)
    decimals?: number;  // decimal places to show
    prefix?: string;    // e.g. "$"
    suffix?: string;    // e.g. "%"
    enabled?: boolean;  //only start when true
}

export const useCountUp = ({
    end,
    duration = 1200,
    start = 0,
    decimals = 0,
    prefix = "",
    suffix = "",
    enabled = true,
}: UseCountOptions) => {
    const [value, setValue] = useState(start);
    const rafRef = useRef<number  |  null>(null);
    const startTimeRef = useRef<number  |  null>(null);

    useEffect(() => {
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motioon: reduce)"
        ).matches;

        if (!enabled) return;

        // If incase of a reduced motion, just jump to end immediately
        if (prefersReduced) {
            setValue(end);
            return;
        }

        // easeOutQuart - fast start, gentle finish.
        const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;

            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = start + (end - start) * easedProgress;

            setValue(parseFloat(current.toFixed(decimals)));

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setValue(end); //this ensures we land on the target
            }
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            startTimeRef.current = null;
        };
    }, [end, duration, start, decimals, enabled]);

    //Formatting the dispaly value
    const formatted = `${prefix}${value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}${suffix}`;

    return { value, formatted };
};