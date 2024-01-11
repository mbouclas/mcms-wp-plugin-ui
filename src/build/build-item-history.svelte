<script lang="ts">
    import type {ICloudflareHistoryResult} from "../models/cloudflare";
    import {Badge, Table, TableBody, TableBodyCell, TableBodyRow, TableHead} from "flowbite-svelte";
    import {dateFormat} from "../helpers/dates";
    import {SyncService} from "../services/sync.service";
    import Loading from "../lib/components/Loading.svelte";
    import {onMount} from "svelte";

    export let itemId: string;
    let item: ICloudflareHistoryResult;
    let loading = false;

    onMount(async () => {
        await getStatus(itemId);
    });

    async function getStatus(id: string) {
        loading = true;
        item = await new SyncService().getBuildStatus(id);
        loading = false;
    }
</script>
{#if loading}
    <div class="flex items-center justify-center">
        <Loading>Please wait...</Loading>
    </div>
    {:else}
    {#if item}
<Table>
    <TableHead>
        <TableBodyCell>Stage</TableBodyCell>
        <TableBodyCell>Started On</TableBodyCell>
        <TableBodyCell>Ended On</TableBodyCell>
        <TableBodyCell>Status</TableBodyCell>
    </TableHead>
    <TableBody>
        {#each item.stages as stage}
            <TableBodyRow>
                <TableBodyCell>{stage.name}</TableBodyCell>
                <TableBodyCell>{dateFormat(stage.started_on)}</TableBodyCell>
                <TableBodyCell>{dateFormat(stage.ended_on)}</TableBodyCell>
                <TableBodyCell>
                    <Badge color={stage.status === 'success' ? 'green' : 'red'}>{stage.status}</Badge>
                </TableBodyCell>
            </TableBodyRow>
        {/each}

    </TableBody>
</Table>
        {/if}
{/if}
