// @flow
/**
 * @jsx h
 * @ignore
 */
import {ui} from '@playkit-js/kaltura-player-js';
const {preact} = ui;
const {h} = preact;

/**
 * The radio button of video start options
 * @returns {React$Element<any>} the radio button element
 */
export const RadioButton = (): React$Element<any> => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
      <circle cx="9.5" cy="9.89948" r="8.5" fill="black" stroke="#666666" />
    </svg>
  );
};

/**
 * The selected radio button of video start options
 * @returns {React$Element<any>} the selected radio button element
 */
export const RadioButtonSelected = (): React$Element<any> => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
      <circle cx="9.5" cy="9.89948" r="6" fill="white" stroke="#006EFA" strokeWidth="6" />
    </svg>
  );
};
