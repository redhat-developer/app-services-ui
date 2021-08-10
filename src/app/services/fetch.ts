import { Reducer, useEffect, useReducer, useRef } from 'react';
import { AxiosResponse } from 'axios';

export type Response<T> = {
  status: Status;
  error?: Error;
  data: T | undefined;
};

export enum Status {
  IDLE,
  FETCHING,
  FETCHED,
  FETCH_ERROR,
}

export type ServiceProps<T> = {
  fetch: () => Promise<AxiosResponse<T>>;
  key: string;
};

export const useFetch = <T extends any>({ key, fetch }: ServiceProps<T>): Response<T> => {
  const cache = useRef({});

  type Action<T> = {
    type: Status;
    payload?: T;
    error?: Error;
  };

  const initialState = {
    status: Status.IDLE,
    error: undefined,
    data: undefined,
  } as Response<T>;

  const [state, dispatch] = useReducer<Reducer<Response<T>, Action<T>>>((states, action: Action<T>) => {
    switch (action.type) {
      case Status.FETCHING:
        return { ...initialState, status: Status.FETCHING };
      case Status.FETCHED:
        return { ...initialState, status: Status.FETCHED, data: action.payload };
      case Status.FETCH_ERROR:
        return { ...initialState, status: Status.FETCH_ERROR, error: action.error };
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    let cancelRequest = false;

    const doFetch = async () => {
      dispatch({ type: Status.FETCHING });
      if (cache.current[key]) {
        const data = cache.current[key];
        dispatch({ type: Status.FETCHED, payload: data });
      } else {
        try {
          const response = await fetch();
          cache.current[key] = response.data;
          if (cancelRequest) return;
          dispatch({ type: Status.FETCHED, payload: response.data });
        } catch (error) {
          if (cancelRequest) return;
          dispatch({ type: Status.FETCH_ERROR, payload: error.message });
        }
      }
    };

    doFetch();

    return function cleanup() {
      cancelRequest = true;
    };
  }, []);

  return state;
};
