import {writable} from "svelte/store";
import type {CloudflareBuildStages, ICloudflareHistoryResult} from "../models/cloudflare";

export enum ActionStatuses {
    BUILD = 'build',
    REFRESH = 'refresh',
    COMPLETE = 'complete',
    FAILED = 'failed',
    ACTIVE = 'active',
    CANCELED = 'canceled',
}

export interface IActionsStore {
    action: ActionStatuses;
    checkRequired: boolean;
    lastBuildId: string;
    lastBuildResult: ICloudflareHistoryResult;
    buildProgress: number;
    currentStage: typeof CloudflareBuildStages[number];
    reloaded: boolean;
    lastUpdate: Date;
}

export const actions = writable<Partial<IActionsStore>>({
    checkRequired: false,
});


export const updateActionsStore = (data: Partial<IActionsStore>) => {
    actions.update((state) => {
        state = { ...state, ...data, ...{lastUpdate: new Date()} };
        localStorage.setItem('actionsStore', JSON.stringify(state));
        return state;
    });
}
