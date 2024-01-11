<script lang="ts">
    import {
        Button,
        ButtonGroup,
        Modal,
    } from "flowbite-svelte";
    import {ArrowUpRightFromSquareOutline, CogOutline} from "flowbite-svelte-icons";
import {onMount} from "svelte";
import {appStore} from "../stores/app";
import type {ISyncSettings} from "../models/sync";
import Loading from "../lib/components/Loading.svelte";
import {SyncService} from "../services/sync.service";
import History from './history.svelte';
    import {actions, ActionStatuses} from "../stores/actions";
    import BuildProgress from "./build-progress.svelte";


let settings: Partial<ISyncSettings> = {};
let loading = false;
let building = false;
let progress = 0;
let showProgress = false;

appStore.subscribe(state => {
    settings = state.syncSettings;
});

actions.subscribe(state => {
    if (state.action === ActionStatuses.ACTIVE) {
        progress = state.buildProgress;
        building = true;
        showProgress = true;
        return;
    }

    if (state.action === ActionStatuses.COMPLETE) {
        building = false;
        showProgress = false;
        return;
    }
});



function openPreviewSite() {
    window.open(settings["preview-site-url"], '_blank');
}

async function performRefresh() {
    loading = true;
    const res = await new SyncService().refresh();
    loading = false;
    console.log(res.output);
}

async function startBuild() {
    loading = true;
    await new SyncService().build();
    loading = false;
}

</script>

<Modal size="sm" bind:open={loading} title="Please wait..."
       dialogClass="fixed top-0 left-0 right-0 h-modal md:inset-0 md:h-full  w-full p-4 flex z-[99999]">
    <div class="flex items-center justify-center">
        <Loading>Please wait...</Loading>
    </div>
</Modal>
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

{#if showProgress}
<div class="my-4">
    <BuildProgress />
</div>
{/if}

<History />
