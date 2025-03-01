
import { Lightning, Utils, Colors } from "@lightningjs/sdk";
import { Keyboard, InputField, List } from "@lightningjs/ui";


//MediaPipe
//Text Tasks
import { TextClassifier, FilesetResolver } from '@mediapipe/tasks-text';

import KeyboardText from "../Keyboard/KeyboardText.js";

export default class ChatBox extends Lightning.Component {
    static _template() {
        return {
            w: w => w - 500, h: h => h - 100, x: 100, y: 50, rect: true, color: 0xFF2D2D2D,
            // LabelGrid: {
            //     x: 20, y: 50, h: 80, w: 350, type: Item,
            //     //item: { 
            //     //  } 
            // },
            Messages: {
                //type: ScrollWrapper,
                x: 20, y: 150, h: 550, w: 1160, rect: true,
                flex: { direction: "column", reverse: true, margin: 10 },
                color: Colors("black").lightness(0.3).get(),
                shader: { type: Lightning.shaders.Outline, width: 1, color: 0xffffffff, },
                //text:{fontFace: "Londrina", fontSize: 25 },
            },              
            Keyboard: {
                y: 480, 
                type:KeyboardText,
                signals: { onInputChanged: true },
            },
                           
        };
    }   


    _init() {
        super._init();     
    }

    _active() {
        //this.tag('Messages').color = Colors("black").lightness(0.3).get();        
    }

    _handleEnter() {
        console.log('hello');
        //this.startVoiceRecognition();
        //alert('hi');       
    }

    //Keyboard event
    onInputChanged(keyboardInputData) {
        const { input, previousInput } = keyboardInputData;
        console.log('Current input:', input);
        console.log('Previous input:', previousInput);
        // Handle the input change here
        console.log("I am in chabox onInputChanged event");

        //Media Pipe Tasks
        //Text tasks
        this._classifyText(keyboardInputData);
        //this._textEmbedder(keyboardInputData);
        //this._langDetector(keyboardInputData);
        //Audio task
        //this._classifyAudio();
        //Vision tasks
        //this._classifyImage();
    }
    
    //start the mediapipe code    
    //async _classifyText(inputText) {
    //Text classification code for mediapipe
    async _classifyText(keyboardInputText) {
        const textClassifier = await TextClassifier.createFromOptions(
            await FilesetResolver.forTextTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text@0.10.0/wasm'),
            //await FilesetResolver.forTextTasks('http://127.0.0.1:8081'),
            {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/text_classifier/bert_classifier/float32/1/bert_classifier.tflite`
                    // modelAssetPath: `./assets/bert_classifier.tflite`
                },
                maxResults: 10
            }
        );

        //const result: TextClassifierResult = _await textClassifier.classify(inputText);
        //const result = textClassifier.classify(inputText);
        const result = textClassifier.classify(keyboardInputText);

        // Access the classification results
        const classifications = result.classifications;
        let classificationResults = [];
        // Iterate over the classifications
        let categoryName, score, index;
        for (const classification of classifications) {
            const categories = classification.categories;

            console.log(`TextClassificationResult:\n classification #0 (single classification head):\n ClassificationEntry #0:`);

            // Iterate over the categories 
            for (const category of categories) {
                classificationResults.push({
                    categoryName: category.categoryName,
                    score: category.score,
                    index: category.index
                });

                // Process the category name and score
                // console.log(`Category #:\n Category name: "${categoryName}"\n Score: ${score}\n Index: ${index}`);

                //this.tag("Messages").text = `Category #:\n Category name: "${categoryName}"\n Score: ${score}\n Index: ${index}`;
            }
            console.log('Classification Results:', classificationResults);
            //this.tag("Messages").text = `Category #:\n Category name: "${categoryName}"\n Score: ${score}\n Index: ${index}`;
        }
        //this.tag("Messages").text = `Category #:\n Category name: "${categoryName}"\n Score: ${score}\n Index: ${index}`;
        this.tag("Messages").text = classificationResults.map((result, idx) => `Category #${idx + 1}:\nCategory name: "${result.categoryName}"\nScore: ${result.score}\nIndex: ${result.index}`).join("\n\n");
    }   
    //end of the mediapipe code

    static get width() {
        return 1080;
    }

    static get height() {
        return 920;
    }

    static get margin() {
        return 20;
    }

    _getFocused() {
        return this.tag('Keyboard');
    }

}
