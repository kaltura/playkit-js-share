// @flow
/**
 * @jsx h
 * @ignore
 */
import {h} from 'preact';
import {KalturaPlayer, BasePlugin, core, ui} from '@playkit-js/kaltura-player-js';
import {ICON_PATH, Share as ShareComponent} from './components/share/share';
import {ICON_PATH as PLUGIN_ICON_PATH} from './components/plugin-button/plugin-button';
import {defaultShareOptionsConfig} from './default-share-options-config';
import {ShareButton} from './components/plugin-button/plugin-button';
import {ShareEvent} from './event';
const {ReservedPresetNames} = ui;
const {Utils} = core;
const {Text} = ui.preacti18n;
const {focusElement} = ui.Utils;
const pluginName: string = 'share';
/**
 * The Share plugin.
 * @class Share
 * @param {string} name - The plugin name.
 * @param {Object} config - The plugin config.
 * @extends BasePlugin
 */
class Share extends BasePlugin {
  displayName = 'Share';
  symbol = {svgUrl: PLUGIN_ICON_PATH, viewBox: '0 0 1024 1024'};
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
    enableClipping: true
  };

  _pluginButtonRef: HTMLButtonElement | null = null;

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

  isAudioPlayerSupported() {
    return true;
  }
  // TEMP - shoud be reomved once kaltura player is merged
  isEntrySupported() {
    return true;
  }

  constructor(name: string, player: KalturaPlayer, config: Object) {
    super(name, player, config);
    if (!this.config.shareOptions) {
      this.config.shareOptions = defaultShareOptionsConfig;
    } else {
      const defaultSocialWhichConfigured = Object.keys(this.config.shareOptions)
        .filter(key => defaultShareOptionsConfig[key])
        .reduce((res, key) => ((res[key] = defaultShareOptionsConfig[key]), res), {});
      this.config.shareOptions = Utils.Object.mergeDeep({}, defaultSocialWhichConfigured, this.config.shareOptions);
    }
    this._filterNonDisplayShareOptions();
    if (!this.config.shareUrl) {
      this.config.shareUrl = window.location.href;
    }
    this._wasPlayed = false; // keep state of the player so we can resume if needed
    this._addIcon();
  }

  _addIcon() {
    this.player.ready().then(() => {
      const ShareWrapper = () => <ShareButton config={this.config} setRef={this._setPluginButtonRef.bind(this)} />;
      this.iconId = this.player.getService('upperBarManager').add({
        displayName: 'Share',
        ariaLabel: <Text id="controls.share">Share</Text>,
        order: 70,
        component: ShareWrapper,
        svgIcon: {path: ICON_PATH},
        onClick: this.showOverlay.bind(this)
      });
    });
  }

  showOverlay() {
    if (!this.player.paused) {
      this.player.pause();
      this._wasPlayed = true;
    }
    if (this.config.useNative && navigator.share) {
      const videoDesc = this._getVideoDesc();
      navigator
        .share({
          title: `Check out ${videoDesc}`,
          text: `Check out ${videoDesc}`,
          url: this.config.shareUrl
        })
        .then(() => this.logger.debug('Successful sharing'))
        .catch(error => this.logger.error('Failed sharing', error));
    } else {
      this._setOverlay(
        this.player.ui.addComponent({
          label: 'info-overlay',
          area: 'GuiArea',
          presets: [ReservedPresetNames.Playback, ReservedPresetNames.Live, ReservedPresetNames.MiniAudioUI],
          // eslint-disable-next-line react/display-name
          get: () => <ShareComponent onClose={this._closeShareOverlay.bind(this)} config={this.config} />
        })
      );
    }
    this.dispatchEvent(ShareEvent.SHARE_CLICKED);
  }

  _closeShareOverlay(event?: OnClickEvent, byKeyboard?: boolean) {
    this._removeOverlay();
    if (this._wasPlayed) {
      this.player.play();
      this._wasPlayed = false;
    }
    if (byKeyboard) {
      // TODO: add focusElement to ts-typed
      // @ts-ignore
      focusElement(this._pluginButtonRef);
    }
    this.dispatchEvent(ShareEvent.SHARE_CLOSE);
  }

  _setPluginButtonRef(ref: HTMLButtonElement | null) {
    this._pluginButtonRef = ref;
  }

  _setOverlay(fn: Function) {
    this._removeOverlay();
    this._removeActiveOverlay = fn;
  }

  _removeOverlay() {
    if (this._removeActiveOverlay) {
      this._removeActiveOverlay();
      this._removeActiveOverlay = null;
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

  reset() {
    this._closeShareOverlay();
  }

  destroy() {
    this._removeOverlay();
    this.player.getService('upperBarManager').remove(this.iconId);
  }
}

export {Share, pluginName};
