<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { fly } from 'svelte/transition';
	import { TRANSITION_DURATION } from '$lib/constants';

	let timeout: number;
	let isDisabled = false;
	export let disabled: boolean;
	export let onClick: () => void;
	export let tooltip: string;
	export let size: 'default' | 'icon' | undefined = 'default';

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
		}, 2000);
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button
			variant="outline"
			class="border-2 w-full"
			disabled={disabled || isDisabled}
			on:click={handleClick}
			{size}
		>
			{#if isDisabled}
				<span
					class={size === 'icon' ? 'w-8' : ''}
					in:fly={{ y: 10, duration: TRANSITION_DURATION }}
				>
					{#if size === 'icon'}
						✅
					{:else}
						Copied
					{/if}
				</span>
			{:else}
				<span
					in:fly={{ y: -10, duration: TRANSITION_DURATION }}
					class={size === 'icon' ? 'w-8' : ''}
				>
					<slot />
				</span>
			{/if}
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		{tooltip}
	</Tooltip.Content>
</Tooltip.Root>
