import { Tool } from './Tool.js';
import { EditorContext } from '../core/EditorContext.js';
export declare class EditTool implements Tool {
    private context;
    name: string;
    private draggingPoint;
    private ghostPoint;
    private mousePos;
    private isDragging;
    private hasSavedState;
    constructor(context: EditorContext);
    private isAxisAligned;
    activate(): void;
    deactivate(): void;
    onMouseDown(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onClick(e: MouseEvent): void;
    onDblClick(e: MouseEvent): void;
    draw(ctx: CanvasRenderingContext2D): void;
    private getRelativePos;
    private getHoverPoint;
}
//# sourceMappingURL=EditTool.d.ts.map