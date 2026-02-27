import { Point, EditorOptions, PolygonCallback } from './types.js';
export declare class PolygonEditor {
    private container;
    private canvas;
    private ctx;
    private polygons;
    private currentPoints;
    private isActive;
    private mousePos;
    private draggingPoint;
    private isDraggingOperation;
    private hasSavedStateForDrag;
    private ghostPoint;
    private history;
    private resizeObserver;
    private handlers;
    private rafId;
    private options;
    private onComplete;
    /**
     * constructor
     * @param element target DOM
     * @param options options
     */
    constructor(element: HTMLElement, options?: EditorOptions);
    /**
     * callback when polygon is completed (double-click)
     * @param callback callback function
     */
    setOnComplete(callback: PolygonCallback): void;
    /**
     * enable/show overlay (start/continue drawing)
     */
    enable(): void;
    /**
     * disable/hide overlay (pause drawing)
     */
    disable(): void;
    /**
     * reset canvas
     */
    reset(): void;
    /**
     * destroy instance, clean up DOM and events
     */
    destroy(): void;
    /**
     * get all polygons (2D array)
     */
    getPolygons(): Point[][];
    private getColor;
    private initDOM;
    private resizeCanvas;
    private bindEvents;
    private unbindEvents;
    private getRelativePos;
    private getHoverPoint;
    private onClick;
    private onDblClick;
    private onMouseMove;
    private onMouseDown;
    private onMouseUp;
    private saveState;
    private undo;
    private startLoop;
    private stopLoop;
    private draw;
}
//# sourceMappingURL=PolygonEditor.d.ts.map