import { Lightning } from '@lightningjs/sdk';
import CanvasTextureExample from '../widgets/Canvas/index.js';

export default class OTTWebgpu extends Lightning.Component {
  static _template() {
    return {
        w: App.width,
      h: App.height,
      Background: {
        w: 1920,
        h: 1080,
        color: Colors('black').get(),
        rect: true,
      },
      Main: {
        //type: CanvasTextureExample,
        x: 100, // Position X
        y: 100, // Position Y
      },
    };
  }
}
