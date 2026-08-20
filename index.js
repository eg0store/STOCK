const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  Partials,
} = require("discord.js");
const config = require("./config");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel],
});

client.once("ready", () => {
  console.log(`✅ البوت شغال دلوقتي باسم: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  // لازم الرسالة تبدأ بكلمة "متوفر"
  const match = message.content.trim().match(/^متوفر\s+(\d+)/);
  if (!match) return;

  const quantity = match[1];

  // تحقق من الصلاحية (لو حاططين رولات مسموحة)
  if (config.ALLOWED_ROLE_IDS.length > 0) {
    const member = message.member;
    const hasPermission = member.roles.cache.some((r) =>
      config.ALLOWED_ROLE_IDS.includes(r.id)
    );
    if (!hasPermission) return;
  }

  // امسح رسالة المستخدم
  try {
    await message.delete();
  } catch (err) {
    console.error("مقدرش أمسح الرسالة:", err.message);
  }

  // جهّز الإيمبد
  const embed = new EmbedBuilder()
    .setColor(config.EMBED_COLOR)
    .setTitle("Stock")
    .setDescription(
      `**متوفر (${quantity}) ${config.PRODUCT_NAME}**\n\n` +
        `💵 **السعر :** ${config.PRICE}\n` +
        `🛒 **للشراء :** [اضغط هنا](${config.PURCHASE_LINK})`
    )
    .setImage(config.PRODUCT_IMAGE)
    .setFooter({ text: `اشتر الآن قبل نفاد الكمية - ${config.STORE_NAME}` });

  const ticketMention = config.TICKET_CHANNEL_ID.includes("PUT_")
    ? ""
    : `<#${config.TICKET_CHANNEL_ID}>`;

  await message.channel.send({
    content: ticketMention ? `🎫 للطلب: ${ticketMention}` : undefined,
    embeds: [embed],
  });
});

client.login(process.env.BOT_TOKEN);
