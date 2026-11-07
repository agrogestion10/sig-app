// AgroGestión · Navegación: menú fijo a la izquierda (computadora), barra abajo (teléfono),
// coronita en lo que no viene en el plan y botón de WhatsApp.

const WHATSAPP = '50495430148';
const IC = (d, w = 20) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICONOS = {
  inicio: IC('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
  ger: IC('<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>'),
  adm: IC('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
  cre: IC('<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/>'),
  cer: IC('<path d="M5 19c0-8 6-13 15-13-1 9-6 14-13 14"/><path d="M8 17c2.5-4 5.5-7 9-9"/>'),
  padron: IC('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.6.8 2.6 2.5 3 5.2"/>'),
  acopio: IC('<path d="M4 7h16l-1.5 12a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2z"/><path d="M8 7a4 4 0 0 1 8 0"/>'),
  eudr: IC('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3"/>'),
  kobo: IC('<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 6h4M9 11h6M9 15h4"/>'),
  plan: IC('<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>'),
  config: IC('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>'),
  guia: IC('<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5h.01"/>'),
  salir: IC('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
  mas: IC('<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>'),
  corona: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/></svg>',
  whatsapp: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2z"/></svg>'
};

// Qué opción del menú se marca según la pantalla abierta
const MARCA_DE = { padron: 'padron', prod: 'padron', prodf: 'padron', parcela: 'padron', acopio: 'acopio', acopios: 'acopio', recibo: 'acopio', eudrparc: 'eudr', kobo: 'kobo', plan: 'plan', config: 'config', usuarios: 'config', roles: 'config', catalogo: 'config', bitacora: 'config', orgs: 'config', guia: 'guia', ger: 'ger' };

function itemsNav() {
  if (!S.user || !S.org) return null;
  const p = S.plan || {}, maestro = S.maestro, cer = puedeSec('cer');
  const sinKobo = !maestro && S.plan && !p.kobo, sinSat = !maestro && S.plan && !p.satelite;
  return [
    ['Gestioná tu organización', [
      ['inicio', '#/', 'Inicio'],
      puedeSec('ger') && ['ger', '#/ger', 'Gerencia'],
      puedeSec('adm') && ['adm', '#/adm', 'Administración'],
      puedeSec('cre') && ['cre', '#/cre', 'Crédito interno'],
      cer && ['cer', '#/cer', 'Certificaciones']]],
    cer && ['Campo y cumplimiento', [
      ['padron', '#/padron', 'Productores y fincas'],
      ['acopio', '#/acopios', 'Acopio'],
      ['eudr', '#/eudrparc', 'Revisión EUDR', sinSat],
      ['kobo', '#/kobo', 'Kobo (campo)', sinKobo]]],
    ['Tu cuenta', [
      ['plan', '#/plan', 'Mi plan', false, p.nombre],
      esAdmin() && ['config', '#/config', 'Configuración'],
      ['guia', '#/guia', 'Guía de uso']]]
  ].filter(Boolean).map(([t, l]) => [t, l.filter(Boolean)]);
}
function marcaActual() {
  const r = location.hash.replace(/^#\/?/, '').split('/')[0];
  if (!r) return 'inicio';
  return MARCA_DE[r] || S.seccion || '';
}
function pintarNav() {
  const grupos = itemsNav();
  let lat = document.getElementById('navLat'), baja = document.getElementById('navBaja'), wa = document.getElementById('waBtn');
  if (!grupos || $('#barra').hidden) { document.body.classList.remove('conNav'); [lat, baja, wa].forEach(x => x && x.remove()); return; }
  document.body.classList.add('conNav');
  const act = marcaActual();
  const item = ([k, h, t, corona, chip]) => `<a href="${h}" class="navItem${k === act ? ' activo' : ''}" data-k="${k}">${ICONOS[k] || ''}<span>${esc(t)}</span>${corona ? `<span class="corona" title="No viene en tu plan">${ICONOS.corona}</span>` : chip ? `<span class="chipNav">${esc(chip)}</span>` : ''}</a>`;
  const quien = S.maestro ? 'Usuario maestro' : S.perfil?.nombre || '';
  const html = `<a href="#/" class="navMarca"><span class="navLogo">AG</span><span>AgroGestión</span></a>
    <div class="navOrg"><span class="navAvatar">${esc((S.org.nombre || '?').trim().charAt(0).toUpperCase())}</span><span><b>${esc(S.org.nombre)}</b><small>${esc(quien)}</small></span></div>
    ${grupos.map(([t, l]) => `<div class="navGrupo">${esc(t)}</div>${l.map(item).join('')}`).join('')}
    <a href="#" class="navItem navSalir" id="navSalir">${ICONOS.salir}<span>Cerrar sesión</span></a>`;
  if (!lat) { lat = document.createElement('nav'); lat.id = 'navLat'; lat.className = 'navLat'; lat.setAttribute('aria-label', 'Menú principal'); document.body.prepend(lat); }
  lat.innerHTML = html;
  // Teléfono: barra de abajo con lo principal y «Más» con todo el menú
  const todos = grupos.flatMap(([, l]) => l), princ = todos.filter(x => ['inicio', 'adm', 'cre', 'cer', 'ger'].includes(x[0])).slice(0, 4);
  if (!baja) { baja = document.createElement('nav'); baja.id = 'navBaja'; baja.className = 'navBaja'; baja.setAttribute('aria-label', 'Menú'); document.body.append(baja); }
  const corto = { inicio: 'Inicio', ger: 'Gerencia', adm: 'Administ.', cre: 'Crédito', cer: 'Certific.' };
  baja.innerHTML = princ.map(([k, h]) => `<a href="${h}" class="${k === act ? 'activo' : ''}">${ICONOS[k]}<span>${corto[k]}</span></a>`).join('')
    + `<button type="button" id="navMas" class="${princ.some(x => x[0] === act) ? '' : 'activo'}">${ICONOS.mas}<span>Más</span></button>`;
  $('#navMas').onclick = () => document.body.classList.toggle('navAbierto');
  lat.querySelectorAll('a.navItem').forEach(a => a.addEventListener('click', () => document.body.classList.remove('navAbierto')));
  $('#navSalir').onclick = async e => { e.preventDefault(); await sb.auth.signOut({ scope: 'local' }); location.hash = '#/'; location.reload(); };
  if (!wa) {
    wa = document.createElement('a'); wa.id = 'waBtn'; wa.className = 'waBtn'; wa.target = '_blank'; wa.rel = 'noopener';
    wa.title = 'Escribinos por WhatsApp'; wa.setAttribute('aria-label', 'Escribinos por WhatsApp'); wa.innerHTML = ICONOS.whatsapp; document.body.append(wa);
  }
  wa.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, soy de ' + (S.org.nombre || '') + ' y tengo una consulta sobre AgroGestión.')}`;
}
window.addEventListener('hashchange', () => { document.body.classList.remove('navAbierto'); setTimeout(pintarNav, 0); });
// Se repinta cada vez que se pinta la barra de arriba (al entrar, al cambiar de organización)
(function () { const original = pintarBarra; pintarBarra = function () { original.apply(this, arguments); pintarNav(); }; })();

// ---------- lo que no viene en el plan: pantalla para subir de plan en vez de un error ----------
function pantallaSubirPlan(que, detalle) {
  app().innerHTML = cabecera(que, '#/') + `<div class="caja subirPlan"><span class="corona grande">${ICONOS.corona}</span>
    <h2>${esc(que)} viene en el plan Estándar y en el Premium</h2><p>${detalle}</p>
    <p class="nota">Tu plan ahora: <b>${esc(S.plan?.nombre || '')}</b>.</p>
    <div class="acciones"><a class="boton" href="#/plan">Ver planes</a> <a class="boton sec" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, quiero subir de plan en AgroGestión (' + (S.org?.nombre || '') + ').')}" target="_blank" rel="noopener">Preguntar por WhatsApp</a></div></div>`;
}
(function () {
  const envolver = (r, campo, que, detalle) => {
    const original = RUTAS[r]; if (!original) return;
    RUTAS[r] = function (...a) { if (!S.maestro && S.plan && !S.plan[campo]) return pantallaSubirPlan(que, detalle); return original.apply(this, a); };
  };
  envolver('kobo', 'kobo', 'Kobo (formularios de campo)', 'Con Kobo tus técnicos llenan inspecciones, padrón, asistencia y más en el celular, aunque no haya señal, y todo llega solo a AgroGestión.');
  envolver('eudrparc', 'satelite', 'Revisión EUDR por satélite', 'Revisa cada parcela con imágenes de satélite (Whisp de la FAO y Global Forest Watch) para comprobar que no hubo deforestación después de 2020, antes de comprar y de despachar.');
})();

// ---------- molde de pantalla (como Treinta): título con acciones, filtros, tarjetas de números, pestañas y vacío ----------
const ICK = {
  dinero: IC('<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9.5v5M18 9.5v5"/>', 24),
  sube: IC('<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>', 24),
  saco: IC('<path d="M8 4h8l-1 3c3 1.5 5 4.5 5 8 0 3-2.5 5-8 5s-8-2-8-5c0-3.5 2-6.5 5-8z"/><path d="M9 7h6"/>', 24),
  gente: IC('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.6.8 2.6 2.5 3 5.2"/>', 24),
  alerta: IC('<path d="M12 3l9.5 16.5h-19z"/><path d="M12 10v4M12 17.5h.01"/>', 24),
  reloj: IC('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 24),
  hoja: IC('<path d="M5 19c0-8 6-13 15-13-1 9-6 14-13 14"/><path d="M8 17c2.5-4 5.5-7 9-9"/>', 24),
  mapa: IC('<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>', 24),
  doc: IC('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>', 24),
  vacio: '<svg width="88" height="88" viewBox="0 0 88 88" fill="none" aria-hidden="true"><rect x="10" y="18" width="56" height="46" rx="6" stroke="#9aa9a0" stroke-width="4"/><path d="M10 30h56" stroke="#9aa9a0" stroke-width="4"/><circle cx="64" cy="62" r="12" fill="#fff" stroke="#f59e0b" stroke-width="5"/></svg>'
};
const moldeCab = (titulo, acciones = '', volver) => `<div class="moldeCab"><div class="moldeTit">${cabecera(titulo, volver)}</div>${acciones ? `<div class="moldeAcc">${acciones}</div>` : ''}</div>`;
const kpi = (tipo, icono, etiqueta, valor, sub = '') => `<div class="kpi kpi-${tipo}"><span class="kpiIc">${ICK[icono] || ''}</span><span class="kpiTx"><small>${esc(etiqueta)}</small><b>${valor}</b>${sub ? `<em>${sub}</em>` : ''}</span></div>`;
const kpis = lista => `<div class="kpis">${lista.join('')}</div>`;
const pestanas = (lista, act) => `<div class="pestanas" role="tablist">${lista.map(([k, t, n]) => `<button type="button" role="tab" data-pest="${k}" class="${k === act ? 'activa' : ''}" aria-selected="${k === act}">${esc(t)}${n != null ? ` <span class="pestN">${n}</span>` : ''}</button>`).join('')}</div>`;
const vacio = (texto, boton = '') => `<div class="vacio">${ICK.vacio}<p>${texto}</p>${boton}</div>`;
function alPestana(raiz, fn) { raiz.querySelectorAll('[data-pest]').forEach(b => b.onclick = () => { raiz.querySelectorAll('[data-pest]').forEach(x => { x.classList.toggle('activa', x === b); x.setAttribute('aria-selected', x === b); }); fn(b.dataset.pest); }); }
