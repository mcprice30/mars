export class Rover {
	constructor() {
		this.manifest = new RoverManifest(),
		this.solPaths = new Map<string, string>()
	}
	manifest: RoverManifest;
	solPaths: Map<string, string>;
}

export class RoverManifest {
	constructor() {
		this.landingDate = "",
		this.launchDate = "",
		this.maxDate = "",
		this.maxSol = 0,
		this.name = "",
		this.status = "",
		this.totalPhotos = 0
	}
	landingDate: string;
	launchDate: string;
	maxDate: string;
    maxSol: number;
	name: string;
    status: string;
    totalPhotos: number;
}