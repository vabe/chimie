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

	async get(key: string) {
		const value = await this.storage?.get(key);
		if (typeof value === 'undefined') {
			return undefined;
		}
		return value[key];
	}

	update(key: string, value: T) {
		this.storage?.set({ [key]: value });
	}
}
