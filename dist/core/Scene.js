export class Scene {
    constructor() {
        this.polygons = [];
    }
    getPolygons() {
        return this.polygons;
    }
    setPolygons(polygons) {
        this.polygons = polygons;
    }
    addPolygon(polygon) {
        this.polygons.push(polygon);
    }
    clear() {
        this.polygons = [];
    }
}
//# sourceMappingURL=Scene.js.map