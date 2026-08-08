const STORAGE_KEY = "kw-plumbing-office-v3";

const sampleRates = [
  {id:"r1",code:"LAB-STD",type:"Standard Plumber",rate:145,unit:"per hour",use:"Weekday scheduled work",notes:"Base technician billing rate",taxable:false,archived:false},
  {id:"r2",code:"LAB-AH",type:"After-Hours Plumber",rate:217.5,unit:"per hour",use:"Evenings/weekends",notes:"1.5× standard rate",taxable:false,archived:false},
  {id:"r3",code:"LAB-EMG",type:"Emergency Plumber",rate:290,unit:"per hour",use:"Urgent response",notes:"Priority response; confirm authorization",taxable:false,archived:false},
  {id:"r4",code:"LAB-HLP",type:"Helper / Apprentice",rate:85,unit:"per hour",use:"Second person/support",notes:"Use when job scope requires assistance",taxable:false,archived:false},
  {id:"r5",code:"TRV-MI",type:"Travel / Mileage",rate:2.25,unit:"per mile",use:"Outside standard service area",notes:"Bill round-trip mileage when approved",taxable:false,archived:false},
  {id:"r6",code:"TRV-HR",type:"Travel Time",rate:95,unit:"per hour",use:"Extended travel",notes:"Use instead of mileage when appropriate",taxable:false,archived:false},
  {id:"r7",code:"MIN-SVC",type:"Initial Visit / Diagnosis",rate:129,unit:"per visit",use:"Applied toward approved repair",notes:"Credit when repair is approved",taxable:false,archived:false},
  {id:"r8",code:"MIN-RPR",type:"Minimum Completed Repair",rate:225,unit:"per repair",use:"Small completed repair",notes:"Completed repair floor; parts handled separately",taxable:true,archived:false},
  {id:"r9",code:"PM-ADM",type:"Permit / Admin Handling",rate:95,unit:"each",use:"Permit coordination",notes:"Permit fees are separate",taxable:false,archived:false}
];

const sampleServices = [
  ["CUSTOM","Custom","Custom Price / Outside Catalog",0,0,false,"Build from labor codes, parts total, permits, and written scope."],
  ["TOI-ADJ","Toilets","Toilet adjustment or minor repair",225,1,true,"Parts separate; accessible fixture; no concealed damage."],
  ["TOI-RBLD","Toilets","Toilet tank rebuild",325,1.5,true,"Parts separate; standard accessible tank components."],
  ["TOI-REPL","Toilets","Toilet replacement labor",325,2,true,"Fixture and installation materials separate; flange repair excluded."],
  ["TOI-FLNG","Toilets","Accessible toilet flange repair",495,3,true,"Parts separate; flooring and structural restoration excluded."],
  ["FAU-KIT","Faucets","Kitchen faucet replacement labor",325,2,true,"Faucet and supply lines separate; accessible shutoffs."],
  ["FAU-LAV","Faucets","Bathroom faucet replacement labor",275,1.5,true,"Faucet, drain assembly, and supply lines separate."],
  ["FAU-CART","Faucets","Faucet cartridge replacement labor",225,1,true,"Cartridge and trim parts separate; model availability varies."],
  ["DSP-REPL","Disposals","Garbage disposal replacement labor",325,2,true,"Disposal separate; electrical repair and sink modification excluded."],
  ["WH-ELEC","Water Heaters","Electric water heater replacement labor",895,6,true,"Heater, permit, fittings, electrical upgrades, and disposal separate."],
  ["WH-GAS","Water Heaters","Gas water heater replacement labor",1095,7,true,"Heater, permit, venting, code upgrades, and disposal separate."],
  ["WH-TANKLESS","Water Heaters","Tankless water heater installation labor",2250,16,false,"Equipment and all utility upgrades separate; custom site review required."],
  ["SUMP-REPL","Sump Pumps","Sump pump replacement labor",365,2.5,true,"Pump and check valve separate; electrical and basin repair excluded."],
  ["HB-REPL","Hose Bibs","Frost-free hose bib replacement labor",325,2,true,"Hose bib and fittings separate; wall access and restoration excluded."],
  ["VAL-FIX","Shutoff Valves","Fixture shutoff valve replacement labor",225,1,true,"Valve and supply line separate; accessible piping."],
  ["VAL-MAIN","Shutoff Valves","Main shutoff valve replacement labor",475,3,false,"Valve and fittings separate; utility coordination and excavation excluded."],
  ["PIPE-ACC","Pipe Repair","Accessible pipe repair labor",275,1.5,false,"Parts separate; up to 2-inch pipe; wall and ceiling restoration excluded."],
  ["DW-CONN","Appliance Connections","Dishwasher plumbing connection",275,1.5,true,"Existing hookups; appliance and electrical work excluded."],
  ["ICE-LINE","Appliance Connections","Ice-maker line installation labor",325,2,true,"Tubing and valve separate; up to 20 accessible feet."],
  ["WASH-CONN","Appliance Connections","Washing-machine connection labor",275,1.5,true,"Hoses and valves separate; appliance and drain modification excluded."]
].map((x,i)=>({id:`s${i+1}`,code:x[0],category:x[1],description:x[2],price:x[3],hours:x[4],taxable:x[5],scope:x[6],archived:false}));

const defaultState = {
  company:{name:"KW Plumbing",address:"123 Service Lane, Appleton, WI 54911",phone:"(920) 555-0148",email:"office@kwplumbing.example",license:"WI License # Replace Me",taxRate:5.5,markup:30,deposit:25,expiration:30,terms:"Payment is due upon completion unless otherwise stated in writing.",warranty:"Labor is warranted for 12 months. Manufacturer warranties apply to supplied products. Warranty excludes misuse, freezing, existing defects, and unrelated system failures.",footer:"Thank you for choosing KW Plumbing. Serving Appleton and the Fox Cities."},
  rates:sampleRates,
  services:sampleServices,
  customers:[
    {id:"c1",name:"Jordan Miller",phone:"(920) 555-0182",email:"jordan@example.com",address:"742 W Glendale Ave, Appleton, WI 54914"},
    {id:"c2",name:"Casey Thompson",phone:"(920) 555-0129",email:"casey@example.com",address:"1810 S Oneida St, Appleton, WI 54915"}
  ],
  quote:{number:1,customerId:"",customerName:"",phone:"",email:"",address:"",date:isoToday(),expires:isoPlus(30),partsCost:0,markup:30,partsTaxable:true,laborLines:[],initialCredit:false,discount:0,taxRate:5.5,deposit:25,scope:"",exclusions:"Parts, permits, code upgrades, concealed damage, and restoration are excluded unless specifically listed.",terms:"Payment is due upon completion unless otherwise stated in writing.",warranty:"Labor is warranted for 12 months. Manufacturer warranties apply to supplied products.",approvedBy:"",approvalDate:""},
  invoice:{number:1,customer:"",address:"",issue:isoToday(),due:isoPlus(15),status:"Draft",terms:"Due upon receipt",scope:"",taxRate:5.5,lines:[],payments:[]}
};

let state = loadState();
let dialogContext = null;
let saveTimer;

function isoToday(){return new Date().toISOString().slice(0,10)}
function isoPlus(days){const d=new Date();d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
function clone(v){return JSON.parse(JSON.stringify(v))}
function money(v){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(Number(v)||0)}
function esc(v){return String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]))}
function loadState(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));return saved?{...clone(defaultState),...saved}:clone(defaultState)}catch{return clone(defaultState)}}
function save(){clearTimeout(saveTimer);$("saveState").textContent="Saving…";saveTimer=setTimeout(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));$("saveState").textContent="Saved locally";renderDashboard()},180)}
function $(id){return document.getElementById(id)}

const pages={dashboard:["OVERVIEW","Home"],rates:["PRICING","Labor Rates"],services:["PRICING","Services"],quote:["ESTIMATE","New Quote"],invoice:["BILLING","Invoice"],settings:["ACCOUNT","Settings"]};
function go(view){document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.view===view));$(`${view}View`).classList.add("active");$("pageEyebrow").textContent=pages[view][0];$("pageTitle").textContent=pages[view][1];$("sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"instant"});if(view==="rates")renderRates();if(view==="services")renderServices();if(view==="quote")renderQuote();if(view==="invoice")renderInvoice();if(view==="settings")renderSettings()}
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
$("menuButton").addEventListener("click",()=>$("sidebar").classList.toggle("open"));

function renderDashboard(){
  const byCode=code=>state.rates.find(r=>r.code===code)?.rate||0;
  const stats=[
    ["Standard plumber",money(byCode("LAB-STD")),"per hour"],
    ["Initial visit / diagnosis",money(byCode("MIN-SVC")),"applied to approved repair"],
    ["Minimum completed repair",money(byCode("MIN-RPR")),"small completed repair"],
    ["After-hours plumber",money(byCode("LAB-AH")),"per hour"],
    ["Emergency plumber",money(byCode("LAB-EMG")),"per hour"],
    ["Helper / apprentice",money(byCode("LAB-HLP")),"per hour"],
    ["Material markup",`${state.company.markup}%`,"default"],
    ["Wisconsin sales tax",`${state.company.taxRate}%`,"default"]
  ];
  $("dashboardStats").innerHTML=stats.map(x=>`<article class="card stat"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></article>`).join("");
  $("sideCompany").textContent=state.company.name||"KW Plumbing";
  $("dashQuoteTotal").textContent=money(quoteTotals().total);
  $("dashInvoiceBalance").textContent=money(invoiceTotals().balance);
  $("dashInvoiceStatus").textContent=state.invoice.status;
}

function renderRates(){
  const q=$("rateSearch").value.toLowerCase(),filter=$("rateFilter").value;
  const rows=state.rates.filter(r=>(filter==="all"||(filter==="archived")===r.archived)&&`${r.code} ${r.type} ${r.use} ${r.notes}`.toLowerCase().includes(q));
  $("ratesBody").innerHTML=rows.length?rows.map(r=>`<tr class="${r.archived?"archived":""}"><td><b>${esc(r.code)}</b></td><td>${esc(r.type)}</td><td><b>${money(r.rate)}</b></td><td>${esc(r.unit)}</td><td>${esc(r.use)}</td><td>${esc(r.notes)}</td><td><div class="actions"><button class="icon-btn" data-rate-edit="${r.id}" title="Edit">✎</button><button class="icon-btn" data-rate-dup="${r.id}" title="Duplicate">⧉</button><button class="icon-btn" data-rate-archive="${r.id}" title="${r.archived?"Restore":"Archive"}">${r.archived?"↺":"⌫"}</button></div></td></tr>`).join(""):`<tr><td class="empty" colspan="7">No rates match this search.</td></tr>`;
  document.querySelectorAll("[data-rate-edit]").forEach(b=>b.onclick=()=>openRate(b.dataset.rateEdit));
  document.querySelectorAll("[data-rate-dup]").forEach(b=>b.onclick=()=>duplicateRate(b.dataset.rateDup));
  document.querySelectorAll("[data-rate-archive]").forEach(b=>b.onclick=()=>archiveRate(b.dataset.rateArchive));
}
$("rateSearch").addEventListener("input",renderRates);$("rateFilter").addEventListener("change",renderRates);$("addRate").onclick=()=>openRate();
function openRate(id){const r=state.rates.find(x=>x.id===id)||{code:"",type:"",rate:0,unit:"per hour",use:"",notes:"",taxable:false};openEditor("rate",r,id?"Edit Rate":"Add Rate",[
  ["code","Rate code","text"],["type","Charge type","text"],["rate","Rate","number"],["unit","Unit","text"],["use","Typical use","text","wide"],["notes","Internal notes","textarea","wide"],["taxable","Taxable by default","checkbox"]
])}
function duplicateRate(id){const r=state.rates.find(x=>x.id===id);if(!r)return;state.rates.push({...clone(r),id:`r${Date.now()}`,code:`${r.code}-COPY`,type:`${r.type} Copy`,archived:false});save();renderRates()}
function archiveRate(id){const r=state.rates.find(x=>x.id===id);if(!r)return;if(confirm(`${r.archived?"Restore":"Archive"} ${r.code}?`)){r.archived=!r.archived;save();renderRates()}}

function renderServices(){
  const cats=[...new Set(state.services.map(s=>s.category))].sort();const selected=$("serviceCategory").value||"all";
  $("serviceCategory").innerHTML=`<option value="all">All categories</option>${cats.map(c=>`<option ${c===selected?"selected":""}>${esc(c)}</option>`).join("")}`;
  const q=$("serviceSearch").value.toLowerCase(),filter=$("serviceFilter").value,cat=$("serviceCategory").value;
  const rows=state.services.filter(s=>(cat==="all"||s.category===cat)&&(filter==="all"||(filter==="archived")===s.archived)&&`${s.code} ${s.category} ${s.description} ${s.scope}`.toLowerCase().includes(q));
  $("servicesBody").innerHTML=rows.length?rows.map(s=>`<tr class="${s.archived?"archived":""}"><td><b>${esc(s.code)}</b></td><td>${esc(s.category)}</td><td>${esc(s.description)}</td><td><b>${s.price?money(s.price):"Custom"}</b></td><td>${s.hours||"—"}</td><td><span class="pill ${s.taxable?"yes":"no"}">${s.taxable?"Yes":"No"}</span></td><td>${esc(s.scope)}</td><td><div class="actions"><button class="icon-btn" data-service-edit="${s.id}">✎</button><button class="icon-btn" data-service-dup="${s.id}">⧉</button><button class="icon-btn" data-service-archive="${s.id}">${s.archived?"↺":"⌫"}</button></div></td></tr>`).join(""):`<tr><td class="empty" colspan="8">No services match this search.</td></tr>`;
  document.querySelectorAll("[data-service-edit]").forEach(b=>b.onclick=()=>openService(b.dataset.serviceEdit));
  document.querySelectorAll("[data-service-dup]").forEach(b=>b.onclick=()=>duplicateService(b.dataset.serviceDup));
  document.querySelectorAll("[data-service-archive]").forEach(b=>b.onclick=()=>archiveService(b.dataset.serviceArchive));
}
$("serviceSearch").addEventListener("input",renderServices);$("serviceCategory").addEventListener("change",renderServices);$("serviceFilter").addEventListener("change",renderServices);$("addService").onclick=()=>openService();
function openService(id){const s=state.services.find(x=>x.id===id)||{code:"",category:"Custom",description:"",price:0,hours:0,taxable:false,scope:""};openEditor("service",s,id?"Edit Service":"Add Service",[
  ["code","Service code","text"],["category","Category","text"],["description","Description","text","wide"],["price","Flat rate","number"],["hours","Typical labor hours","number"],["taxable","Taxable","checkbox"],["scope","Scope / exclusions","textarea","wide"]
])}
function duplicateService(id){const s=state.services.find(x=>x.id===id);if(!s)return;state.services.push({...clone(s),id:`s${Date.now()}`,code:`${s.code}-COPY`,description:`${s.description} Copy`,archived:false});save();renderServices()}
function archiveService(id){const s=state.services.find(x=>x.id===id);if(!s)return;if(confirm(`${s.archived?"Restore":"Archive"} ${s.code}?`)){s.archived=!s.archived;save();renderServices()}}

function openEditor(kind,item,title,fields){
  dialogContext={kind,id:item.id||null,fields};$("dialogEyebrow").textContent=kind.toUpperCase();$("dialogTitle").textContent=title;
  $("dialogFields").innerHTML=fields.map(([key,label,type,wide])=>`<label class="${wide||""}">${label}${type==="textarea"?`<textarea data-field="${key}" rows="3">${esc(item[key])}</textarea>`:type==="checkbox"?`<input data-field="${key}" type="checkbox" ${item[key]?"checked":""}>`:`<input data-field="${key}" type="${type}" ${type==="number"?'step="0.01"':''} value="${esc(item[key])}" required>`}</label>`).join("");
  $("editDialog").showModal();
}
$("editForm").addEventListener("submit",e=>{e.preventDefault();const values={};dialogContext.fields.forEach(([key,,type])=>{const el=document.querySelector(`[data-field="${key}"]`);values[key]=type==="checkbox"?el.checked:type==="number"?Number(el.value):el.value.trim()});if(dialogContext.kind==="rate"){const existing=state.rates.find(x=>x.id===dialogContext.id);if(existing)Object.assign(existing,values);else state.rates.push({...values,id:`r${Date.now()}`,archived:false})}if(dialogContext.kind==="service"){const existing=state.services.find(x=>x.id===dialogContext.id);if(existing)Object.assign(existing,values);else state.services.push({...values,id:`s${Date.now()}`,archived:false})}if(dialogContext.kind==="customer"){const existing=state.customers.find(x=>x.id===dialogContext.id);if(existing)Object.assign(existing,values);else state.customers.push({...values,id:`c${Date.now()}`})}$("editDialog").close();save();renderRates();renderServices();renderSettings()});

const quoteFields={quoteCustomerName:"customerName",quoteCustomerPhone:"phone",quoteCustomerEmail:"email",quoteAddress:"address",quoteDate:"date",quoteExpires:"expires",partsCost:"partsCost",partsMarkup:"markup",quoteScope:"scope",quoteExclusions:"exclusions",quoteTerms:"terms",quoteWarranty:"warranty",quoteApprovedBy:"approvedBy",quoteApprovalDate:"approvalDate",quoteDiscount:"discount",quoteTaxRate:"taxRate",quoteDeposit:"deposit"};
Object.entries(quoteFields).forEach(([id,key])=>$(id).addEventListener("input",e=>{state.quote[key]=e.target.type==="number"?Number(e.target.value):e.target.value;save();updateQuote()}));
$("partsTaxable").onchange=e=>{state.quote.partsTaxable=e.target.checked;save();updateQuote()};$("initialCredit").onchange=e=>{state.quote.initialCredit=e.target.checked;save();updateQuote()};
$("quoteCustomerSelect").onchange=e=>{state.quote.customerId=e.target.value;const c=state.customers.find(x=>x.id===e.target.value);if(c){Object.assign(state.quote,{customerName:c.name,phone:c.phone,email:c.email,address:c.address});save();renderQuote()}};
function renderQuote(){
  $("quoteCustomerSelect").innerHTML=`<option value="">Choose saved customer…</option>${state.customers.map(c=>`<option value="${c.id}" ${c.id===state.quote.customerId?"selected":""}>${esc(c.name)} — ${esc(c.address)}</option>`).join("")}`;
  Object.entries(quoteFields).forEach(([id,key])=>$(id).value=state.quote[key]??"");$("partsTaxable").checked=state.quote.partsTaxable;$("initialCredit").checked=state.quote.initialCredit;$("quoteNumberText").textContent=`Q-${String(state.quote.number).padStart(4,"0")}`;renderQuoteLines();updateQuote();
}
function newLaborLine(){return{id:`ql${Date.now()}${Math.random()}`,rateId:"",qty:1,discount:0,taxable:false}}
$("addLaborLine").onclick=()=>{state.quote.laborLines.push(newLaborLine());save();renderQuoteLines()};
function renderQuoteLines(){
  if(!state.quote.laborLines.length)state.quote.laborLines.push(newLaborLine());
  const active=state.rates.filter(r=>!r.archived);
  $("quoteLaborBody").innerHTML=state.quote.laborLines.map((l,i)=>{const r=state.rates.find(x=>x.id===l.rateId);const subtotal=(r?.rate||0)*l.qty*(1-l.discount/100);return `<tr><td><select data-ql-rate="${i}"><option value="">Search / select labor code…</option>${active.map(x=>`<option value="${x.id}" ${x.id===l.rateId?"selected":""}>${esc(x.code)} — ${esc(x.type)} — ${money(x.rate)}</option>`).join("")}</select>${r?`<small>${esc(r.use)} · ${esc(r.notes)}</small>`:""}</td><td><input data-ql-qty="${i}" type="number" min="0" step="0.25" value="${l.qty}"></td><td>${esc(r?.unit||"—")}</td><td>${money(r?.rate)}</td><td><div class="suffix"><input data-ql-discount="${i}" type="number" min="0" max="100" value="${l.discount}"><span>%</span></div></td><td><input data-ql-tax="${i}" type="checkbox" ${l.taxable?"checked":""}></td><td><b>${money(subtotal)}</b></td><td><button class="icon-btn" data-ql-remove="${i}">×</button></td></tr>`}).join("");
  document.querySelectorAll("[data-ql-rate]").forEach(el=>el.onchange=e=>{const l=state.quote.laborLines[Number(e.target.dataset.qlRate)],r=state.rates.find(x=>x.id===e.target.value);l.rateId=e.target.value;l.taxable=!!r?.taxable;save();renderQuoteLines();updateQuote()});
  document.querySelectorAll("[data-ql-qty]").forEach(el=>el.oninput=e=>{state.quote.laborLines[Number(e.target.dataset.qlQty)].qty=Number(e.target.value);save();updateQuote();renderQuoteLines()});
  document.querySelectorAll("[data-ql-discount]").forEach(el=>el.oninput=e=>{state.quote.laborLines[Number(e.target.dataset.qlDiscount)].discount=Number(e.target.value);save();updateQuote();renderQuoteLines()});
  document.querySelectorAll("[data-ql-tax]").forEach(el=>el.onchange=e=>{state.quote.laborLines[Number(e.target.dataset.qlTax)].taxable=e.target.checked;save();updateQuote()});
  document.querySelectorAll("[data-ql-remove]").forEach(el=>el.onclick=e=>{state.quote.laborLines.splice(Number(e.target.dataset.qlRemove),1);save();renderQuoteLines();updateQuote()});
  const repairSelected=state.quote.laborLines.some(l=>state.rates.find(r=>r.id===l.rateId)?.code==="MIN-RPR");$("repairPolicy").classList.toggle("show",repairSelected);
}
function quoteTotals(){
  const labor=state.quote.laborLines.reduce((sum,l)=>{const r=state.rates.find(x=>x.id===l.rateId);return sum+(r?.rate||0)*l.qty*(1-l.discount/100)},0);
  const taxableLabor=state.quote.laborLines.filter(l=>l.taxable).reduce((sum,l)=>{const r=state.rates.find(x=>x.id===l.rateId);return sum+(r?.rate||0)*l.qty*(1-l.discount/100)},0);
  const partsCost=Number(state.quote.partsCost)||0,markup=partsCost*(Number(state.quote.markup)||0)/100,partsPrice=partsCost+markup,credit=state.quote.initialCredit?129:0;
  const preDiscount=Math.max(0,labor+partsPrice-credit),discount=preDiscount*(Number(state.quote.discount)||0)/100;
  const taxableBefore=Math.max(0,taxableLabor+(state.quote.partsTaxable?partsPrice:0)-(state.quote.initialCredit?129:0));
  const taxable=Math.max(0,taxableBefore*(1-(Number(state.quote.discount)||0)/100)),tax=taxable*(Number(state.quote.taxRate)||0)/100,total=preDiscount-discount+tax,deposit=total*(Number(state.quote.deposit)||0)/100;
  return{labor,partsCost,markup,partsPrice,credit,discount,taxable,tax,total,deposit,balance:total-deposit};
}
function updateQuote(){const t=quoteTotals();$("partsMarkupAmount").textContent=money(t.markup);$("customerPartsPrice").textContent=money(t.partsPrice);$("qLaborSubtotal").textContent=money(t.labor);$("qPartsCost").textContent=money(t.partsCost);$("qMarkup").textContent=money(t.markup);$("qPartsPrice").textContent=money(t.partsPrice);$("qCredit").textContent=t.credit?`−${money(t.credit)}`:money(0);$("qDiscountAmount").textContent=t.discount?`−${money(t.discount)}`:money(0);$("qTaxable").textContent=money(t.taxable);$("qTax").textContent=money(t.tax);$("qDepositAmount").textContent=money(t.deposit);$("qTotal").textContent=money(t.total);$("qBalance").textContent=money(t.balance)}

function quoteDocument(){const q=state.quote,t=quoteTotals();const lines=q.laborLines.map(l=>{const r=state.rates.find(x=>x.id===l.rateId);return r?`<tr><td>${esc(r.type)}<br><small>${esc(r.use)}</small></td><td>${l.qty} ${esc(r.unit.replace("per ",""))}</td><td>${money(r.rate)}</td><td>${money(r.rate*l.qty*(1-l.discount/100))}</td></tr>`:""}).join("");const parts=t.partsPrice?`<tr><td>Parts and materials</td><td>1</td><td>${money(t.partsPrice)}</td><td>${money(t.partsPrice)}</td></tr>`:"";return documentHtml("QUOTE",`Q-${String(q.number).padStart(4,"0")}`,q.customerName,q.address,q.date,q.expires,`${lines}${parts}${q.initialCredit?`<tr><td>Initial visit credit</td><td>1</td><td>−${money(129)}</td><td>−${money(129)}</td></tr>`:""}`,t,q.scope,q.exclusions,q.terms,q.warranty,true)}
function documentHtml(kind,number,customer,address,date,due,lines,t,scope,exclusions,terms,warranty,approval){return `<div class="doc-header"><div><h2>${esc(state.company.name)}</h2><p>${esc(state.company.address)}</p><p>${esc(state.company.phone)} · ${esc(state.company.email)}</p><p>${esc(state.company.license)}</p></div><div class="doc-title"><strong>${kind}</strong><p>${number}</p><p>Date: ${date}</p><p>${kind==="QUOTE"?"Expires":"Due"}: ${due}</p></div></div><div class="doc-grid"><div class="doc-box"><h4>Prepared for</h4><b>${esc(customer||"Customer")}</b><p>${esc(address||"")}</p></div><div class="doc-box"><h4>Scope of work</h4><p>${esc(scope||"See itemized work below.")}</p></div></div><table class="doc-table"><thead><tr><th>Description</th><th>Quantity</th><th>Rate</th><th>Amount</th></tr></thead><tbody>${lines}</tbody></table><div class="doc-totals"><div><span>Subtotal</span><b>${money(t.total-t.tax)}</b></div><div><span>Sales tax</span><b>${money(t.tax)}</b></div><div class="total"><span>Total</span><b>${money(t.total)}</b></div>${kind==="INVOICE"?`<div><span>Paid</span><b>${money(t.paid)}</b></div><div class="total"><span>Balance due</span><b>${money(t.balance)}</b></div>`:`<div><span>Deposit requested</span><b>${money(t.deposit)}</b></div><div><span>Balance due</span><b>${money(t.balance)}</b></div>`}</div><div class="doc-grid"><div><h4>Exclusions</h4><p>${esc(exclusions||"None stated")}</p></div><div><h4>Terms & warranty</h4><p>${esc(terms)}</p><p>${esc(warranty)}</p></div></div>${approval?`<div class="approval"><div class="signature">Customer name / signature</div><div class="signature">Approval date</div></div>`:""}<p class="payment-line">${esc(state.company.footer)}</p>`}
function showPreview(html){$("documentPreview").innerHTML=html;$("previewDialog").showModal()}
$("previewQuote").onclick=()=>showPreview(quoteDocument());$("printQuote").onclick=()=>{showPreview(quoteDocument());setTimeout(()=>window.print(),100)};$("closePreview").onclick=()=>$("previewDialog").close();$("printPreview").onclick=()=>window.print();

$("quoteToInvoice").onclick=()=>{syncInvoiceFromQuote();go("invoice")};
function syncInvoiceFromQuote(){const q=state.quote,t=quoteTotals();state.invoice.customer=q.customerName;state.invoice.address=q.address;state.invoice.issue=isoToday();state.invoice.due=isoPlus(15);state.invoice.status="Draft";state.invoice.terms=q.terms;state.invoice.scope=q.scope;state.invoice.taxRate=q.taxRate;state.invoice.lines=q.laborLines.map(l=>{const r=state.rates.find(x=>x.id===l.rateId);return{id:`il${Date.now()}${Math.random()}`,description:r?.type||"Labor",qty:l.qty,rate:(r?.rate||0)*(1-l.discount/100),taxable:l.taxable}});if(t.partsPrice)state.invoice.lines.push({id:`ilp${Date.now()}`,description:"Parts and materials",qty:1,rate:t.partsPrice,taxable:q.partsTaxable});if(q.initialCredit)state.invoice.lines.push({id:`ilc${Date.now()}`,description:"Initial visit credit",qty:1,rate:-129,taxable:true});state.invoice.payments=[];save();renderInvoice()}
$("syncInvoiceQuote").onclick=()=>{if(confirm("Replace current invoice lines and customer details with the active quote?"))syncInvoiceFromQuote()};

const invoiceFields={invoiceCustomer:"customer",invoiceAddress:"address",invoiceIssue:"issue",invoiceDue:"due",invoiceStatus:"status",invoiceTerms:"terms",invoiceScope:"scope"};Object.entries(invoiceFields).forEach(([id,key])=>$(id).addEventListener("input",e=>{state.invoice[key]=e.target.value;save();renderInvoiceTotals()}));
function renderInvoice(){Object.entries(invoiceFields).forEach(([id,key])=>$(id).value=state.invoice[key]??"");$("invoiceNumberText").textContent=`INV-${String(state.invoice.number).padStart(4,"0")}`;renderInvoiceLines();renderPayments();renderInvoiceTotals()}
$("addInvoiceLine").onclick=()=>{state.invoice.lines.push({id:`il${Date.now()}`,description:"Custom invoice line",qty:1,rate:0,taxable:false});save();renderInvoiceLines()};
function renderInvoiceLines(){const rows=state.invoice.lines;$("invoiceLinesBody").innerHTML=rows.length?rows.map((l,i)=>`<tr><td><input data-il-desc="${i}" value="${esc(l.description)}"></td><td><input data-il-qty="${i}" type="number" min="0" step="0.25" value="${l.qty}"></td><td><input data-il-rate="${i}" type="number" step="0.01" value="${l.rate}"></td><td><input data-il-tax="${i}" type="checkbox" ${l.taxable?"checked":""}></td><td><b>${money(l.qty*l.rate)}</b></td><td><button class="icon-btn" data-il-remove="${i}">×</button></td></tr>`).join(""):`<tr><td class="empty" colspan="6">No invoice lines yet. Add a line or reuse the current quote.</td></tr>`;document.querySelectorAll("[data-il-desc]").forEach(el=>el.oninput=e=>updateInvoiceLine(e,"description"));document.querySelectorAll("[data-il-qty]").forEach(el=>el.oninput=e=>updateInvoiceLine(e,"qty"));document.querySelectorAll("[data-il-rate]").forEach(el=>el.oninput=e=>updateInvoiceLine(e,"rate"));document.querySelectorAll("[data-il-tax]").forEach(el=>el.onchange=e=>{state.invoice.lines[Number(e.target.dataset.ilTax)].taxable=e.target.checked;save();renderInvoiceTotals()});document.querySelectorAll("[data-il-remove]").forEach(el=>el.onclick=e=>{state.invoice.lines.splice(Number(e.target.dataset.ilRemove),1);save();renderInvoiceLines();renderInvoiceTotals()})}
function updateInvoiceLine(e,key){const index=Number(e.target.dataset[key==="description"?"ilDesc":key==="qty"?"ilQty":"ilRate"]);state.invoice.lines[index][key]=key==="description"?e.target.value:Number(e.target.value);save();renderInvoiceTotals()}
function invoiceTotals(){const subtotal=state.invoice.lines.reduce((s,l)=>s+l.qty*l.rate,0),taxable=state.invoice.lines.filter(l=>l.taxable).reduce((s,l)=>s+l.qty*l.rate,0),tax=Math.max(0,taxable)*state.invoice.taxRate/100,total=subtotal+tax,paid=state.invoice.payments.reduce((s,p)=>s+p.amount,0);return{subtotal,tax,total,paid,balance:Math.max(0,total-paid)}}
function renderInvoiceTotals(){const t=invoiceTotals();$("iSubtotal").textContent=money(t.subtotal);$("iTax").textContent=money(t.tax);$("iTotal").textContent=money(t.total);$("iPaid").textContent=money(t.paid);$("iBalance").textContent=money(t.balance);if(t.balance===0&&t.total>0)state.invoice.status="Paid";$("dashInvoiceBalance").textContent=money(t.balance);$("dashInvoiceStatus").textContent=state.invoice.status}
function renderPayments(){const p=state.invoice.payments;$("paymentsBody").innerHTML=p.length?p.map((x,i)=>`<tr><td>${x.date}</td><td>${esc(x.note)}</td><td><b>${money(x.amount)}</b></td><td><button class="icon-btn" data-payment-remove="${i}">×</button></td></tr>`).join(""):`<tr><td class="empty" colspan="4">No payments recorded.</td></tr>`;document.querySelectorAll("[data-payment-remove]").forEach(b=>b.onclick=e=>{if(confirm("Remove this payment record?")){state.invoice.payments.splice(Number(e.target.dataset.paymentRemove),1);save();renderPayments();renderInvoiceTotals()}})}
$("recordPayment").onclick=()=>{const amount=Number(prompt("Payment amount:"));if(!amount||amount<=0)return;const note=prompt("Payment method or note:","Card payment")||"Payment";state.invoice.payments.push({date:isoToday(),note,amount});state.invoice.status=invoiceTotals().balance>0?"Partially Paid":"Paid";save();renderInvoice()};
$("markPaid").onclick=()=>{const t=invoiceTotals();if(t.balance<=0)return;if(confirm(`Record ${money(t.balance)} as paid today?`)){state.invoice.payments.push({date:isoToday(),note:"Paid in full",amount:t.balance});state.invoice.status="Paid";save();renderInvoice()}};
$("duplicateInvoice").onclick=()=>{if(confirm("Duplicate this invoice as a new draft?")){state.invoice.number+=1;state.invoice.status="Draft";state.invoice.issue=isoToday();state.invoice.due=isoPlus(15);state.invoice.payments=[];save();renderInvoice()}};
function invoiceDocument(){const i=state.invoice,t=invoiceTotals(),lines=i.lines.map(l=>`<tr><td>${esc(l.description)}</td><td>${l.qty}</td><td>${money(l.rate)}</td><td>${money(l.qty*l.rate)}</td></tr>`).join("");return documentHtml("INVOICE",`INV-${String(i.number).padStart(4,"0")}`,i.customer,i.address,i.issue,i.due,lines,{...t,deposit:0},i.scope,"",i.terms,"",false)}
$("printInvoice").onclick=()=>{showPreview(invoiceDocument());setTimeout(()=>window.print(),100)};$("downloadInvoice").onclick=()=>{showPreview(invoiceDocument());setTimeout(()=>window.print(),100)};

const companyFields={companyName:"name",companyLicense:"license",companyAddress:"address",companyPhone:"phone",companyEmail:"email",settingTax:"taxRate",settingMarkup:"markup",settingDeposit:"deposit",settingExpiration:"expiration",settingTerms:"terms",settingWarranty:"warranty",settingFooter:"footer"};Object.entries(companyFields).forEach(([id,key])=>$(id).addEventListener("input",e=>{state.company[key]=e.target.type==="number"?Number(e.target.value):e.target.value;if(key==="taxRate")state.quote.taxRate=state.company.taxRate;if(key==="markup")state.quote.markup=state.company.markup;if(key==="deposit")state.quote.deposit=state.company.deposit;save();renderDashboard()}));
function renderSettings(){Object.entries(companyFields).forEach(([id,key])=>$(id).value=state.company[key]??"");$("customersBody").innerHTML=state.customers.length?state.customers.map(c=>`<tr><td><b>${esc(c.name)}</b></td><td>${esc(c.phone)}</td><td>${esc(c.email)}</td><td>${esc(c.address)}</td><td><div class="actions"><button class="icon-btn" data-customer-edit="${c.id}">✎</button><button class="icon-btn" data-customer-delete="${c.id}">×</button></div></td></tr>`).join(""):`<tr><td class="empty" colspan="5">No customers saved yet.</td></tr>`;document.querySelectorAll("[data-customer-edit]").forEach(b=>b.onclick=()=>openCustomer(b.dataset.customerEdit));document.querySelectorAll("[data-customer-delete]").forEach(b=>b.onclick=()=>deleteCustomer(b.dataset.customerDelete))}
$("addCustomer").onclick=()=>openCustomer();function openCustomer(id){const c=state.customers.find(x=>x.id===id)||{name:"",phone:"",email:"",address:""};openEditor("customer",c,id?"Edit Customer":"Add Customer",[["name","Customer name","text"],["phone","Phone","text"],["email","Email","email"],["address","Service address","text","wide"]])}function deleteCustomer(id){const c=state.customers.find(x=>x.id===id);if(c&&confirm(`Delete ${c.name}?`)){state.customers=state.customers.filter(x=>x.id!==id);save();renderSettings()}}

$("exportData").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`kw-plumbing-backup-${isoToday()}.json`;a.click();URL.revokeObjectURL(a.href)};
$("importData").onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());state={...clone(defaultState),...data};save();renderAll();alert("Backup imported successfully.")}catch{alert("That file is not a valid KW Plumbing backup.")}e.target.value=""};
$("resetData").onclick=()=>{if(confirm("Reset all rates, services, customers, quotes, invoices, and settings to editable sample data?")){state=clone(defaultState);localStorage.removeItem(STORAGE_KEY);save();renderAll()}};

function renderAll(){renderDashboard();renderRates();renderServices();renderQuote();renderInvoice();renderSettings()}
renderAll();
