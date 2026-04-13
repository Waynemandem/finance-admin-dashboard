import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const mockCustomers = [
  { id: 1, name: "Marcus J. Webb",  email: "m.webb@email.com",       phone: "+1 555 201 4891", joined: "12 Jan 2024", avatar: "MW" },
  { id: 2, name: "Priya Anand",     email: "priya.anand@email.com",  phone: "+1 555 308 7723", joined: "03 Feb 2024", avatar: "PA" },
  { id: 3, name: "David Okafor",    email: "d.okafor@email.com",     phone: "+1 555 419 5541", joined: "18 Mar 2024", avatar: "DO" },
  { id: 4, name: "Sofia Reyes",     email: "sofia.r@email.com",      phone: "+1 555 527 8834", joined: "01 Apr 2024", avatar: "SR" },
  { id: 5, name: "Ethan Blackwell", email: "e.blackwell@email.com",  phone: "+1 555 634 2210", joined: "22 Apr 2024", avatar: "EB" },
  { id: 6, name: "Nadia Fontaine",  email: "n.fontaine@email.com",   phone: "+1 555 741 9963", joined: "15 May 2024", avatar: "NF" },
];

const mockLoans = [
  { id: "LN-0041", customerId: 1, customer: "Marcus J. Webb",  amount: 12500, repaid: 8750, issued: "14 Jan 2024", due: "14 Jan 2025", status: "pending", purpose: "Business Expansion" },
  { id: "LN-0042", customerId: 2, customer: "Priya Anand",     amount:  5000, repaid: 5000, issued: "05 Feb 2024", due: "05 Aug 2024", status: "paid",    purpose: "Equipment Purchase" },
  { id: "LN-0043", customerId: 3, customer: "David Okafor",    amount: 20000, repaid: 4000, issued: "20 Mar 2024", due: "20 Mar 2025", status: "default", purpose: "Real Estate" },
  { id: "LN-0044", customerId: 4, customer: "Sofia Reyes",     amount:  7500, repaid: 7500, issued: "02 Apr 2024", due: "02 Oct 2024", status: "paid",    purpose: "Personal" },
  { id: "LN-0045", customerId: 5, customer: "Ethan Blackwell", amount: 15000, repaid: 9000, issued: "24 Apr 2024", due: "24 Apr 2025", status: "pending", purpose: "Inventory" },
  { id: "LN-0046", customerId: 6, customer: "Nadia Fontaine",  amount:  3000, repaid: 1000, issued: "17 May 2024", due: "17 Nov 2024", status: "default", purpose: "Education" },
  { id: "LN-0047", customerId: 1, customer: "Marcus J. Webb",  amount:  8000, repaid: 8000, issued: "01 Jun 2024", due: "01 Dec 2024", status: "paid",    purpose: "Vehicle" },
  { id: "LN-0048", customerId: 3, customer: "David Okafor",    amount: 11000, repaid: 2200, issued: "18 Jun 2024", due: "18 Jun 2025", status: "pending", purpose: "Renovation" },
];

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const themes = {
  light: {
    bg: "#f7f6f3", surface: "#ffffff", surfaceAlt: "#f0efe9",
    border: "#e5e3dc", borderStrong: "#ccc9be",
    text: "#1a1916", textSub: "#6b6860", textMuted: "#a09e96",
    accent: "#1a1916", accentText: "#f7f6f3",
    paid: "#2d7a4f", paidBg: "#edf7f1",
    pending: "#a06120", pendingBg: "#fdf4e7",
    def: "#b13030", defBg: "#fdf0f0",
  },
  dark: {
    bg: "#111110", surface: "#1c1c1a", surfaceAlt: "#242422",
    border: "#2e2e2b", borderStrong: "#3e3e3a",
    text: "#e8e6e1", textSub: "#8a8880", textMuted: "#5a5a56",
    accent: "#e8e6e1", accentText: "#111110",
    paid: "#4caf7d", paidBg: "rgba(76,175,125,0.1)",
    pending: "#d4924a", pendingBg: "rgba(212,146,74,0.1)",
    def: "#d46060", defBg: "rgba(212,96,96,0.1)",
  },
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, sw = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const I = {
  dash: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  cust: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  loan: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  plus: "M12 5v14M5 12h14",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z",
  del:  "M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
  srch: "M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  x:    "M18 6L6 18M6 6l12 12",
  chev: "M9 18l6-6-6-6",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const pill = (status, t) => {
  const m = {
    paid:    [t.paid,    t.paidBg,    "Paid"],
    pending: [t.pending, t.pendingBg, "Pending"],
    default: [t.def,     t.defBg,     "Default"],
  };
  const [color, bg, label] = m[status];
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 600,
      letterSpacing: "0.04em", padding: "3px 9px", borderRadius: 3 }}>
      {label}
    </span>
  );
};

const bar = (pct, t) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ flex: 1, height: 3, background: t.border, borderRadius: 2 }}>
      <div style={{ height: "100%", width: `${pct}%`,
        background: pct === 100 ? t.paid : t.textSub, borderRadius: 2 }} />
    </div>
    <span style={{ fontSize: 11, color: t.textMuted, minWidth: 28 }}>{pct}%</span>
  </div>
);

const inputSt = t => ({
  width: "100%", background: t.surfaceAlt, border: `1px solid ${t.border}`,
  borderRadius: 7, padding: "10px 12px", color: t.text, fontSize: 13,
  fontFamily: "inherit", outline: "none", boxSizing: "border-box", appearance: "none",
});

const ibtn = (t, danger = false) => ({
  background: "transparent", border: `1px solid ${t.border}`, borderRadius: 6,
  padding: "6px 8px", color: danger ? t.def : t.textMuted, cursor: "pointer",
  display: "flex", alignItems: "center",
});

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, t, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: 12, width: "100%", maxWidth: 480, padding: 32,
        boxShadow: "0 24px 48px rgba(0,0,0,0.12)", animation: "su .18s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: t.text,
            letterSpacing: "-0.01em", fontFamily: "'DM Serif Display',Georgia,serif" }}>
            {title}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none",
            color: t.textMuted, cursor: "pointer", display: "flex" }}>
            <Ico d={I.x} size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", opts, t }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 10, fontWeight: 600,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: t.textMuted, marginBottom: 7 }}>{label}</label>
      {opts
        ? <select value={value} onChange={e => onChange(e.target.value)}
            style={inputSt(t)}>
            {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        : <input type={type} value={value}
            onChange={e => onChange(e.target.value)} style={inputSt(t)} />}
    </div>
  );
}

function ModalBtns({ onCancel, onSave, label, t }) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
      <button onClick={onCancel} style={{ flex: 1, padding: 11, borderRadius: 7,
        fontSize: 13, fontWeight: 500, cursor: "pointer",
        background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.textSub }}>
        Cancel
      </button>
      <button onClick={onSave} style={{ flex: 1, padding: 11, borderRadius: 7,
        fontSize: 13, fontWeight: 600, cursor: "pointer",
        background: t.accent, border: "none", color: t.accentText }}>
        {label}
      </button>
    </div>
  );
}

// ─── TABLE HEADER CELL ────────────────────────────────────────────────────────
function Th({ children, t }) {
  return (
    <th style={{ textAlign: "left", fontSize: 10, fontWeight: 600,
      letterSpacing: "0.08em", textTransform: "uppercase", color: t.textMuted,
      paddingBottom: 12, borderBottom: `1px solid ${t.border}`,
      paddingRight: 20, whiteSpace: "nowrap" }}>
      {children}
    </th>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, t, accent }) {
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: 10, padding: "22px 24px" }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
        textTransform: "uppercase", color: t.textMuted, marginBottom: 14 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: accent || t.text,
        letterSpacing: "-0.03em", marginBottom: 8,
        fontFamily: "'DM Serif Display',Georgia,serif" }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: t.textMuted }}>{sub}</div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function Dashboard({ loans, customers, t }) {
  const total   = loans.reduce((s, l) => s + l.amount, 0);
  const repaid  = loans.reduce((s, l) => s + l.repaid, 0);
  const out     = total - repaid;
  const atRisk  = loans.filter(l => l.status === "default")
                       .reduce((s, l) => s + (l.amount - l.repaid), 0);
  const recent  = [...loans].reverse().slice(0, 5);
  const td = (s, extra = {}) => ({
    padding: "13px 20px 13px 0", borderBottom: `1px solid ${t.border}`,
    fontSize: s, color: t.text, ...extra
  });

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: t.text,
          letterSpacing: "-0.03em", fontFamily: "'DM Serif Display',Georgia,serif" }}>
          Overview
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: t.textMuted }}>
          {loans.length} loans · {customers.length} customers
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))",
        gap: 12, marginBottom: 24 }}>
        <StatCard label="Portfolio"   value={`$${(total/1000).toFixed(1)}k`}  sub="Total disbursed"                               t={t} />
        <StatCard label="Recovered"   value={`$${(repaid/1000).toFixed(1)}k`} sub={`${Math.round(repaid/total*100)}% recovery`}   t={t} accent={t.paid} />
        <StatCard label="Outstanding" value={`$${(out/1000).toFixed(1)}k`}    sub={`${loans.filter(l=>l.status==="pending").length} pending`} t={t} accent={t.pending} />
        <StatCard label="At Risk"     value={`$${(atRisk/1000).toFixed(1)}k`} sub={`${loans.filter(l=>l.status==="default").length} defaults`} t={t} accent={t.def} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 270px", gap: 12 }}>
        {/* Recent */}
        <div style={{ background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: 10, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: t.textSub,
            marginBottom: 18, letterSpacing: "0.01em" }}>Recent Activity</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th t={t}>ID</Th><Th t={t}>Customer</Th>
                <Th t={t}>Amount</Th><Th t={t}>Status</Th>
              </tr>
            </thead>
            <tbody>
              {recent.map(l => (
                <tr key={l.id}>
                  <td style={td(11, { color: t.textMuted })}>{l.id}</td>
                  <td style={td(13)}>{l.customer}</td>
                  <td style={td(13, { fontWeight: 600 })}>${l.amount.toLocaleString()}</td>
                  <td style={{ padding: "13px 0", borderBottom: `1px solid ${t.border}` }}>
                    {pill(l.status, t)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Health */}
        <div style={{ background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: 10, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: t.textSub, marginBottom: 18 }}>
            Health
          </div>
          {[
            { key: "paid",    label: "Paid",    color: t.paid },
            { key: "pending", label: "Pending", color: t.pending },
            { key: "default", label: "Default", color: t.def },
          ].map(s => {
            const n = loans.filter(l => l.status === s.key).length;
            const p = Math.round(n / loans.length * 100);
            return (
              <div key={s.key} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between",
                  marginBottom: 7 }}>
                  <span style={{ fontSize: 12, color: t.textSub }}>{s.label}</span>
                  <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>
                    {n} / {p}%
                  </span>
                </div>
                <div style={{ height: 3, background: t.border, borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${p}%`,
                    background: s.color, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 24, paddingTop: 20,
            borderTop: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: t.textMuted, marginBottom: 8 }}>
              Clients
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: t.text,
              letterSpacing: "-0.03em", fontFamily: "'DM Serif Display',Georgia,serif" }}>
              {customers.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CUSTOMERS PAGE ───────────────────────────────────────────────────────────
function Customers({ customers, setCustomers, loans, t }) {
  const [q, setQ]       = useState("");
  const [modal, setM]   = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const upd = v => setForm(p => ({ ...p, ...v }));

  const list = customers.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.email.toLowerCase().includes(q.toLowerCase())
  );

  const save = () => {
    if (!form.name.trim()) return;
    if (modal.mode === "add") {
      const av = form.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
      setCustomers(p => [...p, {
        id: Date.now(), ...form, avatar: av,
        joined: new Date().toLocaleDateString("en-GB",
          { day: "2-digit", month: "short", year: "numeric" }),
      }]);
    } else {
      setCustomers(p => p.map(c =>
        c.id === modal.data.id ? { ...c, ...form } : c
      ));
    }
    setM(null);
  };

  const td = (extra = {}) => ({
    padding: "13px 20px 13px 0", borderBottom: `1px solid ${t.border}`, ...extra
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: t.text,
            letterSpacing: "-0.03em",
            fontFamily: "'DM Serif Display',Georgia,serif" }}>Customers</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: t.textMuted }}>
            {customers.length} registered
          </p>
        </div>
        <button onClick={() => { setForm({ name: "", email: "", phone: "" }); setM({ mode: "add" }); }}
          style={{ display: "flex", alignItems: "center", gap: 7,
            background: t.accent, color: t.accentText, border: "none",
            borderRadius: 7, padding: "9px 16px", fontSize: 12,
            fontWeight: 600, cursor: "pointer" }}>
          <Ico d={I.plus} size={13} /> Add
        </button>
      </div>

      <div style={{ background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: 10, padding: 24 }}>
        <div style={{ position: "relative", marginBottom: 20 }}>
          <div style={{ position: "absolute", left: 12, top: "50%",
            transform: "translateY(-50%)", color: t.textMuted }}>
            <Ico d={I.srch} size={14} />
          </div>
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search customers…" style={{ ...inputSt(t), paddingLeft: 36 }} />
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <Th t={t}>Name</Th><Th t={t}>Email</Th><Th t={t}>Phone</Th>
              <Th t={t}>Joined</Th><Th t={t}>Loans</Th><Th t={t}></Th>
            </tr>
          </thead>
          <tbody>
            {list.map(c => (
              <tr key={c.id}
                onMouseEnter={e => e.currentTarget.style.background = t.surfaceAlt}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={td()}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%",
                      background: t.surfaceAlt, border: `1px solid ${t.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700, color: t.textSub, flexShrink: 0 }}>
                      {c.avatar}
                    </div>
                    <span style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>
                      {c.name}
                    </span>
                  </div>
                </td>
                <td style={td({ fontSize: 12, color: t.textMuted })}>{c.email}</td>
                <td style={td({ fontSize: 12, color: t.textMuted })}>{c.phone}</td>
                <td style={td({ fontSize: 12, color: t.textMuted })}>{c.joined}</td>
                <td style={td({ fontSize: 12, color: t.text, fontWeight: 600 })}>
                  {loans.filter(l => l.customerId === c.id).length}
                </td>
                <td style={{ padding: "13px 0", borderBottom: `1px solid ${t.border}` }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={ibtn(t)}
                      onClick={() => { setForm({ name: c.name, email: c.email, phone: c.phone }); setM({ mode: "edit", data: c }); }}>
                      <Ico d={I.edit} size={13} />
                    </button>
                    <button style={ibtn(t, true)}
                      onClick={() => { if (confirm("Delete customer?")) setCustomers(p => p.filter(x => x.id !== c.id)); }}>
                      <Ico d={I.del} size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && (
          <div style={{ textAlign: "center", padding: "40px 0",
            fontSize: 13, color: t.textMuted }}>No results.</div>
        )}
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "New Customer" : "Edit Customer"}
          onClose={() => setM(null)} t={t}>
          <Field label="Full Name"  value={form.name}  onChange={v => upd({ name: v })}  t={t} />
          <Field label="Email"      value={form.email} onChange={v => upd({ email: v })} type="email" t={t} />
          <Field label="Phone"      value={form.phone} onChange={v => upd({ phone: v })} t={t} />
          <ModalBtns onCancel={() => setM(null)} onSave={save}
            label={modal.mode === "add" ? "Add Customer" : "Save"} t={t} />
        </Modal>
      )}
    </div>
  );
}

// ─── LOANS PAGE ───────────────────────────────────────────────────────────────
function Loans({ loans, setLoans, customers, t }) {
  const [q, setQ]       = useState("");
  const [filter, setF]  = useState("all");
  const [modal, setM]   = useState(null);
  const [form, setForm] = useState({ customerId: "", amount: "", purpose: "", status: "pending", due: "" });
  const upd = v => setForm(p => ({ ...p, ...v }));

  const list = loans.filter(l => {
    const ms = l.customer.toLowerCase().includes(q.toLowerCase()) ||
               l.id.toLowerCase().includes(q.toLowerCase());
    return ms && (filter === "all" || l.status === filter);
  });

  const save = () => {
    const cust = customers.find(c =>
      c.id === Number(form.customerId) || c.id === form.customerId
    );
    if (!cust || !form.amount) return;
    if (modal.mode === "add") {
      setLoans(p => [...p, {
        id: `LN-${String(p.length + 41).padStart(4, "0")}`,
        customerId: cust.id, customer: cust.name,
        amount: Number(form.amount), repaid: 0,
        issued: new Date().toLocaleDateString("en-GB",
          { day: "2-digit", month: "short", year: "numeric" }),
        due: form.due, status: form.status, purpose: form.purpose,
      }]);
    } else {
      setLoans(p => p.map(l =>
        l.id === modal.data.id
          ? { ...l, status: form.status, purpose: form.purpose, due: form.due }
          : l
      ));
    }
    setM(null);
  };

  const tabs = ["all", "paid", "pending", "default"];
  const td = (extra = {}) => ({
    padding: "13px 20px 13px 0", borderBottom: `1px solid ${t.border}`, ...extra
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: t.text,
            letterSpacing: "-0.03em",
            fontFamily: "'DM Serif Display',Georgia,serif" }}>Loans</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: t.textMuted }}>
            {loans.length} records
          </p>
        </div>
        <button onClick={() => { setForm({ customerId: customers[0]?.id || "", amount: "", purpose: "", status: "pending", due: "" }); setM({ mode: "add" }); }}
          style={{ display: "flex", alignItems: "center", gap: 7,
            background: t.accent, color: t.accentText, border: "none",
            borderRadius: 7, padding: "9px 16px", fontSize: 12,
            fontWeight: 600, cursor: "pointer" }}>
          <Ico d={I.plus} size={13} /> New Loan
        </button>
      </div>

      <div style={{ background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: 10, padding: 24 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <div style={{ position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: t.textMuted }}>
              <Ico d={I.srch} size={14} />
            </div>
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search…" style={{ ...inputSt(t), paddingLeft: 36 }} />
          </div>
          <div style={{ display: "flex", border: `1px solid ${t.border}`,
            borderRadius: 7, overflow: "hidden" }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setF(tab)} style={{
                padding: "8px 14px", fontSize: 11, fontWeight: 500,
                border: "none", cursor: "pointer",
                background: filter === tab ? t.surfaceAlt : "transparent",
                color: filter === tab ? t.text : t.textMuted,
                borderRight: `1px solid ${t.border}`,
                textTransform: "capitalize", transition: "all 0.15s",
              }}>{tab}</button>
            ))}
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <Th t={t}>ID</Th><Th t={t}>Customer</Th><Th t={t}>Amount</Th>
              <Th t={t}>Repaid</Th><Th t={t}>Progress</Th><Th t={t}>Status</Th>
              <Th t={t}>Due</Th><Th t={t}></Th>
            </tr>
          </thead>
          <tbody>
            {list.map(l => {
              const pct = Math.round(l.repaid / l.amount * 100);
              return (
                <tr key={l.id}
                  onMouseEnter={e => e.currentTarget.style.background = t.surfaceAlt}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={td({ fontSize: 11, color: t.textMuted })}>{l.id}</td>
                  <td style={td({ fontSize: 13 })}>{l.customer}</td>
                  <td style={td({ fontSize: 13, fontWeight: 600 })}>${l.amount.toLocaleString()}</td>
                  <td style={td({ fontSize: 13, color: t.paid })}>${l.repaid.toLocaleString()}</td>
                  <td style={td({ minWidth: 90 })}>{bar(pct, t)}</td>
                  <td style={td()}>{pill(l.status, t)}</td>
                  <td style={td({ fontSize: 11, color: t.textMuted })}>{l.due}</td>
                  <td style={{ padding: "13px 0", borderBottom: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={ibtn(t)}
                        onClick={() => { setForm({ customerId: l.customerId, amount: l.amount, purpose: l.purpose, status: l.status, due: l.due }); setM({ mode: "edit", data: l }); }}>
                        <Ico d={I.edit} size={13} />
                      </button>
                      <button style={ibtn(t, true)}
                        onClick={() => { if (confirm("Delete loan?")) setLoans(p => p.filter(x => x.id !== l.id)); }}>
                        <Ico d={I.del} size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!list.length && (
          <div style={{ textAlign: "center", padding: "40px 0",
            fontSize: 13, color: t.textMuted }}>No loans found.</div>
        )}
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Issue Loan" : "Edit Loan"}
          onClose={() => setM(null)} t={t}>
          {modal.mode === "add" && <>
            <Field label="Customer" value={form.customerId}
              onChange={v => upd({ customerId: v })}
              opts={customers.map(c => ({ v: c.id, l: c.name }))} t={t} />
            <Field label="Amount ($)" value={form.amount}
              onChange={v => upd({ amount: v })} type="number" t={t} />
          </>}
          <Field label="Purpose" value={form.purpose}
            onChange={v => upd({ purpose: v })} t={t} />
          <Field label="Due Date" value={form.due}
            onChange={v => upd({ due: v })} t={t} />
          <Field label="Status" value={form.status}
            onChange={v => upd({ status: v })}
            opts={[{ v: "pending", l: "Pending" }, { v: "paid", l: "Paid" }, { v: "default", l: "Default" }]}
            t={t} />
          <ModalBtns onCancel={() => setM(null)} onSave={save}
            label={modal.mode === "add" ? "Issue Loan" : "Save"} t={t} />
        </Modal>
      )}
    </div>
  );
}

// ─── HAMBURGER ICON ───────────────────────────────────────────────────────────
const HamburgerIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    {open
      ? <><line x1="18" y1="6"  x2="6"  y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
      : <><line x1="3" y1="6"  x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
    }
  </svg>
);

// ─── SIDEBAR CONTENT (shared between desktop + mobile) ────────────────────────
function SidebarContent({ t, page, setPage, nav, handleLogoClick, onNavClick }) {
  return (
    <>
      {/* Logo */}
      <div onClick={handleLogoClick}
        style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${t.border}`,
          cursor: "default", userSelect: "none", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 5, background: t.accent,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke={t.accentText} strokeWidth="2.4" strokeLinecap="round">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text,
              letterSpacing: "-0.02em", fontFamily: "'DM Serif Display',Georgia,serif" }}>
              LendFlow
            </div>
            <div style={{ fontSize: 9, color: t.textMuted,
              letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Finance OS
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: t.textMuted, padding: "0 10px 10px" }}>
          Menu
        </div>
        {nav.map(item => {
          const active = page === item.key;
          return (
            <button key={item.key}
              onClick={() => { setPage(item.key); onNavClick && onNavClick(); }}
              style={{ width: "100%", display: "flex", alignItems: "center",
                gap: 10, padding: "11px 10px",
                background: active ? t.surfaceAlt : "transparent",
                borderRadius: 7, border: "none", cursor: "pointer",
                color: active ? t.text : t.textSub,
                fontWeight: active ? 500 : 400, fontSize: 13,
                textAlign: "left", marginBottom: 2,
                transition: "all 0.15s", fontFamily: "inherit" }}>
              <Ico d={item.icon} size={15} sw={active ? 2 : 1.5} />
              {item.label}
              {active && (
                <span style={{ marginLeft: "auto", opacity: 0.3 }}>
                  <Ico d={I.chev} size={12} />
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "14px 20px", borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%",
            background: t.surfaceAlt, border: `1px solid ${t.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 700, color: t.textSub }}>AD</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.text }}>Admin</div>
            <div style={{ fontSize: 10, color: t.textMuted }}>Super User</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark]           = useState(false);
  const [page, setPage]           = useState("dashboard");
  const [customers, setCustomers] = useState(mockCustomers);
  const [loans, setLoans]         = useState(mockLoans);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768);

  // Responsive listener
  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false); // auto-close on resize to desktop
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Close menu on back/escape
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Hidden toggle: triple-click the logo
  const clickCount = useRef(0);
  const clickTimer = useRef(null);
  const handleLogoClick = () => {
    clickCount.current += 1;
    clearTimeout(clickTimer.current);
    if (clickCount.current >= 3) {
      setDark(d => !d);
      clickCount.current = 0;
    } else {
      clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 600);
    }
  };

  const t = dark ? themes.dark : themes.light;

  const nav = [
    { key: "dashboard", label: "Dashboard", icon: I.dash },
    { key: "customers", label: "Customers", icon: I.cust },
    { key: "loans",     label: "Loans",     icon: I.loan },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        ::selection { background: ${t.accent}22; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }
        select option { background: ${t.surface}; color: ${t.text}; }
        input::placeholder { color: ${t.textMuted}; }
        @keyframes su      { from { opacity:0; transform:translateY(8px);   } to { opacity:1; transform:translateY(0);    } }
        @keyframes slideIn { from { transform:translateX(-100%); }           to { transform:translateX(0);                } }
        @keyframes fadeIn  { from { opacity:0; }                             to { opacity:1;                              } }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh",
        background: t.bg, color: t.text, transition: "background 0.25s, color 0.25s",
        position: "relative" }}>

        {/* ── DESKTOP SIDEBAR (≥768px) ── */}
        {!isMobile && (
          <aside style={{ width: 210, minHeight: "100vh", background: t.surface,
            borderRight: `1px solid ${t.border}`, display: "flex",
            flexDirection: "column", position: "sticky", top: 0,
            height: "100vh", flexShrink: 0,
            transition: "background 0.25s, border-color 0.25s" }}>
            <SidebarContent t={t} page={page} setPage={setPage} nav={nav}
              handleLogoClick={handleLogoClick} />
          </aside>
        )}

        {/* ── MOBILE BACKDROP ── */}
        {isMobile && menuOpen && (
          <div onClick={() => setMenuOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
              zIndex: 200, animation: "fadeIn 0.2s ease" }} />
        )}

        {/* ── MOBILE SIDEBAR (slides in from left) ── */}
        {isMobile && (
          <aside style={{
            position: "fixed", top: 0, left: 0, height: "100vh", width: 240,
            background: t.surface, borderRight: `1px solid ${t.border}`,
            display: "flex", flexDirection: "column", zIndex: 300,
            transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: menuOpen ? "4px 0 24px rgba(0,0,0,0.18)" : "none",
          }}>
            <SidebarContent t={t} page={page} setPage={setPage} nav={nav}
              handleLogoClick={handleLogoClick}
              onNavClick={() => setMenuOpen(false)} />
          </aside>
        )}

        {/* ── MAIN ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Topbar */}
          <header style={{ background: t.surface, borderBottom: `1px solid ${t.border}`,
            padding: isMobile ? "13px 20px" : "13px 32px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "sticky", top: 0, zIndex: 100,
            transition: "background 0.25s, border-color 0.25s" }}>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Hamburger — mobile only */}
              {isMobile && (
                <button onClick={() => setMenuOpen(o => !o)}
                  style={{ background: "none", border: "none", cursor: "pointer",
                    color: t.textSub, display: "flex", alignItems: "center",
                    padding: 4, borderRadius: 6 }}>
                  <HamburgerIcon open={menuOpen} />
                </button>
              )}
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
                textTransform: "uppercase", color: t.textMuted }}>
                {nav.find(n => n.key === page)?.label}
              </span>
            </div>

            <span style={{ fontSize: 11, color: t.textMuted }}>
              {new Date().toLocaleDateString("en-GB",
                { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </header>

          {/* Content */}
          <main style={{ flex: 1, padding: isMobile ? "24px 16px" : "36px 40px",
            overflowY: "auto" }}>
            {page === "dashboard" && <Dashboard loans={loans} customers={customers} t={t} />}
            {page === "customers" && <Customers customers={customers} setCustomers={setCustomers} loans={loans} t={t} />}
            {page === "loans"     && <Loans loans={loans} setLoans={setLoans} customers={customers} t={t} />}
          </main>
        </div>
      </div>
    </>
  );
}