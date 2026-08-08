const STORAGE_KEY = "kw-plumbing-pricebook-v1";

const sampleCatalog = [
  ["LAB-STD","Labor","Standard plumber",52,145,"hour","nontaxable","Scheduled weekday technician labor."],
  ["LAB-AH","Labor","After-hours plumber",78,217.5,"hour","review","Tax follows the underlying service or repair."],
  ["LAB-EMG","Labor","Emergency plumber",104,290,"hour","review","Tax follows the underlying service or repair."],
  ["LAB-HLP","Labor","Helper / apprentice",32,85,"hour","review","Second person or jobsite support."],
  ["MIN-SVC","Service","Minimum service charge",58,189,"visit","review","Dispatch and initial assessment; tax follows work performed."],
  ["DIAG","Service","Plumbing diagnostic - first hour",62,195,"visit","review","Tax depends on the item diagnosed and work performed."],
  ["TOI-NEW","Service","Toilet - original installation",180,575,"each","nontaxable","Real-property installation example; contractor pays tax on materials."],
  ["TOI-REP","Service","Toilet replacement - standard",235,675,"each","taxable","Wisconsin bathroom-fixture replacement; standard access."],
  ["TOI-RBLD","Service","Toilet tank rebuild",72,289,"each","taxable","Standard fill valve, flush valve, flapper, and seals."],
  ["TOI-FLNG","Service","Toilet flange repair",165,525,"each","taxable","Accessible flange; flooring and structural repair excluded."],
  ["FAU-KIT","Service","Kitchen faucet replacement",155,425,"each","taxable","Customer-supplied faucet; accessible shutoffs."],
  ["FAU-BTH","Service","Bathroom faucet replacement",130,365,"each","taxable","Customer-supplied faucet; accessible shutoffs."],
  ["DSP-INST","Service","Garbage disposal replacement",205,495,"each","taxable","Standard 1/2 HP disposal included; electrical repair excluded."],
  ["WH-E40","Service","40-gallon electric water heater replacement",1050,1850,"each","taxable","Standard access and connections; permit extra."],
  ["WH-G40","Service","40-gallon gas water heater replacement",1325,2350,"each","taxable","Standard venting; permit and code upgrades extra."],
  ["WH-TANK","Service","Tankless water heater installation",2900,4950,"each","review","Site-specific; utility, venting, and electrical upgrades excluded."],
  ["HB-REP","Service","Frost-free hose bib replacement",135,425,"each","taxable","Accessible piping; wall repair excluded."],
  ["DR-SINK","Service","Sink or lavatory drain clearing",65,225,"each","taxable","One fixture using standard cable equipment."],
  ["DR-MAIN","Service","Main sewer cable cleaning",175,575,"each","taxable","Accessible cleanout; roots and damaged pipe excluded."],
  ["DR-HYDRO","Service","Hydro jetting - initial two hours",340,995,"service","taxable","Accessible cleanout; camera inspection recommended."],
  ["CAM-SEW","Service","Sewer camera inspection",115,425,"service","taxable","Accessible cleanout; locating charged separately."],
  ["LEAK","Service","Leak diagnostic - first hour",62,195,"service","review","Destructive access and restoration excluded."],
  ["PRV","Service","Pressure reducing valve replacement",215,625,"each","taxable","Accessible valve; excavation excluded."],
  ["SUMP","Service","Sump pump replacement",275,675,"each","taxable","Standard pump; electrical work excluded."],
  ["SEW-SPOT","Service","Sewer spot repair - accessible",1050,2450,"each","review","Excavation, permits, and restoration priced separately."],
  ["SEW-FT","Service","Building sewer replacement",145,285,"foot","review","Soil, depth, access, and restoration affect final rate."],
  ["PIPE-FIX","Service","Accessible pipe repair - up to 2 inches",95,385,"each","review","Wall and ceiling restoration excluded."],
  ["VAL-MAIN","Service","Main shutoff valve replacement",210,625,"each","review","Utility coordination and access may be extra."],
  ["MAT-BALL","Material","3/4-inch ball valve",26,40.3,"each","taxable","Example supplier cost and 55% markup."],
  ["MAT-SUP","Material","Braided fixture supply line",12,19.2,"each","taxable","Example supplier cost and 60% markup."],
  ["MAT-WAX","Material","Wax ring and toilet bolts",11,18.15,"set","taxable","Example supplier cost and 65% markup."],
  ["MAT-FILL","Material","Universal toilet fill valve",19,30.4,"each","taxable","Example supplier cost and 60% markup."],
  ["MAT-PVC4","Material","4-inch PVC pipe",9.75,15.6,"foot","taxable","Example supplier cost and 60% markup."],
  ["EX-MOB","Equipment","Equipment mobilization",225,450,"trip","review","Within standard service area."],
  ["EX-MINI","Equipment","Mini excavator with operator",92,195,"hour","review","Four-hour minimum; trucking may be additional."],
  ["EX-SKID","Equipment","Skid steer with operator",88,185,"hour","review","Four-hour minimum; attachments may be additional."],
  ["EX-HAND","Labor","Two-person hand excavation crew",96,225,"hour","review","Two-hour minimum."],
  ["EX-TRENCH","Equipment","Open trench excavation - up to 4 feet",45,95,"foot","review","Ten-foot minimum; soil and access dependent."],
  ["EX-HAUL","Equipment","Spoils haul-off",340,675,"load","review","Disposal included up to allowance."],
  ["EX-CONC","Equipment","Concrete patch allowance",16,32,"sq ft","review","25-square-foot minimum; color match not guaranteed."]
].map((x,i)=>({id:`item-${i+1}`,code:x[0],category:x[1],description:x[2],cost:x[3],price:x[4],unit:x[5],tax:x[6],notes:x[7]}));

const defaults = {
  company:{name:"KW Plumbing",phone:"",email:"",license:"",address:""},
  settings:{taxRate:5.5,targetMargin:40,deposit:50,materialMarkup:40},
  catalog:sampleCatalog,
  quote:{number:1,customer:"",phone:"",address:"",date:today(),validThrough:addDays(30),discount:0,taxRate:5.5,deposit:50,notes:"",lines:[]},
  profit:{hours:8,laborCost:52,materials:650,equipment:0,other:0,overhead:18,contingency:5,target:40,price:2500}
};

let state = loadState();
let saveTimer;

function today(){return new Date().toISOString().slice(0,10)}
function addDays(days){const d=new Date();d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
function clone(value){return JSON.parse(JSON.stringify(value))}
function loadState(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));return saved?mergeState(saved):clone(defaults)}catch{return clone(defaults)}}
function mergeState(saved){return {...clone(defaults),...saved,company:{...defaults.company,...saved.company},settings:{...defaults.settings,...saved.settings},quote:{...defaults.quote,...saved.quote},profit:{...defaults.profit,...saved.profit},catalog:Array.isArray(saved.catalog)?saved.catalog:clone(sampleCatalog)}}
function saveState(){clearTimeout(saveTimer);document.getElementById("saveState").textContent="Saving…";saveTimer=setTimeout(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));document.getElementById("saveState").textContent="Saved locally";renderDashboard()},250)}
const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(Number(n)||0);
const escapeHtml=s=>String(s??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

const views={dashboard:["OPERATIONS","Dashboard"],catalog:["PRICEBOOK","Price Catalog"],quote:["ESTIMATING","Quote Builder"],profit:["JOB ECONOMICS","Profit Calculator"],settings:["ADMINISTRATION","Settings & Data"]};
function go(view){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));document.querySelectorAll(".nav-link").forEach(v=>v.classList.toggle("active",v.dataset.view===view));document.getElementById(`${view}View`).classList.add("active");document.getElementById("pageEyebrow").textContent=views[view][0];document.getElementById("pageTitle").textContent=views[view][1];document.querySelector(".sidebar").classList.remove("open");if(view==="catalog")renderCatalog();if(view==="quote")renderQuote();if(view==="profit")renderProfit()}
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
document.getElementById("menuButton").addEventListener("click",()=>document.querySelector(".sidebar").classList.toggle("open"));

function quoteTotals(){const subtotal=state.quote.lines.reduce((s,l)=>s+(Number(l.qty)||0)*(Number(l.price)||0),0);const factor=1-(Number(state.quote.discount)||0)/100;const discounted=subtotal*factor;const taxable=state.quote.lines.filter(l=>l.tax==="taxable").reduce((s,l)=>s+(Number(l.qty)||0)*(Number(l.price)||0),0)*factor;const tax=taxable*(Number(state.quote.taxRate)||0)/100;const total=discounted+tax;return{subtotal,taxable,tax,total,deposit:total*(Number(state.quote.deposit)||0)/100}}
function renderDashboard(){const standard=state.catalog.find(i=>i.code==="LAB-STD");const minimum=state.catalog.find(i=>i.code==="MIN-SVC");document.getElementById("dashLabor").textContent=money(standard?.price);document.getElementById("dashMinimum").textContent=money(minimum?.price);document.getElementById("dashItems").textContent=state.catalog.length;document.getElementById("dashQuote").textContent=money(quoteTotals().total);document.getElementById("marginGauge").textContent=`${state.settings.targetMargin}%`}

function renderCatalog(){const q=document.getElementById("catalogSearch").value.toLowerCase();const filter=document.getElementById("catalogFilter").value;const items=state.catalog.filter(i=>(filter==="all"||i.category===filter)&&`${i.code} ${i.description} ${i.notes}`.toLowerCase().includes(q));const body=document.getElementById("catalogBody");body.innerHTML=items.length?items.map(i=>`<tr><td><strong>${escapeHtml(i.code)}</strong></td><td>${escapeHtml(i.category)}</td><td><strong>${escapeHtml(i.description)}</strong><br><small>${escapeHtml(i.notes)}</small></td><td>${money(i.cost)}</td><td class="price-cell">${money(i.price)}</td><td>per ${escapeHtml(i.unit)}</td><td><span class="tax-pill ${i.tax}">${i.tax==="taxable"?"Taxable":i.tax==="nontaxable"?"Not taxable":"Review job"}</span></td><td><div class="row-actions"><button class="icon-button edit-item" data-id="${i.id}" title="Edit">✎</button><button class="icon-button delete-item danger-text" data-id="${i.id}" title="Delete">×</button></div></td></tr>`).join(""):`<tr><td colspan="8" class="empty-state">No catalog items match this search.</td></tr>`;body.querySelectorAll(".edit-item").forEach(b=>b.addEventListener("click",()=>openCatalogDialog(b.dataset.id)));body.querySelectorAll(".delete-item").forEach(b=>b.addEventListener("click",()=>deleteCatalogItem(b.dataset.id)))}
document.getElementById("catalogSearch").addEventListener("input",renderCatalog);document.getElementById("catalogFilter").addEventListener("change",renderCatalog);document.getElementById("addCatalogItem").addEventListener("click",()=>openCatalogDialog());
function openCatalogDialog(id){const item=state.catalog.find(i=>i.id===id);document.getElementById("dialogTitle").textContent=item?"Edit item":"Add item";document.getElementById("catalogEditId").value=item?.id||"";document.getElementById("catalogCode").value=item?.code||"";document.getElementById("catalogCategory").value=item?.category||"Service";document.getElementById("catalogDescription").value=item?.description||"";document.getElementById("catalogCost").value=item?.cost??"";document.getElementById("catalogPrice").value=item?.price??"";document.getElementById("catalogUnit").value=item?.unit||"each";document.getElementById("catalogTax").value=item?.tax||"review";document.getElementById("catalogNotes").value=item?.notes||"";document.getElementById("catalogDialog").showModal()}
document.getElementById("catalogForm").addEventListener("submit",e=>{e.preventDefault();const id=document.getElementById("catalogEditId").value||`item-${Date.now()}`;const item={id,code:document.getElementById("catalogCode").value.trim(),category:document.getElementById("catalogCategory").value,description:document.getElementById("catalogDescription").value.trim(),cost:Number(document.getElementById("catalogCost").value),price:Number(document.getElementById("catalogPrice").value),unit:document.getElementById("catalogUnit").value.trim()||"each",tax:document.getElementById("catalogTax").value,notes:document.getElementById("catalogNotes").value.trim()};const index=state.catalog.findIndex(i=>i.id===id);if(index>=0)state.catalog[index]=item;else state.catalog.push(item);document.getElementById("catalogDialog").close();saveState();renderCatalog()});
function deleteCatalogItem(id){const item=state.catalog.find(i=>i.id===id);if(item&&confirm(`Delete “${item.description}” from the catalog?`)){state.catalog=state.catalog.filter(i=>i.id!==id);saveState();renderCatalog()}}

const quoteBindings={customerName:"customer",customerPhone:"phone",jobAddress:"address",quoteDate:"date",validThrough:"validThrough",quoteNotes:"notes",quoteDiscount:"discount",quoteTaxRate:"taxRate",depositPercent:"deposit"};
Object.entries(quoteBindings).forEach(([id,key])=>document.getElementById(id).addEventListener("input",e=>{state.quote[key]=e.target.type==="number"?Number(e.target.value):e.target.value;saveState();if(e.target.type==="number")updateQuoteSummary()}));
function renderQuote(){for(const[id,key]of Object.entries(quoteBindings))document.getElementById(id).value=state.quote[key]??"";document.getElementById("quoteNumberLabel").textContent=`Q-${String(state.quote.number).padStart(4,"0")}`;renderQuoteLines();updateQuoteSummary()}
function renderQuoteLines(){const body=document.getElementById("quoteBody");if(!state.quote.lines.length)state.quote.lines.push(newLine());body.innerHTML=state.quote.lines.map((l,index)=>`<tr><td><select class="line-item" data-index="${index}"><option value="">Select a catalog item…</option>${state.catalog.map(i=>`<option value="${i.id}" ${l.itemId===i.id?"selected":""}>${escapeHtml(i.description)} — ${money(i.price)}</option>`).join("")}</select>${l.itemId?`<small>${escapeHtml(state.catalog.find(i=>i.id===l.itemId)?.notes||"")}</small>`:""}</td><td><input class="line-qty" data-index="${index}" type="number" min="0" step="0.25" value="${l.qty}"></td><td><input class="line-price" data-index="${index}" type="number" min="0" step="0.01" value="${l.price}"></td><td><select class="tax-select line-tax" data-index="${index}"><option value="taxable" ${l.tax==="taxable"?"selected":""}>Taxable</option><option value="nontaxable" ${l.tax==="nontaxable"?"selected":""}>Not taxable</option><option value="review" ${l.tax==="review"?"selected":""}>Review</option></select></td><td class="price-cell">${money(l.qty*l.price)}</td><td><button class="icon-button remove-line danger-text" data-index="${index}" title="Remove">×</button></td></tr>`).join("");body.querySelectorAll(".line-item").forEach(el=>el.addEventListener("change",e=>{const item=state.catalog.find(i=>i.id===e.target.value);const l=state.quote.lines[Number(e.target.dataset.index)];l.itemId=item?.id||"";l.price=item?.price||0;l.tax=item?.tax||"review";saveState();renderQuoteLines();updateQuoteSummary()}));body.querySelectorAll(".line-qty,.line-price").forEach(el=>el.addEventListener("input",e=>{state.quote.lines[Number(e.target.dataset.index)][e.target.classList.contains("line-qty")?"qty":"price"]=Number(e.target.value);saveState();renderQuoteLines();updateQuoteSummary()}));body.querySelectorAll(".line-tax").forEach(el=>el.addEventListener("change",e=>{state.quote.lines[Number(e.target.dataset.index)].tax=e.target.value;saveState();updateQuoteSummary()}));body.querySelectorAll(".remove-line").forEach(el=>el.addEventListener("click",e=>{state.quote.lines.splice(Number(e.target.dataset.index),1);saveState();renderQuoteLines();updateQuoteSummary()}))}
function newLine(){return{id:`line-${Date.now()}-${Math.random()}`,itemId:"",qty:1,price:0,tax:"review"}}
document.getElementById("addQuoteLine").addEventListener("click",()=>{state.quote.lines.push(newLine());saveState();renderQuoteLines()});
function updateQuoteSummary(){const t=quoteTotals();document.getElementById("quoteSubtotal").textContent=money(t.subtotal);document.getElementById("quoteTaxable").textContent=money(t.taxable);document.getElementById("quoteTax").textContent=money(t.tax);document.getElementById("quoteTotal").textContent=money(t.total);document.getElementById("depositDue").textContent=money(t.deposit);document.getElementById("dashQuote").textContent=money(t.total)}
document.getElementById("clearQuote").addEventListener("click",()=>{if(!confirm("Start a new quote and clear the current customer and line items?"))return;state.quote={...clone(defaults.quote),number:(Number(state.quote.number)||0)+1,taxRate:state.settings.taxRate,deposit:state.settings.deposit,date:today(),validThrough:addDays(30)};saveState();renderQuote()});
document.getElementById("printQuote").addEventListener("click",()=>window.print());

const profitBindings={profitHours:"hours",profitLaborCost:"laborCost",profitMaterials:"materials",profitEquipment:"equipment",profitOther:"other",profitOverhead:"overhead",profitContingency:"contingency",profitTarget:"target",profitPrice:"price"};
Object.entries(profitBindings).forEach(([id,key])=>document.getElementById(id).addEventListener("input",e=>{state.profit[key]=Number(e.target.value);saveState();updateProfit()}));
function renderProfit(){for(const[id,key]of Object.entries(profitBindings))document.getElementById(id).value=state.profit[key];updateProfit()}
function updateProfit(){const p=state.profit;const labor=p.hours*p.laborCost;const direct=labor+p.materials+p.equipment+p.other;const overhead=direct*p.overhead/100;const contingency=(direct+overhead)*p.contingency/100;const cost=direct+overhead+contingency;const suggested=p.target>=100?0:cost/(1-p.target/100);const profit=p.price-cost;const margin=p.price?profit/p.price*100:0;document.getElementById("resultLabor").textContent=money(labor);document.getElementById("resultCost").textContent=money(cost);document.getElementById("resultSuggested").textContent=money(suggested);document.getElementById("resultProfit").textContent=money(profit);document.getElementById("resultMargin").textContent=`${margin.toFixed(1)}%`;const status=document.getElementById("marginStatus");status.textContent=margin>=p.target?"Target margin met":"Review price or costs";status.classList.toggle("good",margin>=p.target)}
document.getElementById("useQuoteTotal").addEventListener("click",()=>{state.profit.price=Number(quoteTotals().total.toFixed(2));saveState();renderProfit()});

const companyBindings={companyName:"name",companyPhone:"phone",companyEmail:"email",companyLicense:"license",companyAddress:"address"};Object.entries(companyBindings).forEach(([id,key])=>document.getElementById(id).addEventListener("input",e=>{state.company[key]=e.target.value;saveState()}));
const settingBindings={settingTax:"taxRate",settingMargin:"targetMargin",settingDeposit:"deposit",settingMarkup:"materialMarkup"};Object.entries(settingBindings).forEach(([id,key])=>document.getElementById(id).addEventListener("input",e=>{state.settings[key]=Number(e.target.value);if(key==="taxRate")state.quote.taxRate=state.settings.taxRate;if(key==="deposit")state.quote.deposit=state.settings.deposit;if(key==="targetMargin")state.profit.target=state.settings.targetMargin;saveState();renderDashboard()}));
function renderSettings(){for(const[id,key]of Object.entries(companyBindings))document.getElementById(id).value=state.company[key];for(const[id,key]of Object.entries(settingBindings))document.getElementById(id).value=state.settings[key]}
document.getElementById("exportData").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`kw-plumbing-backup-${today()}.json`;a.click();URL.revokeObjectURL(a.href)});
document.getElementById("importData").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{state=mergeState(JSON.parse(await file.text()));saveState();renderAll();alert("Backup imported successfully.")}catch{alert("This backup could not be imported. Please select a valid KW Plumbing JSON backup.")}e.target.value=""});
document.getElementById("resetData").addEventListener("click",()=>{if(!confirm("Reset all settings, prices, and the active quote to sample data? This cannot be undone unless you exported a backup."))return;state=clone(defaults);saveState();renderAll()});

function renderAll(){renderDashboard();renderCatalog();renderQuote();renderProfit();renderSettings()}
renderAll();
