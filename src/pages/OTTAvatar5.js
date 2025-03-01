import { Lightning, Language, Storage, Router, Colors  } from '@lightningjs/sdk'
import { colors, fontsizes } from '../Themes/theme.js'
import KeyboardAgent from '../widgets/Keyboard/KeyboardAgent.js'

export default class OTTAvatar extends Lightning.Component {
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
      KeyboardAgent: {
        type: KeyboardAgent,
        x: 300,
        y: 100,
        w: 1720,
        h: 880,
      },
    }
  }

  _init() {
    this._focusIndex = 0
    this._focusableElements = [this.tag('KeyboardAgent')]
  }

  _focus() {
    Storage.set('state', 'OTTAvatar')
    this.patch({ alpha: 1 })      
    
     this.widgets.menu.alpha = 0
     this.widgets.iconmenu.alpha = 1  
     
    // Set focus to KeyboardAgent
    this._setFocusToKeyboardAgent()
  }

  _setFocusToKeyboardAgent() {
    this._focusIndex = 0
    this._refocus()
  }

  _handleDown() {
    this._focusIndex = (this._focusIndex + 1) % this._focusableElements.length
    this._refocus()
  }

  _handleUp() {
    this._focusIndex =
      (this._focusIndex - 1 + this._focusableElements.length) % this._focusableElements.length
    this._refocus()
  }

  _getFocused() {
    return this._focusableElements[this._focusIndex]
  }

  _handleBack() {
    Router.back()

    // Set focus to KeyboardAgent after navigating back
    //this._setFocusToKeyboardAgent()
  }

   // Function to call $onSoftKey in KeyboardAgent
   callKeyboardAgentSoftKey(key, toggle = false) {
    const keyboardAgent = this.tag('KeyboardAgent')
    if (keyboardAgent && keyboardAgent.$onSoftKey) {
      keyboardAgent.$onSoftKey({ key, toggle })
    }
  }

  // Function to handle Done key in OTTAvatar
  handleDoneKeyInOTTAvatar(inputText) {
    console.log(`Done key pressed with input: ${inputText}`)
    // Additional logic when Done key is pressed
  }
}