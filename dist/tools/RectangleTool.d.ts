import { Tool } from './Tool.js';
import { EditorContext } from '../core/EditorContext.js';
export declare class RectangleTool implements Tool {
    private context;
    name: string;
    private startPoint;
    private currentRect;
    private maskRect;
    constructor(context: EditorContext);
    activate(): void;
    deactivate(): void;
    onMouseDown(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onClick(e: MouseEvent): void;
    onDblClick(e: MouseEvent): void;
    draw(ctx: CanvasRenderingContext2D): void;
    private getRelativePos;
    private getColor;
}
//# sourceMappingURL=RectangleTool.d.ts.map