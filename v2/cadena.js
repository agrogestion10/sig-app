// AgroGestión · Del acopio a la exportación
// Cada entrega cae en un lote; el lote pasa por los procesos, se junta o se divide, y al venderlo
// se sabe de qué productores viene (para el GeoJSON de EUDR solo con esos productores).
'use strict';

const ETAPAS = {
  recibido: ['Recibido', 'Lo que entró del acopio'],
  beneficio: ['Beneficio', 'Despulpado, fermentado y lavado'],
  fermentacion: ['Fermentación', 'En cajones'],
  secado: ['Secado', 'En patio, marquesina o secadora'],
  bodega: ['En bodega', 'Seco, listo para vender o trillar'],
  trillado: ['Trillado (oro)', 'Café oro listo para exportar'],
  vendido: ['Vendido', 'Últimos 60 días']
};
const RUTA_ETAPAS = { 'Café': ['recibido', 'beneficio', 'secado', 'bodega', 'trillado', 'vendido'], 'Cacao': ['recibido', 'fermentacion', 'secado', 'bodega', 'vendido'] };
// En qué forma queda el producto al salir de cada proceso (índice para no ir hacia atrás)
const FORMAS = { 'Café': ['Uva', 'Pergamino húmedo', 'Pergamino seco', 'Oro'], 'Cacao': ['Cacao en baba', 'Cacao fermentado', 'Cacao seco'] };
const FORMA_ETAPA = { 'Café': { recibido: 0, beneficio: 0, secado: 1, bodega: 2, trillado: 3 }, 'Cacao': { recibido: 0, fermentacion: 0, secado: 1, bodega: 2 } };
const idxForma = l => Math.max(0, (FORMAS[l.producto] || []).indexOf(l.forma));
// Equivalente en seco de 1 lb de cada forma (para estimar pesos; se cambian en Configuración)
const seco1 = f => f === 'Cacao fermentado' ? cfgN('FACTOR_CACAO_FERMENTADO', 0.45) : aPergaminoSeco(f, 1);
const lbEstimado = (lb, de, a) => r2(num(lb) * seco1(de) / (seco1(a) || 1));
const qqLb = lb => (num(lb) / 100).toLocaleString('es-HN', { maximumFractionDigits: 2 }) + ' qq';
const chipEtapa = e => `<span class="chipEt et-${e}">${esc((ETAPAS[e] || [e])[0])}</span>`;
const chipsCert = cs => (cs || []).length ? cs.map(c => `<span class="chipCert">${esc(nombreCert(c))}</span>`).join('') : '<span class="chipCert conv">Convencional</span>';
const puedeProceso = () => puede('beneficiado.registrar');
const etapasSiguientes = l => { const r = RUTA_ETAPAS[l.producto] || [], i = r.indexOf(l.etapa), fi = idxForma(l); return r.slice(i + 1).filter(e => e !== 'vendido' && FORMA_ETAPA[l.producto][e] >= fi); };

// Todo lo necesario para saber de qué productores viene cada lote
async function cargarTraza() {
  const [ls, og, ac] = await Promise.all([
    q(sb.from('lotes').select('id,codigo,producto,forma,etapa,peso_lb,estado,certificaciones,fecha,bodega,origen,actualizado').eq('org_id', S.org.id).order('fecha', { ascending: false }).limit(20000)),
    q(sb.from('lote_origen').select('lote_id,padre_id,peso_lb').eq('org_id', S.org.id).limit(50000)),
    q(sb.from('acopio').select('id,lote_id,productor_id,peso_lb,psec_lb,fecha,numero').eq('org_id', S.org.id).not('lote_id', 'is', null).limit(50000))]);
  const porId = Object.fromEntries(ls.map(l => [l.id, l])), padres = {}, hijos = {}, directos = {}, entregas = {};
  og.forEach(o => { (padres[o.lote_id] ||= []).push(o); (hijos[o.padre_id] ||= []).push(o); });
  ac.forEach(a => { const m = directos[a.lote_id] ||= {}; m[a.productor_id] = (m[a.productor_id] || 0) + num(a.psec_lb); (entregas[a.lote_id] ||= []).push(a); });
  const memo = {};
  // Parte de cada productor en el lote (fracciones que suman 1)
  const comp = id => {
    if (memo[id]) return memo[id];
    memo[id] = {};
    const r = {}; let tot = 0;
    const d = directos[id];
    if (d && Object.keys(d).length) Object.entries(d).forEach(([p, v]) => { r[p] = (r[p] || 0) + v; tot += v; });
    else (padres[id] || []).forEach(o => { const c = comp(o.padre_id); Object.entries(c).forEach(([p, f]) => { r[p] = (r[p] || 0) + f * num(o.peso_lb); }); tot += num(o.peso_lb); });
    if (tot > 0) Object.keys(r).forEach(p => r[p] /= tot);
    return (memo[id] = r);
  };
  return { ls, porId, padres, hijos, entregas, comp };
}

// Ventanita para pedir datos (pasar de proceso, dividir, juntar)
function dialogo(titulo, cuerpo, botonTxt, alEnviar) {
  const d = document.createElement('dialog'); d.className = 'dlg';
  d.innerHTML = `<form class="dlgF"><div class="dlgCab"><h2>${esc(titulo)}</h2><button type="button" class="sec chico" data-cerrar aria-label="Cerrar">✕</button></div>${cuerpo}<div class="acciones"><button type="button" class="sec" data-cerrar>Cancelar</button><button>${esc(botonTxt)}</button></div></form>`;
  document.body.append(d); d.showModal();
  const f = d.querySelector('form');
  d.querySelectorAll('[data-cerrar]').forEach(b => b.onclick = () => d.close());
  d.addEventListener('close', () => d.remove());
  f.onsubmit = async ev => { ev.preventDefault(); ocupado(f, true); try { await alEnviar(f); d.close(); } catch (e) { ocupado(f, false); aviso(falla(e), true); } };
  return f;
}

function pasarLote(l, listo) {
  const sig = etapasSiguientes(l);
  if (!sig.length) return aviso('Este lote ya no tiene otro proceso: queda listo para vender.', true);
  const forma = e => FORMAS[l.producto][FORMA_ETAPA[l.producto][e]];
  const f = dialogo(`Pasar el lote ${l.codigo}`, `<p class="nota">Ahora está en <b>${esc(ETAPAS[l.etapa][0])}</b> con ${num(l.peso_lb).toLocaleString('es-HN')} lb de ${esc(l.forma.toLowerCase())}.</p>
    <div class="rejilla"><div><label>Pasa a</label><select name="etapa">${sig.map(e => `<option value="${e}">${esc(ETAPAS[e][0])}</option>`).join('')}</select></div>
    <div><label>Fecha</label><input type="date" name="fecha" value="${hoy()}" required></div>
    <div class="ancho" id="pesoCaja"><label id="pesoTit">Peso que sale (lb)</label><input name="peso" inputmode="decimal"><p class="nota" id="pesoNota"></p></div>
    <div class="ancho"><label>Nota (opcional)</label><input name="nota" placeholder="Secadora 2, humedad 11 %, etc."></div></div>`, 'Pasar', async f => {
    const e = f.etapa.value, nf = forma(e), cambia = nf !== l.forma, p = f.peso.value ? num(f.peso.value) : null;
    if (cambia && !p) throw new Error(`Escribí cuánto pesó al quedar en ${nf.toLowerCase()}.`);
    await q(sb.rpc('lote_avanzar', { p_lote: l.id, p_etapa: e, p_forma: nf, p_peso: p, p_fecha: f.fecha.value, p_nota: f.nota.value || null }));
    aviso(`Lote ${l.codigo} pasó a ${ETAPAS[e][0]}.`); listo();
  });
  const pintar = () => {
    const e = f.etapa.value, nf = forma(e), cambia = nf !== l.forma, est = lbEstimado(l.peso_lb, l.forma, nf);
    $('#pesoTit').textContent = cambia ? `Peso que sale en ${nf.toLowerCase()} (lb)` : 'Peso (lb), si cambió';
    f.peso.required = cambia; f.peso.placeholder = cambia ? 'Estimado ' + est.toLocaleString('es-HN') : num(l.peso_lb).toLocaleString('es-HN');
    $('#pesoNota').innerHTML = cambia ? `Con los factores de Configuración daría unas <b>${est.toLocaleString('es-HN')} lb</b>. Poné lo que pesó de verdad.` : 'Si no lo volviste a pesar, dejalo vacío.';
  };
  f.etapa.onchange = pintar; pintar();
  const rinde = () => { const p = num(f.peso.value); if (!p || forma(f.etapa.value) === l.forma) return pintar(); $('#pesoNota').innerHTML = `Rinde ${(p / num(l.peso_lb) * 100).toFixed(1)} % del peso que entró (estimado ${lbEstimado(l.peso_lb, l.forma, forma(f.etapa.value)).toLocaleString('es-HN')} lb).`; };
  f.peso.oninput = rinde;
}

function dividirLote(l, listo) {
  const f = dialogo(`Dividir el lote ${l.codigo}`, `<p class="nota">Tiene ${num(l.peso_lb).toLocaleString('es-HN')} lb de ${esc(l.forma.toLowerCase())}. Cada parte sale como un lote nuevo que recuerda de qué productores viene. Lo que no repartás se queda en ${esc(l.codigo)}.</p>
    <div class="tabla"><table><thead><tr><th>Parte</th><th>Peso (lb)</th><th>Código (opcional)</th></tr></thead><tbody>
    ${[1, 2, 3, 4].map(i => `<tr><td>${String.fromCharCode(64 + i)}</td><td><input name="p${i}" inputmode="decimal" ${i < 3 ? 'required' : ''}></td><td><input name="c${i}" placeholder="${esc(l.codigo)}-${String.fromCharCode(64 + i)}"></td></tr>`).join('')}
    </tbody></table></div><p class="nota" id="divNota"></p><div class="rejilla"><div><label>Fecha</label><input type="date" name="fecha" value="${hoy()}"></div><div><label>Nota (opcional)</label><input name="nota" placeholder="Para el contrato X"></div></div>`, 'Dividir', async f => {
    const partes = [1, 2, 3, 4].map(i => ({ peso_lb: num(f['p' + i].value), codigo: f['c' + i].value.trim() || null })).filter(x => x.peso_lb > 0);
    if (partes.length < 1) throw new Error('Poné el peso de las partes.');
    await q(sb.rpc('lote_dividir', { p_lote: l.id, p_partes: partes, p_fecha: f.fecha.value, p_nota: f.nota.value || null }));
    aviso(`Lote ${l.codigo} dividido en ${partes.length} parte${partes.length > 1 ? 's' : ''}.`); listo();
  });
  f.oninput = () => { const s = [1, 2, 3, 4].reduce((t, i) => t + num(f['p' + i].value), 0), r = num(l.peso_lb) - s; $('#divNota').innerHTML = s ? (r < -0.5 ? `<span class="error">Las partes suman ${s.toLocaleString('es-HN')} lb, más de lo que tiene el lote.</span>` : `Repartís ${s.toLocaleString('es-HN')} lb · quedan ${Math.max(0, r).toLocaleString('es-HN')} lb en ${esc(l.codigo)}.`) : ''; };
}

function juntarLotes(sel, listo) {
  const formas = new Set(sel.map(l => l.producto + '|' + l.forma)), total = sel.reduce((t, l) => t + num(l.peso_lb), 0);
  const comunes = sel[0].certificaciones.filter(c => sel.every(l => (l.certificaciones || []).includes(c)));
  const pierde = [...new Set(sel.flatMap(l => l.certificaciones || []))].filter(c => !comunes.includes(c));
  if (formas.size > 1) return aviso('Solo se juntan lotes del mismo producto y en la misma forma. Pasalos primero al mismo proceso.', true);
  dialogo(`Juntar ${sel.length} lotes`, `<p>${sel.map(l => `<b>${esc(l.codigo)}</b> (${qqLb(l.peso_lb)})`).join(' + ')} = <b>${qqLb(total)}</b> de ${esc(sel[0].forma.toLowerCase())}.</p>
    <p class="nota">El lote nuevo queda con: ${chipsCert(comunes)}${pierde.length ? `<br><span class="error">Ojo: ${pierde.map(nombreCert).map(esc).join(', ')} no la tienen todos, así que el lote junto ya no la lleva.</span>` : ''}</p>
    <div class="rejilla"><div><label>Código del lote nuevo (opcional)</label><input name="codigo" placeholder="Se pone solo: J${hoy().slice(2).replace(/-/g, '')}-1"></div><div><label>Fecha</label><input type="date" name="fecha" value="${hoy()}"></div>
    <div class="ancho"><label>Nota (opcional)</label><input name="nota" placeholder="Lote para el contrato con …"></div></div>`, 'Juntar', async f => {
    const id = await q(sb.rpc('lote_unir', { p_lotes: sel.map(l => l.id), p_codigo: f.codigo.value.trim() || null, p_fecha: f.fecha.value, p_nota: f.nota.value || null }));
    aviso('Lotes juntados.'); listo(id);
  });
}

// ---------- tablero de procesos ----------
RUTAS.procesos = async function verProcesos(prodSel) {
  const cs = cultivos(), prod = cs.includes(prodSel) ? prodSel : cs[0];
  const hace60 = new Date(Date.now() - 60 * 864e5).toISOString();
  const [tz] = await Promise.all([cargarTraza(), certs()]);
  const ls = tz.ls.filter(l => l.producto === prod && (l.estado === 'abierto' || (l.estado === 'vendido' && l.actualizado >= hace60)));
  const col = RUTA_ETAPAS[prod], de = e => ls.filter(l => l.etapa === e && (e === 'vendido' || num(l.peso_lb) > 0));
  const nP = l => Object.keys(tz.comp(l.id)).length;
  const enProceso = ls.filter(l => l.estado === 'abierto' && !['bodega', 'trillado'].includes(l.etapa) && num(l.peso_lb) > 0);
  const listos = ls.filter(l => l.estado === 'abierto' && ['bodega', 'trillado'].includes(l.etapa) && num(l.peso_lb) > 0);
  const seco = arr => arr.reduce((t, l) => t + num(l.peso_lb) * seco1(l.forma), 0);
  let sel = new Set();
  app().innerHTML = moldeCab('Procesos y lotes', `${puede('acopio.registrar') ? '<a class="boton" href="#/acopio">+ Registrar acopio</a>' : ''}${puedeProceso() ? '<button class="sec" id="juntar" disabled>Juntar lotes</button>' : ''}<a class="boton sec" href="#/lotes">Ver todos los lotes</a>`, '#/') +
    (cs.length > 1 ? pestanas(cs.map(c => [c, c, tz.ls.filter(l => l.producto === c && l.estado === 'abierto' && num(l.peso_lb) > 0).length]), prod) : '') +
    kpis([kpi('ambar', 'reloj', 'En proceso', enProceso.length + ' lotes', qqLb(seco(enProceso)) + ' en ' + secoTxt(prod)),
      kpi('verde', 'saco', 'Listo para vender', qqLb(seco(listos)), listos.length + ' lotes en bodega' + (prod === 'Café' ? ' o trillados' : '')),
      kpi('azul', 'sube', 'Vendido en 60 días', ls.filter(l => l.estado === 'vendido').length + ' lotes', 'Salieron en ventas')]) +
    `<p class="nota">Cada tarjeta es un lote. Tocá <b>Pasar</b> cuando cambie de proceso; marcá varios para <b>juntarlos</b>. Los pesos van en la forma en que está el producto en cada columna.</p>
    <div class="tablero">${col.map(e => { const l2 = de(e), tot = l2.reduce((t, l) => t + num(l.peso_lb), 0); return `<section class="tcol tc-${e}"><div class="tcab"><b>${esc(ETAPAS[e][0])}</b><span>${e === 'vendido' ? l2.length + ' lotes' : qqLb(tot) + ' · ' + l2.length + ' lote' + (l2.length === 1 ? '' : 's')}</span><small>${esc(ETAPAS[e][1])}</small></div>
      ${l2.map(l => `<article class="lcard" data-id="${l.id}">${e !== 'vendido' && puedeProceso() ? `<input type="checkbox" class="lsel" data-sel="${l.id}" aria-label="Elegir ${esc(l.codigo)}">` : ''}
        <a class="lcod" href="#/lote/${encodeURIComponent(l.codigo)}">${esc(l.codigo)}</a>
        <div class="lpeso">${e === 'vendido' ? 'Vendido' : qqLb(l.peso_lb)}</div>
        <div class="nota">${esc(l.forma)} · ${nP(l)} productor${nP(l) === 1 ? '' : 'es'}${l.bodega ? ' · ' + esc(l.bodega) : ''}</div>
        <div class="lcerts">${chipsCert(l.certificaciones)}</div>
        ${e !== 'vendido' ? `<div class="lacc">${puedeProceso() && etapasSiguientes(l).length ? `<button class="chico" data-pasar="${l.id}">Pasar →</button>` : ''}${['bodega', 'trillado'].includes(e) && puede('despacho.registrar') ? `<a class="boton chico" href="#/despacho/${l.id}">Vender</a>` : ''}${puedeProceso() ? `<button class="chico sec" data-div="${l.id}">Dividir</button>` : ''}</div>` : ''}
      </article>`).join('') || `<div class="tvacio">Nada aquí</div>`}</section>`; }).join('')}</div>`;
  const volver = id => RUTAS.procesos(prod);
  if (cs.length > 1) alPestana(app(), k => RUTAS.procesos(k));
  app().querySelectorAll('[data-pasar]').forEach(b => b.onclick = () => pasarLote(tz.porId[b.dataset.pasar], volver));
  app().querySelectorAll('[data-div]').forEach(b => b.onclick = () => dividirLote(tz.porId[b.dataset.div], volver));
  const bj = $('#juntar');
  app().querySelectorAll('[data-sel]').forEach(c => c.onchange = () => { c.checked ? sel.add(c.dataset.sel) : sel.delete(c.dataset.sel); c.closest('.lcard').classList.toggle('elegido', c.checked); if (bj) { bj.disabled = sel.size < 2; bj.textContent = sel.size ? `Juntar ${sel.size} lote${sel.size > 1 ? 's' : ''}` : 'Juntar lotes'; } });
  if (bj) bj.onclick = () => juntarLotes([...sel].map(id => tz.porId[id]), volver);
};
// El inventario por lote ahora es el tablero
RUTAS.inventario = () => { location.hash = '#/procesos'; };

// ---------- lista de lotes (trazabilidad) ----------
RUTAS.lotes = async function verLotes() {
  const [tz] = await Promise.all([cargarTraza(), certs()]);
  const ls = tz.ls, abiertos = ls.filter(l => l.estado === 'abierto' && num(l.peso_lb) > 0), vend = ls.filter(l => l.estado === 'vendido'), cerr = ls.filter(l => ['unido', 'dividido'].includes(l.estado));
  let pest = 'ab';
  app().innerHTML = moldeCab('Trazabilidad por lote', '<a class="boton sec" href="#/procesos">Ver el tablero</a>') + `<div class="barraFiltros"><input id="bus" class="busca" type="search" placeholder="Buscar lote, forma o bodega"></div>
  ${kpis([kpi('azul', 'doc', 'Lotes con producto', abiertos.length), kpi('verde', 'sube', 'Lotes vendidos', vend.length), kpi('gris', 'hoja', 'Juntados o divididos', cerr.length, 'Siguen en otros lotes'), kpi('verde', 'gente', 'Productores con producto en bodega o proceso', new Set(abiertos.flatMap(l => Object.keys(tz.comp(l.id)))).size)])}
  ${pestanas([['ab', 'Con producto', abiertos.length], ['vend', 'Vendidos', vend.length], ['cerr', 'Juntados o divididos', cerr.length], ['todos', 'Todos', ls.length]], pest)}<div id="lista"></div>`;
  const pintar = () => {
    const t = norm($('#bus').value), base = pest === 'ab' ? abiertos : pest === 'vend' ? vend : pest === 'cerr' ? cerr : ls;
    const f = base.filter(l => !t || norm(l.codigo + l.forma + (l.bodega || '')).includes(t)).slice(0, 500);
    $('#lista').innerHTML = !f.length ? vacio(ls.length ? 'No hay lotes con ese filtro.' : 'Todavía no hay lotes. Se arman solos al registrar el acopio.', '<a class="boton" href="#/acopio">Registrar acopio</a>') : `<div class="tabla"><table><thead><tr><th>Lote</th><th>Fecha</th><th>Producto</th><th>Proceso</th><th class="n">Peso (lb)</th><th class="n">Productores</th><th>Certificaciones</th><th>Viene de</th></tr></thead><tbody>
    ${f.map(l => `<tr><td><a href="#/lote/${encodeURIComponent(l.codigo)}"><b>${esc(l.codigo)}</b></a></td><td>${esc(l.fecha)}</td><td>${esc(l.forma)}</td><td>${l.estado === 'abierto' ? chipEtapa(l.etapa) : esc(l.estado === 'unido' ? 'Juntado' : l.estado === 'dividido' ? 'Dividido' : 'Vendido')}</td><td class="n">${num(l.peso_lb).toLocaleString('es-HN')}</td><td class="n">${Object.keys(tz.comp(l.id)).length}</td><td>${chipsCert(l.certificaciones)}</td><td>${l.origen === 'acopio' ? 'Acopio' : (tz.padres[l.id] || []).map(o => esc(tz.porId[o.padre_id]?.codigo || '')).join(', ')}</td></tr>`).join('')}</tbody></table></div>`;
  };
  alPestana(app(), k => { pest = k; pintar(); }); $('#bus').oninput = pintar; pintar();
};

// ---------- un lote: recorrido, de dónde viene y sus productores ----------
const verLoteViejo = RUTAS.lote;
RUTAS.lote = async function verLoteCadena(codigo) {
  const cod = String(codigo || '').toUpperCase();
  const l0 = (await q(sb.from('lotes').select('*').eq('org_id', S.org.id).eq('codigo', cod).limit(1)))[0];
  if (!l0) return verLoteViejo(codigo);
  const [tz, mov, ps] = await Promise.all([cargarTraza(), q(sb.from('lote_movimientos').select('*').eq('lote_id', l0.id).order('creado')), prods(), certs()]);
  const l = { ...tz.porId[l0.id], ...l0 }, comp = tz.comp(l.id), prodDe = Object.fromEntries(ps.map(p => [p.id, p]));
  const filasP = Object.entries(comp).sort((a, b) => b[1] - a[1]);
  const ids = filasP.map(([p]) => p);
  const parc = ids.length ? (await parcelasOrg().catch(() => [])).filter(p => ids.includes(p.productor_id)) : [];
  const malas = parc.filter(p => revisarEudr(p).some(x => x[0] === 'error')).length;
  const vivo = l.estado === 'abierto' && num(l.peso_lb) > 0, refrescar = () => RUTAS.lote(l.codigo);
  const pesoOrig = mov.find(m => ['acopio', 'union', 'division'].includes(m.tipo))?.peso_despues_lb;
  const que = m => ({ acopio: 'Entrega de acopio', etapa: 'Cambió de proceso', union: m.otro_lote ? 'Se juntó con otros' : 'Se armó juntando lotes', division: m.otro_lote ? 'Salió de dividir otro lote' : 'Se dividió', venta: 'Venta', ajuste: 'Ajuste' })[m.tipo] || m.tipo;
  app().innerHTML = moldeCab('Lote ' + l.codigo, [vivo && puedeProceso() && etapasSiguientes(l).length ? '<button id="pasar">Pasar al siguiente proceso</button>' : '',
    vivo && ['bodega', 'trillado'].includes(l.etapa) && puede('despacho.registrar') ? `<a class="boton" href="#/despacho/${l.id}">Vender</a>` : '',
    vivo && puedeProceso() ? '<button class="sec" id="dividir">Dividir</button>' : '', '<button class="sec" onclick="print()">Imprimir</button>'].join(''), '#/procesos') +
    kpis([kpi(vivo ? 'verde' : 'gris', 'saco', vivo ? 'Tiene ahora' : 'Estado', vivo ? qqLb(l.peso_lb) : (l.estado === 'unido' ? 'Juntado' : l.estado === 'dividido' ? 'Dividido' : 'Vendido'), esc(l.forma)),
      kpi('ambar', 'reloj', 'Proceso', esc(ETAPAS[l.etapa]?.[0] || l.etapa), pesoOrig ? 'Empezó con ' + num(pesoOrig).toLocaleString('es-HN') + ' lb' : ''),
      kpi('azul', 'gente', 'Productores', filasP.length, parc.length + ' parcelas'),
      kpi(malas ? 'rojo' : 'verde', 'mapa', 'EUDR', malas ? malas + ' parcelas no cumplen' : 'Sin problemas', 'Revisión de las parcelas')]) +
    `<div class="caja"><b>Certificaciones:</b> ${chipsCert(l.certificaciones)}${l.bodega ? ` · <b>Bodega:</b> ${esc(l.bodega)}` : ''}${l.nota ? `<br><span class="nota">${esc(l.nota)}</span>` : ''}</div>
    ${(tz.padres[l.id] || []).length ? `<h2>De dónde viene</h2><div class="tabla"><table><thead><tr><th>Lote</th><th class="n">Puso (lb)</th><th>Forma</th></tr></thead><tbody>${tz.padres[l.id].map(o => { const p = tz.porId[o.padre_id] || {}; return `<tr><td><a href="#/lote/${encodeURIComponent(p.codigo || '')}">${esc(p.codigo || '')}</a></td><td class="n">${num(o.peso_lb).toLocaleString('es-HN')}</td><td>${esc(p.forma || '')}</td></tr>`; }).join('')}</tbody></table></div>` : ''}
    ${(tz.hijos[l.id] || []).length ? `<h2>En qué se convirtió</h2><div class="tabla"><table><thead><tr><th>Lote</th><th class="n">Se llevó (lb)</th><th>Proceso</th></tr></thead><tbody>${tz.hijos[l.id].map(o => { const h = tz.porId[o.lote_id] || {}; return `<tr><td><a href="#/lote/${encodeURIComponent(h.codigo || '')}">${esc(h.codigo || '')}</a></td><td class="n">${num(o.peso_lb).toLocaleString('es-HN')}</td><td>${h.estado === 'abierto' ? chipEtapa(h.etapa) : esc(h.estado || '')}</td></tr>`; }).join('')}</tbody></table></div>` : ''}
    <h2>Recorrido</h2><div class="tabla"><table><thead><tr><th>Fecha</th><th>Qué pasó</th><th>Proceso</th><th class="n">Antes (lb)</th><th class="n">Después (lb)</th><th>Detalle</th></tr></thead><tbody>
    ${mov.map(m => `<tr><td>${esc(m.fecha)}</td><td>${esc(que(m))}</td><td>${m.de_etapa && m.a_etapa && m.de_etapa !== m.a_etapa ? esc((ETAPAS[m.de_etapa] || [m.de_etapa])[0]) + ' → ' + esc((ETAPAS[m.a_etapa] || [m.a_etapa])[0]) : esc((ETAPAS[m.a_etapa || m.de_etapa] || [''])[0])}</td><td class="n">${m.peso_antes_lb != null ? num(m.peso_antes_lb).toLocaleString('es-HN') : ''}</td><td class="n">${m.peso_despues_lb != null ? num(m.peso_despues_lb).toLocaleString('es-HN') : ''}</td><td>${m.forma_antes && m.forma_despues && m.forma_antes !== m.forma_despues ? esc(m.forma_antes + ' → ' + m.forma_despues) + (num(m.peso_antes_lb) ? ` (rinde ${(num(m.peso_despues_lb) / num(m.peso_antes_lb) * 100).toFixed(1)} %)` : '') + ' · ' : ''}${m.despacho_id ? `<a href="#/eudr/${m.despacho_id}">${esc(m.nota || 'Ver venta')}</a>` : esc(m.nota || '')}</td></tr>`).join('')}</tbody></table></div>
    <h2>Productores de este lote</h2><p class="nota">La parte de cada uno sale de lo que entregó, siguiendo cada vez que el lote se juntó o se dividió.</p><div class="tabla"><table><thead><tr><th>Productor</th><th>Comunidad</th><th class="n">Parte del lote</th><th class="n">${vivo ? 'Equivale hoy a (lb)' : 'Parte'}</th><th class="n">Parcelas</th></tr></thead><tbody>
    ${filasP.map(([p, fr]) => { const x = prodDe[p] || {}; return `<tr><td><a href="#/prod/${p}">${esc(x.codigo || '')} ${esc(x.nombre || '')}</a></td><td>${esc(x.comunidad || '')}</td><td class="n">${(fr * 100).toFixed(1)} %</td><td class="n">${vivo ? r2(fr * num(l.peso_lb)).toLocaleString('es-HN') : ''}</td><td class="n">${parc.filter(z => z.productor_id === p).length}</td></tr>`; }).join('') || '<tr><td colspan="5" class="nota">No se encontraron entregas para este lote.</td></tr>'}</tbody></table></div>`;
  if ($('#pasar')) $('#pasar').onclick = () => pasarLote(l, refrescar);
  if ($('#dividir')) $('#dividir').onclick = () => dividirLote(l, refrescar);
};

// ---------- venta: sale de lotes y lleva sus productores ----------
RUTAS.despacho = async function formVenta(loteSel) {
  const [cs, desp, tz, ps] = await Promise.all([certs(), q(sb.from('despachos').select('*').eq('org_id', S.org.id).order('fecha', { ascending: false }).limit(100)), cargarTraza(), prods()]);
  const anio = new Date().getFullYear(), parcs = await parcelasOrg().catch(() => []);
  const dAn = desp.filter(x => String(x.fecha || '').startsWith(String(anio))), porDeclarar = desp.filter(x => !x.dds_numero).length;
  const disp = tz.ls.filter(l => l.estado === 'abierto' && num(l.peso_lb) > 0 && ['bodega', 'trillado'].includes(l.etapa));
  const pre = tz.porId[loteSel];
  const tipos = [...(cultivos().includes('Café') ? ['Oro', 'Pergamino seco'] : []), ...(cultivos().includes('Cacao') ? ['Cacao seco'] : [])];
  const prodDe = Object.fromEntries(ps.map(p => [p.id, p]));
  app().innerHTML = moldeCab('Ventas y exportación', '<a class="boton sec" href="#/procesos">Procesos y lotes</a><a class="boton sec" href="#/balance">Balance de masas</a>') + kpis([
    kpi('azul', 'doc', 'Ventas ' + anio, dAn.length, desp.length + ' en total'),
    kpi('verde', 'saco', 'Vendido ' + anio, (dAn.reduce((t, x) => t + num(x.psec_lb), 0) / 100).toLocaleString('es-HN', { maximumFractionDigits: 1 }) + ' qq', 'Equivalente seco'),
    kpi('verde', 'dinero', 'Prima generada ' + anio, '$' + dAn.reduce((t, x) => t + num(x.prima_usd), 0).toLocaleString('en-US', { maximumFractionDigits: 2 }), 'Comercio Justo'),
    kpi(porDeclarar ? 'ambar' : 'verde', 'mapa', 'EUDR por declarar', porDeclarar, porDeclarar ? 'Ventas sin número de declaración' : 'Todas declaradas')]) +
  (puede('despacho.registrar') ? `<h2>Registrar una venta</h2><form class="caja" id="f"><div class="rejilla">
    <div><label>Fecha</label><input type="date" name="fecha" required value="${hoy()}"></div>
    <div><label>Contrato</label><input name="contrato"></div><div><label>Comprador</label><input name="comprador" required></div>
    <div><label>Certificación con la que se vende</label><select name="certificacion"><option value="">Convencional</option>${cs.map(c => `<option value="${esc(c.codigo)}">${esc(c.nombre)}</option>`).join('')}</select></div>
    <div><label>Qué se vende</label><select name="tipo_cafe">${opciones(tipos, pre && tipos.includes(pre.forma) ? pre.forma : tipos[0])}</select></div>
    <div><label>Precio (USD por libra)</label><input name="precio_usd_lb" inputmode="decimal"></div>
  </div>
  <h3>1. Lotes que salen</h3><div id="lotesV"></div>
  <div class="rejilla" style="margin-top:8px"><div><label>Peso total (libras)</label><input name="peso_lb" required inputmode="decimal"><p class="nota" id="pesoNota"></p></div></div>
  <h3>2. Productores de esta venta</h3><p class="nota">Salen solos de los lotes elegidos. Podés quitar o agregar productores; el GeoJSON para EUDR lleva solo las parcelas de los que queden marcados.</p>
  <div id="prodV"></div>
  <div class="filtros" style="margin-top:8px">${campoProd(ps, null, 'extra').replace(' required', '')}<button type="button" class="sec" id="agrProd">Agregar productor</button></div>
  <p class="nota" id="calc"></p><div class="acciones"><button>Registrar venta</button></div></form>` : '') +
  `<h2>Ventas registradas</h2><div class="tabla"><table><thead><tr><th>Número</th><th>Fecha</th><th>Comprador</th><th>Certificación</th><th class="n">Peso (lb)</th><th class="n">Productores</th><th class="n">Prima (USD)</th><th>EUDR</th></tr></thead><tbody>
  ${desp.map(x => `<tr><td>${esc(x.numero)}</td><td>${esc(x.fecha)}</td><td>${esc(x.comprador)}</td><td>${esc(nombreCert(x.certificacion))}</td><td class="n">${num(x.peso_lb).toLocaleString('es-HN')} ${esc(x.tipo_cafe)}</td><td class="n">${(x.productores || []).length || ''}</td><td class="n">${num(x.prima_usd).toFixed(2)}</td><td><a href="#/eudr/${x.id}">${x.dds_numero ? 'Declarado' : 'Revisar y descargar GeoJSON'}</a></td></tr>`).join('') || `<tr><td colspan="8">${vacio('Todavía no hay ventas.')}</td></tr>`}</tbody></table></div>`;
  const f = $('#f'); if (!f) return;
  const elegidos = new Map(pre ? [[pre.id, num(pre.peso_lb)]] : []), quitados = new Set(), agregados = new Set();
  const calc = d => { if (productoDe(d.tipo_cafe) === 'Cacao') return { ps: r2(num(d.peso_lb)), prima: d.certificacion === 'fairtrade' ? r2(num(d.peso_lb) * cfgN('PRIMA_FT_CACAO_USD_LB', 0.11)) : 0 }; const ps2 = d.tipo_cafe === 'Oro' ? num(d.peso_lb) / cfgN('RENDIMIENTO_PERGAMINO_ORO', 0.8) : num(d.peso_lb); const oro = d.tipo_cafe === 'Oro' ? num(d.peso_lb) : num(d.peso_lb) * cfgN('RENDIMIENTO_PERGAMINO_ORO', 0.8); return { ps: r2(ps2), prima: d.certificacion === 'fairtrade' ? r2(oro * cfgN('PRIMA_FT_USD_LB', 0.2)) : 0 }; };
  // Productores que salen de los lotes elegidos, con su parte estimada en libras
  const prodsVenta = () => { const r = {}; elegidos.forEach((lb, id) => Object.entries(tz.comp(id)).forEach(([p, fr]) => r[p] = (r[p] || 0) + fr * lb)); agregados.forEach(p => r[p] = r[p] || 0); return r; };
  const pintarLotes = () => {
    const forma = f.tipo_cafe.value, lista = disp.filter(l => l.forma === forma), cert = f.certificacion.value;
    [...elegidos.keys()].forEach(id => { if (tz.porId[id]?.forma !== forma) elegidos.delete(id); });
    $('#lotesV').innerHTML = !lista.length ? `<div class="caja nota">No hay lotes de ${esc(forma.toLowerCase())} en bodega. Pasalos a «${forma === 'Oro' ? 'Trillado (oro)' : 'En bodega'}» en <a href="#/procesos">Procesos</a>, o registrá la venta sin lotes y agregá los productores a mano.</div>`
      : `<div class="tabla"><table><thead><tr><th></th><th>Lote</th><th>Certificaciones</th><th class="n">Hay (lb)</th><th class="n">Sale (lb)</th><th class="n">Productores</th></tr></thead><tbody>${lista.map(l => `<tr><td><input type="checkbox" data-lv="${l.id}" ${elegidos.has(l.id) ? 'checked' : ''} style="width:auto"></td><td><a href="#/lote/${encodeURIComponent(l.codigo)}">${esc(l.codigo)}</a></td><td>${chipsCert(l.certificaciones)}${cert && !(l.certificaciones || []).includes(cert) ? ` <span class="error">no tiene ${esc(nombreCert(cert))}</span>` : ''}</td><td class="n">${num(l.peso_lb).toLocaleString('es-HN')}</td><td class="n"><input data-lvp="${l.id}" inputmode="decimal" style="max-width:110px;text-align:right" value="${elegidos.has(l.id) ? elegidos.get(l.id) : ''}" ${elegidos.has(l.id) ? '' : 'disabled'}></td><td class="n">${Object.keys(tz.comp(l.id)).length}</td></tr>`).join('')}</tbody></table></div>`;
    $('#lotesV').querySelectorAll('[data-lv]').forEach(c => c.onchange = () => { const l = tz.porId[c.dataset.lv]; c.checked ? elegidos.set(l.id, num(l.peso_lb)) : elegidos.delete(l.id); pintarLotes(); });
    $('#lotesV').querySelectorAll('[data-lvp]').forEach(i => i.oninput = () => { const l = tz.porId[i.dataset.lvp], v = num(i.value); elegidos.set(l.id, Math.min(v, num(l.peso_lb))); sumar(); pintarProds(); });
    sumar(); pintarProds();
  };
  const sumar = () => { if (!elegidos.size) { f.peso_lb.readOnly = false; $('#pesoNota').textContent = 'Sin lotes: escribí el peso.'; return; } const s = [...elegidos.values()].reduce((t, v) => t + v, 0); f.peso_lb.value = r2(s); f.peso_lb.readOnly = true; $('#pesoNota').textContent = `Suma de ${elegidos.size} lote${elegidos.size > 1 ? 's' : ''}.`; calcular(); };
  const pintarProds = () => {
    const r = prodsVenta(), filas = Object.entries(r).sort((a, b) => b[1] - a[1]);
    const n = filas.filter(([p]) => !quitados.has(p)).length;
    $('#prodV').innerHTML = !filas.length ? '<div class="caja nota">Elegí lotes o agregá productores.</div>' : `<p><b>${n}</b> productor${n === 1 ? '' : 'es'} marcados.</p><div class="tabla"><table><thead><tr><th></th><th>Productor</th><th>Comunidad</th><th class="n">Parte estimada (lb)</th><th class="n">Parcelas</th><th>Para EUDR</th></tr></thead><tbody>${filas.map(([p, lb]) => { const x = prodDe[p] || {}, pa = parcs.filter(z => z.productor_id === p), mal = pa.filter(z => revisarEudr(z).some(y => y[0] === 'error')).length, sinU = pa.filter(z => !z.poligono && z.lat == null).length; return `<tr${quitados.has(p) ? ' style="opacity:.45"' : ''}><td><input type="checkbox" data-pv="${p}" ${quitados.has(p) ? '' : 'checked'} style="width:auto"></td><td>${esc(x.codigo || '')} ${esc(x.nombre || '')}</td><td>${esc(x.comunidad || '')}</td><td class="n">${lb ? r2(lb).toLocaleString('es-HN') : 'Agregado'}</td><td class="n">${pa.length}</td><td>${!pa.length ? '<span class="error">Sin parcelas</span>' : sinU ? `<span class="error">${sinU} sin ubicación</span>` : mal ? `<span class="error">${mal} no cumple${mal > 1 ? 'n' : ''}</span>` : '<span class="ok">Listo</span>'}</td></tr>`; }).join('')}</tbody></table></div>`;
    $('#prodV').querySelectorAll('[data-pv]').forEach(c => c.onchange = () => { c.checked ? quitados.delete(c.dataset.pv) : quitados.add(c.dataset.pv); pintarProds(); });
  };
  const calcular = async () => { const d = datosForm(f), c = calc(d); if (!num(d.peso_lb)) return $('#calc').textContent = ''; const di = await disponibleCert(d.certificacion, +d.fecha.slice(0, 4) || anio, productoDe(d.tipo_cafe)); $('#calc').innerHTML = `Equivale a ${c.ps.toLocaleString('es-HN')} lb de ${secoTxt(productoDe(d.tipo_cafe))} · disponible en ${esc(nombreCert(d.certificacion))}: ${di.toLocaleString('es-HN')} lb${c.ps > di ? ' <b class="error">— no alcanza (sobreventa)</b>' : ''}${c.prima ? ` · prima de Comercio Justo: <b>USD ${c.prima.toFixed(2)}</b>` : ''}`; };
  f.tipo_cafe.onchange = pintarLotes; f.certificacion.onchange = () => { pintarLotes(); calcular(); }; f.peso_lb.oninput = calcular; f.fecha.onchange = calcular;
  $('#agrProd').onclick = () => { const p = leerProd(ps, f.extra_txt.value); if (!p) return aviso('Elegí un productor de la lista.', true); agregados.add(p.id); quitados.delete(p.id); f.extra_txt.value = ''; pintarProds(); };
  pintarLotes();
  f.onsubmit = async ev => {
    ev.preventDefault(); const d = datosForm(f), c = calc(d), pr = productoDe(d.tipo_cafe), di = await disponibleCert(d.certificacion, +d.fecha.slice(0, 4), pr);
    if (!num(d.peso_lb)) return aviso('Falta el peso.', true);
    if (d.certificacion && c.ps > di + 0.5) return aviso(`No se puede vender más ${pr.toLowerCase()} ${nombreCert(d.certificacion)} del que se compró (disponible ${di.toLocaleString('es-HN')} lb de ${secoTxt(pr)}).`, true);
    const productores = Object.keys(prodsVenta()).filter(p => !quitados.has(p));
    if (!productores.length && !confirm('La venta no lleva productores, así que no se podrá armar el GeoJSON para EUDR. ¿Registrarla así?')) return;
    const det = [...elegidos].filter(([, lb]) => lb > 0).map(([id, lb]) => ({ lote_id: id, codigo: tz.porId[id].codigo, peso_lb: r2(lb) }));
    ocupado(f, true);
    try {
      const r = await q(sb.rpc('lote_vender', { p_desp: { org_id: S.org.id, fecha: d.fecha, contrato: d.contrato, comprador: d.comprador, certificacion: d.certificacion || null, certificaciones: d.certificacion ? [d.certificacion] : [], tipo_cafe: d.tipo_cafe, producto: pr, peso_lb: num(d.peso_lb), psec_lb: c.ps, precio_usd_lb: d.precio_usd_lb ? num(d.precio_usd_lb) : null, prima_usd: c.prima }, p_det: det, p_productores: productores }));
      aviso('Venta registrada: ' + r.numero + '. Ahora revisá las parcelas y descargá el GeoJSON.'); location.hash = '#/eudr/' + r.id;
    } catch (e) { ocupado(f, false); aviso(falla(e), true); }
  };
};

['procesos'].forEach(r => SECCION_DE[r] = 'cer');
GUIA_DE.procesos = 'cadena'; GUIA_DE.lotes = 'cadena'; GUIA_DE.lote = 'cadena'; GUIA_DE.despacho = 'cadena';
