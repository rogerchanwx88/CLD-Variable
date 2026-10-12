
"use strict";
const DICTIONARY = {
  training:["Training Frequency","Training Duration","Training Participation","Training Quality"],
  engagement:["Stakeholder Engagement","Employee Engagement","Engagement Level"],
  communication:["Communication Quality","Communication Frequency","Communication Clarity"],
  competency:["Staff Competency","Competency Level"],
  competence:["Staff Competency","Competency Level"],
  trust:["Stakeholder Trust","Employee Trust","Team Trust"],
  quality:["Service Quality","Work Quality","Output Quality"],
  performance:["Team Performance","Service Performance","Operational Performance"],
  feedback:["Feedback Quality","Feedback Frequency","Feedback Timeliness"],
  meeting:["Meeting Frequency","Meeting Effectiveness","Meeting Participation"],
  meetings:["Meeting Frequency","Meeting Effectiveness","Meeting Participation"],
  workshop:["Workshop Frequency","Workshop Participation","Workshop Effectiveness"],
  workshops:["Workshop Frequency","Workshop Participation","Workshop Effectiveness"],
  policy:["Policy Clarity","Policy Compliance","Policy Consistency"],
  technology:["Technology Adoption","Technology Reliability","Technology Usability"],
  system:["System Reliability","System Availability","System Usability"],
  framework:["Framework Adoption","Framework Usability"],
  collaboration:["Collaboration Quality","Interdepartmental Cooperation","Team Coordination"],
  knowledge:["Staff Knowledge","Knowledge Accessibility","Knowledge Retention"],
  capacity:["Operational Capacity","Staffing Capacity","Learning Capacity"],
  resources:["Resource Availability","Resource Adequacy","Resource Utilisation"],
  resource:["Resource Availability","Resource Adequacy"],
  staff:["Staff Availability","Staff Competency","Staff Confidence"],
  change:["Change Readiness","Change Acceptance","Change Commitment"],
  process:["Process Efficiency","Process Reliability","Process Complexity"],
  culture:["Learning Culture","Collaboration Culture","Accountability Culture"],
  support:["Leadership Support","Peer Support","Support Availability"],
  improvement:["Improvement Capacity","Improvement Frequency","Improvement Sustainability"],
  workload:["Workload"],
  motivation:["Employee Motivation","Staff Motivation"],
  awareness:["Staff Awareness","Stakeholder Awareness"],
  satisfaction:["Employee Satisfaction","Customer Satisfaction"],
  efficiency:["Process Efficiency","Operational Efficiency"],
  effectiveness:["Training Effectiveness","Service Effectiveness"],
  leadership:["Leadership Support","Leadership Capability"],
  learning:["Learning Capacity","Learning Frequency","Learning Effectiveness"]
};
const DIRECTION=/^(?:more|less|fewer|higher|lower|greater|better|worse|increased|decreased|improved|reduced|enhanced|stronger|weaker|greater|additional|extra|maximum|minimum|high|low)\s+/i;
const ACTION=/^(?:increase|increasing|improve|improving|enhance|enhancing|reduce|reducing|decrease|decreasing|strengthen|strengthening|develop|developing|conduct|conducting|implement|implementing|establish|establishing|promote|promoting|ensure|ensuring|create|creating|build|building|provide|providing|organise|organising|organize|organizing|encourage|encouraging|boost|boosting|raise|raising|minimise|minimising|minimize|minimizing|maximize|maximizing|maximise|maximising|facilitate|facilitating|deliver|delivering)\s+/i;
const COMPARATIVE=/(?:\s+(?:increased|decreased|improved|reduced|enhanced))$/i;
const BARE_ACTIVITY=new Set(["training","meeting","meetings","workshop","workshops","policy","technology","system","framework","feedback","communication","leadership","change","process","resources","resource","support"]);
const BROAD=new Set(["quality","performance","capacity","trust","engagement","competency","competence","knowledge","culture","improvement","motivation","awareness","satisfaction","efficiency","effectiveness","learning","staff","collaboration"]);
const KNOWN_GOOD=new Set([
 "workload","staff competency","training frequency","training duration","training participation","training quality",
 "employee engagement","stakeholder engagement","engagement level","staff motivation","staff awareness",
 "staff confidence","stakeholder trust","employee trust","team trust","service quality","work quality",
 "output quality","communication quality","communication frequency","communication clarity",
 "feedback quality","feedback frequency","feedback timeliness","error rate","employee turnover rate",
 "staffing level","staffing levels","number of staff trained","training hours","processing time",
 "response time","service delivery time","customer satisfaction","employee satisfaction",
 "learning capacity","improvement capacity","policy clarity","policy compliance",
 "system reliability","system availability","technology adoption","resource availability",
 "operational capacity","process efficiency","team performance","decision quality",
 "quality of communication","psychological safety","staff availability","leadership support",
 "training effectiveness","meeting effectiveness","workload balance","knowledge sharing",
 "change readiness","service demand","resource adequacy","staff knowledge","learning culture",
 "number of complaints","complaint rate","completion rate","employee retention",
 "collaboration quality","communication effectiveness","team cohesion"
]);
function normalize(s){return String(s||"").trim().replace(/\s+/g," ");}
function optionsFor(core){
 const low=core.toLowerCase();
 if(DICTIONARY[low])return DICTIONARY[low];
 return [];
}
function reviewVariable(raw){
 const original=normalize(raw);
 if(!original)return {status:"issue",name:"",reason:"Enter a variable name.",suggestions:[],question:"What condition or quantity do you want to describe?"};
 const lower=original.toLowerCase();
 const leadingDirection=DIRECTION.test(original);
 const leadingAction=ACTION.test(original);
 const trailingDirection=COMPARATIVE.test(original);
 const core=normalize(original.replace(DIRECTION,"").replace(ACTION,"").replace(COMPARATIVE,""));
 const alternatives=optionsFor(core);
 if(leadingDirection||leadingAction||trailingDirection){
   const word=original.split(/\s+/)[0];
   const actionWord=leadingDirection||leadingAction?word:"the ending word";
   const suggestions=alternatives.length?alternatives:[core].filter(Boolean);
   return {status:"issue",name:original,
     reason:`“${actionWord}” adds an action or direction. Name the underlying variable neutrally instead.`,
     suggestions,question:"Which condition or quantity are you actually referring to?"};
 }
 if(BARE_ACTIVITY.has(lower)){
   return {status:"clarify",name:original,
     reason:"This term may refer to an activity, tool, or broad concept rather than a clearly changing variable.",
     suggestions:optionsFor(original),question:"Which aspect do you mean to describe or observe?"};
 }
 if(BROAD.has(lower)){
   return {status:"clarify",name:original,
     reason:"This variable may be too broad without identifying whose or which aspect.",
     suggestions:optionsFor(original),question:"Whose or which aspect of this variable do you mean?"};
 }
 if(/^(?:do|doing|to|how to|need to|should|must)\b/i.test(original)){
   return {status:"issue",name:original,reason:"This reads as an instruction or action rather than a variable name.",
     suggestions:[],question:"What condition or quantity would change as a result?"};
 }
 if(/^[0-9]+$/.test(original)){
   return {status:"issue",name:original,reason:"A number by itself does not name a variable.",
     suggestions:[],question:"What does this number measure?"};
 }
 // This is a rule-based tool, not a semantic parser. Unknown phrases are not certified as valid.
 if(KNOWN_GOOD.has(lower)||/^(?:number of|rate of|frequency of|level of|duration of|percentage of|proportion of|amount of)\s+\S+/i.test(original)){
   return {status:"okay",name:original,reason:"Variable is okay.",suggestions:[],question:""};
 }
 if(/(?:\b(?:rate|frequency|duration|level|quality|capacity|availability|reliability|clarity|effectiveness|efficiency|satisfaction|participation|engagement|trust|confidence|competency|competence|awareness|readiness|retention|turnover|time|workload|pressure|accuracy|performance|adoption|motivation|compliance|utilisation|utilization|knowledge|skills|support|cohesion|safety|demand|backlog|resilience|accessibility|consistency|alignment|commitment|productivity))$/i.test(original)){
   return {status:"okay",name:original,reason:"Variable is okay.",suggestions:[],question:""};
 }
 return {status:"clarify",name:original,reason:"The checker cannot confidently confirm this name from its rules. It may still be a valid variable.",
   suggestions:optionsFor(original),question:"Does this phrase name a condition or quantity that can vary over time?"};
}
if(typeof module!=="undefined"&&module.exports)module.exports={reviewVariable};
