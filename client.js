const {ChatManager, TokenProvider} = require('@pusher/chatkit');
const {JSDOM} = require('jsdom');
const util = require('util');

const makeChatkitNodeCompatible = () => {
  const {window} = new JSDOM();
  global.window = window;
  global.navigator = {};
};