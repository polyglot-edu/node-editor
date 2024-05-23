import { PolyglotFlow } from "../flow";

export type PolyglotCourse = {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    flows: PolyglotFlow[];
};