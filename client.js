const {ChatManager, TokenProvider} = require('@pusher/chatkit');
const {JSDOM} = require('jsdom');
const util = require('util');

const makeChatkitNodeCompatible = () => {
  const {window} = new JSDOM();
  global.window = window;
  global.navigator = {};
};

makeChatkitNodeCompatible();

const main = async () => {
  try {
    // TODO: We're going to create a command line chat client in here!
  } catch (err) {
    console.log(`Failed with ${err}`);
    process.exit(1);
  }
}
main();