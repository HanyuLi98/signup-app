const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const records = [];
const emails = [];
let databaseError = false;
class Query {
  constructor() { this.filters=[]; this.options={}; }
  select(_fields, options={}) { this.options=options; return this; }
  eq(key,value) { this.filters.push(row=>row[key]===value); return this; }
  in(key,values) { this.filters.push(row=>values.includes(row[key])); return this; }
  insert(row) { this.newRow=row; return this; }
  then(resolve,reject) {
    if(databaseError) return Promise.resolve({data:null,count:null,error:{message:'unavailable'}}).then(resolve,reject);
    if(this.newRow) {
      const duplicate=records.some(row=>row.month===this.newRow.month&&row.session===this.newRow.session&&row.email===this.newRow.email);
      if(!duplicate)records.push(this.newRow);
      return Promise.resolve({error:duplicate?{message:'duplicate'}:null}).then(resolve,reject);
    }
    const data=records.filter(row=>this.filters.every(filter=>filter(row)));
    return Promise.resolve({data:this.options.head?null:data,count:data.length,error:null}).then(resolve,reject);
  }
}
function load(relative, extra={}) {
  const filename=path.join(root,relative);
  const js=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true,resolveJsonModule:true}}).outputText;
  const module={exports:{}};
  const localRequire=createRequire(filename);
  const mockedRequire=id=>id in extra?extra[id]:localRequire(id);
  const context={module,exports:module.exports,require:mockedRequire,console,process,URL,Request,Response,
    fetch:async(url,options)=>{assert.equal(url,'https://api.brevo.com/v3/smtp/email');emails.push(JSON.parse(options.body));return new Response('{}',{status:201});}};
  vm.runInNewContext(js,context,{filename});
  return module.exports;
}
const sessions=load('app/lib/training-sessions.ts');
const route=load('app/api/signup/route.ts',{'@supabase/supabase-js':{createClient:()=>({from:()=>new Query()})},'../../lib/training-sessions':sessions});
const post=body=>route.POST(new Request('http://localhost/api/signup',{method:'POST',body:JSON.stringify(body),headers:{'Content-Type':'application/json'}}));
const form={month:'2027-01',session:'S1',companyName:'Test Integrator',countryRegion:'Germany',name:'Test Participant',jobTitle:'Engineer',jobResponsibilities:'Robot integration',email:'test@example.invalid',telephone:'+490000',trainingSessions:['Onboarding Training']};

(async()=>{
  assert.equal(sessions.SESSIONS_2027.length,29);
  const rolloutDate = new Date('2026-11-20T12:00:00');
  assert.equal(sessions.isRegistrationOpen(sessions.findSession('2027-01','S1'), rolloutDate),true);
  assert.equal(sessions.isRegistrationOpen(sessions.findSession('2027-05','S2'), rolloutDate),false);
  assert.equal(sessions.isRegistrationOpen(sessions.findSession('2027-08','PALLETIZING'), new Date('2027-02-27T12:00:00')),true);
  assert.equal(sessions.SESSIONS_2027.filter(s=>s.month==='2027-06').length,0);
  assert.equal(sessions.findSession('2027-04','MAINTENANCE'),undefined);
  for(const s of sessions.SESSIONS_2027) assert.ok(s.trainingOptions.length===1);
  let response=await post(form);
  assert.equal(response.status,200);
  let result=await response.json();
  assert.equal(result.emailPreview.schedule.length,3);
  assert.equal(result.emailPreview.dates,'Jan 12–14, 2027');
  assert.ok(!emails[0].htmlContent.includes('Day 4 (Optional)'));
  assert.equal((await post(form)).status,400);
  response=await post({...form,session:'S2',email:'second@example.invalid'});
  result=await response.json();
  assert.equal(result.emailPreview.isS2,false);
  assert.equal(result.emailPreview.schedule.length,3);
  assert.ok(!emails.at(-1).htmlContent.includes('Day 4'));
  response=await post({...form,month:'2027-02',session:'WELDING',email:'weld@example.invalid',trainingSessions:['Welding Training']});
  assert.equal(response.status,200);
  result=await response.json();
  assert.equal(result.emailPreview.dates,'Feb 26, 2027');
  assert.equal(result.emailPreview.schedule.length,1);
  assert.equal(records.filter(row=>row.session==='WELDING').length,1);
  assert.equal((await post({...form,month:'2027-06'})).status,400);
  assert.equal((await post({...form,month:'2027-05',session:'S2',trainingSessions:['Onboarding Training']})).status,400);
  assert.equal((await post({...form,month:'2027-04',session:'MAINTENANCE',trainingSessions:['Maintenance & Repair Training']})).status,400);
  assert.equal((await post({...form,trainingSessions:['Welding Training']})).status,400);
  assert.equal((await post({...form,name:''})).status,400);
  records.length=0;
  for(let i=0;i<10;i++) records.push({...form,company_name:'Same Company',email:`full${i}@example.invalid`});
  assert.equal((await post(form)).status,400);
  records.length=0;
  for(let i=0;i<5;i++) records.push({...form,company_name:`Company ${i}`,email:`company${i}@example.invalid`});
  assert.equal((await post(form)).status,400);
  assert.equal((await post({...form,companyName:' company 0 ',email:'existing-company@example.invalid'})).status,200);
  databaseError=true;
  assert.equal((await post({...form,email:'error@example.invalid'})).status,503);
  assert.equal((await route.GET(new Request('http://localhost/api/signup'))).status,503);
  databaseError=false;
  response=await route.GET(new Request('http://localhost/api/signup'));
  result=await response.json();
  assert.equal(result.counts['2027-01-S1'],6);
  assert.equal(result.counts['2027-02-WELDING'],0);
  assert.equal(result.counts['2027-06-S1'],undefined);
  records.length=0;
  response=await post({...form,month:'2026-11',session:'S2',trainingSessions:['Basic Training']});
  result=await response.json();
  assert.equal(response.status,200);
  assert.equal(result.emailPreview.isS2,true);
  assert.equal(result.emailPreview.schedule.length,4);
  console.log('PASS: 2027 session mapping, independent courses, exact confirmation dates, capacity, five-company limit, removed course rejection, June rejection, database errors and legacy 2026 confirmation. All database/email calls mocked.');
})().catch(err=>{console.error(err);process.exitCode=1;});
