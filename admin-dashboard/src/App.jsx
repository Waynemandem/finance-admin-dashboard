import { useState, useRef } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const themes = {
  light: {
    bg: "#f5f4f0", surface: "#ffffff", surfaceAlt: "#f0efe9",
    border: "#e8e6df", borderStrong: "#d0cdc4",
    text: "#1a1916", textSub: "#6b6860", textMuted: "#a8a69e",
    accent: "#1a1916", accentText: "#ffffff",
    blue: "#2563eb", blueLight: "#eff6ff",
    red: "#dc2626", redLight: "#fef2f2",
    green: "#16a34a", greenLight: "#f0fdf4",
    orange: "#ea580c", orangeLight: "#fff7ed",
    purple: "#7c3aed", purpleLight: "#f5f3ff",
    sidebarW: 220,
  },
  dark: {
    bg: "#0f0f0e", surface: "#1a1a18", surfaceAlt: "#222220",
    border: "#2e2e2b", borderStrong: "#3e3e3a",
    text: "#e8e6e1", textSub: "#8a8880", textMuted: "#555450",
    accent: "#e8e6e1", accentText: "#0f0f0e",
    blue: "#3b82f6", blueLight: "rgba(59,130,246,0.12)",
    red: "#ef4444", redLight: "rgba(239,68,68,0.12)",
    green: "#22c55e", greenLight: "rgba(34,197,94,0.12)",
    orange: "#f97316", orangeLight: "rgba(249,115,22,0.12)",
    purple: "#a78bfa", purpleLight: "rgba(167,139,250,0.12)",
    sidebarW: 220,
  },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PRODUCTS = ["glowcredit","loanglide","quickfund","swiftcash"];
const CASE_TABS = ["All","Unfinished","Prioritized","PTP","Pending","Processed"];

const ACTION_CODES = {
  "Customer Self": ["PTP","Postpone","Refuse to Pay","Denied Loan","Power Off/Out of Service","Voicemail","No Number Available","No Answer/Rejected","Others","Suspected Fraud"],
  "Contact":       ["PTP","Promise to Pass On","Unwilling to Pass On","Unknown CM","Power Off/Out of Service","Voicemail","No Number","No One Answered","Others"],
  "Complaint":     ["Repayment Issues","Customer Service Question","App Issues","Internet Issues","Amount Problem","Other Complaint","Client Death"],
};

const mockCases = [
  { id:1, product:"glowcredit",  borrowerType:"Old", caseStatus:"unfinished",  callCount:4, overdueDays:12, overdueAmount:725.35,
    customer:{ name:"Ahmed Zakaria",           gender:"M", age:36, maritalStatus:"M", phone1:"+1 (404) 256-7890", phone1Network:"AT&T",    phone2:"+1 (404) 123-4567", phone2Network:"T-Mobile", address:"14 Peachtree St NE, Atlanta, GA 30309", emergencyContacts:[{ label:"Brothers or sisters", name:"Fatawu Zakaria", phone:"+1 (404) 987-6543" },{ label:"Father or mother", name:"Amina Zakaria", phone:"+1 (404) 555-1234" }] },
    loan:{ loanId:"9565384679456116824", product:"glowcredit", termType:"7D3T", loanAmount:1700, loanDate:"2026-03-24", loanTerms:3, overdueDays:12, overdueAmount:725.35, amountAfterExemption:725.35, paidAmount:1400.66, recTotalAmount:715.36, dueDate:"2026-04-14" },
    actions:[{ no:1, time:"2026-04-13 09:18:56", contactName:"Ahmed Zakaria", contactType:"SF", collector:"ENIOLA BALOGUN", contactPhone:"Phone 1", actionCode:"Customer Self", subCode:"PTP", description:"Will pay around 5pm today" },{ no:2, time:"2026-04-12 14:32:10", contactName:"Fatawu Zakaria", contactType:"EC", collector:"ENIOLA BALOGUN", contactPhone:"Phone 2", actionCode:"Contact", subCode:"Promise to Pass On", description:"Brother said will remind him" }],
    deductions:[{ date:"2026-03-28", amount:800.00, txId:"TXN884729201", channel:"Mobile Money" },{ date:"2026-03-15", amount:600.66, txId:"TXN772819300", channel:"Bank Transfer" }] },
  { id:2, product:"loanglide",   borrowerType:"Old", caseStatus:"ptp",         callCount:7, overdueDays:3,  overdueAmount:480.53,
    customer:{ name:"Mourh Ruth",              gender:"F", age:29, maritalStatus:"S", phone1:"+1 (212) 234-5678", phone1Network:"Verizon", phone2:"+1 (212) 876-5432", phone2Network:"AT&T",    address:"7 5th Avenue, New York, NY 10003",         emergencyContacts:[{ label:"Spouse", name:"Daniel Ruth", phone:"+1 (212) 444-9988" }] },
    loan:{ loanId:"7712938475610023847", product:"loanglide", termType:"14D2T", loanAmount:1200, loanDate:"2026-03-20", loanTerms:2, overdueDays:3, overdueAmount:480.53, amountAfterExemption:480.53, paidAmount:719.47, recTotalAmount:480.53, dueDate:"2026-04-10" },
    actions:[{ no:1, time:"2026-04-13 11:02:44", contactName:"Mourh Ruth", contactType:"SF", collector:"ENIOLA BALOGUN", contactPhone:"Phone 1", actionCode:"Customer Self", subCode:"PTP", description:"Will pay by end of day" }],
    deductions:[{ date:"2026-04-01", amount:719.47, txId:"TXN991827364", channel:"Mobile Money" }] },
  { id:3, product:"glowcredit",  borrowerType:"Old", caseStatus:"unfinished",  callCount:0, overdueDays:1,  overdueAmount:369.15,
    customer:{ name:"Alice Whajah",            gender:"F", age:44, maritalStatus:"M", phone1:"+1 (323) 321-0987", phone1Network:"T-Mobile",phone2:"+1 (323) 678-3421", phone2Network:"Verizon", address:"22 Sunset Blvd, Los Angeles, CA 90028",      emergencyContacts:[{ label:"Brothers or sisters", name:"Kofi Whajah", phone:"+1 (323) 111-2233" },{ label:"Father or mother", name:"Grace Mensah", phone:"+1 (323) 344-5566" },{ label:"Spouse", name:"James Whajah", phone:"+1 (323) 788-9900" }] },
    loan:{ loanId:"3348291764500187263", product:"glowcredit", termType:"7D3T", loanAmount:900, loanDate:"2026-04-05", loanTerms:3, overdueDays:1, overdueAmount:369.15, amountAfterExemption:369.15, paidAmount:530.85, recTotalAmount:369.15, dueDate:"2026-04-13" },
    actions:[],
    deductions:[{ date:"2026-04-10", amount:300.00, txId:"TXN556611223", channel:"Mobile Money" },{ date:"2026-04-07", amount:230.85, txId:"TXN443322110", channel:"Bank Transfer" }] },
  { id:4, product:"glowcredit",  borrowerType:"Old", caseStatus:"prioritized", callCount:5, overdueDays:1,  overdueAmount:255.90,
    customer:{ name:"Oliver brownson",gender:"M", age:51, maritalStatus:"M", phone1:"+1 (312) 909-8877", phone1Network:"AT&T",    phone2:"+1 (312) 566-7788", phone2Network:"T-Mobile", address:"3 Michigan Ave, Chicago, IL 60601",           emergencyContacts:[{ label:"Spouse", name:"Abena Gamah", phone:"+1 (312) 443-2211" }] },
    loan:{ loanId:"5521837465029381746", product:"glowcredit", termType:"30D1T", loanAmount:2000, loanDate:"2026-03-14", loanTerms:1, overdueDays:1, overdueAmount:255.90, amountAfterExemption:255.90, paidAmount:1744.10, recTotalAmount:255.90, dueDate:"2026-04-13" },
    actions:[{ no:1, time:"2026-04-12 08:45:30", contactName:"Christopher Tetteh Gamah", contactType:"SF", collector:"ENIOLA BALOGUN", contactPhone:"Phone 1", actionCode:"Customer Self", subCode:"Postpone", description:"Says he will pay next week" }],
    deductions:[{ date:"2026-03-30", amount:1000.00, txId:"TXN667788990", channel:"Mobile Money" },{ date:"2026-03-20", amount:744.10, txId:"TXN554433221", channel:"Bank Transfer" }] },
  { id:5, product:"quickfund",   borrowerType:"New", caseStatus:"pending",     callCount:2, overdueDays:5,  overdueAmount:1120.00,
    customer:{ name:"Efua Mensah",             gender:"F", age:33, maritalStatus:"S", phone1:"+1 (713) 112-3344", phone1Network:"Verizon", phone2:"+1 (713) 556-7788", phone2Network:"AT&T",    address:"9 Main St, Houston, TX 77002",               emergencyContacts:[{ label:"Father or mother", name:"Kwame Mensah", phone:"+1 (713) 998-7766" }] },
    loan:{ loanId:"8890123456781234567", product:"quickfund", termType:"14D2T", loanAmount:3000, loanDate:"2026-03-28", loanTerms:2, overdueDays:5, overdueAmount:1120.00, amountAfterExemption:1120.00, paidAmount:1880.00, recTotalAmount:1120.00, dueDate:"2026-04-09" },
    actions:[],
    deductions:[{ date:"2026-04-05", amount:1880.00, txId:"TXN112233445", channel:"Mobile Money" }] },
  { id:6, product:"swiftcash",   borrowerType:"New", caseStatus:"processed",   callCount:3, overdueDays:0,  overdueAmount:0,
    customer:{ name:"Kofi Asante",             gender:"M", age:27, maritalStatus:"S", phone1:"+1 (404) 771-2233", phone1Network:"T-Mobile",phone2:"+1 (404) 882-3344", phone2Network:"Verizon", address:"55 Baker St, Atlanta, GA 30318",              emergencyContacts:[{ label:"Father or mother", name:"Yaa Asante", phone:"+1 (404) 661-1122" }] },
    loan:{ loanId:"1122334455667788990", product:"swiftcash", termType:"7D3T", loanAmount:500, loanDate:"2026-03-10", loanTerms:3, overdueDays:0, overdueAmount:0, amountAfterExemption:0, paidAmount:500, recTotalAmount:0, dueDate:"2026-04-01" },
    actions:[{ no:1, time:"2026-04-01 10:00:00", contactName:"Kofi Asante", contactType:"SF", collector:"ENIOLA BALOGUN", contactPhone:"Phone 1", actionCode:"Customer Self", subCode:"PTP", description:"Payment confirmed" }],
    deductions:[{ date:"2026-04-01", amount:500.00, txId:"TXN334455667", channel:"Bank Transfer" }] },
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size=16, sw=1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);
const PhoneIco = ({ size=18, color="#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
);
const I = {
  back:   "M19 12H5M12 5l-7 7 7 7",
  search: "M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  sms:    "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  edit:   "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z",
  copy:   "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2M8 4h8",
  check:  "M20 6L9 17l-5-5",
  x:      "M18 6L6 18M6 6l12 12",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  dash:   "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  cases:  "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  menu:   "M3 6h18M3 12h18M3 18h18",
  person: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  loan:   "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  history:"M12 8v4l3 3M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z",
  action: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const caseColor = (cs, t) => ({ unfinished:[t.red,t.redLight], prioritized:[t.orange,t.orangeLight], ptp:[t.purple,t.purpleLight], pending:[t.textMuted,t.surfaceAlt], processed:[t.green,t.greenLight] }[cs] || [t.textMuted,t.surfaceAlt]);

const CasePill = ({ status, t }) => {
  const [c,bg] = caseColor(status,t);
  return <span style={{ background:bg, color:c, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:3, textTransform:"capitalize", letterSpacing:"0.04em", whiteSpace:"nowrap" }}>{status}</span>;
};

const inputSt = t => ({ width:"100%", background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:8, padding:"11px 14px", color:t.text, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box", appearance:"none" });

const Lbl = ({ c, children }) => <div style={{ fontSize:11, color:c, fontWeight:500, marginBottom:4, letterSpacing:"0.02em" }}>{children}</div>;
const Val = ({ c, children, bold }) => <div style={{ fontSize:15, color:c, fontWeight: bold?700:500, marginBottom:14 }}>{children}</div>;
const Divider = ({ t }) => <div style={{ height:1, background:t.border, margin:"14px 0" }} />;

const TwoCol = ({ left, right, t }) => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
    <div><Lbl c={t.textMuted}>{left.label}</Lbl><div style={{ fontSize:15, color:left.color||t.text, fontWeight:500 }}>{left.value}</div></div>
    <div><Lbl c={t.textMuted}>{right.label}</Lbl><div style={{ fontSize:15, color:right.color||t.text, fontWeight:500 }}>{right.value}</div></div>
  </div>
);

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const Logo = ({ size=32, textSize=18, t, onClick }) => (
  <div onClick={onClick} style={{ display:"flex", alignItems:"center", gap:10, cursor:"default", userSelect:"none" }}>
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={t.blue}/>
      <path d="M20 8v24M26 14h-8.5a4 4 0 0 0 0 8h5a4 4 0 0 1 0 8H13" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/>
    </svg>
    <div>
      <div style={{ fontSize:textSize, fontWeight:800, color:t.text, fontFamily:"'DM Serif Display',Georgia,serif", lineHeight:1.1, letterSpacing:"-0.02em" }}>LendFlow</div>
      <div style={{ fontSize:9, color:t.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>Finance OS</div>
    </div>
  </div>
);

// ─── PHONE ROW ────────────────────────────────────────────────────────────────
const PhoneRow = ({ label, number, network, isMain, t }) => (
  <div style={{ marginBottom:16 }}>
    <div style={{ marginBottom:7, display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ fontSize:14, fontWeight:700, color:isMain?t.red:t.text }}>{label}</span>
      {network && <span style={{ fontSize:11, color:t.blue }}>{network}</span>}
    </div>
    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
      <span style={{ fontSize:14, color:t.text, flex:1, minWidth:120 }}>{number}</span>
      {[{icon:I.edit,tip:"Edit"},{icon:I.copy,tip:"Copy"}].map(b=>(
        <button key={b.tip} title={b.tip} style={{ background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:7, padding:"7px 10px", cursor:"pointer", color:t.textSub, display:"flex" }}><Ico d={b.icon} size={14}/></button>
      ))}
      <button style={{ background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:7, padding:"7px 12px", cursor:"pointer", color:t.textSub, fontSize:12, fontWeight:600 }}>SMS</button>
      <a href={`tel:${number}`} style={{ background:t.green, border:"none", borderRadius:7, padding:"8px 14px", cursor:"pointer", color:"#fff", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:5, textDecoration:"none" }}>
        <PhoneIco size={13}/> Call
      </a>
    </div>
  </div>
);

// ─── RECORD FLOW ──────────────────────────────────────────────────────────────
// Step 1: pick category → Step 2 (Reminder Content screen): pick sub → Step 3: remark
function RecordModal({ t, onClose, onSubmit, customerName, isMobile }) {
  const [step, setStep]         = useState(1); // 1=category, 2=reminder-content, 3=remark
  const [category, setCategory] = useState(null);
  const [subCode, setSubCode]   = useState(null);
  const [remark, setRemark]     = useState("");

  const pickCategory = (c) => { setCategory(c); setSubCode(null); setStep(2); };
  const pickSub = (s) => { setSubCode(s); setStep(3); };
  const submit = () => {
    if (!category||!subCode) return;
    onSubmit({ actionCode:category, subCode, description:remark, contactName:customerName, time:new Date().toISOString().replace("T"," ").slice(0,19) });
    onClose();
  };

  const wrap = (children) => (
    <div style={{ position:"fixed", inset:0, zIndex:600, background:t.bg, display:"flex", flexDirection:"column", ...(isMobile?{}:{ alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.5)" }) }}>
      <div style={{ ...(isMobile?{ flex:1, display:"flex", flexDirection:"column" }:{ background:t.surface, borderRadius:16, width:480, maxHeight:"85vh", display:"flex", flexDirection:"column", boxShadow:"0 24px 60px rgba(0,0,0,0.3)" }) }}>
        {children}
      </div>
    </div>
  );

  // Step 1 — Choose category
  if (step===1) return wrap(
    <>
      <div style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, padding:"16px 20px", display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
        <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:t.text, display:"flex" }}><Ico d={I.back} size={20} sw={2}/></button>
        <span style={{ fontSize:16, fontWeight:700, color:t.text, fontFamily:"'DM Serif Display',Georgia,serif" }}>Record Action</span>
      </div>
      <div style={{ flex:1, padding:"24px 20px", overflowY:"auto", background:t.surface }}>
        <div style={{ fontSize:12, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:t.textMuted, marginBottom:16 }}>Select Action Code</div>
        {Object.keys(ACTION_CODES).map(cat => (
          <button key={cat} onClick={() => pickCategory(cat)}
            style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 0", background:"transparent", border:"none", borderBottom:`1px solid ${t.border}`, cursor:"pointer", color:t.text, fontSize:16, fontFamily:"inherit", textAlign:"left" }}>
            {cat}
            <Ico d="M9 18l6-6-6-6" size={16} sw={2}/>
          </button>
        ))}
      </div>
    </>
  );

  // Step 2 — Reminder Content (exact layout from screenshot)
  if (step===2) return wrap(
    <>
      <div style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, padding:"16px 20px", display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
        <button onClick={() => setStep(1)} style={{ background:"none", border:"none", cursor:"pointer", color:t.blue, display:"flex" }}><Ico d={I.back} size={20} sw={2}/></button>
        <span style={{ fontSize:16, fontWeight:600, color:t.blue, fontFamily:"'DM Serif Display',Georgia,serif" }}>Reminder Content</span>
      </div>
      <div style={{ flex:1, overflowY:"auto", background:t.surface }}>
        {ACTION_CODES[category].map((opt,i) => (
          <button key={opt} onClick={() => pickSub(opt)}
            style={{ width:"100%", display:"block", padding:"20px 20px", background:"transparent", border:"none", borderBottom:`1px solid ${t.border}`, cursor:"pointer", color:t.text, fontSize:16, fontFamily:"inherit", textAlign:"left", transition:"background 0.1s" }}
            onMouseEnter={e=>e.currentTarget.style.background=t.surfaceAlt}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {opt}
          </button>
        ))}
      </div>
    </>
  );

  // Step 3 — Action Remark
  return wrap(
    <>
      <div style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, padding:"16px 20px", display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
        <button onClick={() => setStep(2)} style={{ background:"none", border:"none", cursor:"pointer", color:t.text, display:"flex" }}><Ico d={I.back} size={20} sw={2}/></button>
        <span style={{ fontSize:16, fontWeight:700, color:t.text, fontFamily:"'DM Serif Display',Georgia,serif" }}>Action Remark</span>
      </div>
      <div style={{ flex:1, padding:"24px 20px", overflowY:"auto", background:t.surface }}>
        {/* Summary */}
        <div style={{ background:t.blueLight, border:`1px solid ${t.blue}`, borderRadius:10, padding:"14px 16px", marginBottom:20 }}>
          <div style={{ fontSize:12, color:t.blue, fontWeight:600, marginBottom:4 }}>{category}</div>
          <div style={{ fontSize:15, color:t.text, fontWeight:600 }}>{subCode}</div>
        </div>
        <div style={{ fontSize:12, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:t.textMuted, marginBottom:10 }}>Action Remark</div>
        <textarea value={remark} onChange={e=>setRemark(e.target.value)} placeholder="Describe the interaction with the customer…"
          style={{ ...inputSt(t), minHeight:100, resize:"vertical", lineHeight:1.6 }}/>
        <button onClick={submit} style={{ width:"100%", marginTop:16, padding:"14px", background:t.blue, color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          Submit Record
        </button>
      </div>
    </>
  );
}

// ─── SMS MODAL ────────────────────────────────────────────────────────────────
function SmsModal({ t, onClose, customerName, phone1, phone2, isMobile }) {
  const msg = `Dear ${customerName}, your loan repayment is overdue. Please make payment immediately to avoid further charges. Repay now: https://pay.lendflow.app/repay — LendFlow Finance`;
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(msg); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:600, background:t.bg, display:"flex", flexDirection:"column", ...(isMobile?{}:{ alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.5)" }) }}>
      <div style={{ ...(isMobile?{ flex:1, display:"flex", flexDirection:"column" }:{ background:t.surface, borderRadius:16, width:480, boxShadow:"0 24px 60px rgba(0,0,0,0.3)", display:"flex", flexDirection:"column" }) }}>
        <div style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:t.text, display:"flex" }}><Ico d={I.back} size={20} sw={2}/></button>
          <span style={{ fontSize:16, fontWeight:700, color:t.text, fontFamily:"'DM Serif Display',Georgia,serif" }}>Send SMS</span>
        </div>
        <div style={{ flex:1, padding:"24px 20px", overflowY:"auto", background:t.surface }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:t.textMuted, marginBottom:10 }}>Message Template</div>
          <div style={{ background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:12, padding:18, fontSize:14, color:t.text, lineHeight:1.75, marginBottom:20 }}>{msg}</div>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:t.textMuted, marginBottom:12 }}>Send To</div>
          {[{l:"Phone 1",n:phone1},{l:"Phone 2",n:phone2}].map(p=>(
            <div key={p.l} style={{ background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:10, padding:"14px 16px", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div><div style={{ fontSize:11, color:t.textMuted, marginBottom:3 }}>{p.l}</div><div style={{ fontSize:15, fontWeight:600, color:t.text }}>{p.n}</div></div>
              <a href={`sms:${p.n}?body=${encodeURIComponent(msg)}`} style={{ background:t.green, color:"#fff", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer", textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
                <Ico d={I.sms} size={14}/> Send
              </a>
            </div>
          ))}
          <button onClick={copy} style={{ width:"100%", marginTop:8, padding:"13px", background:copied?t.greenLight:t.surfaceAlt, color:copied?t.green:t.textSub, border:`1px solid ${copied?t.green:t.border}`, borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s" }}>
            <Ico d={copied?I.check:I.copy} size={15}/> {copied?"Copied!":"Copy Message"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── RECONCILIATION ───────────────────────────────────────────────────────────
function ReconciliationModal({ t, onClose, isMobile }) {
  const [form, setForm] = useState({ issueType:"", amount:"", date:"", trueNum:"", repayNum:"", channel:"", txId:"", remark:"" });
  const upd = v => setForm(p=>({...p,...v}));
  const issueTypes = ["Payment Not Reflected","Wrong Amount","Duplicate Payment","Reversal Request","Other"];
  const channels = ["Mobile Money","Bank Transfer","Cash","POS","Other"];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:600, background:t.bg, display:"flex", flexDirection:"column", ...(isMobile?{}:{ alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.5)" }) }}>
      <div style={{ ...(isMobile?{ flex:1, display:"flex", flexDirection:"column" }:{ background:t.surface, borderRadius:16, width:520, maxHeight:"90vh", display:"flex", flexDirection:"column", boxShadow:"0 24px 60px rgba(0,0,0,0.3)" }) }}>
        <div style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, padding:"16px 20px", display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:t.text, display:"flex" }}><Ico d={I.back} size={20} sw={2}/></button>
          <span style={{ fontSize:16, fontWeight:700, color:t.text, fontFamily:"'DM Serif Display',Georgia,serif" }}>Reconciliation</span>
        </div>
        <div style={{ flex:1, padding:"20px", overflowY:"auto", background:t.surface }}>
          {[
            { label:"Issue Type", el:<select value={form.issueType} onChange={e=>upd({issueType:e.target.value})} style={inputSt(t)}><option value="">Select issue type</option>{issueTypes.map(o=><option key={o}>{o}</option>)}</select> },
            { label:"Amount ($)", el:<input type="number" value={form.amount} onChange={e=>upd({amount:e.target.value})} placeholder="0.00" style={inputSt(t)}/> },
            { label:"Repayment Date", el:<input type="date" value={form.date} onChange={e=>upd({date:e.target.value})} style={inputSt(t)}/> },
            { label:"Picture / Receipt", el:
              <div style={{ border:`2px dashed ${t.border}`, borderRadius:10, padding:"28px", textAlign:"center", background:t.surfaceAlt, cursor:"pointer" }}>
                <div style={{ color:t.textMuted, marginBottom:6, display:"flex", justifyContent:"center" }}><Ico d={I.upload} size={26}/></div>
                <div style={{ fontSize:13, color:t.textMuted }}>Tap to upload image</div>
              </div> },
            { label:"True Registered Number", el:<input type="tel" value={form.trueNum} onChange={e=>upd({trueNum:e.target.value})} placeholder="+1 (555) 000-0000" style={inputSt(t)}/> },
            { label:"Repayment Number",        el:<input type="tel" value={form.repayNum} onChange={e=>upd({repayNum:e.target.value})} placeholder="+1 (555) 000-0000" style={inputSt(t)}/> },
            { label:"Repayment Channel",       el:<select value={form.channel} onChange={e=>upd({channel:e.target.value})} style={inputSt(t)}><option value="">Select channel</option>{channels.map(o=><option key={o}>{o}</option>)}</select> },
            { label:"Transaction ID",          el:<input value={form.txId} onChange={e=>upd({txId:e.target.value})} placeholder="TXN..." style={inputSt(t)}/> },
            { label:"Remark",                  el:<textarea value={form.remark} onChange={e=>upd({remark:e.target.value})} placeholder="Additional notes…" style={{ ...inputSt(t), minHeight:80, resize:"vertical" }}/> },
          ].map(f=>(
            <div key={f.label} style={{ marginBottom:16 }}>
              <Lbl c={t.textMuted}>{f.label}</Lbl>
              {f.el}
            </div>
          ))}
          <button style={{ width:"100%", padding:"14px", background:t.blue, color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", marginTop:8 }}>
            Submit Reconciliation
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EXEMPT MODAL ─────────────────────────────────────────────────────────────
function ExemptModal({ t, onClose, overdueAmount, isMobile }) {
  const [agreed, setAgreed] = useState(false);
  const [remark, setRemark] = useState("");
  return (
    <div style={{ position:"fixed", inset:0, zIndex:600, background:"rgba(0,0,0,0.5)", display:"flex", flexDirection:"column", justifyContent:"flex-end", ...(isMobile?{}:{ alignItems:"center", justifyContent:"center" }) }}>
      <div style={{ background:t.surface, borderRadius:isMobile?"20px 20px 0 0":"16px", padding:"24px 20px 36px", ...(isMobile?{}:{ width:460, boxShadow:"0 24px 60px rgba(0,0,0,0.3)" }) }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <span style={{ fontSize:17, fontWeight:700, color:t.text, fontFamily:"'DM Serif Display',Georgia,serif" }}>Exempt Customer</span>
          <button onClick={onClose} style={{ background:t.surfaceAlt, border:"none", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:t.textSub }}><Ico d={I.x} size={15}/></button>
        </div>
        <div style={{ background:t.orangeLight, border:`1px solid ${t.orange}`, borderRadius:10, padding:"14px 16px", marginBottom:20 }}>
          <div style={{ fontSize:12, color:t.orange, fontWeight:600, marginBottom:4 }}>EXEMPTION AGREEMENT</div>
          <div style={{ fontSize:14, color:t.text, lineHeight:1.6 }}>Customer agrees to pay the initial overdue amount of <strong style={{ color:t.orange }}>${overdueAmount.toFixed(2)}</strong> only. All penalties and additional interest will be waived upon successful payment.</div>
        </div>
        <button onClick={()=>setAgreed(a=>!a)} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, background:"transparent", border:`1.5px solid ${agreed?t.green:t.border}`, borderRadius:10, padding:"12px 16px", cursor:"pointer", marginBottom:16, fontFamily:"inherit" }}>
          <div style={{ width:22, height:22, borderRadius:5, background:agreed?t.green:t.surfaceAlt, border:`1.5px solid ${agreed?t.green:t.borderStrong}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
            {agreed && <Ico d={I.check} size={13} sw={2.5}/>}
          </div>
          <span style={{ fontSize:14, color:t.text }}>Customer agrees to pay <strong>${overdueAmount.toFixed(2)}</strong></span>
        </button>
        <div style={{ marginBottom:16 }}>
          <Lbl c={t.textMuted}>Remark</Lbl>
          <textarea value={remark} onChange={e=>setRemark(e.target.value)} placeholder="Reason for exemption…" style={{ ...inputSt(t), minHeight:70, resize:"none" }}/>
        </div>
        <button disabled={!agreed} style={{ width:"100%", padding:"14px", background:agreed?t.green:t.surfaceAlt, color:agreed?"#fff":t.textMuted, border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:agreed?"pointer":"default", fontFamily:"inherit", transition:"all 0.2s" }}>
          Confirm Exemption
        </button>
      </div>
    </div>
  );
}

// ─── BOTTOM BAR ───────────────────────────────────────────────────────────────
const BottomBar = ({ t, onRecord, onSms, onRecon, onExempt }) => (
  <div style={{ background:"rgba(10,10,10,0.96)", backdropFilter:"blur(12px)", display:"flex", padding:"10px 4px 18px", flexShrink:0 }}>
    {[["Record",onRecord],["SMS",onSms],["Reconciliation",onRecon],["Exempt",onExempt]].map(([l,fn])=>(
      <button key={l} onClick={fn} style={{ flex:1, background:"transparent", border:"none", cursor:"pointer", color:"#fff", fontSize:12, fontWeight:600, padding:"8px 4px", fontFamily:"inherit" }}>{l}</button>
    ))}
  </div>
);

// ─── CUSTOMER INFO TAB ────────────────────────────────────────────────────────
const CustomerInfoTab = ({ customer, t }) => (
  <div style={{ padding:"0 20px 100px" }}>
    <div style={{ display:"flex", alignItems:"center", gap:14, padding:"20px 0 16px", borderBottom:`1px solid ${t.border}` }}>
      <div style={{ width:52, height:52, borderRadius:"50%", background:t.blue, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Ico d={I.person} size={26} sw={1.5}/>
      </div>
      <div>
        <div style={{ fontSize:11, color:t.textMuted, marginBottom:4 }}>Name <span style={{ marginLeft:8, background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:3, fontSize:10, fontWeight:600, padding:"1px 7px", color:t.textSub }}>Old</span></div>
        <div style={{ fontSize:18, fontWeight:700, color:t.text }}>{customer.name}</div>
      </div>
    </div>
    <div style={{ height:16 }}/>
    <TwoCol left={{ label:"Gender", value:customer.gender==="M"?"Male":"Female" }} right={{ label:"Age", value:customer.age }} t={t}/>
    <Divider t={t}/>
    <TwoCol left={{ label:"Marriage Status", value:customer.maritalStatus==="M"?"Married":"Single" }} right={{ label:"Address", value:customer.address }} t={t}/>
    <Divider t={t}/>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
      <div style={{ fontSize:14, fontWeight:600, color:t.text }}>Customer</div>
      <button style={{ background:t.blueLight, color:t.blue, border:`1px solid ${t.blue}`, borderRadius:6, padding:"5px 12px", fontSize:12, fontWeight:600, cursor:"pointer" }}>Add Contacts</button>
    </div>
    <PhoneRow label="Phone. 1" number={customer.phone1} network={customer.phone1Network} isMain t={t}/>
    <PhoneRow label="Phone. 2" number={customer.phone2} network={customer.phone2Network} isMain={false} t={t}/>
    <Divider t={t}/>
    <div style={{ fontSize:14, fontWeight:600, color:t.text, marginBottom:14 }}>Emergency Contact</div>
    {customer.emergencyContacts.map((ec,i)=>(
      <div key={i} style={{ marginBottom:16 }}>
        <div style={{ fontSize:12, color:t.textMuted, marginBottom:4 }}>{ec.label}</div>
        <div style={{ fontSize:15, fontWeight:600, color:t.text, marginBottom:6 }}>{ec.name}</div>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ fontSize:14, color:t.text, flex:1, minWidth:120 }}>{ec.phone}</span>
          <button style={{ background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:7, padding:"7px 10px", cursor:"pointer", color:t.textSub, display:"flex" }}><Ico d={I.copy} size={14}/></button>
          <button style={{ background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:7, padding:"7px 12px", cursor:"pointer", color:t.textSub, fontSize:12, fontWeight:600 }}>SMS</button>
          <a href={`tel:${ec.phone}`} style={{ background:t.green, borderRadius:7, padding:"8px 14px", color:"#fff", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:5, textDecoration:"none" }}>
            <PhoneIco size={13}/> Call
          </a>
        </div>
      </div>
    ))}
  </div>
);

// ─── LOAN INFO TAB ────────────────────────────────────────────────────────────
const LoanInfoTab = ({ loan, t }) => (
  <div style={{ padding:"0 20px 100px" }}>
    <div style={{ paddingTop:20, marginBottom:16 }}>
      <span style={{ background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:5, fontSize:12, fontWeight:700, padding:"4px 10px", color:t.textSub }}>{loan.termType}</span>
      <div style={{ fontSize:20, fontWeight:700, color:t.text, marginTop:12, fontFamily:"'DM Serif Display',Georgia,serif" }}>{loan.product}</div>
    </div>
    <Divider t={t}/>
    <Lbl c={t.textMuted}>Loan ID</Lbl><Val c={t.text}>{loan.loanId}</Val>
    <TwoCol left={{ label:"Loan Amount", value:`$${loan.loanAmount.toLocaleString()}` }} right={{ label:"Loan Date", value:loan.loanDate }} t={t}/>
    <Divider t={t}/>
    <TwoCol left={{ label:"Loan Terms", value:loan.loanTerms }} right={{ label:"Due Date", value:loan.dueDate }} t={t}/>
    <Divider t={t}/>
    <TwoCol left={{ label:"Overdue Days", value:loan.overdueDays, color:loan.overdueDays>0?t.red:t.green }} right={{ label:"Overdue Amount", value:`$${loan.overdueAmount.toFixed(2)}`, color:loan.overdueAmount>0?t.blue:t.green }} t={t}/>
    <Divider t={t}/>
    <Lbl c={t.textMuted}>Amount after exemption</Lbl><Val c={t.text}>${loan.amountAfterExemption.toFixed(2)}</Val>
    <Lbl c={t.textMuted}>Paid Amount</Lbl><Val c={t.text}>${loan.paidAmount.toFixed(2)}</Val>
    <Divider t={t}/>
    <div style={{ display:"flex", gap:10, marginBottom:20 }}>
      <button style={{ flex:1, padding:"10px", background:"transparent", border:`1px solid ${t.blue}`, borderRadius:8, color:t.blue, fontSize:13, fontWeight:600, cursor:"pointer" }}>Loan Receipt &gt;&gt;</button>
      <button style={{ flex:1, padding:"10px", background:"transparent", border:`1px solid ${t.border}`, borderRadius:8, color:t.textSub, fontSize:13, fontWeight:600, cursor:"pointer" }}>Download link</button>
    </div>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
      <div style={{ fontSize:16, fontWeight:700, color:t.text }}>Terms <span style={{ color:t.blue }}>{loan.loanTerms}</span></div>
      {loan.overdueDays>0 && <span style={{ background:t.redLight, color:t.red, fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:5 }}>Overdue</span>}
    </div>
    <div style={{ background:t.surfaceAlt, borderRadius:10, padding:"14px 16px" }}>
      <TwoCol left={{ label:"Due Date", value:loan.dueDate }} right={{ label:"Overdue Days", value:loan.overdueDays, color:loan.overdueDays>0?t.red:t.text }} t={t}/>
      <Lbl c={t.textMuted}>Rec Total Amount</Lbl><Val c={t.text}>${loan.recTotalAmount.toFixed(2)}</Val>
    </div>
  </div>
);

// ─── ACTION INFO TAB ──────────────────────────────────────────────────────────
const ActionInfoTab = ({ actions, t }) => (
  <div style={{ padding:"0 20px 100px" }}>
    <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:16, marginBottom:12 }}>
      <button style={{ background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:7, padding:"7px 12px", cursor:"pointer", color:t.textSub, display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
        <Ico d={I.filter} size={13}/> Filter
      </button>
    </div>
    {!actions.length && <div style={{ textAlign:"center", padding:"60px 0", color:t.textMuted, fontSize:14 }}>No actions recorded yet.</div>}
    {actions.map(a=>(
      <div key={a.no} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, padding:"16px", marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <span style={{ fontSize:13, fontWeight:700, color:t.textMuted }}>NO.{a.no}</span>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:t.textMuted }}>Action Time</div>
            <div style={{ fontSize:13, fontWeight:700, color:t.blue }}>{a.time}</div>
          </div>
        </div>
        <Divider t={t}/>
        <Lbl c={t.textMuted}>Contact Name</Lbl><Val c={t.text}>{a.contactName}</Val>
        <TwoCol left={{ label:"Contact Type", value:a.contactType }} right={{ label:"Collector", value:a.collector }} t={t}/>
        <Divider t={t}/>
        <TwoCol left={{ label:"Contact Phone", value:a.contactPhone }} right={{ label:"Action Code", value:a.actionCode }} t={t}/>
        <Lbl c={t.textMuted}>Result</Lbl><Val c={t.blue}>{a.subCode}</Val>
        <Lbl c={t.textMuted}>Action Description</Lbl><Val c={t.text}>{a.description||"—"}</Val>
      </div>
    ))}
  </div>
);

// ─── DEDUCTION HISTORY TAB ────────────────────────────────────────────────────
const DeductionHistoryTab = ({ deductions, t }) => {
  const total = deductions.reduce((s,d)=>s+d.amount,0);
  return (
    <div style={{ padding:"0 20px 100px" }}>
      <div style={{ background:t.greenLight, border:`1px solid ${t.green}`, borderRadius:10, padding:"14px 16px", margin:"16px 0 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:12, color:t.green, fontWeight:600 }}>Total Paid</div>
        <div style={{ fontSize:22, fontWeight:800, color:t.green, fontFamily:"'DM Serif Display',Georgia,serif" }}>${total.toLocaleString(undefined,{minimumFractionDigits:2})}</div>
      </div>
      {!deductions.length && <div style={{ textAlign:"center", padding:"40px 0", color:t.textMuted, fontSize:14 }}>No payment history.</div>}
      {deductions.map((d,i)=>(
        <div key={i} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, padding:"14px 16px", marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
            <div style={{ fontSize:17, fontWeight:700, color:t.green }}>${d.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</div>
            <div style={{ fontSize:12, color:t.textMuted }}>{d.date}</div>
          </div>
          <TwoCol left={{ label:"Transaction ID", value:d.txId }} right={{ label:"Channel", value:d.channel }} t={t}/>
        </div>
      ))}
    </div>
  );
};

// ─── DETAIL SCREEN ────────────────────────────────────────────────────────────
function DetailScreen({ caseData, t, onBack, onCaseUpdate, isMobile }) {
  const [activeTab, setActiveTab] = useState("Customer Info");
  const [overlay, setOverlay]     = useState(null);
  const TABS = [
    { key:"Customer Info",     icon:I.person  },
    { key:"Loan Info",         icon:I.loan    },
    { key:"Action Info",       icon:I.action  },
    { key:"Deduction History", icon:I.history },
  ];

  const addAction = a => {
    const updated = { ...caseData, callCount: caseData.callCount+1, actions:[{ ...a, no:caseData.actions.length+1, contactType:"SF", collector:"ENIOLA BALOGUN", contactPhone:"Phone 1" }, ...caseData.actions] };
    onCaseUpdate(updated);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:t.bg }}>
      {/* Header */}
      <div style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, padding:"14px 20px", display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:t.text, display:"flex" }}><Ico d={I.back} size={20} sw={2}/></button>
        <span style={{ fontSize:16, fontWeight:700, color:t.text, fontFamily:"'DM Serif Display',Georgia,serif" }}>Details</span>
        <div style={{ marginLeft:"auto" }}><CasePill status={caseData.caseStatus} t={t}/></div>
      </div>

      {/* 2×2 tab grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"14px 16px 0", flexShrink:0 }}>
        {TABS.map(tab=>(
          <button key={tab.key} onClick={()=>setActiveTab(tab.key)}
            style={{ padding:"13px 10px", fontSize:13, fontWeight:600, borderRadius:10, border:`1.5px solid ${activeTab===tab.key?t.blue:t.border}`, background:activeTab===tab.key?t.blue:t.surface, color:activeTab===tab.key?"#fff":t.textSub, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
            <Ico d={tab.icon} size={14} sw={activeTab===tab.key?2:1.5}/>
            {tab.key}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto" }}>
        {activeTab==="Customer Info"     && <CustomerInfoTab    customer={caseData.customer}                    t={t}/>}
        {activeTab==="Loan Info"         && <LoanInfoTab        loan={caseData.loan}                            t={t}/>}
        {activeTab==="Action Info"       && <ActionInfoTab      actions={caseData.actions}                      t={t}/>}
        {activeTab==="Deduction History" && <DeductionHistoryTab deductions={caseData.deductions}               t={t}/>}
      </div>

      <BottomBar t={t} onRecord={()=>setOverlay("record")} onSms={()=>setOverlay("sms")} onRecon={()=>setOverlay("recon")} onExempt={()=>setOverlay("exempt")}/>

      {overlay==="record" && <RecordModal t={t} onClose={()=>setOverlay(null)} onSubmit={addAction} customerName={caseData.customer.name} isMobile={isMobile}/>}
      {overlay==="sms"    && <SmsModal    t={t} onClose={()=>setOverlay(null)} customerName={caseData.customer.name} phone1={caseData.customer.phone1} phone2={caseData.customer.phone2} isMobile={isMobile}/>}
      {overlay==="recon"  && <ReconciliationModal t={t} onClose={()=>setOverlay(null)} isMobile={isMobile}/>}
      {overlay==="exempt" && <ExemptModal t={t} onClose={()=>setOverlay(null)} overdueAmount={caseData.loan.overdueAmount} isMobile={isMobile}/>}
    </div>
  );
}

// ─── CASES LIST ───────────────────────────────────────────────────────────────
function CasesList({ cases, t, onCaseClick }) {
  const [tab, setTab] = useState("All");
  const [q, setQ]     = useState("");
  const shown = cases.filter(c => {
    const ms = c.customer.name.toLowerCase().includes(q.toLowerCase())||c.product.toLowerCase().includes(q.toLowerCase());
    return ms&&(tab==="All"||c.caseStatus.toLowerCase()===tab.toLowerCase());
  });
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:t.bg }}>
      <div style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, padding:"16px 20px 12px", flexShrink:0 }}>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:t.textMuted }}><Ico d={I.search} size={16}/></div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search Case Information" style={{ ...inputSt(t), paddingLeft:40, borderRadius:24 }}/>
        </div>
      </div>
      <div style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, overflowX:"auto", display:"flex", padding:"0 16px", flexShrink:0 }}>
        {CASE_TABS.map(tb=>(
          <button key={tb} onClick={()=>setTab(tb)} style={{ padding:"12px 16px", fontSize:13, fontWeight:tab===tb?700:400, color:tab===tb?t.blue:t.textMuted, background:"transparent", border:"none", cursor:"pointer", borderBottom:`2.5px solid ${tab===tb?t.blue:"transparent"}`, whiteSpace:"nowrap", fontFamily:"inherit" }}>{tb}</button>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 20px", flexShrink:0 }}>
        <span style={{ fontSize:15, fontWeight:700, color:t.blue }}>{shown.length} case{shown.length!==1?"s":""}</span>
        <button style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:7, padding:"6px 12px", cursor:"pointer", color:t.textSub, display:"flex", alignItems:"center", gap:6, fontSize:12 }}><Ico d={I.filter} size={13}/> Filter</button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"0 16px 24px" }}>
        {shown.map((c,idx)=>(
          <div key={c.id} onClick={()=>onCaseClick(c)}
            style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, marginBottom:12, overflow:"hidden", cursor:"pointer", transition:"border-color 0.15s, box-shadow 0.15s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=t.blue;e.currentTarget.style.boxShadow=`0 2px 12px ${t.blue}22`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.boxShadow="none";}}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 16px 8px", borderBottom:`1px solid ${t.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:14, fontWeight:700, color:t.blue }}>{idx+1}</span>
                <span style={{ fontSize:13, fontWeight:600, color:t.textSub, background:t.surfaceAlt, padding:"3px 10px", borderRadius:6 }}>{c.product}</span>
                <CasePill status={c.caseStatus} t={t}/>
              </div>
              <span style={{ fontSize:12, color:t.textMuted }}>Call {c.callCount} times</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
                <span style={{ background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:4, fontSize:10, fontWeight:700, padding:"2px 7px", color:t.textMuted, flexShrink:0 }}>{c.borrowerType}</span>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:16, fontWeight:700, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.customer.name}</div>
                  <div style={{ fontSize:12, marginTop:3 }}>
                    <span style={{ color:t.textMuted }}>Amount: </span><span style={{ fontWeight:700, color:t.text }}>${c.overdueAmount.toFixed(2)}</span>
                    <span style={{ color:t.textMuted, marginLeft:14 }}>Overdue Days: </span><span style={{ fontWeight:700, color:c.overdueDays>0?t.red:t.green }}>{c.overdueDays}</span>
                  </div>
                </div>
              </div>
              <a href={`tel:${c.customer.phone1}`} onClick={e=>e.stopPropagation()}
                style={{ width:46, height:46, borderRadius:"50%", background:t.green, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginLeft:12, textDecoration:"none" }}>
                <PhoneIco size={20}/>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DESKTOP SIDEBAR ──────────────────────────────────────────────────────────
function Sidebar({ t, page, setPage, dark, setDark }) {
  const clickCount = useRef(0);
  const clickTimer = useRef(null);
  const handleLogoClick = () => {
    clickCount.current += 1;
    clearTimeout(clickTimer.current);
    if (clickCount.current>=3) { setDark(d=>!d); clickCount.current=0; }
    else clickTimer.current = setTimeout(()=>{clickCount.current=0;},600);
  };
  const nav = [
    { key:"cases",  label:"Cases",     icon:I.cases },
    { key:"dash",   label:"Dashboard", icon:I.dash  },
  ];
  return (
    <div style={{ width:220, background:t.surface, borderRight:`1px solid ${t.border}`, display:"flex", flexDirection:"column", height:"100vh", flexShrink:0 }}>
      <div style={{ padding:"22px 20px 18px", borderBottom:`1px solid ${t.border}` }}>
        <Logo t={t} onClick={handleLogoClick}/>
      </div>
      <nav style={{ flex:1, padding:"14px 10px" }}>
        <div style={{ fontSize:9, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:t.textMuted, padding:"0 10px 10px" }}>Menu</div>
        {nav.map(item=>{
          const active=page===item.key;
          return (
            <button key={item.key} onClick={()=>setPage(item.key)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"11px 10px", background:active?t.surfaceAlt:"transparent", borderRadius:7, border:"none", cursor:"pointer", color:active?t.text:t.textSub, fontWeight:active?600:400, fontSize:13, textAlign:"left", marginBottom:2, transition:"all 0.15s", fontFamily:"inherit" }}>
              <Ico d={item.icon} size={15} sw={active?2:1.5}/>
              {item.label}
            </button>
          );
        })}
      </nav>
      <div style={{ padding:"14px 20px", borderTop:`1px solid ${t.border}` }}>
        <div style={{ fontSize:10, color:t.textMuted, marginBottom:6 }}>Triple-click logo to toggle theme</div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:t.surfaceAlt, border:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:t.textSub }}>EB</div>
          <div><div style={{ fontSize:12, fontWeight:600, color:t.text }}>Eniola Balogun</div><div style={{ fontSize:10, color:t.textMuted }}>Collector</div></div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark]           = useState(false);
  const [cases, setCases]         = useState(mockCases);
  const [selected, setSelected]   = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage]           = useState("cases");
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768);

  const t = dark ? themes.dark : themes.light;

  // responsive
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  useState(()=>{ window.addEventListener("resize",checkMobile); return ()=>window.removeEventListener("resize",checkMobile); });

  const handleCaseUpdate = updated => {
    setCases(prev=>prev.map(c=>c.id===updated.id?updated:c));
    setSelected(updated);
  };

  // ── DESKTOP layout ──────────────────────────────────────────────────────────
  if (!isMobile) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;background:${t.bg};}
        ::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-thumb{background:${t.border};border-radius:2px;}
        select option{background:${t.surface};color:${t.text};}
        input::placeholder,textarea::placeholder{color:${t.textMuted};}
        textarea{font-family:inherit;}
      `}</style>
      <div style={{ display:"flex", height:"100vh", background:t.bg, overflow:"hidden" }}>
        <Sidebar t={t} page={page} setPage={setPage} dark={dark} setDark={setDark}/>
        {/* Main panel */}
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          {/* Cases list — always visible on desktop */}
          <div style={{ width:420, borderRight:`1px solid ${t.border}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            {/* Desktop logo strip */}
            <div style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, padding:"16px 20px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:t.textMuted, letterSpacing:"0.08em", textTransform:"uppercase" }}>Cases</div>
            </div>
            <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
              <CasesList cases={cases} t={t} onCaseClick={c=>{setSelected(c);setPage("cases");}}/>
            </div>
          </div>
          {/* Detail panel */}
          <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            {selected
              ? <DetailScreen caseData={selected} t={t} onBack={()=>setSelected(null)} onCaseUpdate={handleCaseUpdate} isMobile={false}/>
              : <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:t.textMuted, gap:16 }}>
                  <Logo t={t} size={48} textSize={24}/>
                  <div style={{ fontSize:14, marginTop:8 }}>Select a case to view details</div>
                </div>
            }
          </div>
        </div>
      </div>
    </>
  );

  // ── MOBILE layout ───────────────────────────────────────────────────────────
  const clickCount = useRef(0);
  const clickTimer = useRef(null);
  const handleLogoClick = () => {
    clickCount.current+=1; clearTimeout(clickTimer.current);
    if(clickCount.current>=3){setDark(d=>!d);clickCount.current=0;}
    else clickTimer.current=setTimeout(()=>{clickCount.current=0;},600);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;background:${t.bg};}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:${t.border};border-radius:2px;}
        select option{background:${t.surface};color:${t.text};}
        input::placeholder,textarea::placeholder{color:${t.textMuted};}
        textarea{font-family:inherit;}
      `}</style>
      <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:t.bg, overflow:"hidden" }}>
        {/* Mobile topbar */}
        {!selected && (
          <div style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            <Logo t={t} size={28} textSize={16} onClick={handleLogoClick}/>
            <div style={{ fontSize:11, color:t.textMuted }}>Tap logo 3× for theme</div>
          </div>
        )}
        <div style={{ flex:1, overflow:"hidden" }}>
          {selected
            ? <DetailScreen caseData={selected} t={t} onBack={()=>setSelected(null)} onCaseUpdate={handleCaseUpdate} isMobile/>
            : <CasesList cases={cases} t={t} onCaseClick={setSelected}/>
          }
        </div>
      </div>
    </>
  );
}