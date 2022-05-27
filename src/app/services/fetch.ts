import { Reducer, useEffect, useReducer, useRef } from "react";

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
  fetch: () => Promise<T>;
  key: string;
};

export const useFetch = <T>({ key, fetch }: ServiceProps<T>): Response<T> => {
  const cache = useRef<{ [key: string]: T }>({});

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

  const [state, dispatch] = useReducer<Reducer<Response<T>, Action<T>>>(
    (state, action: Action<T>) => {
      switch (action.type) {
        case Status.FETCHING:
          return { ...state, status: Status.FETCHING };
        case Status.FETCHED:
          return { ...state, status: Status.FETCHED, data: action.payload };
        case Status.FETCH_ERROR:
          return { ...state, status: Status.FETCH_ERROR, error: action.error };
        default:
          return state;
      }
    },
    initialState
  );

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
          cache.current[key] = response;
          if (cancelRequest) return;
          dispatch({ type: Status.FETCHED, payload: response });
        } catch (error) {
          if (cancelRequest) return;
          if (error instanceof Error) {
            dispatch({ type: Status.FETCH_ERROR, error });
          } else if (typeof error === "string") {
            dispatch({
              type: Status.FETCH_ERROR,
              error: new Error(error),
            });
          } else {
            dispatch({
              type: Status.FETCH_ERROR,
              error: new Error("unknown error"),
            });
          }
        }
      }
    };

    doFetch();

    return function cleanup() {
      cancelRequest = true;
    };
  }, [fetch, key]);

  return state;
};
