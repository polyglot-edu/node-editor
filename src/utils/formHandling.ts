import { IDropdownOption } from "@fluentui/react";
import { curry } from "./utils";

export type TextInputEvent =
    | React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type DropdownEvent =
    | React.FormEvent<HTMLDivElement>;

export type RatingEvent =
    | React.FormEvent<HTMLElement>;

type EventAction = ((v: string) => void)
type EventHandler<T> = (action: EventAction) => ((e: T, ...args: any[]) => void);

export const textInputHandler: EventHandler<TextInputEvent> = (action: EventAction) => {
    return (e: TextInputEvent) => action(e.currentTarget.value);
}

export const dropdownHandler: EventHandler<DropdownEvent> = (action: EventAction) => {
    return (e: DropdownEvent, option: IDropdownOption) => action(option.key as string);
}

export const ratingHandler: EventHandler<RatingEvent> = (action: EventAction) => {
    return (e: RatingEvent, rating: number) => action(`${rating}`);
}
// export const dropdownHandler: EventHandler<DropdownEvent> = (action: EventAction) => {
//     return (e: DropdownEvent, option: IDropdownOption) => action(option.key as string);
// }

const x = dropdownHandler(x => console.log(x));


function _eventHandlerFactory<T>(applyUpdate: (value: Partial<T>) => void) {
    return <K>(eventHandler: EventHandler<K>) => {
        return (updateValue: (value: string) => Partial<T>, logging = false, loggingLine = "") => {
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

const curriedEventHandlerFactory = curry(_eventHandlerFactory);
// const curriedEventHandlerFactory = _eventHandlerFactory;

export { curriedEventHandlerFactory as eventHandlerFactory };

export const simpleStringUpdater = (fieldToUpdate: string) => {
    return (value: string) => ({ [fieldToUpdate]: value });
}