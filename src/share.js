// @flow
import {KalturaPlayer, BasePlugin, core} from 'kaltura-player-js';
import {Share as ShareComponent} from './components/share/share';
import {defaultSocialNetworkConfig} from './default-social-network-config';
const {Utils} = core;

const pluginName: string = 'share';
const KALTURA_PLAYER_START_TIME_QS: string = 'kalturaStartTime';
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
  static defaultConfig: ShareConfig = {};

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
    if (!Utils.Object.hasPropertyPath(this.player.config, 'sources.startTime')) {
      let startTime;
      if (window.URLSearchParams) {
        const urlParams = new URLSearchParams(window.location.search);
        startTime = parseFloat(urlParams.get(KALTURA_PLAYER_START_TIME_QS));
      } else {
        startTime = parseFloat(this._getUrlParameter(KALTURA_PLAYER_START_TIME_QS));
      }
      if (!isNaN(startTime)) {
        this.player.configure({sources: {startTime}});
      }
    }

    if (this.config.useParentUrl) {
      this.config.shareUrl = this.config.embedUrl = window.location.href;
    } else {
      const entryId = this.player.getMediaInfo().entryId;
      const partnerId = this.player.config.provider.partnerId;
      const uiConfId = this.config.UiConfForSharing || this.player.config.provider.uiConfId;
      const embedBaseUrl = this.config.embedBaseUrl;
      if (entryId && partnerId && uiConfId && embedBaseUrl) {
        if (!this.config.shareUrl) {
          this.config.shareUrl = `${embedBaseUrl}/index.php/extwidget/preview/partner_id/${partnerId}/uiconf_id/${uiConfId}/entry_id/${entryId}/embed/dynamic`;
        }
        if (!this.config.embedUrl) {
          this.config.embedUrl = `${embedBaseUrl}/p/${partnerId}/embedPlaykitJs/uiconf_id/${uiConfId}?iframeembed=true&entry_id=${entryId}`;
        }
      }
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
