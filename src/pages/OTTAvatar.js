//import KeyboardInput from 'node_modules/../KeyboardInput'
import { Lightning, Language, Storage, Router } from '@lightningjs/sdk'
import {
  ScrollWrapper,
  KeyboardInput,
  Column,
  Input,
  KeyboardQwerty,
} from '@lightningjs/ui-components'
import { colors, fontsizes } from '../Themes/theme.js'
import { activeCategory, categories } from '../helper/globalConstants.js'
//MediaPipe
import { FilesetResolver, LlmInference, } from '@mediapipe/tasks-genai'


export default class OTTAvatar extends KeyboardInput {
  static get __componentName() {
    return 'OTTAvatar'
  }

  static get properties() {
    return [...super.properties, 'additionalProperty']
  }
  
  static _template() {
    return {
      //...super._template(),
      //Content:{ x: 100, y:100,
      ScrollWrapper: {
        type: ScrollWrapper,
        x: 300,
        y: 50,
        h: 300,
        w: 996,        
        scrollStep: 2,
        autoResizeWidth: true,
        autoResizeHeight: true,
        autoScroll: false,
        autoScrollDelay: 2000,
        autoScrollSpeed: 10,
        showScrollBar: true,
        rect: true,       
        color: 0x4c505050, //light black background color               
        content: [
          {           
            text: 'Initiallizing....',            
            style: { fontStyle: 'italic', textAlign: 'center', textColor: 0xffffffff, fontSize: fontsizes.searchPageToastMessage,
            },
          },
          // Add more content here as needed
        ],
        signals: {
          scrollChanged: true,
        },
      },      
      Wrapper: {
        x: 300,
        y: 380,
        //h: 200,
        //w: 996,
        type: Column,
        neverScroll: true,
        w: this.w,
        items: [
          {
            type: Input,
            ref: 'Input',
          },
          {
            type: KeyboardQwerty,
            ref: 'Keyboard',
            //keyboardType: KeyboardQwerty,
            passSignals: {
              keyboardWidthChanged: true,
            },
          },
        ],
      },
      //w: utils.getWidthByUpCount(context.theme, 1),
      //}
    }
  }

  static get tags() {
    return [
      ...super.tags,
      { name: 'Wrapper', path: 'Wrapper' },
      { name: 'Input', path: 'Wrapper.Input' },
      { name: 'Keyboard', path: 'Wrapper.Keyboard' },
    ]
  }

  _focus() {
    // Ensure state is set correctly
    Storage.set('state', 'OTTAvatar');
    this.patch({ alpha: 1 })
    //this._setState('Keyboard');
    // Ensure widget visibility is handled
    if (this.widgets) {
      this.widgets.menu.alpha = 0;
      this.widgets.iconmenu.alpha = 1;
    } else {
      console.error('Widgets are not available during focus.');
    }
  }

  _init() {
    //super._init();  
    this._index = 2
    this._updateKeyboardType()

     // Ensure widgets are properly initialized
    if (this.widgets) {
      this.widgets.menu.alpha = 0;
      this.widgets.iconmenu.alpha = 1;
    } else {
      console.error('Widgets are not initialized properly.');
    }

  }

  _update() {
    super._update()
    this._updateAdditionalComponent()
  }

  _updateAdditionalComponent() {
    const inputTag = this.tag('Input')
    if (inputTag) {
      console.log(inputTag)
      inputTag.patch({
        w: this.w,
        style: { ...this.style.additionalComponentStyle },
      })
    }
  }

  _updateKeyboardType() {
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
    const inputTag = this.tag('Wrapper').tag('Input')
    if (inputTag) {
      const inputText = inputTag.actualTitle
      console.log('Input text:', inputText)      
     this._llmInferenceFun(inputText)
    }
     else {
      console.error('Input tag not found')
    }
  }

  $keyboardFocused(focus) {
    super.$keyboardFocused(focus)
    // Additional logic when keyboard is focused/unfocused
  } 
  
  // _enable() {
  //   if (categories && !this.widgets.menu.categories) {
  //     this.widgets.menu.data = categories
  //     this.widgets.iconmenu.data = categories
  //     this.widgets.menu.activeIndex = Storage.get(activeCategory) || null
  //     this.widgets.iconmenu.activeIndex = Storage.get(activeCategory) || null
  //   }
  // }

  _handleUp() {
    if (this._index > 0) {
      this._index--;
      if (this._index == 0) {
        this.focusItem = 'ScrollWrapper';
      }
    }
  }
  
  _handleDown() {
    if (this._index == 0) {
      this._index++;
      this.focusItem = 'Wrapper';
    }
  }

   _handleLeft() {
     if (this.focusItem === 'ScrollWrapper' || this.focusItem === 'Wrapper') {
       this.widgets.menu.alpha = 1;
       this.widgets.iconmenu.alpha = 0;
       Router.focusWidget('Menu');
     }
   }
  
  _getFocused() {
     if (this.focusItem == 'KeyBoardInput') return Router.focusWidget('KeyboardInput')
    if (this._index >= 0 ){//&& !Storage.get('stateInfo')) {
      if (this.focusItem == 'ScrollWrapper') return this.tag('ScrollWrapper');
      if (this.focusItem == 'Wrapper') return this.tag('Wrapper');
    }
    //if (Storage.get('stateInfo')) return Router.focusWidget('OTTAvatar')
  }  

  _handleBack() {
    Router.back()
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
  //Mediapipe task
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
    console.log("Res:", response)
    this.updateGlobalResponse(response);
  }
  //media tasks ended
}