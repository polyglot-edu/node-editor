import axiosCreate, { AxiosResponse } from "axios";
import { PolyglotFlow } from "../types/polyglotElements/PolyglotFlow";
import { v4 as UUIDv4 } from "uuid";
import exampleFlows from "./exampleData";
import { polyglotEdgeComponentMapping } from "../types/polyglotElements";

const axios = axiosCreate.create({
    baseURL: "http://localhost",
    headers: {
        'Content-Type': 'application/json',
    }
});

export const API = {
    loadExampleFlowElementsAsync: (flowId: string): Promise<AxiosResponse<PolyglotFlow>> => {
        const flow = exampleFlows.get(flowId);
        return Promise.resolve({
            data: flow!,
            status: flow ? 200 : 404,
            statusText: flow ? "OK" : "Not Found",
            headers: {},
            config: {},
        });
    },

    loadFlowElementsAsync: (flowId: string): Promise<AxiosResponse<PolyglotFlow>> => {
        return axios.get<PolyglotFlow>(`/api/flows/${flowId}`);
    },
    createNewFlowAsync: (): Promise<AxiosResponse> => {
        return axios.post<{}, AxiosResponse, PolyglotFlow>(`/api/flows`, {
            id: UUIDv4(),
            nodes: [],
            edges: [],
        });
    },
    saveFlowAsync: (flow: PolyglotFlow): Promise<AxiosResponse> => {
        flow.edges = flow.edges.map(e => polyglotEdgeComponentMapping.applyTransformFunction(e));
        return axios.put<{}, AxiosResponse, PolyglotFlow>(`/api/flows/${flow.id}`, flow);
    }
}

export default API;