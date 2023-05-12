// @flow
/**
 * @jsx h
 * @ignore
 */
import {ui} from '@playkit-js/kaltura-player-js';
import shareStyle from './style.scss';

const {preact, preacti18n, Components, Event, Utils, style, redux, Reducers, preactHooks} = ui;
const {h, Component} = preact;
const {useRef} = preactHooks;
const {Text, Localizer} = preacti18n;
const {Overlay, Icon, CopyButton, Button, withLogger, Tooltip, ButtonControl} = Components;
const {bindActions, KeyMap, withKeyboardA11y, toHHMMSS, toSecondsFromHHMMSS, formatOnlyNumbersInput} = Utils;
const {shell} = Reducers;
const {actions} = shell;
const {connect} = redux;

const shareOverlayView: Object = {
  Main: 'main',
  EmbedOptions: 'embed-options'
};

const EMBED = 'embed';
/**
 * ShareButton component
 * @param {Object} props - the class props
 * @returns {React$Element<any>} the share button element
 * @constructor
 */
const ShareButton = (props: Object): React$Element<any> => {
  const COMPONENT_NAME = 'ShareButton';
  const _updateOverlay = props.updateShareOverlay;
  /**
   * opens new window for share
   *
   * @param {string} buttonType - url to open
   * @returns {boolean} - false
   * @memberof ShareOverlay
   */
  const onClick = (buttonType: string) => {
    const EMAIL = 'email';
    const {templateUrl, shareUrl, embedUrl} = props.config;
    let href = templateUrl;

    href = href.replace(/{description}/g, encodeURIComponent(props.videoDesc));
    try {
      href = href.replace(/{shareUrl}/g, encodeURIComponent(shareUrl));
    } catch (e) {
      href = href.replace(/{shareUrl}/g, shareUrl);
    }

    switch (buttonType) {
      case EMAIL:
        location.href = href;
        break;
      case EMBED:
        _updateOverlay(shareOverlayView.EmbedOptions, href, embedUrl);
        break;
      default:
        window.open(href, '_blank', 'width=580,height=580');
        break;
    }
  };

  return (
    <Localizer>
      <ButtonControl name={COMPONENT_NAME}>
        <Tooltip label={<Text id={props.config.title} />}>
          <Localizer>
            <Button
              ref={el => {
                props.addAccessibleChild(el);
              }}
              role="link"
              aria-label={<Text id={props.config.title} />}
              aria-haspopup={props.socialName === EMBED}
              className={[style.btnBorderless, style.onlyIcon, shareStyle.btnSocialNetwork].join(' ')}
              onClick={() => onClick(props.socialName)}>
              <Icon id={props.socialName} color="#fff" path={props.config.icon} width="24" height="24" viewBox="0 0 24 24" />
            </Button>
          </Localizer>
        </Tooltip>
      </ButtonControl>
    </Localizer>
  );
};

/**
 * The copy url comonent
 * @param {Object} props - the class props
 * @returns {React$Element<any>} the copy url element
 * @constructor
 */
const ShareUrl = (props: Object): React$Element<any> => {
  let _ref;

  /**
   * copy input text based on input element.
   * on success, set success internal component state for 2 seconds
   *
   * @returns {void}
   * @memberof ShareOverlay
   */
  const copyUrl = (): void => {
    if (_ref) {
      if (props.isIos) {
        _ref.setSelectionRange(0, 9999);
      } else {
        _ref.select();
      }
      document.execCommand('copy');
      _ref.blur();
    }
  };

  return (
    <div className={props.copy ? style.copyUrlRow : ''}>
      <div className={[style.formGroup, style.inputCopyUrl].join(' ')} style="width: 350px;">
        <input tabIndex="-1" type="text" ref={c => (c ? (_ref = c) : undefined)} className={style.formControl} value={props.shareUrl} readOnly />
      </div>
      {props.copy && <CopyButton addAccessibleChild={props.addAccessibleChild} copy={copyUrl} />}
    </div>
  );
};

/**
 * The video start options
 * @param {Object} props - the class props
 * @returns {React$Element<any>} the video start options element
 * @constructor
 */
const VideoStartOptions = (props: Object): React$Element<any> => {
  let _inputRefElement = useRef<HTMLInputElement>();

  /**
   * format the value in input element
   *
   * @param {string} inputValue - the value from the input element
   * @returns {string} the formatted value
   * @memberof VideoStartOptions
   */
  const formatInput = (inputValue: string): string => {
    return isNaN(inputValue) ? inputValue : formatOnlyNumbersInput(inputValue);
  };

  /**
   * on focusout handler
   *
   * @param {*} event - the focusout event
   * @returns {void}
   * @memberof VideoStartOptions
   */
  const onInputFocusOutHandler = (event: any): void => {
    const formattedInput = formatInput(event.target.value);
    props.handleStartFromChange(formattedInput);
  };

  /**
   * on click handler
   *
   * @param {Event} e - event
   * @returns {void}
   * @memberof VideoStartOptions
   */
  const onClick = (e: Event): void => {
    e.preventDefault();
    props.toggleStartFrom();
  };

  /**
   * on key down handler
   *
   * @param {KeyboardEvent} e - keyboard event
   * @returns {void}
   * @memberof VideoStartOptions
   */
  const onKeyDown = (e: KeyboardEvent): void => {
    if ([KeyMap.ENTER, KeyMap.SPACE].includes(e.keyCode)) {
      e.preventDefault();
      props.toggleStartFrom();
    }
  };

  /**
   * on change handler
   * prevent invalid chars in input (only numbers and ':' are valid)
   * @param {string} val - the value from the input element
   * @returns {void}
   * @memberof VideoStartOptions
   */
  const onInputChangeHandler = (val: string): void => {
    for (let index = 0; index < val.length; index++) {
      const char = val.charAt(index);
      if (isNaN(char) && char !== ':') {
        _inputRefElement.value = val.replace(char, '');
        break;
      }
    }
  };

  const inputProps = {
    'aria-labelledby': 'start-from-label',
    'aria-disabled': props.startFrom ? 'false' : 'true',
    type: 'text',
    value: toHHMMSS(props.startFromValue),
    className: [style.formControl, shareStyle.startAtInput, !props.startFrom ? shareStyle.disabled : ''].join(' '),
    style: props.videoHasHours ? 'width: 85px;' : 'width: 56px;',
    onChange: e => onInputChangeHandler(e.target.value),
    onBlur: onInputFocusOutHandler
  };
  if (!props.startFrom) {
    inputProps.disabled = true;
  }

  return (
    <div className={shareStyle.videoStartOptionsRow}>
      <div
        role="checkbox"
        aria-checked={props.startFrom ? 'true' : 'false'}
        ref={el => {
          props.addAccessibleChild(el);
        }}
        tabIndex="0"
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={[style.checkbox, style.dInlineBlock].join(' ')}>
        <input type="checkbox" id="start-from" checked={props.startFrom} />
        <label id="start-from-label" htmlFor="start-from">
          <Text id={'share.start_video_at'} />
        </label>
      </div>
      <div className={[style.formGroup, style.dInlineBlock].join(' ')}>
        <input
          ref={el => {
            _inputRefElement = el;
            props.addAccessibleChild(el);
          }}
          {...inputProps}
        />
      </div>
    </div>
  );
};

const COMPONENT_NAME = 'ShareOverlay';

/**
 * mapping state to props
 * @param {*} state - redux store state
 * @returns {Object} - mapped state to this component
 */
const mapStateToProps = state => ({
  isLive: state.engine.isLive
});

/**
 * ShareOverlay component
 *
 * @class ShareOverlay
 * @extends {Component}
 */
@connect(mapStateToProps, bindActions(actions))
@withLogger(COMPONENT_NAME)
@withKeyboardA11y
class ShareOverlay extends Component {
  /**
   * before component mount, set initial state
   *
   * @returns {void}
   * @memberof ShareOverlay
   */
  componentWillMount() {
    this.isIos = this.props.player.env.os.name === 'iOS';
    this.setState({
      view: shareOverlayView.Main,
      startFrom: false,
      startFromValue: Math.floor(this.props.player.currentTime)
    });
  }

  /**
   * when component did update and change its view state then focus on default
   *
   * @param {Object} previousProps - previous props
   * @param {Object} previousState - previous state
   * @returns {void}
   * @memberof ShareOverlay
   */
  componentDidUpdate(previousProps: Object, previousState: Object): void {
    if (previousState.view != this.state.view) {
      this.props.focusOnDefault();
    }
  }

  /**
   * after component mounted, set popup to behave as modal
   * @returns {void}
   * @memberof ShareOverlay
   */
  componentDidMount(): void {
    this.props.setIsModal(true);
  }

  _addUrlKalturaStartTimeParam(url: string): string {
    const param = `kalturaStartTime=${this.state.startFromValue}`;
    return url.indexOf('?') === -1 ? `${url}?${param}` : `${url}&${param}`;
  }

  /**
   * get share url method
   *
   * @returns {string} - share url
   * @memberof ShareOverlay
   */
  getShareUrl(): string {
    let url = this.props.config.shareUrl;
    if (this.state.startFrom) {
      url = this._addUrlKalturaStartTimeParam(url);
    }
    return url;
  }

  /**
   * get embed code
   * #TODO: complete logic here
   *
   * @returns {string} - embed code
   * @memberof ShareOverlay
   */
  getEmbedCode(): string {
    let url = this.state.embedUrl;
    const template = this.state.embedTemplate;
    if (this.state.startFrom) {
      url = this._addUrlKalturaStartTimeParam(url);
    }
    return template.replace(/{embedUrl}/g, url);
  }

  /**
   * toggle start from option checkbox in the internal component state
   *
   * @returns {void}
   * @memberof ShareOverlay
   */
  _toggleStartFrom = (): void => {
    this.setState(prevState => {
      return {startFrom: !prevState.startFrom};
    });
  };

  /**
   * start from input change handler.
   * converts to seconds and save the new value in internal component state
   *
   * @param {string} value - input change event
   * @returns {void}
   * @memberof ShareOverlay
   */
  _handleStartFromChange = (value: string): void => {
    let seconds = toSecondsFromHHMMSS(value);
    const val = seconds >= this.props.player.duration ? this.props.player.duration : seconds;
    this.setState({startFromValue: val});
  };

  /**
   * changing the overlay state
   *
   * @param {string} stateName state name
   * @param {string} embedTemplate embed urk
   * @param {string} embedUrl embed urk
   * @returns {void}
   * @memberof ShareOverlay
   */
  _updateOverlay = (stateName: string, embedTemplate: string, embedUrl: string) => {
    this.setState({view: stateName, embedTemplate, embedUrl});
  };

  /**
   * render the partial social network DOM
   * @param {ShareOptions} shareOptionsConfig - the social network config
   * @returns {React$Element<*>[]} partial social network DOM
   * @private
   */
  _createShareOptions(shareOptionsConfig: ShareOptions): any[] {
    return Object.keys(shareOptionsConfig).map(socialName => {
      const {shareUrl} = this.props.config;
      let {embedUrl} = this.props.config;
      if (socialName === EMBED) {
        const validEmbedUrl = ['embedBaseUrl', 'partnerId', 'uiConfId', 'entryId'].every(prop => {
          if (embedUrl.indexOf(`{${prop}}`) > -1) {
            if (this.props.config[prop]) {
              embedUrl = embedUrl.replace(new RegExp(`{${prop}}`, 'g'), this.props.config[prop]);
              return true;
            } else {
              return false;
            }
          }
          return true;
        });
        if (!validEmbedUrl || !embedUrl) {
          return undefined;
        }
      }
      const shareButtonConfig = {...shareOptionsConfig[socialName], shareUrl, embedUrl};
      return (
        <ShareButton
          key={socialName}
          socialName={socialName}
          videoDesc={this.props.videoDesc}
          config={shareButtonConfig}
          addAccessibleChild={this.props.addAccessibleChild}
          updateShareOverlay={this._updateOverlay}
        />
      );
    });
  }

  /**
   * renders main overlay state
   *
   * @returns {React$Element} - main state element
   * @memberof ShareOverlay
   */
  renderMainState(): React$Element<any> {
    return (
      <div className={this.state.view === shareOverlayView.Main ? 'overlay-screen active' : 'overlay-screen'}>
        <div className={style.title}>
          <Text id="share.title" />
        </div>
        <div className={shareStyle.shareMainContainer}>
          <div className={shareStyle.shareIcons}>{this._createShareOptions(this.props.config.shareOptions)}</div>
          <div className={shareStyle.linkOptionsContainer}>
            <ShareUrl addAccessibleChild={this.props.addAccessibleChild} shareUrl={this.getShareUrl()} copy={true} isIos={this.isIos} />
            {this.props.config.enableTimeOffset && !this.props.isLive ? (
              <VideoStartOptions
                addAccessibleChild={this.props.addAccessibleChild}
                startFrom={this.state.startFrom}
                startFromValue={this.state.startFromValue}
                handleStartFromChange={this._handleStartFromChange}
                toggleStartFrom={this._toggleStartFrom}
                videoHasHours={this.props.player.duration >= 3600}
              />
            ) : undefined}
          </div>
        </div>
      </div>
    );
  }

  /**
   * renders embed options state
   * @param {Object} props - the render props
   * @returns {React$Element} - embed options element
   * @memberof ShareOverlay
   */
  renderOptionsState(props: Object): React$Element<any> {
    return (
      <div className={this.state.view === shareOverlayView.EmbedOptions ? 'overlay-screen active' : 'overlay-screen'}>
        <div className={style.title}>{props.title}</div>
        <div className={shareStyle.linkOptionsContainer}>
          <ShareUrl addAccessibleChild={this.props.addAccessibleChild} shareUrl={props.shareUrl} copy={true} isIos={this.isIos} />
          {this.props.config.enableTimeOffset && !this.props.isLive ? (
            <VideoStartOptions
              addAccessibleChild={this.props.addAccessibleChild}
              startFrom={this.state.startFrom}
              startFromValue={this.state.startFromValue}
              handleStartFromChange={this._handleStartFromChange}
              toggleStartFrom={this._toggleStartFrom}
            />
          ) : undefined}
        </div>
      </div>
    );
  }

  /**
   * utility function to switch and render the right overlay state element based on the overlay state.
   *
   * @returns {React$Element} - current state element
   * @memberof ShareOverlay
   */
  renderStateContent(): React$Element<any> {
    this.props.clearAccessibleChildren();
    switch (this.state.view) {
      case shareOverlayView.EmbedOptions:
        return this.renderOptionsState({title: <Text id="share.embed_options" />, shareUrl: this.getEmbedCode()});

      case shareOverlayView.Main:
      default:
        return this.renderMainState();
    }
  }

  /**
   * render component
   *
   * @param {*} props - component props
   * @returns {React$Element} - component element
   * @memberof ShareOverlay
   */
  render(props: any): React$Element<any> {
    return (
      <Overlay
        open
        addAccessibleChild={this.props.addAccessibleChild}
        handleKeyDown={this.props.handleKeyDown}
        onClose={props.onClose}
        type="playkit-share">
        {this.renderStateContent()}
      </Overlay>
    );
  }
}

ShareOverlay.displayName = COMPONENT_NAME;
export {ShareOverlay};
