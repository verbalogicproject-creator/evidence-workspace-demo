/* Demo-only presentation layer. Atlas still performs the source search. */
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  let lang = params.get('lang') === 'en' ? 'en' : 'he';
  const corpus = document.getElementById('demo-ribbon')?.dataset.corpus;
  const dictionary = {
    'Skip to workspace':'דלג לסביבת העבודה', 'Home':'בית', 'Ask':'שאלות', 'Explore':'מפה', 'Sources':'מקורות', 'Changes':'שינויים',
    'Knowledge with a trail.':'ידע עם עקבות.', 'Every record has a source.':'לכל רשומה יש מקור.',
    'OFFLINE SNAPSHOT':'תמונת מצב לא מקוונת', 'SOURCE SNAPSHOT':'תמונת מקורות', 'SOURCE-BOUND':'קשור למקור',
    'How to explore':'איך חוקרים', 'Switch to light theme':'מעבר לעיצוב בהיר', 'Switch to dark theme':'מעבר לעיצוב כהה',
    'A MAP, WITH THE EVIDENCE ATTACHED':'מפה עם המקורות לצדה', 'Find the context.':'מצאו את ההקשר.', 'Follow the source.':'עקבו אחר המקור.',
    'Explore your documentation and code as a connected workspace. Inspect what is known, see where it comes from, and notice what is missing.':'חקרו מסמכים וקוד כסביבת עבודה מקושרת. בדקו מה נמצא, מאיפה הגיע ומה עדיין חסר.',
    'Explore the map →':'למפת המקורות ←', 'Find an answer':'חפשו תשובה', 'Start somewhere useful':'בחרו נקודת התחלה', 'Three ways into your knowledge':'שלוש דרכים להתחיל',
    'See what connects':'ראו מה מקושר', 'Follow labeled relationships between records and inspect one neighborhood at a time.':'עקבו אחר קשרים מסומנים בין רשומות ובדקו שכונה אחת בכל פעם.',
    'Find source passages':'מצאו קטעי מקור', 'Search this snapshot with English or Hebrew terms and review the original evidence.':'חפשו בתמונת המצב בעברית או באנגלית ובדקו את המקור.',
    'Notice what changed':'ראו מה השתנה', 'Review changed records before relying on an earlier answer or context packet.':'בדקו רשומות שהשתנו לפני הסתמכות על תשובה קודמת.',
    'This workspace is a source snapshot. Inclusion and graph position do not establish that a claim is true. Verify the cited version before acting on it.':'זוהי תמונת מצב של מקורות. הכללה בה ומיקום במפה אינם מוכיחים שטענה נכונה. בדקו את הגרסה המצוטטת לפני פעולה.',
    'KNOWLEDGE CONSTELLATION':'מפת ידע', 'Everything has a context.':'לכל דבר יש הקשר.', 'Save view':'שמרו תצוגה', 'Restore view':'שחזרו תצוגה',
    'Use 2D view':'עברו לדו־ממד', 'Use 3D view':'עברו לתלת־ממד', '3D unavailable':'תלת־ממד אינו זמין', 'All domains':'כל התחומים',
    'All kinds':'כל הסוגים', 'All relationships':'כל הקשרים', 'All sources':'כל המקורות', 'Clear':'נקו', 'Clear filters':'נקו מסננים',
    'LIST VIEW':'תצוגת רשימה', '2D FALLBACK':'דו־ממד חלופי', '2D PLANAR MAP':'מפה דו־ממדית', '3D SPATIAL MAP':'מפה תלת־ממדית',
    'Far':'רחוק', 'Near':'קרוב', '· layout depth':'· עומק לצורכי תצוגה', 'Zoom in':'הגדילו', 'Zoom out':'הקטינו',
    'Rotate map left':'סובבו שמאלה', 'Rotate map right':'סובבו ימינה', 'Reset view':'אפסו תצוגה', 'Focus selected':'מקדו נבחר',
    'Drag to orbit · Shift-drag to pan':'גררו לסיבוב · Shift וגרירה להזזה', 'Drag to pan · Scroll to zoom':'גררו להזזה · גללו להגדלה',
    'Positions and depth are layout only':'מיקום ועומק הם לצורכי תצוגה בלבד', 'Records':'רשומות', '← Back':'חזרה', 'Forward →':'קדימה',
    'EVIDENCE PANEL':'לוח מקורות', 'Choose a point of interest.':'בחרו נקודת עניין.',
    'Select a map node or a record from the list. Its source, content, and typed relationships appear here.':'בחרו נקודה במפה או רשומה ברשימה. המקור, התוכן והקשרים שלה יופיעו כאן.',
    'Compare records':'השוו רשומות', 'Clear comparison':'נקו השוואה', 'START WITH A QUESTION':'מתחילים בשאלה',
    'Ask. Inspect. Understand.':'שאלו. בדקו. הבינו.',
    'Search passages in this snapshot. Results are excerpts to verify, not a generated or verified answer.':'חפשו קטעים בתמונת המצב הזאת. התוצאות הן קטעים לבדיקה, לא תשובה שנוצרה או אומתה.',
    'What do you want to understand?':'מה תרצו להבין?', 'Find supporting sources →':'מצאו מקורות תומכים ←', 'Show cited response':'הציגו קטעים מצוטטים',
    'THE GROUND UNDER THE MAP':'המקורות שמתחת למפה', 'Inspect your sources.':'בדקו את המקורות.',
    'This export records source identities and digests. It cannot check for changes after export.':'הייצוא שומר זהויות ומזהי תוכן של מקורות. הוא אינו יכול לבדוק שינויים לאחר הייצוא.',
    'KNOWLEDGE HAS A HISTORY':'לידע יש היסטוריה', 'See what moved.':'ראו מה השתנה.',
    'Changes compare this snapshot with its supplied predecessor. Review affected sources before reusing an older answer.':'השינויים משווים את תמונת המצב לקודמתה. בדקו מקורות שהושפעו לפני שימוש חוזר בתשובה ישנה.',
    'Print source summary':'הדפיסו סיכום מקורות', 'Copy context':'העתיקו הקשר', 'Compare':'השוו', 'Remove comparison':'הסירו מהשוואה',
    'Show in full map':'הציגו במפה מלאה', 'Source citation':'ציטוט מקור', 'Source content':'תוכן המקור',
    'Show neighborhood':'הציגו שכנים', 'Expand depth':'הרחיבו עומק', 'Show all':'הציגו הכול', 'Inspect record':'בדקו רשומה',
    'Inspect evidence':'בדקו מקור', 'Copy with citation':'העתיקו עם ציטוט', 'Explore these records':'חקרו רשומות אלה',
    'No source links were recorded. This does not prove that none exist.':'לא נרשמו קשרי מקור. אין בכך הוכחה שלא קיימים כאלה.',
    'No matching records. Try a different term or clear the filters.':'לא נמצאו רשומות תואמות. נסו מונח אחר או נקו את המסננים.',
    'No supporting passages found. This does not establish that the answer is false or absent from other sources.':'לא נמצאו קטעים תומכים במקורות שנבחרו. אין בכך הוכחה שהתשובה שגויה או שאינה מופיעה במקורות אחרים.',
    'Offline export cannot verify current source freshness.':'ייצוא לא מקוון אינו יכול לבדוק את עדכניות המקורות כעת.',
    'No typed source link was recorded for the top excerpts.':'לא נרשם קשר מקור מסווג עבור הקטעים המובילים.',
    'snapshot only; original files not rechecked':'תמונת מצב בלבד; הקבצים המקוריים לא נבדקו שוב',
    'No source passages were returned. Do not treat this as a supported answer.':'לא הוחזרו קטעי מקור. אין להתייחס לכך כתשובה נתמכת.',
    'No text content in this record.':'אין תוכן טקסטואלי ברשומה הזאת.',
    'This record is outside the current map filters.':'הרשומה מחוץ למסנני המפה הנוכחיים.',
    'Snapshot identity · verify against the original':'זהות תמונת מצב · יש להשוות למקור',
    'Choose Compare on another record to inspect them side by side. Similar text does not establish equivalence.':'בחרו השוואה ברשומה נוספת כדי לבדוק אותן זו לצד זו. טקסט דומה אינו מוכיח שקילות.',
    'This snapshot contains no source inventory.':'אין בתמונת המצב הזאת רשימת מקורות.',
    'No entries reported for this comparison.':'לא דווחו רשומות בהשוואה הזאת.',
    'View saved in this browser for this snapshot.':'התצוגה נשמרה בדפדפן עבור תמונת המצב הזאת.',
    'Saved view restored.':'התצוגה השמורה שוחזרה.',
    'records to explore':'רשומות לחקירה', 'typed relationships':'קשרים מסווגים', 'source snapshots':'תמונות מצב של מקורות'
  };
  const exact = text => dictionary[text] || text;
  function translate(text) {
    const lead = text.match(/^\s*/)[0], tail = text.match(/\s*$/)[0], core = text.trim();
    if (!core) return text;
    if (dictionary[core]) return lead + dictionary[core] + tail;
    let match;
    if ((match = /^Snapshot search · (\d+) matching records; showing (\d+). Excerpts are not a verified answer. Check the exact source version\.$/.exec(core))) return lead + `חיפוש בתמונת מצב · ${match[1]} רשומות תואמות; מוצגות ${match[2]}. הקטעים אינם תשובה מאומתת. בדקו את גרסת המקור.` + tail;
    if ((match = /^Matched by: (.+)$/.exec(core))) return lead + `הותאם לפי: ${match[1]}` + tail;
    if ((match = /^Retrieval: (.+)$/.exec(core))) return lead + `סיבת איתור: ${match[1].replace('Match signals are ranking reasons, not proof.','סימני התאמה הם סיבות לדירוג, לא הוכחה.')}` + tail;
    if ((match = /^Context and open gaps · (\d+) source links$/.exec(core))) return lead + `הקשר ופערים פתוחים · ${match[1]} קשרי מקור` + tail;
    if ((match = /^Source links · (\d+)$/.exec(core))) return lead + `קשרי מקור · ${match[1]}` + tail;
    if ((match = /^(\d+) records · captured in this snapshot$/.exec(core))) return lead + `${match[1]} רשומות · נשמרו בתמונת המצב` + tail;
    if ((match = /^(\d+) matching \/ (\d+) total$/.exec(core))) return lead + `${match[1]} תואמות / ${match[2]} בסך הכול` + tail;
    if ((match = /^Show 100 more \((\d+) of (\d+) listed\)$/.exec(core))) return lead + `הציגו עוד 100 (${match[1]} מתוך ${match[2]})` + tail;
    if ((match = /^(\d+\/\d+) nodes · (\d+\/\d+) edges$/.exec(core))) return lead + `${match[1]} נקודות · ${match[2]} קשרים` + tail;
    if ((match = /^SNAPSHOT (.+)$/.exec(core))) return lead + `תמונת מצב ${match[1]}` + tail;
    if ((match = /^Source ID: (.+)$/.exec(core))) return lead + `מזהה מקור: ${match[1]}` + tail;
    if ((match = /^Digest: (.+)$/.exec(core))) return lead + `מזהה תוכן: ${match[1]}` + tail;
    if ((match = /^Gap: (.+)$/.exec(core))) return lead + `פער: ${exact(match[1])}` + tail;
    if ((match = /^Freshness: (.+)$/.exec(core))) return lead + `עדכניות: ${exact(match[1])}` + tail;
    return text;
  }
  const originals = new Map();
  const protectedText = parent => parent.closest('.record-body,.record-title,.record-name,.record-id,.source-path,.digest,.record-item,.map-node-label,.edge-button,.compare-card,.static-summary,#source-list h3,#changes-list button,.answer-card h3,.answer-card p:not(.muted),.source-card pre,#demo-first-result,#demo-more-sources,#demo-search-status,#workspace-title,#customer-name,.workspace-footer span:first-child');
  function scan(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let text;
    while ((text = walker.nextNode())) {
      const parent = text.parentElement;
      if (!parent || protectedText(parent) || parent.closest('script,style,textarea')) continue;
      if (!originals.has(text)) originals.set(text, text.textContent);
      text.textContent = lang === 'he' ? translate(originals.get(text)) : originals.get(text);
    }
    for (const element of root.querySelectorAll?.('[placeholder],[aria-label]') || []) {
      for (const attr of ['placeholder','aria-label']) {
        const current = element.getAttribute(attr);
        if (!current) continue;
        const key = `original-${attr}`;
        if (!element.dataset[key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]) element.dataset[key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())] = current;
        const original = element.dataset[key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())];
        element.setAttribute(attr, lang === 'he' ? translate(original) : original);
      }
    }
  }
  const results = document.getElementById('ask-results');
  document.getElementById('ask-form').addEventListener('submit', () => { results.dataset.demoCompacted = ''; }, true);
  function compactResults() {
    if (results.dataset.demoCompacted === 'yes') return;
    const cards = [...results.querySelectorAll('.answer-card')];
    if (cards.length < 2) return;
    results.dataset.demoCompacted = 'yes';
    const status = results.querySelector('.callout');
    if (status) {
      const found = /Snapshot search · (\d+) matching records/.exec(status.textContent || '');
      status.id = 'demo-search-status';
      status.dataset.found = found?.[1] || String(cards.length);
      status.dataset.available = String(cards.length - 1);
      status.textContent = lang === 'he'
        ? `חיפוש בתמונת מצב · נמצאו ${status.dataset.found} רשומות. מוצג קטע אחד; עוד ${status.dataset.available} קטעים זמינים כאן. אלה אינם תשובה מאומתת.`
        : `Snapshot search · ${status.dataset.found} records matched. One excerpt is visible; ${status.dataset.available} more are available here. These are not a verified answer.`;
    }
    const first = cards[0];
    const heading = document.createElement('p');
    heading.className = 'callout';
    heading.id = 'demo-first-result';
    heading.textContent = lang === 'he'
      ? 'הקטע הרלוונטי ביותר שנמצא · בדקו את המקור. זו אינה תשובה מאומתת.'
      : 'Most relevant passage found · inspect the source. This is not a verified answer.';
    results.insertBefore(heading, first);
    for (const card of cards.slice(1)) card.hidden = true;
    const more = document.createElement('button');
    more.type = 'button';
    more.id = 'demo-more-sources';
    more.className = 'quiet';
    more.textContent = lang === 'he' ? `הציגו עוד ${cards.length - 1} קטעים` : `Show ${cards.length - 1} more passages`;
    more.addEventListener('click', () => {
      const willShow = cards[1].hidden;
      for (const card of cards.slice(1)) card.hidden = !willShow;
      more.textContent = lang === 'he'
        ? (willShow ? 'הסתירו קטעים נוספים' : `הציגו עוד ${cards.length - 1} קטעים`)
        : (willShow ? 'Hide additional passages' : `Show ${cards.length - 1} more passages`);
    });
    first.after(more);
  }
  dictionary['Find a concept, function, or phrase…'] = 'חפשו מושג, פעולה או ביטוי…';
  dictionary['Find how source changes are tracked…'] = 'כיצד עוקבים אחר שינויים במקורות…';
  dictionary['Spatial knowledge map. Use the record list below for keyboard access.'] = 'מפת ידע מרחבית. השתמשו ברשומה שמתחתיה לגישה מהמקלדת.';
  dictionary['Two-dimensional knowledge map. Use the record list below for keyboard access.'] = 'מפת ידע דו־ממדית. השתמשו ברשומה שמתחתיה לגישה מהמקלדת.';
  function choose(next) {
    lang = next;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.body.dataset.demoLang = lang;
    document.getElementById('demo-he').setAttribute('aria-pressed', String(lang === 'he'));
    document.getElementById('demo-en').setAttribute('aria-pressed', String(lang === 'en'));
    document.getElementById('demo-back').textContent = lang === 'he' ? '← חזרה להדגמה' : '← Back to demo';
    document.getElementById('demo-back').href = `index.html?lang=${lang}`;
    const label = document.getElementById('demo-corpus-label');
    label.textContent = corpus === 'support' ? (lang === 'he' ? 'נהלים בדיוניים בלבד' : 'Fictional procedures only') : (lang === 'he' ? 'מסמכי המוצר · לא אימות עצמאי' : 'Product documents · not independent verification');
    label.classList.toggle('fiction', corpus === 'support');
    document.getElementById('workspace-title').textContent = corpus === 'support'
      ? (lang === 'he' ? 'Evidence Workspace · מוקד תמיכה בדיוני' : 'Evidence Workspace · Fictional support desk')
      : (lang === 'he' ? 'Evidence Workspace · על המוצר' : 'Evidence Workspace · About the product');
    document.getElementById('customer-name').textContent = lang === 'he' ? 'הדגמה ציבורית' : 'PUBLIC DEMO';
    document.querySelector('.workspace-footer span').textContent = lang === 'he' ? 'EVIDENCE WORKSPACE / הדגמה ציבורית' : 'EVIDENCE WORKSPACE / PUBLIC DEMO';
    params.set('lang', lang);
    history.replaceState(null, '', `${location.pathname}?${params}${location.hash}`);
    scan(document.querySelector('.app-shell'));
    const status = document.getElementById('demo-search-status');
    if (status) status.textContent = lang === 'he'
      ? `חיפוש בתמונת מצב · נמצאו ${status.dataset.found} רשומות. מוצג קטע אחד; עוד ${status.dataset.available} קטעים זמינים כאן. אלה אינם תשובה מאומתת.`
      : `Snapshot search · ${status.dataset.found} records matched. One excerpt is visible; ${status.dataset.available} more are available here. These are not a verified answer.`;
    const first = document.getElementById('demo-first-result');
    if (first) first.textContent = lang === 'he' ? 'הקטע הרלוונטי ביותר שנמצא · בדקו את המקור. זו אינה תשובה מאומתת.' : 'Most relevant passage found · inspect the source. This is not a verified answer.';
    const more = document.getElementById('demo-more-sources');
    if (more) {
      const count = results.querySelectorAll('.answer-card').length - 1;
      const visible = [...results.querySelectorAll('.answer-card')].slice(1).some(card => !card.hidden);
      more.textContent = lang === 'he' ? (visible ? 'הסתירו קטעים נוספים' : `הציגו עוד ${count} קטעים`) : (visible ? 'Hide additional passages' : `Show ${count} more passages`);
    }
  }
  document.getElementById('demo-he').addEventListener('click', () => choose('he'));
  document.getElementById('demo-en').addEventListener('click', () => choose('en'));
  const app = document.querySelector('.app-shell');
  const observer = new MutationObserver(() => { scan(app); compactResults(); });
  observer.observe(app, {childList:true, subtree:true});
  choose(lang);
  const view = params.get('view');
  if (['home','ask','explore','sources','changes'].includes(view)) document.querySelector(`[data-view="${view}"]`)?.click();
  const question = params.get('q');
  if (question && question.length <= 500) {
    document.querySelector('[data-view="ask"]')?.click();
    document.getElementById('question').value = question;
    document.getElementById('ask-submit').click();
  }
})();
