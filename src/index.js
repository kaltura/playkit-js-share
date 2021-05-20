// @flow
import {registerPlugin} from 'kaltura-player-js';
import {Share, pluginName} from './share';

declare var __VERSION__: string;
declare var __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export {Share as Plugin};
export {VERSION, NAME};

registerPlugin(pluginName, Share);
