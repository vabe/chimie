<script lang="ts">
	import { onMount } from 'svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import * as Tabs from '$lib/components/ui/tabs';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import {
		copyToClipboard,
		getRandomMoleculeFromApi,
		getSVGFromSmiles,
		parseResponseToMolecule
	} from '$lib/utils';
	import {
		representationMapper,
		representationTypes,
		type RepresentationType,
	} from '$lib/constants';

	import Spinner from '$lib/components/spinner.svelte';
	import CopyButton from '$lib/components/copy-button.svelte';
	import MoleculeHistoryItem from '$lib/components/molecule-history-item.svelte';
	import Footer from '$lib/components/footer.svelte';

	let isLoading: boolean = false;
	let isOnline: boolean = true;
	let selectedMolecule: Record<RepresentationType, string>;
	let moleculeHistory: Record<RepresentationType, string>[];

	$: if (typeof chrome !== 'undefined') {
		if (typeof moleculeHistory !== 'undefined') {
			chrome.storage.local.set({ molecules: moleculeHistory });
		}
	}

	onMount(async () => {
		moleculeHistory = ((await chrome.storage.local.get('molecules')) as MoleculeStorage).molecules;
	});

	type MoleculeStorage = {
		molecules: Record<RepresentationType, string>[];
	};

	async function getMolecule() {
		const molecule = await getRandomMoleculeFromApi();

		return parseResponseToMolecule(molecule);
	}

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
		console.log('Clearing history');
		moleculeHistory = [];
		moleculeHistory = moleculeHistory;
	}

	async function saveMolecule(molecule: Record<RepresentationType, string>) {
		const currentHistory = (await chrome.storage.local.get('molecules')) as MoleculeStorage;

		if (currentHistory.molecules.length === 20) {
			currentHistory.molecules.pop();
		}

		return [molecule, ...currentHistory.molecules];
	}
</script>

<Tabs.Root value="Copy" class="w-[350px] border-2">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="Copy">Copy</Tabs.Trigger>
		<Tabs.Trigger value="History">History</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="Copy">
		<form on:submit|preventDefault={handleFormSubmit}>
			<Card.Root class="rounded-none shadow-none border-none">
				<Card.Header class="p-4 py-2">
					<Button
						variant="outline"
						class="w-full border-2 relative overflow-hidden"
						type="submit"
						disabled={isLoading}
					>
						{#if isLoading}
							<span class="flex items-center"><Spinner /> Loading...</span>
						{:else}
							<div class="flex gap-1 items-center">
								<span> Generate molecule </span>
								<div class="w-6 h-6 flex justify-center items-center">
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
							{@html getSVGFromSmiles(selectedMolecule.smiles)}
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
	</Tabs.Content>
	<Tabs.Content value="History">
		<div class="p-4 flex flex-col gap-2 pt-2 pr-0 pb-0">
			<ScrollArea class="h-[240px] pr-4">
				<div class="flex flex-col gap-2">
					{#if typeof moleculeHistory === 'undefined' || moleculeHistory.length === 0}
						<div class="flex items-center justify-center h-[240px] bg-gray-100 rounded-md w-full">
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
	</Tabs.Content>
	<Footer />
</Tabs.Root>
