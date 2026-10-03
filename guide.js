/* ============================================================
   AppNest Store — Smart Guide ("נסטי")
   A no-key, fully offline helper: understands what the visitor
   writes (5 languages), suggests matching apps, jumps to apps or
   categories, switches language, installs the store.
   Relies on the store's globals: APPS, TApp, curLang, openAppById,
   filterCat, setLang, renderApps.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- UI strings ---------- */
  var UI = {
    he: { btn: 'עזרה במציאת אפליקציה', title: 'נסטי · המדריך של AppNest', ph: 'מה אתה מחפש? למשל: משחק קלפים עם חברים',
      hello: 'היי! 👋 אני נסטי. ספר לי במילים שלך מה אתה מחפש, ואמצא לך את האפליקציה המתאימה.',
      found: 'מצאתי לך:', none: 'לא מצאתי בדיוק את זה 🤔 נסה לנסח אחרת, או בחר אחד מהנושאים:',
      showAll: 'הצג את כל התוצאות בחנות', open: 'פתח', cat: 'עברתי לקטגוריה', langDone: 'החלפתי שפה ✓',
      install: 'כדי להתקין את החנות: לחץ על "התקן את AppNest" למטה, או בתפריט הדפדפן ← "הוספה למסך הבית".',
      about: 'AppNest היא חנות של אפליקציות ומשחקים חינמיים — בלי פרסומות, בלי תשלום, ב-5 שפות. כל אפליקציה נשמרת על המכשיר שלך.',
      contact: 'אפשר לכתוב לנו ל-appnest55@gmail.com — נשמח לשמוע!', thanks: 'בכיף! 😊 עוד משהו?', send: 'שלח' },
    en: { btn: 'Help me find an app', title: 'Nesty · AppNest guide', ph: 'What are you looking for? e.g. card game with friends',
      hello: "Hi! 👋 I'm Nesty. Tell me in your own words what you're looking for and I'll find the right app.",
      found: 'Here is what I found:', none: "I couldn't find exactly that 🤔 Try other words, or pick a topic:",
      showAll: 'Show all results in the store', open: 'Open', cat: 'Switched to category', langDone: 'Language changed ✓',
      install: 'To install the store: tap "Install AppNest" below, or in the browser menu → "Add to Home screen".',
      about: 'AppNest is a store of free apps and games — no ads, no payments, in 5 languages. Every app keeps your data on your device.',
      contact: 'Write to us at appnest55@gmail.com — we would love to hear from you!', thanks: 'Anytime! 😊 Anything else?', send: 'Send' },
    ru: { btn: 'Помочь найти', title: 'Нести · гид AppNest', ph: 'Что вы ищете? Например: карточная игра с друзьями',
      hello: 'Привет! 👋 Я Нести. Опишите своими словами, что вы ищете, и я найду приложение.',
      found: 'Вот что я нашёл:', none: 'Не нашёл точно 🤔 Попробуйте иначе или выберите тему:',
      showAll: 'Показать все результаты', open: 'Открыть', cat: 'Категория', langDone: 'Язык изменён ✓',
      install: 'Чтобы установить: нажмите «Установить AppNest» внизу или меню браузера → «Добавить на главный экран».',
      about: 'AppNest — бесплатные приложения и игры без рекламы, на 5 языках.', contact: 'Пишите нам: appnest55@gmail.com', thanks: 'Пожалуйста! 😊', send: 'OK' },
    es: { btn: 'Ayúdame a encontrar', title: 'Nesty · guía de AppNest', ph: '¿Qué buscas? Ej: juego de cartas con amigos',
      hello: '¡Hola! 👋 Soy Nesty. Dime con tus palabras qué buscas y te encuentro la app.',
      found: 'Esto es lo que encontré:', none: 'No encontré exactamente eso 🤔 Prueba otras palabras o elige un tema:',
      showAll: 'Ver todos los resultados', open: 'Abrir', cat: 'Categoría', langDone: 'Idioma cambiado ✓',
      install: 'Para instalar: pulsa «Instalar AppNest» abajo o menú del navegador → «Añadir a pantalla de inicio».',
      about: 'AppNest es una tienda de apps y juegos gratis, sin anuncios, en 5 idiomas.', contact: 'Escríbenos: appnest55@gmail.com', thanks: '¡De nada! 😊', send: 'OK' },
    ar: { btn: 'ساعدني في الإيجاد', title: 'نستي · دليل AppNest', ph: 'ماذا تبحث؟ مثلاً: لعبة ورق مع الأصدقاء',
      hello: 'مرحباً! 👋 أنا نستي. أخبرني بكلماتك عمّا تبحث وسأجد التطبيق المناسب.',
      found: 'هذا ما وجدته:', none: 'لم أجد ذلك بالضبط 🤔 جرّب كلمات أخرى أو اختر موضوعاً:',
      showAll: 'عرض كل النتائج', open: 'افتح', cat: 'الفئة', langDone: 'تم تغيير اللغة ✓',
      install: 'للتثبيت: اضغط «ثبّت AppNest» في الأسفل أو قائمة المتصفح ← «إضافة إلى الشاشة الرئيسية».',
      about: 'AppNest متجر تطبيقات وألعاب مجانية بلا إعلانات وبخمس لغات.', contact: 'راسلنا: appnest55@gmail.com', thanks: 'بكل سرور! 😊', send: 'OK' }
  };

  /* ---------- topics: keywords (all languages, lower-case) -> apps ---------- */
  var TOPICS = [
    { id: 'cards', chip: { he: '🃏 משחקי קלפים', en: '🃏 Card games', ru: '🃏 Карты', es: '🃏 Cartas', ar: '🃏 ورق' },
      k: ['קלף', 'קלפים', 'יניב', 'רמי', 'ג׳ין', "ג'ין", 'פוקר', 'בלאק', 'card', 'cards', 'yaniv', 'rummy', 'gin', 'poker', 'blackjack', 'карт', 'покер', 'carta', 'cartas', 'póker', 'ورق', 'بوكر'],
      apps: ['yanivnest', 'rummynest', 'poker3d', 'appnest-casino'] },
    { id: 'board', chip: { he: '🎲 משחקי לוח', en: '🎲 Board games', ru: '🎲 Настольные', es: '🎲 De mesa', ar: '🎲 ألعاب لوحية' },
      k: ['שש', 'בש', 'שש-בש', 'ששבש', 'דמקה', 'שחמט', 'לוח', 'אסטרטגיה', 'דגל', 'backgammon', 'checkers', 'chess', 'board', 'strategy', 'flag', 'нарды', 'шашки', 'damas', 'backgammon', 'طاولة', 'داما'],
      apps: ['tavlanest', 'flagnest', 'mindcol'] },
    { id: 'friends', chip: { he: '👥 לשחק עם חברים', en: '👥 Play with friends', ru: '👥 С друзьями', es: '👥 Con amigos', ar: '👥 مع الأصدقاء' },
      k: ['חבר', 'חברים', 'ביחד', 'אונליין', 'מרובה', 'משתתפים', 'מסיבה', 'קולי', 'שיחה', 'friend', 'friends', 'online', 'multiplayer', 'party', 'together', 'voice', 'друз', 'онлайн', 'amigo', 'amigos', 'fiesta', 'أصدقاء', 'صديق'],
      apps: ['tavlanest', 'yanivnest', 'rummynest', 'partynest', 'starcoop'] },
    { id: 'games', chip: { he: '🎮 משחקים', en: '🎮 Games', ru: '🎮 Игры', es: '🎮 Juegos', ar: '🎮 ألعاب' },
      k: ['משחק', 'משחקים', 'לשחק', 'כיף', 'ארקייד', 'תלת', 'game', 'games', 'play', 'fun', 'arcade', 'игр', 'juego', 'juegos', 'jugar', 'لعبة', 'ألعاب'],
      cat: 'game' },
    { id: 'learn', chip: { he: '📚 ללמוד משהו', en: '📚 Learn something', ru: '📚 Учиться', es: '📚 Aprender', ar: '📚 تعلّم' },
      k: ['ללמוד', 'לימוד', 'למידה', 'ילדים', 'ילד', 'חינוך', 'מורה', 'בית ספר', 'שיעור', 'learn', 'learning', 'kids', 'school', 'teacher', 'lesson', 'education', 'учить', 'дети', 'aprender', 'niños', 'escuela', 'تعلم', 'أطفال'],
      cat: 'edu' },
    { id: 'language', chip: { he: '🗣️ שפות לטיול', en: '🗣️ Travel languages', ru: '🗣️ Языки', es: '🗣️ Idiomas', ar: '🗣️ لغات' },
      k: ['שפה', 'שפות', 'אנגלית', 'ספרדית', 'טיול', 'חו״ל', 'חול', 'תרגום', 'language', 'languages', 'english', 'travel', 'trip', 'язык', 'idioma', 'viaje', 'لغة', 'سفر'],
      apps: ['lingonest'] },
    { id: 'car', chip: { he: '🚗 לרכב', en: '🚗 For your car', ru: '🚗 Для авто', es: '🚗 Para el coche', ar: '🚗 للسيارة' },
      k: ['רכב', 'אוטו', 'מכונית', 'טסט', 'מוסך', 'קנייה', 'רישוי', 'מספר רישוי', 'obd', 'תקלה', 'car', 'vehicle', 'plate', 'garage', 'test', 'авто', 'машин', 'coche', 'vehículo', 'سيارة'],
      apps: ['bdk-app', 'vehicle-check', 'autoclear', 'autodiag-pro', 'obd-scanner-pro'] },
    { id: 'money', chip: { he: '💰 כסף ועבודה', en: '💰 Money & work', ru: '💰 Деньги', es: '💰 Dinero', ar: '💰 المال' },
      k: ['כסף', 'הוצאות', 'תקציב', 'משכורת', 'שכר', 'שעות', 'עבודה', 'משמרת', 'משמרות', 'money', 'expenses', 'budget', 'salary', 'work', 'hours', 'shift', 'деньги', 'расход', 'dinero', 'gastos', 'مال', 'مصاريف'],
      apps: ['moneynest', 'worknest'] },
    { id: 'health', chip: { he: '💪 כושר ותזונה', en: '💪 Fitness & food', ru: '💪 Фитнес', es: '💪 Fitness', ar: '💪 لياقة' },
      k: ['כושר', 'אימון', 'תרגיל', 'תרגילים', 'דיאטה', 'תזונה', 'קלוריות', 'אוכל', 'משקל', 'טאיצי', 'טאיצ׳י', 'גוף', 'fitness', 'gym', 'workout', 'diet', 'food', 'calories', 'weight', 'tai', 'body', 'фитнес', 'диета', 'dieta', 'ejercicio', 'رياضة', 'حمية'],
      apps: ['exercisesapp', 'plateai', 'taichi24', 'body-atlas'] },
    { id: 'music', chip: { he: '🎵 מוזיקה ושמע', en: '🎵 Music & audio', ru: '🎵 Музыка', es: '🎵 Música', ar: '🎵 موسيقى' },
      k: ['שיר', 'שירים', 'מוזיקה', 'הקלטה', 'להקליט', 'סאונד', 'שמע', 'סונו', 'די', 'dj', 'תמלול', 'song', 'music', 'record', 'audio', 'suno', 'transcribe', 'песн', 'музык', 'canción', 'música', 'أغنية', 'موسيقى'],
      apps: ['appnest-studio', 'sunoprep', 'timlulai'] },
    { id: 'files', chip: { he: '📄 קבצים ומסמכים', en: '📄 Files & documents', ru: '📄 Файлы', es: '📄 Archivos', ar: '📄 ملفات' },
      k: ['קובץ', 'קבצים', 'להמיר', 'המרה', 'סריקה', 'לסרוק', 'מסמך', 'מסמכים', 'pdf', 'וידאו', 'תמונה', 'file', 'files', 'convert', 'scan', 'document', 'video', 'image', 'файл', 'скан', 'archivo', 'escanear', 'ملف', 'مسح'],
      apps: ['convertnest', 'skannest', 'timlulai'] },
    { id: 'reminders', chip: { he: '📅 יומן ותזכורות', en: '📅 Diary & reminders', ru: '📅 Напоминания', es: '📅 Recordatorios', ar: '📅 تذكيرات' },
      k: ['תזכורת', 'תזכורות', 'יומן', 'לא לשכוח', 'שכחתי', 'משימות', 'עורך דין', 'מועדים', 'reminder', 'reminders', 'diary', 'calendar', 'tasks', 'lawyer', 'напомин', 'recordatorio', 'تذكير'],
      apps: ['lo-shachachti', 'lexcalendar', 'classnest'] },
    { id: 'mystic', chip: { he: '🔮 מיסטיקה', en: '🔮 Mystic', ru: '🔮 Мистика', es: '🔮 Místico', ar: '🔮 روحانيات' },
      k: ['טארוט', 'חלום', 'חלומות', 'מזל', 'הורוסקופ', 'נומרולוגיה', 'קפה', 'כף יד', 'tarot', 'dream', 'horoscope', 'numerology', 'fortune', 'таро', 'сон', 'sueño', 'تاروت', 'حلم'],
      apps: ['mysticnest'] },
    { id: 'luck', chip: { he: '🎱 לוטו וטוטו', en: '🎱 Lotto & Toto', ru: '🎱 Лото', es: '🎱 Lotería', ar: '🎱 يانصيب' },
      k: ['לוטו', 'טוטו', 'וינר', 'הגרלה', 'הימור', 'מניות', 'בורסה', 'lotto', 'lottery', 'toto', 'stocks', 'stock', 'лото', 'акци', 'lotería', 'acciones', 'يانصيب', 'أسهم'],
      apps: ['lotto', 'toto', 'stockai'] },
    { id: 'computer', chip: { he: '🖥️ מחשב ותקלות', en: '🖥️ Computer help', ru: '🖥️ Компьютер', es: '🖥️ Ordenador', ar: '🖥️ حاسوب' },
      k: ['מחשב', 'ווינדוס', 'windows', 'פקודות', 'קיצורים', 'מקלדת', 'תקלה', 'computer', 'pc', 'shortcuts', 'commands', 'компьютер', 'ordenador', 'حاسوب'],
      apps: ['pcguide'] },
    { id: 'outdoor', chip: { he: '🏕️ שטח והישרדות', en: '🏕️ Outdoors', ru: '🏕️ Природа', es: '🏕️ Aire libre', ar: '🏕️ خلاء' },
      k: ['שטח', 'צופים', 'הישרדות', 'קשרים', 'מדורה', 'ניווט', 'טבע', 'outdoor', 'survival', 'scout', 'camping', 'knots', 'выживан', 'supervivencia', 'نجاة'],
      apps: ['scout-guide'] },
    { id: 'funcam', chip: { he: '🩻 שעשוע ומצלמה', en: '🩻 Fun camera', ru: '🩻 Камера', es: '🩻 Cámara', ar: '🩻 كاميرا' },
      k: ['רנטגן', 'מצלמה', 'שלד', 'צחוק', 'מצחיק', 'xray', 'x-ray', 'camera', 'funny', 'рентген', 'cámara', 'أشعة'],
      apps: ['xray-camera'] }
  ];

  /* ---------- helpers ---------- */
  function L() { var c = (typeof curLang !== 'undefined' && curLang) || 'he'; return UI[c] ? c : 'en'; }
  function S(k) { return (UI[L()] || UI.en)[k] || UI.en[k]; }
  var HE_PREFIX = /^(ו|ה|ב|ל|מ|ש|כ|וה|וב|ול|שה|מה|לה|כש|וש)(?=[\u0590-\u05FF]{2,})/;
  function norm(t) { return String(t || '').toLowerCase().replace(/[׳']/g, "'").replace(/[^\p{L}\p{N}'\- ]/gu, ' ').replace(/\s+/g, ' ').trim(); }
  function words(t) {
    return norm(t).split(' ').filter(Boolean).reduce(function (a, w) { a.push(w); var s = w.replace(HE_PREFIX, ''); if (s !== w) a.push(s); return a; }, []);
  }
  function hit(ws, kw) {
    kw = norm(kw);
    if (kw.indexOf(' ') > -1) return ws.join(' ').indexOf(kw) > -1;
    for (var i = 0; i < ws.length; i++) {
      var w = ws[i];
      if (w === kw) return true;
      if (kw.length >= 3 && w.length >= 3 && (w.indexOf(kw) === 0 || kw.indexOf(w) === 0)) return true;
    }
    return false;
  }
  function appText(a) {
    var out = [];
    ['name', 'desc', 'tag', 'cat'].forEach(function (k) { if (a[k]) for (var l in a[k]) out.push(a[k][l]); });
    (a.features || []).forEach(function (f) { for (var l in f) if (l !== 'icon') out.push(f[l]); });
    return norm(out.join(' '));
  }
  function allApps() { try { return typeof APPS !== 'undefined' ? APPS : []; } catch (e) { return []; } }
  function byId(id) { return allApps().filter(function (a) { return a.id === id; })[0]; }

  /* ---------- understanding ---------- */
  function understand(q) {
    var ws = words(q), qn = norm(q);
    // commands
    var langs = { he: ['עברית', 'hebrew'], en: ['אנגלית', 'english', 'inglés'], ru: ['רוסית', 'russian', 'русский'], es: ['ספרדית', 'spanish', 'español'], ar: ['ערבית', 'arabic', 'عربية'] };
    var wantsLang = /(שפה|שפת|language|язык|idioma|لغة|תחליף|תעביר|תעבור|להחליף|לעבור|switch|change|cambia|переключ)/.test(qn) || ws.length <= 2;
    if (wantsLang) {
      for (var lc in langs) if (langs[lc].some(function (x) { return ws.some(function (w) { return w === x || w === 'ל' + x || w === 'ב' + x; }) || (qn.indexOf(x) > -1 && ws.length <= 4); })) return { type: 'lang', lang: lc };
    }
    if (/(להתקין|מתקינ|התקנ|התקן|install|установ|instalar|تثبيت|מסך הבית|home screen)/.test(qn) && /(חנות|אפליקצי|appnest|store|app|магазин|tienda|متجر|איך|how)/.test(qn)) return { type: 'install' };
    if (/(משוב|צור קשר|ליצור קשר|מייל|contact|feedback|email|связ|contacto|تواصل)/.test(qn)) return { type: 'contact' };
    if (/(מה זה appnest|מי אתם|מה זה החנות|what is appnest|about appnest|who are you)/.test(qn)) return { type: 'about' };
    if (/^(תודה|thanks|thank you|спасибо|gracias|شكرا)/.test(qn)) return { type: 'thanks' };

    // topic scoring
    var scores = {}, topCat = null, topCatScore = 0, topicHits = 0;
    TOPICS.forEach(function (t) {
      var n = t.k.filter(function (kw) { return hit(ws, kw); }).length;
      if (!n) return;
      topicHits += n;
      if (t.cat && n > topCatScore) { topCat = t.cat; topCatScore = n; }
      (t.apps || []).forEach(function (id, i) { scores[id] = (scores[id] || 0) + n * 10 - i; });
      if (t.cat) allApps().forEach(function (a) { if (a.category === t.cat) scores[a.id] = (scores[a.id] || 0) + n * 3; });
    });
    // free-text match over every app's names/descriptions (all languages)
    var STOP = ['רוצה','משהו','אפליקציה','אפליקציות','בשביל','שאני','אני','איך','something','app','apps','want','with','for','the','что','для','quiero','una','para','أريد'];
    var ftW = topicHits ? 1 : 4;
    allApps().forEach(function (a) {
      var txt = appText(a), n = 0;
      ws.forEach(function (w) { if (w.length >= 3 && STOP.indexOf(w) < 0 && txt.indexOf(w) > -1) n++; });
      if (n) scores[a.id] = (scores[a.id] || 0) + n * ftW;
    });
    var ranked = Object.keys(scores).filter(byId).sort(function (a, b) { return scores[b] - scores[a]; });
    return { type: 'apps', ids: ranked.slice(0, 5), cat: topCat && !ranked.length ? topCat : (topicHits ? topCat : null), q: q };
  }

  /* ---------- UI ---------- */
  var css = ''
    + '#ng-btn{position:fixed;bottom:18px;inset-inline-end:18px;z-index:9998;width:58px;height:58px;border-radius:50%;border:0;cursor:pointer;'
    + 'background:linear-gradient(135deg,#e8c068,#c9973a);color:#080808;font-size:28px;box-shadow:0 8px 26px rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center}'
    + '#ng-btn:active{transform:scale(.94)}'
    + '#ng-panel{position:fixed;bottom:88px;inset-inline-end:14px;z-index:9999;width:min(380px,calc(100vw - 28px));max-height:min(560px,calc(100vh - 120px));'
    + 'display:none;flex-direction:column;background:#0f0f12;border:1px solid #c9973a;border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.7);font-family:Heebo,system-ui,sans-serif;color:#eee}'
    + '#ng-panel.on{display:flex}'
    + '#ng-head{display:flex;align-items:center;gap:8px;padding:12px 14px;background:#151519;border-bottom:1px solid #2a2a32;font-weight:800;color:#e8c068}'
    + '#ng-head button{margin-inline-start:auto;background:none;border:0;color:#999;font-size:20px;cursor:pointer}'
    + '#ng-log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}'
    + '.ng-msg{max-width:88%;padding:9px 12px;border-radius:14px;line-height:1.55;font-size:14px;white-space:pre-wrap}'
    + '.ng-bot{background:#1b1b21;align-self:flex-start;border-start-start-radius:4px}'
    + '.ng-me{background:#c9973a;color:#080808;align-self:flex-end;border-start-end-radius:4px;font-weight:600}'
    + '.ng-apps{display:flex;flex-direction:column;gap:6px;align-self:stretch}'
    + '.ng-app{display:flex;align-items:center;gap:10px;background:#16161b;border:1px solid #2a2a32;border-radius:12px;padding:9px 10px;cursor:pointer;color:#eee;text-align:start;font:inherit}'
    + '.ng-app:hover{border-color:#c9973a}.ng-app .e{font-size:22px}.ng-app .t{flex:1;font-size:14px;font-weight:700}.ng-app .o{color:#e8c068;font-size:12px;font-weight:700}'
    + '.ng-chips{display:flex;flex-wrap:wrap;gap:6px}'
    + '.ng-chip{background:#1b1b21;border:1px solid #33333d;color:#ddd;border-radius:16px;padding:6px 11px;font:600 13px Heebo,system-ui,sans-serif;cursor:pointer}'
    + '.ng-chip:hover{border-color:#c9973a;color:#e8c068}'
    + '.ng-link{background:none;border:0;color:#e8c068;text-decoration:underline;cursor:pointer;font:600 13px inherit;align-self:flex-start;padding:2px 4px}'
    + '#ng-form{display:flex;gap:8px;padding:10px;border-top:1px solid #2a2a32;background:#121216}'
    + '#ng-in{flex:1;background:#1b1b21;border:1px solid #33333d;border-radius:12px;color:#eee;padding:10px 12px;font:14px Heebo,system-ui,sans-serif;outline:none}'
    + '#ng-in:focus{border-color:#c9973a}'
    + '#ng-send{background:#c9973a;border:0;border-radius:12px;color:#080808;font-weight:800;padding:0 14px;cursor:pointer}'
    + '#installBtn{inset-inline-start:18px!important;left:auto!important;transform:none!important}';

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  var log, input, panel, started = false;

  function say(text, who) { var m = el('div', 'ng-msg ' + (who === 'me' ? 'ng-me' : 'ng-bot'), text); log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
  function chips(list) {
    var box = el('div', 'ng-chips');
    list.forEach(function (t) { var c = el('button', 'ng-chip', t.chip[L()] || t.chip.en); c.onclick = function () { ask(t.chip[L()] || t.chip.en); }; box.appendChild(c); });
    log.appendChild(box); log.scrollTop = log.scrollHeight;
  }
  function appList(ids) {
    var box = el('div', 'ng-apps');
    ids.forEach(function (id) {
      var a = byId(id); if (!a) return;
      var b = el('button', 'ng-app');
      b.appendChild(el('span', 'e', a.emoji || '✦'));
      b.appendChild(el('span', 't', (typeof TApp === 'function' ? TApp(a, 'name') : a.name.en)));
      b.appendChild(el('span', 'o', S('open') + ' ›'));
      b.onclick = function () { panel.classList.remove('on'); if (typeof openAppById === 'function') openAppById(id); };
      box.appendChild(b);
    });
    log.appendChild(box); log.scrollTop = log.scrollHeight;
  }

  function ask(q) {
    q = String(q || '').trim(); if (!q) return;
    say(q, 'me');
    var r = understand(q);
    setTimeout(function () {
      if (r.type === 'lang') { if (typeof setLang === 'function') setLang(r.lang); refreshUI(); say(S('langDone')); return; }
      if (r.type === 'install') { say(S('install')); var ib = document.getElementById('installBtn'); if (ib && ib.style.display !== 'none') ib.click(); return; }
      if (r.type === 'contact') { say(S('contact')); return; }
      if (r.type === 'about') { say(S('about')); return; }
      if (r.type === 'thanks') { say(S('thanks')); return; }
      if (r.ids.length) {
        say(S('found')); appList(r.ids);
        var all = el('button', 'ng-link', S('showAll'));
        all.onclick = function () {
          panel.classList.remove('on');
          if (r.cat && typeof filterCat === 'function') { filterCat(r.cat); return; }
          var si = document.getElementById('searchInput');
          if (si) { si.value = q; if (typeof renderApps === 'function') renderApps(); var ap = document.getElementById('apps'); if (ap) ap.scrollIntoView({ behavior: 'smooth' }); }
        };
        log.appendChild(all);
      } else if (r.cat && typeof filterCat === 'function') {
        say(S('cat') + ' ✓'); panel.classList.remove('on'); filterCat(r.cat);
      } else {
        say(S('none')); chips(TOPICS.slice(0, 9));
      }
      log.scrollTop = log.scrollHeight;
    }, 180);
  }

  function refreshUI() {
    document.getElementById('ng-title').textContent = S('title');
    input.placeholder = S('ph');
    document.getElementById('ng-send').textContent = S('send');
    document.getElementById('ng-btn').title = S('btn');
    document.getElementById('ng-btn').setAttribute('aria-label', S('btn'));
  }

  function build() {
    var st = el('style'); st.textContent = css; document.head.appendChild(st);
    var btn = el('button'); btn.id = 'ng-btn'; btn.textContent = '🧭';
    panel = el('div'); panel.id = 'ng-panel'; panel.setAttribute('role', 'dialog');
    var head = el('div'); head.id = 'ng-head';
    head.appendChild(el('span', '', '🧭'));
    var tt = el('span'); tt.id = 'ng-title'; head.appendChild(tt);
    var x = el('button', '', '✕'); x.setAttribute('aria-label', 'close'); x.onclick = function () { panel.classList.remove('on'); }; head.appendChild(x);
    log = el('div'); log.id = 'ng-log';
    var form = el('form'); form.id = 'ng-form';
    input = el('input'); input.id = 'ng-in'; input.autocomplete = 'off';
    var send = el('button'); send.id = 'ng-send'; send.type = 'submit';
    form.appendChild(input); form.appendChild(send);
    form.onsubmit = function (e) { e.preventDefault(); var v = input.value; input.value = ''; ask(v); };
    panel.appendChild(head); panel.appendChild(log); panel.appendChild(form);
    document.body.appendChild(panel); document.body.appendChild(btn);
    btn.onclick = function () {
      var on = !panel.classList.contains('on');
      panel.classList.toggle('on', on);
      if (on && !started) { started = true; say(S('hello')); chips(TOPICS.slice(0, 9)); }
      if (on) setTimeout(function () { input.focus(); }, 50);
    };
    refreshUI();
    // keep labels in sync when the store language changes
    if (typeof window.setLang === 'function' && !window.setLang.__ng) {
      var orig = window.setLang;
      window.setLang = function () { var r = orig.apply(this, arguments); try { refreshUI(); } catch (e) {} return r; };
      window.setLang.__ng = true;
    }
  }

  window.AppNestGuide = { understand: understand, ask: function (q) { if (!panel.classList.contains('on')) document.getElementById('ng-btn').click(); ask(q); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
