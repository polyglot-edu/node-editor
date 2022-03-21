import { useState } from "react";

export type FormInputEvent =
    | React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export const useFormInput = (initialValue: string) => {
    const [value, setValue] = useState(initialValue);

    function handleChange(e: FormInputEvent) {
        setValue(e.currentTarget.value);
        console.warn(e.currentTarget.value);
    }

    return {
        value,
        onChange: handleChange
    };
};

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

type WrappableHook<T, V> = { value: T, onChange: (e: V) => void };

export function useHookWrapper<T, V>(prevHook: WrappableHook<T, V>, newHook: ((prevHook: WrappableHook<T, V>) => WrappableHook<T, V>)) {
    return newHook(prevHook);
}

export function useHookPostActionWrapper<T, V>(prevHook: WrappableHook<T, V>, postAction: ((e: V) => void)) {
    return useHookWrapper(prevHook, h => {
        const { onChange } = h;

        function newOnChange(e: V) {
            onChange(e);
            postAction(e);
        }

        h.onChange = newOnChange;

        return h;
    })
}