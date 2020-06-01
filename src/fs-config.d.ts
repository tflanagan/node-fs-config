declare class FSConfig {
	public config: FSConfigObj;
    constructor();
	async loadDir(dir: string): Promise<FSConfigObj>;
	loadDirSync(dir: string): FSConfigObj;
	loadFile(file: string, sync?: boolean): FSConfigObj;
}

export interface FSConfigObj {
	[index: string]: any;
}

export = FSConfig;
