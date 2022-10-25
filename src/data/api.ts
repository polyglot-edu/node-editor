import axiosCreate, { AxiosResponse } from "axios";
import { PolyglotFlow, polyglotNodeComponentMapping } from "../types/polyglotElements";
import exampleFlows from "./exampleData";
import abstractFlows from "./abstractExample";
import { polyglotEdgeComponentMapping } from "../types/polyglotElements";
import { createNewDefaultPolyglotFlow } from "../utils/utils";

const axios = axiosCreate.create({
    baseURL: process.env.REACT_APP_BACK_URL || "http://localhost:3000",
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
    loadAbstractExampleFlowElementsAsync: (currentState: string, goal: string): Promise<AxiosResponse<PolyglotFlow>> => {
        const flow = abstractFlows.get(`${currentState}, ${goal}`); // TODO: fix this, it's a hack but we need deep equality for the map keys
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
        flow.nodes = flow.nodes.map(e => polyglotNodeComponentMapping.applyTransformFunction(e));
        flow.edges = flow.edges.map(e => polyglotEdgeComponentMapping.applyTransformFunction(e));
        return axios.put<{}, AxiosResponse, PolyglotFlow>(`/api/flows/${flow._id}`, flow);
    },
    createNewFlow: (flow: PolyglotFlow): Promise<AxiosResponse> => {
        return axios.post<{}, AxiosResponse, {}>(`/api/flows`, flow);
    },
}