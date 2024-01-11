import { writable} from 'svelte/store';
import {AppService} from "../services/app.service";
import type {ISyncSettings} from "../models/sync";
export interface IAppStore {
    baseUrl: string;
    syncSettings: Partial<ISyncSettings>;
    ready: boolean;
}
export const appStore = writable<IAppStore>({
    baseUrl: '/',
    syncSettings: {},
    ready: false,
});



export const updateAppStore = (data: Partial<IAppStore>) => {
    appStore.update((state) => {
        state = { ...state, ...data };
        localStorage.setItem('appStore', JSON.stringify(state));
        return state;
    });
}

export const getStoreDataFromLocalStorage = () => {
    const data = localStorage.getItem('appStore');
    if (data) {
        return JSON.parse(data);
    }
    return null;
}

export async function bootApp() {
    const data = await new AppService().boot();
    // now that we have all the data, we can update the store and do anything else we need to do
    updateAppStore(data);

    return true;
}
