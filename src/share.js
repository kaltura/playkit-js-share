// @flow
import {KalturaPlayer, BasePlugin, core} from 'kaltura-player-js';
import {Share as ShareComponent} from './components/share/share';
import {defaultShareOptionsConfig} from './default-share-options-config';
const {Utils} = core;

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
    embedUrl: '{embedBaseUrl}/p/{partnerId}/embedPlaykitJs/uiconf_id/{uiConfId}?iframeembed=true&entry_id={entryId}',
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
    if (!this.config.shareOptions || this.config.shareOptions.length === 0) {
      this.config.shareOptions = defaultShareOptionsConfig;
    } else {
      const defualtSocialWhichConfigured = Object.keys(this.config.shareOptions)
        .filter(key => defaultShareOptionsConfig[key])
        .reduce((res, key) => ((res[key] = this.config.shareOptions[key]), res), {});
      this.config.shareOptions = Utils.Object.mergeDeep({}, defualtSocialWhichConfigured, this.config.shareOptions);
    }
    this._filterNonDisplayShareOptions();
    if (!this.config.shareUrl) {
      this.config.shareUrl = window.location.href;
    }
  }

  _filterNonDisplayShareOptions(): any {
    this.config.shareOptions = Object.keys(this.config.shareOptions)
      .filter(key => this.config.shareOptions[key].display)
      .reduce((res, key) => ((res[key] = this.config.shareOptions[key]), res), {});
  }
  /**
   * Updates the config of the plugin.
   * @param {Object} update - The updated configuration.
   * @public
   * @returns {void}
   */
  updateConfig(update: Object): void {
    super.updateConfig(update);
    this._filterNonDisplayShareOptions();
  }
}

export {Share, pluginName};
