// SIG · Carga masiva desde Excel o CSV: plantilla para descargar, revisión fila por fila y guardado en bloque
'use strict';

const XLSX_URL = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
async function libExcel() {
  if (window.XLSX) return window.XLSX;
  await new Promise((ok, mal) => { const s = document.createElement('script'); s.src = XLSX_URL; s.onload = ok; s.onerror = () => mal(new Error('No se pudo cargar el lector de Excel. Revisá la señal.')); document.head.appendChild(s); });
  return window.XLSX;
}

// ---------- lectura de valores ----------
const fechaISO = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
function leerFecha(v) {
  if (v === '' || v == null) return null;
  if (v instanceof Date) return isNaN(v) ? undefined : fechaISO(v);
  if (typeof v === 'number' && v > 20000 && v < 80000) return fechaISO(new Date(Math.round((v - 25569) * 864e5) + new Date().getTimezoneOffset() * 6e4));
  const s = String(v).trim();
  let m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/); if (m) return valida(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/); if (m) return valida(m[3].length === 2 ? 2000 + +m[3] : +m[3], +m[2], +m[1]);
  return undefined;
}
function valida(a, me, d) { const f = new Date(a, me - 1, d); return f.getFullYear() === a && f.getMonth() === me - 1 && f.getDate() === d ? fechaISO(f) : undefined; }
const leerNum = v => { if (v === '' || v == null) return null; if (typeof v === 'number') return v; const s = String(v).trim().replace(/\s/g, ''); const n = Number(/,\d{1,2}$/.test(s) && !s.includes('.') ? s.replace(',', '.') : s.replace(/,/g, '')); return isFinite(n) ? n : undefined; };
const texto = v => v == null ? '' : v instanceof Date ? fechaISO(v) : String(v).trim();

// Busca un productor por código, identidad o nombre exacto
function buscadorProd(lista) {
  const cod = {}, idn = {}, nom = {};
  lista.forEach(p => { if (p.codigo) cod[norm(p.codigo)] = p; if (p.identidad) idn[p.identidad.replace(/\D/g, '')] = p; (nom[norm(p.nombre)] ||= []).push(p); });
  return v => {
    const t = texto(v); if (!t) return { err: 'Falta el productor' };
    const p = cod[norm(t)] || (t.replace(/\D/g, '').length === 13 && idn[t.replace(/\D/g, '')]);
    if (p) return { p };
    const n = nom[norm(t)]; if (n?.length === 1) return { p: n[0] }; if (n?.length > 1) return { err: `Hay ${n.length} productores llamados «${t}»: usá el código` };
    return { err: `No se encontró el productor «${t}» (poné el código de socio)` };
  };
}
// Certificaciones escritas por código o por nombre, separadas por coma
function leerCerts(v, cs) {
  const ok = [], malas = [];
  lista(texto(v)).forEach(x => { const c = cs.find(c => norm(c.codigo) === norm(x) || norm(c.nombre) === norm(x)); c ? ok.includes(c.codigo) || ok.push(c.codigo) : malas.push(x); });
  return { ok, malas };
}

// ---------- tipos de carga ----------
// Cada columna: k (campo), t (encabezado), req, tipo (texto, num, fecha, lista, certs, prod), ops, ayuda, ej
const TIPOS_CARGA = {
  productores: {
    sec: 'cer', titulo: 'Productores', volver: '#/padron',
    nota: 'Si el código de socio o la identidad ya existen, se actualizan los datos de ese productor con lo que venga lleno. Si el código va vacío, el sistema le pone uno.',
    cols: () => [
      { k: 'codigo', t: 'Código de socio', ayuda: 'Vacío = el sistema le pone el siguiente (PRD-0001…)', ej: 'PRD-0101' },
      { k: 'nombre', t: 'Nombre completo', req: 1, ej: 'María Elena López Cruz' },
      { k: 'identidad', t: 'Número de identidad', ayuda: '13 dígitos, con o sin guiones', ej: '0801-1980-12345' },
      { k: 'sexo', t: 'Sexo', tipo: 'lista', ops: ['Mujer', 'Hombre'], ej: 'Mujer' },
      { k: 'fecha_nacimiento', t: 'Fecha de nacimiento', tipo: 'fecha', ej: '15/03/1980' },
      { k: 'telefono', t: 'Teléfono', ej: '9999-0000' },
      { k: 'comunidad', t: 'Comunidad o aldea', ej: 'El Rosario' },
      { k: 'municipio', t: 'Municipio', ej: 'Olanchito' },
      { k: 'departamento', t: 'Departamento', ej: 'Yoro' },
      { k: 'cultivo', t: 'Cultivo', tipo: 'lista', ops: cultivos(), ayuda: 'Vacío = ' + cultivos()[0], ej: cultivos()[0] },
      { k: 'fecha_ingreso', t: 'Fecha de ingreso a la organización', tipo: 'fecha', ej: '01/02/2015' },
      { k: 'certificaciones', t: 'Certificaciones', tipo: 'certs', ayuda: 'Separadas por coma, con el nombre o el código', ej: 'Orgánico UE, Comercio Justo (Fairtrade)' }
    ],
    async preparar(filas, cols) {
      const [cs, ex] = await Promise.all([certs(), q(sb.from('productores').select('id,codigo,identidad,nombre').eq('org_id', S.org.id))]);
      const cod = {}, idn = {}; ex.forEach(p => { if (p.codigo) cod[norm(p.codigo)] = p; if (p.identidad) idn[p.identidad.replace(/\D/g, '')] = p; });
      const vistos = {};
      return filas.map(f => {
        const r = { d: {}, err: [], av: [] }, v = f.v;
        ['codigo', 'nombre', 'telefono', 'comunidad', 'municipio', 'departamento'].forEach(k => { if (texto(v[k])) r.d[k] = texto(v[k]); });
        if (!r.d.nombre) r.err.push('Falta el nombre');
        if (texto(v.identidad)) { const d = texto(v.identidad).replace(/\D/g, ''); d.length === 13 ? r.d.identidad = `${d.slice(0, 4)}-${d.slice(4, 8)}-${d.slice(8)}` : r.err.push('La identidad debe tener 13 dígitos'); }
        cols.filter(c => c.tipo === 'lista').forEach(c => { const t = texto(v[c.k]); if (!t) return; const o = c.ops.find(x => norm(x) === norm(t)); o ? r.d[c.k] = o : r.err.push(`${c.t}: «${t}» no es válido (${c.ops.join(' o ')})`); });
        cols.filter(c => c.tipo === 'fecha').forEach(c => { const x = leerFecha(v[c.k]); x === undefined ? r.err.push(`${c.t}: fecha no válida`) : x && (r.d[c.k] = x); });
        if (texto(v.certificaciones)) { const c = leerCerts(v.certificaciones, cs); r.d.certificaciones = c.ok; if (c.malas.length) r.err.push('Certificación no encontrada: ' + c.malas.join(', ')); }
        const prev = (r.d.codigo && cod[norm(r.d.codigo)]) || (r.d.identidad && idn[r.d.identidad.replace(/\D/g, '')]);
        const clave = r.d.codigo ? 'c' + norm(r.d.codigo) : r.d.identidad ? 'i' + r.d.identidad : '';
        if (clave && vistos[clave]) r.err.push(`Repetido en la fila ${vistos[clave]}`); else if (clave) vistos[clave] = f.n;
        if (prev) { r.id = prev.id; r.accion = 'Actualiza'; if (prev.codigo && r.d.codigo && norm(prev.codigo) !== norm(r.d.codigo)) r.err.push(`Esa identidad ya es de ${prev.codigo} · ${prev.nombre}`); }
        else { r.accion = 'Nuevo'; if (!r.d.cultivo) r.d.cultivo = cultivos()[0]; }
        r.ver = [r.d.codigo || '(nuevo código)', r.d.nombre, r.d.comunidad];
        return r;
      });
    },
    async guardar(listos) {
      const nuevos = listos.filter(r => !r.id).map(r => ({ ...r.d, org_id: S.org.id, certificaciones: r.d.certificaciones || [] }));
      const cambios = listos.filter(r => r.id).map(r => ({ id: r.id, d: { ...r.d, actualizado: new Date().toISOString() } }));
      await insertarEnBloques('productores', nuevos); await actualizarUno('productores', cambios); await prods(true);
    }
  },

  parcelas: {
    sec: 'cer', titulo: 'Parcelas', volver: '#/padron',
    nota: 'Si el productor ya tiene una parcela con el mismo nombre, se actualiza. Las de 4 ha o más necesitan polígono para EUDR: se pueden subir sin él, pero quedan marcadas en el padrón.',
    cols: () => [
      { k: 'productor', t: 'Productor', req: 1, tipo: 'prod', ayuda: 'Código de socio (o identidad, o nombre si no se repite)', ej: 'PRD-0101' },
      { k: 'nombre', t: 'Nombre de la parcela', req: 1, ej: 'La Esperanza' },
      { k: 'area_ha', t: 'Área (hectáreas)', req: 1, tipo: 'num', ej: '1.75' },
      { k: 'lat', t: 'Latitud', tipo: 'num', ayuda: 'Grados decimales, ej. 14.912345', ej: '15.412345' },
      { k: 'lon', t: 'Longitud', tipo: 'num', ayuda: 'Grados decimales con signo menos, ej. -86.123456', ej: '-86.712345' },
      { k: 'altitud', t: 'Altitud (msnm)', tipo: 'num', ej: '850' },
      { k: 'variedad', t: 'Variedad', ej: cultivos()[0] === 'Cacao' ? 'Trinitario' : 'Catuaí' },
      { k: 'anio_siembra', t: 'Año de siembra', tipo: 'num', ej: '2012' },
      { k: 'sombra', t: 'Sombra', tipo: 'lista', ops: ['Sin sombra', 'Sombra regulada', 'Sombra diversificada', 'Bosque'], ej: 'Sombra diversificada' },
      { k: 'estimado_qq', t: 'Estimado de cosecha (qq)', tipo: 'num', ej: '12' },
      { k: 'ultima_prohibida', t: 'Fecha del último producto prohibido', tipo: 'fecha', ayuda: 'Vacía si nunca se aplicó', ej: '' },
      { k: 'poligono', t: 'Polígono (GeoJSON)', ayuda: 'Opcional: el texto GeoJSON del polígono (Polygon o MultiPolygon)', ej: '' }
    ],
    async preparar(filas, cols) {
      const [ps, ex] = await Promise.all([q(sb.from('productores').select('id,codigo,identidad,nombre').eq('org_id', S.org.id)), parcelasOrg(true)]);
      const buscar = buscadorProd(ps), vistos = {};
      return filas.map(f => {
        const r = { d: { datos: {} }, err: [], av: [] }, v = f.v, b = buscar(v.productor);
        if (b.err) r.err.push(b.err); else r.d.productor_id = b.p.id;
        r.d.nombre = texto(v.nombre); if (!r.d.nombre) r.err.push('Falta el nombre de la parcela');
        numeros(r, v, cols, ['area_ha', 'lat', 'lon', 'altitud', 'anio_siembra', 'estimado_qq']);
        if (!(r.d.area_ha > 0)) r.err.push('El área debe ser mayor que cero');
        if (r.d.estimado_qq != null) { r.d.datos.estimado_qq = r.d.estimado_qq; delete r.d.estimado_qq; }
        if ((r.d.lat == null) !== (r.d.lon == null)) r.err.push('Poné latitud y longitud juntas');
        if (r.d.lat != null && (r.d.lat < 12.9 || r.d.lat > 16.6 || r.d.lon > -82.9 || r.d.lon < -89.5)) r.err.push('Las coordenadas no caen en Honduras (la longitud lleva signo menos)');
        listas(r, v, cols);
        const up = leerFecha(v.ultima_prohibida); if (up === undefined) r.err.push('Fecha del último producto prohibido no válida'); else if (up) r.d.datos.ultima_prohibida = up;
        if (texto(v.poligono)) { try { let g = JSON.parse(texto(v.poligono)); if (g.type === 'Feature') g = g.geometry; if (!['Polygon', 'MultiPolygon'].includes(g?.type)) throw 0; r.d.poligono = g; } catch (_) { r.err.push('El polígono no es un GeoJSON válido'); } }
        if (r.d.area_ha >= 4 && !r.d.poligono) r.av.push('4 ha o más sin polígono (EUDR)');
        if (r.d.lat == null && !r.d.poligono) r.av.push('Sin punto GPS');
        const prev = r.d.productor_id && ex.find(x => x.productor_id === r.d.productor_id && norm(x.nombre) === norm(r.d.nombre));
        const clave = r.d.productor_id + norm(r.d.nombre); if (vistos[clave]) r.err.push(`Repetida en la fila ${vistos[clave]}`); else vistos[clave] = f.n;
        if (prev) { r.id = prev.id; r.accion = 'Actualiza'; r.d.datos = { ...(prev.datos || {}), ...r.d.datos }; } else r.accion = 'Nuevo';
        r.ver = [b.p ? `${b.p.codigo || ''} ${b.p.nombre}` : texto(v.productor), r.d.nombre, r.d.area_ha != null ? r.d.area_ha + ' ha' : ''];
        return r;
      });
    },
    async guardar(listos) {
      await insertarEnBloques('parcelas', listos.filter(r => !r.id).map(r => ({ ...r.d, org_id: S.org.id })));
      await actualizarUno('parcelas', listos.filter(r => r.id).map(r => ({ id: r.id, d: r.d })));
      S._parcs = null;
    }
  },

  inspecciones: {
    sec: 'cer', titulo: 'Inspecciones internas (historial)', volver: '#/inspecciones',
    nota: 'Para pasar al sistema las inspecciones que ya se hicieron. Las no conformidades se registran aparte. Si sos de gerencia, el resultado más reciente de cada productor queda como su estado de inspección.',
    cols: () => [
      { k: 'productor', t: 'Productor', req: 1, tipo: 'prod', ayuda: 'Código de socio (o identidad)', ej: 'PRD-0101' },
      { k: 'fecha', t: 'Fecha', req: 1, tipo: 'fecha', ej: '20/08/2026' },
      { k: 'inspector', t: 'Inspector', ej: 'Juan Pérez' },
      { k: 'resultado', t: 'Resultado', req: 1, tipo: 'lista', ops: ['Aprobado', 'Condicionado', 'No aprobado'], ej: 'Aprobado' },
      { k: 'certificaciones', t: 'Certificaciones', tipo: 'certs', ayuda: 'Separadas por coma. Vacío = las del productor', ej: 'Orgánico UE' },
      { k: 'observaciones', t: 'Observaciones', ej: '' }
    ],
    async preparar(filas, cols) {
      const [ps, cs] = await Promise.all([q(sb.from('productores').select('id,codigo,identidad,nombre,certificaciones').eq('org_id', S.org.id)), certs()]);
      const buscar = buscadorProd(ps);
      return filas.map(f => {
        const r = { d: {}, err: [], av: [], accion: 'Nuevo' }, v = f.v, b = buscar(v.productor);
        if (b.err) r.err.push(b.err); else r.d.productor_id = b.p.id;
        fechas(r, v, cols); listas(r, v, cols);
        if (!r.d.fecha) r.err.push('Falta la fecha'); else if (r.d.fecha > hoy()) r.err.push('La fecha es futura');
        if (!r.d.resultado) r.err.push('Falta el resultado');
        r.d.inspector = texto(v.inspector) || null; r.d.observaciones = texto(v.observaciones) || null;
        const c = leerCerts(v.certificaciones, cs); if (c.malas.length) r.err.push('Certificación no encontrada: ' + c.malas.join(', '));
        r.d.certificaciones = c.ok.length ? c.ok : b.p?.certificaciones || [];
        r.ver = [b.p ? `${b.p.codigo || ''} ${b.p.nombre}` : texto(v.productor), r.d.fecha, r.d.resultado];
        return r;
      });
    },
    async guardar(listos) {
      await insertarEnBloques('inspecciones', listos.map(r => ({ ...r.d, id: nuevoId(), org_id: S.org.id, datos: { origen: 'Carga masiva' } })));
      if (esJefe()) {
        const ult = {}; listos.forEach(r => { if (!ult[r.d.productor_id] || ult[r.d.productor_id].fecha < r.d.fecha) ult[r.d.productor_id] = r.d; });
        const ids = Object.keys(ult), masReciente = {};
        for (let i = 0; i < ids.length; i += 150) (await q(sb.from('inspecciones').select('productor_id,fecha').in('productor_id', ids.slice(i, i + 150)).order('fecha', { ascending: false }))).forEach(x => { masReciente[x.productor_id] ||= x.fecha; });
        await actualizarUno('productores', Object.values(ult).filter(x => masReciente[x.productor_id] <= x.fecha).map(x => ({ id: x.productor_id, d: { estado_cert: x.resultado } })));
        await prods(true);
      }
    }
  },

  insumos: {
    sec: 'cer', titulo: 'Insumos aplicados', volver: '#/insumos',
    nota: 'Cada producto se revisa contra las listas de permitidos y prohibidos de Configuración. Si alguno está prohibido, la parcela vuelve a empezar la transición y se abre la no conformidad, igual que al registrarlo uno por uno.',
    cols: () => [
      { k: 'productor', t: 'Productor', req: 1, tipo: 'prod', ayuda: 'Código de socio (o identidad)', ej: 'PRD-0101' },
      { k: 'parcela', t: 'Parcela', ayuda: 'Nombre de la parcela. Vacío = toda la finca', ej: 'La Esperanza' },
      { k: 'fecha', t: 'Fecha de la aplicación', req: 1, tipo: 'fecha', ej: '10/07/2026' },
      { k: 'producto', t: 'Producto', req: 1, ej: 'Bocashi' },
      { k: 'tipo', t: 'Tipo', tipo: 'lista', ops: ['Fertilizante', 'Abono orgánico', 'Enmienda', 'Fungicida', 'Insecticida', 'Herbicida', 'Control biológico', 'Otro'], ej: 'Abono orgánico' },
      { k: 'cantidad', t: 'Cantidad', tipo: 'num', ej: '5' },
      { k: 'unidad', t: 'Unidad', tipo: 'lista', ops: ['kg', 'lb', 'qq', 'sacos', 'litros', 'galones', 'ml'], ej: 'qq' },
      { k: 'observaciones', t: 'Observaciones', ej: '' }
    ],
    async preparar(filas, cols) {
      const [ps, pa] = await Promise.all([q(sb.from('productores').select('id,codigo,identidad,nombre').eq('org_id', S.org.id)), parcelasOrg(true)]);
      const buscar = buscadorProd(ps);
      return filas.map(f => {
        const r = { d: {}, err: [], av: [], accion: 'Nuevo' }, v = f.v, b = buscar(v.productor);
        if (b.err) r.err.push(b.err); else r.d.productor_id = b.p.id;
        fechas(r, v, cols); listas(r, v, cols); numeros(r, v, cols, ['cantidad']);
        if (!r.d.fecha) r.err.push('Falta la fecha'); else if (r.d.fecha > hoy()) r.err.push('La fecha es futura');
        r.d.producto = texto(v.producto); if (!r.d.producto) r.err.push('Falta el producto');
        r.d.observaciones = texto(v.observaciones) || null;
        const np = texto(v.parcela);
        if (np && b.p) { const x = pa.find(x => x.productor_id === b.p.id && norm(x.nombre) === norm(np)); x ? (r.d.parcela_id = x.id, r.d.parcela_nombre = x.nombre) : r.err.push(`El productor no tiene la parcela «${np}»`); }
        if (typeof estadoInsumo === 'function' && r.d.producto && estadoInsumo(r.d.producto) === 'Prohibido') r.av.push('Producto prohibido: abre no conformidad');
        r.ver = [b.p ? `${b.p.codigo || ''} ${b.p.nombre}` : texto(v.productor), r.d.fecha, r.d.producto];
        return r;
      });
    },
    async guardar(listos) { await insertarEnBloques('insumos_aplicados', listos.map(r => ({ ...r.d, id: nuevoId(), org_id: S.org.id, origen: 'Carga masiva' }))); S._parcs = null; }
  },

  documentos: {
    sec: 'cer', titulo: 'Documentos de productores', volver: '#/padron',
    nota: 'Para llevar el control de compromisos firmados, contratos y documentos de la tierra con su fecha de vencimiento. El archivo escaneado se sube después en la ficha del productor.',
    cols: () => [
      { k: 'productor', t: 'Productor', req: 1, tipo: 'prod', ayuda: 'Código de socio (o identidad)', ej: 'PRD-0101' },
      { k: 'tipo', t: 'Documento', req: 1, tipo: 'lista', ops: typeof TIPOS_DOC !== 'undefined' ? TIPOS_DOC : ['Compromiso firmado', 'Contrato de entrega', 'Documento de la tierra', 'Identidad', 'Análisis de suelo', 'Plan de manejo', 'Otro'], ej: 'Compromiso firmado' },
      { k: 'numero', t: 'Número', ej: '' },
      { k: 'emitido', t: 'Fecha de emisión', tipo: 'fecha', ej: '05/01/2026' },
      { k: 'vence', t: 'Fecha de vencimiento', tipo: 'fecha', ej: '05/01/2027' },
      { k: 'notas', t: 'Notas', ej: '' }
    ],
    async preparar(filas, cols) {
      const buscar = buscadorProd(await q(sb.from('productores').select('id,codigo,identidad,nombre').eq('org_id', S.org.id)));
      return filas.map(f => {
        const r = { d: {}, err: [], av: [], accion: 'Nuevo' }, v = f.v, b = buscar(v.productor);
        if (b.err) r.err.push(b.err); else r.d.productor_id = b.p.id;
        fechas(r, v, cols); listas(r, v, cols);
        if (!r.d.tipo) r.err.push('Falta el tipo de documento');
        if (r.d.emitido && r.d.vence && r.d.vence < r.d.emitido) r.err.push('Vence antes de emitirse');
        r.d.numero = texto(v.numero) || null; r.d.notas = texto(v.notas) || null;
        r.ver = [b.p ? `${b.p.codigo || ''} ${b.p.nombre}` : texto(v.productor), r.d.tipo, r.d.vence || ''];
        return r;
      });
    },
    async guardar(listos) { await insertarEnBloques('documentos_productor', listos.map(r => ({ ...r.d, org_id: S.org.id }))); }
  },

  asistencia: {
    sec: 'cer', titulo: 'Lista de asistencia', volver: '#/asistencia', conCap: true,
    nota: 'Para pasar una lista de asistencia completa a la capacitación. Los que ya están en la lista se saltan.',
    cols: () => [
      { k: 'productor', t: 'Productor', tipo: 'prod', ayuda: 'Código de socio, identidad o nombre. Vacío si no es socio', ej: 'PRD-0101' },
      { k: 'nombre', t: 'Nombre (si no es socio)', ej: '' },
      { k: 'sexo', t: 'Sexo', tipo: 'lista', ops: ['Mujer', 'Hombre'], ej: 'Mujer' }
    ],
    async preparar(filas, cols, capId) {
      const [ps, ya] = await Promise.all([q(sb.from('productores').select('id,codigo,identidad,nombre,sexo').eq('org_id', S.org.id)), q(sb.from('capacitacion_asistentes').select('productor_id').eq('capacitacion_id', capId))]);
      const buscar = buscadorProd(ps), dentro = new Set(ya.map(x => x.productor_id)), vistos = {};
      return filas.map(f => {
        const r = { d: { capacitacion_id: capId }, err: [], av: [], accion: 'Nuevo' }, v = f.v; listas(r, v, cols);
        if (texto(v.productor)) {
          const b = buscar(v.productor);
          if (b.err) r.err.push(b.err); else { r.d.productor_id = b.p.id; r.d.nombre = b.p.nombre; r.d.sexo ||= b.p.sexo || null; if (dentro.has(b.p.id)) { r.accion = 'Ya está'; r.salta = 1; } if (vistos[b.p.id]) r.err.push(`Repetido en la fila ${vistos[b.p.id]}`); else vistos[b.p.id] = f.n; }
        } else if (texto(v.nombre)) { r.d.nombre = texto(v.nombre); r.d.productor_id = null; }
        else r.err.push('Falta el productor o el nombre');
        r.ver = [texto(v.productor), r.d.nombre, r.d.sexo || ''];
        return r;
      });
    },
    async guardar(listos) { await insertarEnBloques('capacitacion_asistentes', listos.map(r => ({ ...r.d, org_id: S.org.id }))); }
  },

  proveedores: {
    sec: 'adm', titulo: 'Proveedores', volver: '#/proveedores',
    nota: 'Si el RTN ya existe, se actualizan los datos de ese proveedor con lo que venga lleno.',
    cols: () => [
      { k: 'nombre', t: 'Nombre o razón social', req: 1, ej: 'Agroservicio El Campo' },
      { k: 'rtn', t: 'RTN', ayuda: '14 dígitos', ej: '08019000123456' },
      { k: 'contacto', t: 'Persona de contacto', ej: '' }, { k: 'telefono', t: 'Teléfono', ej: '' }, { k: 'correo', t: 'Correo', ej: '' },
      { k: 'direccion', t: 'Dirección', ej: '' }, { k: 'bienes', t: 'Bienes o servicios', ej: 'Insumos orgánicos' }, { k: 'banco', t: 'Banco', ej: '' },
      { k: 'tipo_cuenta', t: 'Tipo de cuenta', tipo: 'lista', ops: ['Ahorro', 'Cheques'], ej: '' }, { k: 'numero_cuenta', t: 'Número de cuenta', ej: '' }, { k: 'titular', t: 'Titular de la cuenta', ej: '' }
    ],
    async preparar(filas, cols) {
      const ex = await q(sb.from('proveedores').select('id,rtn,nombre').eq('org_id', S.org.id)), porRtn = {}, vistos = {};
      ex.forEach(p => { if (p.rtn) porRtn[p.rtn] = p; });
      return filas.map(f => {
        const r = { d: {}, err: [], av: [] }, v = f.v;
        cols.filter(c => !c.tipo).forEach(c => { if (texto(v[c.k])) r.d[c.k] = texto(v[c.k]); }); listas(r, v, cols);
        if (!r.d.nombre) r.err.push('Falta el nombre');
        if (r.d.rtn) { r.d.rtn = r.d.rtn.replace(/\D/g, ''); if (r.d.rtn.length !== 14) r.err.push('El RTN debe tener 14 dígitos'); else if (vistos[r.d.rtn]) r.err.push(`Repetido en la fila ${vistos[r.d.rtn]}`); else vistos[r.d.rtn] = f.n; }
        if (r.d.correo && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.d.correo)) r.err.push('Correo no válido');
        const prev = r.d.rtn && porRtn[r.d.rtn]; if (prev) { r.id = prev.id; r.accion = 'Actualiza'; } else r.accion = 'Nuevo';
        r.ver = [r.d.nombre, r.d.rtn || '', r.d.bienes || ''];
        return r;
      });
    },
    async guardar(listos) {
      await insertarEnBloques('proveedores', listos.filter(r => !r.id).map(r => ({ ...r.d, org_id: S.org.id })));
      await actualizarUno('proveedores', listos.filter(r => r.id).map(r => ({ id: r.id, d: { ...r.d, actualizado: new Date().toISOString() } })));
    }
  },

  empleados: {
    sec: 'adm', titulo: 'Empleados', volver: '#/empleados', soloJefe: true,
    nota: 'Si la identidad ya existe, se actualizan los datos de ese empleado con lo que venga lleno.',
    cols: () => [
      { k: 'nombre', t: 'Nombre completo', req: 1, ej: 'Ana Martínez' }, { k: 'correo', t: 'Correo', ej: '' }, { k: 'cargo', t: 'Cargo', ej: 'Técnico de campo' },
      { k: 'identidad', t: 'Número de identidad', ayuda: '13 dígitos', ej: '' }, { k: 'fecha_ingreso', t: 'Fecha de ingreso', tipo: 'fecha', ej: '01/03/2024' },
      { k: 'salario', t: 'Salario mensual (L)', tipo: 'num', ej: '15000' }, { k: 'afiliacion_ihss', t: 'Afiliación IHSS', ej: '' }, { k: 'afiliacion_rap', t: 'Afiliación RAP', ej: '' },
      { k: 'dias_vacaciones', t: 'Días de vacaciones disponibles', tipo: 'num', ej: '10' }
    ],
    async preparar(filas, cols) {
      const ex = await q(sb.from('empleados').select('id,identidad').eq('org_id', S.org.id)), porId = {}, vistos = {};
      ex.forEach(p => { if (p.identidad) porId[p.identidad.replace(/\D/g, '')] = p; });
      return filas.map(f => {
        const r = { d: {}, err: [], av: [] }, v = f.v;
        cols.filter(c => !c.tipo).forEach(c => { if (texto(v[c.k])) r.d[c.k] = texto(v[c.k]); }); fechas(r, v, cols); numeros(r, v, cols, ['salario', 'dias_vacaciones']);
        if (!r.d.nombre) r.err.push('Falta el nombre');
        let k = '';
        if (r.d.identidad) { k = r.d.identidad.replace(/\D/g, ''); if (k.length !== 13) r.err.push('La identidad debe tener 13 dígitos'); else { r.d.identidad = `${k.slice(0, 4)}-${k.slice(4, 8)}-${k.slice(8)}`; if (vistos[k]) r.err.push(`Repetido en la fila ${vistos[k]}`); else vistos[k] = f.n; } }
        const prev = k && porId[k]; if (prev) { r.id = prev.id; r.accion = 'Actualiza'; } else r.accion = 'Nuevo';
        r.ver = [r.d.nombre, r.d.cargo || '', r.d.identidad || ''];
        return r;
      });
    },
    async guardar(listos) {
      await insertarEnBloques('empleados', listos.filter(r => !r.id).map(r => ({ ...r.d, org_id: S.org.id })));
      await actualizarUno('empleados', listos.filter(r => r.id).map(r => ({ id: r.id, d: r.d })));
    }
  }
};

// Ayudantes de revisión comunes
function numeros(r, v, cols, ks) { ks.forEach(k => { const c = cols.find(c => c.k === k), x = leerNum(v[k]); if (x === undefined) r.err.push(`${c?.t || k}: no es un número`); else if (x != null) r.d[k] = k === 'anio_siembra' ? Math.round(x) : x; }); }
function fechas(r, v, cols) { cols.filter(c => c.tipo === 'fecha').forEach(c => { const x = leerFecha(v[c.k]); if (x === undefined) r.err.push(`${c.t}: fecha no válida (usá día/mes/año)`); else if (x) r.d[c.k] = x; }); }
function listas(r, v, cols) { cols.filter(c => c.tipo === 'lista').forEach(c => { const t = texto(v[c.k]); if (!t) return; const o = c.ops.find(x => norm(x) === norm(t)); o ? r.d[c.k] = o : r.err.push(`${c.t}: «${t}» no es válido (${c.ops.join(', ')})`); }); }

async function insertarEnBloques(tabla, filas) {
  for (let i = 0; i < filas.length; i += 200) { const { error } = await sb.from(tabla).insert(filas.slice(i, i + 200)); if (error) throw Object.assign(error, { hechos: i }); }
}
async function actualizarUno(tabla, cambios) {
  for (let i = 0; i < cambios.length; i += 5) {
    const res = await Promise.all(cambios.slice(i, i + 5).map(c => sb.from(tabla).update(c.d).eq('id', c.id)));
    const e = res.find(x => x.error); if (e) throw e.error;
  }
}

const puedeCarga = t => t && puedeSec(t.sec) && (!t.soloJefe || esJefe());

// ---------- plantilla ----------
async function bajarPlantilla(tipo) {
  const t = TIPOS_CARGA[tipo], cols = t.cols(), X = await libExcel(), wb = X.utils.book_new();
  const datos = X.utils.aoa_to_sheet([cols.map(c => c.t + (c.req ? ' *' : ''))]);
  datos['!cols'] = cols.map(c => ({ wch: Math.max(14, c.t.length + 4) }));
  X.utils.book_append_sheet(wb, datos, 'Datos');
  const cs = cols.some(c => c.tipo === 'certs') ? (await certs()).map(c => c.nombre) : [];
  const ins = [['Cómo llenar la plantilla de ' + t.titulo.toLowerCase()], ['Llená la hoja «Datos», una fila por registro, sin cambiar los encabezados. Las columnas con * son obligatorias.'], [t.nota], [],
    ['Columna', 'Obligatoria', 'Qué poner', 'Valores permitidos', 'Ejemplo'],
    ...cols.map(c => [c.t, c.req ? 'Sí' : 'No', c.ayuda || (c.tipo === 'fecha' ? 'Día/mes/año, ej. 25/10/2026' : c.tipo === 'num' ? 'Solo el número' : ''), c.tipo === 'lista' ? c.ops.join(', ') : c.tipo === 'certs' ? cs.join(', ') : '', c.ej || ''])];
  const hi = X.utils.aoa_to_sheet(ins); hi['!cols'] = [{ wch: 34 }, { wch: 12 }, { wch: 50 }, { wch: 50 }, { wch: 28 }];
  X.utils.book_append_sheet(wb, hi, 'Instrucciones');
  if (cols.some(c => c.tipo === 'prod')) {
    const ps = await q(sb.from('productores').select('codigo,nombre,identidad,comunidad').eq('org_id', S.org.id).eq('activo', true).order('codigo'));
    const h = X.utils.aoa_to_sheet([['Código', 'Nombre', 'Identidad', 'Comunidad'], ...ps.map(p => [p.codigo, p.nombre, p.identidad, p.comunidad])]); h['!cols'] = [{ wch: 12 }, { wch: 36 }, { wch: 18 }, { wch: 24 }];
    X.utils.book_append_sheet(wb, h, 'Productores');
  }
  X.writeFile(wb, `plantilla-${tipo}.xlsx`);
}

// Lee el archivo y empareja los encabezados con las columnas
async function leerArchivo(archivo, cols) {
  const X = await libExcel(), wb = X.read(await archivo.arrayBuffer(), { cellDates: true, codepage: 65001 });
  const hoja = wb.Sheets.Datos || wb.Sheets[wb.SheetNames[0]];
  const aoa = X.utils.sheet_to_json(hoja, { header: 1, defval: '', raw: true });
  const iEnc = aoa.findIndex(f => f.some(x => cols.some(c => norm(x) === norm(c.t) || norm(x) === norm(c.k))));
  if (iEnc < 0) throw new Error('No encontré los encabezados de la plantilla en el archivo. Usá la plantilla que se descarga aquí.');
  const pos = {}; aoa[iEnc].forEach((x, i) => { const c = cols.find(c => norm(x) === norm(c.t) || norm(x) === norm(c.k)); if (c && pos[c.k] === undefined) pos[c.k] = i; });
  const faltan = cols.filter(c => c.req && pos[c.k] === undefined).map(c => c.t);
  if (faltan.length) throw new Error('Al archivo le faltan columnas obligatorias: ' + faltan.join(', '));
  const filas = [];
  aoa.slice(iEnc + 1).forEach((f, i) => { const v = {}; cols.forEach(c => { if (pos[c.k] !== undefined) v[c.k] = f[pos[c.k]]; }); if (Object.values(v).some(x => texto(x))) filas.push({ n: iEnc + i + 2, v }); });
  return filas;
}

// ---------- pantalla ----------
RUTAS.carga = async function cargaMasiva(tipo, capId) {
  const t = TIPOS_CARGA[tipo];
  if (!t) {
    const vis = Object.entries(TIPOS_CARGA).filter(([, x]) => puedeCarga(x) && !x.conCap);
    const grupo = (sec, nom) => { const l = vis.filter(([, x]) => x.sec === sec); return l.length ? `<h2>${nom}</h2><div class="tarjetas">${l.map(([k, x]) => tarjeta('#/carga/' + k, x.titulo, 'Plantilla de Excel y carga de varios a la vez')).join('')}</div>` : ''; };
    app().innerHTML = cabecera('Carga masiva desde Excel') + `<p class="nota">Bajá la plantilla, llenala en Excel (o pegá ahí lo que ya tengan) y subila. Antes de guardar, el sistema revisa cada fila y muestra lo que está mal.</p>
      ${grupo('cer', 'Certificaciones')}${grupo('adm', 'Administración')}
      <p class="nota">La lista de asistencia se sube desde cada capacitación, en Asistencia por productor.</p>` + (vis.length ? '' : '<div class="caja">No tenés acceso a ninguna carga masiva.</div>');
    return;
  }
  if (!puedeCarga(t)) { app().innerHTML = cabecera('Sin acceso', '#/') + '<div class="caja">No tenés acceso a esta carga. Pedile al administrador que te la habilite.</div>'; return; }
  let cap = null;
  if (t.conCap) { if (!capId) return RUTAS.asistencia(); cap = await q(sb.from('capacitaciones').select('id,tema,fecha').eq('id', capId).single()); }
  const cols = t.cols(), volver = t.conCap ? '#/asistencia/' + capId : t.volver;
  app().innerHTML = cabecera('Carga masiva · ' + t.titulo + (cap ? ` · ${cap.tema} (${cap.fecha})` : ''), volver) + `<div class="caja">
    <p>${esc(t.nota)}</p>
    <ol class="nota" style="margin:6px 0 12px 18px"><li>Bajá la plantilla y llená la hoja «Datos» (una fila por registro).</li><li>Subí el archivo. Sirve el Excel (.xlsx) o un CSV.</li><li>Revisá lo que dice el sistema y tocá «Guardar».</li></ol>
    <div class="acciones" style="justify-content:flex-start"><button class="sec" id="plan">Descargar plantilla de Excel</button><label class="boton" style="cursor:pointer">Subir archivo<input type="file" id="arch" accept=".xlsx,.xls,.csv" hidden></label></div>
  </div><div id="rev"></div>`;
  $('#plan').onclick = async () => { $('#plan').disabled = true; try { await bajarPlantilla(tipo); } catch (e) { aviso(falla(e), true); } $('#plan').disabled = false; };
  $('#arch').onchange = async ev => {
    const a = ev.target.files[0]; ev.target.value = ''; if (!a) return;
    const rev = $('#rev'); rev.innerHTML = '<p class="nota">Revisando el archivo…</p>';
    try {
      const filas = await leerArchivo(a, cols);
      if (!filas.length) { rev.innerHTML = '<div class="caja error">El archivo no tiene filas con datos.</div>'; return; }
      if (filas.length > 5000) { rev.innerHTML = '<div class="caja error">Son más de 5,000 filas. Partilo en varios archivos.</div>'; return; }
      const rs = await t.preparar(filas, cols, capId);
      rs.forEach((r, i) => r.n = filas[i].n);
      pintarRevision(t, rs, a.name, volver);
    } catch (e) { rev.innerHTML = `<div class="caja error">${esc(falla(e))}</div>`; }
  };
};

function pintarRevision(t, rs, nombre, volver) {
  const malas = rs.filter(r => r.err.length), salta = rs.filter(r => !r.err.length && r.salta), listos = rs.filter(r => !r.err.length && !r.salta);
  const nuevos = listos.filter(r => r.accion === 'Nuevo').length, act = listos.length - nuevos, avisos = listos.filter(r => r.av.length).length;
  const chip = (n, txt, c) => n ? `<span class="estado e-${c}">${n} ${txt}</span> ` : '';
  const orden = [...malas, ...listos.filter(r => r.av.length), ...listos.filter(r => !r.av.length), ...salta];
  const muestra = orden.slice(0, 400);
  $('#rev').innerHTML = `<div class="caja"><p><b>${esc(nombre)}</b>: ${rs.length} filas. ${chip(nuevos, nuevos === 1 ? 'nuevo' : 'nuevos', 'Autorizada')}${chip(act, act === 1 ? 'se actualiza' : 'se actualizan', 'Pendiente')}${chip(salta.length, 'ya estaban', 'Anulada')}${chip(malas.length, 'con errores', 'Rechazada')}${avisos ? `· ${avisos} con aviso` : ''}</p>
    ${malas.length ? `<p class="nota">Las filas con error no se guardan. Corregilas en el Excel y volvé a subir el archivo; las que ya se guardaron se reconocen y se actualizan en vez de duplicarse${t === TIPOS_CARGA.inspecciones || t === TIPOS_CARGA.insumos || t === TIPOS_CARGA.documentos ? ' (en este tipo no: subí solo las filas corregidas)' : ''}.</p>` : ''}
    <div class="acciones" style="justify-content:flex-start">${listos.length ? `<button id="guardar">Guardar ${listos.length} ${listos.length === 1 ? 'fila' : 'filas'}</button>` : ''}${malas.length ? '<button class="sec" id="errores">Descargar filas con error</button>' : ''}</div></div>
    <div class="tabla"><table><thead><tr><th class="n">Fila</th><th>Qué pasa</th><th>Dato</th><th></th><th></th><th>Revisión</th></tr></thead><tbody>
    ${muestra.map(r => `<tr><td class="n">${r.n}</td><td>${r.err.length ? '<span class="error">No se guarda</span>' : esc(r.accion)}</td>${r.ver.map(x => `<td>${esc(x ?? '')}</td>`).join('')}<td>${r.err.length ? `<span class="error">${esc(r.err.join(' · '))}</span>` : r.av.length ? `<span style="color:#b45309">${esc(r.av.join(' · '))}</span>` : 'Bien'}</td></tr>`).join('')}
    </tbody></table></div>${orden.length > muestra.length ? `<p class="nota">Se muestran ${muestra.length} de ${orden.length} filas (primero las que tienen problemas).</p>` : ''}`;
  if ($('#errores')) $('#errores').onclick = () => descargarCSV('filas-con-error.csv', ['fila', 'errores'], malas.map(r => [r.n, r.err.join(' · ')]));
  if ($('#guardar')) $('#guardar').onclick = async () => {
    if (navigator.onLine === false) return aviso('Para la carga masiva se necesita señal. Probá cuando tengás internet.', true);
    const b = $('#guardar'); b.disabled = true; b.textContent = 'Guardando…';
    try {
      await t.guardar(listos);
      $('#rev').innerHTML = `<div class="caja"><p><b>Listo.</b> Se guardaron ${listos.length} filas${nuevos && act ? ` (${nuevos} nuevas y ${act} actualizadas)` : ''}${malas.length ? `. Quedaron ${malas.length} con error sin guardar.` : '.'}</p><div class="acciones" style="justify-content:flex-start"><a class="boton" href="${volver}">Ver la lista</a></div></div>`;
      aviso('Carga guardada.'); if (typeof archivarLuego === 'function') archivarLuego(true);
    } catch (e) { b.disabled = false; b.textContent = `Guardar ${listos.length} filas`; aviso('No se pudo terminar de guardar: ' + falla(e) + (e.hechos ? ` (se alcanzaron a guardar ${e.hechos})` : '') + '. Lo que se guardó no se duplica si volvés a subir el archivo en productores, parcelas, proveedores y empleados.', true); }
  };
}
SECCION_DE.carga = '';
