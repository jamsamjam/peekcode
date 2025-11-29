import { createStore, action, createTypedHooks } from 'easy-peasy';
import type { Action } from 'easy-peasy';
import { persist } from 'easy-peasy';

interface PeekCodeStore {
    jwt: string|null,
    setToken: Action<PeekCodeStore, string|null>
}

export const store = createStore<PeekCodeStore>(
    persist({
      jwt: null,
      setToken: action((state, payload) => {
        state.jwt = payload;
      }),
    })
  );

const typedHooks = createTypedHooks<PeekCodeStore>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;