import { Scene } from './Scene.js';
export declare class HistoryManager {
    private history;
    private redoStack;
    private scene;
    private maxHistorySize;
    constructor(scene: Scene, maxHistorySize?: number);
    pushState(): void;
    undo(): void;
    redo(): void;
    private restoreState;
}
//# sourceMappingURL=HistoryManager.d.ts.map