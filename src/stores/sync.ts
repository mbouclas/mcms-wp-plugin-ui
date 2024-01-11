import {writable} from "svelte/store";

export interface ISyncStore {

}

export const syncStore = writable<Partial<ISyncStore>>({});
