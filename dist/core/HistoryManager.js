export class HistoryManager {
    constructor(scene, maxHistorySize = 20) {
        this.history = [];
        this.redoStack = [];
        this.scene = scene;
        this.maxHistorySize = maxHistorySize;
    }
    pushState() {
        const snapshot = {
            polygons: this.scene.getPolygons().map(p => ({
                points: p.points.map(pt => ({ ...pt })),
                fillColor: p.fillColor,
                strokeColor: p.strokeColor
            }))
        };
        this.history.push(snapshot);
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        }
        this.redoStack = []; // Clear redo stack on new action
    }
    undo() {
        if (this.history.length === 0)
            return;
        // Save current state to redo stack first
        const currentState = {
            polygons: this.scene.getPolygons().map(p => ({
                points: p.points.map(pt => ({ ...pt })),
                fillColor: p.fillColor,
                strokeColor: p.strokeColor
            }))
        };
        this.redoStack.push(currentState);
        const prevState = this.history.pop();
        // Restore state
        this.restoreState(prevState);
    }
    redo() {
        if (this.redoStack.length === 0)
            return;
        const nextState = this.redoStack.pop();
        // Save current state to history stack
        const currentState = {
            polygons: this.scene.getPolygons().map(p => ({
                points: p.points.map(pt => ({ ...pt })),
                fillColor: p.fillColor,
                strokeColor: p.strokeColor
            }))
        };
        this.history.push(currentState);
        this.restoreState(nextState);
    }
    restoreState(state) {
        // Deep copy when restoring to avoid reference issues
        const restoredPolygons = state.polygons.map(p => ({
            points: p.points.map(pt => ({ ...pt })),
            fillColor: p.fillColor,
            strokeColor: p.strokeColor
        }));
        this.scene.setPolygons(restoredPolygons);
    }
}
//# sourceMappingURL=HistoryManager.js.map