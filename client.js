const {ChatManager, TokenProvider} = require('@pusher/chatkit');
const {JSDOM} = require('jsdom');
const util = require('util');
const prompt = require('prompt');
const axios = require('axios')

const makeChatkitNodeCompatible = () => {
  const {window} = new JSDOM();
  global.window = window;
  global.navigator = {};
};

makeChatkitNodeCompatible();

const createUser = async username => {
    try{
        await axios.post('http://localhost:3001/users', {username});
    } catch ({message}) {
        throw new Error('Failed to create a user, ${message}');
    }
};


const main = async () => {
  try {
    prompt.start();
    prompt.message = '';
    const get = util.promisify(prompt.get);
    const usernameSchema = [
        {
            description: 'Enter your username',
            name: 'username',
            required: true,
        },
    ];

    const {username} = await get(usernameSchema);
    await createUser(username);
    const chatManager = new ChatManager({
           instanceLocator: 'v1:us1:973e9d53-6950-4a79-844c-52248ae4d756',
           userId: username,
           tokenProvider: new TokenProvider({url: 'http://localhost:3001/authenticate'}),
         });
        
         const currentUser = await chatManager.connect();
} catch (err) {
    console.log(`Failed with ${err}`);
    process.exit(1);
  }
}
main();