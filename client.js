const {ChatManager, TokenProvider} = require('@pusher/chatkit');
const {JSDOM} = require('jsdom');
const util = require('util');
const prompt = require('prompt')

const makeChatkitNodeCompatible = () => {
  const {window} = new JSDOM();
  global.window = window;
  global.navigator = {};
};

makeChatkitNodeCompatible();

const main = async () => {
  try {
    prompt.start();
    prompt.message  = '';
    const get = util.promisify(prompt.get);
    const usernameSchema = [
        {
            description: 'Enter your username',
            name: 'username',
            required: true,
        };
    ];

    const {username} = await get(usernameSchema);
  } catch (err) {
    console.log(`Failed with ${err}`);
    process.exit(1);
  }
}
main();