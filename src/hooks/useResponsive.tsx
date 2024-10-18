import { useState, useEffect } from 'react';

export const useResponsive = (breakpoints: number[]) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const updateIndex = () => {
            const width = window.innerWidth;
            const newIndex = breakpoints.findIndex((bp: number) => width <= bp);

            setIndex(newIndex === -1 ? breakpoints.length : newIndex);
        };

        window.addEventListener('resize', updateIndex);

        updateIndex();

        return () => window.removeEventListener('resize', updateIndex);
    }, [breakpoints]);

    return index;
};
