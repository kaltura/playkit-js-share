// @flow
/**
 * @jsx h
 * @ignore
 */
import {ui} from 'kaltura-player-js';
import shareStyle from './style.scss';

const {preact, preacti18n, Components, Event, Utils, style, redux, Reducers} = ui;
const {h, Component} = preact;
const {Text, Localizer} = preacti18n;
const {Overlay, Icon, CopyButton, Button, withLogger, IconState} = Components;
const {bindActions, KeyMap, withKeyboardA11y} = Utils;
const {shell} = Reducers;
const {actions} = shell;
const {connect} = redux;
const {toHHMMSS, toSecondsFromHHMMSS} = Utils;

const shareOverlayView: Object = {
  Main: 'main',
  EmbedOptions: 'embed-options'
};

const EMAIL_ICON: string =
  'M256 768c-35.346 0-64-28.654-64-64v-352c0-35.346 28.654-64 64-64h512c35.346 0 64 28.654 64 64v352c0 35.346-28.654 64-64 64h-512zM512 467.488l147.52-115.488h-295.040l147.52 115.488zM748.48 352l-211.2 179.2c-0.713 1.308-1.572 2.532-2.56 3.648-12.707 12.158-32.733 12.158-45.44 0-0.988-1.116-1.847-2.34-2.56-3.648l-211.2-179.2h-19.52v352h512v-352h-19.52z';
const LINK_ICON: string =
  'M355.028 445.537c12.497 12.497 12.497 32.758 0 45.255s-32.758 12.497-45.255 0l-24.141-24.141c-49.92-49.92-49.832-130.999 0.094-180.925 49.984-49.984 130.995-50.025 180.955-0.064l113.266 113.266c49.964 49.964 49.935 130.955-0.064 180.955-12.497 12.497-32.758 12.497-45.255 0s-12.497-32.758 0-45.255c25.013-25.013 25.027-65.482 0.064-90.445l-113.266-113.266c-24.957-24.957-65.445-24.936-90.445 0.064-24.955 24.955-24.998 65.511-0.094 90.416l24.141 24.141zM668.972 578.463c-12.497-12.497-12.497-32.758 0-45.255s32.758-12.497 45.255 0l24.141 24.141c49.92 49.92 49.832 130.999-0.094 180.925-49.984 49.984-130.995 50.025-180.955 0.064l-113.266-113.266c-49.964-49.964-49.935-130.955 0.064-180.955 12.497-12.497 32.758-12.497 45.255 0s12.497 32.758 0 45.255c-25.013 25.013-25.027 65.482-0.064 90.445l113.266 113.266c24.957 24.957 65.445 24.936 90.445-0.064 24.955-24.955 24.998-65.511 0.094-90.416l-24.141-24.141z';
const EMBED_ICON: string =
  'M377.989 579.335c12.669 12.904 12.669 33.777 0 46.68-12.733 12.969-33.427 12.969-46.16 0l-104.727-106.667c-12.669-12.904-12.669-33.777 0-46.68l104.727-106.667c12.733-12.969 33.427-12.969 46.16 0 12.669 12.904 12.669 33.777 0 46.68l-81.812 83.327 81.812 83.327zM646.011 412.68c-12.669-12.904-12.669-33.777 0-46.68 12.733-12.969 33.427-12.969 46.16 0l104.727 106.667c12.669 12.904 12.669 33.777 0 46.68l-104.727 106.667c-12.733 12.969-33.427 12.969-46.16 0-12.669-12.904-12.669-33.777 0-46.68l81.812-83.327-81.812-83.327zM572.293 250.6c17.455 4.445 28.025 22.388 23.686 40.066l-104.727 426.669c-4.349 17.719-22.048 28.535-39.545 24.079-17.455-4.445-28.025-22.388-23.686-40.066l104.727-426.669c4.349-17.719 22.048-28.535 39.545-24.079z';

const SHARE_ICONS = {
  facebook:
    'M432 405.333h-80v106.667h80v320h133.333v-320h97.12l9.547-106.667h-106.667v-44.453c0-25.467 5.12-35.547 29.733-35.547h76.933v-133.333h-101.547c-95.893 0-138.453 42.213-138.453 123.067v90.267z',
  twitter:
    'M832 316.614c-23.547 10.29-48.853 17.221-75.413 20.345 27.12-15.987 47.947-41.319 57.733-71.508-25.36 14.806-53.467 25.568-83.387 31.37-23.92-25.122-58.080-40.82-95.84-40.82-84.773 0-147.067 77.861-127.92 158.687-109.093-5.381-205.84-56.833-270.613-135.035-34.4 58.094-17.84 134.090 40.613 172.574-21.493-0.683-41.76-6.484-59.44-16.171-1.44 59.879 42.16 115.898 105.307 128.368-18.48 4.935-38.72 6.090-59.307 2.205 16.693 51.347 65.173 88.702 122.667 89.752-55.2 42.605-124.747 61.637-194.4 53.552 58.107 36.673 127.147 58.067 201.28 58.067 243.787 0 381.52-202.684 373.2-384.473 25.653-18.244 47.92-41.004 65.52-66.914v0z',
  linkedin:
    'M324.8 290.087c0 36.506-29.6 66.087-66.133 66.087s-66.133-29.581-66.133-66.087c0-36.48 29.6-66.087 66.133-66.087s66.133 29.607 66.133 66.087zM325.333 409.043h-133.333v422.957h133.333v-422.957zM538.187 409.043h-132.48v422.957h132.507v-222.026c0-123.45 160.773-133.549 160.773 0v222.026h133.013v-267.811c0-208.306-237.92-200.719-293.813-98.179v-56.967z'
};

/**
 * ShareButton component
 * @param {Object} props - the class props
 * @returns {React$Element<any>} the share button element
 * @constructor
 */
const ShareButton = (props: Object): React$Element<any> => {
  /**
   * opens new window for share
   *
   * @param {string} href - url to open
   * @returns {boolean} - false
   * @memberof ShareOverlay
   */
  const share = () => {
    const shareUrl = props.config.shareUrl;
    const templateUrl = props.config.templateUrl;
    let href = shareUrl;
    if (templateUrl) {
      try {
        href = templateUrl.replace('{shareUrl}', encodeURIComponent(shareUrl));
      } catch (e) {
        href = templateUrl.replace('{shareUrl}', shareUrl);
      }
    }
    window.open(href, '_blank', 'width=580,height=580');
  };

  return (
    <Localizer>
      <Button
        ref={el => {
          props.addAccessibleChild(el);
        }}
        title={<Text id={props.config.title} />}
        role="link"
        aria-label={<Text id={props.config.ariaLabel} />}
        className={[style.btnRounded, style[props.config.iconType], props.config.iconType].join(' ')}
        onClick={share}>
        <Icon id={props.config.iconType} path={SHARE_ICONS[props.config.iconType]} state={IconState.INACTIVE} />
        {/*<Icon style={props.config.iconType === 'svg' ? `background-image: url(${props.config.svg})` : ``} type={props.config.iconType} />*/}
      </Button>
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
      <div className={[style.formGroup, style.hasIcon, style.inputCopyUrl].join(' ')} style="width: 350px;">
        <input tabIndex="-1" type="text" ref={c => (c ? (_ref = c) : undefined)} className={style.formControl} value={props.shareUrl} readOnly />
        <Icon id="link" path={LINK_ICON} state={IconState.INACTIVE} />
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
    if (e.keyCode === KeyMap.ENTER) {
      e.preventDefault();
      props.toggleStartFrom();
    }
  };

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
          aria-labelledby="start-from-label"
          ref={el => {
            props.addAccessibleChild(el);
          }}
          type="text"
          className={style.formControl}
          onChange={props.handleStartFromChange}
          value={toHHMMSS(props.startFromValue)}
          style="width: 72px;"
        />
      </div>
    </div>
  );
};

const COMPONENT_NAME = 'ShareOverlay';

/**
 * ShareOverlay component
 *
 * @class ShareOverlay
 * @extends {Component}
 */
@connect(null, bindActions(actions))
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

  /**
   * changing the overlay state
   *
   * @param {string} stateName state name
   * @returns {void}
   * @memberof ShareOverlay
   */
  _transitionToState(stateName: string): void {
    this.setState({view: stateName});
  }

  /**
   * on click handler
   *
   * @returns {void}
   * @memberof ShareOverlay
   */
  onClick = (): void => {
    this._transitionToState(shareOverlayView.EmbedOptions);
  };

  /**
   * get share url method
   *
   * @returns {string} - share url
   * @memberof ShareOverlay
   */
  getShareUrl(): string {
    let url = this.props.shareUrl;
    if (this.state.startFrom) {
      url += `?start=${this.state.startFromValue}`;
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
    let url = this.props.embedUrl;
    if (this.state.startFrom) {
      url += `?start=${this.state.startFromValue}`;
    }
    return `<iframe src="${url}" style="width: 560px;height: 395px" allowfullscreen webkitallowfullscreen mozAllowFullScreen frameborder="0" allow="accelerometer *; autoplay *; encrypted-media *; gyroscope *; picture-in-picture *"/>`;
  }

  /**
   * Create the email mailto template string
   * @returns {string} the mailto template
   * @private
   */
  _getEmailTemplate(): string {
    let name = 'this video';
    const {player} = this.props;
    if (player.config.sources && player.config.sources.metadata && player.config.sources.metadata.name) {
      name = player.config.sources.metadata.name;
    }
    const emailSubject = encodeURIComponent(`Check out ${name}`);
    const emailBody = encodeURIComponent(`Check out ${name}: ${this.getShareUrl()}`);
    const mailTo = `mailto:?subject=${emailSubject}&body=${emailBody}`;
    return mailTo;
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
   * @param {*} e - input change event
   * @returns {void}
   * @memberof ShareOverlay
   */
  _handleStartFromChange = (e: any): void => {
    let seconds = toSecondsFromHHMMSS(e.target.value);
    if (seconds >= this.props.player.duration) {
      this.setState({startFromValue: 1});
    }
    this.setState({startFromValue: seconds});
  };

  /**
   * render the partial social network DOM
   * @param {Array<Object>} socialNetworksConfig - the social network config
   * @param {Function} addAccessibleChild - pass the addAccessibleChild so the share button can add its accessible elements
   * @returns {React$Element<*>[]} partial social network DOM
   * @private
   */
  _createSocialNetworks(socialNetworksConfig: Array<Object>): React$Element<any>[] {
    return socialNetworksConfig.map(social => {
      if (social.iconType === 'default') {
        social.iconType = social.name;
        social.shareUrl = this.props.shareUrl;
      }
      return <ShareButton key={social.name} config={social} addAccessibleChild={this.props.addAccessibleChild} />;
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
          <div className={shareStyle.shareIcons}>
            {this._createSocialNetworks(this.props.socialNetworks)}
            <Localizer>
              <a
                role="button"
                tabIndex="0"
                ref={el => {
                  this.props.addAccessibleChild(el);
                }}
                className={[style.btnRounded, shareStyle.emailShareBtn].join(' ')}
                href={this._getEmailTemplate()}
                title={<Text id="share.email" />}>
                <Icon id="email" path={EMAIL_ICON} state={IconState.INACTIVE} />
              </a>
            </Localizer>
            <Localizer>
              <Button
                aria-haspopup="true"
                ref={el => {
                  this.props.addAccessibleChild(el);
                }}
                className={[style.btnRounded, style.embedShareBtn].join(' ')}
                onClick={this.onClick}
                title={<Text id="share.embed" />}>
                <Icon id="embed" path={EMBED_ICON} state={IconState.INACTIVE} />
              </Button>
            </Localizer>
          </div>
          <div className={shareStyle.linkOptionsContainer}>
            <ShareUrl addAccessibleChild={this.props.addAccessibleChild} shareUrl={this.getShareUrl()} copy={true} isIos={this.isIos} />
            {this.props.enableTimeOffset ? (
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
          {this.props.enableTimeOffset ? (
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
