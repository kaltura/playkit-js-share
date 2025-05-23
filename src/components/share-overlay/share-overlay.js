// @flow
/**
 * @jsx h
 * @ignore
 */
import {ui} from '@playkit-js/kaltura-player-js';
import shareStyle from './style.scss';
import {FakeEvent} from '@playkit-js/playkit-js';
import {ShareEvent} from '../../event';
import {RadioButton, RadioButtonSelected} from '../radio-button/radio-button';
const {preact, preacti18n, Components, Utils, style, redux, Reducers, preactHooks, ReservedPresetNames} = ui;
const {h, Component} = preact;
const {useRef} = preactHooks;
const {Text, Localizer, withText} = preacti18n;
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
    const {config, videoDesc, videoClippingOption} = props;
    const {templateUrl, shareUrl, embedUrl} = config;
    let href = decodeURIComponent(templateUrl);

    href = href.replace(/{description}/g, encodeURIComponent(videoDesc));
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
    props.player.dispatchEvent(new FakeEvent(ShareEvent.SHARE_NETWORK, {socialNetworkName: buttonType, videoClippingOption}));
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
      const {videoClippingOption} = props;
      props.player.dispatchEvent(new FakeEvent(ShareEvent.SHARE_COPY, {videoClippingOption}));
    }
  };

  return (
    <div className={props.copy ? style.copyUrlRow : ''}>
      <div className={[style.formGroup, style.inputCopyUrl].join(' ')} style="width: 100%;">
        <input
          tabIndex="-1"
          type="text"
          ref={c => (c ? (_ref = c) : undefined)}
          className={style.formControl}
          value={props.shareUrl}
          aria-label={props.shareUrl}
          readOnly
        />
      </div>
      {props.copy && <CopyButton addAccessibleChild={props.addAccessibleChild} copy={copyUrl} />}
    </div>
  );
};

const VIDEO_CLIPPING_OPTIONS = {
  FULL_VIDEO: 'full',
  START_FROM: 'start-from',
  CLIP: 'clip'
};

/**
 * The video start options
 * @param {Object} props - the class props
 * @returns {React$Element<any>} the video start options element
 * @constructor
 */
const VideoStartOptions = (props: Object): React$Element<any> => {
  let _startFromInputRef = useRef<HTMLInputElement>();
  let _clipStartTimeInputRef = useRef<HTMLInputElement>();
  let _clipEndTimeInputRef = useRef<HTMLInputElement>();

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
   * @param {*} handleInputChangeCallback - the input change handler callback function to invoke
   * @returns {void}
   * @memberof VideoStartOptions
   */
  const onInputFocusOutHandler = (event: any, handleInputChangeCallback: any): void => {
    const formattedInput = formatInput(event.target.value);
    handleInputChangeCallback(formattedInput);
  };

  /**
   * on click handler
   *
   * @param {Event} e - event
   * @param {string} option - the video clipping option to set
   * @returns {void}
   * @memberof VideoStartOptions
   */
  const onClick = (e: Event, option: string): void => {
    e.preventDefault();
    props.setVideoClippingOption(option);
  };

  /**
   * on key down handler
   *
   * @param {KeyboardEvent} e - keyboard event
   * @param {string} option - the video clipping option
   * @returns {void}
   * @memberof VideoStartOptions
   */
  const onKeyDown = (e: KeyboardEvent, option: string): void => {
    if ([KeyMap.ENTER, KeyMap.SPACE].includes(e.keyCode)) {
      e.preventDefault();
      props.setVideoClippingOption(option);
    }
  };

  /**
   * on change handler
   * prevent invalid chars in input (only numbers and ':' are valid)
   * @param {string} val - the value from the input element
   * @param {*} inputRefElement - the input ref element
   * @returns {void}
   * @memberof VideoStartOptions
   */
  const onInputChangeHandler = (val: string, inputRefElement: any): void => {
    for (let index = 0; index < val.length; index++) {
      const char = val.charAt(index);
      if (isNaN(char) && char !== ':') {
        inputRefElement.value = val.replace(char, '');
        break;
      }
    }
  };

  /**
   * sets the video clipping option
   *
   * @param {string} option - the video clipping option to set
   * @returns {void}
   * @memberof VideoStartOptions
   */
  const setVideoClippingOption = (option: string): void => {
    props.setVideoClippingOption(option);
  };

  /**
   * renders the start from input element
   *
   * @returns {void}
   * @memberof VideoStartOptions
   */
  const _renderStartFromInput = () => {
    const startFromInputProps = {
      'aria-labelledby': 'start-from-label',
      'aria-disabled': props.videoClippingOption === VIDEO_CLIPPING_OPTIONS.START_FROM ? 'false' : 'true',
      type: 'text',
      value: toHHMMSS(props.startFromValue),
      className: [
        style.formControl,
        shareStyle.startAtInput,
        props.videoClippingOption !== VIDEO_CLIPPING_OPTIONS.START_FROM ? shareStyle.disabled : ''
      ].join(' '),
      style: props.videoHasHours ? 'width: 85px;' : 'width: 56px;',
      onChange: e => onInputChangeHandler(e.target.value, _startFromInputRef),
      onBlur: e => onInputFocusOutHandler(e, props.handleStartFromChange)
    };
    if (props.videoClippingOption !== VIDEO_CLIPPING_OPTIONS.START_FROM) {
      startFromInputProps.disabled = true;
    }
    return (
      <div className={[style.formGroup, style.dInlineBlock].join(' ')}>
        <input
          ref={el => {
            _startFromInputRef = el;
            props.addAccessibleChild(el);
          }}
          {...startFromInputProps}
        />
      </div>
    );
  };

  /**
   * renders the input elements of the clipping option
   *
   * @returns {void}
   * @memberof VideoStartOptions
   */
  const _renderClipTimeSlotsInput = () => {
    const sharedAttr = {
      'aria-disabled': props.videoClippingOption === VIDEO_CLIPPING_OPTIONS.CLIP ? 'false' : 'true',
      type: 'text',
      className: [
        style.formControl,
        shareStyle.startAtInput,
        props.videoClippingOption !== VIDEO_CLIPPING_OPTIONS.CLIP ? shareStyle.disabled : ''
      ].join(' '),
      style: props.videoHasHours ? 'width: 85px;' : 'width: 56px;'
    };

    const clipStartTimeInputProps = {
      'aria-label': props.shareClipLabels.clipSeekFrom,
      value: toHHMMSS(props.clipOriginalStartTimeValue || props.clipStartTimeValue),
      onChange: e => onInputChangeHandler(e.target.value, _clipStartTimeInputRef),
      onBlur: e => onInputFocusOutHandler(e, props.handleClipStartTimeChange),
      ...sharedAttr
    };
    if (props.videoClippingOption !== VIDEO_CLIPPING_OPTIONS.CLIP) {
      clipStartTimeInputProps.disabled = true;
    }

    const clipToInputProps = {
      'aria-label': props.shareClipLabels.clipTo,
      value: toHHMMSS(props.clipEndTimeValue),
      onChange: e => onInputChangeHandler(e.target.value, _clipEndTimeInputRef),
      onBlur: e => onInputFocusOutHandler(e, props.handleClipEndTimeChange),
      ...sharedAttr
    };
    if (props.videoClippingOption !== VIDEO_CLIPPING_OPTIONS.CLIP) {
      clipToInputProps.disabled = true;
    }

    return (
      <div className={shareStyle.clipTimeSlotsContainer}>
        <label htmlFor="clipStartInput">{<Text id="share.clip_start" />}</label>
        <input
          id="clipStartInput"
          ref={el => {
            _clipStartTimeInputRef = el;
            props.addAccessibleChild(el);
          }}
          {...clipStartTimeInputProps}
        />
        <div className={shareStyle.clipRectangle} />
        <label htmlFor="clipEndInput">{<Text id="share.clip_end" />}</label>
        <input
          id="clipEndInput"
          ref={el => {
            _clipEndTimeInputRef = el;
            props.addAccessibleChild(el);
          }}
          {...clipToInputProps}
        />
      </div>
    );
  };

  /**
   * renders the video clipping option item
   *
   * @param {string} optionType - the video clipping option type
   * @param {string} inputId - the input element id
   * @param {string} labelId - the label element id
   * @param {string} textId - the text id
   * @returns {void}
   * @memberof VideoStartOptions
   */
  const _renderVideoStartOptionsItem = (optionType: string, inputId: string, labelId: string, textId: string) => {
    const styleProps = {};
    if (optionType === VIDEO_CLIPPING_OPTIONS.FULL_VIDEO) {
      styleProps.style = 'width: 100%;';
    }
    return (
      <VideoStartOptionsItem
        videoClippingOption={props.videoClippingOption}
        addAccessibleChild={props.addAccessibleChild}
        videoClippingType={optionType}
        onKeyDown={(e: KeyboardEvent) => onKeyDown(e, optionType)}
        onClick={(e: KeyboardEvent) => onClick(e, optionType)}
        setVideoClippingOption={setVideoClippingOption}
        inputId={inputId}
        labelId={labelId}
        textId={textId}
        {...styleProps}>
        {optionType === VIDEO_CLIPPING_OPTIONS.START_FROM && _renderStartFromInput()}
        {optionType === VIDEO_CLIPPING_OPTIONS.CLIP && _renderClipTimeSlotsInput()}
      </VideoStartOptionsItem>
    );
  };

  return (
    <div className={shareStyle.videoStartOptionsContainer} role="radiogroup">
      {_renderVideoStartOptionsItem(VIDEO_CLIPPING_OPTIONS.FULL_VIDEO, 'full-video', 'full-video-label', 'share.full_video')}
      {props.config.enableTimeOffset &&
        _renderVideoStartOptionsItem(VIDEO_CLIPPING_OPTIONS.START_FROM, 'start-from', 'start-from-label', 'share.start_video_at')}
      {props.config.enableClipping && _renderVideoStartOptionsItem(VIDEO_CLIPPING_OPTIONS.CLIP, 'clip', 'clip-label', 'share.clip_video')}
    </div>
  );
};

/**
 * The video start options item
 * @param {Object} props - the class props
 * @returns {React$Element<any>} the video start options element
 * @constructor
 */
const VideoStartOptionsItem = (props: Object): React$Element<any> => {
  const isItemSelected = props.videoClippingOption === props.videoClippingType;
  const radioButtonProps = {};
  if (props.style) {
    radioButtonProps.style = props.style;
  }
  return (
    <div className={shareStyle.videoStartOptionsRow}>
      <div
        role="radio"
        aria-checked={isItemSelected}
        ref={el => {
          props.addAccessibleChild(el);
        }}
        tabIndex="0"
        onKeyDown={props.onKeyDown}
        onClick={props.onClick}
        className={shareStyle.radioButton}
        {...radioButtonProps}>
        <input
          type="radio"
          id={props.inputId}
          name={'videoClippingOption'}
          checked={isItemSelected}
          onChange={() => props.setVideoClippingOption(props.videoClippingType)}
        />
        {isItemSelected ? <RadioButtonSelected /> : <RadioButton />}
        <label id={props.labelId} htmlFor={props.inputId}>
          <Text id={props.textId} />
        </label>
      </div>
      {props.children}
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
  isLive: state.engine.isLive,
  activePresetName: state.shell.activePresetName
});

const PLAYER_WIDTH_EMBED_DEFAULT = '560';
const PLAYER_HEIGHT_EMBED_DEFAULT = '395';

/**
 * convert time so it will be aligned with search frame rulings
 * @param {Number} time - time that needs to be cropped
 * @returns {Number} - time that has been cropped in multiples of 2
 */
const cropTimeForFrames = (time: Number) => {
  return Math.floor(time / 2) * 2;
};

/**
 * ShareOverlay component
 *
 * @class ShareOverlay
 * @extends {Component}
 */
@connect(mapStateToProps, bindActions(actions))
@withLogger(COMPONENT_NAME)
@withKeyboardA11y
@withText({clipTo: 'share.clip_to', clipSeekFrom: 'share.clip_seek_from'})
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
      startFromValue: Math.floor(this.props.player.currentTime),
      videoClippingOption: VIDEO_CLIPPING_OPTIONS.FULL_VIDEO,
      clipStartTimeValue: cropTimeForFrames(this.props.player.currentTime),
      clipOriginalStartTimeValue: Math.floor(this.props.player.currentTime),
      clipEndTimeValue: Math.floor(this.props.player.duration)
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
   * update url with params and values
   *
   * @param {string} url - the share url
   * @param {string} key - the param name
   * @param {string} value - the param value
   * @returns {string} - share url with the query parameters
   * @memberof ShareOverlay
   */
  _updateUrlParams(url: string, key: string, value: number): string {
    try {
      const urlObj = new URL(url);
      const searchParams = urlObj.searchParams;
      if (searchParams.has(key)) {
        searchParams.set(key, value);
      } else {
        searchParams.append(key, value);
      }
      return urlObj.toString();
    } catch (e) {
      this.props.logger.log(e);
      return '';
    }
  }

  /**
   * add seekFrom and clipTo query parameters to share url
   *
   * @param {string} url - the share url
   * @returns {string} - share url with the query parameters
   * @memberof ShareOverlay
   */
  _addKalturaClipParams(url: string): string {
    url = this._updateUrlParams(url, 'kalturaSeekFrom', cropTimeForFrames(this.state.clipStartTimeValue));
    url = this._updateUrlParams(url, 'kalturaClipTo', this.state.clipEndTimeValue);
    return this._updateUrlParams(url, 'kalturaStartTime', this.state.clipOriginalStartTimeValue % 2);
  }

  /**
   * add start time query parameter to share url
   *
   * @param {string} url - the share url
   * @returns {string} - share url with the query parameter
   * @memberof ShareOverlay
   */
  _addUrlKalturaStartTimeParam(url: string): string {
    return this._updateUrlParams(url, 'kalturaStartTime', this.state.startFromValue);
  }

  /**
   * get share url method
   *
   * @returns {string} - share url
   * @memberof ShareOverlay
   */
  getShareUrl(): string {
    const {shareUrl, entryId} = this.props.config;
    const shareUrlCorrectedForTemplate = shareUrl.replace(/{entryId}/g, entryId);
    return this._maybeAddParamsToUrl(shareUrlCorrectedForTemplate);
  }

  /**
   * adds query parameters to the share url
   *
   * @param {string} url - the share url
   * @returns {string} - the share url with query parameters
   * @memberof ShareOverlay
   */
  _maybeAddParamsToUrl(url: string): string {
    if (this.state.videoClippingOption === VIDEO_CLIPPING_OPTIONS.START_FROM) {
      url = this._addUrlKalturaStartTimeParam(url);
    } else if (this.state.videoClippingOption === VIDEO_CLIPPING_OPTIONS.CLIP) {
      url = this._addKalturaClipParams(url);
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
    url = this._maybeAddParamsToUrl(url);
    const {embedWidth, embedHeight} = this.props.config;
    const toReplace = {
      ['{embedUrl}']: url,
      ['{width}']: embedWidth || PLAYER_WIDTH_EMBED_DEFAULT,
      ['{height}']: embedHeight || PLAYER_HEIGHT_EMBED_DEFAULT
    };
    return template.replace(/{embedUrl}|{width}|{height}/g, matched => {
      return toReplace[matched];
    });
  }

  /**
   * video clipping option radio button change handler.
   * saves the new option value in internal component state
   *
   * @param {string} option - the video clipping option to set
   * @returns {void}
   * @memberof ShareOverlay
   */
  _onVideoClippingOptionChange = (option: string): void => {
    this.setState({videoClippingOption: option});
  };

  /**
   * start from input change handler.
   * converts to second and save the new value in internal component state
   *
   * @param {string} value - input change event
   * @returns {void}
   * @memberof ShareOverlay
   */
  _handleStartFromChange = (value: string): void => {
    this.setState({startFromValue: this._convertTimeValue(value)});
  };

  /**
   * clip start time input change handler.
   * sets clipStartTimeValue state with new value
   *
   * @param {string} value - the value of the clip start time
   * @returns {void}
   * @memberof ShareOverlay
   */
  _handleClipStartTimeChange = (value: string): void => {
    const newTime = cropTimeForFrames(this._convertTimeValue(value));
    this.setState({clipStartTimeValue: newTime, clipOriginalStartTimeValue: this._convertTimeValue(value)});
  };

  /**
   * clip end time input change handler.
   * sets clipEndTimeValue state with new value
   *
   * @param {string} value - the value of the clip end time
   * @returns {void}
   * @memberof ShareOverlay
   */
  _handleClipEndTimeChange = (value: string): void => {
    this.setState({clipEndTimeValue: this._convertTimeValue(value)});
  };

  /**
   * converts the new time value method
   *
   * @param {string} value - the time value to convert
   * @returns {*} - the converted time
   * @memberof ShareOverlay
   */
  _convertTimeValue = (value: string): any => {
    let seconds = toSecondsFromHHMMSS(value);
    return seconds >= this.props.player.duration ? this.props.player.duration : seconds;
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
      const shareUrl = this.getShareUrl();
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
          videoClippingOption={this.state.videoClippingOption}
          socialName={socialName}
          videoDesc={this.props.videoDesc}
          config={shareButtonConfig}
          addAccessibleChild={this.props.addAccessibleChild}
          updateShareOverlay={this._updateOverlay}
          player={this.props.player}
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
        <div className={shareStyle.header}>{<Text id="share.title" />}</div>
        <div className={shareStyle.shareMainContainer}>
          <div className={shareStyle.shareIcons}>{this._createShareOptions(this.props.config.shareOptions)}</div>
          <div className={shareStyle.linkOptionsContainer}>
            <ShareUrl
              player={this.props.player}
              addAccessibleChild={this.props.addAccessibleChild}
              shareUrl={this.getShareUrl()}
              copy={true}
              isIos={this.isIos}
              videoClippingOption={this.state.videoClippingOption}
            />
            {this._renderVideoClippingOptions()}
          </div>
        </div>
      </div>
    );
  }

  /**
   * renders the video clipping options element
   *
   * @returns {React$Element} - video clipping options element
   * @memberof ShareOverlay
   */
  _renderVideoClippingOptions(): React$Element<any> {
    return (this.props.config.enableTimeOffset || this.props.config.enableClipping) &&
      !this.props.isLive &&
      this.props.activePresetName !== ReservedPresetNames.MiniAudioUI ? (
      <VideoStartOptions
        addAccessibleChild={this.props.addAccessibleChild}
        startFromValue={this.state.startFromValue}
        handleStartFromChange={this._handleStartFromChange}
        videoHasHours={this.props.player.duration >= 3600}
        config={this.props.config}
        videoClippingOption={this.state.videoClippingOption}
        setVideoClippingOption={this._onVideoClippingOptionChange}
        clipStartTimeValue={this.state.clipOriginalStartTimeValue}
        handleClipStartTimeChange={this._handleClipStartTimeChange}
        handleClipEndTimeChange={this._handleClipEndTimeChange}
        clipEndTimeValue={this.state.clipEndTimeValue}
        shareClipLabels={{clipTo: this.props.clipTo, clipSeekFrom: this.props.clipSeekFrom}}
      />
    ) : undefined;
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
          <ShareUrl
            player={this.props.player}
            addAccessibleChild={this.props.addAccessibleChild}
            shareUrl={props.shareUrl}
            videoClippingOption={this.state.videoClippingOption}
            copy={true}
            isIos={this.isIos}
          />
          {this._renderVideoClippingOptions()}
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
