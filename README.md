<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CLD Variable Learning Coach — Free Edition</title>
<style>
:root{font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#172a43;background:#f3f6fb}
*{box-sizing:border-box}body{margin:0}.wrap{max-width:940px;margin:auto;padding:24px 16px}
header{background:#17385e;color:white;padding:30px;border-radius:18px;margin-bottom:20px}
h1{margin:8px 0;font-size:clamp(25px,4vw,38px)}h2{font-size:21px;margin:0 0 14px}
p{line-height:1.55}.sub{color:#d9e5f2}.panel{background:white;border:1px solid #dce4ef;border-radius:15px;padding:24px;margin-bottom:18px}
label{display:block;font-weight:650;margin:15px 0 7px}textarea,select,input{width:100%;padding:12px;border:1px solid #b9c9dc;border-radius:9px;font:inherit;background:white}
textarea{resize:vertical;min-height:100px}.help{font-size:13px;color:#607087}
button{background:#205d9e;border:0;border-radius:9px;color:white;font:inherit;font-weight:650;padding:12px 17px;cursor:pointer}
button.secondary{background:#e6eef7;color:#23486f}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
.item{border:1px solid #d8e3ef;border-radius:12px;padding:18px;margin:14px 0}
.item h3{margin:0 0 10px}.note{background:#eef5fc;border-left:4px solid #3779ba;padding:12px;border-radius:5px}
.tag{display:inline-block;background:#d9e9f9;color:#163b65;border-radius:50px;padding:5px 11px;font-size:12px}
footer{font-size:13px;color:#66768a;padding:0 0 30px}
ul{line-height:1.65}#results:empty{display:none}
@media print{.controls,.actions,button{display:none!important}body{background:white}.panel{border:0}}
</style></head><body><main class="wrap">
<header><span class="tag">100% free · No accounts · No API</span><h1>CLD Variable Learning Coach</h1>
<p class="sub">A reflective variable-naming tool for CP2 Key Success Loops and CP3 Systems Archetypes.</p></header>
<section class="panel controls"><h2>Check your variables</h2>
<label for="stage">Project stage</label><select id="stage"><option value="CP2">CP2 — Key Success Loops</option><option value="CP3">CP3 — Systems Archetypes</option></select>
<label for="context">Project context (optional)</label><textarea id="context" placeholder="What is your change project about?"></textarea>
<label for="vars">Variables (one per line, up to 30)</label><textarea id="vars" style="min-height:180px" placeholder="Staff Competency&#10;Training&#10;Work Quality&#10;Stakeholder Trust"></textarea>
<p class="help">A variable should normally describe a condition or quantity that can increase or decrease. Suggestions are prompts, not definitive corrections.</p>
<div class="actions"><button id="check">Review my variables</button><button class="secondary" id="example">Load example</button><button class="secondary" id="clear">Clear</button></div></section>
<section class="panel" id="feedback" hidden><h2>Facilitator Feedback</h2><p id="intro"></p><div id="results"></div><div id="cross"></div>
<div class="actions"><button id="download">Download feedback (.txt)</button><button class="secondary" onclick="window.print()">Print / Save as PDF</button></div></section>
<footer>All checking happens in this browser. No project text is sent to a server. This is a rule-based learning aid, not AI. It does not verify actual causal arrows, polarities, loop closure, or archetype accuracy.</footer>
</main><script>
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const verbs=/^(increase|increasing|improve|improving|enhance|enhancing|reduce|reducing|decrease|decreasing|strengthen|strengthening|develop|developing|conduct|conducting|implement|implementing|establish|establishing|promote|promoting|ensure|ensuring|create|creating|build|building|provide|providing)\s+/i;
const dictionary={
"training":["Training Frequency","Training Quality","Training Accessibility","Training Effectiveness"],
"meeting":["Meeting Frequency","Meeting Effectiveness","Meeting Participation"],
"communication":["Communication Quality","Communication Frequency","Communication Clarity"],
"policy":["Policy Clarity","Policy Compliance","Policy Consistency"],
"technology":["Technology Adoption","System Reliability","Technology Usability"],
"system":["System Reliability","System Availability","System Usability"],
"feedback":["Feedback Quality","Feedback Frequency","Feedback Timeliness"],
"leadership":["Leadership Support","Leadership Credibility","Leadership Capability"],
"collaboration":["Collaboration Quality","Interdepartmental Cooperation","Team Coordination"],
"knowledge":["Knowledge Accessibility","Knowledge Retention","Staff Knowledge"],
"quality":["Service Quality","Work Quality","Output Quality"],
"resources":["Resource Availability","Resource Adequacy","Resource Utilisation"],
"staff":["Staff Competency","Staff Availability","Staff Confidence"],
"performance":["Operational Performance","Service Performance","Team Performance"],
"trust":["Stakeholder Trust","Team Trust","Employee Trust"],
"change":["Change Readiness","Change Acceptance","Change Commitment"],
"workshop":["Workshop Frequency","Workshop Participation","Workshop Effectiveness"],
"framework":["Framework Adoption","Framework Usability"],
"process":["Process Efficiency","Process Reliability","Process Complexity"],
"culture":["Learning Culture","Collaboration Culture","Accountability Culture"],
"engagement":["Stakeholder Engagement","Employee Engagement"],
"capacity":["Operational Capacity","Staffing Capacity","Learning Capacity"]
};
const vague=new Set(["quality","performance","capacity","trust","awareness","engagement","effectiveness","efficiency","training","meeting","communication","policy","technology","system","feedback","leadership","knowledge","resources","staff","change","workshop","framework","process","culture","collaboration"]);
let report="";
$("example").onclick=()=>{$("context").value="Improve service delivery through staff development and better coordination."; $("vars").value="Improve Staff Competency\nTraining\nWork Quality\nStakeholder Trust\nCommunication";};
$("clear").onclick=()=>{$("context").value="";$("vars").value="";$("feedback").hidden=true;};
$("check").onclick=()=>{
 const values=$("vars").value.split(/\n/).map(s=>s.trim()).filter(Boolean);
 if(!values.length||values.length>30){alert("Please enter 1 to 30 variables, one per line.");return}
 const stage=$("stage").value, seen=new Map(), notes=[];
 report="CLD VARIABLE LEARNING COACH — FACILITATOR FEEDBACK\nStage: "+stage+"\nContext: "+$("context").value+"\n\n";
 $("intro").textContent=stage==="CP2"?"For CP2, test whether each variable is useful in a Key Success Loop and whether the causal relationships are defensible.":"For CP3, test whether each variable helps explain the recurring system behaviour and feedback structure.";
 let out="";
 values.forEach((original,i)=>{
   const action=verbs.test(original);
   const neutral=original.replace(verbs,"").trim();
   const low=neutral.toLowerCase();
   const candidates=dictionary[low]||[];
   const short=neutral.split(/\s+/).length===1;
   const warnings=[];
   if(action)warnings.push("The name begins with an action or directional word. CLD variables usually work better as neutral conditions or quantities.");
   if(vague.has(low))warnings.push("This term may be too broad or may refer to an activity, object, or intervention. Clarify what changes over time.");
   if(!action&&!vague.has(low))warnings.push("No common naming issue was detected. This does not confirm that the variable is causally meaningful.");
   const alternatives=action?(candidates.length?candidates:[neutral]):candidates;
   const key=low.replace(/\s+/g," ");
   if(seen.has(key))notes.push('"'+original+'" overlaps with "'+seen.get(key)+'". Decide whether these are duplicates or intentionally distinct.');
   else seen.set(key,original);
   const question=stage==="CP2"?
    "If this variable increases, what other variable changes, and why? Would that relationship still make sense when this variable decreases?":
    "What recurring behaviour does this variable help explain, and how does it participate in the feedback structure?";
   const specific=short?"Whose or which aspect of this variable do you mean?":"What observable evidence would show that this variable has increased or decreased?";
   out+='<article class="item"><h3>'+esc((i+1)+". "+original)+'</h3><p>'+warnings.map(esc).join(" ")+'</p>';
   if(alternatives.length)out+='<div class="note"><strong>Possible names to consider:</strong> '+alternatives.map(esc).join(" · ")+'</div>';
   out+='<p><strong>Reflect:</strong> '+esc(specific)+'</p><p><strong>Test the causal reasoning:</strong> '+esc(question)+'</p></article>';
   report+=(i+1)+". "+original+"\n"+warnings.join(" ")+"\n"+(alternatives.length?"Possible names: "+alternatives.join(", ")+"\n":"")+"Reflect: "+specific+"\nCausal reasoning: "+question+"\n\n";
 });
 const cross=$("cross");cross.innerHTML=notes.length?"<h3>Across your variables</h3><ul>"+notes.map(n=>"<li>"+esc(n)+"</li>").join("")+"</ul>":"<p><strong>Across your variables:</strong> No exact naming overlaps were detected. Check for conceptual overlaps yourself.</p>";
 report+="Across variables:\n"+(notes.length?notes.join("\n"):"No exact naming overlaps detected.")+"\n";
 $("results").innerHTML=out;$("feedback").hidden=false;$("feedback").scrollIntoView({behavior:"smooth"});
};
$("download").onclick=()=>{
 const blob=new Blob([report],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="cld-variable-feedback.txt";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
</script></body></html>
