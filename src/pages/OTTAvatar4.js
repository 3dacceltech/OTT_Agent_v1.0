import { Lightning, Language, Storage, Router, Colors  } from '@lightningjs/sdk'
import { ScrollWrapper } from '@lightningjs/ui-components'
import App from '../App.js'
//import KeyboardAgent from '../widgets/Keyboard/KeyboardAgent.js'
import { Keyboard, KeyboardInput, Column, Input, KeyboardQwerty } from '@lightningjs/ui-components'
import { colors, fontsizes } from '../Themes/theme.js'

//MediaPipe
import { FilesetResolver, LlmInference, } from '@mediapipe/tasks-genai'

const inputText = 'Explain about mediapipe llm task'
export default class OTTAvatar4 extends Lightning.Component {
  static _template() {
    return {
      //w: App.width,
      //h: App.height,      
      Background: {
        w: 1920,
        h: 1080,
        color: colors.background,
        rect: true
      },
      // ...super._template(),
      // Wrapper: {
      //   x: 300,
      //   y: 380,
      //   type: Column,
      //   neverScroll: true,         
      //   w: this.w,
      //   items: [
      //     {
      //       type: Input,
      //       ref: 'Input',
      //     },
      //     {
      //       type: KeyboardQwerty,
      //       ref: 'Keyboard',
      //       //keyboardType: KeyboardQwerty,
      //       passSignals: {
      //         keyboardWidthChanged: true,
      //       },
      //     },
      //   ],
      // },
      //Image: {x: 200, y: 50, h: 100, w: 200, id: 'img', src:'./static/images/object-detection-output.png' },
      //Video:{},
      //Messages: {       
      //  x: 200, y: 150, h: 550, w: 1160, rect: true,
        //flex: { direction: "column", reverse: true, margin: 10 },
        //color: Colors("black").lightness(0.3).get(),
        //shader: { type: Lightning.shaders.Outline, width: 1, color: 0xffffffff, },       
      //},           
      ScrollWrapper:{ type: ScrollWrapper,
        x: 200, y: 150, //w: w / 3, h: h/3, 
        w: 1160, h: 200,
        scrollStep: 2,
        autoResizeWidth: true,
        autoResizeHeight: true,
        autoScroll: false,
        autoScrollDelay: 2000,
        autoScrollSpeed: 10,
        showScrollBar: true,
        content: [
          {
            text: 'Initializing...',      
            style: { fontStyle: 'italic', textAlign: 'center', textColor: 0xffffffff, fontSize: fontsizes.searchPageToastMessage, }
          },
          // Add more content here as needed
        ],
        signals: {
          scrollChanged: true
        }
      },
      // Keyboard: {
      //   x: 200,
      //   y: 350,        
      //   w: 60,
      //   h: 50,        
      //   type: KeyboardAgent,
      //   //centerKeyboard: true,        
      // },
    }
  }

  _focus() {
    Storage.set('state', 'OTTAvatar')
    this.patch({ alpha: 1 })      
    
     this.widgets.menu.alpha = 0
     this.widgets.iconmenu.alpha = 1
     
  }

  _init() {
    super._init();  

    this._focusIndex = 1;
    this._focusableElements = [this.tag('ScrollWrapper'), this.tag('Keyboard')];

    //this._classifyImage(); 
  //  this._llmInferenceFun(inputText)
    this.keyboardAgent = this.stage.c({
      type: KeyboardAgent,
      w: 1920,
      h: 1080,
    })

    // Add the KeyboardAgent to the component tree
    this.childList.add(this.keyboardAgent)    
    //this.controlKeyboardAgent()
  } 
  
  // Update the global response and patch the ScrollWrapper text
  updateGlobalResponse(newResponse) {
    this.tag('ScrollWrapper').patch({
      content: [{
        text: newResponse,
        style: { fontStyle: 'italic', textAlign: 'center', textColor: 0xffffffff, fontSize: fontsizes.searchPageToastMessage, }
      }]
    });
  } 
  
  async _llmInferenceFun(inputText) {
  const llmInference = await LlmInference.createFromOptions(
    //await FilesetResolver.forGenAiTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@latest/wasm'),
    await FilesetResolver.forGenAiTasks('./static/wasm'),     
    {
      baseOptions: {
        modelAssetPath:
          './static/wasm/gemma-2b-it-gpu-int4.bin'
        //modelFileName
      },
      maxTokens: 500,
      topK: 40,
      temperature: 0.8,
      randomSeed: 51//101
    });

    const response = await llmInference.generateResponse(inputText);
    console.log("Res:",response)
    this.updateGlobalResponse(response);
  }
  //media tasks ended

  _handleDown() {
    this._focusIndex = (this._focusIndex + 1) % this._focusableElements.length;
    this._refocus();
  }

  _handleUp() {
    this._focusIndex = (this._focusIndex - 1 + this._focusableElements.length) % this._focusableElements.length;
    this._refocus();
  }

  _getFocused(){
    return this._focusableElements[this._focusIndex];
  }

  onkeyboardExitLeft() {
    Router.focusWidget('Menu')
  }

  _handleBack() {
    Router.back()
  }  

  controlKeyboardAgent() {
    if (this.keyboardAgent) {
      // Example: invoking a method from KeyboardAgent
      this.keyboardAgent.$onSoftKey()
    }

}
}


////////////////////////////////////


class KeyboardAgent extends KeyboardInput {
  static get __componentName() {
    return 'KeyboardAgent'
  }

  static get properties() {
    return [...super.properties, 'additionalProperty']
  }

  
  static get tags() {
    return [
      ...super.tags,
      { name: 'Wrapper', path: 'Wrapper' },
      { name: 'Input', path: 'Wrapper.Input' },
      { name: 'Keyboard', path: 'Wrapper.Keyboard' },
    ]
  }

  _update() {
    super._update()
    this._updateAdditionalComponent()
  }

  _updateAdditionalComponent() {
    const inputTag = this.tag('Input')
    if (inputTag) {
      inputTag.patch({
        w: this.w,
        style: { ...this.style.additionalComponentStyle },
      })
    }
  }

  _updateKeyboardType() {
    console.log("Iam in updtekeyboar")
    if (!this.keyboardType || this._Keyboard.constructor !== this.keyboardType) {
      this._Wrapper._resetItems()
      this._Wrapper.items = [
        {
          type: Input,
          ref: 'Input',
        },
        {
          type: this.keyboardType || KeyboardQwerty,
          ref: 'Keyboard',
          passSignals: {
            keyboardWidthChanged: true,
          },
        },
      ]
    }
  }

  $onSoftKey({ key = '', toggle }) {
    if (toggle) {
      return
    }
    console.log(`Key pressed: ${key}`) // Capture and print the key
    super.$onSoftKey({ key, toggle })

    switch (key.toLowerCase()) {
      case 'customkey':
        this._handleCustomKey()
        break
      case 'done':
        // const inputText = this.tag('Input')
        this._handleDoneKey()
        break
      default:
      // Handle other keys if necessary
    }
  }

  _handleCustomKey() {
    // Custom logic for handling the custom key
    console.log('Custom key pressed')
  }

  _handleDoneKey() {
    // Custom logic for handling the done key
    console.log('Done key pressed')

  }

   $keyboardFocused(focus) {
     super.$keyboardFocused(focus)
  //   // Additional logic when keyboard is focused/unfocused
   }

  _getFocused() {
    return this._Wrapper || this
  }
}
