/* Renders an invitation (data object from the editor / API) into a container and wires the RSVP form.
   INVITATION.render(container, data, { onSubmit(answerObj) -> Promise, onMusic(btn), footer, demo })
   Layout: top bar · hero (intro + cover art) · countdown · story · programme · venue + colours · FAQ · RSVP · footer. */
(function (global) {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function dots(v) { if (!v) return ''; var p = v.split('-'); return p.length === 3 ? p[2] + ' · ' + p[1] + ' · ' + p[0] : v; }
  function isColor(c) { return /^#[0-9a-f]{6}$/i.test(c || ''); }
  var ICONS = {
    map: '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    music: '<svg viewBox="0 0 24 24"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>'
  };

  // Wall-clock date+time in an IANA time zone → epoch ms (falls back to the browser zone).
  function tzOffset(ms, tz) {
    try {
      var p = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(new Date(ms));
      var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
      return Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour % 24, +o.minute, +o.second) - Math.floor(ms / 1000) * 1000;
    } catch (e) { return null; }
  }
  function targetMs(date, time, tz) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || ''); if (!m) return null;
    var hm = /^(\d{2}):(\d{2})$/.exec(time || '') || [0, '17', '00'];
    var local = new Date(+m[1], +m[2] - 1, +m[3], +hm[1], +hm[2]).getTime();
    if (!tz) return local;
    var naive = Date.UTC(+m[1], +m[2] - 1, +m[3], +hm[1], +hm[2]);
    var off = tzOffset(naive, tz); if (off == null) return local;
    return naive - tzOffset(naive - off, tz);
  }

  function render(el, d, opts) {
    opts = opts || {};
    var t = global.I18N ? global.I18N.t : function (k) { return k; };
    var fmtDate = global.I18N ? global.I18N.fmtDate : function (v) { return v; };
    d = d || {};
    var T = global.INVITALIA_TEMPLATES, tpl = T ? T.get(d.template) : null;
    el.className = el.className.replace(/\bt-[a-z]+\b/g, '').trim() + ' t-' + (tpl ? tpl.theme : 'acuarela');
    var coverSrc = tpl ? ((location.protocol === 'file:' ? '' : '/') + tpl.cover) : '';
    if (el._cd) { clearInterval(el._cd); el._cd = null; }

    var names = esc(d.name1 || '…') + '<span>&amp;</span>' + esc(d.name2 || '…');
    var chips = '';
    if (d.music) chips += '<button type="button" class="chip" data-music title="' + esc(d.track || '') + '">' + ICONS.music + esc(d.track ? d.track.split(' — ')[0].split(' - ')[0] : t('g.music')) + '</button>';
    var story = (d.story || []).filter(function (s) { return s && (s.title || s.text); });
    var prog = (d.program || []).filter(function (p) { return p && (p.n || p.t); });
    var faq = (d.faq || []).filter(function (f) { return f && f.q; });
    var palette = (d.palette || []).filter(isColor);
    var menuOpts = (d.menuOptions || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var closed = d.rsvpDeadline && new Date(d.rsvpDeadline + 'T23:59:59') < new Date();
    var hasWhere = d.venue || d.address || d.venueText || d.mapUrl;
    var hasColors = palette.length || d.dress;

    el.innerHTML =
      '<div class="i-top"><a class="brand" href="#top">INVITALIA<small>SMART INVITATIONS</small></a><nav>' +
        (story.length ? '<a href="#story">' + esc(t('g.nav.story')) + '</a>' : '') + (prog.length ? '<a href="#schedule">' + esc(t('g.nav.sched')) + '</a>' : '') + '<a href="#rsvp">' + esc(t('g.nav.rsvp')) + '</a></nav></div>' +
      '<section class="i-hero" id="top"><div class="i-intro">' +
        '<div class="eyebrow">' + esc(t('g.eyebrow.intro')) + '</div>' +
        '<h1>' + names + '</h1><div class="rule"></div>' +
        (d.greeting ? '<p>' + esc(d.greeting) + '</p>' : '') +
        (d.date ? '<div class="i-date">' + esc(dots(d.date)) + '</div>' : '<div class="i-date">&nbsp;</div>') +
        (chips ? '<div class="chips">' + chips + '</div>' : '') +
        '<a class="button" href="#rsvp">' + esc(t('g.cta')) + '</a>' +
      '</div><div class="i-art" role="img" aria-label="' + esc(tpl ? tpl.name : '') + '"' + (coverSrc ? ' style="background-image:url(\'' + esc(coverSrc) + '\')"' : '') + '>' +
        '<div class="art-title"><small>' + esc(t('g.art.top')) + '</small><span>' + esc(d.name1 || '') + '</span>&amp;<span>' + esc(d.name2 || '') + '</span></div>' +
        '<div class="art-foot">' + esc(t('g.art.foot')) + '</div></div></section>' +
      (d.date ? '<section class="i-sec"><div class="eyebrow">' + esc(t('g.count.eyebrow')) + '</div><h2>' + esc(t('g.count.title')) + '</h2>' +
        (d.time ? '<p class="lead">' + esc(fmtDate(d.date)) + ', ' + esc(d.time) + '</p>' : '') + '<div class="count" data-count></div></section>' : '') +
      (story.length ? '<section class="i-sec i-story" id="story"><div class="eyebrow">' + esc(t('g.story.eyebrow')) + '</div><h2>' + esc(t('g.story.title')) + '</h2><div class="story-grid">' +
        story.map(function (s) { return '<article>' + (s.label ? '<span class="year">' + esc(s.label) + '</span>' : '') + '<h3>' + esc(s.title) + '</h3>' + (s.text ? '<p>' + esc(s.text) + '</p>' : '') + '</article>'; }).join('') + '</div></section>' : '') +
      (prog.length ? '<section class="i-sec" id="schedule"><div class="eyebrow">' + esc(t('g.sched.eyebrow')) + '</div><h2>' + esc(t('g.sched.title')) + '</h2><div class="timeline">' +
        prog.map(function (p) { return '<div class="event"><time>' + esc(p.t) + '</time><div><h3>' + esc(p.n) + '</h3>' + (p.d ? '<p>' + esc(p.d) + '</p>' : '') + '</div></div>'; }).join('') + '</div></section>' : '') +
      (hasWhere || hasColors ? '<section class="i-details">' +
        (hasWhere ? '<div><div class="eyebrow">' + esc(t('g.where.eyebrow')) + '</div><h2>' + esc(d.venue || t('g.where.title')) + '</h2>' +
          (d.venueText ? '<p>' + esc(d.venueText) + '</p>' : '') + (d.address ? '<p class="addr">' + esc(d.address) + '</p>' : '') +
          (d.mapUrl ? '<a class="chip" href="' + esc(d.mapUrl) + '" target="_blank" rel="noopener">' + ICONS.map + esc(t('g.directions')) + '</a>' : '') + '</div>' : '') +
        (hasColors ? '<div><div class="eyebrow">' + esc(t('g.colors.eyebrow')) + '</div><h2>' + esc(t('g.colors.title')) + '</h2><p>' + esc(t('g.colors.text')) + '</p>' +
          (palette.length ? '<div class="swatches">' + palette.map(function (c) { return '<i style="background:' + esc(c) + '"></i>'; }).join('') + '</div>' : '') +
          (d.dress ? '<p class="dress">' + esc(d.dress) + '</p>' : '') + '</div>' : '') + '</section>' : '') +
      (faq.length ? '<section class="i-sec"><div class="eyebrow">' + esc(t('g.faq.eyebrow')) + '</div><h2>' + esc(t('g.faq.title')) + '</h2><div class="faq">' +
        faq.map(function (f) { return '<details><summary>' + esc(f.q) + '</summary><p>' + esc(f.a || '') + '</p></details>'; }).join('') + '</div></section>' : '') +
      '<section class="i-sec i-rsvp" id="rsvp"><div class="eyebrow">' + esc(t('g.rsvp.eyebrow')) + '</div><h2>' + esc(d.rsvpQuestion || t('g.rsvp.title')) + '</h2>' +
        '<p class="lead">' + esc(t('g.rsvp.lead')) + (d.rsvpDeadline ? '<br>' + esc(t('g.deadline', { date: fmtDate(d.rsvpDeadline) })) : '') + '</p>' +
        '<form class="rsvp">' + (closed ? '<p class="err">' + esc(t('g.closed')) + '</p>' :
          '<div class="fields">' +
          '<label>' + esc(t('g.f.name')) + '<input type="text" name="name" maxlength="120" placeholder="' + esc(t('g.f.namePh')) + '" autocomplete="name" required></label>' +
          '<label>' + esc(t('g.f.attend')) + '<select name="answer"><option value="yes">' + esc(t('g.f.yes')) + '</option><option value="no">' + esc(t('g.f.no')) + '</option></select></label>' +
          (d.askPlusOne ? '<label data-yes>' + esc(t('g.f.number')) + '<select name="number"><option>1</option><option>2</option><option>3</option><option>4</option></select></label>' : '') +
          (d.askMenu && menuOpts.length ? '<label data-yes>' + esc(t('g.f.menu')) + '<select name="menu"><option value="">' + esc(t('g.menuPick')) + '</option>' + menuOpts.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select></label>' : '') +
          (d.askComment ? '<label>' + esc(t('g.f.comment')) + '<textarea name="comment" maxlength="600" placeholder="' + esc(t('g.f.optional')) + '"></textarea></label>' : '') +
          '<button type="submit" class="button send">' + esc(t('g.f.send')) + '</button>' +
          '<p class="note">' + esc(opts.demo ? t('g.f.noteDemo') : t('g.f.note')) + '</p></div>' +
          '<p class="done" role="status" hidden></p><p class="err" hidden></p>') + '</form></section>' +
      '<footer class="i-foot">INVITALIA<p>' + esc(opts.footer || t('g.tagline')) + '</p></footer>';

    // countdown
    var cd = el.querySelector('[data-count]');
    if (cd) {
      var target = targetMs(d.date, d.time, d.tz), units = [t('g.count.days'), t('g.count.hours'), t('g.count.minutes'), t('g.count.seconds')];
      var tick = function () {
        var r = Math.max(0, (target || 0) - Date.now());
        var v = [Math.floor(r / 864e5), Math.floor(r / 36e5) % 24, Math.floor(r / 6e4) % 60, Math.floor(r / 1e3) % 60];
        cd.innerHTML = v.map(function (n, i) { return '<div><b>' + String(n).padStart(2, '0') + '</b><span>' + esc(units[i]) + '</span></div>'; }).join('');
      };
      tick(); el._cd = setInterval(tick, 1000);
    }

    // RSVP
    var form = el.querySelector('form.rsvp');
    var answerSel = form.querySelector('[name=answer]');
    function syncYes() { var yes = !answerSel || answerSel.value === 'yes'; form.querySelectorAll('[data-yes]').forEach(function (l) { l.hidden = !yes; }); }
    if (answerSel) { answerSel.addEventListener('change', syncYes); syncYes(); }
    form.addEventListener('submit', function (e) {
      e.preventDefault(); if (closed) return;
      var g = function (n) { var f = form.querySelector('[name=' + n + ']'); return f && !(f.closest('label') || f).hidden ? f.value.trim() : ''; };
      var err = form.querySelector('.err'); err.hidden = true;
      if (!g('name')) { err.textContent = t('g.nameRequired'); err.hidden = false; form.querySelector('[name=name]').focus(); return; }
      var ans = g('answer') || 'yes', num = parseInt(g('number') || '1', 10);
      var payload = { name: g('name'), answer: ans, plusOne: ans === 'yes' && d.askPlusOne ? String(Math.max(0, (isNaN(num) ? 1 : num) - 1)) : '', menu: ans === 'yes' ? g('menu') : '', comment: g('comment'), lang: global.I18N ? global.I18N.lang : '' };
      var btn = form.querySelector('.send'); btn.disabled = true;
      Promise.resolve(opts.onSubmit ? opts.onSubmit(payload) : null).then(function () {
        form.querySelector('.fields').hidden = true;
        var done = form.querySelector('.done'); done.hidden = false; done.textContent = ans === 'yes' ? t('g.thanksYes') : t('g.thanksNo');
      }, function (ex) {
        btn.disabled = false; err.textContent = (ex && ex.code === 'deadline_passed') ? t('g.closed') : t('g.error'); err.hidden = false;
      });
    });
    var mb = el.querySelector('[data-music]');
    if (mb && opts.onMusic) mb.addEventListener('click', function () { opts.onMusic(mb); });
    return el;
  }
  global.INVITATION = { render: render, esc: esc, targetMs: targetMs };
})(window);
