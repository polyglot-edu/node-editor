import { Edge } from "react-flow-renderer";
import * as t from "io-ts";

export const EdgeData_IoTs = t.type({});
export type EdgeData = t.TypeOf<typeof EdgeData_IoTs>;
export const defaultPolyglotEdgeData: EdgeData = {};



export const PolyglotEdge_IoTs = t.intersection([
    t.type({
        type: t.string,
        title: t.string,
        data: EdgeData_IoTs,
    }),
    t.partial({
        code: t.string,
    })
], "PolyglotEdge");


export type PolyglotEdge = t.TypeOf<typeof PolyglotEdge_IoTs> & {
    reactFlow: Edge<unknown>;
}