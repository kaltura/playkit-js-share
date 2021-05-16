// @flow
import {KalturaPlayer, BasePlugin} from 'kaltura-player-js';
import {Share as ShareComponent} from './components/share/share';

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
  static defaultConfig: Object = {};

  getUIComponents() {
    return [
      {
        label: 'dismissibleFloatingButtonComponent',
        presets: ['Playback', 'Live', 'Error', 'Ads', 'Idle'],
        container: 'TopBarRightControls',
        get: ShareComponent
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

export {Share};
