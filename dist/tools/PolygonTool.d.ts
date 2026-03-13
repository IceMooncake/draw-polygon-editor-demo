import { Tool } from './Tool.js';
import { EditorContext } from '../core/EditorContext.js';
export declare class PolygonTool implements Tool {
    private context;
    name: string;
    private currentPoints;
    private mousePos;
    private ghostPoint;
    constructor(context: EditorContext);
    activate(): void;
    deactivate(): void;
    onMouseDown(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onClick(e: MouseEvent): void;
    onDblClick(e: MouseEvent): void;
    private completePolygon;
    undo(): boolean;
    draw(ctx: CanvasRenderingContext2D): void;
    private getRelativePos;
    private getHoverPoint;
    private getColor;
}
//# sourceMappingURL=PolygonTool.d.ts.map