import { Point, EditorOptions, PolygonCallback } from './types.js';
import { Scene } from './core/Scene.js';
import { HistoryManager } from './core/HistoryManager.js';
import { EditorContext } from './core/EditorContext.js';
export declare class PolygonEditor implements EditorContext {
    container: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    scene: Scene;
    history: HistoryManager;
    private renderer;
    private tools;
    private activeTool;
    options: Required<EditorOptions>;
    private onComplete;
    private isActive;
    private resizeObserver;
    private handlers;
    private rafId;
    /**
     * constructor
     * @param element target DOM
     * @param options options
     */
    constructor(element: HTMLElement, options?: EditorOptions);
    setTool(name: 'polygon' | 'rectangle' | 'edit'): void;
    /**
     * callback when polygon is completed (double-click)
     * @param callback callback function
     */
    setOnComplete(callback: PolygonCallback): void;
    /**
     * enable/show overlay
     */
    enable(): void;
    /**
     * disable/hide overlay
     */
    disable(): void;
    /**
     * reset canvas
     */
    reset(): void;
    /**
     * destroy instance
     */
    destroy(): void;
    /**
     * get all polygons (2D array)
     */
    getPolygons(): Point[][];
    requestDraw(): void;
    notifyPolygonComplete(): void;
    undo(): void;
    redo(): void;
    private initDOM;
    private resizeCanvas;
    private bindEvents;
    private unbindEvents;
    private startLoop;
    private stopLoop;
}
//# sourceMappingURL=PolygonEditor.d.ts.map