// @flow
/**
 * @jsx h
 * @ignore
 */
import {ui, core} from 'kaltura-player-js';
import {ShareOverlay} from '../share-overlay/share-overlay';
import {pluginName} from '../../share';
const {preact, preacti18n, Components, style, Utils, redux, Reducers, createPortal} = ui;
const {h, Component} = preact;
const {withText} = preacti18n;
const {Tooltip, ToolTipType, Button, ButtonControl, withLogger, Icon, IconState, withPlayer} = Components;
const {bindActions} = Utils;
const {shell} = Reducers;
const {actions} = shell;
const {connect} = redux;
const coreUtils = core.Utils;

const ICON_PATH: string =
  'M318.641 446.219l236.155-142.257c-0.086-1.754-0.129-3.52-0.129-5.295 0-58.91 47.756-106.667 106.667-106.667s106.667 47.756 106.667 106.667c0 58.91-47.756 106.667-106.667 106.667-33.894 0-64.095-15.808-83.633-40.454l-236.467 142.445c-0.132-3.064-0.394-6.095-0.779-9.087l7.271-12.835-0.117 53.333-7.183-12.743c0.399-3.046 0.67-6.131 0.806-9.252l236.467 142.383c19.538-24.648 49.741-40.457 83.636-40.457 58.91 0 106.667 47.756 106.667 106.667s-47.756 106.667-106.667 106.667c-58.91 0-106.667-47.756-106.667-106.667 0-1.775 0.043-3.539 0.129-5.293l-236.19-142.216c-19.528 24.867-49.868 40.841-83.939 40.841-58.91 0-106.667-47.756-106.667-106.667s47.756-106.667 106.667-106.667c34.091 0 64.447 15.993 83.974 40.886zM234.667 554.667c23.564 0 42.667-19.103 42.667-42.667s-19.103-42.667-42.667-42.667c-23.564 0-42.667 19.103-42.667 42.667s19.103 42.667 42.667 42.667zM661.333 341.333c23.564 0 42.667-19.103 42.667-42.667s-19.103-42.667-42.667-42.667c-23.564 0-42.667 19.103-42.667 42.667s19.103 42.667 42.667 42.667zM661.333 768c23.564 0 42.667-19.103 42.667-42.667s-19.103-42.667-42.667-42.667c-23.564 0-42.667 19.103-42.667 42.667s19.103 42.667 42.667 42.667z';

/**
 * mapping state to props
 * @param {*} state - redux store state
 * @returns {Object} - mapped state to this component
 */
const mapStateToProps = state => ({
  overlayOpen: state.shell.overlayOpen,
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

  _getVideoDesc(): string {
    let name = coreUtils.Object.getPropertyPath(this.props.player.config, 'sources.metadata.name') || 'the video';
    return encodeURIComponent(`Check out ${name}`);
  }
  /**
   * toggle overlay internal component state
   *
   * @returns {void}
   * @memberof Share
   */
  toggleOverlay = (): void => {
    if (this.props.config.useNative && navigator.share) {
      const videoDesc = this._getVideoDesc();
      navigator
        .share({
          title: videoDesc,
          text: videoDesc,
          url: this.props.config.shareUrl
        })
        .then(() => this.props.logger.debug('Successful sharing'))
        .catch(error => this.props.logger.error('Failed sharing', error));
    } else {
      this.setState(
        prevState => {
          return {
            overlayActive: !this.state.overlayActive,
            previousIsPlaying: this.props.isPlaying || prevState.previousIsPlaying
          };
        },
        () => {
          if (this.state.overlayActive) {
            this.props.player.pause();
          } else if (this.state.previousIsPlaying) {
            this.props.player.play();
            this.setState({previousIsPlaying: false});
          }
        }
      );
    }
  };

  /**
   * render element
   *
   * @returns {React$Element} component element
   * @memberof Share
   */
  render(): React$Element<any> | void {
    const {embedUrl, shareUrl, enableTimeOffset, socialNetworks} = this.props.config;
    if (!(shareUrl && embedUrl)) {
      return undefined;
    }
    const portalSelector = `#${this.props.player.config.targetId} .overlay-portal`;
    const videoDesc = this._getVideoDesc();
    return this.state.overlayActive ? (
      createPortal(
        <ShareOverlay
          shareUrl={shareUrl}
          embedUrl={embedUrl}
          videoDesc={videoDesc}
          enableTimeOffset={enableTimeOffset}
          socialNetworks={socialNetworks}
          player={this.props.player}
          onClose={this.toggleOverlay}
        />,
        document.querySelector(portalSelector)
      )
    ) : (
      <ButtonControl name={COMPONENT_NAME}>
        <Tooltip label={this.props.shareTxt} type={this.props.toolTipType ? this.props.toolTipType : ToolTipType.BottomLeft}>
          <Button aria-haspopup="true" className={style.controlButton} onClick={this.toggleOverlay} aria-label={this.props.shareTxt}>
            <Icon id={pluginName} path={ICON_PATH} state={IconState.INACTIVE} />
          </Button>
        </Tooltip>
      </ButtonControl>
    );
  }
}

Share.displayName = COMPONENT_NAME;
export {Share};
