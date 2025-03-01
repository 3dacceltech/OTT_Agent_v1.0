import { Lightning, Language, Storage, Router } from '@lightningjs/sdk'
import { activeCategory, bannerKey, categories, emptyPageIcon, stateInfo } from '../helper/globalConstants.js'
import { getCategory } from '../Services/contentApis.js'

export default class Category extends Lightning.Component {
  _focus() {//this code snippet is focusing on the 'Videos' state, making some adjustments to the visibility of different 
  // widgets (hiding the menu(full menu) and showing the icon menu(small menu)). It ensures that the interface reflects the current focus.
    Storage.set('state', 'Videos')
    this.patch({ alpha: 1 })
    this.widgets.menu.alpha = 0
    this.widgets.iconmenu.alpha = 1
  }

  _init() {
    this._focus()
  }

  //this function fetches category data, processes it to exclude certain objects, 
  // and then further filters the data to keep only those elements with non-empty lists. 
  // It then updates the banner and template widgets with the processed data.
  async prepareData(categoryId) {
    const categoryRes = await getCategory(categoryId)
    this.patchingBanner(categoryRes) // used for displaying banner widget
    const completeHomedata = categoryRes.filter(Obj => Obj.key !== bannerKey) // filtered array w/o banner Object
    const data = completeHomedata.filter(val => { return val?.list?.length > 0 })
    this.patchingDataToTemplate(data)
  }

  //this function manages the display and focus of banner-related widgets based on the provided category data. 
  // It ensures that if no banner data is available but other categories are, 
  // it focuses on the video slider; otherwise, it updates the banner widget with the relevant data.
  patchingBanner(categoryRes) {
    this.bannerVideos = []
    //This line filters the categoryRes array to (include) only objects where the key equals bannerKey. 
    // The result is stored in bannerAvail.
    this.bannerAvail = categoryRes.filter(Obj => Obj.key == bannerKey)
    //This line filters the categoryRes array to (exclude) objects where the key equals bannerKey. 
    // The result is stored in checkOtherCatExceptBanner.
    this.checkOtherCatExceptBanner = categoryRes.filter(Obj => Obj.key != bannerKey)
    if (
      //This condition checks if there are no objects with bannerKey in bannerAvail and if checkOtherCatExceptBanner 
      // contains objects (meaning other categories are available except the banner).
      this.bannerAvail.length === 0 &&
      this.checkOtherCatExceptBanner.length > 0
    ) {
      this.widgets.banneritem.alpha = 1 // banneritems(movies, news, comedy) comes one by one to visible
      this.widgets.banner.alpha = 0 // banner goes to invisible
      Router.focusWidget('VideoSlider') //Sets focus on the VideoSlider widget.
      return
    }
    //If the function didn't exit earlier, it finds the object with bannerKey in categoryRes and assigns it to bannerVideos.
    this.bannerVideos = categoryRes.find(Obj => Obj.key === bannerKey)
    //This checks if bannerVideos is not undefined and if its list property has a length greater than 0.
    if (this.bannerVideos?.list.length > 0) {
      //Updates the banner widget's data with bannerVideos.
      this.widgets.banner.data = this.bannerVideos
      //Calls a method widgetsVisibility with bannerKey as an argument, 
      // likely to adjust the visibility of widgets based on the bannerKey.
      this.widgetsVisibility(bannerKey)
      Router.focusWidget('Banner')
    }
  }

  //this function manages the visibility of different widgets based on the value of bannerTypes.
  // It ensures that either the banner or banneritem widget is visible while making the emptypage widget invisible.
  widgetsVisibility(bannerTypes) {
    //This line checks if bannerTypes equals bannerKey.
    //If true, it sets the alpha property of the banner widget to 1 (making it visible).
    //If false, it sets the alpha property of the banner widget to 0 (making it invisible).
    this.widgets.banner.alpha = bannerTypes === bannerKey ? 1 : 0
    //This line checks if bannerTypes equals 'banneritem'.
    //If true, it sets the alpha property of the banneritem widget to 1 (making it visible).
    //If false, it sets the alpha property of the banneritem widget to 0 (making it invisible).
    this.widgets.banneritem.alpha = bannerTypes === 'banneritem' ? 1 : 0
    //This line sets the alpha property of the emptypage widget to 0, making it invisible.
    this.widgets.emptypage.alpha = 0
  }

  //this function updates various widgets based on the provided data,
  // hiding or displaying elements as needed and setting focus on the appropriate widget.
  patchingDataToTemplate(data) {
    //This line sets the alpha property of the loader widget to 0, making it invisible.
    this.widgets.loader.alpha = 0
    //This condition checks if categories exists and if menu.categories is not already set.
    //If true, it sets the menu.data and iconmenu.data to categories.
    if (categories && !this.widgets.menu.categories) {      
      this.widgets.menu.data = categories
      this.widgets.iconmenu.data = categories
    }
    //This condition checks if there is a stored value for activeCategory.
    //If true, it sets the activeIndex of both menu and iconmenu to the stored value of activeCategory.
    if (Storage.get(activeCategory)) {
      this.widgets.menu.activeIndex = Storage.get(activeCategory)
      this.widgets.iconmenu.activeIndex = Storage.get(activeCategory)
    }
    this.widgets.loader.alpha = 0
    this._index = 0 //This line initializes the _index property to 0.

    this.checkCatLen = data.length //This line sets checkCatLen to the length of data.

    //This line attempts to get the stored value of stateInfo.
    //If stateInfo exists, it parses the JSON string into an object and assigns it to stateInfo.
    //If stateInfo does not exist, it assigns null to stateInfo.
    this.stateInfo = Storage.get(stateInfo) ? JSON.parse(Storage.get(stateInfo)) : null
    //This condition checks if checkCatLen is greater than 0 (i.e., if data has any elements).
    //If true:
    //Sets emptypage.alpha to 0 (making it invisible).
    //Sets videoslider.alpha to 1 (making it visible).
    //Sets videoslider.data to data.
    //Determines whether the banner should be visible based on the length of bannerVideos.list and the state of stateInfo.banner.
    //Sets banner.alpha to 1 and banneritem.alpha to 0 if the banner should be visible, otherwise sets banner.alpha to 0 and banneritem.alpha to 1.
    //Focuses the appropriate widget (Banner or VideoSlider).
    if (this.checkCatLen > 0) {
      this.widgets.emptypage.alpha = 0
      this.widgets.videoslider.alpha = 1
      this.widgets.videoslider.data = data
      const isBannerVisible = this.bannerVideos?.list?.length > 0 && (!this.stateInfo || this.stateInfo?.banner)
      this.widgets.banner.alpha = isBannerVisible ? 1 : 0
      this.widgets.banneritem.alpha = isBannerVisible ? 0 : 1
      Router.focusWidget(isBannerVisible ? 'Banner' : 'VideoSlider')
    } else {
      //If checkCatLen is not greater than 0 (i.e., if data is empty):
      // Sets videoslider.alpha to 0 (making it invisible).
      // Sets banner.alpha to 0 (making it invisible).
      // Sets banneritem.alpha to 0 (making it invisible).
      // Sets emptypage.data to an object with status: true, a translated Message, and an Image.
      //Focuses the EmptyPage widget.
      this.widgets.videoslider.alpha = 0
      this.widgets.banner.alpha = 0
      this.widgets.banneritem.alpha = 0
      this.widgets.emptypage.data = {
        status: true,
        Message: Language.translate('no_content_found_string'),
        Image: emptyPageIcon
      }
      Router.focusWidget('EmptyPage')
    }
  }

  _getFocused() {
    // Checks if the 'alpha' property of 'widgets.banner' is truthy (i.e., it exists and is not zero, null, false, etc.)
    this.widgets.banner.alpha 
        ? // If true, it focuses on the 'Banner' widget using the 'Router' object's focusWidget method.
          Router.focusWidget('Banner')
        : // If false, it calls the 'focusVideoSlider' method to focus on the video slider.
          this.focusVideoSlider();
}

//This function appears to be dynamically managing the display and focus of different widgets based on the length of a category.
  focusVideoSlider() {
    if (this.checkCatLen > 0) {
      this.widgets.banner.alpha = 0
      this.widgets.banneritem.alpha = 1
      Router.focusWidget('VideoSlider')
    } else Router.focusWidget('EmptyPage')
  }

  _handleBack() { Router.back() }

  //This function ensures that the banner is properly managed and displayed when needed, 
  // based on the availability of banners and other categories.
  _handleUp() {
    if (this.bannerAvail.length === 0 &&
      this.checkOtherCatExceptBanner.length > 0)
      return
    this.widgets.banneritem.alpha = 0
    this.widgets.banner.alpha = 1
    this.widgets.banner.data = this.bannerVideos
    Router.focusWidget('Banner')
  }
}
