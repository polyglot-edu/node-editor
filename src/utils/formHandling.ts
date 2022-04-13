import { BaseButton, IDropdownOption } from "@fluentui/react";
import type { PartialDeep } from 'type-fest';


export type TextInputEvent =
    | React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type DropdownEvent =
    | React.FormEvent<HTMLDivElement>;

export type RatingEvent =
    | React.FormEvent<HTMLElement>;

export type ButtonEvent =
    | React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLDivElement | BaseButton | HTMLSpanElement, MouseEvent>

// TODO: maybe change this to
/*
    type EventActionWithParameter<T, K> = ((v: K, e?: T) => void)
    type EventAction<T> = ((e: T) => void);

*/
type EventAction<K> = ((v: K) => void)
type EventHandler<T, K> = (action: EventAction<K>) => ((e: T, ...args: any[]) => void);

export const textInputEventAdapter: EventHandler<TextInputEvent, string> = (action) => {
    return (e: TextInputEvent) => action(e.currentTarget.value);
}

export const dropdownEventAdapter: EventHandler<DropdownEvent, string> = (action) => {
    return (e: DropdownEvent, option: IDropdownOption) => action(option.key as string);
}

export const ratingEventAdapter: EventHandler<RatingEvent, number> = (action) => {
    return (e: RatingEvent, rating: number) => action(rating);
}

export const buttonEventAdapter: EventHandler<ButtonEvent, ButtonEvent | undefined> = (action) => {
    return (e: ButtonEvent) => action(e);
}

// manually curried version of 
// function eventHandlerFactory<T, K, V>(
//     applyUpdate: (value: Partial<T>) => void,
//     eventHandler: EventHandler<K, V>,
//     updateValue: (value: V) => Partial<T>,
//     logging = false,
//     loggingLine = ""
// )
export function eventHandlerFactory<T>(applyUpdate: (value: PartialDeep<T>) => void) {
    return <K, V>(eventHandler: EventHandler<K, V>) => {
        return (updateValue: (value: V) => PartialDeep<T>, logging = false, loggingLine = "") => {
            return eventHandler(value => {
                const newValue = updateValue(value);
                if (logging) {
                    console.log("Input handled: " + loggingLine);
                    console.table(newValue);
                }
                applyUpdate(newValue);
            })
        }
    }
}

// TODO: test this function
export function updater<T>() {
    return function <K extends Path<T>>(fieldToUpdate: K) {
        return function <W extends PathValue<T, K>>(value: W): PartialDeep<T> {
            if (typeof fieldToUpdate === "string") {
                // TODO: maybe remove 'any' for a bit more type safety
                return fieldToUpdate.split(".").reverse().reduce((obj, curr) => ({ [curr]: obj }), value as any);
            }
            // TODO: maybe remove 'as' for a bit more type safety
            return { [fieldToUpdate]: value } as unknown as PartialDeep<T>;
        }
    }
}