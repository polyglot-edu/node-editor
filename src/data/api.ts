import axiosCreate, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import Router from 'next/router';
import { GeneralMetadata, Metadata } from '../types/metadata';
import {
  polyglotEdgeComponentMapping,
  PolyglotExecutionNext,
  PolyglotFlow,
  PolyglotFlowInfo,
  polyglotNodeComponentMapping,
} from '../types/polyglotElements';
import { ConceptMap } from '../types/polyglotElements/concept/Conceptmap';
import { User } from '../types/user';
import { createNewDefaultPolyglotFlow } from '../utils/utils';
import abstractFlows from './abstractExample';
import exampleFlows from './exampleData';

export type aiAPIResponse = {
  Date: string;
  Question: string;
  CorrectAnswer: string;
};

const axios = axiosCreate.create({
  baseURL: process.env.BACK_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const openQuestionGeneration = axiosCreate.create({
  //baseURL: process.env.AIGENERATION_URL,
  baseURL: 'https://skapi.polyglot-edu.com',
  headers: {
    'Content-Type': 'application/json',
    ApiKey: process.env.APIKEY,
  },
});

type AutocompleteOutput = string[];

export class APIV2 {
  axios: AxiosInstance;
  redirect401: boolean;
  redirect401URL?: string;
  error401: boolean;

  constructor(access_token: string | undefined) {
    this.redirect401 = false;
    this.error401 = true;
    this.axios = axiosCreate.create({
      baseURL: process.env.BACK_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: access_token ? 'Bearer ' + access_token : '',
      },
    });
  }

  setRedirect401(check: boolean, redirect_url?: string) {
    this.redirect401 = check;
    this.redirect401URL = redirect_url;
    return this;
  }

  disable401() {
    this.error401 = false;
    return this;
  }

  async handleGet(path: string) {
    try {
      const resp = await this.axios.get(path);
      return resp;
    } catch (err) {
      if ((err as AxiosError)?.response?.status === 401) {
        const BACK_URL = process.env.BACK_URL;
        const LOGIN_URL =
          BACK_URL + '/api/auth/google?returnUrl=' + Router.asPath;
        if (this.redirect401) await Router.push(LOGIN_URL);
        if (this.error401) throw err;
        return;
      }
      throw err;
    }
  }
  autocomplete(query?: string): Promise<AxiosResponse<AutocompleteOutput>> {
    return this.axios.get('/api/search/autocomplete' + query);
  }
  getUserInfo(): Promise<AxiosResponse<User>> {
    return this.axios.get('/api/user/me');
  }
  logout(): Promise<AxiosResponse> {
    return this.axios.post('/api/auth/logout');
  }
  loadExampleFlowElementsAsync(flowId: string): any {
    const flow = exampleFlows.get(flowId);
    return Promise.resolve({
      data: flow!,
      status: flow ? 200 : 404,
      statusText: flow ? 'OK' : 'Not Found',
      headers: {},
      config: {
        headers: {},
      },
    });
  }

  deleteFlow(flowId: string): Promise<AxiosResponse> {
    return this.axios.delete('/api/flows/' + flowId);
  }

  loadAbstractExampleFlowElementsAsync(
    currentState: string,
    goal: string
  ): any {
    const flow = abstractFlows.get(`${currentState}, ${goal}`); // TODO: fix this, it's a hack but we need deep equality for the map keys
    return Promise.resolve({
      data: flow!,
      status: flow ? 200 : 404,
      statusText: flow ? 'OK' : 'Not Found',
      headers: {},
      config: {},
    });
  }

  loadFlowElementsAsync(flowId: string): Promise<AxiosResponse<PolyglotFlow>> {
    return this.axios.get(`/api/flows/${flowId}`);
  }
  loadFlowList(query?: string): Promise<AxiosResponse<PolyglotFlow[]>> {
    return this.axios.get(`/api/flows` + (query ? query : ''));
  }
  createNewFlowAsync(): Promise<AxiosResponse> {
    return this.axios.post<{}, AxiosResponse, PolyglotFlow>(
      `/api/flows`,
      createNewDefaultPolyglotFlow()
    );
  }
  saveFlowAsync(flow: PolyglotFlow): Promise<AxiosResponse> {
    flow.nodes = flow.nodes?.map((e) =>
      polyglotNodeComponentMapping.applyTransformFunction(e)
    );
    console.log(flow.edges);
    flow.edges = flow.edges.filter((edge) => {
      const source = edge.reactFlow.source;
      const target = edge.reactFlow.target;
      return (
        flow.nodes.filter((node) => node._id === source || node._id === target)
          .length === 2
      );
    });
    console.log(flow.edges);
    flow.edges = flow.edges?.map((e) =>
      polyglotEdgeComponentMapping.applyTransformFunction(e)
    );
    return this.axios.put<{}, AxiosResponse, PolyglotFlow>(
      `/api/flows/${flow._id}`,
      flow
    );
  }
  createNewFlow(flow: PolyglotFlowInfo): Promise<AxiosResponse> {
    return this.axios.post<{}, AxiosResponse, {}>(`/api/flows`, flow);
  }
  createNewFlowJson(flow: PolyglotFlow): Promise<AxiosResponse> {
    return this.axios.post<{}, AxiosResponse, {}>(`/api/flows/json`, flow);
  }
  getConceptGraph(
    topic: string,
    depth: number
  ): Promise<AxiosResponse<ConceptMap>> {
    return this.axios.post('/api/openai/genGraph', {
      topic: topic,
      depth: depth,
    });
  }
}

export const API = {
  edgeMetadata: (type: string): Promise<AxiosResponse<Metadata>> => {
    return axios.get('/api/metadata/edge/' + type);
  },
  nodeMetadata: (type: string): Promise<AxiosResponse<Metadata>> => {
    return axios.get('/api/metadata/node/' + type);
  },
  generalNodeMetadata: (): Promise<AxiosResponse<GeneralMetadata>> => {
    return axios.get('/api/metadata/node');
  },
  generalEdgeMetadata: (): Promise<AxiosResponse<GeneralMetadata>> => {
    return axios.get('/api/metadata/edge');
  },
  autocomplete: (
    query?: string
  ): Promise<AxiosResponse<AutocompleteOutput>> => {
    return axios.get('/api/search/autocomplete?q=' + query);
  },
  getUserInfo: (): Promise<AxiosResponse<User>> => {
    return axios.get('/api/user/me');
  },
  loadExampleFlowElementsAsync: (flowId: string): any => {
    const flow = exampleFlows.get(flowId);
    return Promise.resolve({
      data: flow!,
      status: flow ? 200 : 404,
      statusText: flow ? 'OK' : 'Not Found',
      headers: {},
      config: {},
    });
  },
  loadAbstractExampleFlowElementsAsync: (
    currentState: string,
    goal: string
  ): any => {
    const flow = abstractFlows.get(`${currentState}, ${goal}`); // TODO: fix this, it's a hack but we need deep equality for the map keys
    return Promise.resolve({
      data: flow!,
      status: flow ? 200 : 404,
      statusText: flow ? 'OK' : 'Not Found',
      headers: {},
      config: {},
    });
  },

  loadFlowElementsAsync: (
    flowId: string
  ): Promise<AxiosResponse<PolyglotFlow>> => {
    return axios.get<PolyglotFlow>(`/api/flows/${flowId}`);
  },
  loadFlowList: (query?: string): Promise<AxiosResponse<PolyglotFlow[]>> => {
    const queryParams = query ? '?q=' + query : '';
    return axios.get(`/api/flows` + queryParams);
  },
  createNewFlowAsync: (): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, PolyglotFlow>(
      `/api/flows`,
      createNewDefaultPolyglotFlow()
    );
  },
  saveFlowAsync: (flow: PolyglotFlow): Promise<AxiosResponse> => {
    flow.nodes = flow.nodes?.map((e) =>
      polyglotNodeComponentMapping.applyTransformFunction(e)
    );
    flow.edges = flow.edges?.map((e) =>
      polyglotEdgeComponentMapping.applyTransformFunction(e)
    );
    return axios.put<{}, AxiosResponse, PolyglotFlow>(
      `/api/flows/${flow._id}`,
      flow
    );
  },
  createNewFlow: (flow: PolyglotFlow): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, {}>(`/api/flows`, flow);
  },
  generateNewAIQuestion: (
    body: PolyglotExecutionNext
  ): Promise<AxiosResponse> => {
    return openQuestionGeneration.post<{}, AxiosResponse, {}>(
      `/QuestionExercise/generateexercise`,
      body
    );
  },
};
