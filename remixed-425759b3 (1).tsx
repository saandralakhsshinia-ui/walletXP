import { useState, useEffect, useRef } from "react";

const THEMES = {
  light: {
    bg: "#F0F4FF", surface: "#FFFFFF", card: "#FFFFFF", cardHover: "#F8FAFF",
    border: "rgba(0,0,0,0.08)", borderGlow: "rgba(79,158,248,0.3)",
    text: "#0D1425", textMuted: "#556080", textFaint: "#9AAAC5",
    accent: "#2B7FE0", accentGlow: "rgba(43,127,224,0.15)",
    green: "#059669", red: "#DC2626", amber: "#D97706", purple: "#7C3AED", teal: "#0D9488", pink: "#DB2777",
    gradient1: "linear-gradient(135deg, #E0EDFF 0%, #C7DCFF 100%)",
    sidebarBg: "#FFFFFF", glass: "rgba(255,255,255,0.9)",
  },
  dark: {
    bg: "#0A0E1A", surface: "#111827", card: "#1A2236", cardHover: "#1E2A40",
    border: "rgba(255,255,255,0.07)", borderGlow: "rgba(99,179,237,0.3)",
    text: "#F0F4FF", textMuted: "#8899BB", textFaint: "#4A5A7A",
    accent: "#4F9EF8", accentGlow: "rgba(79,158,248,0.2)",
    green: "#34D399", red: "#F87171", amber: "#FBBF24", purple: "#A78BFA", teal: "#2DD4BF", pink: "#F472B6",
    gradient1: "linear-gradient(135deg, #1E3A5F 0%, #0D2137 100%)",
    sidebarBg: "#0D1425", glass: "rgba(17,24,39,0.8)",
  },
};

const CATEGORIES = ["Food","Travel","Shopping","Bills","Health","Entertainment","Others"];
const CAT_ICONS = { Food:"🍽️", Travel:"✈️", Shopping:"🛍️", Bills:"⚡", Health:"💊", Entertainment:"🎬", Others:"📦" };
const CAT_COLORS = { Food:"#F87171", Travel:"#60A5FA", Shopping:"#A78BFA", Bills:"#FBBF24", Health:"#34D399", Entertainment:"#F472B6", Others:"#9CA3AF" };

const BADGE_TIERS = [
  { label:"Rookie 🥉", minLevel:1 }, { label:"Saver 🥈", minLevel:3 },
  { label:"Investor 🥇", minLevel:5 }, { label:"Wealth Builder 💎", minLevel:8 },
  { label:"Finance Guru 👑", minLevel:12 }, { label:"Money Master 🌟", minLevel:18 },
];
function getCurrentBadge(level) {
  let badge = BADGE_TIERS[0];
  for (const b of BADGE_TIERS) { if (level >= b.minLevel) badge = b; else break; }
  return badge;
}

const INITIAL_USER = {
  name:"Arjun Sharma", username:"arjun", password:"1234",
  xp:6420, streak:14, balance:84500, income:95000, avatar:"AS",
};

const INITIAL_EXPENSES = [
  { id:1, category:"Food", amount:450, note:"Lunch at Cafe", date:"2025-04-12", fixed:false },
  { id:2, category:"Travel", amount:280, note:"Ola ride", date:"2025-04-12", fixed:false },
  { id:3, category:"Shopping", amount:1200, note:"Clothes", date:"2025-04-11", fixed:false },
  { id:4, category:"Bills", amount:890, note:"Electricity", date:"2025-04-11", fixed:false },
  { id:5, category:"Food", amount:320, note:"Swiggy order", date:"2025-04-10", fixed:false },
  { id:6, category:"Entertainment", amount:599, note:"Netflix", date:"2025-04-10", fixed:false },
  { id:7, category:"Health", amount:750, note:"Pharmacy", date:"2025-04-09", fixed:false },
  { id:8, category:"Food", amount:180, note:"Tea & snacks", date:"2025-04-09", fixed:false },
];

const INITIAL_FIXED = [
  { id:1, name:"Rent", amount:18000, category:"Bills" },
  { id:2, name:"EMI", amount:8500, category:"Bills" },
  { id:3, name:"Internet", amount:799, category:"Bills" },
  { id:4, name:"Gym", amount:1200, category:"Health" },
];

const SAVINGS_GOALS = [
  { id:1, name:"Emergency Fund", target:100000, saved:45000, deadline:"2025-12-31", icon:"🏦", color:"#4F9EF8" },
  { id:2, name:"iPhone 16 Pro", target:120000, saved:38000, deadline:"2025-08-31", icon:"📱", color:"#A78BFA" },
  { id:3, name:"Goa Trip", target:25000, saved:18500, deadline:"2025-06-15", icon:"🏖️", color:"#34D399" },
];

const DAILY_CHALLENGES = [
  { id:1, title:"No Food Delivery", desc:"Cook at home all day, no Swiggy/Zomato", xp:150, type:"daily", difficulty:"medium", icon:"🍳" },
  { id:2, title:"Zero Spend Day", desc:"Spend ₹0 today on any category", xp:300, type:"daily", difficulty:"hard", icon:"🚫" },
  { id:3, title:"₹500 Budget Day", desc:"Keep total spending under ₹500 today", xp:200, type:"daily", difficulty:"medium", icon:"💰" },
  { id:4, title:"Invest ₹1000", desc:"Put ₹1000 into savings/investment today", xp:200, type:"daily", difficulty:"easy", icon:"📈" },
  { id:5, title:"Meal Prep Sunday", desc:"Plan and prep meals to save on food delivery", xp:120, type:"daily", difficulty:"easy", icon:"🥗" },
];
const WEEKLY_CHALLENGES = [
  { id:6, title:"Week Savings Sprint", desc:"Save ₹5000 this week — upload daily savings proof", xp:500, type:"weekly", difficulty:"hard", icon:"🏃" },
  { id:7, title:"No Shopping Week", desc:"No online/offline shopping for 7 days", xp:400, type:"weekly", difficulty:"hard", icon:"🛒" },
  { id:8, title:"Walk Don't Ride", desc:"No cab/auto for 7 days, walk or public transport", xp:350, type:"weekly", difficulty:"medium", icon:"🚶" },
  { id:9, title:"Coffee Detox", desc:"No cafe visits for 7 days", xp:280, type:"weekly", difficulty:"easy", icon:"☕" },
  { id:10, title:"Budget Tracker", desc:"Log every expense for 7 days straight", xp:350, type:"weekly", difficulty:"medium", icon:"📊" },
];
const ALL_CHALLENGES = [...DAILY_CHALLENGES, ...WEEKLY_CHALLENGES];

const SPIN_CHALLENGES = [
  { title:"No Food Delivery Today", xp:150, icon:"🍳", type:"daily" },
  { title:"Spend ₹0 Today", xp:300, icon:"🚫", type:"daily" },
  { title:"₹500 Budget Today", xp:200, icon:"💰", type:"daily" },
  { title:"Walk or Public Transport", xp:180, icon:"🚶", type:"daily" },
  { title:"No Cafe Today", xp:120, icon:"☕", type:"daily" },
  { title:"Cook 2 Meals at Home", xp:160, icon:"🥘", type:"daily" },
  { title:"No Online Shopping", xp:140, icon:"🛒", type:"daily" },
  { title:"Save ₹200 Today", xp:100, icon:"💸", type:"daily" },
];

// ── LEARN TOPICS with structured cards + quiz ─────────────────────────────────
const LEARN_TOPICS = [
  {
    id:"emergency", title:"Emergency Fund", icon:"🏦", color:"#4F9EF8",
    cards:[
      { type:"awareness", title:"What is an Emergency Fund?", content:"An emergency fund is money set aside specifically for unexpected expenses — job loss, medical bills, or urgent home repairs. It's your financial safety net." },
      { type:"awareness", title:"How Much Should You Save?", content:"Financial experts recommend saving 3–6 months of living expenses. If your monthly expenses are ₹30,000, aim for ₹90,000–₹1,80,000 in your emergency fund." },
      { type:"awareness", title:"Where to Keep It?", content:"Keep your emergency fund in a separate, easily accessible savings account. High-yield savings accounts or liquid mutual funds offer both accessibility and some growth." },
      { type:"problem", title:"The Real Risk of Having No Fund", content:"Without an emergency fund, any unexpected expense forces you to take high-interest loans or liquidate investments at bad times. 63% of Indians have no emergency savings at all." },
      { type:"solution", title:"The 1% Start Strategy", content:"Start by saving just 1% of your income every month into a dedicated account. Automate the transfer on salary day. Gradually increase to 5–10% as you get comfortable." },
      { type:"impact", title:"The Compound Safety Effect", content:"Having an emergency fund reduces financial stress, improves decision-making, and prevents debt spirals. People with 3 months saved report 40% lower financial anxiety." },
    ],
    quiz:[
      { q:"How many months of expenses should an emergency fund cover?", options:["1 month","2 months","3–6 months","10 months"], ans:2 },
      { q:"Where is the best place to keep an emergency fund?", options:["Stock market","Fixed deposit locked for 5 years","Liquid savings account","Under the mattress"], ans:2 },
      { q:"What percentage of Indians have no emergency savings?", options:["10%","30%","50%","63%"], ans:3 },
      { q:"Which strategy helps beginners start an emergency fund?", options:["Save 50% immediately","Start with 1% of income","Wait until you earn more","Invest in crypto first"], ans:1 },
      { q:"What happens without an emergency fund during a crisis?", options:["Nothing changes","You get government aid","You may take high-interest loans","Banks give free credit"], ans:2 },
      { q:"If monthly expenses are ₹30,000, minimum emergency fund target is?", options:["₹30,000","₹60,000","₹90,000","₹5,00,000"], ans:2 },
      { q:"Automating savings transfer on salary day helps because:", options:["It earns more interest","It removes the temptation to spend first","It's a tax benefit","It builds credit score"], ans:1 },
      { q:"Emergency funds should NOT be used for:", options:["Job loss","Medical emergency","Vacation","Car breakdown"], ans:2 },
    ]
  },
  {
    id:"needs-wants", title:"Needs vs Wants", icon:"⚖️", color:"#A78BFA",
    cards:[
      { type:"awareness", title:"The Core Distinction", content:"Needs are essentials: food, shelter, medicine, transport to work. Wants are everything else that improves comfort or enjoyment but aren't strictly necessary to survive." },
      { type:"awareness", title:"The 24-Hour Rule", content:"Before any non-essential purchase over ₹500, wait 24 hours. If you still want it the next day, it's more likely a genuine need than an impulse buy." },
      { type:"awareness", title:"The 50/30/20 Rule", content:"Allocate 50% of income to needs, 30% to wants, and 20% to savings. This simple framework keeps spending balanced and ensures you always save." },
      { type:"problem", title:"When Wants Masquerade as Needs", content:"'I need the latest iPhone' is a want disguised as a need. This thinking, called lifestyle inflation, causes people to spend more as they earn more — never actually saving." },
      { type:"solution", title:"The Monthly Audit Method", content:"Every month, list every expense and mark each as N (Need) or W (Want). Total both columns. If wants exceed 30% of income, identify 3 wants to cut next month." },
      { type:"impact", title:"The Wealth Gap Explained", content:"Two people earning the same salary can have vastly different wealth in 10 years purely based on needs vs wants discipline. The one who saves 20% consistently builds 3x more wealth." },
    ],
    quiz:[
      { q:"Which of these is a NEED?", options:["Netflix subscription","Latest smartphone","Rent/housing","Coffee from a cafe"], ans:2 },
      { q:"The 24-hour rule applies to purchases above:", options:["₹100","₹200","₹500","₹5000"], ans:2 },
      { q:"In the 50/30/20 rule, what % goes to wants?", options:["50%","30%","20%","10%"], ans:1 },
      { q:"'Lifestyle inflation' means:", options:["Prices rising over time","Spending more as you earn more","Investing in lifestyle assets","Reducing fixed costs"], ans:1 },
      { q:"Which is a WANT disguised as a need?", options:["Monthly medicine","Electricity bill","Latest iPhone","Groceries"], ans:2 },
      { q:"The monthly audit method involves:", options:["Tracking stock prices","Labeling expenses as Need or Want","Reviewing your credit score","Comparing salaries"], ans:1 },
      { q:"Consistent 20% savings over 10 years builds approximately how much more wealth vs not saving?", options:["Same","1.5x","2x","3x"], ans:3 },
      { q:"What should you do if wants exceed 30% of income?", options:["Earn more","Ignore it","Cut 3 wants next month","Take a loan"], ans:2 },
    ]
  },
  {
    id:"budgeting", title:"Budgeting 101", icon:"📊", color:"#34D399",
    cards:[
      { type:"awareness", title:"What is a Budget?", content:"A budget is a plan for your money — deciding in advance how much you'll spend in each category. It transforms reactive spending into intentional, purposeful financial decisions." },
      { type:"awareness", title:"Zero-Based Budgeting", content:"Assign every rupee a job until Income − Expenses = ₹0. Savings and investments count as expenses. This method gives every rupee a purpose and eliminates wasteful spending." },
      { type:"awareness", title:"Envelope Budgeting", content:"Allocate cash into physical or digital envelopes for each category — Food, Transport, Entertainment. When an envelope is empty, spending in that category stops for the month." },
      { type:"problem", title:"Why Most Budgets Fail", content:"85% of people who create budgets abandon them within 3 months. The main reasons: budgets are too restrictive, categories are too broad, or there's no review process." },
      { type:"solution", title:"The 3-Step Budget System", content:"Step 1: Track all spending for one month. Step 2: Set realistic limits per category based on actual data. Step 3: Review weekly for 5 minutes. Adjust without guilt." },
      { type:"impact", title:"Budgeting Changes Your Brain", content:"People who budget consistently report feeling more in control, less anxious about money, and make better financial decisions over time. It literally rewires how you relate to money." },
    ],
    quiz:[
      { q:"What is a budget?", options:["A bank account type","A plan for your money","A type of investment","A government scheme"], ans:1 },
      { q:"In zero-based budgeting, Income − Expenses should equal:", options:["Your salary","Maximum savings","₹0","Your monthly goal"], ans:2 },
      { q:"Envelope budgeting works by:", options:["Putting all money in one account","Allocating money per category and stopping when empty","Saving everything and spending nothing","Investing in envelopes"], ans:1 },
      { q:"What % of people abandon budgets within 3 months?", options:["25%","50%","75%","85%"], ans:3 },
      { q:"Step 1 of the 3-Step Budget System is:", options:["Set limits immediately","Track spending for one month","Review weekly","Cut all wants"], ans:1 },
      { q:"Savings in zero-based budgeting are treated as:", options:["Optional extras","Rewards","Expenses with a purpose","Tax deductions"], ans:2 },
      { q:"How often should you review your budget?", options:["Never","Yearly","Monthly","Weekly for 5 min"], ans:3 },
      { q:"A proven benefit of consistent budgeting is:", options:["Higher salary","Less financial anxiety","Free bank upgrades","Automatic investments"], ans:1 },
      { q:"Why do most budgets fail?", options:["Too many categories","Too restrictive with no review process","Not enough income","Banks don't support it"], ans:1 },
    ]
  },
];

const SHOP_COUPONS = [
  { id:101, title:"₹50 off Swiggy", code:"FIN50", brand:"Swiggy", category:"Food", icon:"🍔", xpCost:500, color:"#F87171" },
  { id:102, title:"₹100 off Flipkart", code:"FLIP100", brand:"Flipkart", category:"Shopping", icon:"🛍️", xpCost:800, color:"#60A5FA" },
  { id:103, title:"₹200 off MakeMyTrip", code:"MMT200", brand:"MakeMyTrip", category:"Travel", icon:"✈️", xpCost:1200, color:"#34D399" },
  { id:104, title:"₹75 off Zomato", code:"ZOM75", brand:"Zomato", category:"Food", icon:"🍕", xpCost:600, color:"#FBBF24" },
  { id:105, title:"Free Prime Month", code:"PRIME30", brand:"Amazon Prime", category:"Entertainment", icon:"📦", xpCost:2000, color:"#A78BFA" },
  { id:106, title:"₹500 off Myntra", code:"MYN500", brand:"Myntra", category:"Shopping", icon:"👗", xpCost:3000, color:"#F472B6" },
];

// helpers
function fullINR(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
function formatINR(n) {
  if (n >= 100000) return "₹"+(n/100000).toFixed(1)+"L";
  if (n >= 1000) return "₹"+(n/1000).toFixed(1)+"K";
  return "₹"+Math.round(n);
}
function polarToCartesian(cx,cy,r,deg) {
  const rad = deg*Math.PI/180;
  return { x: cx+r*Math.cos(rad), y: cy+r*Math.sin(rad) };
}
function today() { return new Date().toISOString().split("T")[0]; }

// ── UI atoms ──────────────────────────────────────────────────────────────────
function Card({ children, style, onClick, hover, t }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background: hov&&hover ? t.cardHover : t.card, border:`1px solid ${t.border}`, borderRadius:16, padding:20,
        transition:"all 0.2s", cursor:onClick?"pointer":"default",
        boxShadow: hov&&hover ? `0 8px 32px ${t.accentGlow}` : "none", ...style }}>
      {children}
    </div>
  );
}

function Badge({ label, color, bg }) {
  return <span style={{ background:bg, color, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>{label}</span>;
}

function XPBar({ xp, t, compact }) {
  const pct = (xp % 1000) / 10;
  return (
    <div>
      {!compact && <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:11, color:t.textMuted }}>Level {Math.floor(xp/1000)+1}</span>
        <span style={{ fontSize:11, color:t.accent }}>{xp%1000}/1000 XP</span>
      </div>}
      <div style={{ background:t.border, borderRadius:99, height:compact?6:8, overflow:"hidden" }}>
        <div style={{ width:pct+"%", height:"100%", borderRadius:99,
          background:`linear-gradient(90deg, ${t.accent}, ${t.purple})`, transition:"width 0.8s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

function DonutChart({ data, size=140, t }) {
  const total = data.reduce((s,d)=>s+d.value,0)||1;
  let angle = -90;
  const cx=size/2, cy=size/2, r=size*0.38, stroke=size*0.12;
  const arcs = data.map(d=>{
    const pct=d.value/total; const sa=angle; angle+=pct*360;
    const start=polarToCartesian(cx,cy,r,sa), end=polarToCartesian(cx,cy,r,angle);
    return { ...d, path:`M ${start.x} ${start.y} A ${r} ${r} 0 ${pct>0.5?1:0} 1 ${end.x} ${end.y}` };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((arc,i)=>(
        <path key={i} d={arc.path} fill="none" stroke={arc.color} strokeWidth={stroke} strokeLinecap="round"
          style={{ filter:`drop-shadow(0 0 4px ${arc.color}40)` }} />
      ))}
      <circle cx={cx} cy={cy} r={r-stroke/2} fill={t.card} />
    </svg>
  );
}

// ── Confetti / Party Poppers ───────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({length:60},(_,i)=>({
    id:i, x:Math.random()*100, delay:Math.random()*1.5,
    color:["#4F9EF8","#A78BFA","#34D399","#F87171","#FBBF24","#F472B6","#2DD4BF"][i%7],
    size: 6+Math.random()*8, duration: 1.5+Math.random()*2,
  }));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:3000, overflow:"hidden" }}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:"absolute", left:p.x+"%", top:"-10px", width:p.size, height:p.size,
          background:p.color, borderRadius:Math.random()>0.5?"50%":"2px",
          animation:`confettiFall ${p.duration}s ${p.delay}s linear forwards`,
          transform:`rotate(${Math.random()*360}deg)`
        }} />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity:1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity:0; }
        }
      `}</style>
    </div>
  );
}

// ── Proof Upload Modal ────────────────────────────────────────────────────────
function ProofModal({ challenge, dayNum, onUpload, onClose, t }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [note, setNote] = useState("");
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:2000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <Card t={t} style={{ maxWidth:360, width:"100%", padding:"24px" }}>
        <div style={{ fontWeight:800, fontSize:18, color:t.text, marginBottom:4 }}>
          {challenge.icon} Upload Proof
        </div>
        <div style={{ color:t.textMuted, fontSize:13, marginBottom:20 }}>
          {challenge.title} {dayNum && dayNum!=="daily" ? `— Day ${dayNum}` : ""}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display:"none" }} />
        <div onClick={()=>fileRef.current.click()} style={{
          border:`2px dashed ${preview ? t.green : t.border}`, borderRadius:14,
          height:160, display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", marginBottom:14, overflow:"hidden",
          background: preview ? "transparent" : `${t.accent}08`
        }}>
          {preview
            ? <img src={preview} alt="proof" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            : <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:40 }}>📸</div>
                <div style={{ color:t.textMuted, fontSize:13, marginTop:6 }}>Tap to upload photo proof</div>
              </div>}
        </div>
        <input placeholder="Add a note (optional)" value={note} onChange={e=>setNote(e.target.value)}
          style={{ width:"100%", padding:10, borderRadius:10, border:`1px solid ${t.border}`,
            background:t.surface, color:t.text, marginBottom:16, boxSizing:"border-box", fontSize:14 }} />
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>{ if(preview){ onUpload({ fileName:file?.name||"proof.jpg", note, preview, day:dayNum }); onClose(); } }}
            style={{ flex:2, padding:12, borderRadius:10, border:"none",
              background:preview?`linear-gradient(135deg,${t.green},#059669)`:t.border,
              color:"#fff", fontWeight:700, cursor:preview?"pointer":"not-allowed", fontSize:14 }}>
            Submit Proof ✓
          </button>
          <button onClick={onClose} style={{ flex:1, padding:12, borderRadius:10,
            border:`1px solid ${t.border}`, background:"transparent", color:t.textMuted, cursor:"pointer" }}>
            Cancel
          </button>
        </div>
      </Card>
    </div>
  );
}

// ── Spin Wheel ────────────────────────────────────────────────────────────────
function SpinWheel({ t, onAccept }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const rotRef = useRef(0);
  const size=260, cx=size/2, cy=size/2, r=size/2-8;
  const colors=["#4F9EF8","#A78BFA","#34D399","#F87171","#FBBF24","#F472B6","#2DD4BF","#FB923C"];

  const spin = () => {
    if (spinning||result) return;
    setSpinning(true);
    const total = (5+Math.random()*5)*360 + Math.random()*360;
    rotRef.current += total;
    setRotation(rotRef.current);
    setTimeout(()=>{
      const final = rotRef.current % 360;
      const seg = 360/SPIN_CHALLENGES.length;
      const idx = Math.floor(((360-final+90)%360)/seg)%SPIN_CHALLENGES.length;
      setResult(SPIN_CHALLENGES[idx]);
      setSpinning(false);
    }, 3100);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
      <div style={{ position:"relative" }}>
        <svg width={size} height={size} style={{
          transform:`rotate(${rotation}deg)`,
          transition: spinning ? "transform 3.1s cubic-bezier(.17,.67,.12,.99)" : "none",
          filter:`drop-shadow(0 0 20px ${t.accentGlow})`
        }}>
          {SPIN_CHALLENGES.map((ch,i)=>{
            const sa=i*(360/8)-90, ea=sa+360/8;
            const s=polarToCartesian(cx,cy,r,sa), e=polarToCartesian(cx,cy,r,ea);
            const tx=cx+(r*0.65)*Math.cos((sa+360/16)*Math.PI/180);
            const ty=cy+(r*0.65)*Math.sin((sa+360/16)*Math.PI/180);
            return (
              <g key={i}>
                <path d={`M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y} Z`}
                  fill={colors[i%colors.length]} stroke={t.bg} strokeWidth={2} opacity={0.9} />
                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                  style={{ fontSize:16, fill:"#fff", pointerEvents:"none" }}>{ch.icon}</text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={22} fill={t.bg} stroke={t.border} strokeWidth={2}/>
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" style={{ fontSize:14, fill:t.text }}>🎯</text>
        </svg>
        <div style={{ position:"absolute", top:-8, left:"50%", transform:"translateX(-50%)",
          width:0, height:0, borderLeft:"10px solid transparent", borderRight:"10px solid transparent",
          borderTop:`24px solid ${t.accent}`, filter:`drop-shadow(0 2px 8px ${t.accent})` }} />
      </div>
      {!result && (
        <button onClick={spin} disabled={spinning} style={{
          padding:"12px 44px", borderRadius:99, border:"none",
          background: spinning ? t.border : `linear-gradient(135deg,${t.accent},${t.purple})`,
          color:"#fff", fontWeight:700, fontSize:15, cursor:spinning?"not-allowed":"pointer",
          boxShadow: spinning?"none":`0 4px 20px ${t.accentGlow}`
        }}>{spinning?"Spinning...":"🎰 Spin!"}</button>
      )}
      {result && (
        <div style={{ background:t.card, border:`1px solid ${t.accent}`, borderRadius:20,
          padding:"24px", textAlign:"center", width:"100%", maxWidth:320 }}>
          <div style={{ fontSize:48 }}>{result.icon}</div>
          <div style={{ fontWeight:800, fontSize:19, color:t.text, margin:"10px 0 4px" }}>{result.title}</div>
          <div style={{ color:t.accent, fontWeight:600, marginBottom:20 }}>+{result.xp} XP on completion</div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>{ onAccept(result); setResult(null); }} style={{
              flex:2, padding:13, borderRadius:12, border:"none",
              background:`linear-gradient(135deg,${t.green},#059669)`,
              color:"#fff", fontWeight:700, cursor:"pointer", fontSize:14
            }}>✅ Accept</button>
            <button onClick={()=>setResult(null)} style={{
              flex:1, padding:13, borderRadius:12, border:`1px solid ${t.red}55`,
              background:`${t.red}11`, color:t.red, fontWeight:700, cursor:"pointer"
            }}>❌ Deny</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── QUIZ ──────────────────────────────────────────────────────────────────────
function QuizSection({ topic, onComplete, t }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const qs = topic.quiz;
  const correct = submitted ? qs.filter((q,i)=>answers[i]===q.ans).length : 0;
  const xpEarned = submitted ? (correct===qs.length ? 75 : Math.round((correct/qs.length)*75)) : 0;

  const submit = () => {
    setSubmitted(true);
    setShowResult(true);
    setShowConfetti(true);
    setTimeout(()=>setShowConfetti(false), 3500);
  };

  if (showResult) return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {showConfetti && <Confetti />}
      <div style={{ textAlign:"center", background:`linear-gradient(135deg,${topic.color}22,${topic.color}11)`,
        border:`1px solid ${topic.color}55`, borderRadius:24, padding:"36px 24px" }}>
        <div style={{ fontSize:72 }}>{correct===qs.length?"🏆":"🎯"}</div>
        <div style={{ fontWeight:900, fontSize:24, color:t.text, marginTop:12 }}>
          {correct===qs.length ? "Perfect Score! 🎉" : "Quiz Complete!"}
        </div>
        <div style={{ color:t.textMuted, fontSize:15, marginTop:6 }}>
          {correct} out of {qs.length} correct
        </div>
        <div style={{ marginTop:20, display:"inline-flex", alignItems:"center", gap:10,
          background:`${topic.color}33`, borderRadius:99, padding:"12px 28px" }}>
          <span style={{ fontSize:28 }}>⚡</span>
          <span style={{ fontWeight:900, fontSize:32, color:topic.color }}>+{xpEarned} XP</span>
        </div>
        <div style={{ color:t.textMuted, fontSize:13, marginTop:10 }}>
          {correct===qs.length ? "You answered all questions correctly!" : `Earned ${xpEarned} of 75 possible XP`}
        </div>
        <button onClick={()=>onComplete(xpEarned)} style={{
          marginTop:24, padding:"14px 40px", borderRadius:14, border:"none",
          background:`linear-gradient(135deg,${topic.color},${t.purple})`,
          color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer"
        }}>Claim Reward 🎁</button>
      </div>
      {/* Answer review */}
      <div style={{ fontWeight:700, color:t.text, fontSize:15 }}>Answer Review</div>
      {qs.map((q,i)=>(
        <Card key={i} t={t} style={{ padding:"14px 16px", borderLeft:`3px solid ${answers[i]===q.ans?t.green:t.red}` }}>
          <div style={{ fontWeight:600, color:t.text, fontSize:13, marginBottom:8 }}>{i+1}. {q.q}</div>
          {q.options.map((opt,j)=>(
            <div key={j} style={{ padding:"6px 10px", borderRadius:8, marginBottom:4, fontSize:12,
              background: j===q.ans ? `${t.green}22` : (j===answers[i] && answers[i]!==q.ans ? `${t.red}22` : "transparent"),
              color: j===q.ans ? t.green : (j===answers[i] && answers[i]!==q.ans ? t.red : t.textMuted),
              border:`1px solid ${j===q.ans?t.green+"44":(j===answers[i]&&answers[i]!==q.ans?t.red+"44":t.border)}`,
              fontWeight: j===q.ans||j===answers[i] ? 700 : 400
            }}>
              {j===q.ans?"✓ ":j===answers[i]&&answers[i]!==q.ans?"✗ ":""}{opt}
            </div>
          ))}
        </Card>
      ))}
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ fontWeight:800, fontSize:18, color:t.text }}>📝 Quiz — {topic.title}</div>
      <div style={{ color:t.textMuted, fontSize:13 }}>Answer all {qs.length} questions. Full marks = 75 XP!</div>
      {qs.map((q,i)=>(
        <Card key={i} t={t} style={{ padding:"16px" }}>
          <div style={{ fontWeight:700, color:t.text, fontSize:14, marginBottom:12 }}>{i+1}. {q.q}</div>
          {q.options.map((opt,j)=>(
            <div key={j} onClick={()=>setAnswers(a=>({...a,[i]:j}))} style={{
              padding:"10px 14px", borderRadius:10, marginBottom:6, cursor:"pointer",
              border:`1px solid ${answers[i]===j ? topic.color : t.border}`,
              background: answers[i]===j ? `${topic.color}22` : t.surface,
              color: answers[i]===j ? topic.color : t.text,
              fontWeight: answers[i]===j ? 700 : 400, fontSize:13, transition:"all 0.15s"
            }}>
              <span style={{ marginRight:8, fontWeight:700 }}>{String.fromCharCode(65+j)}.</span>{opt}
            </div>
          ))}
        </Card>
      ))}
      <button onClick={submit} disabled={Object.keys(answers).length<qs.length} style={{
        padding:14, borderRadius:14, border:"none",
        background: Object.keys(answers).length<qs.length ? t.border : `linear-gradient(135deg,${topic.color},${t.purple})`,
        color:"#fff", fontWeight:800, fontSize:15, cursor:Object.keys(answers).length<qs.length?"not-allowed":"pointer"
      }}>
        {Object.keys(answers).length<qs.length ? `Answer all questions (${Object.keys(answers).length}/${qs.length})` : "Submit Quiz 🚀"}
      </button>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function HomeSection({ user, expenses, fixedExpenses, activeChallenges, t }) {
  const level = Math.floor(user.xp/1000)+1;
  const badge = getCurrentBadge(level);
  const varExp = expenses.filter(e=>!e.fixed).reduce((s,e)=>s+e.amount,0);
  const fixedTotal = [...fixedExpenses, ...expenses.filter(e=>e.fixed)].reduce((s,e)=>s+e.amount,0);
  const totalSpent = varExp+fixedTotal;
  const catTotals = {};
  expenses.forEach(e=>{ catTotals[e.category]=(catTotals[e.category]||0)+e.amount; });
  const topCat = Object.entries(catTotals).sort((a,b)=>b[1]-a[1])[0];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ background:"linear-gradient(135deg,#1E3A6E 0%,#0D2137 50%,#1A1040 100%)",
        borderRadius:24, padding:"28px", position:"relative", overflow:"hidden", border:`1px solid rgba(79,158,248,0.3)` }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200,
          background:`radial-gradient(circle,rgba(79,158,248,0.15),transparent 70%)`, borderRadius:"50%" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:4 }}>Total Balance</div>
            <div style={{ color:"#fff", fontSize:34, fontWeight:800, letterSpacing:-1 }}>{fullINR(user.balance)}</div>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, marginTop:4 }}>Monthly Income: {fullINR(user.income)}</div>
          </div>
          <div style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.05))",
            borderRadius:16, padding:"10px 14px", border:"1px solid rgba(255,255,255,0.15)", backdropFilter:"blur(10px)", textAlign:"center" }}>
            <div style={{ fontSize:26 }}>{badge.label.split(" ")[1]}</div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:11, marginTop:4, maxWidth:72 }}>{badge.label.split(" ")[0]}</div>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:10, marginTop:2 }}>Lv.{level}</div>
          </div>
        </div>
        <div style={{ marginTop:20 }}>
          <XPBar xp={user.xp} t={{ ...t, accent:"#4F9EF8", purple:"#A78BFA" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{user.xp} XP total</span>
            <span style={{ color:"#4F9EF8", fontSize:11 }}>{1000-(user.xp%1000)} XP to Level {level+1}</span>
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        {[
          { label:"Spent", value:formatINR(totalSpent), icon:"💸", color:t.red },
          { label:"Streak", value:user.streak+" days", icon:"🔥", color:t.amber },
          { label:"Active", value:activeChallenges.length+" tasks", icon:"⚡", color:t.purple },
        ].map((s,i)=>(
          <Card key={i} t={t} style={{ padding:16, textAlign:"center" }}>
            <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontWeight:700, fontSize:15, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:11, color:t.textMuted, marginTop:2 }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <div>
        <div style={{ fontSize:12, fontWeight:700, color:t.textMuted, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>🤖 AI Insights</div>
        {topCat && (
          <div style={{ background:`${t.accent}15`, border:`1px solid ${t.accent}33`, borderRadius:14, padding:"14px 16px", display:"flex", gap:12, marginBottom:10 }}>
            <span style={{ fontSize:20 }}>📊</span>
            <div>
              <div style={{ fontWeight:700, color:t.accent, fontSize:13 }}>Top Spend: {topCat[0]}</div>
              <div style={{ color:t.textMuted, fontSize:12, marginTop:2 }}>
                {fullINR(topCat[1])} on {topCat[0].toLowerCase()} this month.
              </div>
            </div>
          </div>
        )}
        <div style={{ background:`${t.green}15`, border:`1px solid ${t.green}33`, borderRadius:14, padding:"14px 16px", display:"flex", gap:12 }}>
          <span style={{ fontSize:20 }}>💡</span>
          <div>
            <div style={{ fontWeight:700, color:t.green, fontSize:13 }}>Savings Opportunity</div>
            <div style={{ color:t.textMuted, fontSize:12, marginTop:2 }}>
              Cutting discretionary spend by 20% could save {formatINR(Math.round(varExp*0.2))} more this month.
            </div>
          </div>
        </div>
      </div>
      <div>
        <div style={{ fontSize:12, fontWeight:700, color:t.textMuted, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>Recent Transactions</div>
        <Card t={t} style={{ padding:"8px 16px" }}>
          {expenses.slice(0,5).map((e,i)=>(
            <div key={e.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"10px 0", borderBottom: i<4?`1px solid ${t.border}`:"none" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${CAT_COLORS[e.category]}22`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{CAT_ICONS[e.category]}</div>
                <div>
                  <div style={{ fontWeight:600, fontSize:13, color:t.text }}>{e.note}</div>
                  <div style={{ fontSize:11, color:t.textMuted }}>{e.category} • {e.date} {e.fixed&&"• Fixed"}</div>
                </div>
              </div>
              <div style={{ color:t.red, fontWeight:700, fontSize:14 }}>−{fullINR(e.amount)}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── BUDGET ────────────────────────────────────────────────────────────────────
function BudgetSection({ user, setUser, expenses, setExpenses, fixedExpenses, setFixedExpenses, t }) {
  const [tab, setTab] = useState("overview");
  const [showAdd, setShowAdd] = useState(false);
  const [showIncomeEdit, setShowIncomeEdit] = useState(false);
  const [newIncome, setNewIncome] = useState(user.income);
  const [newExp, setNewExp] = useState({ category:"Food", amount:"", note:"", date:today(), fixed:false });

  const varExpenses = expenses.filter(e=>!e.fixed);
  const fixedFromVar = expenses.filter(e=>e.fixed);
  const allFixed = [...fixedExpenses, ...fixedFromVar];
  const varTotal = varExpenses.reduce((s,e)=>s+e.amount,0);
  const fixedTotal = allFixed.reduce((s,e)=>s+e.amount,0);
  const totalSpent = varTotal+fixedTotal;
  const remaining = user.income - totalSpent;
  const catTotals={};
  varExpenses.forEach(e=>{ catTotals[e.category]=(catTotals[e.category]||0)+e.amount; });
  const chartData = CATEGORIES.filter(c=>catTotals[c]).map(c=>({ label:c, value:catTotals[c], color:CAT_COLORS[c] }));

  const add = () => {
    if (!newExp.amount) return;
    const entry = { id:Date.now(), ...newExp, amount:parseInt(newExp.amount) };
    setExpenses(p=>[entry, ...p]);
    setNewExp({ category:"Food", amount:"", note:"", date:today(), fixed:false });
    setShowAdd(false);
    setUser(u=>({ ...u, xp:u.xp+10 }));
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Header with income edit */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:22, fontWeight:800, color:t.text }}>Budget — April 2025</div>
        <button onClick={()=>{ setNewIncome(user.income); setShowIncomeEdit(true); }} style={{
          display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:12,
          border:`1px solid ${t.accent}44`, background:`${t.accent}11`, color:t.accent,
          fontWeight:700, cursor:"pointer", fontSize:13
        }}>✏️ Update Income</button>
      </div>

      {/* Income Edit Modal */}
      {showIncomeEdit && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:2000,
          display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <Card t={t} style={{ maxWidth:320, width:"100%", padding:"24px" }}>
            <div style={{ fontWeight:800, fontSize:18, color:t.text, marginBottom:16 }}>💰 Update Monthly Income</div>
            <input type="number" placeholder="Monthly Income (₹)" value={newIncome}
              onChange={e=>setNewIncome(e.target.value)}
              style={{ width:"100%", padding:14, borderRadius:12, border:`1px solid ${t.border}`,
                background:t.surface, color:t.text, marginBottom:16, boxSizing:"border-box", fontSize:16 }} />
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>{ setUser(u=>({...u,income:parseInt(newIncome)||u.income})); setShowIncomeEdit(false); }}
                style={{ flex:1, padding:12, borderRadius:10, border:"none",
                  background:`linear-gradient(135deg,${t.accent},${t.purple})`, color:"#fff", fontWeight:700, cursor:"pointer" }}>
                Save
              </button>
              <button onClick={()=>setShowIncomeEdit(false)}
                style={{ flex:1, padding:12, borderRadius:10, border:`1px solid ${t.border}`,
                  background:"transparent", color:t.textMuted, cursor:"pointer" }}>
                Cancel
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        {[
          { label:"Income", val:fullINR(user.income), color:t.green, icon:"💰" },
          { label:"Spent", val:fullINR(totalSpent), color:t.red, icon:"💸" },
          { label:"Left", val:fullINR(Math.max(0,remaining)), color:remaining<0?t.red:t.accent, icon:"🏦" },
        ].map((s,i)=>(
          <Card key={i} t={t} style={{ padding:14, textAlign:"center" }}>
            <div style={{ fontSize:20 }}>{s.icon}</div>
            <div style={{ fontWeight:800, fontSize:14, color:s.color, marginTop:4 }}>{s.val}</div>
            <div style={{ fontSize:10, color:t.textMuted, marginTop:2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:8, background:t.surface, padding:4, borderRadius:12 }}>
        {["overview","daily","fixed"].map(tab_=>(
          <button key={tab_} onClick={()=>setTab(tab_)} style={{
            flex:1, padding:"8px 12px", borderRadius:10, border:"none", cursor:"pointer",
            background: tab===tab_ ? `linear-gradient(135deg,${t.accent},${t.purple})` : "transparent",
            color: tab===tab_ ? "#fff" : t.textMuted, fontWeight:600, fontSize:12, textTransform:"capitalize"
          }}>{tab_}</button>
        ))}
      </div>

      {tab==="overview" && (
        <Card t={t}>
          <div style={{ fontWeight:700, color:t.text, marginBottom:16 }}>Spending by Category</div>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            {chartData.length>0 && <DonutChart data={chartData} size={130} t={t} />}
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
              {chartData.slice(0,5).map((d,i)=>(
                <div key={i}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                    <span style={{ fontSize:12, color:t.text }}>{CAT_ICONS[d.label]} {d.label}</span>
                    <span style={{ fontSize:12, color:t.textMuted }}>{fullINR(d.value)}</span>
                  </div>
                  <div style={{ background:t.border, borderRadius:99, height:4 }}>
                    <div style={{ width:(d.value/varTotal*100)+"%", height:"100%", borderRadius:99, background:d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {tab==="daily" && (
        <>
          <button onClick={()=>setShowAdd(s=>!s)} style={{
            width:"100%", padding:12, borderRadius:12, border:"none",
            background:`linear-gradient(135deg,${t.accent},${t.purple})`,
            color:"#fff", fontWeight:700, cursor:"pointer"
          }}>+ Add Expense</button>

          {showAdd && (
            <Card t={t}>
              <div style={{ fontWeight:700, color:t.text, marginBottom:14 }}>Add Expense</div>
              <select value={newExp.category} onChange={e=>setNewExp(p=>({...p,category:e.target.value}))}
                style={{ width:"100%", padding:10, borderRadius:8, border:`1px solid ${t.border}`, background:t.surface, color:t.text, marginBottom:10 }}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Amount (₹)" value={newExp.amount} onChange={e=>setNewExp(p=>({...p,amount:e.target.value}))}
                style={{ width:"100%", padding:10, borderRadius:8, border:`1px solid ${t.border}`, background:t.surface, color:t.text, marginBottom:10, boxSizing:"border-box" }} />
              <input placeholder="Note" value={newExp.note} onChange={e=>setNewExp(p=>({...p,note:e.target.value}))}
                style={{ width:"100%", padding:10, borderRadius:8, border:`1px solid ${t.border}`, background:t.surface, color:t.text, marginBottom:12, boxSizing:"border-box" }} />
              {/* Fixed expense checkbox */}
              <div onClick={()=>setNewExp(p=>({...p,fixed:!p.fixed}))}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10,
                  border:`1px solid ${newExp.fixed?t.amber:t.border}`, background:newExp.fixed?`${t.amber}11`:t.surface,
                  cursor:"pointer", marginBottom:14, userSelect:"none" }}>
                <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${newExp.fixed?t.amber:t.border}`,
                  background:newExp.fixed?t.amber:"transparent", display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.2s", flexShrink:0 }}>
                  {newExp.fixed && <span style={{ color:"#fff", fontSize:13, fontWeight:900 }}>✓</span>}
                </div>
                <div>
                  <div style={{ fontWeight:700, color:newExp.fixed?t.amber:t.text, fontSize:13 }}>Mark as Fixed Expense</div>
                  <div style={{ color:t.textMuted, fontSize:11 }}>This will appear under the Fixed tab every month</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={add} style={{ flex:1, padding:10, borderRadius:8, border:"none", background:t.green, color:"#fff", fontWeight:700, cursor:"pointer" }}>Add</button>
                <button onClick={()=>setShowAdd(false)} style={{ flex:1, padding:10, borderRadius:8, border:`1px solid ${t.border}`, background:"transparent", color:t.textMuted, cursor:"pointer" }}>Cancel</button>
              </div>
            </Card>
          )}

          {varExpenses.map(e=>(
            <Card key={e.id} t={t} style={{ padding:"12px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`${CAT_COLORS[e.category]}22`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{CAT_ICONS[e.category]}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, color:t.text }}>{e.note||e.category}</div>
                    <div style={{ fontSize:11, color:t.textMuted }}>{e.category} • {e.date}</div>
                  </div>
                </div>
                <div style={{ color:t.red, fontWeight:700 }}>−{fullINR(e.amount)}</div>
              </div>
            </Card>
          ))}
        </>
      )}

      {tab==="fixed" && (
        <>
          {allFixed.map((f,i)=>(
            <Card key={i} t={t} style={{ padding:"14px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ fontSize:22 }}>{CAT_ICONS[f.category]}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14, color:t.text }}>{f.name||f.note}</div>
                    <div style={{ fontSize:11, color:t.textMuted }}>Monthly Fixed</div>
                  </div>
                </div>
                <div style={{ fontWeight:700, color:t.text }}>{fullINR(f.amount)}</div>
              </div>
            </Card>
          ))}
          <div style={{ padding:"12px 16px", borderRadius:12, background:`${t.red}11`, border:`1px solid ${t.red}33` }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontWeight:700, color:t.text }}>Total Fixed</span>
              <span style={{ fontWeight:800, color:t.red }}>{fullINR(fixedTotal)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── CHALLENGES ────────────────────────────────────────────────────────────────
function ChallengesSection({ activeChallenges, setActiveChallenges, completedChallenges, setCompletedChallenges, setUser, t }) {
  const [tab, setTab] = useState("spin");
  const [proofModal, setProofModal] = useState(null);

  // Get the next unlocked proof day for a weekly challenge
  // User can only upload day N+1 after day N proof exists (or day 1 first)
  // BUT: if today's day index > previous day, allow it
  // Simplified: track by sequence — next uploadable day = proofCount+1 (so must go in order)
  const nextUploadableDay = (c) => {
    const uploaded = Object.keys(c.proofs||{}).map(Number).filter(Boolean).sort((a,b)=>a-b);
    if (uploaded.length===0) return 1;
    // next day must be sequential
    for (let d=1; d<=7; d++) {
      if (!c.proofs[d]) return d;
    }
    return null;
  };

  const addChallenge = (ch) => {
    if (activeChallenges.find(c=>c.title===ch.title)) return;
    setActiveChallenges(p=>[...p, { ...ch, id:Date.now(), proofs:{}, startedAt:new Date().toISOString() }]);
  };

  const handleProofUpload = (challenge, proof) => {
    setActiveChallenges(p=>p.map(c=>{
      if (c.id!==challenge.id) return c;
      return { ...c, proofs:{ ...c.proofs, [proof.day]: proof } };
    }));
    setUser(u=>({ ...u, xp:u.xp+20 }));
  };

  const completeChallenge = (c) => {
    const proofCount = Object.keys(c.proofs||{}).filter(k=>k!=="daily").length + (c.proofs["daily"]?1:0);
    const maxDays = c.type==="weekly" ? 7 : 1;
    const earnedXP = Math.round(c.xp * (proofCount / maxDays));
    setActiveChallenges(p=>p.filter(x=>x.id!==c.id));
    setCompletedChallenges(p=>[...p, { ...c, completedAt:new Date().toISOString(), earnedXP, proofCount, maxDays }]);
    setUser(u=>({ ...u, xp:u.xp+earnedXP, streak:u.streak+1 }));
  };

  const diffColor = { easy:t.green, medium:t.amber, hard:t.red };

  const ChallengeCard = ({ c, fromList }) => {
    const isActive = activeChallenges.find(a=>a.title===c.title);
    return (
      <Card t={t} style={{ borderLeft:`3px solid ${c.type==="weekly"?t.purple:t.amber}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:28 }}>{c.icon}</span>
            <div>
              <div style={{ fontWeight:700, color:t.text, fontSize:14 }}>{c.title}</div>
              <div style={{ color:t.textMuted, fontSize:12, marginTop:2 }}>{c.desc}</div>
              <div style={{ display:"flex", gap:6, marginTop:6 }}>
                <Badge label={c.type} color={c.type==="weekly"?t.purple:t.amber} bg={`${c.type==="weekly"?t.purple:t.amber}22`} />
                <Badge label={`+${c.xp} XP`} color={t.accent} bg={`${t.accent}22`} />
                <Badge label={c.difficulty} color={diffColor[c.difficulty]} bg={`${diffColor[c.difficulty]}22`} />
              </div>
            </div>
          </div>
        </div>
        {fromList && (
          <button onClick={()=>addChallenge(c)} disabled={!!isActive} style={{
            width:"100%", padding:"10px", borderRadius:10, border:"none",
            background: isActive ? `${t.green}22` : `linear-gradient(135deg,${t.accent},${t.purple})`,
            color: isActive ? t.green : "#fff", fontWeight:700, fontSize:13,
            cursor: isActive?"default":"pointer"
          }}>
            {isActive ? "✓ Already Active" : "✅ Accept Challenge"}
          </button>
        )}
      </Card>
    );
  };

  const ActiveCard = ({ c }) => {
    const proofCount = Object.keys(c.proofs||{}).filter(k=>k!=="daily").length + (c.proofs["daily"]?1:0);
    const maxDays = c.type==="weekly"?7:1;
    const pct = Math.round((proofCount/maxDays)*100);
    const nextDay = c.type==="weekly" ? nextUploadableDay(c) : null;
    const dailyDone = c.type==="daily" && c.proofs["daily"];

    return (
      <Card t={t} style={{ borderLeft:`3px solid ${t.amber}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:28 }}>{c.icon}</span>
            <div>
              <div style={{ fontWeight:700, color:t.text }}>{c.title}</div>
              <div style={{ display:"flex", gap:6, marginTop:4 }}>
                <Badge label={c.type} color={t.amber} bg={`${t.amber}22`} />
                <Badge label={`${proofCount}/${maxDays} proofs`} color={t.accent} bg={`${t.accent}22`} />
              </div>
            </div>
          </div>
          <div style={{ color:t.green, fontWeight:800, fontSize:14 }}>+{Math.round(c.xp*(proofCount/maxDays))} XP</div>
        </div>

        <div style={{ background:t.border, borderRadius:99, height:6, marginBottom:12 }}>
          <div style={{ width:pct+"%", height:"100%", borderRadius:99,
            background:`linear-gradient(90deg,${t.green},${t.accent})`, transition:"width 0.4s" }} />
        </div>

        {/* Weekly: sequential day proof buttons */}
        {c.type==="weekly" && (
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
            {Array.from({length:7},(_,i)=>i+1).map(day=>{
              const done = !!c.proofs[day];
              const isNext = day===nextDay;
              const locked = !done && !isNext;
              return (
                <button key={day} onClick={()=>isNext&&setProofModal({ challenge:c, day })}
                  style={{
                    padding:"7px 10px", borderRadius:10,
                    border:`1px solid ${done?t.green:isNext?t.accent:t.border}`,
                    background: done?`${t.green}22`:isNext?`${t.accent}15`:`${t.border}`,
                    color: done?t.green:isNext?t.accent:t.textFaint,
                    fontWeight:700, fontSize:11,
                    cursor:isNext?"pointer":done?"default":"not-allowed",
                    opacity: locked?0.5:1, transition:"all 0.2s"
                  }}>
                  {done ? `✓ Day ${day}` : isNext ? `+ Day ${day} Proof` : `Day ${day}`}
                </button>
              );
            })}
          </div>
        )}

        {/* Daily proof button */}
        {c.type==="daily" && (
          <button onClick={()=>!dailyDone&&setProofModal({ challenge:c, day:"daily" })} style={{
            width:"100%", padding:"10px", borderRadius:10,
            border:`1px solid ${dailyDone?t.green:t.accent}55`,
            background:dailyDone?`${t.green}15`:`${t.accent}11`,
            color:dailyDone?t.green:t.accent, fontWeight:700, fontSize:13,
            cursor:dailyDone?"default":"pointer", marginBottom:10,
            display:"flex", alignItems:"center", justifyContent:"center", gap:6
          }}>
            {dailyDone ? "✓ Proof Uploaded" : "📸 Upload Daily Proof"}
          </button>
        )}

        <button onClick={()=>completeChallenge(c)} style={{
          width:"100%", padding:10, borderRadius:10, border:"none",
          background:`linear-gradient(135deg,${t.green},#059669)`,
          color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13
        }}>
          ✅ Complete ({proofCount}/{maxDays} proofs → +{Math.round(c.xp*(proofCount/maxDays))} XP)
        </button>
      </Card>
    );
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ fontSize:22, fontWeight:800, color:t.text }}>Challenges</div>

      {/* Tabs: spin, active, weekly, all, history */}
      <div style={{ display:"flex", gap:4, background:t.surface, padding:4, borderRadius:12, overflowX:"auto" }}>
        {[
          { id:"spin", label:"🎰 Spin" },
          { id:"active", label:"⚡ Active" },
          { id:"weekly", label:"📅 Weekly" },
          { id:"all", label:"📋 All" },
          { id:"history", label:"📜 History" },
        ].map(item=>(
          <button key={item.id} onClick={()=>setTab(item.id)} style={{
            flex:1, padding:"8px 6px", borderRadius:10, border:"none", cursor:"pointer",
            background: tab===item.id ? `linear-gradient(135deg,${t.accent},${t.purple})` : "transparent",
            color: tab===item.id ? "#fff" : t.textMuted, fontWeight:600, fontSize:10, whiteSpace:"nowrap",
            position:"relative"
          }}>
            {item.label}
            {item.id==="active" && activeChallenges.length>0 && (
              <span style={{ marginLeft:4, background:t.red, color:"#fff", borderRadius:"50%",
                padding:"1px 4px", fontSize:8 }}>{activeChallenges.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab==="spin" && (
        <Card t={t} style={{ textAlign:"center", padding:"28px 20px" }}>
          <div style={{ fontWeight:800, fontSize:18, color:t.text, marginBottom:4 }}>Spin for a Challenge!</div>
          <div style={{ color:t.textMuted, fontSize:13, marginBottom:24 }}>Accept or Deny — your call!</div>
          <SpinWheel t={t} onAccept={addChallenge} />
        </Card>
      )}

      {tab==="active" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {activeChallenges.length===0 && (
            <div style={{ textAlign:"center", padding:48, color:t.textMuted }}>
              <div style={{ fontSize:48 }}>⚡</div>
              <div style={{ marginTop:10 }}>No active challenges. Spin or browse to add!</div>
            </div>
          )}
          {activeChallenges.map(c=><ActiveCard key={c.id} c={c} />)}
        </div>
      )}

      {tab==="weekly" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ color:t.textMuted, fontSize:13 }}>7-day challenges — upload proof each day sequentially</div>
          {WEEKLY_CHALLENGES.map(c=><ChallengeCard key={c.id} c={c} fromList />)}
        </div>
      )}

      {tab==="all" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ color:t.textMuted, fontSize:13 }}>All available challenges</div>
          {ALL_CHALLENGES.map(c=><ChallengeCard key={c.id} c={c} fromList />)}
        </div>
      )}

      {tab==="history" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {completedChallenges.length===0 && (
            <div style={{ textAlign:"center", padding:40, color:t.textMuted }}>
              <div style={{ fontSize:48 }}>📜</div>
              <div style={{ marginTop:10 }}>No completed challenges yet!</div>
            </div>
          )}
          {completedChallenges.map((c,i)=>(
            <Card key={i} t={t} style={{ borderLeft:`3px solid ${t.green}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ fontSize:26 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontWeight:700, color:t.text, fontSize:14 }}>{c.title}</div>
                    <div style={{ fontSize:12, color:t.textMuted, marginTop:2 }}>
                      {c.proofCount}/{c.maxDays} proofs • {new Date(c.completedAt).toLocaleDateString("en-IN")}
                    </div>
                    <div style={{ display:"flex", gap:6, marginTop:4 }}>
                      <Badge label={`+${c.earnedXP} XP`} color={t.green} bg={`${t.green}22`} />
                      {c.proofCount===c.maxDays && <Badge label="Full Proof ✨" color={t.amber} bg={`${t.amber}22`} />}
                    </div>
                  </div>
                </div>
                <div style={{ color:t.green, fontSize:20 }}>✅</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {proofModal && (
        <ProofModal challenge={proofModal.challenge} dayNum={proofModal.day}
          onUpload={(proof)=>handleProofUpload(proofModal.challenge, proof)}
          onClose={()=>setProofModal(null)} t={t} />
      )}
    </div>
  );
}

// ── SAVINGS ───────────────────────────────────────────────────────────────────
function SavingsSection({ goals, setGoals, setUser, t }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ name:"", target:"", deadline:"", icon:"🎯" });
  const [logId, setLogId] = useState(null);
  const [logAmt, setLogAmt] = useState("");
  const [celebrate, setCelebrate] = useState(null);
  const ICONS=["🎯","🏦","📱","🏖️","🚗","✈️","💍","🏠","📚","💻"];

  const addGoal = () => {
    if (!newGoal.name||!newGoal.target) return;
    setGoals(p=>[...p,{ id:Date.now(),...newGoal,target:parseInt(newGoal.target),saved:0,color:t.accent }]);
    setNewGoal({ name:"",target:"",deadline:"",icon:"🎯" }); setShowAdd(false);
  };
  const log = (goal) => {
    const amt=parseInt(logAmt); if (!amt) return;
    setGoals(p=>p.map(g=>{
      if (g.id!==goal.id) return g;
      const newS=Math.min(g.saved+amt,g.target);
      if (newS>=g.target) setCelebrate(g);
      return { ...g, saved:newS };
    }));
    setUser(u=>({ ...u, xp:u.xp+50 }));
    setLogAmt(""); setLogId(null);
  };
  const days = (d) => Math.max(0,Math.ceil((new Date(d)-new Date())/(864e5)));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:22, fontWeight:800, color:t.text }}>Savings Goals</div>
        <button onClick={()=>setShowAdd(true)} style={{
          padding:"10px 16px", borderRadius:12, border:"none",
          background:`linear-gradient(135deg,${t.accent},${t.purple})`,
          color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer"
        }}>+ New Goal</button>
      </div>
      <div style={{ background:"linear-gradient(135deg,#1A3A2A,#0D2418)", borderRadius:20, padding:"20px 24px", border:`1px solid ${t.green}33` }}>
        <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12 }}>Total Savings</div>
        <div style={{ color:t.green, fontSize:32, fontWeight:800, marginTop:4 }}>{fullINR(goals.reduce((s,g)=>s+g.saved,0))}</div>
        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginTop:2 }}>across {goals.length} goals</div>
      </div>
      {showAdd && (
        <Card t={t}>
          <div style={{ fontWeight:700, color:t.text, marginBottom:14 }}>New Goal</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
            {ICONS.map(ic=>(
              <button key={ic} onClick={()=>setNewGoal(p=>({...p,icon:ic}))} style={{
                width:38,height:38,borderRadius:10,border:`1px solid ${newGoal.icon===ic?t.accent:t.border}`,
                background:newGoal.icon===ic?`${t.accent}22`:t.surface,fontSize:18,cursor:"pointer"
              }}>{ic}</button>
            ))}
          </div>
          <input placeholder="Goal name" value={newGoal.name} onChange={e=>setNewGoal(p=>({...p,name:e.target.value}))}
            style={{ width:"100%",padding:10,borderRadius:8,border:`1px solid ${t.border}`,background:t.surface,color:t.text,marginBottom:10,boxSizing:"border-box" }} />
          <input type="number" placeholder="Target (₹)" value={newGoal.target} onChange={e=>setNewGoal(p=>({...p,target:e.target.value}))}
            style={{ width:"100%",padding:10,borderRadius:8,border:`1px solid ${t.border}`,background:t.surface,color:t.text,marginBottom:10,boxSizing:"border-box" }} />
          <input type="date" value={newGoal.deadline} onChange={e=>setNewGoal(p=>({...p,deadline:e.target.value}))}
            style={{ width:"100%",padding:10,borderRadius:8,border:`1px solid ${t.border}`,background:t.surface,color:t.text,marginBottom:14,boxSizing:"border-box" }} />
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={addGoal} style={{ flex:1,padding:10,borderRadius:8,border:"none",background:t.green,color:"#fff",fontWeight:700,cursor:"pointer" }}>Create</button>
            <button onClick={()=>setShowAdd(false)} style={{ flex:1,padding:10,borderRadius:8,border:`1px solid ${t.border}`,background:"transparent",color:t.textMuted,cursor:"pointer" }}>Cancel</button>
          </div>
        </Card>
      )}
      {goals.map(goal=>{
        const pct=Math.round((goal.saved/goal.target)*100);
        const d=days(goal.deadline);
        const daily=d>0?Math.ceil((goal.target-goal.saved)/d):0;
        return (
          <Card key={goal.id} t={t}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
              <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                <div style={{ width:48,height:48,borderRadius:14,background:`${goal.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24 }}>{goal.icon}</div>
                <div>
                  <div style={{ fontWeight:700,fontSize:15,color:t.text }}>{goal.name}</div>
                  <div style={{ color:t.textMuted,fontSize:12 }}>{d>0?`${d} days left`:"Deadline passed"}</div>
                </div>
              </div>
              <div style={{ fontWeight:800,fontSize:22,color:goal.color }}>{pct}%</div>
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
              <span style={{ fontSize:13,color:t.textMuted }}>Saved: <strong style={{ color:t.text }}>{fullINR(goal.saved)}</strong></span>
              <span style={{ fontSize:13,color:t.textMuted }}>Target: <strong style={{ color:t.text }}>{fullINR(goal.target)}</strong></span>
            </div>
            <div style={{ background:t.border,borderRadius:99,height:8,overflow:"hidden",marginBottom:8 }}>
              <div style={{ width:pct+"%",height:"100%",borderRadius:99,background:`linear-gradient(90deg,${goal.color},${goal.color}aa)`,transition:"width 0.6s ease" }} />
            </div>
            {daily>0 && <div style={{ color:t.textMuted,fontSize:12,marginBottom:12 }}>Save {fullINR(daily)}/day to hit goal on time</div>}
            {logId===goal.id ? (
              <div style={{ display:"flex",gap:8 }}>
                <input type="number" placeholder="₹ amount" value={logAmt} onChange={e=>setLogAmt(e.target.value)}
                  style={{ flex:1,padding:10,borderRadius:8,border:`1px solid ${t.border}`,background:t.surface,color:t.text }} />
                <button onClick={()=>log(goal)} style={{ padding:"10px 16px",borderRadius:8,border:"none",background:t.green,color:"#fff",fontWeight:700,cursor:"pointer" }}>+</button>
                <button onClick={()=>setLogId(null)} style={{ padding:"10px 12px",borderRadius:8,border:`1px solid ${t.border}`,background:"transparent",color:t.textMuted,cursor:"pointer" }}>✕</button>
              </div>
            ) : (
              <button onClick={()=>setLogId(goal.id)} style={{
                width:"100%",padding:10,borderRadius:10,border:`1px solid ${goal.color}44`,
                background:`${goal.color}11`,color:goal.color,fontWeight:700,cursor:"pointer"
              }}>+ Log Savings</button>
            )}
          </Card>
        );
      })}
      {celebrate && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <Confetti />
          <Card t={t} style={{ textAlign:"center",maxWidth:320,zIndex:1001 }}>
            <div style={{ fontSize:64 }}>🎉</div>
            <div style={{ fontWeight:800,fontSize:22,color:t.text,marginTop:10 }}>Goal Achieved!</div>
            <div style={{ color:t.accent,fontSize:30,fontWeight:800,marginTop:8 }}>{celebrate.icon} {celebrate.name}</div>
            <div style={{ color:t.green,fontSize:16,marginTop:4 }}>+500 XP • Badge Unlocked!</div>
            <button onClick={()=>{ setCelebrate(null); setUser(u=>({...u,xp:u.xp+500})); }} style={{
              width:"100%",marginTop:16,padding:14,borderRadius:12,border:"none",
              background:`linear-gradient(135deg,${t.accent},${t.purple})`,color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer"
            }}>Claim Reward 🎁</button>
          </Card>
        </div>
      )}
    </div>
  );
}

// ── LEARN ─────────────────────────────────────────────────────────────────────
const TYPE_META = {
  awareness: { label:"Awareness", color:"#4F9EF8", icon:"💡" },
  problem:   { label:"Problem",   color:"#F87171", icon:"⚠️" },
  solution:  { label:"Solution",  color:"#34D399", icon:"✅" },
  impact:    { label:"Impact",    color:"#A78BFA", icon:"🚀" },
};

function LearnSection({ t, setUser }) {
  const [sel, setSel] = useState(null);
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState("cards"); // "cards" | "quiz"
  const [completed, setCompleted] = useState({});
  const topic = LEARN_TOPICS.find(tp=>tp.id===sel);

  const handleQuizComplete = (xp) => {
    setCompleted(p=>({...p,[sel]:{ xp, done:true }}));
    setUser(u=>({ ...u, xp:u.xp+xp }));
    setSel(null); setIdx(0); setMode("cards");
  };

  if (sel && topic) {
    if (mode==="quiz") return (
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
        <button onClick={()=>setMode("cards")} style={{
          display:"flex", alignItems:"center", gap:8, background:"transparent", border:"none",
          color:t.accent, fontWeight:700, cursor:"pointer", padding:0, fontSize:14
        }}>← Back to Lesson</button>
        <QuizSection topic={topic} onComplete={handleQuizComplete} t={t} />
      </div>
    );

    const card = topic.cards[idx];
    const meta = TYPE_META[card.type];
    const pct = ((idx+1)/topic.cards.length)*100;
    const allCardsDone = idx===topic.cards.length-1;

    return (
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={()=>{ setSel(null);setIdx(0);setMode("cards"); }} style={{
            width:36,height:36,borderRadius:"50%",border:`1px solid ${t.border}`,
            background:t.surface,color:t.text,cursor:"pointer",fontSize:16
          }}>←</button>
          <div>
            <div style={{ fontWeight:700,color:t.text }}>{topic.title}</div>
            <div style={{ fontSize:12,color:t.textMuted }}>{idx+1}/{topic.cards.length} cards • then Quiz</div>
          </div>
        </div>
        <div style={{ background:t.border,borderRadius:99,height:4 }}>
          <div style={{ width:pct+"%",height:"100%",borderRadius:99,background:topic.color,transition:"width 0.3s" }} />
        </div>

        {/* Card type badge */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {topic.cards.map((c,i)=>(
            <div key={i} onClick={()=>setIdx(i)} style={{
              padding:"4px 10px", borderRadius:20, cursor:"pointer",
              background: i===idx ? `${TYPE_META[c.type].color}33` : "transparent",
              border:`1px solid ${i===idx?TYPE_META[c.type].color:t.border}`,
              color: i===idx ? TYPE_META[c.type].color : t.textFaint, fontSize:10, fontWeight:600,
              transition:"all 0.2s"
            }}>{TYPE_META[c.type].icon}</div>
          ))}
        </div>

        <div style={{ minHeight:300, background:t.card, borderRadius:20, padding:"32px 24px",
          border:`1px solid ${meta.color}55`, display:"flex", flexDirection:"column",
          boxShadow:`0 20px 60px ${meta.color}15` }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginBottom:20,
            background:`${meta.color}22`, borderRadius:99, padding:"6px 14px", alignSelf:"flex-start" }}>
            <span style={{ fontSize:14 }}>{meta.icon}</span>
            <span style={{ fontSize:11, fontWeight:700, color:meta.color }}>{meta.label}</span>
          </div>
          <div style={{ fontSize:52, marginBottom:16, textAlign:"center" }}>{topic.icon}</div>
          <div style={{ fontWeight:800, fontSize:19, color:t.text, marginBottom:14, lineHeight:1.3, textAlign:"center" }}>{card.title}</div>
          <div style={{ color:t.textMuted, fontSize:14, lineHeight:1.8, textAlign:"center", flex:1 }}>{card.content}</div>
        </div>

        <div style={{ display:"flex", gap:12 }}>
          <button onClick={()=>idx>0&&setIdx(i=>i-1)} disabled={idx===0} style={{
            flex:1, padding:14, borderRadius:14, border:`1px solid ${t.border}`,
            background:t.surface, color:t.text, fontSize:18, cursor:"pointer", opacity:idx===0?0.4:1
          }}>← Prev</button>
          <button onClick={()=>{ if (!allCardsDone) setIdx(i=>i+1); else setMode("quiz"); }} style={{
            flex:2, padding:14, borderRadius:14, border:"none",
            background: allCardsDone ? `linear-gradient(135deg,${t.amber},${t.pink})` : `linear-gradient(135deg,${topic.color},${t.purple})`,
            color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer"
          }}>{allCardsDone ? "📝 Take Quiz →" : "Next →"}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ fontSize:22, fontWeight:800, color:t.text }}>Learn</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {Object.entries(TYPE_META).map(([k,v])=>(
          <div key={k} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 12px",
            borderRadius:99, background:`${v.color}22`, color:v.color, fontSize:11, fontWeight:700 }}>
            {v.icon} {v.label}
          </div>
        ))}
        <div style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 12px",
          borderRadius:99, background:`${t.amber}22`, color:t.amber, fontSize:11, fontWeight:700 }}>
          📝 Quiz + XP
        </div>
      </div>
      {LEARN_TOPICS.map(tp=>(
        <Card key={tp.id} t={t} hover onClick={()=>{ setSel(tp.id);setIdx(0);setMode("cards"); }} style={{ borderLeft:`3px solid ${tp.color}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", gap:14, alignItems:"center" }}>
              <div style={{ width:52, height:52, borderRadius:14, background:`${tp.color}22`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{tp.icon}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:t.text }}>{tp.title}</div>
                <div style={{ color:t.textMuted, fontSize:12, marginTop:2 }}>
                  {tp.cards.length} cards — {tp.cards.filter(c=>c.type==="awareness").length} awareness · 1 problem · 1 solution · 1 impact
                </div>
                <div style={{ color:t.textMuted, fontSize:12 }}>{tp.quiz.length} question quiz • up to 75 XP</div>
                {completed[tp.id] && (
                  <div style={{ display:"flex", gap:6, marginTop:6 }}>
                    <Badge label="✓ Completed" color={t.green} bg={`${t.green}22`} />
                    <Badge label={`+${completed[tp.id].xp} XP earned`} color={t.amber} bg={`${t.amber}22`} />
                  </div>
                )}
              </div>
            </div>
            <div style={{ color:tp.color, fontSize:22 }}>→</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ── REWARDS ───────────────────────────────────────────────────────────────────
function RewardsSection({ user, setUser, t }) {
  const [tab, setTab] = useState("coupons");
  const [myCoupons, setMyCoupons] = useState([]);
  const [history, setHistory] = useState([]);
  const [preview, setPreview] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const level = Math.floor(user.xp/1000)+1;
  const badge = getCurrentBadge(level);

  const buyCoupon = (coupon) => {
    if (user.xp < coupon.xpCost) return;
    setUser(u=>({ ...u, xp:u.xp-coupon.xpCost }));
    setMyCoupons(p=>[...p,{ ...coupon, status:"available", earnedAt:new Date().toISOString() }]);
    setConfirm(null);
  };
  const useCoupon = (coupon) => {
    setMyCoupons(p=>p.filter(c=>c.id!==coupon.id));
    setHistory(p=>[...p,{ ...coupon, usedAt:new Date().toISOString() }]);
    setPreview(null);
  };
  const alreadyOwned = (id) => myCoupons.some(c=>c.id===id) || history.some(c=>c.id===id);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ background:"linear-gradient(135deg,#2D1B6E,#0D0720)", borderRadius:24, padding:"24px",
        border:`1px solid ${t.purple}44`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12 }}>Total XP</div>
          <div style={{ color:t.purple, fontSize:40, fontWeight:900 }}>{user.xp.toLocaleString("en-IN")}</div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, marginTop:4 }}>Level {level} • {badge.label}</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:48 }}>{badge.label.split(" ")[1]}</div>
          <div style={{ color:t.purple, fontSize:12, fontWeight:700, marginTop:4 }}>Current Badge</div>
        </div>
      </div>
      <Card t={t} style={{ padding:"16px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:13, color:t.textMuted }}>Level {level}</span>
          <span style={{ fontSize:13, color:t.accent }}>{1000-(user.xp%1000)} XP to Level {level+1}</span>
        </div>
        <XPBar xp={user.xp} t={t} compact />
      </Card>
      <div style={{ display:"flex", gap:6, background:t.surface, padding:4, borderRadius:12 }}>
        {[{ id:"coupons",label:"🏷️ Coupons" },{ id:"my",label:"🎟️ My Coupons" },{ id:"history",label:"📜 History" }].map(item=>(
          <button key={item.id} onClick={()=>setTab(item.id)} style={{
            flex:1, padding:"9px 4px", borderRadius:10, border:"none", cursor:"pointer",
            background: tab===item.id ? `linear-gradient(135deg,${t.accent},${t.purple})` : "transparent",
            color: tab===item.id ? "#fff" : t.textMuted, fontWeight:600, fontSize:12
          }}>{item.label}</button>
        ))}
      </div>
      {tab==="coupons" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ color:t.textMuted, fontSize:13, textAlign:"center" }}>
            You have <strong style={{ color:t.accent }}>{user.xp.toLocaleString()} XP</strong>
          </div>
          {SHOP_COUPONS.map(c=>{
            const owned = alreadyOwned(c.id);
            const canAfford = user.xp >= c.xpCost;
            return (
              <div key={c.id} style={{ background:t.card, border:`1px solid ${owned?t.border:c.color+"44"}`,
                borderRadius:16, padding:"16px 20px", opacity:owned?0.6:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ width:48,height:48,borderRadius:14,background:`${c.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontWeight:700,fontSize:14,color:t.text }}>{c.title}</div>
                      <div style={{ color:t.textMuted,fontSize:12,marginTop:2 }}>{c.brand} • {c.category}</div>
                      <div style={{ fontWeight:800,color:canAfford&&!owned?t.purple:t.textFaint,fontSize:14,marginTop:4 }}>⚡ {c.xpCost.toLocaleString()} XP</div>
                    </div>
                  </div>
                  {owned
                    ? <Badge label="Owned" color={t.green} bg={`${t.green}22`} />
                    : <button onClick={()=>canAfford&&setConfirm(c)} style={{
                        padding:"8px 16px",borderRadius:10,border:"none",cursor:canAfford?"pointer":"not-allowed",
                        background:canAfford?`linear-gradient(135deg,${c.color},${t.purple})`:t.border,
                        color:"#fff",fontWeight:700,fontSize:13,opacity:canAfford?1:0.5
                      }}>Redeem</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {tab==="my" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {myCoupons.length===0 && (
            <div style={{ textAlign:"center",padding:48,color:t.textMuted }}>
              <div style={{ fontSize:48 }}>🎟️</div>
              <div style={{ marginTop:10 }}>No coupons yet. Spend XP in the Coupons tab!</div>
            </div>
          )}
          {myCoupons.map((c,i)=>(
            <div key={i} onClick={()=>setPreview(c)} style={{
              background:`linear-gradient(135deg,${c.color}22,${c.color}11)`,
              border:`1px solid ${c.color}44`,borderRadius:16,padding:"16px 20px",cursor:"pointer"
            }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                  <div style={{ fontSize:28 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontWeight:700,fontSize:14,color:t.text }}>{c.title}</div>
                    <div style={{ color:t.textMuted,fontSize:12 }}>{c.brand}</div>
                  </div>
                </div>
                <Badge label="Tap to Use" color={c.color} bg={`${c.color}22`} />
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==="history" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {history.length===0 && (
            <div style={{ textAlign:"center",padding:48,color:t.textMuted }}>
              <div style={{ fontSize:48 }}>📜</div><div style={{ marginTop:10 }}>No coupon history yet!</div>
            </div>
          )}
          {history.map((c,i)=>(
            <Card key={i} t={t} style={{ padding:"14px 16px", opacity:0.7 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                  <div style={{ fontSize:24 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontWeight:600,fontSize:13,color:t.text }}>{c.title}</div>
                    <div style={{ fontSize:11,color:t.textMuted }}>Used {new Date(c.usedAt).toLocaleDateString("en-IN")} • {c.brand}</div>
                  </div>
                </div>
                <Badge label="Used ✓" color={t.textFaint} bg={t.border} />
              </div>
            </Card>
          ))}
        </div>
      )}
      {preview && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <Card t={t} style={{ maxWidth:340,width:"100%",textAlign:"center" }}>
            <div style={{ fontSize:48,marginBottom:8 }}>{preview.icon}</div>
            <div style={{ fontWeight:800,fontSize:20,color:t.text }}>{preview.title}</div>
            <div style={{ color:t.textMuted,fontSize:14,marginTop:4 }}>{preview.brand}</div>
            <div style={{ background:`${t.accent}11`,border:`2px dashed ${t.accent}`,borderRadius:12,padding:"14px 20px",margin:"16px 0" }}>
              <div style={{ color:t.textMuted,fontSize:12 }}>Coupon Code</div>
              <div style={{ color:t.accent,fontWeight:900,fontSize:26,letterSpacing:3 }}>{preview.code}</div>
            </div>
            <button onClick={()=>useCoupon(preview)} style={{
              width:"100%",padding:12,borderRadius:10,border:"none",marginBottom:10,
              background:`linear-gradient(135deg,${t.green},#059669)`,color:"#fff",fontWeight:700,cursor:"pointer"
            }}>Mark as Used ✓</button>
            <button onClick={()=>setPreview(null)} style={{
              width:"100%",padding:12,borderRadius:10,border:`1px solid ${t.border}`,background:"transparent",color:t.textMuted,cursor:"pointer"
            }}>Close</button>
          </Card>
        </div>
      )}
      {confirm && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <Card t={t} style={{ maxWidth:320,width:"100%",textAlign:"center" }}>
            <div style={{ fontSize:48 }}>{confirm.icon}</div>
            <div style={{ fontWeight:800,fontSize:18,color:t.text,marginTop:10 }}>Redeem Coupon?</div>
            <div style={{ color:t.textMuted,fontSize:14,margin:"8px 0 20px" }}>
              Spend <strong style={{ color:t.purple }}>⚡ {confirm.xpCost.toLocaleString()} XP</strong> for {confirm.title}?
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={()=>buyCoupon(confirm)} style={{
                flex:2,padding:12,borderRadius:10,border:"none",
                background:`linear-gradient(135deg,${t.accent},${t.purple})`,color:"#fff",fontWeight:700,cursor:"pointer"
              }}>Confirm ✓</button>
              <button onClick={()=>setConfirm(null)} style={{
                flex:1,padding:12,borderRadius:10,border:`1px solid ${t.border}`,background:"transparent",color:t.textMuted,cursor:"pointer"
              }}>Cancel</button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ── GOOGLE BUTTON ─────────────────────────────────────────────────────────────
function GoogleBtn({ label, t, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ width:"100%", padding:"13px 16px", borderRadius:12, border:`1.5px solid ${hov?"#4285F4":t.border}`,
        background: hov ? "#4285F410" : t.surface, cursor:"pointer", display:"flex", alignItems:"center",
        justifyContent:"center", gap:10, transition:"all 0.2s", marginBottom:14 }}>
      {/* Google G SVG */}
      <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
      </svg>
      <span style={{ fontWeight:700, fontSize:14, color:t.text }}>{label}</span>
    </button>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function AuthScreen({ onLogin, t }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [err, setErr] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleAuth = () => {
    setGoogleLoading(true);
    // Simulate Google OAuth popup (in production, use Firebase/Google Identity)
    setTimeout(()=>{
      const mockGoogleUser = {
        ...INITIAL_USER,
        name: mode==="login" ? "Arjun Sharma" : (form.name || "Google User"),
        username: "google_user",
        avatar: "G",
        xp: mode==="login" ? INITIAL_USER.xp : 0,
        balance: mode==="login" ? INITIAL_USER.balance : 50000,
      };
      setGoogleLoading(false);
      onLogin(mockGoogleUser);
    }, 1800);
  };

  const submit = () => {
    if (mode==="login") {
      // allow login by email or username
      const isDemo = (form.email===INITIAL_USER.username||form.email==="arjun@example.com") && form.password===INITIAL_USER.password;
      if (isDemo) onLogin(INITIAL_USER);
      else setErr("Invalid email/username or password");
    } else {
      if (!form.name||!form.email||!form.password) { setErr("All fields required"); return; }
      if (form.password.length<6) { setErr("Password must be at least 6 characters"); return; }
      onLogin({ ...INITIAL_USER, name:form.name, username:form.email.split("@")[0], xp:0, balance:50000 });
    }
  };

  const divider = (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"4px 0 14px" }}>
      <div style={{ flex:1, height:1, background:t.border }} />
      <span style={{ color:t.textFaint, fontSize:12, fontWeight:500 }}>or continue with email</span>
      <div style={{ flex:1, height:1, background:t.border }} />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:72,height:72,borderRadius:22,background:`linear-gradient(135deg,${t.accent},${t.purple})`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 16px",
            boxShadow:`0 8px 32px ${t.accentGlow}` }}>👛</div>
          <div style={{ fontSize:32,fontWeight:900,color:t.text,letterSpacing:-1 }}>WalletXP</div>
          <div style={{ color:t.textMuted,fontSize:14,marginTop:4 }}>Level up your finances</div>
        </div>

        <Card t={t} style={{ padding:"28px 24px" }}>
          {/* Tab switcher */}
          <div style={{ display:"flex",background:t.surface,borderRadius:12,padding:4,marginBottom:22 }}>
            {["login","signup"].map(m=>(
              <button key={m} onClick={()=>{ setMode(m);setErr("");setForm({name:"",email:"",password:""}); }} style={{
                flex:1,padding:10,borderRadius:10,border:"none",cursor:"pointer",
                background:mode===m?`linear-gradient(135deg,${t.accent},${t.purple})`:"transparent",
                color:mode===m?"#fff":t.textMuted,fontWeight:700,textTransform:"capitalize"
              }}>{m==="login"?"Sign In":"Sign Up"}</button>
            ))}
          </div>

          {/* Google button */}
          {googleLoading
            ? <div style={{ textAlign:"center",padding:"14px 0 20px",color:t.textMuted,fontSize:13 }}>
                <div style={{ fontSize:28,marginBottom:6,animation:"spin 1s linear infinite",display:"inline-block" }}>⟳</div>
                <div>Connecting with Google...</div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            : <GoogleBtn label={mode==="login"?"Sign in with Google":"Sign up with Google"} t={t} onClick={handleGoogleAuth} />
          }

          {divider}

          {/* Email form */}
          {mode==="signup" && (
            <input placeholder="Full Name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
              style={{ width:"100%",padding:13,borderRadius:12,border:`1px solid ${t.border}`,background:t.surface,color:t.text,marginBottom:10,boxSizing:"border-box",fontSize:14 }} />
          )}
          <input placeholder={mode==="login"?"Email or Username":"Email address"} value={form.email}
            onChange={e=>setForm(p=>({...p,email:e.target.value}))}
            style={{ width:"100%",padding:13,borderRadius:12,border:`1px solid ${t.border}`,background:t.surface,color:t.text,marginBottom:10,boxSizing:"border-box",fontSize:14 }} />
          <input placeholder="Password" type="password" value={form.password}
            onChange={e=>setForm(p=>({...p,password:e.target.value}))}
            onKeyDown={e=>e.key==="Enter"&&submit()}
            style={{ width:"100%",padding:13,borderRadius:12,border:`1px solid ${t.border}`,background:t.surface,color:t.text,marginBottom:14,boxSizing:"border-box",fontSize:14 }} />

          {err && <div style={{ color:t.red,fontSize:13,marginBottom:10,textAlign:"center",padding:"8px 12px",background:`${t.red}11`,borderRadius:8 }}>{err}</div>}
          {mode==="login" && <div style={{ color:t.textFaint,fontSize:12,textAlign:"center",marginBottom:12 }}>Demo: arjun / 1234</div>}

          <button onClick={submit} style={{
            width:"100%",padding:14,borderRadius:12,border:"none",
            background:`linear-gradient(135deg,${t.accent},${t.purple})`,
            color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:`0 4px 20px ${t.accentGlow}`
          }}>{mode==="login"?"Sign In →":"Create Account →"}</button>

          {mode==="login" && (
            <div style={{ textAlign:"center",marginTop:14 }}>
              <span style={{ color:t.textMuted,fontSize:13 }}>Don't have an account? </span>
              <button onClick={()=>{ setMode("signup");setErr(""); }} style={{
                background:"none",border:"none",color:t.accent,fontWeight:700,fontSize:13,cursor:"pointer",padding:0
              }}>Sign up</button>
            </div>
          )}
          {mode==="signup" && (
            <div style={{ textAlign:"center",marginTop:14 }}>
              <span style={{ color:t.textMuted,fontSize:13 }}>Already have an account? </span>
              <button onClick={()=>{ setMode("login");setErr(""); }} style={{
                background:"none",border:"none",color:t.accent,fontWeight:700,fontSize:13,cursor:"pointer",padding:0
              }}>Sign in</button>
            </div>
          )}
        </Card>

        <div style={{ textAlign:"center",marginTop:16,color:t.textFaint,fontSize:11 }}>
          By continuing, you agree to WalletXP's Terms & Privacy Policy
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function WalletXP() {
  const [darkMode, setDarkMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("home");
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [fixedExpenses, setFixedExpenses] = useState(INITIAL_FIXED);
  const [goals, setGoals] = useState(SAVINGS_GOALS);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = THEMES[darkMode?"dark":"light"];

  const NAV = [
    { id:"home", label:"Home", icon:"🏠" },
    { id:"budget", label:"Budget", icon:"💳" },
    { id:"challenges", label:"Challenges", icon:"⚡" },
    { id:"savings", label:"Savings", icon:"🏦" },
    { id:"learn", label:"Learn", icon:"📚" },
    { id:"rewards", label:"Rewards", icon:"🏅" },
  ];

  if (!loggedIn) return <AuthScreen onLogin={u=>{ setUser(u);setLoggedIn(true); }} t={t} />;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:t.bg, fontFamily:"'DM Sans','Inter',sans-serif", color:t.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(128,128,128,0.2); border-radius:2px; }
        input,select,button { font-family:'DM Sans',sans-serif; }
      `}</style>

      {sidebarOpen && <div onClick={()=>setSidebarOpen(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:90 }} />}

      {/* Sidebar */}
      <div style={{ width:240, background:t.sidebarBg, borderRight:`1px solid ${t.border}`,
        display:"flex", flexDirection:"column", padding:"24px 16px",
        position:"fixed", top:0, left:0, height:"100vh", zIndex:100,
        transform: sidebarOpen?"translateX(0)":"translateX(-100%)",
        transition:"transform 0.3s cubic-bezier(.4,0,.2,1)", overflowY:"auto" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:32,paddingLeft:4 }}>
          <div style={{ width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${t.accent},${t.purple})`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>👛</div>
          <span style={{ fontWeight:900,fontSize:22,letterSpacing:-0.5,color:t.text }}>WalletXP</span>
        </div>
        {user && (
          <div style={{ background:t.card,borderRadius:14,padding:14,marginBottom:24,border:`1px solid ${t.border}` }}>
            <div style={{ display:"flex",gap:10,alignItems:"center",marginBottom:10 }}>
              <div style={{ width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${t.accent},${t.purple})`,
                display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:"#fff" }}>{user.avatar}</div>
              <div>
                <div style={{ fontWeight:700,fontSize:13,color:t.text }}>{user.name}</div>
                <div style={{ fontSize:11,color:t.accent }}>Level {Math.floor(user.xp/1000)+1} • {user.xp.toLocaleString()} XP</div>
              </div>
            </div>
            <XPBar xp={user.xp} t={t} compact />
          </div>
        )}
        <nav style={{ flex:1 }}>
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>{ setSection(item.id);setSidebarOpen(false); }} style={{
              width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
              borderRadius:12,border:"none",cursor:"pointer",marginBottom:4,textAlign:"left",
              background: section===item.id?`linear-gradient(135deg,${t.accent}22,${t.purple}11)`:"transparent",
              color: section===item.id?t.accent:t.textMuted,
              fontWeight: section===item.id?700:500, fontSize:14,
              borderLeft: section===item.id?`3px solid ${t.accent}`:"3px solid transparent"
            }}>
              <span style={{ fontSize:18 }}>{item.icon}</span>{item.label}
              {item.id==="challenges"&&activeChallenges.length>0&&(
                <span style={{ marginLeft:"auto",background:t.red,color:"#fff",borderRadius:"50%",
                  width:18,height:18,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800 }}>
                  {activeChallenges.length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div style={{ borderTop:`1px solid ${t.border}`,paddingTop:16,marginTop:16 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
            <span style={{ fontSize:13,color:t.textMuted }}>Dark Mode</span>
            <button onClick={()=>setDarkMode(d=>!d)} style={{
              width:44,height:24,borderRadius:99,border:"none",cursor:"pointer",
              background:darkMode?t.accent:t.border,position:"relative",transition:"background 0.2s"
            }}>
              <div style={{ width:18,height:18,borderRadius:"50%",background:"#fff",
                position:"absolute",top:3,left:darkMode?23:3,transition:"left 0.2s" }} />
            </button>
          </div>
          <button onClick={()=>setLoggedIn(false)} style={{
            width:"100%",padding:"10px 14px",borderRadius:12,border:`1px solid ${t.border}`,
            background:"transparent",color:t.red,fontWeight:600,cursor:"pointer",fontSize:13
          }}>🚪 Sign Out</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",minHeight:"100vh" }}>
        <div style={{ height:60,background:t.glass,backdropFilter:"blur(20px)",borderBottom:`1px solid ${t.border}`,
          display:"flex",alignItems:"center",padding:"0 20px",gap:14,position:"sticky",top:0,zIndex:80 }}>
          <button onClick={()=>setSidebarOpen(o=>!o)} style={{
            width:36,height:36,borderRadius:10,border:`1px solid ${t.border}`,
            background:t.surface,color:t.text,cursor:"pointer",fontSize:18
          }}>☰</button>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800,fontSize:16,color:t.text }}>
              {NAV.find(n=>n.id===section)?.icon} {NAV.find(n=>n.id===section)?.label}
            </div>
          </div>
          <span style={{ color:t.amber,fontSize:13,fontWeight:700 }}>🔥 {user?.streak}</span>
          <div style={{ height:32,padding:"0 12px",borderRadius:99,background:`${t.accent}15`,display:"flex",alignItems:"center" }}>
            <span style={{ color:t.accent,fontSize:12,fontWeight:700 }}>⚡ {user?.xp.toLocaleString()} XP</span>
          </div>
        </div>

        <div style={{ flex:1,padding:20,overflowY:"auto",maxWidth:680,width:"100%",margin:"0 auto" }}>
          {section==="home" && <HomeSection user={user} expenses={expenses} fixedExpenses={fixedExpenses} activeChallenges={activeChallenges} t={t} />}
          {section==="budget" && <BudgetSection user={user} setUser={setUser} expenses={expenses} setExpenses={setExpenses} fixedExpenses={fixedExpenses} setFixedExpenses={setFixedExpenses} t={t} />}
          {section==="challenges" && <ChallengesSection activeChallenges={activeChallenges} setActiveChallenges={setActiveChallenges} completedChallenges={completedChallenges} setCompletedChallenges={setCompletedChallenges} setUser={setUser} t={t} />}
          {section==="savings" && <SavingsSection goals={goals} setGoals={setGoals} setUser={setUser} t={t} />}
          {section==="learn" && <LearnSection t={t} setUser={setUser} />}
          {section==="rewards" && <RewardsSection user={user} setUser={setUser} t={t} />}
        </div>

        <div style={{ height:68,background:t.glass,backdropFilter:"blur(20px)",borderTop:`1px solid ${t.border}`,
          display:"flex",alignItems:"center",padding:"0 8px",position:"sticky",bottom:0 }}>
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>setSection(item.id)} style={{
              flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              padding:"8px 4px",border:"none",background:"transparent",cursor:"pointer",
              color:section===item.id?t.accent:t.textFaint,transition:"color 0.2s"
            }}>
              <span style={{ fontSize:section===item.id?22:20,transition:"font-size 0.2s" }}>{item.icon}</span>
              <span style={{ fontSize:9,fontWeight:section===item.id?700:500 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
