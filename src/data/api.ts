import axiosCreate, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import Router from 'next/router';
import { GeneralMetadata, Metadata } from '../types/metadata';
import {
  polyglotEdgeComponentMapping,
  PolyglotFlow,
  PolyglotFlowInfo,
  polyglotNodeComponentMapping,
} from '../types/polyglotElements';
import { ConceptMap } from '../types/polyglotElements/concept/Conceptmap';
import { User } from '../types/user';
import { createNewDefaultPolyglotFlow } from '../utils/utils';
import abstractFlows from './abstractExample';
import exampleFlows from './exampleData';

const axios = axiosCreate.create({
  baseURL: process.env.BACK_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
    flow.edges = flow.edges?.map((e) =>
      polyglotEdgeComponentMapping.applyTransformFunction(e)
    );
    return this.axios.put<{}, AxiosResponse, PolyglotFlow>(
      `/api/flows/${flow._id}`,
      flow
    );
  }
  async checkPublishFlowAsync(flow: PolyglotFlow): Promise<{
    status: number;
    check: boolean;
    message?: string;
    data?: any;
  }> {
    //function to check the completeness of the nodes
    if (!flow.nodes)
      return { status: 300, check: false, message: 'Error: no nodes found' };
    let missingData = '';
    let startingNode = 0; //need to be == 1 at the end of the check
    flow.nodes.map((e) => {
      let infoCheck = true;
      if (!e.description) infoCheck = false;
      const data = e.data;
      for (const i in data) {
        if (!data[i] || data[i][0] == null) {
          infoCheck = false;
        }
      }
      if (!infoCheck) {
        missingData += e.title + '; ';
        return;
      }
      //if the node has all the info, check the edges-> for each node check if there are an edges with his id as source/target
      let edgeCheck = false;
      flow.edges.map((a) => {
        if (a.reactFlow.target == e._id) edgeCheck = true; //meaning at least one edges has this node as target
      });
      if (edgeCheck) startingNode++; //if no edges has this node as target, it means it's a starting edge
    });
    if (missingData != '')
      return {
        status: 300,
        check: false,
        message: ' Error: missing data for nodes: ' + missingData,
      };
    if (startingNode != 1)
      return {
        status: 300,
        check: false,
        message:
          ' Error: detected ' +
          startingNode +
          ' starting nodes, exacly 1 node must has no incoming edges',
      };

    const response = await this.axios.put<{}, AxiosResponse, PolyglotFlow>(
      `/api/flows/${flow._id}/publish`,
      flow
    );

    console.log(response.data);

    return {
      status: response.status,
      check: true,
      message: response.statusText,
      data: response.data,
    };
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
};
