import { Lightning, Language, Storage, Router, Colors, Keyboard } from '@lightningjs/sdk'
import { ScrollWrapper } from '@lightningjs/ui-components'
import App from '../App.js'
import KeyboardText from '../widgets/Keyboard/KeyboardText.js'
import { ChatBox } from '../widgets/index.js'
import { colors, fontsizes } from '../Themes/theme.js'
import { viewMoreImage, activeCategory, categories } from '../helper/globalConstants.js'


//MediaPipe
//Text Tasks
//import { TextClassifier, FilesetResolver } from '@mediapipe/tasks-text';
//import { FilesetResolver, TextEmbedder } from '@mediapipe/tasks-text';
//import { FilesetResolver, LanguageDetector } from '@mediapipe/tasks-text';
//Vision Tasks
//import { FilesetResolver, ImageClassifier } from '@mediapipe/tasks-vision';
//import { FilesetResolver, ObjectDetector } from '@mediapipe/tasks-vision';
import { FilesetResolver, LlmInference, } from '@mediapipe/tasks-genai'
const inputText = 'Explain about mediapipe llm task'
export default class OTTAvatar3 extends Lightning.Component {
  static _template() {
    return {
      //w: App.width,
      //h: App.height,
      Background: {
        w: 1920,
        h: 1080,
        //zIndex: 4,
        color: colors.background,
        rect: true
      },
      //Image: {x: 200, y: 50, h: 100, w: 200, id: 'img', src:'./static/images/object-detection-output.png' },
      //Video:{},
      //Messages: {       
      //  x: 200, y: 150, h: 550, w: 1160, rect: true,
        //flex: { direction: "column", reverse: true, margin: 10 },
        //color: Colors("black").lightness(0.3).get(),
        //shader: { type: Lightning.shaders.Outline, width: 1, color: 0xffffffff, },       
      //},      
      ScrollWrapper:{ type: ScrollWrapper,
        x: 200, y: 150, h: 550, w: 1160, 
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

            style: { fontStyle: 'italic', textAlign: 'center', textColor: 0xffffffff, fontSize: '30' }
          },
          // Add more content here as needed
        ],
        signals: {
          scrollChanged: true
        }
      },
      Keyboard: {
        y: 480,
        type: KeyboardText,
        // props: {
        //   isDark: true,
        //   fields: [
        //     {
        //       id: 'query',
        //       label: 'Zoeken',
        //       value: '',
        //       isMasked: false,
        //     },
        //   ],
        // },
        signals: { onInputChanged: true },
      },
    }
  }

  _focus() {
    Storage.set('state', 'OTTAvatar')
    this.patch({ alpha: 1 })
    // this.patch({
    //   Message: { Toast: { text: Language.translate('no_results') + `"` + this.searchTerm || '' + `"` } },
    // })
     this.widgets.menu.alpha = 0
     this.widgets.iconmenu.alpha = 1
  }

  _init() {
    super._init();  
    //this._classifyImage(); 
    //this._llmInferenceFun(inputText)      
  }


  //Keyboard event
   onInputChanged(keyboardInputData) {
    const { input, previousInput } = keyboardInputData;
    //console.log('Current input:', input);
    //console.log('Previous input:', previousInput);
    // Handle the input change here
    console.log("I am in chabox onInputChanged event")
     
    //Media Pipe Tasks    
     //this._llmInferenceFun(keyboardInputData);
  }  
  
    // Update the global response and patch the ScrollWrapper text
    updateGlobalResponse(newResponse) {
      this.tag('ScrollWrapper').patch({
        content: [{
          text: newResponse,
          style: { fontStyle: 'italic', textAlign: 'center', textColor: 0xffffffff, fontSize: '30' }
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

  _getFocused(){
    return this.tag('Keyboard')
    //return this.tag('ScrollWrapper')
  }

  _handleBack() {
    Router.back()
  }  
}

