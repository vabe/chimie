<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';

	let timeout: number;
	let isDisabled = false;
	export let disabled: boolean;
	export let onClick: () => void;
	export let tooltip: string;

	onMount(() => {
		return () => {
			clearTimeout(timeout);
		};
	});

	function handleClick() {
		isDisabled = true;
		onClick();
		timeout = setTimeout(() => {
			isDisabled = false;
		}, 1500);
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button
			variant="outline"
			class="border-2 w-full"
			disabled={disabled || isDisabled}
			on:click={handleClick}
		>
			{#if isDisabled}
				Copied
			{:else}
				<slot />
			{/if}
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		{tooltip}
	</Tooltip.Content>
</Tooltip.Root>
