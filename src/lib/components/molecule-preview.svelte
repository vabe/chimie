<script lang="ts">
	import { fade } from 'svelte/transition';
	import { getSVGFromSmiles, type Molecule } from '$lib/utils';

	export let selectedMolecule: Molecule;
</script>

<div class="flex justify-center align-middle">
	{#if selectedMolecule}
		<span in:fade>
			{@html getSVGFromSmiles(selectedMolecule.smiles)}
		</span>
	{:else}
		<div
			class="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-md w-full"
		>
			<span class="text-muted-foreground">No molecule to display</span>
		</div>
	{/if}
</div>
