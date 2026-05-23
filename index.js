const { Client, GatewayIntentBits, Events } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ]
});

const flagToLanguage = {
  '🇳🇱': 'nl', // Dutch
  '🇬🇧': 'en', // English
  '🇺🇸': 'en', // English
  '🇫🇷': 'fr', // French
  '🇩🇪': 'de', // German
  '🇪🇸': 'es', // Spanish
  '🇲🇽': 'es', // Spanish
  '🇮🇹': 'it', // Italian
  '🇵🇹': 'pt', // Portuguese
  '🇧🇷': 'pt', // Portuguese
  '🇷🇺': 'ru', // Russian
  '🇯🇵': 'ja', // Japanese
  '🇨🇳': 'zh', // Chinese
  '🇰🇷': 'ko', // Korean
  '🇸🇦': 'ar', // Arabic
  '🇹🇷': 'tr', // Turkish
  '🇮🇳': 'hi', // Hindi
  '🇵🇱': 'pl', // Polish
  '🇸🇪': 'sv', // Swedish
  '🇳🇴': 'no', // Norwegian
  '🇩🇰': 'da', // Danish
  '🇫🇮': 'fi', // Finnish
  '🇬🇷': 'el', // Greek
  '🇨🇿': 'cs', // Czech
  '🇷🇴': 'ro', // Romanian
  '🇭🇺': 'hu', // Hungarian
  '🇺🇦': 'uk', // Ukrainian
  '🇮🇱': 'he', // Hebrew
  '🇹🇭': 'th', // Thai
  '🇻🇳': 'vi', // Vietnamese
  '🇮🇩': 'id', // Indonesian
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;

  const emoji = reaction.emoji.name;
  const targetLang = flagToLanguage[emoji];
  if (!targetLang) return;

  if (reaction.partial) {
    try { await reaction.fetch(); } catch { return; }
  }

  const message = reaction.message.partial
    ? await reaction.message.fetch()
    : reaction.message;

  const text = message.content;
  if (!text) return;

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`
    );
    const data = await response.json();
    const translated = data.responseData.translatedText;
    await message.reply(`${emoji} **Translation:** ${translated}`);
  } catch (err) {
    await message.reply('Sorry, something went wrong with the translation!');
  }
});

client.login(process.env.DISCORD_TOKEN);
