# انتشار روی GitHub Pages و اتصال دامنه

- ریپازیتوری: **https://github.com/Kaydarap/KaydarapCodm**
- میزبانی: **GitHub Pages** (رایگان، HTTPS خودکار)
- دامنه: **https://www.kaydarap.com**

سایت را **GitHub Actions خودش build می‌کند** (`.github/workflows/deploy.yml`). فقط کد منبع را آپلود کنید؛ پوشه `dist` یا فایل خروجی جداگانه لازم نیست.

## ۱. آپلود دستی فایل‌ها

1. فایل ZIP را استخراج کنید.
2. در https://github.com/Kaydarap/KaydarapCodm روی **Add file → Upload files** بزنید.
3. **محتویات** پوشه استخراج‌شده (نه خود پوشه) را با هم بکشید و رها کنید: پوشه‌های `.github`، `docs`، `public`، `scripts` و `src` و فایل‌های `package.json`، `package-lock.json` و بقیه.
4. پیام commit را بنویسید (مثلاً `KAYDARAP site v1`)، گزینه **Commit directly to the main branch** را انتخاب و **Commit changes** را بزنید.
5. **بررسی کنید پوشه `.github` آپلود شده باشد.** در صفحه اصلی ریپو باید پوشه `.github/workflows` با دو فایل `deploy.yml` و `pr-check.yml` دیده شود.
   ویندوز فایل‌ها و پوشه‌های نقطه‌دار را گاهی مخفی نشان می‌دهد. اگر `.github` آپلود نشد:
   **Add file → Create new file** → در کادر نام بنویسید `.github/workflows/deploy.yml` → محتوای همان فایل از ZIP را paste کنید → Commit. همین کار را برای `pr-check.yml` تکرار کنید.
   فایل‌های `.gitignore` و `.env.example` را هم به همین شکل چک کنید.

> شاخه پیش‌فرض ریپو باید `main` باشد (Settings → General → Default branch).

## ۲. فعال کردن GitHub Pages

1. **Settings → Pages → Build and deployment → Source** را روی **GitHub Actions** بگذارید.
2. به تب **Actions** بروید. workflow **Deploy** باید اجرا شود (اگر اجرا نشد، روی Deploy بزنید → **Run workflow**).
3. بعد از تیک سبز، سایت در آدرسی که Pages نشان می‌دهد در دسترس است.

از این به بعد هر commit روی `main` (آپلود دستی، ویرایش در GitHub یا ذخیره از پنل `/admin`) سایت را خودکار دوباره منتشر می‌کند.

**پیش‌نمایش قبل از انتشار:** اگر تغییرات را در شاخه جدا و با Pull Request بفرستید، workflow «PR check» سایت را build و بررسی می‌کند و خروجی را به‌صورت فایل `site-preview` در صفحه همان اجرا قرار می‌دهد.

## ۳. دامنه اختصاصی

1. **Settings → Pages → Custom domain** مقدار `www.kaydarap.com` را وارد و **Save** کنید. فایل `public/CNAME` هم همین مقدار را دارد.
2. (توصیه‌شده) در **تنظیمات حساب** GitHub بروید به **Settings → Pages → Add a domain** و `kaydarap.com` را تأیید کنید. GitHub یک رکورد TXT با نام `_github-pages-challenge-Kaydarap` و یک مقدار مخصوص می‌دهد که باید در DNS ثبت شود.
3. در پنل DNS دامنه این رکوردها را ثبت کنید (مقادیر رسمی GitHub Pages):

| نوع | نام (Host) | مقدار |
|---|---|---|
| CNAME | `www` | `kaydarap.github.io` |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

- رکوردهای قبلی روی `@` و `www` (مثلاً صفحه پارک دامنه) را حذف کنید.
- اگر DNS روی Cloudflare است، این رکوردها را روی **DNS only** (ابر خاکستری) بگذارید.
- با این تنظیم، `kaydarap.com` خودکار به `https://www.kaydarap.com` هدایت می‌شود.

4. وقتی بررسی DNS در صفحه Pages سبز شد (از چند دقیقه تا ۲۴ ساعت)، تیک **Enforce HTTPS** را بزنید.

## ۴. بررسی نهایی

- `https://www.kaydarap.com/` → صفحه انتخاب زبان
- `https://kaydarap.com/` → هدایت به `https://www.kaydarap.com/`
- `https://www.kaydarap.com/fa/rules/android/` → بارگذاری مستقیم صفحه داخلی
- `https://www.kaydarap.com/en/xyz` → صفحه ۴۰۴
- `https://www.kaydarap.com/admin/` → صفحه ورود مدیریت

## ۵. پنل مدیریت

`public/admin/config.yml` برای ریپوی `Kaydarap/KaydarapCodm` تنظیم شده است. روش ورود در [CONTENT.md](CONTENT.md) آمده است.
