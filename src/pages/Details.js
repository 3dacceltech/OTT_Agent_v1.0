import { Lightning, Utils, Storage, Router, Language } from '@lightningjs/sdk'
import App from '../App.js'
import { colors, fontsizes } from '../Themes/theme.js'
import { getVideoDetails } from '../Services/contentApis.js'
import { activeCategory, backIcon, categories, contentImagesFolder, getButtons } from '../helper/globalConstants.js'
import { InlineContent } from '@lightningjs/ui-components'

export default class Details extends Lightning.Component {
  static _template() {
    return {
      TopGradient: {
        zIndex: 2,//This sets the stacking order of the element, determining its position in the z-axis (higher values are on top).
        w: 620,
        h: App.height,
        rect: true,
        color: colors.background,
      },
      LeftToRightGradient: {
        zIndex: 2,//Same z-index as TopGradient.
        x: 620,
        w: 800,
        h: App.height,
        rect: true,
        colorRight: colors.detailGradientBg,
        colorLeft: colors.background,
      },
      BannerImage: {
        zIndex: 1,//Lower stacking order compared to gradients.
        w: App.width,
        h: App.height,
      },
      ContentContainer: {
        x: 176,
        y: 0,
        h: 570,
        zIndex: 5,//Highest stacking order.
        //(flex: Defines the flexbox layout.column - The direction of the layout.flex-end - Aligns children to the end of the container.)
        flex: { direction: 'column', justifyContent: 'flex-end'},
        Title: {
          text: {
            fontSize: fontsizes.detailsPageTitle,
            textColor: colors.fontColor,
            wordWrapWidth: 1150,//Maximum width before wrapping the text.
            maxLines: 1,//Maximum number of lines.
            maxLinesSuffix: '...',//Suffix for truncated text.
            fontFace: 'Bold',
          },
          //flexItem: Defines flex item properties. mareginBottom - Space below the element
          flexItem: { marginBottom: 20 }
        },
        TitleEN: {
          text: {//Similar to Title but with a different font size (40).
            fontSize: 40,
            textColor: colors.fontColor,
            wordWrapWidth: 1150,
            maxLines: 1,
            maxLinesSuffix: '...',
            fontFace: 'Bold',
          },
          flexItem: { marginBottom: 20 }
        },
        TagsData: {
          type: InlineContent,//
          justify: 'flex-start',//Justifies content to the start.
          content: [],//Empty array for content.
          customStyleMappings: {//Defines custom styles
            textStyle: {//Sets various text properties.
              fontSize: fontsizes.seriesPageMetadata,
              textColor: colors.fontColor,
              textAlign: 'left',
              fontFace: 'Regular',
            },
          },
          //Defines flex item properties
          flexItem: { marginBottom: 30 }
        },
        Description: {//Defines text properties
          text: {
            fontSize: fontsizes.seriesPageMetadata,
            textColor: colors.fontColor,
            wordWrapWidth: 750,//Maximum width before wrapping.
            lineHeight: 30,
            fontFace: 'Regular',
            maxLines: 3,
            maxLinesSuffix: '...',
          },
          flexItem: { marginBottom: 10 }
        },
        Starring: {//Similar to Description but with wordWrapWidth of 610 and different properties.
          text: {
            fontSize: fontsizes.seriesPageMetadata,
            textColor: colors.fontColor,
            wordWrapWidth: 610,
            fontFace: 'Regular',
            maxLines: 1,
            maxLinesSuffix: '...',
          },
          flexItem: { marginBottom: 10 }//Space below the element (for Starring only).
        },
        Director: {//Similar to Description but with wordWrapWidth of 610 and different properties.
          text: {
            fontSize: fontsizes.seriesPageMetadata,
            textColor: colors.fontColor,
            wordWrapWidth: 610,
            fontFace: 'Regular',
            maxLines: 1,
            maxLinesSuffix: '...',
          },
        },
      },
      //Signal to handle focus suggestions.
      signals: { focusSuggestions: '_focusSuggestions' },
    }
  }

  _focus() {
    this.patch({ alpha: 1 })
  }

  _active() {
    this.widgets.loader.alpha = 0
    Router.focusWidget('ButtonsList')
  }

  prepareData(videoId) {
    const detailsResponse = getVideoDetails(videoId)

    this.patchingDataToTemplate(detailsResponse)
  }

  patchingDataToTemplate(contentMetaData) {
    this.widgets.loader.alpha = 0
    if (categories && !this.widgets.menu.categories) {
      this.widgets.menu.data = categories
      this.widgets.iconmenu.data = categories
      this.widgets.menu.alpha = 0
      if (Storage.get(activeCategory)) {
        this.widgets.menu.activeIndex = Storage.get(activeCategory)
        this.widgets.iconmenu.activeIndex = Storage.get(activeCategory)
      }
    }
    const tagsData = contentMetaData.tags || ''
    this.patch({
      BannerImage: { src: Utils.asset(contentImagesFolder + contentMetaData.banner_image) },
      ContentContainer: {
        Title: {
          visible: true,
          text: { text: contentMetaData.title }
        },
        TitleEN: {
          visible: !!contentMetaData.title_en,
          text: { text: contentMetaData.title_en || '' }
        },
        TagsData: {
          content: [
            { text: contentMetaData.publish_time, style: 'textStyle' },
            {
              text: ` |  ${tagsData}`,
              style: 'textStyle'
            }
          ]
        },
        Description: {
          visible: !!contentMetaData.description,
          text: { text: contentMetaData.description || '' },
        },
        Starring: {
          visible: !!contentMetaData.cast,
          text: { text: contentMetaData.cast || '' },
        },
        Director: {
          visible: !!contentMetaData.director,
          text: { text: contentMetaData.director || '' },
        }
      }
    })
    this.buttonsData = getButtons()
    this.widgets.buttonslist.data = [ this.buttonsData, contentMetaData ]
    this.widgets.detailsbtns.data = {
      buttonData: [{ label: Language.translate('back_button_text'), iconImage: backIcon }],
    }
    Router.getActiveHash().includes('details') && Router.focusWidget('ButtonsList')
  }

  _getFocused() {
    Router.focusWidget('ButtonsList')
  }

  _handleBack() {
    Router.back()
  }

}
