// SIG · Versiones: cada organización usa la versión que eligió su administrador.
// El usuario maestro siempre usa la última. Cuando hay una nueva, avisa y deja actualizar con un clic.
// Este archivo es común a todas las versiones y no toca los datos.
(function () {
  'use strict';
  var RUTAS = window.SIG_RUTAS || {}, ULT = window.SIG_ULT || 1, V = window.SIG_V || ULT;
  var listo = '', ocupado = false;
  function e(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function estado() { try { return (typeof S !== 'undefined' && S.user && S.org) ? S : null; } catch (x) { return null; } }
  function pie(texto) {
    var p = document.getElementById('sigPie');
    if (!p) { p = document.createElement('div'); p.id = 'sigPie'; p.style.cssText = 'position:fixed;right:10px;bottom:6px;font-size:11px;color:#8a978f;z-index:4;pointer-events:none'; document.body.appendChild(p); }
    p.textContent = texto;
  }
  function quitarAviso() { var a = document.getElementById('sigVersion'); if (a) a.remove(); }
  async function revisar() {
    var s = estado();
    if (!s) { quitarAviso(); listo = ''; return; }
    var clave = s.org.id + '|' + s.user.id;
    if (listo === clave || ocupado) return;
    ocupado = true;
    try {
      var quiere = ULT;
      if (!s.maestro) {
        var r = await sb.from('organizaciones').select('version').eq('id', s.org.id).single();
        quiere = (r.data && r.data.version) || 1;
      }
      if (!RUTAS[quiere]) { var disp = Object.keys(RUTAS).map(Number).filter(function (n) { return n <= quiere; }); quiere = disp.length ? Math.max.apply(null, disp) : ULT; }
      localStorage.setItem('sig_version', String(quiere));
      if (quiere !== V) { location.reload(); return; }
      listo = clave;
      pie('Versión ' + V);
      quitarAviso();
      if (s.maestro) return;
      var vs = await sb.from('versiones').select('numero,titulo,novedades').eq('publicada', true).gt('numero', V).order('numero');
      var nuevas = (vs.data || []).filter(function (x) { return RUTAS[x.numero]; });
      if (!nuevas.length) return;
      var ultima = nuevas[nuevas.length - 1], admin = s.rol === 'administrador';
      var div = document.createElement('div');
      div.id = 'sigVersion';
      div.style.cssText = 'max-width:1100px;margin:12px auto 0;padding:12px 16px;background:#fffbeb;border:1px solid #fcd34d;border-radius:12px;font-size:14px;color:#1f2a24';
      div.innerHTML = '<b>Hay una versión nueva del sistema (versión ' + ultima.numero + '): ' + e(ultima.titulo) + '.</b> ' +
        (admin ? 'Tus datos no cambian ni se borran al actualizar.' : 'Cuando el administrador la active, la vas a ver aquí.') +
        '<details style="margin-top:6px"><summary style="cursor:pointer;color:#166534">Ver qué trae</summary>' +
        nuevas.map(function (x) { return '<p style="margin:8px 0 0"><b>Versión ' + x.numero + '</b><br>' + e(x.novedades).replace(/\n/g, '<br>') + '</p>'; }).join('') + '</details>' +
        (admin ? '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button id="sigActualizar">Actualizar ahora</button><button class="sec" id="sigLuego">Más tarde</button></div>' : '');
      var main = document.getElementById('app');
      main.parentNode.insertBefore(div, main);
      if (admin) {
        document.getElementById('sigLuego').onclick = quitarAviso;
        document.getElementById('sigActualizar').onclick = async function () {
          if (!confirm('¿Pasar a la versión ' + ultima.numero + '? Los datos se quedan como están.')) return;
          this.disabled = true;
          var r = await sb.rpc('actualizar_version', { o: s.org.id });
          if (r.error) { alert(r.error.message); this.disabled = false; return; }
          localStorage.setItem('sig_version', String(r.data));
          location.reload();
        };
      }
    } catch (x) { /* sin conexión: se vuelve a intentar en el próximo cambio de pantalla */ }
    finally { ocupado = false; }
  }
  window.addEventListener('hashchange', function () { setTimeout(revisar, 300); });
  setInterval(revisar, 2000);
})();
