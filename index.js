const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Aapka Bot Token aur Private Group Chat ID yahan set hai
const TELEGRAM_BOT_TOKEN = '9190163436:AAGq3d8bX1yZQx__V92WPXB083gboEfp-zw';
const TELEGRAM_CHAT_ID = '-1004430289455'; 

app.get('/', (req, res) => {
    res.send(`
        <html>
        <head><title>Guruvidhya Class Uploader</title></head>
        <body style="font-family: Arial; padding: 30px;">
            <h2>📚 Guruvidhya to Telegram Uploader</h2>
            <form action="/send-class" method="POST">
                <label>Class Title / Subject:</label><br>
                <input type="text" name="title" style="width: 300px; padding: 8px; margin-bottom: 10px;" required><br>
                
                <label>Video / Class Link:</label><br>
                <input type="text" name="link" style="width: 300px; padding: 8px; margin-bottom: 15px;" required><br>
                
                <button type="submit" style="background: green; color: white; padding: 10px 20px; border: none; cursor: pointer;">Send to Telegram</button>
            </form>
        </body>
        </html>
    `);
});

app.post('/send-class', async (req, res) => {
    const { title, link } = req.body;
    const message = `🚨 **Nai class live ho gayi hai!** 🚨\n\n📖 **Vishay:** ${title}\n🔗 **Dekhne ke liye click karein:** ${link}\n\n_Powered by Guruvidhya & Koyeb Edge Network_`;

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });
        res.send('<h3>✅ Class safaltapoorvak aapke Telegram Group par bhej di gayi hai! <a href="/">Wapas Jayein</a></h3>');
    } catch (error) {
        res.send('<h3>❌ Bhejane me kuch galti hui hai. Kripya bot ki admin permissions check karein.</h3>');
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
