# KAYDARAP

سایت سه‌زبانه (فارسی / English / العربية) کامیونیتی Call of Duty: Mobile؛ قوانین اوپن اپ Android و iOS، Champion Rules، اوپن‌ روم، پرسش‌های متداول و تنظیمات.

- دامنه نهایی: **https://www.kaydarap.com**
- فناوری: [Astro](https://astro.build) (سایت کاملاً استاتیک) + [Sveltia CMS](https://github.com/sveltia/sveltia-cms) برای مدیریت محتوا + GitHub Pages برای میزبانی
- بدون دیتابیس، بدون سرور، بدون هیچ رمز یا کلید داخل کد

> **چرا این معماری؟** همه امکانات درخواستی (قوانین تعاملی، پیشرفت، QR، جست‌وجو، اوپن‌ روم داده‌محور، مدیریت محتوا) بدون بک‌اند قابل ارائه‌اند.
> صفحات از قبل ساخته می‌شوند، پس سریع‌اند، رایگان میزبانی می‌شوند و لینک مستقیم هر صفحه کار می‌کند. ورود مدیر از طریق خود GitHub انجام می‌شود؛ فقط کسی که دسترسی نوشتن روی ریپازیتوری دارد می‌تواند محتوا را تغییر دهد.

---

## ساختار

```
src/
  data/                 ← محتوای قابل ویرایش (از طریق /admin)
    rules-android.json    قوانین Android (هر سه زبان، هر مرحله جدا)
    rules-ios.json        قوانین iOS
    faq.json              پرسش‌های متداول
    rooms.json            اوپن‌ روم‌ها و اطلاعیه‌ها (فعلاً خالی)
    home.json             متن و تصویر صفحه اصلی + بنر اطلاعیه
    settings.json         لینک Champion Rules، لینک برنامه‌ها، لینک تماس
  i18n/ui.js            ← متن‌های رابط کاربری (منو، دکمه، خطا، دسترس‌پذیری) در سه زبان
  pages/                ← مسیرها: /  /fa/  /en/  /ar/  …/rules/android/  …/rules/ios/  …/rooms/  …/faq/  …/settings/  404
  components/ layouts/ scripts/ styles/
public/
  admin/                ← پنل مدیریت (Sveltia CMS) و پیکربندی آن
  CNAME                 ← www.kaydarap.com
scripts/
  check-content.mjs     ← بررسی کامل بودن ترجمه‌ها و صحت لینک‌ها قبل از هر build
  make-images.mjs       ← ساخت favicon و تصویر پیش‌نمایش اشتراک‌گذاری (og.png)
docs/
  REFERENCE-MAP.md      ← جدول تطابق امکانات با سایت مرجع
  DEPLOY.md             ← راهنمای GitHub، انتشار و اتصال دامنه
  CONTENT.md            ← راهنمای مدیریت محتوا
```

## اجرای محلی

نیازمند Node.js 20.3 یا بالاتر.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # بررسی محتوا + ساخت نسخه نهایی در dist/
npm run preview    # نمایش نسخه ساخته‌شده
npm run check      # فقط بررسی محتوا و ترجمه‌ها
```

## مستندات

- [مدیریت محتوا](docs/CONTENT.md)
- [انتشار و دامنه](docs/DEPLOY.md)
- [تطابق با سایت مرجع](docs/REFERENCE-MAP.md)

## سلب مسئولیت

KAYDARAP یک کامیونیتی مستقل است و وابستگی رسمی به Activision یا Call of Duty: Mobile ندارد.
