/**
 * Returns CSS font setting string for use in canvas context.
 *
 * @private
 * @param {string | string[]} fontFace
 * @param {string} fontStyle
 * @param {number} fontSize
 * @param {number} precision
 * @param {string} defaultFontFace
 * @returns {string}
 */
export function getFontSetting(fontFace: string | string[], fontStyle: string, fontSize: number, precision: number, defaultFontFace: string): string;
/**
 * Returns true if the given character is a zero-width space.
 *
 * @param {string} space
 * @returns {boolean}
 */
export function isZeroWidthSpace(space: string): boolean;
/**
 * Returns true if the given character is a zero-width space or a regular space.
 *
 * @param {string} space
 * @returns {boolean}
 */
export function isSpace(space: string): boolean;
/**
 * Converts a string into an array of tokens and the words between them.
 *
 * @param {RegExp} tokenRegex
 * @param {string} text
 * @returns {string[]}
 */
export function tokenizeString(tokenRegex: RegExp, text: string): string[];
/**
 * Measure the width of a string accounting for letter spacing.
 *
 * @param {CanvasRenderingContext2D} context
 * @param {string} word
 * @param {number} space
 * @returns
 */
export function measureText(context: CanvasRenderingContext2D, word: string, space?: number): number;
/**
 * Applies newlines to a string to have it optimally fit into the horizontal
 * bounds set by the Text object's wordWrapWidth property.
 *
 * @param {CanvasRenderingContext2D} context
 * @param {string} text
 * @param {number} wordWrapWidth
 * @param {number} letterSpacing
 * @param {number} indent
 * @returns
 */
export function wrapText(context: CanvasRenderingContext2D, text: string, wordWrapWidth: number, letterSpacing: number, indent: number): {
    l: any[];
    n: number[];
};
//# sourceMappingURL=TextTextureRendererUtils.d.mts.map