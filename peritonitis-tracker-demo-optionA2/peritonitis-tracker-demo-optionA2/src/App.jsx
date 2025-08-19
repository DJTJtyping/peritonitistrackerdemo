import React, { useMemo, useState, useEffect } from 'react';
import { Download, Plus, Search, Trash2, Edit3, Filter } from 'lucide-react';

const cls = {
  card: 'bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 p-4',
  ring: 'ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700',
  input: 'mt-1 w-full rounded-xl px-3 py-2 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500',
  btn: 'inline-flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800',
};

const Section = ({ title, children, right }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {right}
    </div>
    <div className={cls.card}>{children}</div>
  </div>
);

const Field = ({ f, value, onChange, readOnly, invalid }) => {
  const common = { disabled: readOnly, className: `${cls.input} ${invalid ? 'ring-2 ring-red-500' : 'ring-1 ring-zinc-200 dark:ring-zinc-800'}` };
  const val = value != null ? value : '';
  return (
    <label className="block">
      <span className="text-sm text-zinc-600 dark:text-zinc-400">{f.label}</span>
      {f.type === 'select' ? (
        <select {...common} value={val} onChange={(e)=>onChange(e.target.value)}>
          <option value="">—</option>
          {(f.options||[]).map(o=> <option key={o} value={o}>{o}</option>)}
        </select>
      ) : f.type === 'textarea' ? (
        <textarea {...common} className={`${common.className} min-h-[90px]`} value={val} onChange={(e)=>onChange(e.target.value)} />
      ) : (
        <input {...common} type={f.type} step={f.step||undefined} value={val} onChange={(e)=>onChange(f.type==='number' ? (e.target.value===''? '' : Number(e.target.value)) : e.target.value)} />
      )}
    </label>
  );
};

const DROPDOWNS = {
  yesNo: ['YES', 'NO'],
  symptoms: ['Cloudy Effluent','Abdominal Pain','Fever','Cloudy Effluent and Abdominal Pain','Cloudy Effluent and Fever','Abdominal Pain and Fever','Fever, Abdominal Pain, and Cloudy Effluent','Other'],
  provider: ['LHSC PD Unit','LHSC In Patient','LHSC Emergency Department','External Hospital'],
  gram: ['Gram Positive','Gram Negative','Fungal','Polymicrobial','No growth'],
  route: ['Oral','Intraperitoneal','Intravenous'],
  outcome: ['Resolved','PD Catheter Removed'],
  units: ['mg/L','µg/mL','ng/mL','mg/dL'],
  bacteria: ['Staphylococcus aureus','Coagulase-negative Staphylococci','Streptococcus spp','Enterococcus spp','Escherichia coli','Klebsiella spp','Enterobacter spp','Proteus spp','Serratia spp','Pseudomonas aeruginosa','Polymicrobial','Candida albicans','Candida spp','No growth','Other'],
};

const FIELDS = [
  {key:'lastName',label:'Patient Last Name',type:'text',req:true},
  {key:'firstName',label:'Patient First Name',type:'text',req:true},
  {key:'pin',label:'PIN',type:'text',req:true},
  {key:'pdCatheterDate',label:'Date of PD Catheter Insertion',type:'date'},
  {key:'startedPD',label:'Has the Patient Started PD',type:'select',options:DROPDOWNS.yesNo},
  {key:'startedPDDate',label:'Date the Patient Started PD',type:'date'},
  {key:'infectionDate',label:'Date of Infection',type:'date',req:true},
  {key:'peritonitis',label:'Peritonitis Infection?',type:'select',options:DROPDOWNS.yesNo},
  {key:'tunnelInfection',label:'Tunnel Infection?',type:'select',options:DROPDOWNS.yesNo},
  {key:'exitSiteInfection',label:'Exit Site Infection?',type:'select',options:DROPDOWNS.yesNo},
  {key:'symptoms',label:'Symptoms',type:'select',options:DROPDOWNS.symptoms},
  {key:'initialProvider',label:'Initial Provider',type:'select',options:DROPDOWNS.provider},
  {key:'initWbc',label:'Initial WBC Count (x10^9/L)',type:'number',step:'any',req:true},
  {key:'initNeutrophils',label:'Initial % Neutrophils',type:'number',step:'any'},
  {key:'initGramStain',label:'Initial Gram Stain',type:'select',options:DROPDOWNS.gram},
  {key:'initFluidAppearance',label:'Initial Fluid Appearance',type:'text'},
  {key:'initOrganism1',label:'Initial Organism 1',type:'select',options:DROPDOWNS.bacteria},
  {key:'initOrganism2',label:'Initial Organism 2',type:'select',options:DROPDOWNS.bacteria},
  {key:'initOrganism3',label:'Initial Organism 3',type:'select',options:DROPDOWNS.bacteria},
  {key:'initLabsDate',label:'Date of Initial Labs',type:'date'},
  {key:'r1Wbc',label:'Reassessment 1 WBC (x10^9/L)',type:'number',step:'any'},
  {key:'r1Neutrophils',label:'Reassessment 1 % Neutrophils',type:'number',step:'any'},
  {key:'r1GramStain',label:'Reassessment 1 Gram Stain',type:'select',options:DROPDOWNS.gram},
  {key:'r1FluidAppearance',label:'Reassessment 1 Fluid Appearance',type:'text'},
  {key:'r1Organism1',label:'Reassessment 1 Organism 1',type:'select',options:DROPDOWNS.bacteria},
  {key:'r1Organism2',label:'Reassessment 1 Organism 2',type:'select',options:DROPDOWNS.bacteria},
  {key:'r1Organism3',label:'Reassessment 1 Organism 3',type:'select',options:DROPDOWNS.bacteria},
  {key:'r1Date',label:'Reassessment 1 Date',type:'date'},
  {key:'r2Wbc',label:'Reassessment 2 WBC (x10^9/L)',type:'number',step:'any'},
  {key:'r2Neutrophils',label:'Reassessment 2 % Neutrophils',type:'number',step:'any'},
  {key:'r2GramStain',label:'Reassessment 2 Gram Stain',type:'select',options:DROPDOWNS.gram},
  {key:'r2FluidAppearance',label:'Reassessment 2 Fluid Appearance',type:'text'},
  {key:'r2Organism1',label:'Reassessment 2 Organism 1',type:'select',options:DROPDOWNS.bacteria},
  {key:'r2Organism2',label:'Reassessment 2 Organism 2',type:'select',options:DROPDOWNS.bacteria},
  {key:'r2Organism3',label:'Reassessment 2 Organism 3',type:'select',options:DROPDOWNS.bacteria},
  {key:'r2Date',label:'Reassessment 2 Date',type:'date'},
  {key:'r3Wbc',label:'Reassessment 3 WBC (x10^9/L)',type:'number',step:'any'},
  {key:'r3Neutrophils',label:'Reassessment 3 % Neutrophils',type:'number',step:'any'},
  {key:'r3GramStain',label:'Reassessment 3 Gram Stain',type:'select',options:DROPDOWNS.gram},
  {key:'r3FluidAppearance',label:'Reassessment 3 Fluid Appearance',type:'text'},
  {key:'r3Organism1',label:'Reassessment 3 Organism 1',type:'select',options:DROPDOWNS.bacteria},
  {key:'r3Organism2',label:'Reassessment 3 Organism 2',type:'select',options:DROPDOWNS.bacteria},
  {key:'r3Organism3',label:'Reassessment 3 Organism 3',type:'select',options:DROPDOWNS.bacteria},
  {key:'r3Date',label:'Reassessment 3 Date',type:'date'},
  {key:'r4Wbc',label:'Reassessment 4 WBC (x10^9/L)',type:'number',step:'any'},
  {key:'r4Neutrophils',label:'Reassessment 4 % Neutrophils',type:'number',step:'any'},
  {key:'r4GramStain',label:'Reassessment 4 Gram Stain',type:'select',options:DROPDOWNS.gram},
  {key:'r4FluidAppearance',label:'Reassessment 4 Fluid Appearance',type:'text'},
  {key:'r4Organism1',label:'Reassessment 4 Organism 1',type:'select',options:DROPDOWNS.bacteria},
  {key:'r4Organism2',label:'Reassessment 4 Organism 2',type:'select',options:DROPDOWNS.bacteria},
  {key:'r4Organism3',label:'Reassessment 4 Organism 3',type:'select',options:DROPDOWNS.bacteria},
  {key:'r4Date',label:'Reassessment 4 Date',type:'date'},
  {key:'antifungalProphylaxis',label:'Antifungal Prophylaxis Used?',type:'select',options:DROPDOWNS.yesNo},
  {key:'abx1Route',label:'Antibiotic 1 Treatment Route',type:'select',options:DROPDOWNS.route},
  {key:'abx1',label:'Antibiotic 1',type:'text'},
  {key:'abx1Other',label:'Antibiotic 1 - Other',type:'text'},
  {key:'abx1Start',label:'Antibiotic 1 Start Date',type:'date'},
  {key:'abx1End',label:'Antibiotic 1 End Date',type:'date'},
  {key:'abx1Days',label:'Antibiotic 1 Duration (days)',type:'number',readOnly:true},
  {key:'abx2Used',label:'Was a Second Antibiotic Used?',type:'select',options:DROPDOWNS.yesNo},
  {key:'abx2Route',label:'Antibiotic 2 Treatment Route',type:'select',options:DROPDOWNS.route},
  {key:'abx2',label:'Antibiotic 2',type:'text'},
  {key:'abx2Other',label:'Antibiotic 2 - Other',type:'text'},
  {key:'abx2Start',label:'Antibiotic 2 Start Date',type:'date'},
  {key:'abx2End',label:'Antibiotic 2 End Date',type:'date'},
  {key:'abx2Days',label:'Antibiotic 2 Duration (days)',type:'number',readOnly:true},
  {key:'abx3Used',label:'Was a Third Antibiotic Used?',type:'select',options:DROPDOWNS.yesNo},
  {key:'abx3Route',label:'Antibiotic 3 Treatment Route',type:'select',options:DROPDOWNS.route},
  {key:'abx3',label:'Antibiotic 3',type:'text'},
  {key:'abx3Other',label:'Antibiotic 3 - Other',type:'text'},
  {key:'abx3Start',label:'Antibiotic 3 Start Date',type:'date'},
  {key:'abx3End',label:'Antibiotic 3 End Date',type:'date'},
  {key:'abx3Days',label:'Antibiotic 3 Duration (days)',type:'number',readOnly:true},
  {key:'empiricAbx',label:'Empiric Antibiotics (regimen)',type:'text'},
  {key:'empiricStartDate',label:'Empiric Start Date',type:'date'},
  {key:'empiricEndDate',label:'Empiric End Date',type:'date'},
  {key:'empiricDays',label:'Empiric Duration (days)',type:'number',readOnly:true},
  {key:'finalAbx',label:'Definitive Antibiotics (regimen)',type:'text'},
  {key:'finalStartDate',label:'Definitive Start Date',type:'date'},
  {key:'finalEndDate',label:'Definitive End Date',type:'date'},
  {key:'finalDays',label:'Definitive Duration (days)',type:'number',readOnly:true},
  {key:'drug1Name',label:'Drug Level 1 - Drug',type:'text'},
  {key:'drug1Level',label:'Drug Level 1 - Level',type:'number',step:'any'},
  {key:'drug1Units',label:'Drug Level 1 - Units',type:'select',options:DROPDOWNS.units},
  {key:'drug1Date',label:'Drug Level 1 - Date',type:'date'},
  {key:'drug2Name',label:'Drug Level 2 - Drug',type:'text'},
  {key:'drug2Level',label:'Drug Level 2 - Level',type:'number',step:'any'},
  {key:'drug2Units',label:'Drug Level 2 - Units',type:'select',options:DROPDOWNS.units},
  {key:'drug2Date',label:'Drug Level 2 - Date',type:'date'},
  {key:'outcome',label:'Peritonitis Outcome',type:'select',options:DROPDOWNS.outcome},
  {key:'notes',label:'Notes',type:'textarea'},
];

const SECTIONS = [
  {key:'patient',title:'Patient/Infection Information',fieldKeys:['lastName','firstName','pin','pdCatheterDate','startedPD','startedPDDate','infectionDate','peritonitis','tunnelInfection','exitSiteInfection','symptoms','initialProvider']},
  {key:'initial12',title:'Initial Lab Results / Reassessments 1 & 2',fieldKeys:['initWbc','initNeutrophils','initGramStain','initFluidAppearance','initOrganism1','initOrganism2','initOrganism3','initLabsDate','r1Wbc','r1Neutrophils','r1GramStain','r1FluidAppearance','r1Organism1','r1Organism2','r1Organism3','r1Date','r2Wbc','r2Neutrophils','r2GramStain','r2FluidAppearance','r2Organism1','r2Organism2','r2Organism3','r2Date']},
  {key:'reassess34',title:'Reassessments 3 & 4',fieldKeys:['r3Wbc','r3Neutrophils','r3GramStain','r3FluidAppearance','r3Organism1','r3Organism2','r3Organism3','r3Date','r4Wbc','r4Neutrophils','r4GramStain','r4FluidAppearance','r4Organism1','r4Organism2','r4Organism3','r4Date']},
  {key:'abx1',title:'Antibiotics 1',fieldKeys:['antifungalProphylaxis','abx1Route','abx1','abx1Other','abx1Start','abx1End','abx1Days','empiricAbx','empiricStartDate','empiricEndDate','empiricDays']},
  {key:'abx2',title:'Antibiotics 2',fieldKeys:['abx2Used','abx2Route','abx2','abx2Other','abx2Start','abx2End','abx2Days']},
  {key:'abx3',title:'Antibiotics 3',fieldKeys:['abx3Used','abx3Route','abx3','abx3Other','abx3Start','abx3End','abx3Days','finalAbx','finalStartDate','finalEndDate','finalDays']},
  {key:'druglevels',title:'Drug Levels 1 & 2',fieldKeys:['drug1Name','drug1Level','drug1Units','drug1Date','drug2Name','drug2Level','drug2Units','drug2Date']},
  {key:'outcome',title:'Outcome/Notes',fieldKeys:['outcome','notes']},
];

const SEED = [
  { lastName:'Smith',firstName:'John',pin:'12345678',pdCatheterDate:'2023-04-05',startedPD:'YES',startedPDDate:'2023-04-05',infectionDate:'2024-05-06',peritonitis:'YES',tunnelInfection:'NO',exitSiteInfection:'NO',symptoms:'Fever, Abdominal Pain, and Cloudy Effluent',initialProvider:'LHSC PD Unit',initWbc:1.4,initNeutrophils:85,initGramStain:'Gram Negative',initFluidAppearance:'Cloudy',initOrganism1:'Escherichia coli',initLabsDate:'2024-05-06',r1Wbc:0.6,r1Neutrophils:65,r1GramStain:'Gram Negative',r1FluidAppearance:'Less cloudy',r1Organism1:'Escherichia coli',r1Date:'2024-05-09',r2Wbc:0.18,r2Neutrophils:55,r2GramStain:'No growth',r2FluidAppearance:'Clearer',r2Organism1:'No growth',r2Date:'2024-05-13',abx1Route:'Intraperitoneal',abx1:'Cefazolin',abx1Start:'2024-05-06',abx1End:'2024-05-10',abx2Used:'YES',abx2Route:'Intraperitoneal',abx2:'Ceftazidime',abx2Start:'2024-05-06',abx2End:'2024-05-20',abx3Used:'NO',empiricAbx:'Cefazolin + Ceftazidime (IP)',empiricStartDate:'2024-05-06',empiricEndDate:'2024-05-20',finalAbx:'Ceftazidime (IP)',finalStartDate:'2024-05-10',finalEndDate:'2024-05-20',outcome:'PD Catheter Removed' },
  { lastName:'Lopez',firstName:'Maria',pin:'22334455',pdCatheterDate:'2024-01-18',startedPD:'YES',startedPDDate:'2024-02-02',infectionDate:'2024-05-14',peritonitis:'YES',tunnelInfection:'NO',exitSiteInfection:'NO',symptoms:'Cloudy Effluent and Abdominal Pain',initialProvider:'LHSC Emergency Department',initWbc:1.1,initNeutrophils:88,initGramStain:'Gram Positive',initFluidAppearance:'Turbid',initOrganism1:'Staphylococcus aureus',initLabsDate:'2024-05-14',r1Wbc:0.5,r1Neutrophils:70,r1GramStain:'Gram Positive',r1FluidAppearance:'Improving',r1Organism1:'Staphylococcus aureus',r1Date:'2024-05-17',r2Wbc:0.18,r2Neutrophils:58,r2GramStain:'No growth',r2FluidAppearance:'Clear',r2Organism1:'No growth',r2Date:'2024-05-23',abx1Route:'Intraperitoneal',abx1:'Vancomycin',abx1Start:'2024-05-14',abx1End:'2024-05-28',abx2Used:'YES',abx2Route:'Intraperitoneal',abx2:'Ceftazidime',abx2Start:'2024-05-14',abx2End:'2024-05-16',abx3Used:'NO',empiricAbx:'Vancomycin + Ceftazidime (IP)',empiricStartDate:'2024-05-14',empiricEndDate:'2024-05-28',finalAbx:'Vancomycin (IP)',finalStartDate:'2024-05-16',finalEndDate:'2024-05-28',outcome:'Resolved' },
  { lastName:'Patel',firstName:'Ravi',pin:'99887766',pdCatheterDate:'2023-11-03',startedPD:'YES',startedPDDate:'2023-11-10',infectionDate:'2024-03-22',peritonitis:'YES',tunnelInfection:'NO',exitSiteInfection:'NO',symptoms:'Abdominal Pain',initialProvider:'LHSC PD Unit',initWbc:0.95,initNeutrophils:82,initGramStain:'Gram Positive',initFluidAppearance:'Cloudy',initOrganism1:'Coagulase-negative Staphylococci',initLabsDate:'2024-03-22',r1Wbc:0.42,r1Neutrophils:68,r1GramStain:'Gram Positive',r1FluidAppearance:'Improving',r1Organism1:'Coagulase-negative Staphylococci',r1Date:'2024-03-25',r2Wbc:0.12,r2Neutrophils:55,r2GramStain:'No growth',r2FluidAppearance:'Clear',r2Organism1:'No growth',r2Date:'2024-03-31',abx1Route:'Intraperitoneal',abx1:'Cefazolin',abx1Start:'2024-03-22',abx1End:'2024-04-05',abx2Used:'YES',abx2Route:'Intraperitoneal',abx2:'Ceftazidime',abx2Start:'2024-03-22',abx2End:'2024-03-24',abx3Used:'NO',empiricAbx:'Cefazolin + Ceftazidime (IP)',empiricStartDate:'2024-03-22',empiricEndDate:'2024-04-05',finalAbx:'Cefazolin (IP)',finalStartDate:'2024-03-24',finalEndDate:'2024-04-05',outcome:'Resolved' },
];

const csvEscape = (v)=>{
  if (v==null) return '';
  const s=String(v);
  const needs = s.includes(',') || s.includes('"') || s.includes('\\n') || s.includes('\\r');
  return needs ? '"'+s.replaceAll('"','""')+'"' : s;
};

const toCSV = (data)=>{
  const head=['ID',...FIELDS.map(f=>f.label)];
  const rows=data.map((r,i)=>{
    const vals = FIELDS.map(f=> (r[f.key] != null ? r[f.key] : ''));
    return [i+1, ...vals];
  });
  return [head,...rows].map(r=>r.map(csvEscape).join(',')).join('\\n');
};

const useLocal = (k,init)=>{
  const [s,ss]=useState(()=>{try{const x=localStorage.getItem(k);return x?JSON.parse(x):init;}catch{return init;}});
  useEffect(()=>localStorage.setItem(k,JSON.stringify(s)),[k,s]);
  return [s,ss];
};

const daysInc=(a,b)=>{ if(!a||!b) return ''; const s=new Date(a), e=new Date(b); if(isNaN(+s)||isNaN(+e)||e<s) return ''; return Math.floor((e-s)/86400000)+1; };
const safeDur=(explicit,start,end)=>{ const picked = (explicit != null ? explicit : daysInc(start,end)); return (picked === '' || picked == null) ? '' : picked; };
const withDur=(r)=>({
  ...r,
  empiricDays: safeDur(r.empiricDays, r.empiricStartDate, r.empiricEndDate) || '',
  finalDays:   safeDur(r.finalDays,   r.finalStartDate,   r.finalEndDate)   || '',
  abx1Days:    safeDur(r.abx1Days,    r.abx1Start,        r.abx1End)        || '',
  abx2Days:    safeDur(r.abx2Days,    r.abx2Start,        r.abx2End)        || '',
  abx3Days:    safeDur(r.abx3Days,    r.abx3Start,        r.abx3End)        || '',
});

const inRangeDate=(d,from,to)=>{ if(!d) return false; const x=new Date(d); if(isNaN(+x)) return false; if(from&&x<new Date(from))return false; if(to&&x>new Date(to))return false; return true; };
const countPeritonitisRange=(rows,from,to)=> rows.filter(r=>r.peritonitis==='YES' && inRangeDate(r.infectionDate,from,to)).length;

function RecordForm({ draft, readOnly, onChange, onSubmit, onCancel }){
  const [tab,setTab]=useState(SECTIONS[0].key);
  const map=useMemo(()=>Object.fromEntries(FIELDS.map(f=>[f.key,f])),[]);
  const need=['lastName','firstName','pin','infectionDate','initWbc'];
  const missing = Object.fromEntries(need.filter(k=>draft[k]===''||draft[k]==null).map(k=>[k,true]));
  const submit=(e)=>{e.preventDefault(); if(Object.keys(missing).length===0) { if(onSubmit) onSubmit(); }};
  const sect = SECTIONS.find(s=>s.key===tab);
  const show = (sect && sect.fieldKeys) || [];
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {SECTIONS.map(s=> <button key={s.key} type="button" className={`px-3 py-1.5 rounded-xl ${tab===s.key?'bg-indigo-600 text-white':'ring-1 ring-zinc-300 dark:ring-zinc-700'}`} onClick={()=>setTab(s.key)}>{s.title}</button>)}
      </div>
      {Object.keys(missing).length>0 && <div className="rounded-xl bg-red-50 text-red-700 ring-1 ring-red-200 px-3 py-2 text-sm">Missing required: Last/First, PIN, Date of Infection, Initial WBC</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {show.map(k=>{
          const f=map[k]; const v=draft[k]; const inv=!!missing[k];
          return <Field key={k} f={f} value={v} invalid={inv} readOnly={readOnly||f.readOnly} onChange={(val)=>onChange && onChange({...draft,[k]:val})}/>;
        })}
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <button type="button" onClick={onCancel} className={`${cls.btn}`}>Close</button>
        {!readOnly && <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white shadow">Save</button>}
      </div>
    </form>
  );
}

function DataTable({ rows, onEdit, onDelete, onView }){
  const [q,setQ]=useState(''); const [peri,setPeri]=useState(''); const [from,setFrom]=useState(''); const [to,setTo]=useState(''); const [applied,setApplied]=useState(false);
  const inRange=(d)=>{ if(!applied) return true; return inRangeDate(d,from,to); };
  const entries=useMemo(()=> rows.map((row,idx)=>({row,idx})).filter(({row})=>{
    const hay=Object.values(row).join(' ').toLowerCase();
    return (!q||hay.includes(q.toLowerCase())) && (!peri||row.peritonitis===peri) && inRange(row.infectionDate);
  }),[rows,q,peri,from,to,applied]);
  const count=useMemo(()=> applied? countPeritonitisRange(rows,from,to):null,[rows,from,to,applied]);
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-3">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input placeholder="Search all fields…" className={`w-full rounded-xl pl-9 pr-3 py-2 ${cls.ring} bg-white dark:bg-zinc-950`} value={q} onChange={e=>setQ(e.target.value)}/>
            <Search className="absolute left-3 top-2.5" size={16}/>
          </div>
          <select className={`${cls.ring} rounded-xl px-3 py-2 bg-white dark:bg-zinc-950`} value={peri} onChange={e=>setPeri(e.target.value)}>
            <option value="">All</option><option>YES</option><option>NO</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">From<input type="date" className={`${cls.ring} rounded-xl px-3 py-2 ml-2`} value={from} onChange={e=>setFrom(e.target.value)}/></label>
          <label className="text-sm">To<input type="date" className={`${cls.ring} rounded-xl px-3 py-2 ml-2`} value={to} onChange={e=>setTo(e.target.value)}/></label>
          <button className={cls.btn} onClick={()=>setApplied(true)}><Filter size={16}/>Isolate timeframe</button>
          {applied && <button className={cls.btn} onClick={()=>{setFrom('');setTo('');setApplied(false);}}>Clear</button>}
          {applied && <span className={`${cls.ring} ml-1 text-sm px-2 py-1 rounded-full`}>Peritonitis in range: <strong>{count}</strong></span>}
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-[1500px] w-full text-sm">
          <thead>
            <tr className="text-left border-b border-zinc-200 dark:border-zinc-800"><th className="py-2 pr-3">ID</th><th className="py-2 pr-3">Actions</th>{FIELDS.map(f=> <th key={f.key} className="py-2 pr-3 whitespace-nowrap">{f.label}</th>)}</tr>
          </thead>
          <tbody>
            {entries.map(({row,idx})=> (
              <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-3 align-top">{idx+1}</td>
                <td className="py-2 pr-3 align-top">
                  <div className="flex gap-2">
                    <button onClick={()=>onView(idx)} className={cls.btn} title="View"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" stroke="currentColor"/></svg></button>
                    <button onClick={()=>onEdit(idx)} className={cls.btn} title="Edit"><Edit3 size={14}/></button>
                    <button onClick={()=>onDelete(idx)} className={`${cls.btn} ring-red-300 text-red-600`} title="Delete"><Trash2 size={14}/></button>
                  </div>
                </td>
                {FIELDS.map(f=> {
                  const cell = row[f.key] != null ? row[f.key] : '';
                  return <td key={f.key} className="py-2 pr-3 align-top whitespace-nowrap max-w-[240px] truncate" title={String(cell)}>{String(cell)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function runSelfTests(){
  const out=[];
  out.push({name:'csvEscape comma',pass: csvEscape('a,b')==='"a,b"'});
  out.push({name:'csvEscape quote',pass: csvEscape('a"b')==='"a""b"'});
  out.push({name:'csvEscape newline',pass: csvEscape('a\\nb')==='"a\\nb"'});
  out.push({name:'csvEscape CRLF',pass: csvEscape('a\\r\\nb')==='"a\\r\\nb"'});
  const csv=toCSV([{},{}]);
  out.push({name:'CSV has newlines',pass: csv.split('\\n').length>=3});
  out.push({name:'Header col count',pass: csv.split('\\n')[0].split(',').length===1+FIELDS.length});
  out.push({name:'Row count matches',pass: csv.split('\\n').length===1+2});
  out.push({name:'daysInc inclusive',pass: daysInc('2025-01-01','2025-01-10')===10 && daysInc('2025-01-01','2025-01-01')===1});
  out.push({name:'daysInc edge invalid',pass: daysInc('bad','2025-01-02')===''});
  const dur=withDur({abx1Start:'2025-02-01',abx1End:'2025-02-02'});
  out.push({name:'withDur abx1Days',pass: dur.abx1Days===2});
  const quoted=toCSV([{lastName:'A,B',firstName:'Q',pin:'1'}]);
  out.push({name:'toCSV quotes commas',pass: quoted.includes('"A,B"')});
  out.push({name:'csvEscape null/empty',pass: csvEscape(null)==='' && csvEscape('')==='' });
  const dur2=withDur({});
  out.push({name:'withDur blanks -> empty strings',pass: dur2.abx1Days==='' && dur2.empiricDays===''});
  const preferExplicit=withDur({abx2Days:99,abx2Start:'2025-02-01',abx2End:'2025-02-05'});
  out.push({name:'withDur prefers explicit',pass: preferExplicit.abx2Days===99});
  out.push({name:'CSV header includes field',pass: toCSV([{}]).startsWith('ID,Patient Last Name')});
  const trows=[
    {peritonitis:'YES',infectionDate:'2025-01-10'},
    {peritonitis:'NO', infectionDate:'2025-01-10'},
    {peritonitis:'YES',infectionDate:'2025-02-01'},
  ];
  out.push({name:'count YES only',pass: countPeritonitisRange(trows,'2025-01-01','2025-12-31')===2});
  out.push({name:'count respects range',pass: countPeritonitisRange(trows,'2025-01-15','2025-01-31')===0});
  return out;
}

function TestPanel(){
  const [res,setRes]=useState([]); useEffect(()=>setRes(runSelfTests()),[]);
  const passed = res.filter(r=>r.pass).length;
  const total = res.length;
  const title = `Self-check (${passed}/${total} passed)`;
  return (
    <Section title={title} right={<button className={cls.btn} onClick={()=>setRes(runSelfTests())}>Re-run</button>}>
      <ul className="text-sm space-y-1">{res.map((r,i)=>(<li key={i} className={r.pass?'text-emerald-600':'text-red-600'}>{r.pass?'✔':'✖'} {r.name}</li>))}</ul>
    </Section>
  );
}

export default function PeritonitisTrackerDemo(){
  const [rows,setRows]=useLocal('peri_rows_v18', SEED.map(withDur));
  const [mode,setMode]=useState('table');
  const [draft,setDraft]=useState({});
  const [i,setI]=useState(null);
  const startNew=()=>{setDraft({});setMode('new');};
  const startEdit=(idx)=>{setI(idx);setDraft(rows[idx]);setMode('edit');};
  const startView=(idx)=>{setI(idx);setDraft(rows[idx]);setMode('view');};
  const cancel=()=>{setDraft({});setI(null);setMode('table');};
  const saveNew=()=>{setRows([...rows, withDur(draft)]); cancel();};
  const saveEdit=()=>{const next=[...rows]; next[i]=withDur(draft); setRows(next); cancel();};
  const del=(idx)=>{const next=rows.slice(); next.splice(idx,1); setRows(next)};
  const exportCSV=()=>{try{const csv='\\ufeff'+toCSV(rows); const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`peritonitis-tracking-${new Date().toISOString().slice(0,10)}.csv`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);}catch(e){const msg=(e && e.message) ? e.message : e; alert('Export failed: '+msg);}};
  const panelTitle = mode==='new' ? 'New Record' : mode==='edit' ? `Edit Record #${i!=null?i+1:''}` : `View Record #${i!=null?i+1:''}`;
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Peritonitis Tracking (Web Demo)</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Actions column second • Timeframe isolate & peritonitis-only count • Organism dropdown • Required fields enforced • Durations auto-computed • CSV export.</p>
          </div>
          <div className="flex gap-2">
            <button className={cls.btn} onClick={exportCSV}><Download size={16}/>Export CSV</button>
            <button className={cls.btn} onClick={startNew}><Plus size={16}/>New Record</button>
          </div>
        </header>

        {mode==='table' && (
          <Section title="Records">
            <DataTable rows={rows} onEdit={startEdit} onDelete={del} onView={startView} />
          </Section>
        )}

        {mode!=='table' && (
          <Section title={panelTitle} right={<button onClick={cancel} className={cls.btn}>Close</button>}>
            <RecordForm draft={draft} readOnly={mode==='view'} onChange={mode==='view'?undefined:setDraft} onSubmit={mode==='new'?saveNew:mode==='edit'?saveEdit:undefined} onCancel={cancel} />
          </Section>
        )}

        <TestPanel/>
      </div>
    </div>
  );
}
