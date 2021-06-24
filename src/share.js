// @flow
import {KalturaPlayer, BasePlugin} from 'kaltura-player-js';
import {Share as ShareComponent} from './components/share/share';
import {defaultSocialNetworkConfig} from './default-social-network-config';

const pluginName: string = 'share';
/**
 * The Share plugin.
 * @class Share
 * @param {string} name - The plugin name.
 * @param {Object} config - The plugin config.
 * @extends BasePlugin
 */
class Share extends BasePlugin {
  /**
   * The default configuration of the plugin.
   * @type {Object}
   * @static
   * @memberof Share
   */
  static defaultConfig: ShareConfig = {
    useNative: false,
    enableTimeOffset: true,
    uiComponent: {
      label: 'shareButtonComponent',
      presets: ['Playback', 'Live'],
      area: 'TopBarRightControls'
    }
  };

  getUIComponents() {
    const mergedUiComponent = this.config.uiComponent;
    delete this.config.uiComponent;
    return [
      {
        ...mergedUiComponent,
        get: ShareComponent,
        props: {
          config: this.config
        }
      }
    ];
  }

  /**
   * Whether the Share plugin is valid.
   * @static
   * @override
   * @public
   * @memberof Share
   */
  static isValid() {
    return true;
  }

  constructor(name: string, player: KalturaPlayer, config: Object) {
    super(name, player, config);
    if (!this.config.socialNetworks || this.config.socialNetworks.length === 0) {
      this.config.socialNetworks = defaultSocialNetworkConfig;
    }
    if (!this.config.shareUrl) {
      this.config.shareUrl = window.location.href;
    }
  }

  /**
   * load media the plugin.
   * @override
   * @public
   * @returns {void}
   * @instance
   */
  loadMedia() {}
  /**
   * Resets the plugin.
   * @override
   * @public
   * @returns {void}
   * @instance
   */
  reset(): void {}

  /**
   * Destroys the plugin.
   * @override
   * @public
   * @returns {void}
   * @instance
   */
  destroy(): void {}
}

export {Share, pluginName};
