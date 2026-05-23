const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!translate')) return;

  const args = message.content.slice('!translate'.length).trim().split(' ');
  const targetLang = args[0];
  const text = args.slice(1).join(' ');

  if (!targetLang || !text) {
    return message.reply('Usage: `!translate [language code] [text]`\nExample: `!translate es Hello everyone!`');
  }

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    );
    const data = await response.json();
    const translated = data.responseData.translatedText;
    message.reply(`🌐 **Translation (${targetLang}):** ${translated}`);
  } catch (err) {
    message.reply('Sorry, something went wrong with the translation!');
  }
});

client.login(process.env.DISCORD_TOKEN);
