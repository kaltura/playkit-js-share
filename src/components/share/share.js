// @flow
/**
 * @jsx h
 * @ignore
 */
import {ui} from '@playkit-js/kaltura-player-js';
import {ShareOverlay} from '../share-overlay/share-overlay';
const {preact, preacti18n, Components, Utils, redux, Reducers, createPortal} = ui;
const {h, Component} = preact;
const {withText} = preacti18n;
const {withLogger, withPlayer} = Components;
const {bindActions} = Utils;
const {shell} = Reducers;
const {actions} = shell;
const {connect} = redux;

export const ICON_PATH: string =
  'M22.6667 12.6667C24.5076 12.6667 26 11.1743 26 9.33333C26 7.49238 24.5076 6 22.6667 6C20.8257 6 19.3333 7.49238 19.3333 9.33333C19.3333 9.38882 19.3347 9.44399 19.3374 9.49881L11.9575 13.9443C11.3473 13.1665 10.3987 12.6667 9.33333 12.6667C7.49238 12.6667 6 14.1591 6 16C6 17.8409 7.49238 19.3333 9.33333 19.3333C10.3981 19.3333 11.3462 18.8341 11.9564 18.057L19.3374 22.5013C19.3347 22.5561 19.3333 22.6112 19.3333 22.6667C19.3333 24.5076 20.8257 26 22.6667 26C24.5076 26 26 24.5076 26 22.6667C26 20.8257 24.5076 19.3333 22.6667 19.3333C21.6074 19.3333 20.6636 19.8274 20.053 20.5976L12.864 16.2689L12.8651 15.7324L20.0531 11.4025C20.6637 12.1727 21.6075 12.6667 22.6667 12.6667ZM22.6667 10.6667C21.9303 10.6667 21.3333 10.0697 21.3333 9.33333C21.3333 8.59695 21.9303 8 22.6667 8C23.403 8 24 8.59695 24 9.33333C24 10.0697 23.403 10.6667 22.6667 10.6667ZM9.33333 17.3333C8.59695 17.3333 8 16.7364 8 16C8 15.2636 8.59695 14.6667 9.33333 14.6667C10.0697 14.6667 10.6667 15.2636 10.6667 16C10.6667 16.7364 10.0697 17.3333 9.33333 17.3333ZM21.3333 22.6667C21.3333 23.403 21.9303 24 22.6667 24C23.403 24 24 23.403 24 22.6667C24 21.9303 23.403 21.3333 22.6667 21.3333C21.9303 21.3333 21.3333 21.9303 21.3333 22.6667Z';
/**
 * mapping state to props
 * @param {*} state - redux store state
 * @returns {Object} - mapped state to this component
 */
const mapStateToProps = state => ({
  isPlaying: state.engine.isPlaying
});

const COMPONENT_NAME = 'Share';
/**
 * Share component
 *
 * @class Share
 * @example <Share />
 * @extends {Component}
 */
@connect(mapStateToProps, bindActions(actions))
@withPlayer
@withLogger(COMPONENT_NAME)
@withText({shareTxt: 'controls.share'})
class Share extends Component {
  // ie11 fix (FEC-7312) - don't remove
  _portal: any;

  /**
   * render element
   *
   * @returns {React$Element} component element
   * @memberof Share
   */
  render(): React$Element<any> | void {
    const {shareUrl, shareOptions} = this.props.config;
    if (!(shareUrl && shareOptions)) {
      return undefined;
    }
    const targetId = document.getElementById(this.props.player.config.targetId) || document;
    const portalSelector = `.overlay-portal`;
    return createPortal(
      <ShareOverlay config={this.props.config} videoDesc={this.props.videoDesc} player={this.props.player} onClose={this.props.onClose} />,
      targetId.querySelector(portalSelector)
    );
  }
}

Share.displayName = COMPONENT_NAME;
export {Share};
