export interface EntityBase {
	id: number;
	x: number;
	y: number;
	vx: number;
	vy: number;
	right: boolean;
	name: string;
}

export const enum Action {
	Join,
	Leave,
	Move,
	ClientsStat,
	Map,
}