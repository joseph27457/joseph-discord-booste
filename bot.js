const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const config = require('./config.json');
const User = require('./models/User');
const Code = require('./models/Code');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    mongoose.connect(config.mongoURI).then(() => console.log('✅ Connected to MongoDB'));
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.split(" ");
    const command = args[0];

    if (command === '!رصيدي') {
        let user = await User.findOne({ userId: message.author.id }) || new User({ userId: message.author.id, credit: 0 });
        await user.save();
        message.reply(`رصيدك الحالي هو: ${user.credit} كريدت`);
    }

    if (command === '!شحن') {
        const codeInput = args[1];
        if (!codeInput) return message.reply("يرجى كتابة الكود بعد الأمر.");
        const code = await Code.findOne({ code: codeInput });
        if (!code || code.used) return message.reply("هذا الكود غير صالح أو تم استخدامه.");

        let user = await User.findOne({ userId: message.author.id }) || new User({ userId: message.author.id, credit: 0 });
        user.credit += code.amount;
        code.used = true;
        await user.save();
        await code.save();
        message.reply(`تم شحن ${code.amount} كريدت إلى حسابك.`);
    }

    if (command === '!شراء') {
        const amount = parseInt(args[1]);
        if (!amount || isNaN(amount)) return message.reply("يرجى تحديد عدد الكريدت المطلوبة.");

        let user = await User.findOne({ userId: message.author.id });
        if (!user || user.credit < amount) return message.reply("لا يوجد لديك رصيد كافي.");

        user.credit -= amount;
        await user.save();
        message.reply(`✅ تم خصم ${amount} كريدت من حسابك. تم تنفيذ الخدمة.`);
    }
});

client.login(config.token);