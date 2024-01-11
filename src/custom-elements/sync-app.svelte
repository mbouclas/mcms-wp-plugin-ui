<script lang="ts">
    import '../app.css';

    import DefaultLayout from '../layouts/default.svelte';

    let ready = false;
    export let refreshPeriod = 5000;
    import {appStore} from "../stores/app";
    import {actions, ActionStatuses, updateActionsStore} from "../stores/actions";
    import {SyncService} from "../services/sync.service";
    import {CloudflareBuildStages, CloudflareBuildStatus} from "../models/cloudflare";
    import {attachStylesToShadowRoot} from "../helpers/shadow-root";

    const stages = CloudflareBuildStages;
    const numberOfStages = stages.length;
    let isChecking = false;


    window.addEventListener('beforeunload', function (e) {
        updateActionsStore({reloaded: true});
    });

    appStore.subscribe(state => {
       if (!state.ready) {
           return;
       }

        attachStylesToShadowRoot('sync-app');
        ready = true;
    });

    actions.subscribe(async state => {
        // Initial build state. User has just clicked the button
        if (state.action === ActionStatuses.BUILD) {
            await checkBuildStatus(state.lastBuildId)
        }
        // In case of page reload, pick up where we left off
        else if (state.reloaded && state.lastBuildId) {
            updateActionsStore({reloaded: false});
            await checkBuildStatus(state.lastBuildId);
        }
    });

    async function checkBuildStatus(id: string) {
        const res = await new SyncService().getBuildStatus(id);

        if (res.latest_stage.status === CloudflareBuildStatus.SUCCESS) {
            console.log('Build success')
            updateActionsStore({checkRequired: false, lastBuildId: null, action: ActionStatuses.COMPLETE, lastBuildResult: null, buildProgress: 100, currentStage: CloudflareBuildStages[CloudflareBuildStages.length - 1]})
        } else if (res.latest_stage.status === CloudflareBuildStatus.FAILURE) {
            updateActionsStore({
                checkRequired: false,
                lastBuildId: null, action:
                ActionStatuses.FAILED,
                lastBuildResult: null, buildProgress: 0,
                currentStage: null
            });
        }
        else if (res.latest_stage.status === CloudflareBuildStatus.ACTIVE || res.latest_stage.status === CloudflareBuildStatus.IDLE) {
            const currentStage = res.stages.find(stage => stage.status === CloudflareBuildStatus.ACTIVE);
            const currentStageIndex = stages.findIndex(stage => stage.id === currentStage.name);

            updateActionsStore({
                action: ActionStatuses.ACTIVE,
                lastBuildResult: res,
                currentStage: stages[currentStageIndex],
                buildProgress: Math.round((currentStageIndex / numberOfStages) * 100),
                checkRequired: true,
            });

            setTimeout(async () => {
                if (!isChecking) {
                    isChecking = true;
                    await checkBuildStatus(id);
                    isChecking = false;
                }

            }, refreshPeriod);
        }
        else if (res.latest_stage.status === CloudflareBuildStatus.CANCELED) {
            updateActionsStore({
                checkRequired: false,
                lastBuildId: null, action:
                ActionStatuses.CANCELED,
                lastBuildResult: null, buildProgress: 0,
                currentStage: null
            });
        }
    }
</script>

<svelte:options customElement={{
    tag: 'sync-app',
    shadow: 'open'
}} />

{#if ready}
    <DefaultLayout />
{:else}
    <h1>Loading...</h1>
{/if}

