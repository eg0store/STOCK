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

// كلمات تعتبر "الكمية خلصت"
const SOLD_OUT_WORDS = ["نفذت", "نفدت", "خلصت", "خلصت الكمية", "نفذت الكمية"];

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const content = message.content.trim();

  const stockMatch = content.match(/^متوفر\s+(\d+)/);
  const isSoldOut = SOLD_OUT_WORDS.includes(content);

  if (!stockMatch && !isSoldOut) return;

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

  const ticketMention = config.TICKET_CHANNEL_ID.includes("PUT_")
    ? ""
    : `<#${config.TICKET_CHANNEL_ID}>`;

  if (isSoldOut) {
    // إيمبد "الكمية خلصت"
    const soldOutEmbed = new EmbedBuilder()
      .setColor("#E74C3C")
      .setTitle("Stock")
      .setDescription(
        `**❌ نفذت الكمية من ${config.PRODUCT_NAME}**\n\n` +
          `تابعنا عشان تعرف أول ما نوفر كميات`
      )
      .setFooter({ text: config.STORE_NAME });

    await message.channel.send({ embeds: [soldOutEmbed] });
    return;
  }

  // إيمبد المتوفر
  const quantity = stockMatch[1];
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

  await message.channel.send({
    content: ticketMention ? `🎫 للطلب: ${ticketMention}` : undefined,
    embeds: [embed],
  });
});

client.login(process.env.BOT_TOKEN);
