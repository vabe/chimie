<script lang="ts">
	import {
		representationMapper,
		representationTypes,
		type RepresentationType
	} from '$lib/constants';
	import { copyToClipboard, getSVGFromSmiles } from '$lib/utils';
	import CopyButton from './copy-button.svelte';

	export let molecule: Record<RepresentationType, string>;
</script>

{#if molecule && molecule.smiles}
	<div class="border-2 p-2 flex justify-between items-center">
		<div>{@html getSVGFromSmiles(molecule?.smiles, 100, 35)}</div>
		<div>
			{#each representationTypes as representation}
				<CopyButton
					onClick={() => copyToClipboard(molecule, representation)}
					disabled={false}
					tooltip={`Copy ${representationMapper[representation]}`}
					size="icon"
				>
					{representationMapper[representation].at(0)}
				</CopyButton>
			{/each}
		</div>
	</div>
{/if}
