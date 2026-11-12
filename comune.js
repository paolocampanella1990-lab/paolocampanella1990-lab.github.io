/* Parti comuni a tutte le pagine del sito: menu a tre lineette e modulo prima del download.
   - MODULO: l'indirizzo dello script del foglio Google di Paolo (lì arrivano le richieste). Vuoto = in prova, non invia nulla.
   - DOWNLOAD: si chiede a GitHub qual è l'ultima versione pubblicata e si scarica il suo installatore;
     se GitHub non risponde, si apre la pagina dell'ultima versione (lì c'è il file "Setup"). */
(() => {
  const CONFIG = {
    modulo: 'https://script.google.com/macros/s/AKfycbzMg6lsbE2tw1z9PjtHaZawKIjhT6ptNyFlPpg0Ol7oyEopC9zmC0VjFvYc8q4fBN-_eg/exec',
    rilasci: 'https://api.github.com/repos/Paolocampanella1990-lab/gestionale-psicologi-aggiornamenti/releases/latest',
    download: 'https://github.com/Paolocampanella1990-lab/gestionale-psicologi-aggiornamenti/releases/latest',
  };
  const telefono = matchMedia('(pointer: coarse)').matches && innerWidth < 900;
  let cercato = null;
  const trovaDownload = () => cercato = cercato || fetch(CONFIG.rilasci, { headers: { Accept: 'application/vnd.github+json' } })
    .then(r => r.json()).then(j => { const a = (j.assets || []).find(x => /Setup-[\d.]+\.exe$/i.test(x.name)); if (a) CONFIG.download = a.browser_download_url; return CONFIG.download; })
    .catch(() => CONFIG.download);
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- menu a tre lineette ----------
  const FUNZIONI = [['agenda', 'Agenda'], ['fattura', 'Fatture'], ['bollo', 'Marca da bollo'], ['sistema-ts', 'Sistema TS'], ['consenso', 'Consenso'],
    ['pazienti', 'Pazienti'], ['guadagni', 'Guadagni'], ['tasse', 'Tasse ed ENPAP'], ['backup', 'Backup']];
  const nav = document.querySelector('header .nav');
  if (nav) {
    const b = document.createElement('button');
    b.className = 'hamb'; b.type = 'button'; b.setAttribute('aria-label', 'Apri il menu'); b.setAttribute('aria-expanded', 'false');
    b.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(b);
    const sfondo = document.createElement('div'); sfondo.className = 'menu-sfondo';
    const p = document.createElement('aside'); p.className = 'menu-pannello'; p.setAttribute('aria-label', 'Menu');
    p.innerHTML = `<div class="menu-testa"><b>Menu</b><button class="menu-chiudi" type="button" aria-label="Chiudi il menu">×</button></div>
      <nav class="menu-voci">
        <a href="./#racconto"><b>Come funziona</b><small>Dalla seduta al Sistema TS, passo per passo</small></a>
        <a href="funzioni.html"><b>Tutte le funzioni</b><small>Schermata per schermata: cosa fa il programma</small></a>
        <a href="./#dentro"><b>Il programma</b><small>Le schermate che vedrai ogni giorno</small></a>
        <a href="./#storia"><b>Com'è nato</b><small>In uno studio vero, con pazienti veri</small></a>
        <a href="./#domande"><b>Domande frequenti</b><small>Mac, costi, dati, Sistema TS…</small></a>
        <a href="privacy.html"><b>Privacy</b><small>Come trattiamo i tuoi dati</small></a>
      </nav>
      <div class="menu-funzioni"><span class="eyebrow">Vai a una funzione</span><div>${FUNZIONI.map(([id, n]) => `<a href="funzioni.html#${id}">${n}</a>`).join('')}</div></div>
      <div class="menu-piede"><a class="btn btn-filo" href="./#prova" data-scarica>Scarica gratis →</a><a class="link" href="./#prova">Preferisci scriverci prima?</a></div>`;
    document.body.append(sfondo, p);
    const apri = () => { document.body.classList.add('menu-aperto'); b.setAttribute('aria-expanded', 'true'); p.querySelector('.menu-chiudi').focus(); };
    const chiudi = () => { document.body.classList.remove('menu-aperto'); b.setAttribute('aria-expanded', 'false'); };
    b.addEventListener('click', apri);
    sfondo.addEventListener('click', chiudi);
    p.querySelector('.menu-chiudi').addEventListener('click', chiudi);
    p.querySelectorAll('a').forEach(a => a.addEventListener('click', chiudi));
    addEventListener('keydown', e => { if (e.key === 'Escape') chiudi(); });
  }

  // ---------- modulo prima del download ----------
  const d = document.createElement('dialog');
  d.className = 'scelta'; d.id = 'dlgScarica'; d.setAttribute('aria-labelledby', 'scaricaTitolo');
  d.innerHTML = `<button class="chiudi" type="button" aria-label="Chiudi">×</button>
    <form class="modulo" id="fScarica" novalidate>
      <span class="eyebrow">Prova gratuita · 30 giorni</span>
      <h3 id="scaricaTitolo">Prima di scaricare, ci dici chi sei?</h3>
      <p class="sotto">Ci serve per seguirti durante la prova. Il download parte subito e ti mandiamo il link anche per email.</p>
      <div class="campi">
        <label class="c tutta">Nome e cognome<input type="text" name="nome" autocomplete="name" required maxlength="80"></label>
        <label class="c tutta">Email<input type="email" name="email" autocomplete="email" required maxlength="120"></label>
        <label class="c">Professione<select name="professione" required><option value="">Scegli…</option><option>Psicologa / Psicologo</option><option>Psicoterapeuta</option><option>Tirocinante / in formazione</option><option>Altro</option></select></label>
        <label class="c">Città <small>(facoltativa)</small><input type="text" name="citta" autocomplete="address-level2" maxlength="60"></label>
        <input type="text" name="sito_web" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      </div>
      <label class="consenso"><input type="checkbox" name="privacy" required><span>Ho letto l'<a href="privacy.html" target="_blank">informativa privacy</a>: i miei dati servono solo per mandarmi il programma e seguirmi durante la prova.</span></label>
      <p class="errore" hidden></p>
      <button class="btn btn-filo" type="submit">Scarica il programma →</button>
      <p class="nota">Per Windows 10 e 11 · 30 giorni completi · nessuna carta di credito</p>
    </form>
    <div class="grazie" hidden>
      <span class="eyebrow">Grazie!</span>
      <h3 class="g-titolo"></h3>
      <p class="telefono" hidden>Il programma si installa su un <b>computer Windows</b>: ti abbiamo mandato il link per email, aprilo dal computer.</p>
      <ol>
        <li>Apri il file <b>Gestionale-psicologi-Setup</b> che trovi in Download.</li>
        <li>Se Windows mostra <b>"PC protetto da Windows"</b>: premi <b>"Ulteriori informazioni"</b> e poi <b>"Esegui comunque"</b>. È normale per i programmi nuovi.</li>
        <li>Al primo avvio inserisci i tuoi dati: hai <b>30 giorni completi</b>, senza codici.</li>
      </ol>
      <a class="btn btn-filo g-link" href="${CONFIG.download}">Se il download non parte, clicca qui</a>
      <p class="nota">Ti abbiamo mandato il link anche per email. Per qualsiasi dubbio, rispondi a quella mail.</p>
    </div>`;
  document.body.appendChild(d);
  const f = d.querySelector('form'), err = d.querySelector('.errore'), invia = f.querySelector('button[type=submit]'), grazie = d.querySelector('.grazie');
  const apriModulo = () => { trovaDownload(); if (d.showModal) { d.showModal(); setTimeout(() => f.nome.focus(), 50); } else location.href = CONFIG.download; };
  d.querySelector('.chiudi').addEventListener('click', () => d.close());
  d.addEventListener('click', e => { if (e.target === d) d.close(); });
  document.addEventListener('click', e => { const t = e.target.closest('[data-scarica]'); if (t) { e.preventDefault(); document.body.classList.remove('menu-aperto'); apriModulo(); } });
  f.addEventListener('submit', async e => {
    e.preventDefault(); err.hidden = true;
    const v = n => f[n].value.trim();
    const sbagli = [];
    if (v('nome').length < 3) sbagli.push('nome e cognome');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v('email'))) sbagli.push('un indirizzo email valido');
    if (!v('professione')) sbagli.push('la professione');
    if (sbagli.length || !f.privacy.checked) {
      err.textContent = (sbagli.length ? 'Manca ' + sbagli.join(', ') + '. ' : '') + (!f.privacy.checked ? 'Spunta la casella dell\'informativa privacy.' : '');
      err.hidden = false; return;
    }
    invia.disabled = true; invia.textContent = 'Un attimo…';
    const dati = new URLSearchParams({ nome: v('nome'), email: v('email'), professione: v('professione'), citta: v('citta'),
      dispositivo: telefono ? 'telefono' : 'computer', sito_web: f.sito_web.value, pagina: location.pathname });
    try { if (CONFIG.modulo) await fetch(CONFIG.modulo, { method: 'POST', mode: 'no-cors', body: dati }); } catch (x) { /* senza rete: il download parte lo stesso */ }
    const link = await trovaDownload(); grazie.querySelector('.g-link').href = link;
    f.hidden = true; grazie.hidden = false;
    grazie.querySelector('.g-titolo').textContent = `Grazie, ${v('nome').split(' ')[0]}! ${telefono ? 'Ti abbiamo scritto.' : 'Il download sta partendo.'}`;
    if (telefono) { grazie.querySelector('.telefono').hidden = false; grazie.querySelector('ol').hidden = true; grazie.querySelector('.g-link').hidden = true; }
    else setTimeout(() => { location.href = link; }, 400);
  });
})();
