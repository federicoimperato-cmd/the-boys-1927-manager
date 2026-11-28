export const ROLES=['POR','TD','DC','TS','ADA','CDC','ASA','ED','CC','ES','COC','AD','ATT','AS'];
export const ROLE_NAMES={POR:'Portiere',TD:'Terzino destro',DC:'Difensore centrale',TS:'Terzino sinistro',ADA:'Esterno destro difensivo',CDC:'Mediano',ASA:'Esterno sinistro difensivo',ED:'Esterno destro',CC:'Centrocampista centrale',ES:'Esterno sinistro',COC:'Trequartista',AD:'Ala destra',ATT:'Attaccante',AS:'Ala sinistra'};
export const FORMATIONS={
 '4-2-3-1':[['ATT',50,12],['ES',18,30],['COC',50,30],['ED',82,30],['CDC',35,49],['CDC',65,49],['TS',13,72],['DC',37,72],['DC',63,72],['TD',87,72],['POR',50,91]],
 '4-3-3':[['AS',18,15],['ATT',50,10],['AD',82,15],['CC',27,39],['CDC',50,55],['CC',73,39],['TS',13,72],['DC',37,72],['DC',63,72],['TD',87,72],['POR',50,91]],
 '4-4-2':[['ATT',35,13],['ATT',65,13],['ES',14,42],['CC',38,47],['CC',62,47],['ED',86,42],['TS',13,72],['DC',37,72],['DC',63,72],['TD',87,72],['POR',50,91]],
 '3-5-2':[['ATT',35,13],['ATT',65,13],['COC',50,30],['ES',12,45],['CDC',35,53],['CDC',65,53],['ED',88,45],['DC',20,75],['DC',50,75],['DC',80,75],['POR',50,91]],
 '4-1-2-1-2':[['ATT',35,12],['ATT',65,12],['COC',50,30],['CC',26,48],['CC',74,48],['CDC',50,61],['TS',13,75],['DC',37,75],['DC',63,75],['TD',87,75],['POR',50,92]],
 '5-3-2':[['ATT',35,13],['ATT',65,13],['CC',25,43],['CDC',50,52],['CC',75,43],['ASA',9,68],['DC',30,77],['DC',50,77],['DC',70,77],['ADA',91,68],['POR',50,93]]};
export const DEFAULT_FIELDS=[['Gol','number','match','sum'],['Assist','number','match','sum'],['Voto','number','match','avg'],['Tiri','number','match','sum'],['Passaggi riusciti (%)','number','match','avg'],['Contrasti vinti','number','match','sum'],['Intercetti','number','match','sum'],['Parate','number','match','sum'],['Altezza (cm)','number','player','none'],['Peso (kg)','number','player','none'],['Archetipo / Build','text','player','none'],['Piede preferito','select','player','none',['Destro','Sinistro','Entrambi']],['PlayStyle','text','player','none']];
export const ROLE_LABEL={admin:'Amministratore',captain:'Capitano',staff:'Staff',player:'Giocatore',pending:'In attesa'};
export const sortName=(a,b)=>(a.name||'').localeCompare(b.name||'','it');
export const uid=()=>crypto.randomUUID();
export const today=()=>{let d=new Date();return new Date(d-d.getTimezoneOffset()*60000).toISOString().slice(0,10)};
export const activeFields=(fields,scope)=>fields.filter(f=>!f.archived&&(!scope||f.scope===scope)).sort((a,b)=>(a.order||0)-(b.order||0)||sortName(a,b));
export function matchRecords(data,playerId){const done=new Set(data.matches.filter(m=>m.status==='played'&&(!m.kind||['match','friendly','tournament'].includes(m.kind))).map(m=>m.id));return data.records.filter(r=>r.playerId===playerId&&done.has(r.matchId)&&r.appeared!==false)}
export function aggregate(data,p,f){if(f.scope==='player')return p.values?.[f.id]??null;const nums=matchRecords(data,p.id).map(r=>r.values?.[f.id]).filter(v=>typeof v==='number'&&Number.isFinite(v));if(!nums.length)return null;return f.aggregation==='avg'?Math.round(nums.reduce((a,b)=>a+b,0)/nums.length*100)/100:nums.reduce((a,b)=>a+b,0)}
export function teamStats(matches){const m=matches.filter(x=>x.status==='played'&&typeof x.gf==='number'&&typeof x.ga==='number');return {n:m.length,w:m.filter(x=>x.gf>x.ga).length,d:m.filter(x=>x.gf===x.ga).length,l:m.filter(x=>x.gf<x.ga).length,gf:m.reduce((s,x)=>s+x.gf,0),ga:m.reduce((s,x)=>s+x.ga,0)}}
export const recordId=(matchId,playerId)=>`${matchId}_${playerId}`;
export const displayValue=v=>v===null||v===undefined||v===''?'—':typeof v==='boolean'?(v?'Sì':'No'):typeof v==='number'?v.toLocaleString('it-IT',{maximumFractionDigits:2}):String(v);
export const fmtDate=s=>s?new Date(s+'T12:00:00').toLocaleDateString('it-IT'):'—';
