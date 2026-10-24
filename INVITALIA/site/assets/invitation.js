/* Renders an invitation (data object from the editor / API) into a container and wires the RSVP form.
   INVITATION.render(container, data, { onSubmit(answerObj) -> Promise, published, slug, lang }) */
(function (global) {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function initial(n) { n = (n || '').trim(); return n ? n[0].toUpperCase() : ''; }
  function dots(v) { if (!v) return ''; var p = v.split('-'); return p.length === 3 ? p[2] + ' · ' + p[1] + ' · ' + p[0] : v; }
  var ICONS = {
    map: '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    music: '<svg viewBox="0 0 24 24"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>'
  };

  function render(el, d, opts) {
    opts = opts || {};
    var t = global.I18N ? global.I18N.t : function (k) { return k; };
    var fmtDate = global.I18N ? global.I18N.fmtDate : function (v) { return v; };
    d = d || {};
    var T = global.INVITALIA_TEMPLATES, tpl = T ? T.get(d.template) : null;
    el.className = el.className.replace(/\bt-[a-z]+\b/g, '').trim() + ' t-' + (tpl ? tpl.theme : (d.template || 'palazzo'));
    // Cover photo of the template; the guest page lives at /i/:slug so the path must be absolute there.
    var coverSrc = tpl ? ((location.protocol === 'file:' ? '' : '/') + tpl.cover) : '';
    var chips = '';
    if (d.mapUrl) chips += '<a class="chip" href="' + esc(d.mapUrl) + '" target="_blank" rel="noopener">' + ICONS.map + esc(t('g.directions')) + '</a>';
    if (d.music) chips += '<button type="button" class="chip" data-music title="' + esc(d.track || '') + '">' + ICONS.music + esc(d.track ? d.track.split(' — ')[0].split(' - ')[0] : t('g.music')) + '</button>';
    var sched = (d.program || []).filter(function (p) { return p && (p.n || p.t); }).map(function (p) { return '<div><span>' + esc(p.n) + '</span><b>' + esc(p.t) + '</b></div>'; }).join('');
    var menuOpts = (d.menuOptions || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var closed = d.rsvpDeadline && new Date(d.rsvpDeadline + 'T23:59:59') < new Date();
    el.innerHTML =
      '<div class="frame"></div>' +
      (coverSrc ? '<img class="cover" src="' + esc(coverSrc) + '" alt="" width="1024" height="1536">' : '') +
      '<div class="mono">' + esc(initial(d.name1)) + (d.name1 && d.name2 ? ' &amp; ' : '') + esc(initial(d.name2)) + '</div>' +
      '<div class="names">' + esc(d.name1 || '…') + '<small>&amp;</small>' + esc(d.name2 || '…') + '</div>' +
      (d.greeting ? '<p class="greet">' + esc(d.greeting) + '</p>' : '') +
      '<div class="date">' + esc(dots(d.date)) + '</div>' +
      (d.date ? '<div class="time">' + esc(fmtDate(d.date)) + (d.time ? ', ' + esc(d.time) : '') + '</div>' : '') +
      (d.venue ? '<div class="place">' + esc(d.venue) + '</div>' : '') +
      (d.address ? '<div class="addr">' + esc(d.address) + '</div>' : '') +
      (chips ? '<div class="chips">' + chips + '</div>' : '') +
      (sched ? '<div class="sched">' + sched + '</div>' : '') +
      (d.dress ? '<div class="dress"><b>' + esc(t('g.dress')) + '</b>' + esc(d.dress) + '</div>' : '') +
      '<form class="rsvp"><div class="box">' +
        '<p class="q">' + esc(d.rsvpQuestion || t('g.rsvpDefault')) + '</p>' +
        (d.rsvpDeadline ? '<p class="dl">' + esc(t('g.deadline', { date: fmtDate(d.rsvpDeadline) })) + '</p>' : '') +
        (closed ? '<p class="err">' + esc(t('g.closed')) + '</p>' :
        '<div class="opts"><button type="button" class="o" data-a="yes" aria-pressed="false">' + esc(t('g.yes')) + '</button><button type="button" class="o" data-a="no" aria-pressed="false">' + esc(t('g.no')) + '</button></div>' +
        '<div class="more" hidden>' +
          '<input type="text" name="name" maxlength="120" placeholder="' + esc(t('g.name')) + '" aria-label="' + esc(t('g.name')) + '" required>' +
          (d.askPlusOne ? '<select name="plusOne" aria-label="+1"><option value="0">' + esc(t('g.alone')) + '</option><option value="1">' + esc(t('g.plus1')) + '</option><option value="2">' + esc(t('g.plus2')) + '</option></select>' : '') +
          (d.askMenu && menuOpts.length ? '<select name="menu"><option value="">' + esc(t('g.menuPick')) + '</option>' + menuOpts.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select>' : '') +
          (d.askComment ? '<textarea name="comment" maxlength="600" placeholder="' + esc(t('g.comment')) + '" aria-label="' + esc(t('g.comment')) + '"></textarea>' : '') +
          '<button type="submit" class="send">' + esc(t('g.send')) + '</button>' +
        '</div><p class="done" hidden></p><p class="err" hidden></p>') +
      '</div></form>' +
      '<div class="foot">' + esc(opts.footer || ('Invitalia.co' + (d.slug ? ' · ' + d.slug : ''))) + '</div>';

    var form = el.querySelector('form.rsvp'); var ans = '';
    form.querySelectorAll('.o').forEach(function (b) {
      b.addEventListener('click', function () {
        ans = b.dataset.a;
        form.querySelectorAll('.o').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true');
        form.querySelector('.more').hidden = false;
        ['plusOne', 'menu'].forEach(function (n) { var f = form.querySelector('[name=' + n + ']'); if (f) f.hidden = ans === 'no'; });
        var first = form.querySelector('[name=name]'); if (first && !first.value) first.focus();
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); if (!ans) return;
      var g = function (n) { var f = form.querySelector('[name=' + n + ']'); return f && !f.hidden ? f.value.trim() : ''; };
      var err = form.querySelector('.err'); err.hidden = true;
      if (!g('name')) { err.textContent = t('g.nameRequired'); err.hidden = false; return; }
      var payload = { name: g('name'), answer: ans, plusOne: ans === 'yes' ? g('plusOne') : '', menu: ans === 'yes' ? g('menu') : '', comment: g('comment'), lang: global.I18N ? global.I18N.lang : '' };
      var btn = form.querySelector('.send'); btn.disabled = true;
      Promise.resolve(opts.onSubmit ? opts.onSubmit(payload) : null).then(function () {
        form.querySelector('.more').hidden = true; form.querySelector('.opts').hidden = true;
        var done = form.querySelector('.done'); done.hidden = false; done.textContent = ans === 'yes' ? t('g.thanksYes') : t('g.thanksNo');
      }, function (ex) {
        btn.disabled = false; err.textContent = (ex && ex.code === 'deadline_passed') ? t('g.closed') : t('g.error'); err.hidden = false;
      });
    });
    var mb = el.querySelector('[data-music]');
    if (mb && opts.onMusic) mb.addEventListener('click', function () { opts.onMusic(mb); });
    return el;
  }
  global.INVITATION = { render: render, esc: esc };
})(window);
