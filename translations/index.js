import {core} from 'kaltura-player-js';
const {Utils} = core;
import ar from './ar.i18n.json';
import de from './de.i18n.json';
import en from './en.i18n.json';
import es from './es.i18n.json';
const translations = Utils.Object.mergeDeep({}, ar, de, en, es);
export {translations};
