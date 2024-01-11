<script lang="ts">
    import { onMount } from 'svelte';
    import {bootApp, updateAppStore} from "./stores/app";
    import {IActionsStore, updateActionsStore} from "./stores/actions";

    export let baseUrl: string;


    onMount(async () => {

        updateAppStore({baseUrl});
        await bootApp();

        // check local storage for an ongoing build
        const actionsState = localStorage.getItem('actionsStore');
        try {
            const data = JSON.parse(actionsState) as Partial<IActionsStore>;
            const twoHoursInMilliseconds = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
            const now = new Date();
            // stale data, remove it
            if (!data || !data.lastUpdate || (now.getTime() - new Date(data.lastUpdate).getTime()) > twoHoursInMilliseconds) {
                localStorage.removeItem('actionsStore');
            }

            // only update if there is a last update is not older than 2 hours
            if (data) {
                updateActionsStore(data);

            }
        }
        catch (e) {
            console.log('Could not parse Localstorage item',e);
            localStorage.removeItem('actionsStore');
        }


        updateAppStore({ready: true});

    });


</script>
<svelte:options customElement={{
    tag: 'mcms-app',
    shadow: 'open'
}}></svelte:options>
