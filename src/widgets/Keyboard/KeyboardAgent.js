/**
 * Copyright 2023 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

//import KeyboardInput from 'node_modules/../KeyboardInput'
import {
  ScrollWrapper,
  KeyboardInput,
  Column,
  Input,
  KeyboardQwerty,
} from '@lightningjs/ui-components'

export default class KeyboardAgent extends KeyboardInput {
  static get __componentName() {
    return 'KeyboardAgent'
  }

  static get properties() {
    return [...super.properties, 'additionalProperty']
  }

  static _template() {
    return {
      ...super._template(),
      //Content:{ x: 100, y:100,
      ScrollWrapper: {
        type: ScrollWrapper,
        x: 50,
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
        content: [
          {
            text: 'Initiallizing....',
            // 'Lorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id aliquet risus feugiat in ante metus dictum. Pretium fusce id velit ut tortor pretium viverra suspendisse. Pharetra convallis posuere morbi leo urna.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id aliquet risus feugiat in ante metus dictum. Pretium fusce id velit ut tortor pretium viverra suspendisse. Pharetra convallis posuere morbi leo urna.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id aliquet risus feugiat in ante metus dictum. Pretium fusce id velit ut tortor pretium viverra suspendisse. Pharetra convallis posuere morbi leo urna.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id aliquet risus feugiat in ante metus dictum. Pretium fusce id velit ut tortor pretium viverra suspendisse. Pharetra convallis posuere morbi leo urna.',
            style: { fontStyle: 'italic', textAlign: 'center', textColor: 0xffffffff },
          },
          // Add more content here as needed
        ],
        signals: {
          scrollChanged: true,
        },
      },
      Wrapper: {
        x: 100,
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
  _init() {
    super._init()

    this._focusIndex = 1
    this._focusableElements = [this.tag('ScrollWrapper'), this.tag('Wrapper')]
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
      const parent = this.stage.cparent
      if (parent && parent.handleDoneKeyInOTTAvatar) {
        parent.handleDoneKeyInOTTAvatar(inputText)
      }
      // this.tag('ScrollWrapper').patch({
      //   content: [
      //     {
      //       text: inputText,
      //       style: {
      //         fontStyle: 'italic',
      //         textAlign: 'center',
      //         textColor: 0xffffffff,
      //         fontSize: 16, //fontsizes.searchPageToastMessage,
      //       },
      //     },
      //   ],
      // })
     }
    //  else {
    //   console.error('Input tag not found')
    // }
  }

  $keyboardFocused(focus) {
    super.$keyboardFocused(focus)
    // Additional logic when keyboard is focused/unfocused
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
    //return this._Wrapper || this
    return this._focusableElements[this._focusIndex]
  }
}