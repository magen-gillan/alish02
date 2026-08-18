# alish02 — Avatar Observatory

موقع ويب تجريبي يعرض مجموعة من الافتارات ثلاثية الأبعاد بأسلوب Observatory Noir. يضم المشروع ثلاثة افتارات إجرائية خفيفة مبنية داخل Three.js، مع تبديل فوري من لوحة الإعدادات وحفظ الاختيار في `localStorage`. صُممت الأصول الإجرائية داخل المشروع لتجنب الاعتماد على ملفات VRM كبيرة أو روابط خارجية قد تنكسر على GitHub Pages.

## التقنية والمرجع المفتوح المصدر

يستخدم المشروع React Three Fiber كطبقة React لـ Three.js، وهي مكتبة مرخصة تحت MIT [1]، ويترك مسار التوسع إلى VRM مفتوحًا عبر `@pixiv/three-vrm` المرخصة تحت MIT [2]. تمت مراجعة CharacterStudio كمرجع معماري لفصل محرك الشخصية عن حزم الأصول، وهو مشروع MIT [3]. كما تمت مراجعة Open Source Avatars كفهرس لاكتشاف أصول VRM/glTF ذات التراخيص الواضحة، مع التنبيه إلى أن ترخيص كل أصل يجب فحصه منفردًا [4]. لم تُنسخ شيفرة هذه المشاريع أو أصولها في هذا الإصدار.

## التشغيل المحلي

```bash
pnpm install
pnpm dev
```

لبناء نسخة الإنتاج:

```bash
pnpm build
```

يفترض الأمر السابق إخراج الموقع في `dist/public`، وهو المجلد الذي يستخدمه Workflow الخاص بـ GitHub Pages.

## GitHub Pages

يحتوي `.github/workflows/deploy-pages.yml` على Workflow يُشغّل عند الدفع إلى `main` أو يدويًا من تبويب Actions. بعد إنشاء المستودع، فعّل GitHub Pages من **Settings → Pages → Source: GitHub Actions**. يستخدم `vite.config.ts` المسار `/alish02/` داخل Actions حتى تعمل الأصول عند النشر في مستودع Project Pages.

## الافتارات والإعدادات

الشخصيات الحالية هي Nova وSora وAtlas. يغيّر اختيار الشخصية المجسم واللون والإشارة والوصف في المسرح واللوحة الجانبية، ويُحفظ الاختيار محليًا. خيار Ambient movement يتحكم في الدوران والحركة الهادئة ويحترم `prefers-reduced-motion`.

## المراجع

[1]: https://github.com/pmndrs/react-three-fiber "pmndrs/react-three-fiber — MIT"
[2]: https://github.com/pixiv/three-vrm "pixiv/three-vrm — MIT"
[3]: https://github.com/M3-org/CharacterStudio "M3-org/CharacterStudio — MIT"
[4]: https://opensourceavatars.com/ "Open Source Avatars — VRM/glTF collection and license notes"

## حزم النماذج من Avatar

أضيف معرض مستقل يربط أربع حزم صور من المستودع العام [`magen-gillan/Avatar`](https://github.com/magen-gillan/Avatar): Aqua وDarkness وWiz وMegumin. لم يظهر ملف ترخيص معروف في بيانات GitHub للمستودع، لذلك بقيت الأصول مراجع بعيدة منسوبة للنموذج الأولي ولم تُنسخ إلى حزمة الإنتاج. يجب الحصول على إذن صريح أو استبدالها بأصول مرخصة قبل أي إصدار تجاري.

المسرح الحالي يستمر في عرض شخصيات ثلاثية الأبعاد إجرائية خفيفة. حزم Avatar هي مراجع بصرية قابلة للتبديل ومحفوظة محليًا عبر `alish02-model`، وليست نماذج VRM أو Live2D runtime بعد.
