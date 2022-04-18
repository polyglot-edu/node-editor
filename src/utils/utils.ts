import { useState } from "react";

export const useToggleCSSVariable = (variable: string, values: string[]) => {
    if (values.length <= 0) {
        throw new Error("useToggleCSSVariable: values must be an array with at least one element");
    }

    const [currentIndex, setIndex] = useState<number>(0);
    document.documentElement.style.setProperty(variable, values[currentIndex]);

    function handleChange() {
        setIndex((currentIndex + 1) % values.length);
        document.documentElement.style.setProperty(variable, values[currentIndex]);
    }

    return {
        index: currentIndex,
        value: values[currentIndex],
        toggle: handleChange,
    };
}