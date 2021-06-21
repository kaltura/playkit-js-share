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
    enableTimeOffset: true
  };

  getUIComponents() {
    return [
      {
        label: 'shareButtonComponent',
        presets: ['Playback', 'Live'],
        container: 'TopBarRightControls',
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
  }

  _getUrlParameter(name: string) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
  /**
   * load media the plugin.
   * @override
   * @public
   * @returns {void}
   * @instance
   */
  loadMedia() {
    if (!this.config.shareUrl) {
      this.config.shareUrl = window.location.href;
    }
  }
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
