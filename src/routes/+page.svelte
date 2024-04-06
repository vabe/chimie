<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import * as Tabs from '$lib/components/ui/tabs';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import {
		copyToClipboard,
		getRandomMoleculeFromApi,
		getSVGFromSmiles,
		parseResponseToMolecule,
		type Molecule,
		type MoleculeStorage
	} from '$lib/utils';
	import { TRANSITION_DURATION, representationMapper, representationTypes } from '$lib/constants';

	import Spinner from '$lib/components/spinner.svelte';
	import CopyButton from '$lib/components/copy-button.svelte';
	import MoleculeHistoryItem from '$lib/components/molecule-history-item.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { StorageHandler } from '$lib/storage-handler';

	let isLoading: boolean = false;
	let isOnline: boolean = true;
	let selectedMolecule: Molecule;
	let moleculeHistory: MoleculeStorage;
	let storageHandler: StorageHandler<MoleculeStorage>;
	let activeTab: 'Copy' | 'History' = 'Copy';

	// TODO: add support for other browsers
	$: if (typeof chrome !== 'undefined') {
		if (typeof moleculeHistory !== 'undefined') {
			storageHandler.update('molecules', moleculeHistory);
		}
	}

	onMount(async () => {
		const { StorageHandler } = await import('$lib/storage-handler');
		storageHandler = new StorageHandler<MoleculeStorage>('chrome');
		moleculeHistory = await storageHandler.get('molecules') ?? [];
	});

	async function getMolecule() {
		const molecule = await getRandomMoleculeFromApi();

		return parseResponseToMolecule(molecule);
	}

	// TODO: Add local storage support
	function getMoleculeFromLocal() {
		console.log('Local molecule');
	}

	async function handleFormSubmit() {
		isLoading = true;
		let molecule;

		if (isOnline) {
			molecule = await getMolecule();
		} else {
			// molecule = await getMoleculeFromLocal();
		}

		if (!molecule) {
			isLoading = false;
			return;
		}

		isLoading = false;
		selectedMolecule = molecule;

		moleculeHistory = await saveMolecule(selectedMolecule);
	}

	function handleClearHistory() {
		moleculeHistory = [];
		moleculeHistory = moleculeHistory;
	}

	async function saveMolecule(molecule: Molecule) {
		const currentHistory = await storageHandler.get('molecules');
		console.log(currentHistory);

		if (currentHistory.length === 20) {
			currentHistory.pop();
		}

		return [molecule, ...currentHistory];
	}

	function handleTabChange(value: any) {
		activeTab = value;
	}
</script>

<Tabs.Root value="Copy" class="w-[350px] border-2" onValueChange={handleTabChange}>
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="Copy">Copy</Tabs.Trigger>
		<Tabs.Trigger value="History">History</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="Copy">
		{#if activeTab === 'Copy'}
			<form
				on:submit|preventDefault={handleFormSubmit}
				transition:fly={{ x: 10, duration: TRANSITION_DURATION }}
			>
				<Card.Root class="rounded-none shadow-none border-none">
					<Card.Header class="p-4 py-2">
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
						<div class="flex justify-center align-middle">
							{#if selectedMolecule}
								<span in:fade>
									{@html getSVGFromSmiles(selectedMolecule.smiles)}
								</span>
							{:else}
								<div class="flex items-center justify-center h-32 bg-gray-100 rounded-md w-full">
									<span class="text-muted-foreground">No molecule to display</span>
								</div>
							{/if}
						</div>
					</Card.Header>
					<Card.Content class="grid gap-4 p-4 pb-0">
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
					</Card.Content>
				</Card.Root>
			</form>
		{/if}
	</Tabs.Content>
	<Tabs.Content value="History">
		{#if activeTab === 'History'}
			<div
				class="p-4 flex flex-col gap-2 pt-2 pr-0 pb-0"
				transition:fly={{ x: -10, duration: TRANSITION_DURATION }}
			>
				<ScrollArea class="h-[230px] pr-4">
					<div class="flex flex-col gap-2">
						{#if typeof moleculeHistory === 'undefined' || moleculeHistory.length === 0}
							<div
								class="flex items-center justify-center h-[230px] bg-gray-100 rounded-md w-full"
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
					<Button variant="ghost" on:click={handleClearHistory}>Clear history</Button>
				</div>
			</div>
		{/if}
	</Tabs.Content>
	<Footer />
</Tabs.Root>
