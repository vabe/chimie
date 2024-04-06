<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import {
		getRandomMoleculeFromApi,
		parseResponseToMolecule,
		type Molecule,
		type MoleculeStorage
	} from '$lib/utils';
	import { TRANSITION_DURATION } from '$lib/constants';

	import Footer from '$lib/components/footer.svelte';
	import { StorageHandler } from '$lib/storage-handler';
	import RepresentationsForm from '$lib/components/representations-form.svelte';
	import GenerateMoleculeButton from '$lib/components/generate-molecule-button.svelte';
	import MoleculePreview from '$lib/components/molecule-preview.svelte';
	import MoleculeHistory from '$lib/components/molecule-history.svelte';

	let isLoading: boolean = false;
	let isOnline: boolean = true;
	let selectedMolecule: Molecule;
	let moleculeHistory: MoleculeStorage;
	let storageHandler: StorageHandler<MoleculeStorage>;

	// TODO: add support for other browsers
	$: if (typeof chrome !== 'undefined') {
		if (typeof moleculeHistory !== 'undefined') {
			storageHandler.update('molecules', moleculeHistory);
		}
	}

	onMount(async () => {
		const { StorageHandler } = await import('$lib/storage-handler');
		storageHandler = new StorageHandler<MoleculeStorage>('chrome');
		moleculeHistory = (await storageHandler.get('molecules')) ?? [];
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

		if (currentHistory.length === 20) {
			currentHistory.pop();
		}

		return [molecule, ...currentHistory];
	}
</script>

<Tabs.Root value="Copy" class="w-[350px] border-2">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="Copy">Copy</Tabs.Trigger>
		<Tabs.Trigger value="History">History</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="Copy">
		<form
			on:submit|preventDefault={handleFormSubmit}
			transition:fly={{ x: 10, duration: TRANSITION_DURATION }}
		>
			<Card.Root class="rounded-none shadow-none border-none">
				<Card.Header class="p-4 py-2">
					<GenerateMoleculeButton {isLoading} />
					<MoleculePreview {selectedMolecule} />
				</Card.Header>
				<Card.Content class="grid gap-4 px-4 py-0">
					<RepresentationsForm {selectedMolecule} />
				</Card.Content>
			</Card.Root>
		</form>
	</Tabs.Content>
	<Tabs.Content value="History">
		<MoleculeHistory {moleculeHistory} onClearHistory={handleClearHistory} />
	</Tabs.Content>
	<Footer />
</Tabs.Root>
