<script lang="ts">
	import { fly } from 'svelte/transition';

	import { Button } from '$lib/components/ui/button';
	import Spinner from '$lib/components/spinner.svelte';

	export let isLoading: boolean;
</script>

<Button
	variant="outline"
	class="w-full border-2 relative overflow-hidden"
	type="submit"
	disabled={isLoading}
>
	{#if isLoading}
		<span class="flex items-center" in:fly={{ y: 10, duration: 300 }}>
			<Spinner /> Loading...
		</span>
	{:else}
		<div class="flex gap-1 items-center" in:fly={{ y: -10, duration: 300 }}>
			<span> Generate molecule </span>
			<div class="w-6 h-6 flex justify-center items-center dark:fill-white">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					x="0px"
					y="0px"
					width="16"
					height="16"
					viewBox="0 0 24 24"
				>
					<path
						d="M 7.1601562 3 L 8.7617188 5 L 19 5 L 19 15 L 16 15 L 20 20 L 24 15 L 21 15 L 21 3 L 7.1601562 3 z M 4 4 L 0 9 L 3 9 L 3 21 L 16.839844 21 L 15.238281 19 L 5 19 L 5 9 L 8 9 L 4 4 z"
					></path>
				</svg>
			</div>
		</div>
	{/if}
</Button>
