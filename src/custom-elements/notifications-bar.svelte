<script lang="ts">
    import '../app.css';

    import {Alert} from "flowbite-svelte";
    import {appStore} from "../stores/app";
    import type {ISyncSettings} from "../models/sync";
    import {actions, ActionStatuses} from "../stores/actions";
    import BuildProgress from "../build/build-progress.svelte";
    import type {ICloudflareHistoryResult} from "../models/cloudflare";
    import {attachStylesToShadowRoot} from "../helpers/shadow-root";
    let ready = false;
    let settings: Partial<ISyncSettings>;
    let buildStatus: ICloudflareHistoryResult = null;
    let failed = false;
    let showProgress = false;

    appStore.subscribe(state => {
        if (!state.ready) {
            return;
        }

        attachStylesToShadowRoot('notifications-bar');
        settings = state.syncSettings;
        ready = true;
    });


actions.subscribe(state => {
    if (state.action === ActionStatuses.ACTIVE || state.action === ActionStatuses.BUILD || state.action === ActionStatuses.REFRESH) {
        // start the checks
        buildStatus = state.lastBuildResult;
        showProgress = true;
    }

    if (state.action === ActionStatuses.COMPLETE) {
        buildStatus = null;
        showProgress = false;
    }

    if (state.action === ActionStatuses.FAILED) {
        buildStatus = null;
        failed = true;
    }
});


</script>
<svelte:options customElement={{
    tag: 'notifications-bar',
    shadow: 'open'
}} />

{#if ready}

        <div class="absolute w-1/3 bottom-4 right-2">

            {#if failed}
                <Alert border dismissable color="red">
                    <p>Failed to build your site. Check the build history.</p>
                </Alert>
                {/if}
            {#if showProgress}
            <Alert border dismissable color="blue">
                <BuildProgress />
            </Alert>
                {/if}
        </div>


    {/if}
