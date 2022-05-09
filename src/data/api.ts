import axiosCreate, { AxiosResponse } from "axios";
import { PolyglotFlow } from "../types/polyglotElements/PolyglotFlow";
import exampleFlows from "./exampleData";

const axios = axiosCreate.create({
    baseURL: "http://localhost",
    headers: {
        'Content-Type': 'application/json',
    },
    transformRequest: [
        (data) => {
            return JSON.stringify(data);
        },
    ],
    transformResponse: [
        (data) => {
            return JSON.parse(data);
        },
    ]
});

export const loadExampleFlowElementsAsync = (flowId: string): Promise<AxiosResponse<PolyglotFlow>> => {
    const flow = exampleFlows.get(flowId);
    return Promise.resolve({
        data: flow!,
        status: flow ? 200 : 404,
        statusText: flow ? "OK" : "Not Found",
        headers: {},
        config: {},
    });
}

export const loadFlowElementsAsync = (flowId: string): Promise<AxiosResponse<PolyglotFlow>> => {
    return axios.get<PolyglotFlow>(`/api/flows/${flowId}`);
}

export default loadFlowElementsAsync