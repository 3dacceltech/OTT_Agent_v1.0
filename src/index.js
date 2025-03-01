import { Launch } from '@lightningjs/sdk'
import App from './App.js'

//import App from './pages/OTTAvatar2.js'
//import App from './pages/OTTWebgpu.js'

//import App from './widgets/Banner/index.js' // horizontal  top banner displays
//import App from './widgets/Banner/BannerItem.js'   //vertical rightfull banner displays
//import App from './widgets/Banner/CircleIndicator.js' //no o/p

//import App from './widgets/ButtonsList/index.js'   //no o/p
//import App from './widgaets/IconDynamicButton.js' //no o/p

//import App from './widgets/DetailsBtns/index.js' //no o/p

//import App from './widgets/EmptyPage/index.js'  // empty page displays

//import App from './widgets/IconMenu/index.js'  //vertical left small banner menu page displays

//import App from './widgets/Keyboard/KeyboardButton.js' //error displays
//import App from './widgets/Keyboard/KeyboardInputDisplay.js' // no o/p
//import App from './widgets/Keyboard/KeyboardTemplate.js' //error displays
//import App from './widgets/Keyboard/index.js' //keyboard displays

//import App from './widgets/List/Item.js'  //displays a blue rectangle box left top 
//import App from './widgets/List/ListComponent.js' //no o/p
//import App from './widgets/List/ListEndless.js' // error displays

//import App from './widgets/Loader/index.js' //no o/p

//import App from './widgets/Menu/index.js' // vertical left big banner for menu page displays

//import App from './widgets/PlayerControls/ProgressBar.js' //no o/p
//import App from './widgets/PlayerControls/index.js' //error displays

//import App from './widgets/Popup/index.js' //displays error popup window

//import App from './widgets/ProfileButtons/Button.js' //error displays
//import App from './widgets/ProfileButtons/DynamicButton.js'//no o/p
//import App from './widgets/ProfileButtons/index.js' // no o/p

//import App from './widgets/ScrollList/index.js' //no o/p

//import App from './widgets/SearchResults/index.js' //no o/p

//import App from './widgets/StaticData/index.js' //error displays

//import App from './widgets/VideoGrid/index.js' // error displays

//import App from './widgets/VideoSlider/index.js' // error displays




export default function () {
  return Launch(App, ...arguments)
}
