export class Rover {
	constructor() {
		this.manifest = new RoverManifest(),
		this.solPaths = new Map<number, string>()
	}
	manifest: RoverManifest;
	solPaths: Map<number, string>;
}

export class RoverManifest {
	constructor() {
		this.landingDate = "",
		this.launchDate = "",
		this.locations = [],
		this.maxDate = "",
		this.maxSol = 0,
		this.name = "",
		this.status = "",
		this.totalPhotos = 0
	}
	landingDate: string;
	launchDate: string;
	locations: RoverLocation[];
	maxDate: string;
    maxSol: number;
	name: string;
    status: string;
    totalPhotos: number;
}

export class RoverSol {
	constructor() {
		this.cameraPaths = new Map<string, string>();
		this.earthDate = "";
		this.latitude = 0.0;
		this.longitude = 0.0;
		this.nearestSols = new Map<number, string>();
		this.thumbnailCamera = "";
		this.thumbnailURL = "";
		this.totalPhotos = 0;
	}
	cameraPaths: Map<string, string>;
	earthDate: string;
	latitude: number;
	longitude: number;
	nearestSols: Map<number, string>;
	thumbnailCamera: string;
	thumbnailURL: string;
	totalPhotos: number;
}

export class RoverCamera {
	constructor() {
		this.images = [];
	}
	images: RoverImage[];
}

export class RoverImage {
	constructor() {
		this.earthDate = "";
		this.url = "";
	}
	earthDate: string;
	url: string;
}

export class RoverLocation {
	constructor() {
		this.latitude = 0;
		this.longitude = 0;
	}
	latitude: number;
	longitude: number;
}