import { Lightning } from '@lightningjs/sdk';

export default class Canvas extends Lightning.Component {
  static _template() {
    return {
      Example: {
        texture: Lightning.Tools.getCanvasTexture(() => this._createCanvas()),
      },
    };
  }

  static _createCanvas() {
    const canvas = document.createElement('canvas'); // Create a new canvas element
    canvas.width = 100;
    canvas.height = 100;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = 'rgba(255, 0, 0, 1)'; // Red fill color
    ctx.fillRect(10, 10, 80, 80); // Draw a rectangle

    return canvas; // Return the canvas
  }
}
