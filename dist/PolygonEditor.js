import { Scene } from './core/Scene.js';
import { HistoryManager } from './core/HistoryManager.js';
import { Renderer } from './core/Renderer.js';
import { PolygonTool } from './tools/PolygonTool.js';
import { RectangleTool } from './tools/RectangleTool.js';
import { EditTool } from './tools/EditTool.js';
import { checkKey } from './utils.js';
const DEFAULT_KEYMAP = {
    undo: ['Control+z', 'Meta+z'],
    redo: ['Control+y', 'Meta+y', 'Control+Shift+z', 'Meta+Shift+z'],
    // Modifier keys to trigger point insertion
    insertPoint: ['Control', 'Meta'],
    delete: ['Backspace', 'Delete']
};
export class PolygonEditor {
    /**
     * constructor
     * @param element target DOM
     * @param options options
     */
    constructor(element, options = {}) {
        // Tools
        this.tools = {};
        this.activeTool = null;
        this.onComplete = null;
        // State
        this.isActive = true;
        this.resizeObserver = null;
        this.handlers = {};
        this.rafId = null;
        this.container = element;
        this.options = {
            fillColor: options.fillColor || '',
            strokeColor: options.strokeColor ?? "#ff0000",
            pointRadius: options.pointRadius ?? 4,
            pointColor: options.pointColor ?? "#ffffff",
            lineDash: options.lineDash ?? [5, 5],
            maxHistorySize: options.maxHistorySize ?? 20,
            keyMap: { ...DEFAULT_KEYMAP, ...(options.keyMap || {}) }
        };
        // init scene & history
        this.scene = new Scene();
        this.history = new HistoryManager(this.scene, this.options.maxHistorySize);
        // init canvas
        this.canvas = document.createElement('canvas');
        const context = this.canvas.getContext('2d');
        if (!context)
            throw new Error("canvas context not supported");
        this.ctx = context;
        this.initDOM();
        // init renderer
        this.renderer = new Renderer(this);
        // init tools
        this.tools = {
            'polygon': new PolygonTool(this),
            'rectangle': new RectangleTool(this),
            'edit': new EditTool(this)
        };
        this.setTool('polygon'); // Default tool
        this.bindEvents();
        this.startLoop();
    }
    setTool(name) {
        if (this.activeTool) {
            this.activeTool.deactivate();
        }
        if (this.tools[name]) {
            this.activeTool = this.tools[name];
            this.activeTool.activate();
            this.requestDraw();
        }
    }
    /**
     * callback when polygon is completed (double-click)
     * @param callback callback function
     */
    setOnComplete(callback) {
        this.onComplete = callback;
    }
    /**
     * enable/show overlay
     */
    enable() {
        if (this.isActive)
            return;
        this.isActive = true;
        this.canvas.style.display = 'block';
        this.startLoop();
    }
    /**
     * disable/hide overlay
     */
    disable() {
        if (!this.isActive)
            return;
        this.isActive = false;
        this.canvas.style.display = 'none';
        this.stopLoop();
    }
    /**
     * reset canvas
     */
    reset() {
        this.scene.clear();
        if (this.activeTool)
            this.activeTool.deactivate();
        // Reset to default tool (polygon) or keep current? keeping current is better usually but let's reset to polygon as per original impl likely
        this.activeTool = this.tools['polygon'];
        this.activeTool.activate();
        this.requestDraw();
    }
    /**
     * destroy instance
     */
    destroy() {
        this.stopLoop();
        this.unbindEvents();
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }
    /**
     * get all polygons (2D array)
     */
    getPolygons() {
        return this.scene.getPolygons().map(p => [...p.points]);
    }
    // EditorContext implementation
    requestDraw() {
        // Will be drawn in loop
    }
    notifyPolygonComplete() {
        if (this.onComplete) {
            this.onComplete(this.getPolygons());
        }
    }
    undo() {
        if (this.activeTool && this.activeTool.undo && this.activeTool.undo()) {
            this.requestDraw();
            return;
        }
        this.history.undo();
        this.requestDraw();
    }
    redo() {
        if (this.activeTool && this.activeTool.redo && this.activeTool.redo()) {
            this.requestDraw();
            return;
        }
        this.history.redo();
        this.requestDraw();
    }
    // Internal implementation
    initDOM() {
        const style = window.getComputedStyle(this.container);
        if (style.position === 'static') {
            this.container.style.position = 'relative';
        }
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '1000';
        // Cursor set by tool
        this.container.appendChild(this.canvas);
        this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
        this.resizeObserver.observe(this.container);
        this.resizeCanvas();
    }
    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.requestDraw();
    }
    bindEvents() {
        this.handlers.click = (e) => {
            if (this.isActive && this.activeTool)
                this.activeTool.onClick(e);
        };
        this.handlers.dblclick = (e) => {
            if (this.isActive && this.activeTool)
                this.activeTool.onDblClick(e);
        };
        this.handlers.mousemove = (e) => {
            if (this.isActive && this.activeTool)
                this.activeTool.onMouseMove(e);
        };
        this.handlers.mousedown = (e) => {
            if (this.isActive && this.activeTool)
                this.activeTool.onMouseDown(e);
        };
        this.handlers.mouseup = (e) => {
            if (this.isActive && this.activeTool)
                this.activeTool.onMouseUp(e);
        };
        this.handlers.contextmenu = (e) => {
            e.preventDefault();
            this.undo();
        };
        this.handlers.keydown = (e) => {
            const keys = this.options.keyMap;
            if (checkKey(e, keys.undo)) {
                e.preventDefault();
                this.undo();
            }
            else if (checkKey(e, keys.redo)) {
                e.preventDefault();
                this.redo();
            }
        };
        this.canvas.addEventListener('click', this.handlers.click);
        this.canvas.addEventListener('dblclick', this.handlers.dblclick);
        this.canvas.addEventListener('mousemove', this.handlers.mousemove);
        this.canvas.addEventListener('mousedown', this.handlers.mousedown);
        this.canvas.addEventListener('mouseup', this.handlers.mouseup);
        this.canvas.addEventListener('contextmenu', this.handlers.contextmenu);
        window.addEventListener('keydown', this.handlers.keydown);
    }
    unbindEvents() {
        if (this.handlers.click)
            this.canvas.removeEventListener('click', this.handlers.click);
        if (this.handlers.dblclick)
            this.canvas.removeEventListener('dblclick', this.handlers.dblclick);
        if (this.handlers.mousemove)
            this.canvas.removeEventListener('mousemove', this.handlers.mousemove);
        if (this.handlers.mousedown)
            this.canvas.removeEventListener('mousedown', this.handlers.mousedown);
        if (this.handlers.mouseup)
            this.canvas.removeEventListener('mouseup', this.handlers.mouseup);
        if (this.handlers.contextmenu)
            this.canvas.removeEventListener('contextmenu', this.handlers.contextmenu);
        if (this.handlers.keydown)
            window.removeEventListener('keydown', this.handlers.keydown);
    }
    startLoop() {
        if (this.rafId)
            cancelAnimationFrame(this.rafId);
        const loop = () => {
            this.renderer.draw(this.activeTool);
            if (this.isActive) {
                this.rafId = requestAnimationFrame(loop);
            }
        };
        this.rafId = requestAnimationFrame(loop);
    }
    stopLoop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
}
//# sourceMappingURL=PolygonEditor.js.map