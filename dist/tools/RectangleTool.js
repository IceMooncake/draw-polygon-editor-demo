import { adjustAlpha } from '../utils.js';
export class RectangleTool {
    constructor(context) {
        this.context = context;
        this.name = 'rectangle';
        this.startPoint = null;
        this.currentRect = null; // 4 points
        this.maskRect = null;
    }
    activate() {
        this.context.canvas.style.cursor = 'crosshair';
    }
    deactivate() {
        this.startPoint = null;
        this.currentRect = null;
        this.maskRect = null;
        this.context.requestDraw();
    }
    onMouseDown(e) {
        this.startPoint = this.getRelativePos(e);
        this.context.requestDraw();
    }
    onMouseMove(e) {
        if (!this.startPoint)
            return;
        const currentPos = this.getRelativePos(e);
        // Calculate rectangle points
        // p1 -- p2
        // |     |
        // p4 -- p3
        const x = Math.min(this.startPoint.x, currentPos.x);
        const y = Math.min(this.startPoint.y, currentPos.y);
        const w = Math.abs(this.startPoint.x - currentPos.x);
        const h = Math.abs(this.startPoint.y - currentPos.y);
        this.maskRect = { x, y, w, h };
        this.currentRect = [
            { x: x, y: y },
            { x: x + w, y: y },
            { x: x + w, y: y + h },
            { x: x, y: y + h }
        ];
        this.context.requestDraw();
    }
    onMouseUp(e) {
        if (this.startPoint && this.currentRect) {
            // Avoid zero size rects
            if (this.maskRect && (this.maskRect.w > 2 && this.maskRect.h > 2)) {
                this.context.history.pushState();
                const index = this.context.scene.getPolygons().length;
                const strokeColor = this.getColor(this.context.options.strokeColor, index);
                const fillColor = this.getColor(this.context.options.fillColor, index, strokeColor);
                this.context.scene.addPolygon({
                    points: this.currentRect,
                    fillColor,
                    strokeColor
                });
                this.context.notifyPolygonComplete();
            }
        }
        this.startPoint = null;
        this.currentRect = null;
        this.maskRect = null;
        this.context.requestDraw();
    }
    onClick(e) { }
    onDblClick(e) { }
    draw(ctx) {
        if (this.startPoint && this.currentRect) {
            const index = this.context.scene.getPolygons().length;
            const strokeColor = this.getColor(this.context.options.strokeColor, index);
            const fillColor = this.getColor(this.context.options.fillColor, index, strokeColor);
            ctx.fillStyle = fillColor;
            ctx.strokeStyle = strokeColor;
            ctx.beginPath();
            ctx.moveTo(this.currentRect[0].x, this.currentRect[0].y);
            for (let i = 1; i < this.currentRect.length; i++) {
                ctx.lineTo(this.currentRect[i].x, this.currentRect[i].y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
    getRelativePos(e) {
        const rect = this.context.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    getColor(color, index, fallbackColor) {
        if (color === undefined || color === '') {
            if (fallbackColor) {
                return adjustAlpha(fallbackColor, 0.2);
            }
            return "rgba(0, 0, 0, 0.2)";
        }
        if (Array.isArray(color)) {
            return color[index % color.length];
        }
        return color;
    }
}
//# sourceMappingURL=RectangleTool.js.map