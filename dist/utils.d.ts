import { Point } from './types.js';
/**
 * Calculate distance between two points
 */
export declare function getDistance(p1: Point, p2: Point): number;
/**
 * Get the closest point on a line segment to a given point
 */
export declare function getClosestPointOnSegment(p: Point, p1: Point, p2: Point): Point;
/**
 * Adjust alpha channel of a color string
 */
export declare function adjustAlpha(color: string, alpha: number): string;
/**
 * Check if the keyboard event matches any of the configured key combinations.
 * @param e KeyboardEvent
 * @param keyConfig string or string array.
 */
export declare function checkKey(e: KeyboardEvent, keyConfig: string | string[]): boolean;
/**
 * Check modifiers only (useful for mouse events or state checks)
 * @param e MouseEvent | KeyboardEvent
 * @param keyConfig string or string array (e.g. ['Control', 'Meta'])
 */
export declare function checkModifier(e: MouseEvent | KeyboardEvent, keyConfig: string | string[]): boolean;
//# sourceMappingURL=utils.d.ts.map