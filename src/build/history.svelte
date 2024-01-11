<script lang="ts">
import {dateFormat} from "../helpers/dates";
import {
    Badge,
    Button, Heading, Modal,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Table
} from "flowbite-svelte";
import {SyncService} from "../services/sync.service";
import type {ICloudflareHistoryQueryResult, ICloudflareHistoryResult} from "../models/cloudflare";
import {onMount} from "svelte";
import Loading from "../lib/components/Loading.svelte";
import {EyeOutline} from "flowbite-svelte-icons";
import ItemHistory from './build-item-history.svelte';
import Paginator from "../lib/components/Paginator.svelte";
import {actions, ActionStatuses} from "../stores/actions";

let history: ICloudflareHistoryResult[] = [],
    query: ICloudflareHistoryQueryResult,
    itemHistory: ICloudflareHistoryResult;
let loading = false;
let openStatusModal = false;

onMount(async () => {
    await getHistory();
});

actions.subscribe(async state => {
    if (state.action === ActionStatuses.COMPLETE) {
        await getHistory();
        return;
    }
});
async function getHistory(page: number = 1) {
    loading = true;
    query = await new SyncService().getHistory(page);
    history = query.result;
    loading = false;
}

async function getStatus(idx: number) {
    itemHistory = history[idx];
    openStatusModal = true;
}

async function handlePageChange(e: CustomEvent) {
    await getHistory(e.detail);
}
</script>
<Modal size="lg" bind:open={openStatusModal} title="Build Details">
    <div class="flex items-center justify-center">
        <ItemHistory itemId={itemHistory.id} />
    </div>
</Modal>
{#if loading}
    <div class="flex my-6 justify-center">
        <Loading>Loading History...</Loading>
    </div>
    {:else}
    {#if query && query.result_info && history.length > 0}
    <div class="my-4">
        <Heading tag="h4">{query.result_info.total_count} Builds</Heading>
    </div>
<Table>
    <TableHead>
        <TableHeadCell>#ID</TableHeadCell>
        <TableHeadCell>Date</TableHeadCell>
        <TableHeadCell>Status</TableHeadCell>
        <TableHeadCell></TableHeadCell>
    </TableHead>
    <TableBody>
        {#each history as item,idx}
            <TableBodyRow>
                <TableBodyCell>
                    {item.id}
                </TableBodyCell>
                <TableBodyCell>
                    {dateFormat(item.latest_stage.ended_on)}
                </TableBodyCell>
                <TableBodyCell>
                    <Badge color={item.latest_stage.status === 'success' ? 'green' : 'red'} class="text-xs">
                        {item.latest_stage.name}
                    </Badge>

                </TableBodyCell>
                <TableBodyCell>
                    <Button on:click={getStatus.bind(this, idx)}><EyeOutline /></Button>
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>

    <Paginator
            totalPages={query.result_info.total_pages}
            total={query.result_info.total_count}
            currentPage={query.result_info.page}
            on:pageChange={handlePageChange}
    />
    {/if}
    {/if}
