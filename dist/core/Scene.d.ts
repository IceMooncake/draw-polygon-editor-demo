import { Point } from '../types.js';
export interface Polygon {
    points: Point[];
    fillColor: string;
    strokeColor: string;
}
export declare class Scene {
    private polygons;
    getPolygons(): Polygon[];
    setPolygons(polygons: Polygon[]): void;
    addPolygon(polygon: Polygon): void;
    clear(): void;
}
//# sourceMappingURL=Scene.d.ts.map