const {ChatManager, TokenProvider} = require('@pusher/chatkit');
const {JSDOM} = require('jsdom');
const util = require('util');
const prompt = require('prompt');
const axios = require('axios');
const readline = require('readline');
const ora = require('ora');

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
  const spinner = ora();
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
    spinner.start('Authenticating..');
    await createUser(username);
    spinner.succeed(`Authenticated as ${username}`);
    const chatManager = new ChatManager({
           instanceLocator: 'v1:us1:973e9d53-6950-4a79-844c-52248ae4d756',
           userId: username,
           tokenProvider: new TokenProvider({url: 'http://localhost:3001/authenticate'}),
         });
         spinner.start('Connecting to Pusher..');
         const currentUser = await chatManager.connect();
         spinner.succeed('Connected');
         spinner.start('Fetching rooms..');
         const joinableRooms = await currentUser.getJoinableRooms();
         spinner.succeed('Fetched rooms');
         const availableRooms = [...currentUser.rooms, ...joinableRooms];

         console.log('Available rooms:');
         availableRooms.forEach((room, index) => {
           console.log(`${index} - ${room.name}`);
         });

         const roomSchema = [{
            description: 'Select a room',
            name: 'room',
            conform: v => {
            if (v >= availableRooms.length) {
                return false
            }
                return true
            },
            message: 'Room must only be numbers',
            required: true
            }]
            
         const { room: chosenRoom } = await get(roomSchema)
         const room = availableRooms[chosenRoom]
         spinner.start(`Joining room ${chosenRoom}..`);
         await currentUser.subscribeToRoom({
            roomId: room.id,
            hooks: {
                onNewMessage: message => {
                    const { senderId, text } = message
                    if (senderId === username) return
                    console.log(`${senderId}: ${text}`)
                }
            },
            messageLimit: 0
         });
         spinner.succeed(`Joined ${room.name}`);
         console.log(`Joined ${room.name} successfully`);
         const input = readline.createInterface({input: process.stdin});

         input.on('line', async text => {
             await currentUser.sendMessage({roomId: room.id, text});
         });

} catch (err) {
    console.log(`Failed with ${err}`);
    process.exit(1);
  }
}
main();