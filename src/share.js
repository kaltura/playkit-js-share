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
    return [
      {
        ...this.config.uiComponent,
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
    this._filterNonDisplaySocialNetworks();
    if (!this.config.shareUrl) {
      this.config.shareUrl = window.location.href;
    }
  }

  _filterNonDisplaySocialNetworks(): any {
    this.config.socialNetworks = Object.keys(this.config.socialNetworks)
      .filter(key => this.config.socialNetworks[key].display)
      .reduce((res, key) => ((res[key] = this.config.socialNetworks[key]), res), {});
  }
  /**
   * Updates the config of the plugin.
   * @param {Object} update - The updated configuration.
   * @public
   * @returns {void}
   */
  updateConfig(update: Object): void {
    super.updateConfig(update);
    this._filterNonDisplaySocialNetworks();
  }
}

export {Share, pluginName};
