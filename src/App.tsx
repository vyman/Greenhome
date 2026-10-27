import { useEffect, useMemo, useState, type ReactNode } from "react";

type IconName =
  | "alert"
  | "arrow"
  | "bell"
  | "box"
  | "building"
  | "calendar"
  | "chart"
  | "check"
  | "chevron"
  | "clock"
  | "close"
  | "document"
  | "download"
  | "grid"
  | "hardhat"
  | "home"
  | "invoice"
  | "menu"
  | "more"
  | "people"
  | "plus"
  | "search"
  | "settings"
  | "shield"
  | "user"
  | "wallet"
  | "wrench";

const paths: Record<IconName, ReactNode> = {
  alert: <><path d="M12 8.5v4.25" /><path d="M12 16.2h.01" /><path d="M10.2 3.9 2.9 16.6A1.6 1.6 0 0 0 4.3 19h15.4a1.6 1.6 0 0 0 1.4-2.4L13.8 3.9a2.1 2.1 0 0 0-3.6 0Z" /></>,
  arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  box: <><path d="m21 8-9 5-9-5" /><path d="M3.3 6.5 12 2l8.7 4.5v11L12 22l-8.7-4.5Z" /><path d="M12 13v9" /></>,
  building: <><path d="M4 21V5l8-3v19" /><path d="M12 9h8v12M8 7h.01M8 11h.01M8 15h.01M16 13h.01M16 17h.01M2 21h20" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  chart: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
  download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M4 19v2h16v-2" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  hardhat: <><path d="M4 15a8 8 0 0 1 16 0" /><path d="M2 15h20v4H2ZM12 7v8" /></>,
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
  invoice: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2Z" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  people: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  wallet: <><path d="M3 6h15a2 2 0 0 1 2 2v11H5a2 2 0 0 1-2-2Z" /><path d="M3 7V5a2 2 0 0 1 2-2h12v3M15 12h6v4h-6a2 2 0 0 1 0-4Z" /></>,
  wrench: <><path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 8.6 7 6.3 4.7a4 4 0 0 0 5 5L19 17.4a2.1 2.1 0 0 1-3 3l-7.7-7.7a4 4 0 0 0-5-5" /></>,
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Button({ children, variant = "primary", icon, onClick }: { children: ReactNode; variant?: "primary" | "secondary" | "ghost"; icon?: IconName; onClick?: () => void }) {
  return <button className={`btn btn-${variant}`} onClick={onClick}>{icon && <Icon name={icon} size={16} />}<span>{children}</span></button>;
}

const navItems: { label: string; icon: IconName; section?: boolean }[] = [
  { label: "Overview", icon: "grid" },
  { label: "Customers", icon: "people" },
  { label: "Sites", icon: "building" },
  { label: "Inspections", icon: "document" },
  { label: "Quotations", icon: "invoice" },
  { label: "OPERATIONS", icon: "menu", section: true },
  { label: "Godown & Materials", icon: "box" },
  { label: "Labour & Attendance", icon: "hardhat" },
  { label: "Labour Expense Claims", icon: "wallet" },
  { label: "Work Progress", icon: "wrench" },
  { label: "FINANCE & REPORTS", icon: "menu", section: true },
  { label: "Invoices & Payments", icon: "wallet" },
  { label: "Site Reports", icon: "chart" },
];

const projects = [
  { id: "GH-0148", name: "Krishna Residency", client: "Raghavendra Rao", location: "Jayanagar, Bengaluru", status: "Ongoing", type: "Terrace waterproofing", supervisor: "Mahesha", initials: "KR", tone: "sage", value: "₹1,84,500", date: "18 Jun" },
  { id: "GH-0147", name: "Aarunya Villa", client: "Ananya Sharma", location: "Whitefield, Bengaluru", status: "Visit Scheduled", type: "Toilet & balcony", supervisor: "Govinda", initials: "AV", tone: "sand", value: "—", date: "19 Jun" },
  { id: "GH-0145", name: "Prestige Warehouse", client: "Karthik Industries", location: "Hosur Road, Bengaluru", status: "Quotation Sent", type: "Industrial flooring", supervisor: "Pavan", initials: "PW", tone: "blue", value: "₹3,42,000", date: "21 Jun" },
  { id: "GH-0142", name: "Nandini Enclave", client: "Suresh Kumar", location: "Mysuru, Karnataka", status: "On Hold", type: "External wall repair", supervisor: "Shivaraj", initials: "NE", tone: "rose", value: "₹96,800", date: "—" },
  { id: "GH-0139", name: "Sri Sai Apartments", client: "Lakshmi Association", location: "JP Nagar, Bengaluru", status: "Completed", type: "Sump & water tank", supervisor: "Ninga", initials: "SS", tone: "violet", value: "₹2,15,000", date: "12 Jun" },
];

const alerts = [
  { icon: "invoice" as IconName, tone: "danger", title: "3 invoices overdue", detail: "₹1,42,500 outstanding", action: "Review invoices" },
  { icon: "clock" as IconName, tone: "warning", title: "5 follow-ups due", detail: "2 are overdue today", action: "Open quotations" },
  { icon: "box" as IconName, tone: "purple", title: "Low stock alert", detail: "2 products below threshold", action: "View inventory" },
];

function Status({ value }: { value: string }) {
  return <span className={`status status-${value.toLowerCase().replaceAll(" ", "-")}`}><i />{value}</span>;
}

function MetricCard({ label, value, meta, icon, tone, delta, onClick }: { label: string; value: string; meta: string; icon: IconName; tone: string; delta?: string; onClick: () => void }) {
  return (
    <button className="metric-card" onClick={onClick}>
      <span className={`metric-icon ${tone}`}><Icon name={icon} size={20} /></span>
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
      <span className="metric-meta">{delta && <b>{delta}</b>}{meta}</span>
      <span className="metric-arrow"><Icon name="arrow" size={17} /></span>
    </button>
  );
}

type ModuleConfig = {
  title: string;
  eyebrow: string;
  description: string;
  primary: string;
  icon: IconName;
  tabs: string[];
  metrics: { label: string; value: string; note: string; tone: string }[];
  columns: string[];
  rows: string[][];
  badgeColumn?: number;
  insight: { title: string; value: string; note: string }[];
};

const moduleConfigs: Record<string, ModuleConfig> = {
  Customers: {
    title: "Customers", eyebrow: "CUSTOMER DIRECTORY", description: "Manage customer profiles, billing details and every connected site.", primary: "Add customer", icon: "people",
    tabs: ["All customers", "With active sites", "Recently added"],
    metrics: [
      { label: "TOTAL CUSTOMERS", value: "186", note: "12 added this month", tone: "green" },
      { label: "ACTIVE PROJECTS", value: "24", note: "Across 21 customers", tone: "blue" },
      { label: "LINKED SITES", value: "214", note: "Across all customers", tone: "amber" },
      { label: "MISSING CONTACT", value: "3", note: "Needs basic details", tone: "red" },
    ],
    columns: ["CUSTOMER", "CONTACT", "SITES", "ACTIVE WORK", "REMARK", "ADDED"],
    rows: [
      ["Raghavendra Rao\nCUS-0186", "+91 98450 23456", "2 sites", "1 ongoing", "Primary contact", "12 Jun 2025"],
      ["Ananya Sharma\nCUS-0185", "+91 99002 81726", "1 site", "Visit scheduled", "New enquiry", "09 Jun 2025"],
      ["Karthik Industries\nCUS-0182", "+91 98441 40908", "3 sites", "Quotation sent", "GST customer", "28 May 2025"],
      ["Lakshmi Association\nCUS-0174", "+91 99867 12004", "2 sites", "Completed", "Association", "14 Apr 2025"],
      ["Suresh Kumar\nCUS-0169", "+91 98804 56110", "1 site", "On hold", "Call before visit", "02 Apr 2025"],
    ],
    badgeColumn: 3,
    insight: [{ title: "New this month", value: "12", note: "Recently added" }, { title: "With active sites", value: "21", note: "Current work records" }, { title: "Duplicate warnings", value: "2", note: "Review suggested matches" }],
  },
  Sites: {
    title: "Sites", eyebrow: "SITE MANAGEMENT", description: "Track every site from first enquiry through completed Phase 1 work records.", primary: "Add new site", icon: "building",
    tabs: ["All sites", "Active", "Awaiting visit", "On hold", "Completed"],
    metrics: [
      { label: "TOTAL SITES", value: "214", note: "42 added this year", tone: "green" },
      { label: "ONGOING", value: "24", note: "6 nearing completion", tone: "blue" },
      { label: "VISITS DUE", value: "7", note: "3 scheduled today", tone: "amber" },
      { label: "ON HOLD", value: "3", note: "Requires attention", tone: "red" },
    ],
    columns: ["SITE", "CUSTOMER", "SOURCE", "STATUS", "SUPERVISOR", "NEXT ACTION"],
    rows: [
      ["GH-0148\nKrishna Residency", "Raghavendra Rao", "Direct", "Ongoing", "Mahesha", "Coat 2 · Today"],
      ["GH-0147\nAarunya Villa", "Ananya Sharma", "UltraTech", "Visit Scheduled", "Govinda", "Inspection · 19 Jun"],
      ["GH-0145\nPrestige Warehouse", "Karthik Industries", "Referral", "Quotation Sent", "Pavan", "Follow-up · 21 Jun"],
      ["GH-0142\nNandini Enclave", "Suresh Kumar", "Direct", "On Hold", "Shivaraj", "Customer approval"],
      ["GH-0139\nSri Sai Apartments", "Lakshmi Association", "UltraTech", "Completed", "Ninga", "Site report ready"],
    ],
    badgeColumn: 3,
    insight: [{ title: "Visit scheduled", value: "7", note: "3 due today" }, { title: "Completed this month", value: "9", note: "Site records closed" }, { title: "Unassigned", value: "2", note: "Supervisor required" }],
  },
  Inspections: {
    title: "Inspections & measurements", eyebrow: "SITE ASSESSMENT", description: "Capture repeat visits, findings, measurements and area-wise photo evidence.", primary: "New inspection", icon: "document",
    tabs: ["All inspections", "Scheduled", "In progress", "Completed", "Needs review"],
    metrics: [
      { label: "VISITS THIS WEEK", value: "12", note: "7 completed", tone: "green" },
      { label: "DUE TODAY", value: "3", note: "All assigned", tone: "amber" },
      { label: "MEASURED AREA", value: "8,460", note: "sq ft this month", tone: "blue" },
      { label: "NEEDS REVIEW", value: "2", note: "Missing photos", tone: "red" },
    ],
    columns: ["INSPECTION", "SITE", "TYPE", "AREA", "INSPECTOR", "STATUS"],
    rows: [
      ["INS-0092\n18 Jun, 09:30", "GH-0147 · Aarunya Villa", "Old building", "Toilet & balcony", "Govinda", "Scheduled"],
      ["INS-0091\n17 Jun, 15:10", "GH-0148 · Krishna Residency", "New building", "Terrace · 1,840 sq ft", "Mahesha", "Completed"],
      ["INS-0089\n16 Jun, 11:40", "GH-0145 · Prestige Warehouse", "Old building", "Floor · 4,200 sq ft", "Pavan", "Needs review"],
      ["INS-0087\n14 Jun, 10:00", "GH-0142 · Nandini Enclave", "Old building", "External wall", "Shivaraj", "Completed"],
    ],
    badgeColumn: 5,
    insight: [{ title: "Toilet total", value: "1,246 sq ft", note: "Across 14 toilets" }, { title: "Terrace total", value: "5,480 sq ft", note: "Net applied area" }, { title: "Photos uploaded", value: "86", note: "This month" }],
  },
  Quotations: {
    title: "Quotations & follow-ups", eyebrow: "SALES PIPELINE", description: "Register uploaded quotation PDFs, revisions, approvals and follow-up activity.", primary: "Upload quotation", icon: "invoice",
    tabs: ["All quotations", "Sent", "Follow-up due", "Accepted", "Rejected"],
    metrics: [
      { label: "QUOTED THIS MONTH", value: "₹18.6L", note: "16 quotations", tone: "green" },
      { label: "SENT", value: "9", note: "Awaiting response", tone: "blue" },
      { label: "FOLLOW-UPS DUE", value: "5", note: "2 overdue", tone: "amber" },
      { label: "ACCEPTED", value: "4", note: "Ready for work", tone: "green" },
    ],
    columns: ["QUOTATION", "SITE", "REVISION", "VALUE", "FOLLOW-UP", "STATUS"],
    rows: [
      ["QT-2025-086\n17 Jun 2025", "GH-0145 · Prestige Warehouse", "Revision 2", "₹3,42,000", "21 Jun", "Sent"],
      ["QT-2025-085\n16 Jun 2025", "GH-0148 · Krishna Residency", "Revision 1", "₹1,84,500", "Accepted 17 Jun", "Accepted"],
      ["QT-2025-082\n12 Jun 2025", "GH-0142 · Nandini Enclave", "Original", "₹96,800", "Overdue by 2 days", "Follow-up due"],
      ["QT-2025-079\n09 Jun 2025", "GH-0138 · Aster Villa", "Original", "₹1,26,000", "Closed", "Rejected"],
    ],
    badgeColumn: 5,
    insight: [{ title: "Sent", value: "9", note: "Awaiting customer response" }, { title: "Follow-up due", value: "5", note: "2 currently overdue" }, { title: "Oldest follow-up", value: "4 days", note: "GH-0135" }],
  },
  "Godown & Materials": {
    title: "Godown & materials", eyebrow: "BASIC INVENTORY", description: "Maintain products and record confirmed stock receipts, site issues and returns.", primary: "Record transaction", icon: "box",
    tabs: ["Stock balance", "Products", "Receipts", "Issues", "Returns"],
    metrics: [
      { label: "ACTIVE PRODUCTS", value: "38", note: "Across 12 brands", tone: "green" },
      { label: "LOW STOCK", value: "2", note: "Reorder required", tone: "red" },
      { label: "ISSUED TODAY", value: "28", note: "Units to 3 sites", tone: "blue" },
      { label: "RETURNS THIS WEEK", value: "6", note: "Units from 2 sites", tone: "amber" },
    ],
    columns: ["PRODUCT", "CATEGORY / UNIT", "AVAILABLE", "REORDER AT", "LAST MOVEMENT", "STATUS"],
    rows: [
      ["Dr. Fixit Pidifin 2K\nDr. Fixit", "Waterproofing · Bucket", "42", "12", "Issue · 18 Jun", "Healthy"],
      ["Fosroc Brushbond\nFosroc", "Coating · Bag", "8", "10", "Issue · 17 Jun", "Low stock"],
      ["Sika Latex Power\nSika", "Admixture · Can", "6", "8", "Receipt · 16 Jun", "Low stock"],
      ["Asian SmartCare Damp Proof\nAsian Paints", "Waterproofing · Bucket", "24", "8", "Return · 15 Jun", "Healthy"],
    ],
    badgeColumn: 5,
    insight: [{ title: "Issued today", value: "28 units", note: "Across 3 sites" }, { title: "Pending returns", value: "4", note: "Across 3 sites" }, { title: "Recent receipt", value: "16 Jun", note: "Sika Latex Power" }],
  },
  "Labour & Attendance": {
    title: "Labour & attendance", eyebrow: "WORKFORCE", description: "Record individual site allocation, attendance, wage snapshots and overtime.", primary: "Add attendance", icon: "hardhat",
    tabs: ["Daily attendance", "Labourers", "Pending approval", "Corrections"],
    metrics: [
      { label: "PRESENT TODAY", value: "18", note: "Across 6 sites", tone: "green" },
      { label: "ON OVERTIME", value: "4", note: "OT entries today", tone: "amber" },
      { label: "WAGES THIS WEEK", value: "₹84,500", note: "Pending approval", tone: "blue" },
      { label: "DUPLICATE WARNINGS", value: "1", note: "Needs correction", tone: "red" },
    ],
    columns: ["LABOURER", "SITE", "WORK PERFORMED", "DAY FRACTION", "WAGE", "OT"],
    rows: [
      ["Ninga\nLAB-001", "GH-0148 · Krishna Residency", "Surface preparation", "1 day", "₹1,000", "Yes · ₹500"],
      ["Mahesha\nLAB-002", "GH-0148 · Krishna Residency", "Crack treatment", "1 day", "₹1,200", "No"],
      ["Govinda\nLAB-003", "GH-0145 · Prestige Warehouse", "Primer application", "0.5 day", "₹500", "No"],
      ["Pavan\nLAB-004", "GH-0139 · Sri Sai Apartments", "Final cleaning", "1 day", "₹1,000", "Yes · ₹500"],
    ],
    insight: [{ title: "Active labourers", value: "26", note: "2 currently inactive" }, { title: "OT entries", value: "4", note: "Awaiting basic approval" }, { title: "Attendance pending", value: "7", note: "Supervisor review required" }],
  },
  "Labour Expense Claims": {
    title: "Labour expense claims", eyebrow: "EXPENSE REVIEW", description: "Submit, review and track site-related labour expenses and supporting receipts.", primary: "New expense claim", icon: "wallet",
    tabs: ["All claims", "Submitted", "Needs review", "Approved", "Paid"],
    metrics: [
      { label: "CLAIMS THIS MONTH", value: "₹42,680", note: "28 claims submitted", tone: "green" },
      { label: "NEEDS REVIEW", value: "6", note: "₹8,450 pending", tone: "amber" },
      { label: "MISSING RECEIPTS", value: "3", note: "Clearly flagged", tone: "red" },
      { label: "PAID", value: "₹29,230", note: "18 claims", tone: "blue" },
    ],
    columns: ["CLAIM", "LABOURER / SITE", "CATEGORY", "AMOUNT", "RECEIPT", "STATUS"],
    rows: [
      ["EXP-2025-048\n18 Jun 2025", "Ninga · GH-0148", "Local transport", "₹680", "Attached", "Submitted"],
      ["EXP-2025-047\n18 Jun 2025", "Mahesha · GH-0148", "Site supplies", "₹1,240", "No receipt", "Needs review"],
      ["EXP-2025-044\n16 Jun 2025", "Govinda · GH-0145", "Meals", "₹540", "Attached", "Approved"],
      ["EXP-2025-041\n14 Jun 2025", "Pavan · GH-0139", "Transport", "₹920", "Attached", "Paid"],
    ],
    badgeColumn: 5,
    insight: [{ title: "Awaiting approval", value: "6", note: "Submitted claims" }, { title: "Without receipts", value: "3", note: "Reason required" }, { title: "Paid claims", value: "18", note: "Current month" }],
  },
  "Work Progress": {
    title: "Work progress", eyebrow: "SITE EXECUTION", description: "Follow daily updates, pending work, issues and stage-wise photo evidence.", primary: "Post update", icon: "wrench",
    tabs: ["All updates", "Today", "Issues", "Targets due", "Completed"],
    metrics: [
      { label: "ACTIVE SITES", value: "24", note: "18 updated today", tone: "green" },
      { label: "UPDATES TODAY", value: "31", note: "126 photos", tone: "blue" },
      { label: "OPEN ISSUES", value: "6", note: "2 high priority", tone: "red" },
      { label: "TARGETS DUE", value: "4", note: "Before end of day", tone: "amber" },
    ],
    columns: ["SITE", "LATEST STAGE", "TODAY'S UPDATE", "PHOTOS", "SUPERVISOR", "STATUS"],
    rows: [
      ["GH-0148\nKrishna Residency", "Waterproofing · Coat 2", "680 sq ft completed", "12 photos", "Mahesha", "On track"],
      ["GH-0145\nPrestige Warehouse", "Surface preparation", "Crack routing underway", "8 photos", "Pavan", "Issue raised"],
      ["GH-0141\nLakeview Homes", "Protection screed", "Section B completed", "16 photos", "Govinda", "On track"],
      ["GH-0139\nSri Sai Apartments", "Final handover", "Punch list closed", "6 photos", "Ninga", "Completed"],
    ],
    badgeColumn: 5,
    insight: [{ title: "Sites updated", value: "18", note: "Today" }, { title: "Pending targets", value: "4", note: "2 due by 5 PM" }, { title: "Open issues", value: "6", note: "Requires supervisor action" }],
  },
  "Invoices & Payments": {
    title: "Invoices & payments", eyebrow: "BASIC PAYMENT TRACKING", description: "Record invoices and straightforward payments against the relevant invoice.", primary: "Create invoice", icon: "wallet",
    tabs: ["Invoices", "Payments", "Outstanding", "Overdue"],
    metrics: [
      { label: "INVOICED THIS MONTH", value: "₹12.40L", note: "14 invoices", tone: "green" },
      { label: "RECEIVED", value: "₹7.58L", note: "61% collected", tone: "blue" },
      { label: "OUTSTANDING", value: "₹4.82L", note: "8 invoices", tone: "amber" },
      { label: "OVERDUE", value: "₹1.42L", note: "3 invoices", tone: "red" },
    ],
    columns: ["INVOICE", "SITE / CUSTOMER", "TOTAL", "RECEIVED", "DUE DATE", "STATUS"],
    rows: [
      ["INV-2025-064\n12 Jun 2025", "GH-0148 · Raghavendra Rao", "₹1,84,500", "₹1,36,000", "22 Jun", "Partially Paid"],
      ["INV-2025-061\n05 Jun 2025", "GH-0139 · Lakshmi Association", "₹2,15,000", "₹1,41,000", "15 Jun", "Overdue"],
      ["INV-2025-058\n28 May 2025", "GH-0136 · Vivek Menon", "₹86,000", "₹86,000", "07 Jun", "Paid"],
      ["INV-2025-055\n21 May 2025", "GH-0132 · Anugraha Trust", "₹68,500", "₹0", "31 May", "Overdue"],
    ],
    badgeColumn: 5,
    insight: [{ title: "Outstanding invoices", value: "8", note: "Basic unpaid balance" }, { title: "Overdue invoices", value: "3", note: "Past due date" }, { title: "Latest payment", value: "₹48,500", note: "Received today" }],
  },
  "Site Reports": {
    title: "Site reports", eyebrow: "AUTHORIZED SITE RECORD", description: "Preview and export complete site records with permission-aware sections.", primary: "Generate report", icon: "chart",
    tabs: ["Recent reports", "Ready to generate", "Drafts", "Downloaded"],
    metrics: [
      { label: "REPORTS GENERATED", value: "18", note: "This month", tone: "green" },
      { label: "READY TO GENERATE", value: "6", note: "Completed inspections", tone: "blue" },
      { label: "DRAFT REPORTS", value: "3", note: "Awaiting photo selection", tone: "amber" },
      { label: "LARGE PHOTO REPORTS", value: "2", note: "Summary option suggested", tone: "red" },
    ],
    columns: ["REPORT", "SITE", "PHOTO OPTION", "CREATED BY", "FORMAT", "LAST RUN"],
    rows: [
      ["SR-GH-0148-03", "Krishna Residency", "Selected photos", "Ravi Kumar", "PDF", "Today, 09:14"],
      ["SR-GH-0139-02", "Sri Sai Apartments", "All photos", "Office Admin", "PDF", "Yesterday"],
      ["SR-GH-0145-01", "Prestige Warehouse", "Summary only", "Ravi Kumar", "PDF", "16 Jun 2025"],
      ["SR-GH-0142-01", "Nandini Enclave", "Selected photos", "Office Admin", "PDF", "14 Jun 2025"],
    ],
    insight: [{ title: "Latest report", value: "GH-0148", note: "Generated today" }, { title: "Photos included", value: "146", note: "Across June reports" }, { title: "Default format", value: "A4 PDF", note: "Branded site report" }],
  },
  "Users & Settings": {
    title: "Users & settings", eyebrow: "PHASE 1 ACCESS CONTROL", description: "Manage staff accounts and the four agreed role presets with basic audit history.", primary: "Invite user", icon: "settings",
    tabs: ["Users", "Role presets", "Alerts", "Business profile", "Audit log"],
    metrics: [
      { label: "ACTIVE USERS", value: "12", note: "4 role presets", tone: "green" },
      { label: "ONLINE TODAY", value: "8", note: "Last 24 hours", tone: "blue" },
      { label: "PENDING INVITES", value: "2", note: "Expire in 4 days", tone: "amber" },
      { label: "SECURITY ALERTS", value: "0", note: "No action required", tone: "green" },
    ],
    columns: ["USER", "ROLE", "ACCESS", "LAST ACTIVE", "STATUS", "TWO-STEP"],
    rows: [
      ["Ravi Kumar\nravi@greenhome.in", "Owner / Admin", "Full access", "Now", "Active", "Enabled"],
      ["Deepa S\nadmin@greenhome.in", "Office staff", "Finance + records", "12 min ago", "Active", "Enabled"],
      ["Mahesha\n+91 98450 11872", "Site supervisor", "Assigned sites", "1 hr ago", "Active", "Not enabled"],
      ["Naveen K\nstore@greenhome.in", "Store staff", "Inventory only", "Yesterday", "Active", "Enabled"],
    ],
    badgeColumn: 4,
    insight: [{ title: "Last backup", value: "Today, 04:30", note: "Completed successfully" }, { title: "Audit events", value: "248", note: "In the last 30 days" }, { title: "Timezone", value: "Asia/Kolkata", note: "Currency set to INR" }],
  },
};

function ModulePage({ config, search, notify, onPrimary }: { config: ModuleConfig; search: string; notify: (message: string) => void; onPrimary: () => void }) {
  const [activeTab, setActiveTab] = useState(config.tabs[0]);
  const rows = config.rows.filter((row) => row.join(" ").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="content module-content">
      <section className="page-heading module-heading">
        <div>
          <p className="eyebrow">{config.eyebrow}</p>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <div className="heading-actions">
          <Button icon="plus" onClick={onPrimary}>{config.primary}</Button>
        </div>
      </section>

      <section className="module-metrics">
        {config.metrics.map((metric) => (
          <div className="module-metric" key={metric.label}>
            <span className={`metric-dot ${metric.tone}`} />
            <div><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.note}</small></div>
          </div>
        ))}
      </section>

      <div className="module-layout">
        <section className="panel module-table-panel">
          <div className="module-table-tools">
            <div className="module-tabs">
              {config.tabs.map((tab) => <button className={activeTab === tab ? "active" : ""} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}
            </div>
            <div className="table-actions">
              <button onClick={() => notify("Date filter opened")}><Icon name="calendar" size={14} />Date</button>
              <button onClick={() => notify("More filters opened")}><Icon name="menu" size={14} />Filter</button>
            </div>
          </div>
          <div className="active-view"><span>{activeTab}</span><small>{rows.length} records shown</small></div>
          <div className="module-table-scroll">
            <table className="module-table">
              <thead><tr>{config.columns.map((column) => <th key={column}>{column}</th>)}<th /></tr></thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={`${row[0]}-${rowIndex}`} onClick={() => notify(`${row[0].split("\n")[0]} opened`)}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${cell}-${cellIndex}`}>
                        {cellIndex === 0 ? <div className="primary-cell"><span className={`record-icon tone-${rowIndex % 5}`}><Icon name={config.icon} size={15} /></span><span>{cell.split("\n").map((line, lineIndex) => lineIndex === 0 ? <strong key={line}>{line}</strong> : <small key={line}>{line}</small>)}</span></div>
                          : cellIndex === config.badgeColumn ? <Status value={cell} />
                          : <span className={cell.startsWith("₹") ? "table-money" : ""}>{cell}</span>}
                      </td>
                    ))}
                    <td><button className="row-more" aria-label="More actions" onClick={(event) => { event.stopPropagation(); notify("Record actions opened"); }}><Icon name="more" size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && <div className="empty"><Icon name="search" size={22} /><strong>No matching records</strong><span>Try clearing the global search.</span></div>}
          </div>
          <div className="table-footer"><span>Showing {rows.length} of {config.rows.length} records</span><div><button disabled><Icon name="chevron" size={13} /></button><b>1</b><button><Icon name="chevron" size={13} /></button></div></div>
        </section>

        <aside className="module-side">
          <section className="panel insight-panel">
            <div className="insight-heading"><span className="insight-icon"><Icon name={config.icon} size={18} /></span><div><h2>Quick overview</h2><p>Live workspace summary</p></div></div>
            {config.insight.map((item) => <div className="insight-row" key={item.title}><span>{item.title}<small>{item.note}</small></span><strong>{item.value}</strong></div>)}
          </section>
          <section className="panel quick-actions">
            <div><h2>Quick actions</h2><p>Common tasks in this workspace</p></div>
            <button onClick={onPrimary}><span><Icon name="plus" size={15} /></span>{config.primary}<Icon name="chevron" size={14} /></button>
            <button onClick={() => notify("Pending items opened")}><span><Icon name="alert" size={15} /></span>View pending items<Icon name="chevron" size={14} /></button>
            <button onClick={() => notify("Activity history opened")}><span><Icon name="clock" size={15} /></span>View activity history<Icon name="chevron" size={14} /></button>
          </section>
        </aside>
      </div>
    </div>
  );
}

const formFields: Record<string, { label: string; placeholder: string; type?: "select" | "textarea" | "file"; options?: string[]; required?: boolean }[]> = {
  Customers: [
    { label: "Customer name", placeholder: "Enter full name or company", required: true },
    { label: "Primary mobile", placeholder: "+91", required: true },
    { label: "Email address", placeholder: "Optional email" },
    { label: "Billing name", placeholder: "Name used on invoice" },
    { label: "Billing address", placeholder: "Full billing address", type: "textarea" },
    { label: "GSTIN", placeholder: "Optional GSTIN" },
    { label: "Notes", placeholder: "Customer notes", type: "textarea" },
  ],
  Sites: [
    { label: "Customer", placeholder: "Select customer", type: "select", options: ["Raghavendra Rao", "Ananya Sharma", "Karthik Industries"], required: true },
    { label: "Project / site name", placeholder: "e.g. Krishna Residency", required: true },
    { label: "UltraTech SR ID", placeholder: "Optional — enter only when supplied" },
    { label: "Site address", placeholder: "Full site address", type: "textarea", required: true },
    { label: "Site type", placeholder: "Select type", type: "select", options: ["Residential", "Commercial", "Semi-Residential", "Other"], required: true },
    { label: "Application areas", placeholder: "Terrace, Toilet, Balcony…" },
    { label: "Lead source", placeholder: "Select source", type: "select", options: ["UltraTech", "Direct", "Referral", "Other"] },
    { label: "Assigned supervisor", placeholder: "Select supervisor", type: "select", options: ["Mahesha", "Govinda", "Pavan", "Shivaraj"] },
    { label: "Remarks", placeholder: "Site notes", type: "textarea" },
  ],
  Quotations: [
    { label: "Site", placeholder: "Select Site ID", type: "select", options: ["GH-0148 · Krishna Residency", "GH-0147 · Aarunya Villa", "GH-0145 · Prestige Warehouse"], required: true },
    { label: "Quotation number", placeholder: "QT-2025-087", required: true },
    { label: "Quotation date", placeholder: "DD/MM/YYYY", required: true },
    { label: "Total amount", placeholder: "₹0.00", required: true },
    { label: "Status", placeholder: "Select status", type: "select", options: ["Draft", "Sent", "Follow-up Pending", "Accepted", "Rejected"] },
    { label: "Follow-up date", placeholder: "DD/MM/YYYY" },
    { label: "Quotation PDF", placeholder: "Upload PDF", type: "file", required: true },
    { label: "Follow-up remarks", placeholder: "Add context for the next follow-up", type: "textarea" },
  ],
  "Godown & Materials": [
    { label: "Transaction type", placeholder: "Select type", type: "select", options: ["Stock receipt", "Site issue", "Site return"], required: true },
    { label: "Product", placeholder: "Select product", type: "select", options: ["Dr. Fixit Pidifin 2K", "Fosroc Brushbond", "Sika Latex Power"], required: true },
    { label: "Transaction date", placeholder: "DD/MM/YYYY", required: true },
    { label: "Quantity", placeholder: "0", required: true },
    { label: "Unit", placeholder: "Select unit", type: "select", options: ["Bucket", "Bag", "Can", "Kg", "Litre"], required: true },
    { label: "Site", placeholder: "Required for issues and returns", type: "select", options: ["GH-0148 · Krishna Residency", "GH-0145 · Prestige Warehouse", "GH-0139 · Sri Sai Apartments"] },
    { label: "Reference / remarks", placeholder: "Supplier reference or transaction notes", type: "textarea" },
    { label: "Supporting document", placeholder: "Optional invoice or acknowledgement", type: "file" },
  ],
  "Labour & Attendance": [
    { label: "Labourer", placeholder: "Select labourer", type: "select", options: ["Ninga", "Mahesha", "Govinda", "Pavan", "Ringa", "Shivaraj"], required: true },
    { label: "Site", placeholder: "Select Site ID", type: "select", options: ["GH-0148 · Krishna Residency", "GH-0145 · Prestige Warehouse"], required: true },
    { label: "Attendance date", placeholder: "DD/MM/YYYY", required: true },
    { label: "Day fraction", placeholder: "Select fraction", type: "select", options: ["0.5", "1", "1.5", "2"], required: true },
    { label: "Check-in", placeholder: "09:00" },
    { label: "Check-out", placeholder: "18:00" },
    { label: "Overtime duration", placeholder: "Enter approved duration" },
    { label: "Work and remarks", placeholder: "Describe work performed", type: "textarea", required: true },
  ],
  "Work Progress": [
    { label: "Site", placeholder: "Select assigned site", type: "select", options: ["GH-0148 · Krishna Residency", "GH-0145 · Prestige Warehouse"], required: true },
    { label: "Progress date", placeholder: "18/06/2025", required: true },
    { label: "Photo stage", placeholder: "Select stage", type: "select", options: ["Initial condition", "Surface preparation", "Crack treatment", "Coat 1", "Coat 2", "Completed work"] },
    { label: "Work completed", placeholder: "Describe completed work", type: "textarea", required: true },
    { label: "Pending work", placeholder: "What remains?", type: "textarea" },
    { label: "Issues and next action", placeholder: "Record issue, owner and target date", type: "textarea" },
    { label: "Site photos", placeholder: "Upload multiple photos", type: "file" },
  ],
  "Labour Expense Claims": [
    { label: "Labourer", placeholder: "Select labourer", type: "select", options: ["Ninga", "Mahesha", "Govinda", "Pavan", "Ringa", "Shivaraj"], required: true },
    { label: "Site", placeholder: "Select Site ID", type: "select", options: ["GH-0148 · Krishna Residency", "GH-0145 · Prestige Warehouse", "GH-0139 · Sri Sai Apartments"], required: true },
    { label: "Expense category", placeholder: "Select category", type: "select", options: ["Local transport", "Meals", "Site supplies", "Accommodation", "Other"], required: true },
    { label: "Expense date", placeholder: "DD/MM/YYYY", required: true },
    { label: "Amount", placeholder: "₹0.00", required: true },
    { label: "Payment method", placeholder: "Select method", type: "select", options: ["Cash", "UPI", "Bank Transfer", "Other"] },
    { label: "Description", placeholder: "Explain the expense", type: "textarea", required: true },
    { label: "Receipt / invoice", placeholder: "Upload optional receipt", type: "file" },
  ],
  "Invoices & Payments": [
    { label: "Site", placeholder: "Select Site ID", type: "select", options: ["GH-0148 · Krishna Residency", "GH-0145 · Prestige Warehouse"], required: true },
    { label: "Invoice number", placeholder: "INV-2025-065", required: true },
    { label: "Invoice date", placeholder: "DD/MM/YYYY", required: true },
    { label: "Amount", placeholder: "₹0.00", required: true },
    { label: "Due date", placeholder: "DD/MM/YYYY", required: true },
    { label: "Invoice document", placeholder: "Upload PDF or image", type: "file" },
    { label: "Notes", placeholder: "Optional invoice notes", type: "textarea" },
  ],
  "Users & Settings": [
    { label: "Full name", placeholder: "Staff member name", required: true },
    { label: "Email address", placeholder: "name@greenhome.in", required: true },
    { label: "Mobile number", placeholder: "+91" },
    { label: "Role preset", placeholder: "Select one of four approved roles", type: "select", options: ["Owner / Admin", "Office Staff", "Site Supervisor", "Store / Godown Staff"], required: true },
    { label: "Assigned sites", placeholder: "Applicable to Site Supervisor" },
    { label: "Account note", placeholder: "Optional internal note", type: "textarea" },
  ],
};

function FormDrawer({ module, onClose, onSave }: { module: string; onClose: () => void; onSave: () => void }) {
  const fields = formFields[module] || [
    { label: "Related site", placeholder: "Select Site ID", type: "select" as const, options: ["GH-0148 · Krishna Residency", "GH-0147 · Aarunya Villa"], required: true },
    { label: "Details", placeholder: "Enter record details", type: "textarea" as const, required: true },
    { label: "Supporting document", placeholder: "Upload file", type: "file" as const },
  ];
  const title = module === "Labour Expense Claims" ? "New expense claim" : module === "Sites" ? "Add new site" : module === "Customers" ? "Add customer" : module === "Work Progress" ? "Post progress update" : module === "Invoices & Payments" ? "Create invoice" : `Add ${module.toLowerCase()} record`;

  return (
    <div className="drawer-layer" role="dialog" aria-modal="true" aria-label={title}>
      <button className="drawer-scrim" aria-label="Close form" onClick={onClose} />
      <aside className="form-drawer">
        <header>
          <div><p className="eyebrow">{module.toUpperCase()}</p><h2>{title}</h2><span>Fields marked with * are required.</span></div>
          <button className="drawer-close" onClick={onClose}><Icon name="close" size={18} /></button>
        </header>
        {module === "Sites" && <div className="form-notice"><Icon name="shield" size={17} /><span><strong>Internal Site ID is automatic</strong><small>The next ID will be generated after saving. UltraTech SR ID remains optional.</small></span></div>}
        {module === "Godown & Materials" && <div className="form-notice"><Icon name="box" size={17} /><span><strong>Confirmed transactions update stock</strong><small>Site issues that would create negative stock are blocked automatically.</small></span></div>}
        {module === "Users & Settings" && <div className="form-notice"><Icon name="shield" size={17} /><span><strong>Phase 1 role presets</strong><small>Access is limited to the four agreed roles. Custom permission matrices are postponed.</small></span></div>}
        <div className="drawer-form">
          {fields.map((field) => (
            <label className={field.type === "textarea" ? "span-two" : ""} key={field.label}>
              <span>{field.label}{field.required && <b> *</b>}</span>
              {field.type === "select" ? <select defaultValue=""><option value="" disabled>{field.placeholder}</option>{field.options?.map((option) => <option key={option}>{option}</option>)}</select>
                : field.type === "textarea" ? <textarea rows={3} placeholder={field.placeholder} />
                : field.type === "file" ? <span className="file-drop"><Icon name="document" size={18} /><span><strong>{field.placeholder}</strong><small>PDF, JPG or PNG · max 10 MB</small></span></span>
                : <input placeholder={field.placeholder} />}
            </label>
          ))}
          {module === "Labour Expense Claims" && <div className="receipt-warning span-two"><Icon name="alert" size={16} /><span>If no receipt is attached, the claim will be clearly marked <strong>No receipt</strong> and a reason will be required.</span></div>}
        </div>
        <footer><Button variant="secondary" onClick={onClose}>Cancel</Button><Button icon="check" onClick={onSave}>Save record</Button></footer>
      </aside>
    </div>
  );
}

function InspectionCalculator({ onBack, notify }: { onBack: () => void; notify: (message: string) => void }) {
  const inspectionSites = [
    { id: "GH-0147", name: "Aarunya Villa", customer: "Ananya Sharma", address: "Whitefield, Bengaluru", areas: "Toilet, Balcony" },
    { id: "GH-0148", name: "Krishna Residency", customer: "Raghavendra Rao", address: "Jayanagar, Bengaluru", areas: "Terrace, Utility" },
    { id: "GH-0145", name: "Prestige Warehouse", customer: "Karthik Industries", address: "Hosur Road, Bengaluru", areas: "Terrace, External wall" },
  ];
  const [siteId, setSiteId] = useState("GH-0147");
  const selectedSite = inspectionSites.find((site) => site.id === siteId) ?? inspectionSites[0];
  const [buildingType, setBuildingType] = useState("Existing building");
  const [length, setLength] = useState("4");
  const [width, setWidth] = useState("6");
  const [height, setHeight] = useState("7");
  const [door, setDoor] = useState("2.5");
  const [otherOpening, setOtherOpening] = useState("0");
  const [terraceLength, setTerraceLength] = useState("40");
  const [terraceWidth, setTerraceWidth] = useState("22");
  const [terraceDeduction, setTerraceDeduction] = useState("80");
  const number = (value: string) => Number.parseFloat(value) || 0;
  const floorArea = number(length) * number(width);
  const perimeter = 2 * (number(length) + number(width));
  const netWall = Math.max(0, perimeter - number(door) - number(otherOpening));
  const wallArea = netWall * number(height);
  const toiletTotal = floorArea + wallArea;
  const terraceGross = number(terraceLength) * number(terraceWidth);
  const terraceNet = Math.max(0, terraceGross - number(terraceDeduction));

  return (
    <div className="content functional-page">
      <button className="back-link" onClick={onBack}><Icon name="chevron" size={14} />Back to inspections</button>
      <section className="page-heading module-heading">
        <div><p className="eyebrow">NEW INSPECTION · {selectedSite.id}</p><h1>Inspection & measurement</h1><p>{selectedSite.name} · {selectedSite.address}</p></div>
        <div className="heading-actions"><Button variant="secondary" onClick={() => notify(`Draft inspection saved to ${selectedSite.id}`)}>Save draft</Button><Button icon="check" onClick={() => notify(`Inspection submitted for ${selectedSite.id}`)}>Submit inspection</Button></div>
      </section>
      <div className="stepper">
        {["Site details", "Inspection", "Measurements", "Photos", "Review"].map((step, index) => <div className={index <= 2 ? "done" : ""} key={step}><span>{index < 2 ? <Icon name="check" size={12} /> : index + 1}</span><b>{step}</b></div>)}
      </div>
      <div className="functional-grid">
        <section className="panel calculator-panel">
          <div className="form-section-head"><div><span className="section-number">01</span><div><h2>Linked site</h2><p>Every inspection and measurement record belongs to one saved site.</p></div></div><span className="required-chip">Required</span></div>
          <div className="site-association">
            <label><span>Internal Site ID / project</span><select value={siteId} onChange={(event) => setSiteId(event.target.value)}>{inspectionSites.map((site) => <option value={site.id} key={site.id}>{site.id} · {site.name}</option>)}</select></label>
            <div className="linked-site-details">
              <span className="record-icon"><Icon name="building" size={17} /></span>
              <div><small>Customer</small><strong>{selectedSite.customer}</strong></div>
              <div><small>Site address</small><strong>{selectedSite.address}</strong></div>
              <div><small>Application areas</small><strong>{selectedSite.areas}</strong></div>
              <span className="linked-badge"><Icon name="check" size={11} />Linked</span>
            </div>
          </div>

          <div className="form-section-head divider-top"><div><span className="section-number">02</span><div><h2>Building assessment</h2><p>Record the inspection type and observed site conditions for {selectedSite.id}.</p></div></div></div>
          <div className="segmented">{["New building", "Existing building"].map((type) => <button className={buildingType === type ? "active" : ""} onClick={() => setBuildingType(type)} key={type}>{type}</button>)}</div>
          <div className="inspection-fields">
            <label><span>Application area</span><select><option>Toilet</option><option>Terrace</option><option>Balcony</option><option>Sump</option><option>Water Tank</option></select></label>
            <label><span>Surface wetness</span><select><option>Dry</option><option>Damp</option><option>Wet / Standing Water</option></select></label>
            <label className="span-two"><span>{buildingType === "Existing building" ? "Observed problems" : "Surface condition"}</span><div className="choice-grid">{(buildingType === "Existing building" ? ["Leakage / Seepage", "Dampness", "Cracks", "Peeling", "Water stagnation", "Failed coating"] : ["Clean", "Dust present", "Loose material", "Debris present"]).map((choice) => <button key={choice}>{choice}</button>)}</div></label>
            <label className="span-two"><span>Findings and suspected cause</span><textarea rows={3} placeholder="Describe the exact problem location and your findings…" /></label>
          </div>

          <div className="form-section-head divider-top"><div><span className="section-number">03</span><div><h2>Toilet T1 measurement</h2><p>Wall height is always entered manually. Opening deductions apply only when excluded from scope.</p></div></div><button className="small-action"><Icon name="plus" size={13} />Add toilet</button></div>
          <div className="measurement-inputs">
            <MeasureInput label="Floor length" value={length} setValue={setLength} />
            <MeasureInput label="Floor width" value={width} setValue={setWidth} />
            <MeasureInput label="Wall height" value={height} setValue={setHeight} />
            <MeasureInput label="Door deduction" value={door} setValue={setDoor} />
            <MeasureInput label="Other openings" value={otherOpening} setValue={setOtherOpening} />
          </div>
          <div className="calculation-strip">
            <Calc label="Floor area" value={floorArea} />
            <Calc label="Perimeter" value={perimeter} unit="ft" />
            <Calc label="Net wall length" value={netWall} unit="ft" />
            <Calc label="Wall area" value={wallArea} />
            <Calc label="Combined total" value={toiletTotal} strong />
          </div>

          <div className="form-section-head divider-top"><div><span className="section-number">04</span><div><h2>Terrace section A</h2><p>Record regular sections and approved exclusions separately.</p></div></div><button className="small-action"><Icon name="plus" size={13} />Add section</button></div>
          <div className="measurement-inputs terrace">
            <MeasureInput label="Section length" value={terraceLength} setValue={setTerraceLength} />
            <MeasureInput label="Section width" value={terraceWidth} setValue={setTerraceWidth} />
            <MeasureInput label="Approved exclusions" value={terraceDeduction} setValue={setTerraceDeduction} />
          </div>
          <div className="terrace-result"><span>Gross area <strong>{terraceGross.toFixed(1)} sq ft</strong></span><Icon name="arrow" size={15} /><span>Deductions <strong>{number(terraceDeduction).toFixed(1)} sq ft</strong></span><Icon name="arrow" size={15} /><span className="net">Net applied area <strong>{terraceNet.toFixed(1)} sq ft</strong></span></div>
        </section>
        <aside className="functional-side">
          <section className="panel summary-card">
            <div><span className="insight-icon"><Icon name="document" size={18} /></span><div><h2>Measurement summary</h2><p>Updates as values change</p></div></div>
            <div className="summary-line"><span>Toilet T1<small>Floor + wall area</small></span><strong>{toiletTotal.toFixed(1)} sq ft</strong></div>
            <div className="summary-line"><span>Terrace<small>Net applied area</small></span><strong>{terraceNet.toFixed(1)} sq ft</strong></div>
            <div className="grand-total"><span>Grand total</span><strong>{(toiletTotal + terraceNet).toFixed(1)} <small>sq ft</small></strong></div>
          </section>
          <section className="panel test-card"><span><Icon name="check" size={15} /></span><div><strong>Approved test case matches</strong><p>4 × 6 ft, wall 7 ft, door 2.5 ft produces a combined total of 146.5 sq ft.</p></div></section>
          <section className="panel photo-drop"><Icon name="document" size={22} /><strong>Add inspection photos</strong><span>Caption and area label required</span><button onClick={() => notify("Photo picker opened")}>Choose photos</button></section>
        </aside>
      </div>
    </div>
  );
}

function MeasureInput({ label, value, setValue }: { label: string; value: string; setValue: (value: string) => void }) {
  return <label><span>{label}</span><div><input type="number" min="0" step="0.1" value={value} onChange={(event) => setValue(event.target.value)} /><small>ft</small></div></label>;
}

function Calc({ label, value, unit = "sq ft", strong = false }: { label: string; value: number; unit?: string; strong?: boolean }) {
  return <span className={strong ? "strong" : ""}><small>{label}</small><b>{value.toFixed(1)} <em>{unit}</em></b></span>;
}

function SiteReportBuilder({ onBack, notify }: { onBack: () => void; notify: (message: string) => void }) {
  const [photos, setPhotos] = useState("Selected photos");
  return (
    <div className="content functional-page report-builder">
      <button className="back-link" onClick={onBack}><Icon name="chevron" size={14} />Back to site reports</button>
      <section className="page-heading module-heading">
        <div><p className="eyebrow">PHASE 1 SITE REPORT</p><h1>Generate site report</h1><p>Preview the agreed branded A4 format before downloading.</p></div>
        <div className="heading-actions"><Button variant="secondary" onClick={() => notify("Report preview refreshed")}>Refresh preview</Button><Button icon="download" onClick={() => notify("Site report PDF generated")}>Download PDF</Button></div>
      </section>
      <div className="report-layout">
        <aside className="panel report-options">
          <label><span>Site</span><select><option>GH-0148 · Krishna Residency</option><option>GH-0145 · Prestige Warehouse</option></select></label>
          <div className="option-group"><strong>Included in agreed format</strong>{["Customer and site details", "Inspection findings", "Measurements and totals", "Quotation status", "Material records", "Progress and photos", "Basic invoice status"].map((section) => <div className="fixed-section" key={section}><Icon name="check" size={11} /><span>{section}</span></div>)}</div>
          <label><span>Photo option</span><select value={photos} onChange={(event) => setPhotos(event.target.value)}><option>Selected photos</option><option>All photos</option><option>Summary only</option></select></label>
          <div className="permission-note"><Icon name="shield" size={17} /><span><strong>Permission-aware export</strong><small>Financial sections are included because you are an Owner/Admin.</small></span></div>
        </aside>
        <section className="report-preview">
          <div className="paper">
            <header><div className="report-logo"><img src="/green-home-logo.png" alt="Green Home Building Solutions" /></div><div><strong>SITE REPORT</strong><span>Generated 18 June 2025</span></div></header>
            <div className="report-title"><span>GH-0148</span><h2>Krishna Residency</h2><p>Raghavendra Rao · Jayanagar, Bengaluru</p></div>
            <div className="report-summary"><span><small>Status</small><strong>Ongoing</strong></span><span><small>Site type</small><strong>Residential</strong></span><span><small>Supervisor</small><strong>Mahesha</strong></span><span><small>Lead source</small><strong>Direct</strong></span></div>
            <ReportSection number="01" title="Inspection findings"><p>Existing terrace coating shows localized failure near the northwest drain outlet. Surface is damp with visible cracks along the parapet junction.</p><div className="finding-tags"><span>Water stagnation</span><span>Failed coating</span><span>Cracks</span></div></ReportSection>
            <ReportSection number="02" title="Measurement summary"><div className="report-measurements"><span>Terrace net area<strong>1,840 sq ft</strong></span><span>Parapet area<strong>286 sq ft</strong></span><span>Utility area<strong>164 sq ft</strong></span><span>Grand total<strong>2,290 sq ft</strong></span></div></ReportSection>
            <ReportSection number="03" title={`Progress photos · ${photos}`}><div className="photo-grid"><span><i>Surface preparation</i></span><span><i>Crack treatment</i></span><span><i>Waterproofing · Coat 1</i></span></div></ReportSection>
            <footer>Green Home Building Solutions · Bengaluru, Karnataka <span>Page 1 of 6</span></footer>
          </div>
        </section>
      </div>
    </div>
  );
}

function ReportSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <section className="report-section"><h3><span>{number}</span>{title}</h3>{children}</section>;
}

type DemoUser = { name: string; email: string; role: string; initials: string };

const demoUsers: DemoUser[] = [
  { name: "Admin User", email: "admin@gmail.com", role: "Owner / Admin", initials: "AD" },
  { name: "Site Supervisor", email: "super@gmail.com", role: "Site Supervisor", initials: "SV" },
];

function AuthScreen({ screen, setScreen, onLogin }: { screen: "login" | "forgot" | "reset"; setScreen: (screen: "login" | "forgot" | "reset") => void; onLogin: (user: DemoUser) => void }) {
  const copy = screen === "login" ? { eyebrow: "SECURE STAFF ACCESS", title: "Welcome back", detail: "Sign in to manage Green Home sites and operations." } : screen === "forgot" ? { eyebrow: "PASSWORD RECOVERY", title: "Reset your password", detail: "Enter your registered email and we’ll send a secure reset link." } : { eyebrow: "CREATE NEW PASSWORD", title: "Choose a new password", detail: "Use at least 8 characters with a number and special character." };
  const [email, setEmail] = useState(demoUsers[0].email);
  const [password, setPassword] = useState("test123");
  const [loginError, setLoginError] = useState("");
  const selectAccount = (user: DemoUser) => {
    setEmail(user.email);
    setPassword("test123");
    setLoginError("");
  };
  const submitLogin = () => {
    const user = demoUsers.find((candidate) => candidate.email === email.trim().toLowerCase());
    if (!user || password !== "test123") {
      setLoginError("Use one of the listed demo accounts with password test123.");
      return;
    }
    onLogin(user);
  };
  return (
    <div className="auth-page">
      <section className="auth-brand">
        <div className="auth-logo"><img src="/green-home-logo.png" alt="Green Home Building Solutions" /></div>
        <div className="auth-message"><span><Icon name="shield" size={24} /></span><h1>Every site. Every detail.<br />One secure workspace.</h1><p>From first inspection through work progress, payments and final site reporting.</p></div>
        <small>Cloud operations platform · Bengaluru</small>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-form">
          <p className="eyebrow">{copy.eyebrow}</p><h2>{copy.title}</h2><p>{copy.detail}</p>
          {screen === "login" && <>
            <div className="demo-account-label">Choose a demo account</div>
            <div className="demo-accounts">
              {demoUsers.map((user) => <button className={email === user.email ? "active" : ""} key={user.email} onClick={() => selectAccount(user)}><span>{user.initials}</span><span><strong>{user.role}</strong><small>{user.email}</small></span><i>{email === user.email && <Icon name="check" size={11} />}</i></button>)}
            </div>
            <label><span>Email address</span><div><Icon name="user" size={16} /><input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setLoginError(""); }} /></div></label>
            <label><span>Password <button onClick={() => setScreen("forgot")}>Forgot password?</button></span><div><Icon name="shield" size={16} /><input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setLoginError(""); }} /></div></label>
            {loginError && <div className="login-error"><Icon name="alert" size={14} />{loginError}</div>}
            <Button onClick={submitLogin}>Sign in securely</Button>
            <div className="demo-password"><span>Demo password</span><strong>test123</strong></div>
            <div className="auth-security"><Icon name="shield" size={15} />Demo authentication · Supabase Auth will replace this in production</div>
          </>}
          {screen === "forgot" && <><label><span>Registered email address</span><div><Icon name="user" size={16} /><input type="email" placeholder="you@company.com" /></div></label><Button onClick={() => setScreen("reset")}>Send reset link</Button><button className="auth-back" onClick={() => setScreen("login")}>Back to sign in</button></>}
          {screen === "reset" && <><label><span>New password</span><div><Icon name="shield" size={16} /><input type="password" placeholder="Enter new password" /></div></label><label><span>Confirm password</span><div><Icon name="shield" size={16} /><input type="password" placeholder="Repeat new password" /></div></label><Button onClick={() => setScreen("login")}>Update password</Button></>}
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const initialPage = decodeURIComponent(window.location.hash.slice(1));
  const [activeNav, setActiveNav] = useState(moduleConfigs[initialPage] || initialPage === "Overview" ? initialPage || "Overview" : "Overview");
  const [projectFilter, setProjectFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [functionalScreen, setFunctionalScreen] = useState<"inspection" | "report" | null>(null);
  const [authScreen, setAuthScreen] = useState<"login" | "forgot" | "reset" | null>("login");
  const [currentUser, setCurrentUser] = useState<DemoUser>(demoUsers[0]);

  const visibleProjects = useMemo(() => projects.filter((project) => {
    const matchesFilter = projectFilter === "All" || project.status === projectFilter;
    const query = search.toLowerCase();
    return matchesFilter && [project.id, project.name, project.client, project.location].some((value) => value.toLowerCase().includes(query));
  }), [projectFilter, search]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const navigate = (page: string) => {
    setActiveNav(page);
    window.location.hash = encodeURIComponent(page);
    setSearch("");
    setProfileOpen(false);
    setDrawerOpen(false);
    setFunctionalScreen(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openPrimaryAction = () => {
    if (activeNav === "Inspections") setFunctionalScreen("inspection");
    else if (activeNav === "Site Reports") setFunctionalScreen("report");
    else setDrawerOpen(true);
  };

  useEffect(() => {
    const syncHash = () => {
      const page = decodeURIComponent(window.location.hash.slice(1));
      if (page === "Overview" || moduleConfigs[page]) setActiveNav(page);
    };
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  if (authScreen) {
    return <AuthScreen screen={authScreen} setScreen={setAuthScreen} onLogin={(user) => { setCurrentUser(user); setAuthScreen(null); notify(`Signed in as ${user.role}`); }} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><img className="brand-logo" src="/green-home-logo.png" alt="Green Home Building Solutions" /></div>
        <nav className="navigation" aria-label="Primary navigation">
          {navItems.map((item) => item.section ? (
            <div className="nav-section" key={item.label}>{item.label}</div>
          ) : (
            <button className={`nav-item ${activeNav === item.label ? "active" : ""}`} key={item.label} onClick={() => navigate(item.label)}>
              <Icon name={item.icon} size={18} /><span>{item.label}</span>
              {item.label === "Quotations" && <em>5</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className={`nav-item ${activeNav === "Users & Settings" ? "active" : ""}`} onClick={() => navigate("Users & Settings")}><Icon name="settings" size={18} /><span>Users & Settings</span></button>
          <div className="support-card">
            <span><Icon name="shield" size={18} /></span>
            <div><strong>Data protected</strong><small>Last backup today, 4:30 AM</small></div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <label className="global-search">
            <Icon name="search" size={18} />
            <input aria-label="Search records" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Site ID, customer, phone, project or SR ID..." />
            <kbd>⌘ K</kbd>
          </label>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications" onClick={() => notify("You have 6 unread notifications")}><Icon name="bell" size={20} /><i /></button>
            <div className="profile-wrap">
              <button className="profile" onClick={() => setProfileOpen(!profileOpen)}>
                <span className="avatar">{currentUser.initials}</span>
                <span><strong>{currentUser.name}</strong><small>{currentUser.role}</small></span>
                <Icon name="chevron" size={15} />
              </button>
              {profileOpen && <div className="profile-menu"><button onClick={() => navigate("Users & Settings")}>My profile</button><button onClick={() => navigate("Users & Settings")}>Account settings</button><button onClick={() => setAuthScreen("login")}>Sign out</button></div>}
            </div>
          </div>
        </header>

        {functionalScreen === "inspection" ? <InspectionCalculator onBack={() => setFunctionalScreen(null)} notify={notify} />
          : functionalScreen === "report" ? <SiteReportBuilder onBack={() => setFunctionalScreen(null)} notify={notify} />
          : activeNav === "Overview" ? <div className="content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">WEDNESDAY, 18 JUNE 2025</p>
              <h1>Good morning, {currentUser.name.split(" ")[0]}</h1>
              <p>Here’s what’s happening across your sites today.</p>
            </div>
            <div className="heading-actions">
              <Button icon="plus" onClick={() => navigate("Sites")}>Add new site</Button>
            </div>
          </section>

          <section className="toolbar">
            <div className="date-control"><Icon name="calendar" size={16} /><span>01 Jun – 30 Jun 2025</span><Icon name="chevron" size={14} /></div>
            <span className="divider" />
            <button className="filter-control">All statuses <Icon name="chevron" size={13} /></button>
            <button className="filter-control">All supervisors <Icon name="chevron" size={13} /></button>
            <button className="filter-control">All sources <Icon name="chevron" size={13} /></button>
            <button className="reset-filter" onClick={() => { setProjectFilter("All"); setSearch(""); }}>Reset filters</button>
          </section>

          <section className="metrics">
            <MetricCard label="ACTIVE SITES" value="24" meta=" current work sites" icon="building" tone="green" onClick={() => navigate("Sites")} />
            <MetricCard label="VISITS DUE" value="7" meta=" 3 scheduled today" icon="calendar" tone="amber" onClick={() => navigate("Inspections")} />
            <MetricCard label="FOLLOW-UPS" value="5" meta=" 2 overdue" icon="clock" tone="blue" onClick={() => navigate("Quotations")} />
            <MetricCard label="OUTSTANDING" value="₹4.82L" meta=" across 8 invoices" icon="wallet" tone="red" onClick={() => navigate("Invoices & Payments")} />
          </section>

          <section className="finance-strip scope-strip">
            <div className="finance-intro">
              <span className="finance-icon"><Icon name="alert" size={21} /></span>
              <div><span>Pending activities</span><strong>Requires attention</strong></div>
            </div>
            <button className="finance-stat" onClick={() => navigate("Inspections")}><span>VISITS DUE</span><strong>7</strong></button>
            <button className="finance-stat" onClick={() => navigate("Quotations")}><span>FOLLOW-UPS</span><strong>5</strong></button>
            <button className="finance-stat warning" onClick={() => navigate("Invoices & Payments")}><span>OVERDUE INVOICES</span><strong>3</strong></button>
            <button className="finance-stat warning" onClick={() => navigate("Godown & Materials")}><span>LOW STOCK</span><strong>2</strong></button>
            <button className="text-link" onClick={() => navigate("Sites")}>Open activity list <Icon name="arrow" size={15} /></button>
          </section>

          <div className="dashboard-grid">
            <section className="panel sites-panel">
              <div className="panel-header">
                <div><h2>Recent sites</h2><p>Latest site activity and upcoming work</p></div>
                <button className="text-link" onClick={() => navigate("Sites")}>View all sites <Icon name="arrow" size={15} /></button>
              </div>
              <div className="tabs" role="tablist">
                {["All", "Ongoing", "Visit Scheduled", "Quotation Sent", "Completed"].map((tab) => <button role="tab" aria-selected={projectFilter === tab} className={projectFilter === tab ? "active" : ""} key={tab} onClick={() => setProjectFilter(tab)}>{tab}{tab === "All" && <span>42</span>}</button>)}
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>SITE</th><th>STATUS</th><th>SUPERVISOR</th><th>VALUE</th><th>NEXT ACTION</th><th /></tr></thead>
                  <tbody>
                    {visibleProjects.map((project) => (
                      <tr key={project.id} onClick={() => notify(`${project.id} · ${project.name} opened`)}>
                        <td><div className="site-cell"><span className={`site-avatar ${project.tone}`}>{project.initials}</span><div><strong>{project.name}</strong><span>{project.id} · {project.location}</span></div></div></td>
                        <td><Status value={project.status} /></td>
                        <td><span className="supervisor"><i>{project.supervisor.slice(0, 1)}</i>{project.supervisor}</span></td>
                        <td><strong className="money">{project.value}</strong></td>
                        <td><div className="next-action"><strong>{project.type}</strong><span>{project.date}</span></div></td>
                        <td><button className="row-more" aria-label={`More actions for ${project.name}`} onClick={(event) => { event.stopPropagation(); notify(`Actions for ${project.id}`); }}><Icon name="more" size={18} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visibleProjects.length === 0 && <div className="empty"><Icon name="search" size={22} /><strong>No matching sites</strong><span>Try a different status or search term.</span></div>}
              </div>
            </section>

            <aside className="right-column">
              <section className="panel alerts-panel">
                <div className="panel-header compact"><div><h2>Needs attention</h2><p>Items requiring action</p></div><span className="count-badge">10</span></div>
                <div className="alert-list">
                  {alerts.map((alert) => <button className="alert-item" key={alert.title} onClick={() => notify(alert.action)}><span className={`alert-icon ${alert.tone}`}><Icon name={alert.icon} size={17} /></span><span><strong>{alert.title}</strong><small>{alert.detail}</small></span><Icon name="chevron" size={15} /></button>)}
                </div>
                <button className="all-alerts" onClick={() => notify("All alerts opened")}>View all alerts <Icon name="arrow" size={15} /></button>
              </section>

              <section className="panel schedule-panel">
                <div className="panel-header compact"><div><h2>Today’s schedule</h2><p>Wednesday, 18 June</p></div><button className="calendar-button"><Icon name="calendar" size={17} /></button></div>
                <div className="timeline">
                  <div className="timeline-item"><time>09:30</time><i /><div><strong>Site inspection</strong><span>Aarunya Villa · GH-0147</span><small>Govinda · Whitefield</small></div></div>
                  <div className="timeline-item"><time>11:00</time><i className="blue" /><div><strong>Material delivery</strong><span>Krishna Residency · GH-0148</span><small>Dr. Fixit LW+ · 12 units</small></div></div>
                  <div className="timeline-item"><time>15:30</time><i className="amber" /><div><strong>Customer follow-up</strong><span>Prestige Warehouse · GH-0145</span><small>Quotation revision #2</small></div></div>
                </div>
              </section>
            </aside>
          </div>
        </div> : <ModulePage key={activeNav} config={moduleConfigs[activeNav]} search={search} notify={notify} onPrimary={openPrimaryAction} />}
      </main>
      {drawerOpen && <FormDrawer module={activeNav} onClose={() => setDrawerOpen(false)} onSave={() => { setDrawerOpen(false); notify("Record saved successfully"); }} />}
      {toast && <div className="toast"><span><Icon name="check" size={15} /></span>{toast}<button aria-label="Dismiss notification" onClick={() => setToast("")}><Icon name="close" size={14} /></button></div>}
    </div>
  );
}
