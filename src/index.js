// @flow
import {registerPlugin} from 'kaltura-player-js';
import {Share as Plugin, pluginName} from './share';
import {Share} from './components/share/share';
declare var __VERSION__: string;
declare var __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export {VERSION, NAME};
export {Plugin};
export {Share};

registerPlugin(pluginName, Plugin);
