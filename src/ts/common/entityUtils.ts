import { EntityBase } from "./interfaces";

export function createEntity(): EntityBase {
	return { id: 0, x: 0, y: 0, vx: 0, vy: 0, right: false, name: 'Faith Donk' };
}

export function createFromJoin(id: number, x: number, y: number, right: boolean): EntityBase {
	return { id, x, y, right, vx: 0, vy: 0, name: 'Faith Donk' /* TODO: implement */ };
}

export function randomPosition(entity: EntityBase) {
	entity.x = Math.floor(1024 * Math.random());
	entity.y = Math.floor(768 * Math.random());
	entity.right = Math.random() < 0.5;
	return entity;
}

export function isMoving(entity: EntityBase) {
	return entity.vx !== 0 || entity.vy !== 0;
}

let lastMoveUpdate = 0;
export function moveUpdate(now: number, entities: (EntityBase | { entity: EntityBase } | undefined)[]) {
	if (now - lastMoveUpdate >= 20) {
		lastMoveUpdate = now;
		entities.forEach(e => {
			if (!e) return;
			if ('entity' in e) {
				if (isMoving(e.entity)) {
					e.entity.x += 2 * e.entity.vx;
					e.entity.y += 2 * e.entity.vy;
					if (e.entity.vx !== 0){
						e.entity.right = e.entity.vx > 0;
					}
				}
			} else {
				if (isMoving(e)) {
					e.x += 2 * e.vx;
					e.y += 2 * e.vy;
					if (e.vx !== 0){
						e.right = e.vx > 0;
					}
				}
			}
		});
	}
} 