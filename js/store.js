import {firebaseConfig} from '../config.js';
import {DEFAULT_FIELDS,uid,today} from './model.js';
export const COLLECTIONS=['players','fields','matches','records','formations','availability','staffNotes','users'];
const DEMO_KEY='the-boys-1927-demo-v1';
export function demoStore(){
 let data;try{data=JSON.parse(localStorage.getItem(DEMO_KEY))}catch{};
 if(!data){data=Object.fromEntries(COLLECTIONS.map(k=>[k,[]]));data.fields=DEFAULT_FIELDS.map(([name,type,scope,aggregation,options],order)=>({id:'demo'+order,name,type,scope,aggregation,options:options||[],order,archived:false}));data.players=[{id:'p1',name:'Giocatore esempio A',number:9,roles:{ATT:'natural',COC:'adapted'},values:{demo8:182,demo9:76},notes:'Esempio: attacca la profondità.',active:true},{id:'p2',name:'Giocatore esempio B',number:8,roles:{CC:'natural',CDC:'natural',COC:'adapted'},values:{},notes:'Esempio: supporto alla costruzione.',active:true}];data.matches=[{id:'m1',opponent:'Avversario esempio',date:today(),time:'22:00',competition:'Amichevole',status:'planned',gf:null,ga:null,notes:''}];data.users=[{id:'demo',name:'Amministratore demo',email:'demo@example.invalid',role:'admin',playerId:'p1'}];}
 let listeners=[];const emit=()=>{try{localStorage.setItem(DEMO_KEY,JSON.stringify(data))}catch{};listeners.forEach(f=>f(structuredClone(data)));};return {demo:true,listen:fn=>{listeners.push(fn);fn(structuredClone(data));return()=>listeners=listeners.filter(x=>x!==fn)},async put(c,id,value){const i=data[c].findIndex(x=>x.id===id);if(i<0)data[c].push({id,...value});else data[c][i]={...data[c][i],...value,id};emit()},async remove(c,id){data[c]=data[c].filter(x=>x.id!==id);emit()},async batch(ops){for(const {c,id,value} of ops){const i=data[c].findIndex(x=>x.id===id);if(i<0)data[c].push({id,...value});else data[c][i]={...data[c][i],...value,id}}emit()},reset(){localStorage.removeItem(DEMO_KEY);location.reload()}};
}
export const configured=()=>Boolean(firebaseConfig.apiKey&&firebaseConfig.projectId&&firebaseConfig.appId&&firebaseConfig.authDomain);
export async function cloudStore(){
 const base='https://www.gstatic.com/firebasejs/10.14.1/';
 const [a,b,c]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
 const app=a.initializeApp(firebaseConfig),auth=b.getAuth(app),db=c.getFirestore(app);
 const ref=(name,id)=>c.doc(db,name,id);
 return {demo:false,
  authWatch:fn=>b.onAuthStateChanged(auth,fn),login:()=>b.signInWithPopup(auth,new b.GoogleAuthProvider()),logout:()=>b.signOut(auth),
  async ensureProfile(user){
   let token;
   try { token=await b.getIdTokenResult(user,true); }
   catch(e){throw new Error('Aggiornamento sessione Google: '+(e.message||String(e)));}
   const r=ref('users',user.uid);let s;
   try {s=await c.getDocFromServer(r);}
   catch(e){throw new Error('Lettura del profilo: '+(e.message||String(e)));}
   if(s.exists())return;
   const email=token.claims.email;
   if(typeof email!=='string'||!email)throw new Error('Il token Google non contiene un indirizzo email.');
   try {await c.setDoc(r,{name:user.displayName||email,email,role:'pending',playerId:'',createdAt:new Date().toISOString()});}
   catch(e){
    // Another tab may have created the profile in the meantime.
    try {if((await c.getDocFromServer(r)).exists())return;}catch(_){}
    throw new Error('Creazione del profilo in attesa: '+(e.message||String(e)));
   }
  },
  profileWatch:(id,fn,err)=>c.onSnapshot(ref('users',id),s=>fn(s.exists()?{id:s.id,...s.data()}:null),err),
  listen(names,fn,err){let data=Object.fromEntries(COLLECTIONS.map(k=>[k,[]]));let loaded=new Set();let off=names.map(name=>c.onSnapshot(c.collection(db,name),s=>{data[name]=s.docs.map(d=>({id:d.id,...d.data()}));loaded.add(name);if(loaded.size===names.length)fn(structuredClone(data));},err));return()=>off.forEach(f=>f());},
  async put(name,id,value){await c.setDoc(ref(name,id),value,{merge:true})},
  async remove(name,id){await c.deleteDoc(ref(name,id))},
  async batch(ops){const batch=c.writeBatch(db);for(const {c:name,id,value} of ops)batch.set(ref(name,id),value,{merge:true});await batch.commit()}
 };
}
