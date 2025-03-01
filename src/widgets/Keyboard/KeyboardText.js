import { Keyboard, Key as BaseKey, InputField } from "@lightningjs/ui";
import { Lightning, Colors, Utils } from "@lightningjs/sdk";
import { colors, fontsizes } from '../../Themes/theme'

export default class KeyboardText extends Lightning.Component { //Page
    static _template() {
        return {
            //...super._template(),
            //zIndex: 4,
            // Messages: {                   
            //     x: 20, y: 150, h: 550, w: 1160, rect: true,
            //     flex: { direction: "column", reverse: true, margin: 10 },
            //     color: Colors("black").lightness(0.3).get(),
            //     shader: { type: Lightning.shaders.Outline, width: 1, color: 0xffffffff, },
            //     //text:{fontFace: "Londrina", fontSize: 25 },
            // },
            Content: {               
                InputFieldWrapper: {
                    x: 200, y: 230, rect: true, h: 80, w: 960,               
                    InputField: {
                        x: 50, y: 5, type: InputField, 
                        description: ' Type here...',                                                
                    },                    
                },
                Keyboard: {
                    x: 200, y: 350, type: Keyboard, config: keyboardConfig,
                    signals: {
                        onInputChanged: true
                    },
                    currentLayout: 'abc', maxCharacters: 60
                },
            }
        }
    }

    _setup() {
        const inputField = this.tag('InputField');
        this.tag('Keyboard').inputField(inputField);   
    }

    //onInputChanged(inputData) {
    onInputChanged({ input, previousInput }) {
        //const { input, previousInput } = inputData;
        console.log('Current input:', input);
        console.log('Previous input:', previousInput);
        // Handle the input change here
        this.signal('onInputChanged', { input, previousInput });
    }

    _active() {
        //super._active();         
        //Text field for entering text background color       
        this.tag('InputFieldWrapper').color = Colors('black').lightness(0.3).get();
        // Colors(this.fireAncestors('$getThemeColor')).lightness(0.2).get();

    }

    _getFocused() {
        return this.tag('Keyboard');
    }

}

class Key extends BaseKey {
    _firstActive() {
        this.label = {
            mountY: 0.45
        };
        this.labelColors = {
            unfocused: Colors('white').get()
        };
        this.backgroundColors = {
            unfocused: Colors('white').alpha(0).get(),// white color // green
            focused: Colors('black').lightness(0.3).get() //blue
            //Colors(this.fireAncestors('$getThemeColor')).darker(0.5).get()
        };
        if (this.hasFocus()) {
            this._focus();
        }
    }

    static get width() {
        return 60;
    }
    static get height() {
        return 60;
    }
}

class ActionKey extends BaseKey {
    _active() {
        this.label = {
            mountY: 0.45
        };
        this.labelColors = {
            unfocused: Colors('black').get(),//black //yellow
            focused: Colors('white').get()//white //red
        };
        this.backgroundColors = {
            unfocused: Colors('white').get(),// white //red
            focused: //Colors('blue').get()
                Colors(this.fireAncestors('$getThemeColor')).darker(0.5).get()
        };
        if (this.hasFocus()) {
            this._focus();
        }
    }

    static get height() {
        return 60;
    }

    static get width() {
        return 120;
    }
}

class IconKey extends ActionKey {
    set icon(src) {
        this._icon = src;
        //call for _update
        this._update();
    }

    get icon() {
        return this._icon;
    }

    _update() {
        if (!this.active) {
            //blocking update if not active.
            return;
        }
        const hasFocus = this.hasFocus();
        let { focused, unfocused = 0xff000000 } = this.backgroundColors;
        //Use labelColors and label to color the icon.
        let { focused: labelFocused, unfocused: labelUnfocused = 0xffffffff } = this.labelColors;
        this.patch({
            Background: { color: hasFocus && focused ? focused : unfocused },
            Label: { src: Utils.asset(this.icon), color: hasFocus && labelFocused ? labelFocused : labelUnfocused }
        });
    }
}

const keyboardConfig = {
    layouts: {
        'abc': [
            ['Layout:123', 'Space', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',],//'Enter', need to add after space
            ['l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'Backspace']
        ],
        '123': [
            ['Layout:abc', 'Space', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'],//'Enter', need to add after space
        ]
    },
    styling: {
        align: 'left',
        horizontalSpacing: 2,
        verticalSpacing: 5,
        Row2: {
            spacing: 5
        },
    },
    buttonTypes: {
        default: {
            type: Key, w: 50
        },
        Backspace: {
            type: IconKey, w: 40, icon: 'images/backspace.png', shader: { type: Lightning.shaders.RoundedRectangle, radius: 10 }
        },
        Layout: {
            type: ActionKey, w: 80, shader: { type: Lightning.shaders.RoundedRectangle, radius: 20 }
        },
        Space: {
            type: ActionKey, w: 150, label: 'space', shader: { type: Lightning.shaders.RoundedRectangle, radius: 20 }
        },
        Clear: {
            type: ActionKey, w: 120, label: 'clear', shader: { type: Lightning.shaders.RoundedRectangle, radius: 20 }
        },
        // Enter: {
        //     type: ActionKey, w: 100, label: 'send', shader: { type: Lightning.shaders.RoundedRectangle, radius: 20 }
        // }
    }
};