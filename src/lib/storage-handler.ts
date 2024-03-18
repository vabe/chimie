export class StorageHandler<T> {
	private storage: chrome.storage.LocalStorageArea | undefined;

	constructor(private type: string) {
		if (type === 'chrome') {
			this.storage = chrome.storage.local;
		} else {
			console.error('Storage type not supported.');
			this.storage = undefined;
		}
	}

	get(key: string) {
		return this.storage?.get(key) as T;
	}

	update(key: string, value: T) {
		this.storage?.set({ [key]: value });
	}
}
