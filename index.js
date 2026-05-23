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
    // Step 1: Detect the language
    const detectResponse = await fetch('https://libretranslate.com/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, api_key: process.env.LIBRE_API_KEY })
    });
    const detectData = await detectResponse.json();
    const sourceLang = detectData[0]?.language || 'en';

    // Step 2: Translate
    const translateResponse = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        api_key: process.env.LIBRE_API_KEY
      })
    });
    const translateData = await translateResponse.json();
    const translated = translateData.translatedText;

    await message.reply(`${emoji} **Translation:** ${translated}`);
  } catch (err) {
    await message.reply('Sorry, something went wrong with the translation!');
  }
});

client.login(process.env.DISCORD_TOKEN);
