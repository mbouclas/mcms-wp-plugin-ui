import {BaseHttpService} from "./base-http.service";
import {
    CloudflareBuildStages,
    ICloudflareBuildQueryQueryResult,
    ICloudflareHistoryQueryResult,
    ICloudflareHistoryResult
} from "../models/cloudflare";
import type {IBuildResult} from "../models/sync";
import {ActionStatuses, updateActionsStore} from "../stores/actions";

export class SyncService extends BaseHttpService {
    public async refresh() {
        return await this.get('sync/refresh') as IBuildResult;
    }

    public async getHistory(page: number = 1) {
        return await this.get(`sync/history?page=${page}`)as ICloudflareHistoryQueryResult;
    }

    public async getBuildStatus(id: string) {
        return await this.get(`sync/status?id=${id}`)as ICloudflareHistoryResult;
    }

    public async build() {

        const res = await this.post('sync/build') as ICloudflareBuildQueryQueryResult;

        updateActionsStore({
            action: ActionStatuses.BUILD,
            lastBuildId: res.result.id,
            checkRequired: true,
            lastBuildResult: res.result,
            buildProgress: 0,
            currentStage: CloudflareBuildStages[0],
        });

        return res;
    }
}
