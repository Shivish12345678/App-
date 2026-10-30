const express = require('express');
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <h2>Guruvidhya Auto Forwarder is Live!</h2>
    <p>Userbot is running in the background and listening for classes.</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const apiId = parseInt(process.env.API_ID || '31084727');
const apiHash = process.env.API_HASH || '7e214b1c8f2d583856293f0975e465a6';
const stringSession = new StringSession(process.env.SESSION_STRING || '');

const SOURCE_CHAT_ID = -1003994160445; // Guruvidhya source group
const DEST_CHAT_ID = -1004430289455;   // Your private destination group

(async () => {
  console.log("Starting Telegram Userbot...");
  
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password (2FA): "),
    phoneCode: async () => await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  console.log("Userbot is successfully connected!");
  console.log("SESSION_STRING:", client.session.save());

  client.addEventHandler(async (event) => {
    const message = event.message;
    if (!message) return;

    if (message.peerId && message.peerId.channelId) {
      const chatId = Number("-100" + message.peerId.channelId.toString());
      
      if (chatId === SOURCE_CHAT_ID) {
        console.log("New class message detected from source group!");
        try {
          await client.sendMessage(DEST_CHAT_ID, {
            message: message.text || "New Class Notification",
            file: message.media || undefined,
          });
          console.log("Class successfully forwarded to your group!");
        } catch (err) {
          console.error("Error forwarding message:", err);
        }
      }
    }
  });

})();
