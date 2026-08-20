# بوت إعلانات المتجر (Nitro Stock Bot)

بوت بسيط: تكتب في أي روم `متوفر 5` (أو أي رقم)، البوت يمسح رسالتك فورًا ويبعت بدالها **إيمبد احترافي** فيه اسم المنتج، السعر، رابط الشراء، وصورة، مع منشن لروم التذاكر.

---

## 1) إعداد البوت من Discord Developer Portal

1. روح على https://discord.com/developers/applications
2. اعمل **New Application** واختار اسم.
3. من تبويب **Bot** اعمل **Add Bot**.
4. فعّل الخيارات دي تحت "Privileged Gateway Intents":
   - MESSAGE CONTENT INTENT ✅
   - SERVER MEMBERS INTENT ✅
5. من نفس الصفحة، اعمل **Reset Token** وانسخ التوكن (هتحطه بعدين في `.env`).
6. من تبويب **OAuth2 → URL Generator**:
   - Scopes: `bot`
   - Permissions: `Send Messages`, `Manage Messages`, `Embed Links`, `Read Message History`
   - افتح الرابط اللي هيتولد وضيف البوت لسيرفرك.

## 2) تعديل الإعدادات

افتح ملف `config.js` وعدّل:
- `PRODUCT_NAME` - اسم المنتج
- `PRICE` - السعر
- `PURCHASE_LINK` - رابط الشراء أو التكت
- `PRODUCT_IMAGE` - رابط صورة المنتج
- `TICKET_CHANNEL_ID` - آيدي روم التذاكر (فعّل Developer Mode من ديسكورد وسيب كليك يمين على الروم → Copy Channel ID)
- `ALLOWED_ROLE_IDS` - آيدي رول الإدارة المسموح لهم يستخدموا الأمر

## 3) التشغيل على جهازك (تجربة محلية)

```bash
npm install
cp .env.example .env
# افتح .env وحط التوكن بتاعك
npm start
```

## 4) الرفع على Railway (استضافة سحابية 24/7)

1. اعمل حساب على https://railway.app وربطه بحساب GitHub بتاعك.
2. ارفع الفولدر ده على مستودع (repository) جديد في GitHub.
3. في Railway: **New Project → Deploy from GitHub repo** واختار المستودع.
4. من تبويب **Variables** ضيف متغير:
   - `BOT_TOKEN` = التوكن بتاع البوت
5. Railway هيتعرف تلقائيًا إن ده مشروع Node.js وهيشغله بأمر `npm start`.
6. بعد ما يخلص Deploy، البوت هيبقى شغال 24 ساعة.

> ملاحظة: نفس الخطوات تقريبًا تنفع مع Render، بس هتختار **Web Service** أو **Background Worker** وتحط نفس الـ Environment Variable.

## 5) طريقة الاستخدام

في أي روم البوت عنده صلاحية فيها، اكتب:

```
متوفر 5
```

البوت هيمسح الرسالة فورًا ويبعت الإعلان بدالها بشكل إيمبد جاهز.
