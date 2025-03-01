//import { GoogleGenerativeAI } from "@google/generative-ai";
import { Lightning, Utils, Colors } from "@lightningjs/sdk";
import { Keyboard, InputField, List } from "@lightningjs/ui";


//MediaPipe
//Text Tasks
import { TextClassifier, FilesetResolver } from '@mediapipe/tasks-text';
//import { FilesetResolver, TextEmbedder } from '@mediapipe/tasks-text';
//import { FilesetResolver, LanguageDetector } from '@mediapipe/tasks-text';
//Audio Tasks
//import { FilesetResolver, AudioClassifier } from '@mediapipe/tasks-audio';
//Vision Tasks
//import { FilesetResolver, ImageClassifier } from '@mediapipe/tasks-vision';

//import { Item } from "../itemComponents";
//import KeyboardSimple from "../keyboard/KeyboardSimple";
import KeyboardText from '../widgets/Keyboard/KeyboardText.js'
//import KeyboardAdvanced from "../keyboard/KeyboardAdvanced";
//import ChatMessage from "../chatboard/ChatMessage";
//import { initChat, chatGemini} from "../geminiChatbot/Chatbot";
//import { combinedGridTeamLabels } from "../chatboardteam/GridTeam1";

//const genAI = new GoogleGenerativeAI("AIzaSyCrvxVVz49ZMxbZ_ZUbSD0bY87IwsOIky4");
let gen_model;
let chat;
let chatInput;
const inputText = "I am a good person and I will help others";

export default class OTTAvatar2 extends Lightning.Component {
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
            // InputText:{
            //     x: 20, y: 780, h: 80, w: 1100, rect: true,
            //     color: Colors("black").lightness(0.3).get(),                
            //     shader: {type: Lightning.shaders.Outline, width: 1, color: 0xffffffff, },
            //     //text:{fontFace: "Londrina", fontSize: 25, },
            // },   
            Keyboard: {
                y: 480, 
                type:KeyboardText,
                signals: { onInputChanged: true },
            },
            // ButtonMicroph: {
            //     x: 1140, y: 780, h: 80, w: 50, rect: true,
            //     Image: { src: './static/images/microph.jpeg' }
            // },                
        };
    }

    // set gridChatIndex(index) {
    //     console.log('ChatBox', index);
    //     if (index == null) {
    //         index = 0;
    //         this.tag('LabelGrid').patch({
    //             item: {
    //                 src: `./static/images/Team/${index + 1}.png`, label: combinedGridTeamLabels[index]
    //             }
    //         })
    //     } else {
    //         this.tag('LabelGrid').patch({
    //             item: {
    //                 src: `./static/images/Team/${index + 1}.png`, label: combinedGridTeamLabels[index]
    //             }
    //         })
    //     }

    // }

    // _focus() {
    //     this._setState('ButtonMicrophone');
    //     this.setSmooth('alpha', 1);
    // }

    // _focus() {
    //     this.setSmooth('alpha', 1);
    //     //this._setState('ButtonMicrophone');
    //     this.patch({
    //         //smooth: {color: 0xff763ffc},
    //         Messages: {
    //             smooth: { color: Colors("black").lightness(0.3).get(), }
    //         },
    //         //InputText: {
    //         Keyboard: {
    //             smooth: { color: 0xffffffff }
    //         }
    //     });
    // }

    // _unfocus() {
    //     this.patch({
    //         //smooth: {color: 0xffffffff},
    //         Messages: {
    //             smooth: { color: Colors("black").lightness(0.3).get(), }//0x00000000}
    //         },
    //         //InputText: {
    //         Keyboard: {
    //             smooth: { color: 0xffffffff }
    //         }
    //     });
    // }


    _init() {
        super._init();

        // this.tag('ButtonMicroph').on('click', () => {            
        //     this._handleEnter();
        // }); 

        //calling mediapipe text classifier
        //this._classifyText(inputText);      
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


    //start voice recognition for microphone 
    // startVoiceRecognition() {
    //     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    //     recognition.onresult = (event) => {
    //         const transcript = event.results[0][0].transcript;
    //         //voicemsg.text = transcript;
    //         //InputText code
    //         //this.tag("InputText").text = transcript;
    //         //Keyboard text code
    //         this.tag('Keyboard').text = transcript;
    //         chatInput = transcript;
    //         console.log('Voice Input:', transcript);
    //         console.log('Chat Input:', chatInput);

    //         //chat with geminiChatbot
    //         this.initChat()
    //             .then(() => {
    //                 // You can call chatGemini here with an initial message if needed
    //                 this.chatGemini(chatInput);
    //             })
    //             .catch(error => console.error("Error:", error));
    //     };
    //     recognition.start();
    // }

    // async initChat() {
    //     gen_model = await genAI.getGenerativeModel({ model: "gemini-pro" });
    //     chat = await gen_model.startChat({
    //         generationConfig: {
    //             maxOutputTokens: 1000,
    //         },
    //     });
    // }

    // async chatGemini(message) {
    //     const res = await chat.sendMessage(message);
    //     const responseText = await res.response.text();
    //     console.log("Input Text:", message);
    //     this.addMessage(responseText, "end");
    //     console.log("Output Text:", responseText);
    //     return responseText;
    // }

    // addMessage(msg, direction) {
    //     console.log("Add message:", msg);
    //     // Update the Messages text here, e.g.,
    //     //this.tag("Messages").text += `\n${msg}`;
    //     this.tag("Messages").text = msg;//`${msg}`;
    // }
    //end of voice recogination code

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

    //Text embedded code for mediapipe
    // async _textEmbedder(keyboardInputData) {
    //     const textEmbedder = await TextEmbedder.createFromOptions(
    //         await FilesetResolver.forTextTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text@0.10.0/wasm'),
    //         //await FilesetResolver.forTextTasks('https://127.0.0.1:8081'),
    //         {
    //             baseOptions: {
    //                 modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/text_embedder/universal_sentence_encoder.tflite`
    //             },
    //             quantize: true
    //         }
    //     );


    //     //const embeddingResult = textEmbedder.embed(inputText);
    //     const embeddingResult = textEmbedder.embed(keyboardInputData);

    //     console.log(embeddingResult);
    //     console.log(`TextEmbedderResult:\n Embedding #0 (sole embedding head):`);

    //     const data = embeddingResult.embeddings[0];
    //     const floatEmbedded = data.floatEmbedding;
    //     const headIndex = data.headIndex;
    //     const quantEmbedded = data.quantizedEmbedding;
    //     console.log(`float_embedding: ${floatEmbedded}\nhead_index: ${headIndex}\nquantizedEmbedding:${quantEmbedded}`);

    //     // // Compute cosine similarity.
    //     // const similarity = TextEmbedder.cosineSimilarity(
    //     //     embeddingResult.embeddings[0],
    //     //     otherEmbeddingResult.embeddings[0]);
    //     this.tag("Messages").text = `TextEmbedderResult:\n Embedding #0 (sole embedding head):\n float_embedding: ${floatEmbedded}\nhead_index: ${headIndex}\nquantizedEmbedding:${quantEmbedded}`;
    // }

    //LanguageDection code for mediapipe
    // async _langDetector(keyboardInputData) {
    //     const languageDetector = await LanguageDetector.createFromOptions(
    //         //await FilesetResolver.forTextTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text@0.10.0/wasm'),
    //         await FilesetResolver.forTextTasks('https://127.0.0.1:8081'),
    //         {
    //             baseOptions: {
    //                 modelAssetPath: `https://storage.googleapis.com/mediapipe-models/language_detector/language_detector/float32/1/language_detector.tflite`
    //             },
    //             //maxResults: 5
    //         }
    //     );
    //     //const detectionResult = languageDetector.detect(inputText);
    //     const detectionResult = languageDetector.detect(keyboardInputData);

    //     //console.log(detectionResult);
    //     console.log(`LanguageDetectorResult:\n LanguagePrediction #0:`);
    //     // Assuming detectionResult is an array of objects, each with 'languageCode' and 'probability' properties:        
    //     const data = detectionResult.languages[0];
    //     const languageCode = data.languageCode;
    //     const probability = data.probability;
    //     console.log(`LanguageCode: ${languageCode}\nprobability: ${probability}`);

    //     this.tag("Messages").text = `LanguageDetectorResult:\n LanguagePrediction #0:\n LanguageCode: ${languageCode}\n probability: ${probability}`;
    // }

    //Vision Tasks
    // async _classifyImage() {
    //     const imageClassifier = await ImageClassifier.createFromOptions(
    //         await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'),
    //         {
    //             baseOptions: {
    //                 modelAssetPath: `https://storage.googleapis.com/mediapipe-models/image_classifier/efficientnet_lite0/float32/1/efficientnet_lite0.tflite`
    //             },
    //         }
    //     );

    //     const image = this.getByRef('img').getByRef('MediaVisionImgClassification');
    //     //document.getElementById('img');
    //     //image.src = '../static/images/img1.jpg';
    //     console.log(image.src);


    //     const imageClassifierResult = imageClassifier.classify(image.src);

    //     console.log(imageClassifierResult);

    // }

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
