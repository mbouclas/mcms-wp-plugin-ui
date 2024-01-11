<script lang="ts">
    import  '../app.css';

    import {Button, ButtonGroup, Modal} from "flowbite-svelte";
    import {appStore} from "../stores/app";
    import type {ISyncSettings} from "../models/sync";
    import {ArrowUpRightFromSquareOutline,  CogOutline} from "flowbite-svelte-icons";
    import {SyncService} from "../services/sync.service";
    import {actions, ActionStatuses, updateActionsStore} from "../stores/actions";

    import {attachStylesToShadowRoot} from "../helpers/shadow-root";
    export let mode: 'compact'|'full' = 'compact';
    let ready = false;
    let settings: Partial<ISyncSettings>;
    let dropdownOpen = false;
    let loading = false;
    let progress = 0;
    let building = false;

    appStore.subscribe(state => {
        if (!state.ready) {
            return;
        }

        attachStylesToShadowRoot('refresh-data');
        settings = state.syncSettings;
        ready = true;
    });

    actions.subscribe(async state => {
        if (state.action === ActionStatuses.ACTIVE) {
            progress = state.buildProgress;
            building = true;
            return;
        }

        if (state.action === ActionStatuses.COMPLETE) {
            building = false;
            return;
        }
    });



    function onClickButton() {
        dropdownOpen = !dropdownOpen;
    }

    function openPreviewSite() {
        window.open(settings["preview-site-url"], '_blank');
    }


    async function performRefresh() {
        loading = true;
        const res = await new SyncService().refresh();
        loading = false;
    }

    function startBuild() {
        updateActionsStore({
            action: ActionStatuses.BUILD,
            checkRequired: true
        });
        dropdownOpen = false;
    }

</script>
<svelte:options customElement={{
    tag: 'refresh-data',
    shadow: 'open',

}} />

<Modal size="lg" bind:open={dropdownOpen} title="Select option">
    <ButtonGroup class="space-x-px">
        <Button color="blue" class="gap-2.5" on:click={openPreviewSite}><ArrowUpRightFromSquareOutline /> Open Preview Site</Button>
        <Button color="purple" class="gap-2.5" on:click={performRefresh}>
            <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"/>
            </svg>
            Perform Refresh</Button>
        {#if building}
            <Button color="red" class="gap-2.5" disabled><CogOutline /> Building {progress}%</Button>
        {:else}
            <Button color="green" class="gap-2.5" on:click={startBuild}><CogOutline /> Start Build</Button>
        {/if}

    </ButtonGroup>
</Modal>

{#if ready}
    {#if mode === 'compact'}
    {#if building}
        {progress}%
        {:else}
    <a href="#" title="Refresh Data" on:click|preventDefault={onClickButton} style="height: 32px !important;">
        <svg style="height: 16px !important; padding-top: 8px" class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"/>
        </svg>
    </a>
        {/if}
    {:else}
        <ul class="space-y-1.5 p-4">
            <li>
                <Button color="blue" class="gap-2.5 w-full" on:click={openPreviewSite}><ArrowUpRightFromSquareOutline /> Open Preview Site</Button>
            </li>
            <li>
                <Button color="purple" class="gap-2.5 w-full" on:click={performRefresh}>
                    <svg class="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"/>
                    </svg>
                    Perform Refresh</Button>
            </li>
            <li>
                {#if building}
                    <Button color="red" class="gap-2.5 w-full" disabled><CogOutline /> Building {progress}%</Button>
                {:else}
                    <Button color="green" class="gap-2.5 w-full" on:click={startBuild}><CogOutline /> Start Build</Button>
                {/if}
            </li>
        </ul>



    {/if}


{/if}
