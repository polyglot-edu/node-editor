import axiosCreate, { AxiosResponse } from "axios";
import { PolyglotFlow } from "../types/polyglotElements";
import exampleFlows from "./exampleData";
import { polyglotEdgeComponentMapping } from "../types/polyglotElements";
import { createNewDefaultPolyglotFlow } from "../utils/utils";

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
        return axios.post<{}, AxiosResponse, PolyglotFlow>(`/api/flows`, createNewDefaultPolyglotFlow());
    },
    saveFlowAsync: (flow: PolyglotFlow): Promise<AxiosResponse> => {
        flow.edges = flow.edges.map(e => polyglotEdgeComponentMapping.applyTransformFunction(e));
        return axios.put<{}, AxiosResponse, PolyglotFlow>(`/api/flows/${flow.id}`, flow);
    }
}

export default API;