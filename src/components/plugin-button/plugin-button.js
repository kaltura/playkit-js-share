// @flow
/**
 * @jsx h
 * @ignore
 */
import {ui} from '@playkit-js/kaltura-player-js';
import {pluginName} from '../../share';
const {preact, preacti18n, Components, style} = ui;
const {h, Component} = preact;
const {withText} = preacti18n;
const {Tooltip, Icon} = Components;

export const ICON_PATH: string =
  'M318.641 446.219l236.155-142.257c-0.086-1.754-0.129-3.52-0.129-5.295 0-58.91 47.756-106.667 106.667-106.667s106.667 47.756 106.667 106.667c0 58.91-47.756 106.667-106.667 106.667-33.894 0-64.095-15.808-83.633-40.454l-236.467 142.445c-0.132-3.064-0.394-6.095-0.779-9.087l7.271-12.835-0.117 53.333-7.183-12.743c0.399-3.046 0.67-6.131 0.806-9.252l236.467 142.383c19.538-24.648 49.741-40.457 83.636-40.457 58.91 0 106.667 47.756 106.667 106.667s-47.756 106.667-106.667 106.667c-58.91 0-106.667-47.756-106.667-106.667 0-1.775 0.043-3.539 0.129-5.293l-236.19-142.216c-19.528 24.867-49.868 40.841-83.939 40.841-58.91 0-106.667-47.756-106.667-106.667s47.756-106.667 106.667-106.667c34.091 0 64.447 15.993 83.974 40.886zM234.667 554.667c23.564 0 42.667-19.103 42.667-42.667s-19.103-42.667-42.667-42.667c-23.564 0-42.667 19.103-42.667 42.667s19.103 42.667 42.667 42.667zM661.333 341.333c23.564 0 42.667-19.103 42.667-42.667s-19.103-42.667-42.667-42.667c-23.564 0-42.667 19.103-42.667 42.667s19.103 42.667 42.667 42.667zM661.333 768c23.564 0 42.667-19.103 42.667-42.667s-19.103-42.667-42.667-42.667c-23.564 0-42.667 19.103-42.667 42.667s19.103 42.667 42.667 42.667z';

const COMPONENT_NAME = 'ShareButton';
/**
 * Share component
 *
 * @class Share
 * @example <Share />
 * @extends {Component}
 */
@withText({shareTxt: 'controls.share'})
class ShareButton extends Component {
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
    return (
      <Tooltip label={this.props.shareTxt}>
        <button tabIndex={0} aria-haspopup="true" className={style.upperBarIcon} aria-label={this.props.shareTxt} ref={this.props.setRef}>
          <Icon id={pluginName} path={ICON_PATH} />
        </button>
      </Tooltip>
    );
  }
}

ShareButton.displayName = COMPONENT_NAME;
export {ShareButton};
