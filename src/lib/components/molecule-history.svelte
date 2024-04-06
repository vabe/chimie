<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Button } from '$lib/components/ui/button';
	import MoleculeHistoryItem from '$lib/components/molecule-history-item.svelte';
	import { type Molecule } from '$lib/utils';
	import { TRANSITION_DURATION } from '$lib/constants';

	export let moleculeHistory: Molecule[];
	export let onClearHistory: () => void;
</script>

<div
	class="p-4 flex flex-col gap-2 pt-2 pr-0 pb-0"
	transition:fly={{ x: -10, duration: TRANSITION_DURATION }}
>
	<ScrollArea class="h-[230px] pr-4">
		<div class="flex flex-col gap-2">
			{#if typeof moleculeHistory === 'undefined' || moleculeHistory.length === 0}
				<div
					class="flex items-center justify-center h-[230px] bg-gray-100 dark:bg-gray-800 rounded-md w-full"
					transition:fade={{ duration: TRANSITION_DURATION }}
				>
					<span class="text-muted-foreground">No history to display</span>
				</div>
			{:else}
				{#each moleculeHistory as molecule}
					<MoleculeHistoryItem {molecule} />
				{/each}
			{/if}
		</div>
	</ScrollArea>
	<div class="pr-4 flex flex-col gap-2">
		<p class="text-xs font-normal leading-snug text-muted-foreground">
			These are the last 20 generated molecules. Generating new ones will remove the oldest.
		</p>
		<Button variant="ghost" on:click={onClearHistory}>Clear history</Button>
	</div>
</div>
