declare class FSConfig {
	public config: FSConfigObj;
    constructor();
	loadDir<T = FSConfigObj>(dir: string): Promise<T>;
	loadDirSync<T = FSConfigObj>(dir: string): T;
	loadFile<T = FSConfigObj>(file: string, sync?: boolean): T;
}

interface FSConfigObj {
	[index: string]: any;
}

export = FSConfig;
