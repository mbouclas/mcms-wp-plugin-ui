<script lang="ts">
    import {onMount} from "svelte";
    import {SyncService} from "../services/sync.service";
    import {CloudflareBuildStages, ICloudflareHistoryResult} from "../models/cloudflare";
    import {Progressbar} from "flowbite-svelte";
    import {actions, ActionStatuses} from "../stores/actions";

    let buildStatus: ICloudflareHistoryResult;
    const numberOfStages = 5;
    let progress = 0;
    const stages = CloudflareBuildStages;
    let currentStage;
    let failed = false;

    onMount(async () => {
        // buildStatus = await new SyncService().getBuildStatus(id);
    });

    actions.subscribe(state => {
        if (state.action === ActionStatuses.ACTIVE || state.action === ActionStatuses.REFRESH) {
            // start the checks

            buildStatus = state.lastBuildResult;
            currentStage = state.currentStage;
            progress = state.buildProgress;
        }
        else if (state.action === ActionStatuses.BUILD ) {
            progress = 0;
            currentStage = stages[0];
        } else if (state.action === ActionStatuses.FAILED || state.action === ActionStatuses.COMPLETE) {
            buildStatus = null;
            currentStage = null;
        }
    });

</script>
{#if currentStage}
<Progressbar bind:progress={progress} bind:labelOutside={currentStage.label} />
{/if}
