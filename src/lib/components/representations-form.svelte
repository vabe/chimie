<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import CopyButton from '$lib/components/copy-button.svelte';
	import { copyToClipboard, type Molecule } from '$lib/utils';
	import { representationMapper, representationTypes } from '$lib/constants';

	export let selectedMolecule: Molecule;
</script>

<div class="flex flex-col gap-2">
	<Label for="representation" class="flex flex-col space-y-1">
		<span>Representation</span>
		<span class="text-xs font-normal leading-snug text-muted-foreground">
			Select the representation of the molecule to be copied.
		</span>
	</Label>
	<div class="grid grid-cols-2 gap-2">
		{#each representationTypes as representation}
			<CopyButton
				onClick={() => copyToClipboard(selectedMolecule, representation)}
				disabled={!selectedMolecule}
				tooltip={`Copy ${representationMapper[representation]}`}
			>
				{representationMapper[representation]}
			</CopyButton>
		{/each}
	</div>
</div>
