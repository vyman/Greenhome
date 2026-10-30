import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";

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

function displayStatus(value: string) {
  return value.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object") {
    const record = error as { message?: string; details?: string; hint?: string; code?: string };
    return [record.message, record.details, record.hint, record.code ? `Code: ${record.code}` : ""].filter(Boolean).join(" · ");
  }
  return String(error || "Unknown Supabase error");
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
    title: "Users & settings", eyebrow: "ACCESS CONTROL", description: "Manage staff accounts, six role presets and basic audit history.", primary: "Invite user", icon: "settings",
    tabs: ["Users", "Role presets", "Alerts", "Business profile", "Audit log"],
    metrics: [
      { label: "ACTIVE USERS", value: "12", note: "6 role presets", tone: "green" },
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

function ModulePage({ config, search, notify, onPrimary, onRowOpen }: { config: ModuleConfig; search: string; notify: (message: string) => void; onPrimary: () => void; onRowOpen?: (row: string[]) => void }) {
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
                  <tr key={`${row[0]}-${rowIndex}`} onClick={() => onRowOpen ? onRowOpen(row) : notify(`${row[0].split("\n")[0]} opened`)}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${cell}-${cellIndex}`}>
                        {cellIndex === 0 ? <div className="primary-cell"><span className={`record-icon tone-${rowIndex % 5}`}><Icon name={config.icon} size={15} /></span><span>{cell.split("\n").map((line, lineIndex) => lineIndex === 0 ? <strong key={line}>{line}</strong> : <small key={line}>{line}</small>)}</span></div>
                          : cellIndex === config.badgeColumn ? <Status value={cell} />
                          : <span className={cell.startsWith("₹") ? "table-money" : ""}>{cell}</span>}
                      </td>
                    ))}
                    <td><button className="row-more" aria-label={onRowOpen ? "Open record" : "More actions"} onClick={(event) => { event.stopPropagation(); if (onRowOpen) onRowOpen(row); else notify("Record actions opened"); }}><Icon name={onRowOpen ? "chevron" : "more"} size={18} /></button></td>
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

const applicationAreaOptions = [
  "Toilet / Bathroom",
  "Utility",
  "Sunken Slab",
  "Kitchen",
  "Balcony",
  "Terrace / Roof",
  "Water Tank",
  "Swimming Pool",
  "Podium",
  "Planter Box",
  "Basement",
  "Lift Pit",
  "Retaining Wall",
  "External Wall",
  "Internal Wall",
  "Expansion Joint",
  "Construction Joint",
  "Floor",
  "Roof Garden",
  "Sump",
  "Wet Area",
  "Facade",
  "Parking Area",
  "Other",
];

const leadSourceOptions = [
  "UltraTech Engineer",
  "Direct Customer",
  "Customer Reference",
  "Existing Customer",
  "My Team",
  "Website",
  "Google Search",
  "Social Media",
  "Justdial",
  "IndiaMART",
];

const leadSourceCodes: Record<string, string> = {
  "UltraTech Engineer": "ultratech_engineer",
  "Direct Customer": "direct_customer",
  "Customer Reference": "customer_reference",
  "Existing Customer": "existing_customer",
  "My Team": "my_team",
  Website: "website",
  "Google Search": "google_search",
  "Social Media": "social_media",
  Justdial: "justdial",
  IndiaMART: "indiamart",
};

const applicationAreaCodes: Record<string, string> = Object.fromEntries(
  applicationAreaOptions.map((area) => [area, area.toLowerCase().replaceAll(" / ", "_").replaceAll(" ", "_")])
);
const applicationAreaLabels: Record<string, string> = Object.fromEntries(
  Object.entries(applicationAreaCodes).map(([label, code]) => [code, label])
);

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
    { label: "Application areas", placeholder: "Select all applicable areas" },
    { label: "Lead source", placeholder: "Select source", type: "select", options: leadSourceOptions },
    { label: "Referral person", placeholder: "Select referral person", type: "select" },
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
    { label: "Role preset", placeholder: "Select a role", type: "select", options: ["Owner / Admin", "Office Staff", "Site Supervisor", "Store / Godown Staff", "UltraTech Technical Executive", "Labour / Field Worker"], required: true },
    { label: "Assigned sites", placeholder: "Applicable to Site Supervisor" },
    { label: "Account note", placeholder: "Optional internal note", type: "textarea" },
  ],
};

function FormDrawer({ module, onClose, onSave, initialValues, editing }: { module: string; onClose: () => void; onSave: (values: Record<string, string>, files: Record<string, File>) => Promise<string | null>; initialValues?: Record<string, string>; editing?: boolean }) {
  const fields = formFields[module] || [
    { label: "Related site", placeholder: "Select Site ID", type: "select" as const, options: ["GH-0148 · Krishna Residency", "GH-0147 · Aarunya Villa"], required: true },
    { label: "Details", placeholder: "Enter record details", type: "textarea" as const, required: true },
    { label: "Supporting document", placeholder: "Upload file", type: "file" as const },
  ];
  const createTitle = module === "Labour Expense Claims" ? "New expense claim" : module === "Sites" ? "Add new site" : module === "Customers" ? "Add customer" : module === "Work Progress" ? "Post progress update" : module === "Invoices & Payments" ? "Create invoice" : `Add ${module.toLowerCase()} record`;
  const title = editing && module === "Customers" ? "Edit customer" : editing && module === "Sites" ? "Edit site" : createTitle;
  const [values, setValues] = useState<Record<string, string>>(initialValues || {});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, string[]>>({});
  const [customerChoices, setCustomerChoices] = useState<{ id: string; name: string; phone: string; address: string }[]>([]);
  const [engineerChoices, setEngineerChoices] = useState<{ id: string; name: string; phone: string }[]>([]);
  const [teamChoices, setTeamChoices] = useState<{ id: string; name: string; phone: string }[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
  const [areaPickerOpen, setAreaPickerOpen] = useState(false);
  const [sameAsCustomerAddress, setSameAsCustomerAddress] = useState(false);

  useEffect(() => {
    let active = true;
    const loadOptions = async () => {
      const next: Record<string, string[]> = {};
      if (module === "Sites") {
        const [{ data: customers }, { data: supervisors }, { data: engineers }, { data: teamMembers }] = await Promise.all([
          supabase.from("customers").select("id, name, primary_mobile, billing_address").is("archived_at", null).order("name"),
          supabase.from("profiles").select("full_name").eq("active", true).eq("role", "site_supervisor").order("full_name"),
          supabase.from("ultratech_engineers").select("id, name, phone").eq("active", true).order("name"),
          supabase.from("team_members").select("id, name, phone").eq("active", true).order("name"),
        ]);
        if (customers?.length) {
          setCustomerChoices(customers.map((customer) => ({ id: customer.id, name: customer.name, phone: customer.primary_mobile, address: customer.billing_address || "" })));
          const selected = customers.find((customer) => customer.id === initialValues?.Customer);
          if (selected) {
            setCustomerSearch(`${selected.name} · ${selected.primary_mobile}`);
            if (selected.billing_address && selected.billing_address === initialValues?.["Site address"]) setSameAsCustomerAddress(true);
          }
        }
        if (supervisors?.length) next["Assigned supervisor"] = supervisors.map((profile) => profile.full_name);
        setEngineerChoices((engineers || []).map((engineer) => ({ id: engineer.id, name: engineer.name, phone: engineer.phone || "" })));
        setTeamChoices((teamMembers || []).map((member) => ({ id: member.id, name: member.name, phone: member.phone || "" })));
      }
      if (["Quotations", "Godown & Materials", "Labour & Attendance", "Work Progress", "Labour Expense Claims", "Invoices & Payments"].includes(module)) {
        const { data: sites } = await supabase.from("sites").select("site_code, project_name").is("archived_at", null).order("site_code", { ascending: false });
        if (sites?.length) next.Site = sites.map((site) => `${site.site_code} · ${site.project_name}`);
      }
      if (module === "Godown & Materials") {
        const { data: products } = await supabase.from("products").select("name").eq("active", true).order("name");
        if (products?.length) next.Product = products.map((product) => product.name);
      }
      if (["Labour & Attendance", "Labour Expense Claims"].includes(module)) {
        const { data: labourers } = await supabase.from("labourers").select("name").eq("active", true).order("name");
        if (labourers?.length) next.Labourer = labourers.map((labourer) => labourer.name);
      }
      if (active) setDynamicOptions(next);
    };
    void loadOptions();
    return () => { active = false; };
  }, [module, initialValues?.Customer]);

  const selectedAreas = (values["Application areas"] || "").split(",").map((area) => area.trim()).filter(Boolean);
  const referralChoices = values["Lead source"] === "UltraTech Engineer"
    ? engineerChoices
    : values["Lead source"] === "My Team"
      ? teamChoices
      : customerChoices;
  const referralSource = ["UltraTech Engineer", "My Team", "Customer Reference", "Existing Customer"].includes(values["Lead source"]);

  const submit = async () => {
    const missing = fields.find((field) => field.required && field.type !== "file" && !values[field.label]?.trim());
    const missingFile = fields.find((field) => field.required && field.type === "file" && !files[field.label]);
    if (missing || missingFile) {
      setSaveError(`${(missing || missingFile)?.label} is required.`);
      return;
    }
    if (module === "Sites" && referralSource && !values["Referral person"]) {
      setSaveError("Referral person is required for this lead source.");
      return;
    }
    setSaving(true);
    setSaveError("");
    const error = await onSave(values, files);
    setSaving(false);
    if (error) setSaveError(error);
  };

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
        <div className="drawer-form">
          {fields.map((field) => field.label === "Referral person" && module === "Sites" && !referralSource ? null : field.label === "Application areas" && module === "Sites" ? (
            <div className="multi-select-field span-two" key={field.label}>
              <span>{field.label}</span>
              <button type="button" className={`multi-select-trigger ${areaPickerOpen ? "open" : ""}`} onClick={() => setAreaPickerOpen((open) => !open)}>
                <span>{selectedAreas.length ? `${selectedAreas.length} area${selectedAreas.length === 1 ? "" : "s"} selected` : field.placeholder}</span>
                <Icon name="chevron" size={14} />
              </button>
              {selectedAreas.length > 0 && <div className="selection-chips">{selectedAreas.map((area) => <button type="button" key={area} onClick={() => setValues((current) => ({ ...current, "Application areas": selectedAreas.filter((item) => item !== area).join(", ") }))}>{area}<Icon name="close" size={10} /></button>)}</div>}
              {areaPickerOpen && <div className="multi-select-menu">
                {applicationAreaOptions.map((area) => <label key={area}><input type="checkbox" checked={selectedAreas.includes(area)} onChange={() => { const nextAreas = selectedAreas.includes(area) ? selectedAreas.filter((item) => item !== area) : [...selectedAreas, area]; setValues((current) => ({ ...current, "Application areas": nextAreas.join(", ") })); }} /><span>{area}</span></label>)}
              </div>}
            </div>
          ) : field.label === "Site address" && module === "Sites" ? (
            <div className="site-address-field span-two" key={field.label}>
              <div className="field-label-row"><span>{field.label}{field.required && <b> *</b>}</span><label><input type="checkbox" checked={sameAsCustomerAddress} disabled={!customerChoices.find((choice) => choice.id === values.Customer)?.address} onChange={(event) => { const checked = event.target.checked; setSameAsCustomerAddress(checked); if (checked) { const customer = customerChoices.find((choice) => choice.id === values.Customer); if (customer?.address) setValues((current) => ({ ...current, "Site address": customer.address })); } }} /><span>Same as customer address</span></label></div>
              <textarea rows={3} placeholder={field.placeholder} value={values[field.label] || ""} readOnly={sameAsCustomerAddress} onChange={(event) => setValues((current) => ({ ...current, [field.label]: event.target.value }))} />
              {sameAsCustomerAddress && !customerChoices.find((choice) => choice.id === values.Customer)?.address && <small className="address-warning">The selected customer does not have a saved billing address.</small>}
            </div>
          ) : (
            <label className={field.type === "textarea" ? "span-two" : ""} key={field.label}>
              <span>{field.label}{field.required && <b> *</b>}</span>
              {module === "Sites" && field.label === "Customer" ? <div className="customer-picker">
                <div className="customer-picker-input"><Icon name="search" size={15} /><input value={customerSearch} placeholder="Search customer name or phone…" onFocus={() => setCustomerPickerOpen(true)} onBlur={() => window.setTimeout(() => setCustomerPickerOpen(false), 120)} onChange={(event) => { setCustomerSearch(event.target.value); setSameAsCustomerAddress(false); setValues((current) => ({ ...current, Customer: "" })); setCustomerPickerOpen(true); }} /></div>
                {customerPickerOpen && <div className="customer-picker-menu">
                  {customerChoices.filter((customer) => `${customer.name} ${customer.phone}`.toLowerCase().includes(customerSearch.toLowerCase())).map((customer) => <button type="button" key={customer.id} onMouseDown={(event) => event.preventDefault()} onClick={() => { if (sameAsCustomerAddress && !customer.address) setSameAsCustomerAddress(false); setValues((current) => ({ ...current, Customer: customer.id, ...(sameAsCustomerAddress && customer.address ? { "Site address": customer.address } : {}) })); setCustomerSearch(`${customer.name} · ${customer.phone}`); setCustomerPickerOpen(false); }}><span className="customer-choice-avatar">{customer.name.slice(0, 2).toUpperCase()}</span><span><strong>{customer.name}</strong><small>{customer.phone}</small></span>{values.Customer === customer.id && <Icon name="check" size={14} />}</button>)}
                  {!customerChoices.filter((customer) => `${customer.name} ${customer.phone}`.toLowerCase().includes(customerSearch.toLowerCase())).length && <div className="customer-picker-empty">No customer matches this name or phone number.</div>}
                </div>}
              </div>
                : module === "Sites" && field.label === "Referral person" ? <select value={values[field.label] || ""} onChange={(event) => setValues((current) => ({ ...current, [field.label]: event.target.value }))}><option value="">{referralChoices.length ? field.placeholder : "No active names in this list"}</option>{referralChoices.map((choice) => <option value={choice.id} key={choice.id}>{choice.name}{choice.phone ? ` · ${choice.phone}` : ""}</option>)}</select>
                : field.type === "select" ? <select value={values[field.label] || ""} onChange={(event) => setValues((current) => ({ ...current, [field.label]: event.target.value, ...(module === "Sites" && field.label === "Lead source" ? { "Referral person": "" } : {}) }))}><option value="" disabled>{field.placeholder}</option>{(dynamicOptions[field.label] || field.options)?.map((option) => <option key={option}>{option}</option>)}</select>
                : field.type === "textarea" ? <textarea rows={3} placeholder={field.placeholder} value={values[field.label] || ""} onChange={(event) => setValues((current) => ({ ...current, [field.label]: event.target.value }))} />
                : field.type === "file" ? <span className="file-drop"><input type="file" accept=".pdf,image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) setFiles((current) => ({ ...current, [field.label]: file })); }} /><Icon name="document" size={18} /><span><strong>{files[field.label]?.name || field.placeholder}</strong><small>PDF, JPG, PNG or WebP · max 10 MB</small></span></span>
                : <input placeholder={field.placeholder} value={values[field.label] || ""} onChange={(event) => setValues((current) => ({ ...current, [field.label]: event.target.value }))} />}
            </label>
          ))}
          {module === "Labour Expense Claims" && <div className="receipt-warning span-two"><Icon name="alert" size={16} /><span>If no receipt is attached, the claim will be clearly marked <strong>No receipt</strong> and a reason will be required.</span></div>}
          {saveError && <div className="save-error span-two"><Icon name="alert" size={16} /><span>{saveError}</span></div>}
        </div>
        <footer><Button variant="secondary" onClick={onClose}>Cancel</Button><Button icon="check" onClick={submit}>{saving ? "Saving…" : editing ? `Update ${module === "Sites" ? "site" : "customer"}` : "Save record"}</Button></footer>
      </aside>
    </div>
  );
}

function InspectionCalculator({ onBack, notify, onSaved, existingInspectionId }: { onBack: () => void; notify: (message: string) => void; onSaved: () => Promise<void>; existingInspectionId?: string | null }) {
  const [inspectionSites, setInspectionSites] = useState<{ id: string; name: string; customer: string; address: string; areas: string }[]>([]);
  const [siteId, setSiteId] = useState("");
  const selectedSite = inspectionSites.find((site) => site.id === siteId);
  const [buildingType, setBuildingType] = useState("Existing building");
  const [applicationArea, setApplicationArea] = useState("Toilet");
  const [surfaceWetness, setSurfaceWetness] = useState("Damp");
  const [selectedProblems, setSelectedProblems] = useState<string[]>(["Leakage / Seepage"]);
  const [findings, setFindings] = useState("");
  const [inspectionPhotos, setInspectionPhotos] = useState<File[]>([]);
  const [savedInspectionId, setSavedInspectionId] = useState<string | null>(existingInspectionId || null);
  const [savingInspection, setSavingInspection] = useState(false);
  const [inspectionError, setInspectionError] = useState("");
  const [sitesLoading, setSitesLoading] = useState(true);
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

  useEffect(() => {
    let active = true;
    supabase
      .from("sites")
      .select("site_code, project_name, address, application_areas, customers(name)")
      .is("archived_at", null)
      .order("site_code", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        setSitesLoading(false);
        if (error) {
          setInspectionError(`Loading accessible sites: ${error.message}`);
          return;
        }
        if (!data?.length) {
          setInspectionSites([]);
          setSiteId("");
          return;
        }
        const mapped = data.map((site: any) => ({
          id: site.site_code,
          name: site.project_name,
          customer: Array.isArray(site.customers) ? site.customers[0]?.name || "Customer" : site.customers?.name || "Customer",
          address: site.address,
          areas: (site.application_areas || []).join(", "),
        }));
        setInspectionSites(mapped);
        setSiteId((current) => mapped.some((site) => site.id === current) ? current : mapped[0].id);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!existingInspectionId) setSavedInspectionId(null);
  }, [siteId, existingInspectionId]);

  useEffect(() => {
    if (!existingInspectionId) return;
    let active = true;
    const loadInspection = async () => {
      setSavingInspection(true);
      setInspectionError("");
      const [inspectionResult, toiletResult, terraceResult] = await Promise.all([
        supabase.from("inspections").select("id, site_id, building_type, application_areas, surface_wetness, observed_problems, findings, status").eq("id", existingInspectionId).single(),
        supabase.from("toilet_measurements").select("floor_length_ft, floor_width_ft, wall_height_ft, door_deduction_ft, additional_opening_deduction_ft").eq("inspection_id", existingInspectionId).eq("toilet_id", "T1").maybeSingle(),
        supabase.from("terrace_sections").select("length_ft, width_ft, approved_exclusion_sqft").eq("inspection_id", existingInspectionId).eq("section_name", "Section A").maybeSingle(),
      ]);
      if (!active) return;
      if (inspectionResult.error || !inspectionResult.data) {
        setInspectionError(`Loading inspection: ${inspectionResult.error?.message || "Record not found"}`);
        setSavingInspection(false);
        return;
      }
      const { data: linkedSite, error: linkedSiteError } = await supabase.from("sites").select("site_code").eq("id", inspectionResult.data.site_id).single();
      if (linkedSiteError || !linkedSite) {
        setInspectionError(`Loading linked Site: ${linkedSiteError?.message || "Site not found"}`);
        setSavingInspection(false);
        return;
      }
      const inspection = inspectionResult.data;
      setSiteId(linkedSite.site_code);
      setBuildingType(inspection.building_type === "new" ? "New building" : "Existing building");
      setApplicationArea(inspection.application_areas?.[0] ? displayStatus(inspection.application_areas[0]) : "Toilet");
      const wetnessLabels: Record<string, string> = { dry: "Dry", damp: "Damp", wet_standing_water: "Wet / Standing Water" };
      setSurfaceWetness(wetnessLabels[inspection.surface_wetness] || "Damp");
      const problemLabels: Record<string, string> = {
        leakage_seepage: "Leakage / Seepage",
        dampness: "Dampness",
        cracks: "Cracks",
        peeling: "Peeling",
        water_stagnation: "Water stagnation",
        failed_coating: "Failed coating",
      };
      setSelectedProblems((inspection.observed_problems || []).map((problem: string) => problemLabels[problem] || displayStatus(problem)));
      setFindings(inspection.findings || "");
      if (toiletResult.data) {
        setLength(String(toiletResult.data.floor_length_ft));
        setWidth(String(toiletResult.data.floor_width_ft));
        setHeight(String(toiletResult.data.wall_height_ft));
        setDoor(String(toiletResult.data.door_deduction_ft));
        setOtherOpening(String(toiletResult.data.additional_opening_deduction_ft));
      }
      if (terraceResult.data) {
        setTerraceLength(String(terraceResult.data.length_ft));
        setTerraceWidth(String(terraceResult.data.width_ft));
        setTerraceDeduction(String(terraceResult.data.approved_exclusion_sqft));
      }
      setSavedInspectionId(existingInspectionId);
      setSavingInspection(false);
    };
    void loadInspection();
    return () => { active = false; };
  }, [existingInspectionId]);

  const persistInspection = async (status: "draft" | "submitted") => {
    setSavingInspection(true);
    setInspectionError("");
    let saveStage = "Linking the selected site";
    let inspectionId = savedInspectionId;
    try {
      if (!siteId || !selectedSite) throw new Error("Select a Site that is accessible to your account before saving the inspection.");
      const [{ data: site, error: siteError }, { data: authData }] = await Promise.all([
        supabase.from("sites").select("id").eq("site_code", siteId).single(),
        supabase.auth.getUser(),
      ]);
      if (siteError || !site) throw new Error("The linked site was not found in Supabase.");
      if (!authData.user) throw new Error("Your session has expired.");

      saveStage = "Saving the inspection record";
      if (inspectionId) {
        const { error } = await supabase.from("inspections").update({
          building_type: buildingType === "New building" ? "new" : "existing",
          application_areas: [applicationArea.toLowerCase().replaceAll(" ", "_")],
          surface_wetness: surfaceWetness.toLowerCase().replaceAll(" / ", "_").replaceAll(" ", "_"),
          observed_problems: selectedProblems.map((problem) => problem.toLowerCase().replaceAll(" / ", "_").replaceAll(" ", "_")),
          findings: findings || null,
          status,
        }).eq("id", inspectionId);
        if (error) throw error;
      } else {
        const { data: latest } = await supabase.from("inspections").select("visit_number").eq("site_id", site.id).order("visit_number", { ascending: false }).limit(1).maybeSingle();
        const { data, error } = await supabase.from("inspections").insert({
          site_id: site.id,
          visit_number: (latest?.visit_number || 0) + 1,
          inspected_at: new Date().toISOString(),
          inspector_id: authData.user.id,
          building_type: buildingType === "New building" ? "new" : "existing",
          application_areas: [applicationArea.toLowerCase().replaceAll(" ", "_")],
          surface_wetness: surfaceWetness.toLowerCase().replaceAll(" / ", "_").replaceAll(" ", "_"),
          observed_problems: selectedProblems.map((problem) => problem.toLowerCase().replaceAll(" / ", "_").replaceAll(" ", "_")),
          findings: findings || null,
          status,
        }).select("id").single();
        if (error || !data) throw error || new Error("Inspection could not be created.");
        inspectionId = data.id;
        setSavedInspectionId(data.id);
      }

      await onSaved();
      saveStage = "Saving measurements";
      const [{ error: toiletError }, { error: terraceError }] = await Promise.all([
        supabase.from("toilet_measurements").upsert({
          inspection_id: inspectionId,
          toilet_id: "T1",
          floor_length_ft: number(length),
          floor_width_ft: number(width),
          wall_height_ft: number(height),
          door_deduction_ft: number(door),
          additional_opening_deduction_ft: number(otherOpening),
        }, { onConflict: "inspection_id,toilet_id" }),
        supabase.from("terrace_sections").upsert({
          inspection_id: inspectionId,
          section_name: "Section A",
          length_ft: number(terraceLength),
          width_ft: number(terraceWidth),
          approved_exclusion_sqft: number(terraceDeduction),
        }, { onConflict: "inspection_id,section_name" }),
      ]);
      if (toiletError) throw toiletError;
      if (terraceError) throw terraceError;

      saveStage = "Uploading inspection photos";
      for (const file of inspectionPhotos) {
        if (file.size > 10 * 1024 * 1024) throw new Error(`${file.name} is larger than 10 MB.`);
        const objectPath = `${site.id}/inspection_photo/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
        const { error: uploadError } = await supabase.storage.from("site-files").upload(objectPath, file, { contentType: file.type });
        if (uploadError) throw uploadError;
        const { error: fileError } = await supabase.from("site_files").insert({
          site_id: site.id,
          inspection_id: inspectionId,
          category: "inspection_photo",
          caption: file.name,
          bucket_id: "site-files",
          object_path: objectPath,
          mime_type: file.type,
          size_bytes: file.size,
          uploaded_by: authData.user.id,
          captured_at: new Date().toISOString(),
        });
        if (fileError) throw fileError;
      }
      setInspectionPhotos([]);
      saveStage = "Refreshing the inspection list";
      await onSaved();
      notify(status === "draft" ? `Draft inspection saved to ${siteId}` : `Inspection submitted for ${siteId}`);
      if (status === "submitted") onBack();
    } catch (error) {
      if (inspectionId) await onSaved();
      const message = `${saveStage}: ${errorMessage(error)}`;
      setInspectionError(message);
      notify(message);
    } finally {
      setSavingInspection(false);
    }
  };

  return (
    <div className="content functional-page">
      <button className="back-link" onClick={onBack}><Icon name="chevron" size={14} />Back to inspections</button>
      <section className="page-heading module-heading">
        <div><p className="eyebrow">{existingInspectionId ? "EDIT INSPECTION" : "NEW INSPECTION"}{selectedSite ? ` · ${selectedSite.id}` : ""}</p><h1>Inspection & measurement</h1><p>{selectedSite ? `${selectedSite.name} · ${selectedSite.address}` : "Select an accessible Site to begin"}</p></div>
        <div className="heading-actions"><Button variant="secondary" onClick={() => persistInspection("draft")}>{savingInspection ? "Saving…" : "Save draft"}</Button><Button icon="check" onClick={() => persistInspection("submitted")}>{savingInspection ? "Saving…" : "Submit inspection"}</Button></div>
      </section>
      <div className="stepper">
        {["Site details", "Inspection", "Measurements", "Photos", "Review"].map((step, index) => <div className={index <= 2 ? "done" : ""} key={step}><span>{index < 2 ? <Icon name="check" size={12} /> : index + 1}</span><b>{step}</b></div>)}
      </div>
      {inspectionError && <div className="inspection-error"><Icon name="alert" size={16} /><span><strong>Inspection was not saved.</strong>{inspectionError}</span></div>}
      <div className="functional-grid">
        <section className="panel calculator-panel">
          <div className="form-section-head"><div><span className="section-number">01</span><div><h2>Linked site</h2><p>Every inspection and measurement record belongs to one saved site.</p></div></div><span className="required-chip">Required</span></div>
          <div className="site-association">
            <label><span>Internal Site ID / project</span><select value={siteId} disabled={Boolean(existingInspectionId) || sitesLoading || !inspectionSites.length} onChange={(event) => setSiteId(event.target.value)}><option value="">{sitesLoading ? "Loading accessible sites…" : inspectionSites.length ? "Select site" : "No accessible sites found"}</option>{inspectionSites.map((site) => <option value={site.id} key={site.id}>{site.id} · {site.name}</option>)}</select></label>
            {selectedSite ? <div className="linked-site-details">
              <span className="record-icon"><Icon name="building" size={17} /></span>
              <div><small>Customer</small><strong>{selectedSite.customer}</strong></div>
              <div><small>Site address</small><strong>{selectedSite.address}</strong></div>
              <div><small>Application areas</small><strong>{selectedSite.areas}</strong></div>
              <span className="linked-badge"><Icon name="check" size={11} />Linked</span>
            </div> : <div className="no-site-access"><Icon name="alert" size={16} /><span>No Site is available for inspection. Assign this user to a Site or sign in with an account that has Site access.</span></div>}
          </div>

          <div className="form-section-head divider-top"><div><span className="section-number">02</span><div><h2>Building assessment</h2><p>Record the inspection type and observed site conditions{selectedSite ? ` for ${selectedSite.id}` : ""}.</p></div></div></div>
          <div className="segmented">{["New building", "Existing building"].map((type) => <button className={buildingType === type ? "active" : ""} onClick={() => setBuildingType(type)} key={type}>{type}</button>)}</div>
          <div className="inspection-fields">
            <label><span>Application area</span><select value={applicationArea} onChange={(event) => setApplicationArea(event.target.value)}><option>Toilet</option><option>Terrace</option><option>Balcony</option><option>Sump</option><option>Water Tank</option></select></label>
            <label><span>Surface wetness</span><select value={surfaceWetness} onChange={(event) => setSurfaceWetness(event.target.value)}><option>Dry</option><option>Damp</option><option>Wet / Standing Water</option></select></label>
            <label className="span-two"><span>{buildingType === "Existing building" ? "Observed problems" : "Surface condition"}</span><div className="choice-grid">{(buildingType === "Existing building" ? ["Leakage / Seepage", "Dampness", "Cracks", "Peeling", "Water stagnation", "Failed coating"] : ["Clean", "Dust present", "Loose material", "Debris present"]).map((choice) => <button className={selectedProblems.includes(choice) ? "selected" : ""} onClick={() => setSelectedProblems((current) => current.includes(choice) ? current.filter((item) => item !== choice) : [...current, choice])} key={choice}>{choice}</button>)}</div></label>
            <label className="span-two"><span>Findings and suspected cause</span><textarea rows={3} placeholder="Describe the exact problem location and your findings…" value={findings} onChange={(event) => setFindings(event.target.value)} /></label>
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
          <section className="panel photo-drop"><Icon name="document" size={22} /><strong>{inspectionPhotos.length ? `${inspectionPhotos.length} photo(s) selected` : "Add inspection photos"}</strong><span>Files are uploaded when the inspection is saved</span><label><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => setInspectionPhotos(Array.from(event.target.files || []))} />Choose photos</label></section>
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

function AuthScreen({ screen, setScreen, onLogin }: { screen: "login" | "forgot" | "reset"; setScreen: (screen: "login" | "forgot" | "reset") => void; onLogin: (email: string, password: string) => Promise<string | null> }) {
  const copy = screen === "login" ? { eyebrow: "SECURE STAFF ACCESS", title: "Welcome back", detail: "Sign in to manage Green Home sites and operations." } : screen === "forgot" ? { eyebrow: "PASSWORD RECOVERY", title: "Reset your password", detail: "Enter your registered email and we’ll send a secure reset link." } : { eyebrow: "CREATE NEW PASSWORD", title: "Choose a new password", detail: "Use at least 8 characters with a number and special character." };
  const [email, setEmail] = useState(demoUsers[0].email);
  const [password, setPassword] = useState("test123");
  const [loginError, setLoginError] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const selectAccount = (user: DemoUser) => {
    setEmail(user.email);
    setPassword("test123");
    setLoginError("");
  };
  const submitLogin = async () => {
    setSigningIn(true);
    setLoginError("");
    const error = await onLogin(email.trim().toLowerCase(), password);
    if (error) setLoginError(error);
    setSigningIn(false);
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
            <Button onClick={submitLogin}>{signingIn ? "Signing in…" : "Sign in securely"}</Button>
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

const roleLabels: Record<string, string> = {
  owner_admin: "Owner / Admin",
  office_staff: "Office Staff",
  site_supervisor: "Site Supervisor",
  store_staff: "Store / Godown Staff",
  ultratech_technical_executive: "UltraTech Technical Executive",
  labour_field_worker: "Labour / Field Worker",
};

function UsersSettingsPage({ profiles, notify, refresh, navigate, onInvite }: { profiles: any[]; notify: (message: string) => void; refresh: () => Promise<void>; navigate: (page: string) => void; onInvite: () => void }) {
  const [activeTab, setActiveTab] = useState("Users");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [savingUser, setSavingUser] = useState(false);
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<any | null>(null);
  const [auditAction, setAuditAction] = useState("All actions");
  const [auditEntity, setAuditEntity] = useState("All records");
  const [pendingItems, setPendingItems] = useState<{ id: string; title: string; detail: string; module: string; tone: string }[]>([]);
  const [alertSettings, setAlertSettings] = useState({ visits: true, quotations: true, lowStock: true, overdue: false });
  const [engineers, setEngineers] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [newEngineer, setNewEngineer] = useState({ name: "", phone: "" });
  const [newTeamMember, setNewTeamMember] = useState({ name: "", phone: "" });
  const [savingMaster, setSavingMaster] = useState(false);

  const loadAudit = async () => {
    const { data, error } = await supabase.from("audit_events").select("id, actor_id, action, entity_type, entity_id, site_id, before_data, after_data, created_at").order("created_at", { ascending: false }).limit(100);
    if (error) {
      notify(error.message);
      return;
    }
    setAuditEvents(data || []);
  };

  const loadPending = async () => {
    const [inspectionResult, claimResult, attendanceResult, quotationResult] = await Promise.all([
      supabase.from("inspections").select("id, site_id, inspected_at").eq("status", "submitted").limit(20),
      supabase.from("expense_claims").select("id, claim_number, amount, site_id").eq("status", "submitted").limit(20),
      supabase.from("attendance_entries").select("id, attendance_date, site_id").eq("status", "submitted").limit(20),
      supabase.from("quotations").select("id, quotation_number, follow_up_date, site_id").eq("status", "follow_up_pending").limit(20),
    ]);
    const items = [
      ...(inspectionResult.data || []).map((item) => ({ id: item.id, title: "Inspection awaiting review", detail: new Date(item.inspected_at).toLocaleDateString("en-IN"), module: "Inspections", tone: "blue" })),
      ...(claimResult.data || []).map((item) => ({ id: item.id, title: `Expense claim ${item.claim_number}`, detail: `₹${Number(item.amount).toLocaleString("en-IN")} awaiting approval`, module: "Labour Expense Claims", tone: "amber" })),
      ...(attendanceResult.data || []).map((item) => ({ id: item.id, title: "Attendance awaiting approval", detail: new Date(item.attendance_date).toLocaleDateString("en-IN"), module: "Labour & Attendance", tone: "green" })),
      ...(quotationResult.data || []).map((item) => ({ id: item.id, title: `Follow-up ${item.quotation_number}`, detail: item.follow_up_date ? new Date(item.follow_up_date).toLocaleDateString("en-IN") : "No date assigned", module: "Quotations", tone: "red" })),
    ];
    setPendingItems(items);
  };

  const loadReferralMasters = async () => {
    const [engineerResult, teamResult] = await Promise.all([
      supabase.from("ultratech_engineers").select("id, name, phone, active").order("name"),
      supabase.from("team_members").select("id, name, phone, active").order("name"),
    ]);
    const error = engineerResult.error || teamResult.error;
    if (error) {
      notify(error.message);
      return;
    }
    setEngineers(engineerResult.data || []);
    setTeamMembers(teamResult.data || []);
  };

  const saveMasterItem = async (table: "ultratech_engineers" | "team_members", item: any) => {
    if (!item.name?.trim()) {
      notify("Name is required");
      return;
    }
    setSavingMaster(true);
    const { error } = item.id
      ? await supabase.from(table).update({ name: item.name.trim(), phone: item.phone?.trim() || null, active: item.active }).eq("id", item.id)
      : await supabase.from(table).insert({ name: item.name.trim(), phone: item.phone?.trim() || null });
    setSavingMaster(false);
    if (error) {
      notify(error.message);
      return;
    }
    if (table === "ultratech_engineers") setNewEngineer({ name: "", phone: "" });
    else setNewTeamMember({ name: "", phone: "" });
    await loadReferralMasters();
    notify(item.id ? "Referral name updated" : "Referral name added");
  };

  useEffect(() => {
    if (activeTab === "Audit Log") void loadAudit();
    if (activeTab === "Pending Items") void loadPending();
    if (activeTab === "Referral Masters") void loadReferralMasters();
  }, [activeTab]);

  const saveUser = async () => {
    if (!editUser) return;
    setSavingUser(true);
    const { error } = await supabase.from("profiles").update({
      full_name: editUser.full_name,
      phone: editUser.phone || null,
      role: editUser.role,
      active: editUser.active,
    }).eq("id", editUser.id);
    setSavingUser(false);
    if (error) {
      notify(error.message);
      return;
    }
    await refresh();
    setSelectedUser({ ...editUser });
    notify("User profile updated");
  };

  const openUser = (profile: any) => {
    setSelectedUser(profile);
    setEditUser({ ...profile });
  };

  const filteredAudit = auditEvents.filter((event) =>
    (auditAction === "All actions" || event.action === auditAction) &&
    (auditEntity === "All records" || event.entity_type === auditEntity)
  );

  return (
    <div className="content module-content settings-workspace">
      <section className="page-heading module-heading">
        <div><p className="eyebrow">PHASE 1 ACCESS CONTROL</p><h1>Users & settings</h1><p>Manage staff accounts, role presets, operational alerts, company details and audit history.</p></div>
        <Button icon="plus" onClick={onInvite}>Invite user</Button>
      </section>

      <section className="module-metrics">
        <div className="module-metric"><span className="metric-dot green" /><div><span>ACTIVE USERS</span><strong>{profiles.filter((profile) => profile.active).length}</strong><small>Across six role presets</small></div></div>
        <div className="module-metric"><span className="metric-dot blue" /><div><span>SUPERVISORS</span><strong>{profiles.filter((profile) => profile.role === "site_supervisor" && profile.active).length}</strong><small>Active site access</small></div></div>
        <div className="module-metric"><span className="metric-dot amber" /><div><span>PENDING ITEMS</span><strong>{pendingItems.length || "—"}</strong><small>Load from task view</small></div></div>
        <div className="module-metric"><span className="metric-dot green" /><div><span>ROLE PRESETS</span><strong>6</strong><small>Configured access profiles</small></div></div>
      </section>

      <section className="panel settings-panel">
        <div className="settings-tabs">
          {["Users", "Role Presets", "Referral Masters", "Alerts", "Business Profile"].map((tab) => <button className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}
          <span />
          <button className={activeTab === "Pending Items" ? "active" : ""} onClick={() => setActiveTab("Pending Items")}><Icon name="alert" size={14} />Pending items</button>
          <button className={activeTab === "Audit Log" ? "active" : ""} onClick={() => setActiveTab("Audit Log")}><Icon name="clock" size={14} />Activity history</button>
        </div>

        {activeTab === "Users" && <div className="settings-view">
          <div className="view-heading"><div><h2>Staff accounts</h2><p>Select a user to view details, change role or update account status.</p></div></div>
          <div className="user-grid">
            {profiles.map((profile) => <button className="user-card" onClick={() => openUser(profile)} key={profile.id}><span className="user-card-avatar">{(profile.full_name || profile.email).slice(0, 2).toUpperCase()}</span><span><strong>{profile.full_name || "Unnamed user"}</strong><small>{profile.email}</small><em>{roleLabels[profile.role] || displayStatus(profile.role)}</em></span><Status value={profile.active ? "Active" : "Suspended"} /><Icon name="chevron" size={15} /></button>)}
            {!profiles.length && <div className="empty"><Icon name="people" size={22} /><strong>No staff profiles found</strong><span>Create users in Supabase Auth, then assign their roles here.</span></div>}
          </div>
        </div>}

        {activeTab === "Role Presets" && <div className="settings-view">
          <div className="view-heading"><div><h2>Role presets</h2><p>Six access profiles for office, site, technical and field teams.</p></div></div>
          <div className="role-grid role-grid-six">
            {[
              ["Owner / Admin", "Full access", ["Users and settings", "Site activity", "Operations", "Finance and reports"]],
              ["Office Staff", "Records access", ["Customers and sites", "Quotations", "Invoices and payments", "Basic reports"]],
              ["Site Supervisor", "Assigned sites", ["Inspections", "Measurements", "Progress updates", "Site photos"]],
              ["Store / Godown Staff", "Inventory access", ["Products", "Stock receipts", "Site issues", "Returns"]],
              ["UltraTech Technical Executive", "Technical review", ["UltraTech sourced sites", "Inspection findings", "Measurements", "Progress review"]],
              ["Labour / Field Worker", "Limited field access", ["Assigned work", "Own attendance", "Progress notes", "Expense claims"]],
            ].map(([name, scope, permissions]: any) => <article className="role-card" key={name}><span><Icon name="shield" size={18} /></span><h3>{name}</h3><p>{scope}</p><ul>{permissions.map((permission: string) => <li key={permission}><Icon name="check" size={11} />{permission}</li>)}</ul></article>)}
          </div>
        </div>}

        {activeTab === "Referral Masters" && <div className="settings-view">
          <div className="view-heading"><div><h2>Referral person masters</h2><p>Maintain the names available when a site is sourced by an UltraTech Engineer or My Team.</p></div></div>
          <div className="master-grid">
            {[
              { title: "UltraTech Engineers", table: "ultratech_engineers" as const, items: engineers, setItems: setEngineers, draft: newEngineer, setDraft: setNewEngineer },
              { title: "My Team", table: "team_members" as const, items: teamMembers, setItems: setTeamMembers, draft: newTeamMember, setDraft: setNewTeamMember },
            ].map((master) => <section className="master-card" key={master.table}>
              <header><div><h3>{master.title}</h3><span>{master.items.filter((item: any) => item.active).length} active</span></div></header>
              <div className="master-add"><input aria-label={`New ${master.title} name`} placeholder="Full name" value={master.draft.name} onChange={(event) => master.setDraft({ ...master.draft, name: event.target.value })} /><input aria-label={`New ${master.title} phone`} placeholder="Phone (optional)" value={master.draft.phone} onChange={(event) => master.setDraft({ ...master.draft, phone: event.target.value })} /><button onClick={() => saveMasterItem(master.table, master.draft)} disabled={savingMaster}><Icon name="plus" size={14} />Add</button></div>
              <div className="master-list">
                {master.items.map((item: any, index: number) => <div key={item.id}><input aria-label="Name" value={item.name} onChange={(event) => master.setItems(master.items.map((candidate: any, itemIndex: number) => itemIndex === index ? { ...candidate, name: event.target.value } : candidate))} /><input aria-label="Phone" placeholder="Phone" value={item.phone || ""} onChange={(event) => master.setItems(master.items.map((candidate: any, itemIndex: number) => itemIndex === index ? { ...candidate, phone: event.target.value } : candidate))} /><label title="Available in Site forms"><input type="checkbox" checked={item.active} onChange={(event) => master.setItems(master.items.map((candidate: any, itemIndex: number) => itemIndex === index ? { ...candidate, active: event.target.checked } : candidate))} /><span>Active</span></label><button onClick={() => saveMasterItem(master.table, item)} disabled={savingMaster}>Save</button></div>)}
                {!master.items.length && <div className="master-empty">No names added yet.</div>}
              </div>
            </section>)}
          </div>
        </div>}

        {activeTab === "Alerts" && <div className="settings-view narrow-view">
          <div className="view-heading"><div><h2>Operational alerts</h2><p>Choose which Phase 1 events appear in the dashboard attention list.</p></div></div>
          {[
            ["visits", "Site visits due", "Show scheduled and overdue site visits"],
            ["quotations", "Quotation follow-ups", "Show follow-ups due or overdue"],
            ["lowStock", "Low stock", "Show products below their reorder threshold"],
            ["overdue", "Overdue invoices", "Show invoices past their due date"],
          ].map(([key, title, detail]) => <div className="setting-row" key={key}><span><strong>{title}</strong><small>{detail}</small></span><button className={`switch ${alertSettings[key as keyof typeof alertSettings] ? "on" : ""}`} onClick={() => setAlertSettings((current) => ({ ...current, [key]: !current[key as keyof typeof current] }))}><i /></button></div>)}
          <Button onClick={() => notify("Alert preferences saved")}>Save alert preferences</Button>
        </div>}

        {activeTab === "Business Profile" && <div className="settings-view narrow-view">
          <div className="view-heading"><div><h2>Business profile</h2><p>Details used in site reports and application branding.</p></div></div>
          <div className="business-form"><label><span>Business name</span><input defaultValue="Green Home Building Solutions" /></label><label><span>Primary phone</span><input placeholder="+91" /></label><label><span>Email</span><input placeholder="office@greenhome.in" /></label><label><span>GSTIN</span><input placeholder="Optional GSTIN" /></label><label className="span-two"><span>Business address</span><textarea rows={3} defaultValue="Bengaluru, Karnataka" /></label></div>
          <Button onClick={() => notify("Business profile saved")}>Save business profile</Button>
        </div>}

        {activeTab === "Pending Items" && <div className="settings-view">
          <div className="view-heading"><div><h2>Pending approvals and tasks</h2><p>Open the relevant workspace to review each item.</p></div><button className="small-action" onClick={() => loadPending()}><Icon name="clock" size={13} />Refresh</button></div>
          <div className="pending-list">{pendingItems.map((item) => <button onClick={() => navigate(item.module)} key={`${item.module}-${item.id}`}><span className={`alert-icon ${item.tone}`}><Icon name="document" size={16} /></span><span><strong>{item.title}</strong><small>{item.detail}</small></span><em>{item.module}</em><Icon name="chevron" size={15} /></button>)}{!pendingItems.length && <div className="empty"><Icon name="check" size={22} /><strong>No pending items</strong><span>There are no submitted approvals or follow-ups requiring action.</span></div>}</div>
        </div>}

        {activeTab === "Audit Log" && <div className="settings-view">
          <div className="view-heading"><div><h2>Activity history</h2><p>Critical database changes recorded by Supabase audit triggers.</p></div><div className="audit-filters"><select value={auditAction} onChange={(event) => setAuditAction(event.target.value)}><option>All actions</option>{["insert", "update", "delete"].map((action) => <option key={action}>{action}</option>)}</select><select value={auditEntity} onChange={(event) => setAuditEntity(event.target.value)}><option>All records</option>{Array.from(new Set(auditEvents.map((event) => event.entity_type))).map((entity) => <option key={entity}>{entity}</option>)}</select></div></div>
          <div className="audit-list">{filteredAudit.map((event) => <button onClick={() => setSelectedAudit(event)} key={event.id}><span className="audit-action">{event.action.slice(0, 1).toUpperCase()}</span><span><strong>{displayStatus(event.action)} {displayStatus(event.entity_type)}</strong><small>{new Date(event.created_at).toLocaleString("en-IN")}</small></span><code>{event.entity_id?.slice(0, 8) || "system"}</code><Icon name="chevron" size={15} /></button>)}{!filteredAudit.length && <div className="empty"><Icon name="clock" size={22} /><strong>No activity found</strong><span>Try different filters or create a record to generate an audit event.</span></div>}</div>
        </div>}
      </section>

      {selectedUser && editUser && <div className="drawer-layer" role="dialog" aria-modal="true"><button className="drawer-scrim" aria-label="Close user details" onClick={() => setSelectedUser(null)} /><aside className="detail-drawer"><header><div><p className="eyebrow">USER DETAILS</p><h2>{selectedUser.full_name || selectedUser.email}</h2><span>{selectedUser.email}</span></div><button className="drawer-close" onClick={() => setSelectedUser(null)}><Icon name="close" size={18} /></button></header><div className="detail-body"><div className="user-identity"><span>{(selectedUser.full_name || selectedUser.email).slice(0, 2).toUpperCase()}</span><div><strong>{selectedUser.full_name}</strong><small>{roleLabels[selectedUser.role]} · {selectedUser.active ? "Active" : "Suspended"}</small></div></div><label><span>Full name</span><input value={editUser.full_name || ""} onChange={(event) => setEditUser({ ...editUser, full_name: event.target.value })} /></label><label><span>Email</span><input value={editUser.email || ""} disabled /></label><label><span>Phone</span><input value={editUser.phone || ""} onChange={(event) => setEditUser({ ...editUser, phone: event.target.value })} /></label><label><span>Role preset</span><select value={editUser.role} onChange={(event) => setEditUser({ ...editUser, role: event.target.value })}>{Object.entries(roleLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><div className="account-state"><span><strong>Account status</strong><small>Suspending access preserves all history.</small></span><Button variant="secondary" onClick={() => setEditUser({ ...editUser, active: !editUser.active })}>{editUser.active ? "Suspend user" : "Reactivate user"}</Button></div></div><footer><Button variant="secondary" onClick={() => setSelectedUser(null)}>Cancel</Button><Button icon="check" onClick={saveUser}>{savingUser ? "Saving…" : "Save changes"}</Button></footer></aside></div>}

      {selectedAudit && <div className="drawer-layer" role="dialog" aria-modal="true"><button className="drawer-scrim" aria-label="Close activity details" onClick={() => setSelectedAudit(null)} /><aside className="detail-drawer"><header><div><p className="eyebrow">ACTIVITY DETAILS</p><h2>{displayStatus(selectedAudit.action)} {displayStatus(selectedAudit.entity_type)}</h2><span>{new Date(selectedAudit.created_at).toLocaleString("en-IN")}</span></div><button className="drawer-close" onClick={() => setSelectedAudit(null)}><Icon name="close" size={18} /></button></header><div className="detail-body audit-detail"><label><span>Record ID</span><input value={selectedAudit.entity_id || "System event"} disabled /></label><label><span>Site ID</span><input value={selectedAudit.site_id || "Not site-specific"} disabled /></label><div><span>Before</span><pre>{JSON.stringify(selectedAudit.before_data, null, 2) || "No previous value"}</pre></div><div><span>After</span><pre>{JSON.stringify(selectedAudit.after_data, null, 2) || "No new value"}</pre></div></div></aside></div>}
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
  const [editingRecord, setEditingRecord] = useState<{ module: string; id: string; values: Record<string, string> } | null>(null);
  const [editingInspectionId, setEditingInspectionId] = useState<string | null>(null);
  const [functionalScreen, setFunctionalScreen] = useState<"inspection" | "report" | null>(null);
  const [authScreen, setAuthScreen] = useState<"login" | "forgot" | "reset" | null>("login");
  const [currentUser, setCurrentUser] = useState<DemoUser>(demoUsers[0]);
  const [authReady, setAuthReady] = useState(false);
  const [liveCustomers, setLiveCustomers] = useState<any[] | null>(null);
  const [liveSites, setLiveSites] = useState<any[] | null>(null);
  const [liveProfiles, setLiveProfiles] = useState<any[]>([]);
  const [liveInspections, setLiveInspections] = useState<any[] | null>(null);
  const [dataError, setDataError] = useState("");

  const dashboardProjects = useMemo(() => {
    if (liveSites === null) return projects;
    return liveSites.map((site, index) => {
      const customer = liveCustomers?.find((item) => item.id === site.customer_id);
      const supervisor = liveProfiles.find((profile) => profile.id === site.supervisor_id);
      return {
        id: site.site_code,
        name: site.project_name,
        client: customer?.name || "Customer",
        location: site.address,
        status: displayStatus(site.status),
        type: site.application_areas?.length ? site.application_areas.map(displayStatus).join(", ") : "Site activity",
        supervisor: supervisor?.full_name || "Unassigned",
        initials: site.project_name.split(/\s+/).map((word: string) => word[0]).join("").slice(0, 2).toUpperCase(),
        tone: ["sage", "sand", "blue", "rose", "violet"][index % 5],
        value: "—",
        date: site.visit_date ? new Date(site.visit_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—",
      };
    });
  }, [liveSites, liveCustomers, liveProfiles]);

  const visibleProjects = useMemo(() => dashboardProjects.filter((project) => {
    const matchesFilter = projectFilter === "All" || project.status === projectFilter;
    const query = search.toLowerCase();
    return matchesFilter && [project.id, project.name, project.client, project.location].some((value) => value.toLowerCase().includes(query));
  }), [dashboardProjects, projectFilter, search]);

  const liveModuleConfigs = useMemo(() => {
    const configs = { ...moduleConfigs };
    if (liveCustomers !== null) {
      configs.Customers = {
        ...moduleConfigs.Customers,
        rows: liveCustomers.map((customer) => {
          const customerSites = liveSites?.filter((site) => site.customer_id === customer.id) || [];
          const activeSite = customerSites.find((site) => !["completed", "cancelled"].includes(site.status));
          return [
            `${customer.name}\n${customer.customer_code}`,
            customer.primary_mobile,
            `${customerSites.length} site${customerSites.length === 1 ? "" : "s"}`,
            activeSite ? displayStatus(activeSite.status) : customerSites.length ? "Completed" : "No active work",
            customer.notes || "—",
            new Date(customer.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
          ];
        }),
      };
    }
    if (liveSites !== null) {
      configs.Sites = {
        ...moduleConfigs.Sites,
        rows: liveSites.map((site) => {
          const customer = liveCustomers?.find((item) => item.id === site.customer_id);
          const supervisor = liveProfiles.find((profile) => profile.id === site.supervisor_id);
          return [
            `${site.site_code}\n${site.project_name}`,
            customer?.name || "Customer",
            displayStatus(site.lead_source),
            displayStatus(site.status),
            supervisor?.full_name || "Unassigned",
            site.notes || "No next action",
          ];
        }),
      };
    }
    if (liveInspections !== null) {
      configs.Inspections = {
        ...moduleConfigs.Inspections,
        rows: liveInspections.map((inspection) => {
          const site = liveSites?.find((item) => item.id === inspection.site_id);
          const inspector = liveProfiles.find((profile) => profile.id === inspection.inspector_id);
          return [
            `INS-${inspection.id.slice(0, 8).toUpperCase()}\nVisit ${inspection.visit_number} · ${new Date(inspection.inspected_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}`,
            site ? `${site.site_code} · ${site.project_name}` : "Linked site",
            inspection.building_type === "new" ? "New building" : "Existing building",
            inspection.application_areas?.length ? inspection.application_areas.map(displayStatus).join(", ") : "—",
            inspector?.full_name || "Assigned user",
            displayStatus(inspection.status),
          ];
        }),
      };
    }
    return configs;
  }, [liveCustomers, liveSites, liveProfiles, liveInspections]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const loadCoreData = async () => {
    const [customersResult, sitesResult, profilesResult, inspectionsResult] = await Promise.all([
      supabase.from("customers").select("id, customer_code, name, primary_mobile, email, billing_name, billing_address, gstin, notes, created_at").is("archived_at", null).order("created_at", { ascending: false }),
      supabase.from("sites").select("id, site_code, customer_id, project_name, address, site_type, application_areas, lead_source, ultratech_sr_id, ultratech_engineer_id, team_member_id, referral_customer_id, visit_date, supervisor_id, status, notes, created_at").is("archived_at", null).order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, email, full_name, phone, role, active, created_at, updated_at").order("created_at", { ascending: true }),
      supabase.from("inspections").select("id, site_id, visit_number, inspected_at, inspector_id, building_type, application_areas, status, findings, remarks, created_at").order("inspected_at", { ascending: false }),
    ]);
    const coreError = customersResult.error || sitesResult.error;
    if (coreError) {
      setDataError(coreError.message);
      return;
    }
    setLiveCustomers(customersResult.data || []);
    setLiveSites(sitesResult.data || []);
    if (!profilesResult.error) setLiveProfiles(profilesResult.data || []);
    if (!inspectionsResult.error) setLiveInspections(inspectionsResult.data || []);
    const optionalError = profilesResult.error || inspectionsResult.error;
    setDataError(optionalError ? `Core records loaded, but some related data is unavailable: ${optionalError.message}` : "");
  };

  const navigate = (page: string) => {
    setActiveNav(page);
    window.location.hash = encodeURIComponent(page);
    setSearch("");
    setProfileOpen(false);
    setDrawerOpen(false);
    setEditingRecord(null);
    setEditingInspectionId(null);
    setFunctionalScreen(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openPrimaryAction = () => {
    if (activeNav === "Inspections") {
      setEditingInspectionId(null);
      setFunctionalScreen("inspection");
    }
    else if (activeNav === "Site Reports") setFunctionalScreen("report");
    else {
      setEditingRecord(null);
      setDrawerOpen(true);
    }
  };

  const openModuleRow = async (row: string[]) => {
    if (activeNav === "Inspections") {
      const shortId = row[0].split("\n")[0].replace("INS-", "").toLowerCase();
      const inspection = liveInspections?.find((item) => item.id.toLowerCase().startsWith(shortId));
      if (!inspection) {
        notify("Inspection record could not be loaded.");
        return;
      }
      setEditingInspectionId(inspection.id);
      setFunctionalScreen("inspection");
      return;
    }
    if (!["Customers", "Sites"].includes(activeNav)) {
      notify(`${row[0].split("\n")[0]} opened`);
      return;
    }
    if (activeNav === "Customers") {
      const customerCode = row[0].split("\n")[1];
      const customer = liveCustomers?.find((item) => item.customer_code === customerCode);
      if (!customer) {
        notify("Customer record could not be loaded.");
        return;
      }
      setEditingRecord({
        module: "Customers",
        id: customer.id,
        values: {
          "Customer name": customer.name || "",
          "Primary mobile": customer.primary_mobile || "",
          "Email address": customer.email || "",
          "Billing name": customer.billing_name || "",
          "Billing address": customer.billing_address || "",
          GSTIN: customer.gstin || "",
          Notes: customer.notes || "",
        },
      });
    } else {
      const siteCode = row[0].split("\n")[0];
      const cachedSite = liveSites?.find((item) => item.site_code === siteCode);
      const { data: fetchedSite, error: siteError } = await supabase
        .from("sites")
        .select("id, site_code, customer_id, project_name, ultratech_sr_id, address, site_type, application_areas, lead_source, ultratech_engineer_id, team_member_id, referral_customer_id, supervisor_id, notes")
        .eq("site_code", siteCode)
        .single();
      const site = fetchedSite || cachedSite;
      if (!site) {
        notify(siteError?.message || "Site record could not be loaded.");
        return;
      }
      let customer = liveCustomers?.find((item) => item.id === site.customer_id);
      if (!customer) {
        const { data } = await supabase.from("customers").select("id, name").eq("id", site.customer_id).maybeSingle();
        customer = data || undefined;
      }
      let supervisor = liveProfiles.find((profile) => profile.id === site.supervisor_id);
      if (!supervisor && site.supervisor_id) {
        const { data } = await supabase.from("profiles").select("id, full_name").eq("id", site.supervisor_id).maybeSingle();
        supervisor = data || undefined;
      }
      const siteTypeLabels: Record<string, string> = { residential: "Residential", commercial: "Commercial", semi_residential: "Semi-Residential", other: "Other" };
      const leadSourceLabels: Record<string, string> = Object.fromEntries(Object.entries(leadSourceCodes).map(([label, code]) => [code, label]));
      setEditingRecord({
        module: "Sites",
        id: site.id,
        values: {
          Customer: customer?.id || site.customer_id || "",
          "Project / site name": site.project_name || "",
          "UltraTech SR ID": site.ultratech_sr_id || "",
          "Site address": site.address || "",
          "Site type": siteTypeLabels[site.site_type] || displayStatus(site.site_type),
          "Application areas": (site.application_areas || []).map((area: string) => applicationAreaLabels[area] || displayStatus(area)).join(", "),
          "Lead source": leadSourceLabels[site.lead_source] || displayStatus(site.lead_source),
          "Referral person": site.ultratech_engineer_id || site.team_member_id || site.referral_customer_id || "",
          "Assigned supervisor": supervisor?.full_name || "",
          Remarks: site.notes || "",
        },
      });
    }
    setDrawerOpen(true);
  };

  useEffect(() => {
    const syncHash = () => {
      const page = decodeURIComponent(window.location.hash.slice(1));
      if (page === "Overview" || moduleConfigs[page]) setActiveNav(page);
    };
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    const mapUser = (user: User): DemoUser => {
      const email = user.email?.toLowerCase() || "";
      const knownUser = demoUsers.find((candidate) => candidate.email === email);
      if (knownUser) return knownUser;
      const fullName = user.user_metadata?.full_name || email.split("@")[0] || "Staff User";
      const metadataRole = user.user_metadata?.role;
      return {
        name: fullName,
        email,
        role: roleLabels[metadataRole] || "Site Supervisor",
        initials: fullName.slice(0, 2).toUpperCase(),
      };
    };

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setCurrentUser(mapUser(data.session.user));
        setAuthScreen(null);
      }
      setAuthReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(mapUser(session.user));
        setAuthScreen(null);
      } else {
        setAuthScreen("login");
      }
      setAuthReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authReady && !authScreen) void loadCoreData();
  }, [authReady, authScreen]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error?.message === "Invalid login credentials") {
      return "This account does not exist in Supabase Auth or its password is different. Ask an administrator to create or reset the account.";
    }
    if (error) return error.message;
    if (!data.user) return "Supabase did not return a signed-in user.";
    return null;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      notify(error.message);
      return;
    }
    setProfileOpen(false);
    setAuthScreen("login");
  };

  const toIsoDate = (value: string) => {
    const trimmed = value.trim();
    const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    return match ? `${match[3]}-${match[2]}-${match[1]}` : trimmed;
  };

  const toNumber = (value: string) => Number.parseFloat(value.replace(/[₹,\s]/g, "")) || 0;
  const toEnum = (value: string) => value.trim().toLowerCase().replaceAll("/", "_").replaceAll("-", "_").replaceAll(" ", "_");
  const siteCodeFromLabel = (value: string) => value.split("·")[0].trim();

  const currentAuthUserId = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Your session has expired. Sign in again.");
    return data.user.id;
  };

  const findSite = async (label: string) => {
    const siteCode = siteCodeFromLabel(label);
    const { data, error } = await supabase.from("sites").select("id, site_code, project_name").eq("site_code", siteCode).single();
    if (error || !data) throw new Error(`Site ${siteCode} was not found in Supabase.`);
    return data;
  };

  const uploadSiteFile = async (siteId: string, file: File, category: "quotation" | "progress_photo" | "site_document", stage?: string) => {
    if (file.size > 10 * 1024 * 1024) throw new Error(`${file.name} is larger than 10 MB.`);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const objectPath = `${siteId}/${category}/${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("site-files").upload(objectPath, file, { contentType: file.type, upsert: false });
    if (uploadError) throw new Error(`File upload failed: ${uploadError.message}`);
    const userId = await currentAuthUserId();
    const { data, error } = await supabase.from("site_files").insert({
      site_id: siteId,
      category,
      stage: stage || null,
      caption: file.name,
      bucket_id: "site-files",
      object_path: objectPath,
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by: userId,
    }).select("id, object_path").single();
    if (error || !data) {
      await supabase.storage.from("site-files").remove([objectPath]);
      throw new Error(`File record could not be saved: ${error?.message || "Unknown error"}`);
    }
    return data;
  };

  const saveForm = async (module: string, values: Record<string, string>, files: Record<string, File>, editId?: string) => {
    try {
      const userId = await currentAuthUserId();

      if (module === "Customers") {
        const customerData = {
          name: values["Customer name"].trim(),
          primary_mobile: values["Primary mobile"].trim(),
          email: values["Email address"]?.trim() || null,
          billing_name: values["Billing name"]?.trim() || null,
          billing_address: values["Billing address"]?.trim() || null,
          gstin: values.GSTIN?.trim() || null,
          notes: values.Notes?.trim() || null,
        };
        const { error } = editId
          ? await supabase.from("customers").update(customerData).eq("id", editId)
          : await supabase.from("customers").insert({ ...customerData, created_by: userId });
        if (error) throw error;
      } else if (module === "Sites") {
        const { data: customer, error: customerError } = await supabase.from("customers").select("id").eq("id", values.Customer).single();
        if (customerError || !customer) throw new Error("The selected customer was not found in Supabase.");
        let supervisorId: string | null = null;
        if (values["Assigned supervisor"]) {
          const { data: supervisor } = await supabase.from("profiles").select("id").eq("full_name", values["Assigned supervisor"]).limit(1).maybeSingle();
          supervisorId = supervisor?.id || null;
        }
        const leadSource = leadSourceCodes[values["Lead source"]] || "direct_customer";
        const referralId = values["Referral person"] || null;
        const siteData = {
          customer_id: customer.id,
          project_name: values["Project / site name"].trim(),
          ultratech_sr_id: values["UltraTech SR ID"]?.trim() || null,
          address: values["Site address"].trim(),
          site_type: toEnum(values["Site type"]),
          application_areas: values["Application areas"]?.split(",").map((area) => applicationAreaCodes[area.trim()] || toEnum(area)).filter(Boolean) || [],
          lead_source: leadSource,
          ultratech_engineer_id: leadSource === "ultratech_engineer" ? referralId : null,
          team_member_id: leadSource === "my_team" ? referralId : null,
          referral_customer_id: ["customer_reference", "existing_customer"].includes(leadSource) ? referralId : null,
          supervisor_id: supervisorId,
          notes: values.Remarks?.trim() || null,
        };
        const query = editId
          ? supabase.from("sites").update(siteData).eq("id", editId)
          : supabase.from("sites").insert({ ...siteData, created_by: userId });
        const { data, error } = await query.select("site_code").single();
        if (error) throw error;
        if (!data?.site_code) throw new Error("Supabase did not return the saved Site ID.");
      } else if (module === "Quotations") {
        const site = await findSite(values.Site);
        const pdf = await uploadSiteFile(site.id, files["Quotation PDF"], "quotation");
        const statusMap: Record<string, string> = { "Follow-up Pending": "follow_up_pending" };
        const { error } = await supabase.from("quotations").insert({
          site_id: site.id,
          quotation_number: values["Quotation number"].trim(),
          quotation_date: toIsoDate(values["Quotation date"]),
          total_value: toNumber(values["Total amount"]),
          status: statusMap[values.Status] || toEnum(values.Status || "draft"),
          follow_up_date: values["Follow-up date"] ? toIsoDate(values["Follow-up date"]) : null,
          follow_up_remarks: values["Follow-up remarks"]?.trim() || null,
          source_app: "quotation_maker",
          pdf_file_id: pdf.id,
          created_by: userId,
        });
        if (error) throw error;
      } else if (module === "Godown & Materials") {
        const { data: product, error: productError } = await supabase.from("products").select("id").eq("name", values.Product).single();
        if (productError || !product) throw new Error("The selected product was not found in Supabase.");
        const transactionMap: Record<string, string> = { "Stock receipt": "receipt", "Site issue": "issue", "Site return": "return" };
        const site = values.Site ? await findSite(values.Site) : null;
        let attachmentPath: string | null = null;
        if (files["Supporting document"]) {
          if (!site) throw new Error("Select a site before uploading a transaction document.");
          attachmentPath = (await uploadSiteFile(site.id, files["Supporting document"], "site_document")).object_path;
        }
        const { error } = await supabase.from("stock_transactions").insert({
          transaction_type: transactionMap[values["Transaction type"]],
          transaction_at: new Date(toIsoDate(values["Transaction date"])).toISOString(),
          product_id: product.id,
          site_id: site?.id || null,
          quantity: toNumber(values.Quantity),
          supplier_or_reference: values["Reference / remarks"]?.trim() || null,
          attachment_path: attachmentPath,
          created_by: userId,
        });
        if (error) throw error;
      } else if (module === "Labour & Attendance") {
        const site = await findSite(values.Site);
        const { data: labourer, error: labourerError } = await supabase.from("labourers").select("id, daily_wage").eq("name", values.Labourer).single();
        if (labourerError || !labourer) throw new Error("The selected labourer was not found in Supabase.");
        const { error } = await supabase.from("attendance_entries").insert({
          attendance_date: toIsoDate(values["Attendance date"]),
          labourer_id: labourer.id,
          site_id: site.id,
          work_performed: values["Work and remarks"].trim(),
          check_in: values["Check-in"] || null,
          check_out: values["Check-out"] || null,
          day_fraction: toNumber(values["Day fraction"]),
          daily_wage_snapshot: labourer.daily_wage,
          overtime_duration_hours: toNumber(values["Overtime duration"] || "0"),
          overtime_amount: 0,
          status: "submitted",
          entered_by: userId,
        });
        if (error) throw error;
      } else if (module === "Work Progress") {
        const site = await findSite(values.Site);
        const { error } = await supabase.from("progress_updates").insert({
          site_id: site.id,
          progress_date: toIsoDate(values["Progress date"]),
          supervisor_id: userId,
          work_completed: values["Work completed"].trim(),
          pending_work: values["Pending work"]?.trim() || null,
          issues: values["Issues and next action"]?.trim() || null,
          next_action: values["Issues and next action"]?.trim() || null,
          created_by: userId,
        });
        if (error) throw error;
        if (files["Site photos"]) await uploadSiteFile(site.id, files["Site photos"], "progress_photo", values["Photo stage"]);
      } else if (module === "Labour Expense Claims") {
        const site = await findSite(values.Site);
        const { data: labourer, error: labourerError } = await supabase.from("labourers").select("id").eq("name", values.Labourer).single();
        if (labourerError || !labourer) throw new Error("The selected labourer was not found in Supabase.");
        const receipt = files["Receipt / invoice"] ? await uploadSiteFile(site.id, files["Receipt / invoice"], "site_document") : null;
        const claimNumber = `EXP-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
        const { error } = await supabase.from("expense_claims").insert({
          claim_number: claimNumber,
          labourer_id: labourer.id,
          site_id: site.id,
          category: toEnum(values["Expense category"]),
          amount: toNumber(values.Amount),
          expense_date: toIsoDate(values["Expense date"]),
          description: values.Description.trim(),
          payment_method: values["Payment method"] ? toEnum(values["Payment method"]) : null,
          receipt_path: receipt?.object_path || null,
          no_receipt_reason: receipt ? null : "Receipt was not attached during submission.",
          status: "submitted",
          submitted_by: userId,
        });
        if (error) throw error;
      } else if (module === "Invoices & Payments") {
        const site = await findSite(values.Site);
        const document = files["Invoice document"] ? await uploadSiteFile(site.id, files["Invoice document"], "site_document") : null;
        const { error } = await supabase.from("invoices").insert({
          site_id: site.id,
          invoice_number: values["Invoice number"].trim(),
          invoice_date: toIsoDate(values["Invoice date"]),
          amount: toNumber(values.Amount),
          due_date: toIsoDate(values["Due date"]),
          status: "unpaid",
          attachment_path: document?.object_path || null,
          notes: values.Notes?.trim() || null,
          created_by: userId,
        });
        if (error) throw error;
      } else if (module === "Users & Settings") {
        throw new Error("Create staff accounts in Supabase Auth first. Browser clients cannot securely create privileged users.");
      } else {
        throw new Error(`Saving ${module} is not available until its database table is enabled.`);
      }

      setDrawerOpen(false);
      setEditingRecord(null);
      await loadCoreData();
      notify(editId ? `${module === "Sites" ? "Site" : "Customer"} updated in Supabase` : "Record saved to Supabase");
      return null;
    } catch (error) {
      const message = errorMessage(error);
      if (message.includes("Could not find the table")) return "Required database tables are missing. Apply the Supabase migrations first.";
      if (message.includes("row-level security")) return "Supabase denied this action. Check the user profile role and RLS policies.";
      return message;
    }
  };

  if (!authReady) {
    return <div className="auth-loading"><span className="brand-mark"><Icon name="shield" size={22} /></span><strong>Connecting securely…</strong></div>;
  }

  if (authScreen) {
    return <AuthScreen screen={authScreen} setScreen={setAuthScreen} onLogin={signIn} />;
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
              {profileOpen && <div className="profile-menu"><button onClick={() => navigate("Users & Settings")}>My profile</button><button onClick={() => navigate("Users & Settings")}>Account settings</button><button onClick={signOut}>Sign out</button></div>}
            </div>
          </div>
        </header>

        {dataError && <div className="data-error-banner"><Icon name="alert" size={16} /><span><strong>Supabase data could not be loaded.</strong>{dataError}</span><button onClick={() => loadCoreData()}>Retry</button></div>}

        {functionalScreen === "inspection" ? <InspectionCalculator existingInspectionId={editingInspectionId} onBack={() => { setFunctionalScreen(null); setEditingInspectionId(null); }} notify={notify} onSaved={loadCoreData} />
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
            <MetricCard label="ACTIVE SITES" value={liveSites === null ? "24" : String(liveSites.filter((site) => !["completed", "cancelled"].includes(site.status)).length)} meta=" current work sites" icon="building" tone="green" onClick={() => navigate("Sites")} />
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
                {["All", "Ongoing", "Visit Scheduled", "Quotation Sent", "Completed"].map((tab) => <button role="tab" aria-selected={projectFilter === tab} className={projectFilter === tab ? "active" : ""} key={tab} onClick={() => setProjectFilter(tab)}>{tab}{tab === "All" && <span>{dashboardProjects.length}</span>}</button>)}
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
                {visibleProjects.length === 0 && <div className="empty"><Icon name={dashboardProjects.length ? "search" : "building"} size={22} /><strong>{dashboardProjects.length ? "No matching sites" : "No sites yet"}</strong><span>{dashboardProjects.length ? "Try a different status or search term." : "Create a customer, then add the first linked site."}</span></div>}
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
        </div> : activeNav === "Users & Settings"
          ? <UsersSettingsPage profiles={liveProfiles} notify={notify} refresh={loadCoreData} navigate={navigate} onInvite={() => { setEditingRecord(null); setDrawerOpen(true); }} />
          : <ModulePage key={activeNav} config={liveModuleConfigs[activeNav]} search={search} notify={notify} onPrimary={openPrimaryAction} onRowOpen={["Customers", "Sites", "Inspections"].includes(activeNav) ? openModuleRow : undefined} />}
      </main>
      {drawerOpen && <FormDrawer
        module={activeNav}
        initialValues={editingRecord?.values}
        editing={Boolean(editingRecord)}
        onClose={() => { setDrawerOpen(false); setEditingRecord(null); }}
        onSave={(values, files) => saveForm(activeNav, values, files, editingRecord?.id)}
      />}
      {toast && <div className="toast"><span><Icon name="check" size={15} /></span>{toast}<button aria-label="Dismiss notification" onClick={() => setToast("")}><Icon name="close" size={14} /></button></div>}
    </div>
  );
}
