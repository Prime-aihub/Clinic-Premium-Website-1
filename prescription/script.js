const timingOptions = [
{v:"M", label:"Morning (1 time)"},
{v:"A", label:"Afternoon (1 time)"},
{v:"E", label:"Evening/Night (1 time)"},
{v:"ME", label:"Morning–Evening (2 times)"},
{v:"AE", label:"Afternoon–Evening (2 times)"},
{v:"MAE", label:"Morning–Afternoon–Evening (3 times)"}
];

const foodOptions = [
{v:"Before Food", label:"Before Food"},
{v:"After Food", label:"After Food"}
];

const state = {
patient:{ name:"", age:"", concern:"" },
meds:[]
};

function updateLiveClock(){
const now = new Date();

document.getElementById('liveDateTime').textContent =
now.toLocaleString('en-IN', {
dateStyle:'medium',
timeStyle:'medium'
});
}

setInterval(updateLiveClock,1000);
updateLiveClock();

function addField(key){

const prompts = {
name:"Enter Patient Name:",
age:"Enter Age:",
concern:"Enter Concern:"
};

const val = prompt(prompts[key]);

if(val){
state.patient[key] = val;


document.getElementById(key+"-value").innerHTML =
  `<span class="badge">${val}</span>`;


}
}

function addMedicine(){

state.meds.push({
id:crypto.randomUUID(),
name:"",
qty:0,
timing:"M",
food:"After Food"
});

renderMeds();
}

function clearMedicines(){

if(confirm("Clear all medicines?")){
state.meds = [];
renderMeds();
}
}

function removeMed(id){

state.meds =
state.meds.filter(m=>m.id!==id);

renderMeds();
}

function setQty(id){

const m =
state.meds.find(x=>x.id===id);

const qty =
parseInt(prompt("Enter quantity:"),10);

if(!isNaN(qty)){
m.qty = qty;
renderMeds();
}
}

function renderMeds(){

const holder =
document.getElementById('medList');

holder.innerHTML = "";

state.meds.forEach(m=>{

const row =
  document.createElement('div');

row.className = "med-item";

const nameInput =
  document.createElement('input');

nameInput.type = "text";

nameInput.placeholder =
  "e.g., Tab. Calpol 650";

nameInput.value = m.name;

nameInput.oninput =
  e => m.name = e.target.value;

row.appendChild(nameInput);

const qtyWrap =
  document.createElement('div');

const qtyBtn =
  document.createElement('button');

qtyBtn.className = "btn small";

qtyBtn.textContent = "Qty";

qtyBtn.onclick =
  ()=>setQty(m.id);

const qtyBadge =
  document.createElement('span');

qtyBadge.className = "qty-badge";

qtyBadge.textContent = m.qty;

qtyWrap.appendChild(qtyBtn);
qtyWrap.appendChild(qtyBadge);

row.appendChild(qtyWrap);

const timingSel =
  document.createElement('select');

timingOptions.forEach(opt=>{

  const o =
    document.createElement('option');

  o.value = opt.v;
  o.textContent = opt.label;

  if(opt.v===m.timing)
    o.selected = true;

  timingSel.appendChild(o);

});

timingSel.onchange =
  e => m.timing = e.target.value;

row.appendChild(timingSel);

const foodSel =
  document.createElement('select');

foodOptions.forEach(opt=>{

  const o =
    document.createElement('option');

  o.value = opt.v;
  o.textContent = opt.label;

  if(opt.v===m.food)
    o.selected = true;

  foodSel.appendChild(o);

});

foodSel.onchange =
  e => m.food = e.target.value;

row.appendChild(foodSel);

const delBtn =
  document.createElement('button');

delBtn.className =
  "btn small danger";

delBtn.textContent = "Remove";

delBtn.onclick =
  ()=>removeMed(m.id);

row.appendChild(delBtn);

holder.appendChild(row);


});
}

function normalizedWaNumber(input){

let s =
input.replace(/\s+/g,'')
.replace(/[^0-9+]/g,'');

s = s.replace(/^0+/, '');

const digits =
s.replace(/\D/g,'');

if(digits.length===10)
return "+91"+digits;

if(s.startsWith("+"))
return s;

return "+"+digits;
}

function validate(){

if(!state.patient.name){
alert("Please add patient name");
return false;
}

if(!state.patient.age){
alert("Please add age");
return false;
}

if(!state.patient.concern){
alert("Please add concern");
return false;
}

if(!state.meds.length){
alert("Please add medicines");
return false;
}

return true;
}

function savePdfAndWhatsApp(){

if(!validate()) return;

const wa =
normalizedWaNumber(
document.getElementById('waNumber').value || ""
);

const { jsPDF } = window.jspdf;

const doc =
new jsPDF({
unit:'pt',
format:'a4'
});

doc.setFont('Helvetica','bold')
.setFontSize(18)
.setTextColor(23,121,255);

doc.text(
"Vishnu Health Clinic",
300,
40,
{align:'center'}
);

doc.setFontSize(12)
.setTextColor(20,40,80)
.setFont('Helvetica','normal');

doc.text(
"Dr. Vishnu Patel (M.B.B.S) – Mumbai",
300,
60,
{align:'center'}
);

doc.text(
"Phone: +91-9004130508",
300,
75,
{align:'center'}
);

const now = new Date();

doc.text(
`Date & Time: ${now.toLocaleString('en-IN')}`,
40,
110
);

doc.text(
`Name: ${state.patient.name}`,
40,
130
);

doc.text(
`Age: ${state.patient.age}`,
40,
145
);

doc.text(
`Concern: ${state.patient.concern}`,
40,
160
);

const medRows =
state.meds.map((m,i)=>[
i+1,
m.name,
m.qty,
timingOptions.find(
t=>t.v===m.timing
)?.label,
m.food
]);

doc.autoTable({
startY:180,
head:[
['#','Medicine','Qty','Timing','Food']
],
body:medRows
});

const fileName =
`Prescription_${state.patient.name.replace(/\s+/g,'_')}.pdf`;

doc.save(fileName);

if(wa){


const msg =


`Hello ${state.patient.name},

Your prescription from Vishnu Health Clinic has been generated.

Dr. Vishnu Patel
📞 9004130508`;


window.open(
  `https://wa.me/${wa.replace('+','')}?text=${encodeURIComponent(msg)}`,
  '_blank'
);


}
}

function resetAll(){

state.patient = {
name:"",
age:"",
concern:""
};

state.meds = [];

document.getElementById('name-value').innerHTML =
'<span class="subtle">Not added</span>';

document.getElementById('age-value').innerHTML =
'<span class="subtle">Not added</span>';

document.getElementById('concern-value').innerHTML =
'<span class="subtle">Not added</span>';

document.getElementById('waNumber').value = '';

renderMeds();
}

addMedicine();
