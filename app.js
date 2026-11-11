/* ==========================================================================
   GRADIEN FINOPS — Interactive Prototype Logic (Vanilla JS)
   Supports:
   - EN (Main) & ID (Optional) instant localization
   - UMKM / Small Business / Enterprise dynamic tier adaptation
   - USD ($) & IDR (Rp) multi-currency conversion & tabular formatting
   - Interactive Invoicing, Bank Reconciliation, Double-Entry Ledger & Reports
   ========================================================================== */

const FX_RATE_IDR = 16000; // 1 USD = 16,000 IDR for realistic dual-market display

const state = {
  lang: 'en',          // 'en' | 'id'
  tier: 'small',       // 'umkm' | 'small' | 'enterprise'
  currency: 'USD',     // 'USD' | 'IDR'
  theme: 'daylight',   // 'daylight' | 'carbon'
  activeView: 'dashboard',
  invoiceFilter: 'ALL',
  invoiceSearch: '',
  reportType: 'pnl',   // 'pnl' | 'bs'
};

/* --------------------------------------------------------------------------
   TIER CONFIGURATIONS (UMKM, Small Business, Enterprise)
   -------------------------------------------------------------------------- */
const tierConfigs = {
  umkm: {
    multiplier: 0.12,
    entityName: 'Kopi Roastery Gradien (UMKM)',
    badgeEn: 'UMKM / Starter',
    badgeId: 'UMKM / Mikro',
    tagEn: 'TIER: UMKM / MICRO-SME',
    tagId: 'KATEGORI: UMKM & USAHA MIKRO',
    descEn: 'Streamlined cashbook, instant QRIS & payment links, simplified expense tracking, and 0.5% Final SME Tax calculation.',
    descId: 'Pembukuan kas praktis, faktur instan QRIS/Transfer, pencatatan biaya cepat, & estimasi PPh Final UMKM 0,5%.',
    chips: ['go-cashbook-lite', 'QRIS / Payment Link', 'PPh Final 0.5%', 'WhatsApp Invoice']
  },
  small: {
    multiplier: 1.0,
    entityName: 'Nusantara Global Labs Pte.',
    badgeEn: 'Small Biz',
    badgeId: 'Perusahaan Kecil',
    tagEn: 'TIER: SMALL BUSINESS (GROWTH)',
    tagId: 'KATEGORI: PERUSAHAAN KECIL & MENENGAH',
    descEn: 'Full accrual double-entry accounting, automated bank feed reconciliation, AR/AP aging, and multi-rate tax compliance.',
    descId: 'Akuntansi double-entry akrual lengkap, rekonsiliasi bank otomatis, umur piutang/hutang (AR/AP), dan kepatuhan PPN 11% / Pajak.',
    chips: ['go-ledger-core', 'go-invoice-svc', 'go-recon-engine', 'PPN 11% / GST']
  },
  enterprise: {
    multiplier: 18.5,
    entityName: 'Gradien Global Holdings (4 Entities)',
    badgeEn: 'Enterprise',
    badgeId: 'Enterprise',
    tagEn: 'TIER: GLOBAL ENTERPRISE (MULTI-ENTITY)',
    tagId: 'KATEGORI: ENTERPRISE & MULTI-ENTITAS',
    descEn: 'Multi-entity consolidation (US, ID, SG), automated FX revaluation, departmental cost centers, approval matrices & immutable ledger hashes.',
    descId: 'Konsolidasi multi-perusahaan (US, ID, SG), revaluasi kurs valas otomatis, cost center departemen, matriks persetujuan & audit trail Go.',
    chips: ['Multi-Entity Consolidation', 'FX Auto-Revaluation', 'Cost Centers', 'SHA-256 Ledger Audit', 'gRPC Webhook API']
  }
};

/* --------------------------------------------------------------------------
   BILINGUAL DICTIONARY (English Main + Bahasa Indonesia Optional)
   -------------------------------------------------------------------------- */
const i18n = {
  en: {
    'sidebar.activeEntity': 'Active Entity',
    'sidebar.meshHealthy': 'Go Ledger Mesh',
    'nav.coreAccounting': 'Core Accounting',
    'nav.dashboard': 'Executive Overview',
    'nav.sales': 'Sales & Invoicing',
    'nav.cashbank': 'Cash & Bank Recon',
    'nav.expenses': 'Purchases & Expenses',
    'nav.booksCompliance': 'Books & Compliance',
    'nav.ledger': 'General Ledger & COA',
    'nav.reports': 'Financial Statements',
    'nav.platformSystem': 'System & Platform',
    'nav.architecture': 'Next.js + Go Blueprint',
    'topbar.searchPlaceholder': 'Jump to account, invoice, or action...',
    'topbar.scaleLabel': 'Scale:',
    'tier.umkm': 'UMKM / Micro',
    'tier.small': 'Small Business',
    'tier.enterprise': 'Enterprise',
    'dashboard.title': 'Financial Command Center',
    'dashboard.subtitle': 'Live cash position, receivables aging, and automated ledger health across connected banking rails.',
    'actions.newJournal': '+ Post Journal',
    'actions.createInvoice': '+ Create Sales Invoice',
    'kpi.netCash': 'Total Cash & Bank',
    'kpi.syncedNow': 'Synced via OpenBanking',
    'kpi.receivables': 'Accounts Receivable (AR)',
    'kpi.payables': 'Accounts Payable (AP)',
    'kpi.due30d': 'Due within 30d',
    'kpi.netProfit': 'Net Profit (YTD)',
    'kpi.taxReady': 'Tax Provisioned',
    'dashboard.chartTitle': 'Revenue vs. Operating Expenses',
    'dashboard.chartSubtitle': '6-Month Accrual Performance (Go Reporting Engine)',
    'chart.revenue': 'Revenue',
    'chart.expenses': 'Expenses',
    'dashboard.agingTitle': 'Receivables Aging & Actions',
    'dashboard.agingSubtitle': 'Collection velocity & automated reminders',
    'dashboard.viewAllAr': 'View Invoices →',
    'aging.collectionHealth': 'Collection Health Index',
    'aging.current': 'Current (0–30 Days)',
    'aging.due31_60': 'Due 31–60 Days',
    'aging.overdue60': 'Overdue 60+ Days',
    'dashboard.recentTxTitle': 'Recent Ledger & Commercial Activity',
    'dashboard.recentTxSubtitle': 'Immutable audit log backed by Go Ledger Service',
    'dashboard.openLedger': 'Open General Ledger →',
    'table.docNo': 'Doc / Ref #',
    'table.counterparty': 'Counterparty / Entity',
    'table.category': 'Account / Category',
    'table.date': 'Date',
    'table.status': 'Status',
    'table.amount': 'Amount',
    'table.invoiceNo': 'Invoice #',
    'table.customer': 'Customer',
    'table.issueDate': 'Issue Date',
    'table.dueDate': 'Due Date',
    'table.tax': 'Tax (VAT/PPN)',
    'table.total': 'Total',
    'table.action': 'Action',
    'table.billNo': 'Bill #',
    'table.vendor': 'Vendor / Supplier',
    'table.expenseAcct': 'Expense Account',
    'table.approval': 'Approval',
    'table.acctCode': 'Account Code',
    'table.acctName': 'Account Name',
    'table.acctType': 'Category / Classification',
    'table.normalBal': 'Normal Balance',
    'table.balance': 'Current Balance',
    'table.lineItem': 'Statement Line Item',
    'table.periodActual': 'YTD 2030 Actual',
    'table.pctRev': '% of Revenue',
    'sales.title': 'Sales & Customer Invoicing',
    'sales.subtitle': 'Manage commercial invoices, automated payment links (Stripe / QRIS / Virtual Account), and real-time AR posting.',
    'filter.all': 'All',
    'filter.paid': 'Paid',
    'filter.pending': 'Awaiting',
    'filter.overdue': 'Overdue',
    'cashbank.title': 'Cash, Bank Feeds & Smart Reconciliation',
    'cashbank.subtitle': 'Direct bank feeds across international (Mercury USD, Wise EUR) and local Indonesian banks (BCA, Mandiri) with 1-click ledger matching.',
    'cashbank.reconQueueTitle': 'Automated Bank Statement Matching Queue',
    'cashbank.reconQueueSubtitle': 'Confirm matched pairs to post balanced journal entries automatically',
    'expenses.title': 'Purchases, Vendor Bills & Corporate Spend',
    'expenses.subtitle': 'Track supplier bills, operational expenses, withholding tax (PPh 23 / 1099), and approval workflows.',
    'ledger.title': 'Chart of Accounts & General Ledger',
    'ledger.subtitle': 'IFRS & PSAK compliant multi-dimensional Chart of Accounts with real-time trial balance verification.',
    'ledger.coaTitle': 'Master Chart of Accounts',
    'ledger.coaSubtitle': 'Balances updated atomically on every posted journal transaction',
    'reports.title': 'Financial Statements & Tax Compliance',
    'reports.subtitle': 'Audit-ready Profit & Loss, Balance Sheet, and automated local/international tax summaries.',
    'reports.pnlTab': 'Profit & Loss',
    'reports.bsTab': 'Balance Sheet',
    'arch.title': 'SaaS Microservices & Multi-Tier Architecture',
    'arch.subtitle': 'Designed to scale from single-owner UMKM cashbooks to multi-entity global enterprises without rewriting core domain logic.',
    'modal.newInvoiceTitle': 'Create Sales Invoice (go-invoice-svc)',
    'modal.customerName': 'Customer / Client Entity',
    'modal.dueDate': 'Due Date',
    'modal.subtotal': 'Subtotal Amount (USD Base)',
    'modal.taxRate': 'Tax Regime (VAT / PPN / GST)',
    'modal.cancel': 'Cancel',
    'modal.postInvoice': 'Issue & Post to AR Ledger',
    'modal.newJournalTitle': 'Post Double-Entry Journal (go-ledger-core)',
    'modal.journalMemo': 'Journal Memo / Narration',
    'modal.debitAccount': 'Debit Account (Dr)',
    'modal.creditAccount': 'Credit Account (Cr)',
    'modal.debitAmount': 'Debit Amount ($)',
    'modal.creditAmount': 'Credit Amount ($)',
    'modal.commitJournal': 'Commit Atomic Journal'
  },
  id: {
    'sidebar.activeEntity': 'Entitas Aktif',
    'sidebar.meshHealthy': 'Mesh Buku Besar Go',
    'nav.coreAccounting': 'Akuntansi Utama',
    'nav.dashboard': 'Ringkasan Eksekutif',
    'nav.sales': 'Penjualan & Faktur',
    'nav.cashbank': 'Kas, Bank & Rekonsiliasi',
    'nav.expenses': 'Pembelian & Biaya',
    'nav.booksCompliance': 'Pembukuan & Pajak',
    'nav.ledger': 'Buku Besar & Daftar Akun',
    'nav.reports': 'Laporan Keuangan',
    'nav.platformSystem': 'Sistem & Arsitektur',
    'nav.architecture': 'Arsitektur Next.js + Go',
    'topbar.searchPlaceholder': 'Cari akun, nomor faktur, atau perintah...',
    'topbar.scaleLabel': 'Skala:',
    'tier.umkm': 'UMKM / Mikro',
    'tier.small': 'Perusahaan Kecil',
    'tier.enterprise': 'Enterprise',
    'dashboard.title': 'Pusat Kendali Keuangan',
    'dashboard.subtitle': 'Posisi kas real-time, umur piutang, dan kesehatan buku besar otomatis di seluruh rekening bank terhubung.',
    'actions.newJournal': '+ Buat Jurnal Umum',
    'actions.createInvoice': '+ Buat Faktur Penjualan',
    'kpi.netCash': 'Total Kas & Bank',
    'kpi.syncedNow': 'Tersinkronisasi OpenBanking',
    'kpi.receivables': 'Piutang Usaha (AR)',
    'kpi.payables': 'Hutang Usaha (AP)',
    'kpi.due30d': 'Jatuh tempo < 30hr',
    'kpi.netProfit': 'Laba Bersih (YTD)',
    'kpi.taxReady': 'Estimasi Pajak Siap',
    'dashboard.chartTitle': 'Pendapatan vs. Beban Operasional',
    'dashboard.chartSubtitle': 'Kinerja Akrual 6 Bulan (Mesin Pelaporan Go)',
    'chart.revenue': 'Pendapatan',
    'chart.expenses': 'Beban',
    'dashboard.agingTitle': 'Umur Piutang & Penagihan',
    'dashboard.agingSubtitle': 'Kecepatan kolektibilitas & pengingat otomatis',
    'dashboard.viewAllAr': 'Lihat Faktur →',
    'aging.collectionHealth': 'Indeks Kesehatan Penagihan',
    'aging.current': 'Lancar (0–30 Hari)',
    'aging.due31_60': 'Jatuh Tempo 31–60 Hari',
    'aging.overdue60': 'Menunggak 60+ Hari',
    'dashboard.recentTxTitle': 'Aktivitas Buku Besar & Komersial Terbaru',
    'dashboard.recentTxSubtitle': 'Jejak audit permanen didukung oleh Go Ledger Service',
    'dashboard.openLedger': 'Buka Buku Besar →',
    'table.docNo': 'No. Dok / Ref',
    'table.counterparty': 'Pelanggan / Mitra',
    'table.category': 'Akun / Kategori',
    'table.date': 'Tanggal',
    'table.status': 'Status',
    'table.amount': 'Nominal',
    'table.invoiceNo': 'No. Faktur',
    'table.customer': 'Pelanggan',
    'table.issueDate': 'Tgl Terbit',
    'table.dueDate': 'Jatuh Tempo',
    'table.tax': 'Pajak (PPN/VAT)',
    'table.total': 'Total Tagihan',
    'table.action': 'Tindakan',
    'table.billNo': 'No. Tagihan',
    'table.vendor': 'Vendor / Pemasok',
    'table.expenseAcct': 'Akun Beban',
    'table.approval': 'Persetujuan',
    'table.acctCode': 'Kode Akun',
    'table.acctName': 'Nama Akun (COA)',
    'table.acctType': 'Klasifikasi Kategori',
    'table.normalBal': 'Saldo Normal',
    'table.balance': 'Saldo Saat Ini',
    'table.lineItem': 'Komponen Laporan',
    'table.periodActual': 'Aktual YTD 2030',
    'table.pctRev': '% Pendapatan',
    'sales.title': 'Penjualan & Faktur Pelanggan',
    'sales.subtitle': 'Kelola tagihan komersial, tautan pembayaran otomatis (Stripe / QRIS / Virtual Account), dan penjurnalan piutang.',
    'filter.all': 'Semua',
    'filter.paid': 'Lunas',
    'filter.pending': 'Menunggu',
    'filter.overdue': 'Jatuh Tempo',
    'cashbank.title': 'Kas, Mutasi Bank & Rekonsiliasi Pintar',
    'cashbank.subtitle': 'Integrasi mutasi bank internasional (Mercury USD, Wise EUR) dan bank lokal (BCA, Mandiri) dengan pencocokan 1-klik.',
    'cashbank.reconQueueTitle': 'Antrean Pencocokan Mutasi Bank Otomatis',
    'cashbank.reconQueueSubtitle': 'Konfirmasi pasangan transaksi untuk memposting jurnal penyesuaian secara otomatis',
    'expenses.title': 'Pembelian, Tagihan Vendor & Pengeluaran',
    'expenses.subtitle': 'Pantau tagihan pemasok, beban operasional, potongan PPh 23 / pajak, dan alur persetujuan.',
    'ledger.title': 'Daftar Akun (COA) & Buku Besar Umum',
    'ledger.subtitle': 'Struktur akun standar PSAK & IFRS dengan verifikasi keseimbangan Debit/Kredit secara real-time.',
    'ledger.coaTitle': 'Master Daftar Akun (Chart of Accounts)',
    'ledger.coaSubtitle': 'Saldo diperbarui secara atomik setiap kali jurnal diposting',
    'reports.title': 'Laporan Keuangan & Kepatuhan Pajak',
    'reports.subtitle': 'Laporan Laba Rugi, Neraca siap audit, serta ringkasan PPN / pajak internasional otomatis.',
    'reports.pnlTab': 'Laba Rugi (P&L)',
    'reports.bsTab': 'Neraca (Balance Sheet)',
    'arch.title': 'Arsitektur Microservices Next.js + Go',
    'arch.subtitle': 'Dirancang untuk melayani skala UMKM hingga korporasi Enterprise global tanpa menulis ulang inti mesin akuntansi.',
    'modal.newInvoiceTitle': 'Buat Faktur Penjualan Baru (go-invoice-svc)',
    'modal.customerName': 'Nama Pelanggan / Entitas Klien',
    'modal.dueDate': 'Tanggal Jatuh Tempo',
    'modal.subtotal': 'Subtotal Sebelum Pajak (Basis USD)',
    'modal.taxRate': 'Skema Pajak (PPN / VAT / GST)',
    'modal.cancel': 'Batal',
    'modal.postInvoice': 'Terbitkan & Posting ke Piutang',
    'modal.newJournalTitle': 'Posting Jurnal Umum Double-Entry (go-ledger-core)',
    'modal.journalMemo': 'Memo / Keterangan Jurnal',
    'modal.debitAccount': 'Akun Debit (Dr)',
    'modal.creditAccount': 'Akun Kredit (Cr)',
    'modal.debitAmount': 'Nominal Debit ($)',
    'modal.creditAmount': 'Nominal Kredit ($)',
    'modal.commitJournal': 'Posting Jurnal Atomik'
  }
};

/* --------------------------------------------------------------------------
   DATASETS (Base USD values — Scaled by Tier & Converted by Currency)
   -------------------------------------------------------------------------- */
const monthlySeries = [
  { month: 'Jun', rev: 34200, exp: 21500 },
  { month: 'Jul', rev: 38900, exp: 23100 },
  { month: 'Aug', rev: 36400, exp: 22400 },
  { month: 'Sep', rev: 44800, exp: 25900 },
  { month: 'Oct', rev: 49200, exp: 27300 },
  { month: 'Nov', rev: 56400, exp: 29800 },
];

const invoicesData = [
  { id: 'INV-2030-0891', customer: 'PT Astra Cloud Indonesia', issueDate: '2030-11-02', dueDate: '2030-12-02', taxLabel: 'PPN 11%', status: 'PENDING', baseTotal: 14800 },
  { id: 'INV-2030-0890', customer: 'Vercel Enterprise APAC', issueDate: '2030-10-28', dueDate: '2030-11-28', taxLabel: 'GST 9%', status: 'PAID', baseTotal: 22400 },
  { id: 'INV-2030-0889', customer: 'Kopi Kenangan Retail Group', issueDate: '2030-10-15', dueDate: '2030-11-01', taxLabel: 'PPN 11%', status: 'OVERDUE', baseTotal: 8950 },
  { id: 'INV-2030-0888', customer: 'Stripe Singapore Pte Ltd', issueDate: '2030-10-12', dueDate: '2030-11-12', taxLabel: 'Zero 0%', status: 'PAID', baseTotal: 31200 },
  { id: 'INV-2030-0887', customer: 'PT Telkom Data Ekosistem', issueDate: '2030-10-05', dueDate: '2030-11-04', taxLabel: 'PPN 11%', status: 'OVERDUE', baseTotal: 11900 },
  { id: 'INV-2030-0886', customer: 'Linear Orbit GmbH (EU)', issueDate: '2030-11-05', dueDate: '2030-12-05', taxLabel: 'Reverse VAT', status: 'PENDING', baseTotal: 7000 }
];

let reconQueueData = [
  {
    id: 'REC-101',
    bankName: 'BCA Corporate IDR • 0192',
    stmtDesc: 'TRSF E-BANKING CR PT ASTRA CLOUD',
    stmtDate: '2030-11-06',
    ledgerRef: 'INV-2030-0884 • Payment Receipt',
    confidence: '99.8% Deterministic',
    baseAmount: 12450
  },
  {
    id: 'REC-102',
    bankName: 'Mercury Checking USD • 8841',
    stmtDesc: 'ACH DEBIT AMAZON WEB SERVICES',
    stmtDate: '2030-11-05',
    ledgerRef: 'BILL-2030-412 • Cloud Infrastructure',
    confidence: '98.4% Rule Match',
    baseAmount: 4320
  },
  {
    id: 'REC-103',
    bankName: 'Bank Mandiri Giro • 4410',
    stmtDesc: 'QRIS SETTLEMENT BATCH #99102',
    stmtDate: '2030-11-05',
    ledgerRef: 'POS-2030-1105 • Daily Retail Sales',
    confidence: '100% Exact Ref',
    baseAmount: 2890
  }
];

const expensesData = [
  { billNo: 'BILL-2030-415', vendor: 'Amazon Web Services APAC', acct: '6-60100 • Cloud & Server Infra', due: '2030-11-20', approval: 'APPROVED', baseAmount: 6450 },
  { billNo: 'BILL-2030-414', vendor: 'PT Gedung Perkantoran Sudirman', acct: '6-60300 • Office Lease & Utility', due: '2030-11-15', approval: 'APPROVED', baseAmount: 4800 },
  { billNo: 'BILL-2030-413', vendor: 'Snowflake Data Warehouse Inc.', acct: '6-60100 • Cloud & Server Infra', due: '2030-11-25', approval: 'PENDING_CFO', baseAmount: 3250 },
  { billNo: 'BILL-2030-412', vendor: 'Kantor Konsultan Pajak Pratama', acct: '6-60500 • Legal & Tax Advisory', due: '2030-11-28', approval: 'APPROVED', baseAmount: 1900 }
];

const coaData = [
  { code: '1-10100', nameEn: 'Cash & Bank Operating Accounts', nameId: 'Kas & Rekening Operasional Bank', typeEn: 'Current Asset', typeId: 'Aset Lancar', normal: 'DEBIT', baseBal: 148920 },
  { code: '1-10200', nameEn: 'Accounts Receivable (Trade AR)', nameId: 'Piutang Usaha Dagang', typeEn: 'Current Asset', typeId: 'Aset Lancar', normal: 'DEBIT', baseBal: 42650 },
  { code: '1-10500', nameEn: 'Prepaid Tax & VAT Input (PPN Masukan)', nameId: 'Pajak Dibayar Dimuka & PPN Masukan', typeEn: 'Current Asset', typeId: 'Aset Lancar', normal: 'DEBIT', baseBal: 9420 },
  { code: '2-20100', nameEn: 'Accounts Payable (Trade AP)', nameId: 'Hutang Usaha Pemasok', typeEn: 'Current Liability', typeId: 'Liabilitas Jangka Pendek', normal: 'CREDIT', baseBal: 16400 },
  { code: '2-20300', nameEn: 'Tax Payable (PPN Keluaran / VAT / PPh)', nameId: 'Hutang Pajak (PPN Keluaran & PPh)', typeEn: 'Current Liability', typeId: 'Liabilitas Jangka Pendek', normal: 'CREDIT', baseBal: 11850 },
  { code: '3-30100', nameEn: 'Paid-In Capital & Retained Earnings', nameId: 'Modal Disetor & Laba Ditahan', typeEn: 'Equity', typeId: 'Ekuitas', normal: 'CREDIT', baseBal: 83400 },
  { code: '4-40100', nameEn: 'SaaS & Commercial Sales Revenue', nameId: 'Pendapatan Penjualan & Langganan', typeEn: 'Operating Revenue', typeId: 'Pendapatan Operasional', normal: 'CREDIT', baseBal: 284500 },
  { code: '5-50100', nameEn: 'Cost of Goods Sold & Payment Gateway Fees', nameId: 'Harga Pokok Penjualan (HPP) & Biaya Payment', typeEn: 'COGS / Direct Cost', typeId: 'Beban Pokok Penjualan', normal: 'DEBIT', baseBal: 48200 },
  { code: '6-60100', nameEn: 'Cloud Infrastructure, R&D & Payroll', nameId: 'Beban Infrastruktur Cloud, Gaji & Operasional', typeEn: 'Operating Expense', typeId: 'Beban Operasional', normal: 'DEBIT', baseBal: 146960 }
];

const archServices = [
  {
    name: 'nextjs-web-bff',
    runtime: 'Next.js 16 (App Router)',
    roleEn: 'Multi-tenant UI shell, Edge i18n (EN/ID), Server Actions, & role-based adaptive tier rendering (UMKM to Enterprise).',
    roleId: 'Shell UI multi-tenant, lokalisasi Edge (EN/ID), Server Actions, & adaptasi antarmuka otomatis (UMKM hingga Enterprise).',
    protocol: 'HTTPS / React Server Components',
    storage: 'Redis Edge Session Cache',
    sla: '99.99% Global Edge'
  },
  {
    name: 'go-ledger-core',
    runtime: 'Go 1.25 (gRPC)',
    roleEn: 'Immutable double-entry accounting engine. Guarantees atomic Debit == Credit constraints and cryptographic hash chaining.',
    roleId: 'Mesin jurnal double-entry permanen. Menjamin validasi atomik Debit == Kredit serta penguncian hash kriptografi.',
    protocol: 'gRPC / Protobuf v3',
    storage: 'PostgreSQL 17 (Serializable)',
    sla: '1.2ms Write Latency'
  },
  {
    name: 'go-invoice-tax-svc',
    runtime: 'Go 1.25 + Worker',
    roleEn: 'Handles multi-currency invoicing, QRIS/Stripe payment webhooks, e-Faktur PPN 11%, PPh Final UMKM 0.5%, and international GST/VAT.',
    roleId: 'Menangani faktur multi-mata uang, webhook pembayaran QRIS/Stripe, e-Faktur PPN 11%, PPh Final UMKM 0,5%, dan pajak ekspor.',
    protocol: 'gRPC + NATS JetStream',
    storage: 'PostgreSQL + S3 PDF Vault',
    sla: '12,000 Inv/sec Burst'
  },
  {
    name: 'go-bank-recon-svc',
    runtime: 'Go 1.25 Stream',
    roleEn: 'Ingests real-time OpenBanking feeds (BCA, Mandiri, Mercury, Wise) and runs deterministic + fuzzy matching against open ledger items.',
    roleId: 'Mengambil mutasi OpenBanking real-time (BCA, Mandiri, Mercury, Wise) dan mencocokkan otomatis dengan transaksi buku besar.',
    protocol: 'Kafka / NATS + ISO-20022',
    storage: 'TimescaleDB / Postgres',
    sla: 'Sub-second Matching'
  },
  {
    name: 'go-reporting-olap',
    runtime: 'Go 1.25 + DuckDB',
    roleEn: 'Generates instant Profit & Loss, Balance Sheet, Cash Flow, and multi-entity consolidated trial balances with zero lock contention.',
    roleId: 'Menghasilkan Laporan Laba Rugi, Neraca, Arus Kas, dan konsolidasi multi-cabang secara instan tanpa membebani database transaksi.',
    protocol: 'gRPC Streaming',
    storage: 'ClickHouse / Columnar Read-Replica',
    sla: '< 15ms Report Render'
  },
  {
    name: 'go-tenant-iam-svc',
    runtime: 'Go 1.25 Security',
    roleEn: 'Manages Row-Level Security (RLS), UMKM single-owner access up to Enterprise multi-level CFO approval workflows and SSO/SAML.',
    roleId: 'Mengelola keamanan data antar perusahaan (RLS), mulai dari akses pemilik tunggal UMKM hingga persetujuan berjenjang CFO Enterprise.',
    protocol: 'OAuth 2.1 / Passkeys / mTLS',
    storage: 'PostgreSQL IAM Vault',
    sla: 'Zero-Trust Verified'
  }
];

/* --------------------------------------------------------------------------
   FORMATTERS (Currency & Scaling)
   -------------------------------------------------------------------------- */
function getScaledAmount(baseUsd) {
  const mult = tierConfigs[state.tier].multiplier;
  return baseUsd * mult;
}

function formatMoney(baseUsd, compact = false) {
  const scaledUsd = getScaledAmount(baseUsd);
  if (state.currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: compact ? 1 : 2
    }).format(scaledUsd);
  } else {
    const idrAmount = Math.round(scaledUsd * FX_RATE_IDR);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: 0
    }).format(idrAmount);
  }
}

/* --------------------------------------------------------------------------
   RENDER FUNCTIONS
   -------------------------------------------------------------------------- */
function applyTranslations() {
  const dict = i18n[state.lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Update Tier Context Bar & Entity Badge
  const tierCfg = tierConfigs[state.tier];
  document.getElementById('activeEntityName').textContent = tierCfg.entityName;
  document.getElementById('sidebarTierBadge').textContent = state.lang === 'en' ? tierCfg.badgeEn : tierCfg.badgeId;
  document.getElementById('tierModeTag').textContent = state.lang === 'en' ? tierCfg.tagEn : tierCfg.tagId;
  document.getElementById('tierContextDesc').textContent = state.lang === 'en' ? tierCfg.descEn : tierCfg.descId;

  const chipsWrap = document.getElementById('tierFeatureChips');
  chipsWrap.innerHTML = tierCfg.chips.map(c => `<span class="feature-chip">${c}</span>`).join('');
}

function renderKPIs() {
  // Calculate live AR from invoicesData
  const openInvoices = invoicesData.filter(inv => inv.status !== 'PAID');
  const overdueInvoices = invoicesData.filter(inv => inv.status === 'OVERDUE');
  const totalArBase = openInvoices.reduce((acc, item) => acc + item.baseTotal, 0);

  const cashAccount = coaData.find(a => a.code === '1-10100');
  const apAccount = coaData.find(a => a.code === '2-20100');

  document.getElementById('kpiCashValue').textContent = formatMoney(cashAccount.baseBal);
  document.getElementById('kpiArValue').textContent = formatMoney(totalArBase);
  document.getElementById('kpiApValue').textContent = formatMoney(apAccount.baseBal);
  document.getElementById('kpiProfitValue').textContent = formatMoney(89340);

  document.getElementById('kpiOverdueBadge').textContent =
    state.lang === 'en' ? `${overdueInvoices.length} Overdue` : `${overdueInvoices.length} Menunggak`;
  document.getElementById('kpiOpenInvCount').textContent =
    state.lang === 'en' ? `${openInvoices.length} Open Invoices` : `${openInvoices.length} Faktur Aktif`;

  document.getElementById('navInvoiceCount').textContent = invoicesData.length;
  document.getElementById('navReconBadge').textContent = reconQueueData.length;

  // Aging breakdown values
  document.getElementById('agingCurrentVal').textContent = formatMoney(totalArBase * 0.62);
  document.getElementById('aging30Val').textContent = formatMoney(totalArBase * 0.24);
  document.getElementById('aging60Val').textContent = formatMoney(totalArBase * 0.14);
}

function renderCashflowChart() {
  const container = document.getElementById('cashflowChartContainer');
  const maxVal = Math.max(...monthlySeries.map(d => d.rev)) * 1.12;

  const svgWidth = 680;
  const svgHeight = 200;
  const chartBottom = 168;
  const barGroupWidth = svgWidth / monthlySeries.length;

  let barsHtml = '';
  let gridLinesHtml = '';

  // 4 Crisp architectural horizontal grid lines
  for (let i = 0; i <= 3; i++) {
    const y = 20 + (i * ((chartBottom - 20) / 3));
    const labelVal = maxVal * (1 - i / 3);
    gridLinesHtml += `
      <line x1="65" y1="${y}" x2="${svgWidth - 10}" y2="${y}" stroke="var(--border-subtle)" stroke-dasharray="3 3" />
      <text x="58" y="${y + 4}" text-anchor="end" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="10">
        ${formatMoney(labelVal, true)}
      </text>
    `;
  }

  monthlySeries.forEach((item, idx) => {
    const xBase = 82 + idx * ((svgWidth - 95) / monthlySeries.length);
    const revHeight = (item.rev / maxVal) * (chartBottom - 24);
    const expHeight = (item.exp / maxVal) * (chartBottom - 24);

    const revY = chartBottom - revHeight;
    const expY = chartBottom - expHeight;

    barsHtml += `
      <g class="chart-bar-group">
        <!-- Revenue Bar (Matte Cobalt) -->
        <rect x="${xBase}" y="${revY}" width="22" height="${revHeight}" rx="2" fill="var(--accent-primary)" />
        <!-- Expense Bar (Structural Slate) -->
        <rect x="${xBase + 26}" y="${expY}" width="22" height="${expHeight}" rx="2" fill="var(--border-strong)" />
        <!-- Month Label -->
        <text x="${xBase + 24}" y="${chartBottom + 20}" text-anchor="middle" fill="var(--text-secondary)" font-family="var(--font-mono)" font-size="11" font-weight="600">
          ${item.month}
        </text>
      </g>
    `;
  });

  container.innerHTML = `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="100%" preserveAspectRatio="none">
      ${gridLinesHtml}
      ${barsHtml}
    </svg>
  `;
}

function getStatusBadgeHtml(status) {
  const map = {
    PAID: { cls: 'badge-positive', en: 'PAID', id: 'LUNAS' },
    PENDING: { cls: 'badge-neutral', en: 'AWAITING', id: 'MENUNGGU' },
    OVERDUE: { cls: 'badge-danger', en: 'OVERDUE', id: 'MENUNGGAK' },
    APPROVED: { cls: 'badge-positive', en: 'APPROVED', id: 'DISETUJUI' },
    PENDING_CFO: { cls: 'badge-warning', en: 'CFO REVIEW', id: 'TINJAUAN CFO' }
  };
  const item = map[status] || { cls: 'badge-neutral', en: status, id: status };
  return `<span class="badge ${item.cls} mono">${state.lang === 'en' ? item.en : item.id}</span>`;
}

function renderDashboardRecentTable() {
  const tbody = document.getElementById('dashboardRecentTableBody');
  const recentRows = invoicesData.slice(0, 5);
  tbody.innerHTML = recentRows.map(inv => `
    <tr>
      <td class="mono cell-primary">${inv.id}</td>
      <td>
        <span class="cell-primary">${inv.customer}</span>
        <span class="cell-sub">${inv.taxLabel}</span>
      </td>
      <td class="mono">4-40100 • Sales Revenue</td>
      <td class="mono">${inv.issueDate}</td>
      <td>${getStatusBadgeHtml(inv.status)}</td>
      <td class="text-right mono cell-primary">${formatMoney(inv.baseTotal)}</td>
    </tr>
  `).join('');
}

function renderSalesInvoicesTable() {
  const tbody = document.getElementById('salesInvoiceTableBody');
  const filtered = invoicesData.filter(inv => {
    const matchesStatus = state.invoiceFilter === 'ALL' || inv.status === state.invoiceFilter;
    const q = state.invoiceSearch.trim().toLowerCase();
    const matchesSearch = !q || inv.customer.toLowerCase().includes(q) || inv.id.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding: 28px; color: var(--text-muted);">
          ${state.lang === 'en' ? 'No matching invoices found.' : 'Tidak ada faktur yang sesuai filter.'}
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(inv => {
    const actionBtn = inv.status !== 'PAID'
      ? `<button class="btn btn-secondary btn-sm" data-mark-paid="${inv.id}">
           ${state.lang === 'en' ? 'Record Payment' : 'Terima Pembayaran'}
         </button>`
      : `<span class="mono" style="color:var(--text-muted); font-size:11.5px;">${state.lang === 'en' ? 'Settled' : 'Terekonsiliasi'}</span>`;

    return `
      <tr>
        <td class="mono cell-primary">${inv.id}</td>
        <td class="cell-primary">${inv.customer}</td>
        <td class="mono">${inv.issueDate}</td>
        <td class="mono">${inv.dueDate}</td>
        <td><span class="badge badge-neutral mono">${inv.taxLabel}</span></td>
        <td>${getStatusBadgeHtml(inv.status)}</td>
        <td class="text-right mono cell-primary">${formatMoney(inv.baseTotal)}</td>
        <td class="text-right">${actionBtn}</td>
      </tr>
    `;
  }).join('');
}

function renderCashBankModule() {
  const bankGrid = document.getElementById('bankAccountsGrid');
  const banks = [
    { name: 'BCA Corporate Giro', code: 'IDR • 01928841', bal: 68400, status: 'OpenBanking Live' },
    { name: 'Mercury Commercial USD', code: 'USD • 88412099', bal: 52120, status: 'Plaid / FedNow' },
    { name: 'Bank Mandiri Treasury', code: 'IDR • 44100982', bal: 18900, status: 'BI-FAST Connected' },
    { name: 'DBS Singapore Multi-CCY', code: 'SGD/USD • 7712', bal: 9500, status: 'FAST / PayNow' }
  ];

  bankGrid.innerHTML = banks.map(b => `
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-label">${b.name}</span>
        <span class="kpi-code">${b.code}</span>
      </div>
      <div class="kpi-value">${formatMoney(b.bal)}</div>
      <div class="kpi-footer">
        <span class="badge badge-positive">${b.status}</span>
        <span class="mono">Auto-Feed</span>
      </div>
    </div>
  `).join('');

  const reconContainer = document.getElementById('reconQueueContainer');
  if (reconQueueData.length === 0) {
    reconContainer.innerHTML = `
      <div style="padding: 28px; text-align: center; color: var(--status-positive-text); font-weight: 600;">
        ✓ ${state.lang === 'en'
          ? 'All bank statement lines are 100% reconciled with the General Ledger!'
          : 'Seluruh mutasi rekening bank telah 100% terekonsiliasi dengan Buku Besar!'}
      </div>
    `;
    return;
  }

  reconContainer.innerHTML = reconQueueData.map(item => `
    <div class="recon-item">
      <div class="recon-box">
        <div>
          <span class="cell-primary">${item.stmtDesc}</span>
          <span class="cell-sub">${item.bankName} • ${item.stmtDate}</span>
        </div>
        <span class="mono cell-primary">${formatMoney(item.baseAmount)}</span>
      </div>

      <span class="recon-match-pill">${item.confidence}</span>

      <div class="recon-box">
        <div>
          <span class="cell-primary">${item.ledgerRef}</span>
          <span class="cell-sub">${state.lang === 'en' ? 'System Accrual Entry' : 'Jurnal Akrual Sistem'}</span>
        </div>
        <span class="mono cell-primary">${formatMoney(item.baseAmount)}</span>
      </div>

      <button class="btn btn-primary btn-sm" data-confirm-recon="${item.id}">
        ${state.lang === 'en' ? 'Confirm Match' : 'Konfirmasi Cocok'}
      </button>
    </div>
  `).join('');
}

function renderExpensesModule() {
  const tbody = document.getElementById('expensesTableBody');
  tbody.innerHTML = expensesData.map(ex => `
    <tr>
      <td class="mono cell-primary">${ex.billNo}</td>
      <td class="cell-primary">${ex.vendor}</td>
      <td class="mono">${ex.acct}</td>
      <td class="mono">${ex.due}</td>
      <td>${getStatusBadgeHtml(ex.approval)}</td>
      <td class="text-right mono cell-primary">${formatMoney(ex.baseAmount)}</td>
    </tr>
  `).join('');
}

function renderLedgerModule() {
  const tbody = document.getElementById('coaTableBody');
  tbody.innerHTML = coaData.map(acct => `
    <tr>
      <td class="mono cell-primary">${acct.code}</td>
      <td class="cell-primary">${state.lang === 'en' ? acct.nameEn : acct.nameId}</td>
      <td>${state.lang === 'en' ? acct.typeEn : acct.typeId}</td>
      <td><span class="badge badge-neutral mono">${acct.normal}</span></td>
      <td class="text-right mono cell-primary">${formatMoney(acct.baseBal)}</td>
    </tr>
  `).join('');
}

function renderFinancialReportsModule() {
  const tbody = document.getElementById('financialReportTableBody');
  const titleEl = document.getElementById('activeReportTitle');

  if (state.reportType === 'pnl') {
    titleEl.textContent = state.lang === 'en'
      ? 'Statement of Profit & Loss (Income Statement)'
      : 'Laporan Laba Rugi Komprehensif';

    const rows = [
      { code: '4-40100', nameEn: 'Gross SaaS & Commercial Revenue', nameId: 'Pendapatan Penjualan & Langganan Kotor', val: 284500, pct: '100.0%', bold: false },
      { code: '5-50100', nameEn: 'Less: Cost of Goods Sold (COGS) & Payment Fees', nameId: 'Dikurangi: Harga Pokok Penjualan (HPP)', val: -48200, pct: '-16.9%', bold: false },
      { code: 'GROSS', nameEn: 'Gross Profit', nameId: 'Laba Kotor', val: 236300, pct: '83.1%', bold: true },
      { code: '6-60100', nameEn: 'Cloud Infrastructure, R&D & Engineering Payroll', nameId: 'Beban Infrastruktur Cloud, R&D & Gaji', val: -128400, pct: '-45.1%', bold: false },
      { code: '6-60300', nameEn: 'General, Administrative & Tax Advisory', nameId: 'Beban Umum, Administrasi & Konsultan', val: -18560, pct: '-6.5%', bold: false },
      { code: 'NET', nameEn: 'Net Operating Profit (EBITDA)', nameId: 'Laba Bersih Operasional', val: 89340, pct: '31.4%', bold: true }
    ];

    tbody.innerHTML = rows.map(r => `
      <tr style="${r.bold ? 'background-color: var(--bg-subtle); font-weight: 700;' : ''}">
        <td class="mono">${r.code}</td>
        <td class="${r.bold ? 'cell-primary' : ''}">${state.lang === 'en' ? r.nameEn : r.nameId}</td>
        <td class="text-right mono ${r.bold ? 'cell-primary' : ''}">${formatMoney(r.val)}</td>
        <td class="text-right mono">${r.pct}</td>
      </tr>
    `).join('');
  } else {
    titleEl.textContent = state.lang === 'en'
      ? 'Statement of Financial Position (Balance Sheet)'
      : 'Laporan Posisi Keuangan (Neraca)';

    const rows = [
      { code: '1-10100', nameEn: 'Cash & Bank Operating Balances', nameId: 'Kas & Setara Kas Bank', val: 148920, pct: '74.1%', bold: false },
      { code: '1-10200', nameEn: 'Accounts Receivable (Net AR)', nameId: 'Piutang Usaha Bersih', val: 42650, pct: '21.2%', bold: false },
      { code: '1-10500', nameEn: 'Prepaid Tax & VAT Input', nameId: 'Pajak Dibayar Dimuka', val: 9420, pct: '4.7%', bold: false },
      { code: 'ASSETS', nameEn: 'Total Assets', nameId: 'Total Aset Aktiva', val: 200990, pct: '100.0%', bold: true },
      { code: '2-20100', nameEn: 'Accounts Payable & Accrued Liabilities', nameId: 'Hutang Usaha & Beban Akrual', val: 28250, pct: '14.1%', bold: false },
      { code: '3-30100', nameEn: 'Shareholders Equity & Retained Earnings', nameId: 'Modal Ekuitas & Laba Berjalan', val: 172740, pct: '85.9%', bold: false },
      { code: 'LIAB+EQ', nameEn: 'Total Liabilities & Equity', nameId: 'Total Liabilitas & Ekuitas Pasiva', val: 200990, pct: '100.0%', bold: true }
    ];

    tbody.innerHTML = rows.map(r => `
      <tr style="${r.bold ? 'background-color: var(--bg-subtle); font-weight: 700;' : ''}">
        <td class="mono">${r.code}</td>
        <td class="${r.bold ? 'cell-primary' : ''}">${state.lang === 'en' ? r.nameEn : r.nameId}</td>
        <td class="text-right mono ${r.bold ? 'cell-primary' : ''}">${formatMoney(r.val)}</td>
        <td class="text-right mono">${r.pct}</td>
      </tr>
    `).join('');
  }
}

function renderArchitectureModule() {
  const grid = document.getElementById('archServicesGrid');
  grid.innerHTML = archServices.map(svc => `
    <div class="service-card">
      <div class="service-card-top">
        <span class="service-name">${svc.name}</span>
        <span class="service-runtime">${svc.runtime}</span>
      </div>
      <p style="font-size: 13px; color: var(--text-secondary);">
        ${state.lang === 'en' ? svc.roleEn : svc.roleId}
      </p>
      <div class="service-meta-list">
        <div class="service-meta-row">
          <span>Protocol</span>
          <span class="mono">${svc.protocol}</span>
        </div>
        <div class="service-meta-row">
          <span>Datastore</span>
          <span class="mono">${svc.storage}</span>
        </div>
        <div class="service-meta-row">
          <span>Target SLA</span>
          <span class="badge badge-positive mono">${svc.sla}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function renderAll() {
  applyTranslations();
  renderKPIs();
  renderCashflowChart();
  renderDashboardRecentTable();
  renderSalesInvoicesTable();
  renderCashBankModule();
  renderExpensesModule();
  renderLedgerModule();
  renderFinancialReportsModule();
  renderArchitectureModule();
}

/* --------------------------------------------------------------------------
   TOAST HELPER
   -------------------------------------------------------------------------- */
function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="status-dot"></span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3400);
}

/* --------------------------------------------------------------------------
   NAVIGATION & EVENT LISTENERS
   -------------------------------------------------------------------------- */
function switchView(viewId) {
  state.activeView = viewId;
  document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewId);
  });
  document.querySelectorAll('.module-view').forEach(sec => {
    sec.classList.toggle('active', sec.id === `view-${viewId}`);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderAll();

  // Sidebar view switching
  document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.getAttribute('data-view'));
    });
  });

  // Quick goto buttons inside panels
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.getAttribute('data-goto'));
    });
  });

  // Tier Switcher (UMKM / Small / Enterprise)
  document.querySelectorAll('[data-tier]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.tier = btn.getAttribute('data-tier');
      document.querySelectorAll('[data-tier]').forEach(b => b.classList.toggle('active', b === btn));
      renderAll();
      const label = tierConfigs[state.tier].entityName;
      showToast(state.lang === 'en'
        ? `Switched workspace scale to ${label}`
        : `Skala tampilan diubah ke ${label}`);
    });
  });

  // Currency Switcher (USD / IDR)
  document.querySelectorAll('[data-currency]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.currency = btn.getAttribute('data-currency');
      document.querySelectorAll('[data-currency]').forEach(b => b.classList.toggle('active', b === btn));
      renderAll();
      showToast(state.lang === 'en'
        ? `Display currency set to ${state.currency}`
        : `Mata uang tampilan diubah ke ${state.currency}`);
    });
  });

  // Language Switcher (EN / ID)
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.lang = btn.getAttribute('data-lang');
      document.documentElement.lang = state.lang;
      document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('active', b === btn));
      renderAll();
      showToast(state.lang === 'en'
        ? 'Language switched to English (Main)'
        : 'Bahasa diubah ke Bahasa Indonesia');
    });
  });

  // Matte Surface Theme Switcher (Daylight vs Carbon — Both Non-Glow)
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeLabel = document.getElementById('themeToggleLabel');
  themeBtn.addEventListener('click', () => {
    state.theme = state.theme === 'daylight' ? 'carbon' : 'daylight';
    document.documentElement.setAttribute('data-theme', state.theme);
    themeLabel.textContent = state.theme === 'daylight' ? 'Matte Carbon' : 'Daylight Mode';
  });

  // Sales Invoice Filter & Search
  document.querySelectorAll('[data-inv-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.invoiceFilter = btn.getAttribute('data-inv-filter');
      document.querySelectorAll('[data-inv-filter]').forEach(b => b.classList.toggle('active', b === btn));
      renderSalesInvoicesTable();
    });
  });

  document.getElementById('invoiceSearchInput').addEventListener('input', e => {
    state.invoiceSearch = e.target.value;
    renderSalesInvoicesTable();
  });

  // Delegated clicks for "Record Payment" & "Confirm Match"
  document.body.addEventListener('click', e => {
    const payBtn = e.target.closest('[data-mark-paid]');
    if (payBtn) {
      const invId = payBtn.getAttribute('data-mark-paid');
      const targetInv = invoicesData.find(i => i.id === invId);
      if (targetInv) {
        targetInv.status = 'PAID';
        const cashAcct = coaData.find(a => a.code === '1-10100');
        cashAcct.baseBal += targetInv.baseTotal;
        renderAll();
        showToast(state.lang === 'en'
          ? `Payment recorded for ${invId} • Posted Dr Cash / Cr AR`
          : `Pembayaran ${invId} diterima • Diposting ke Buku Besar Kas`);
      }
    }

    const reconBtn = e.target.closest('[data-confirm-recon]');
    if (reconBtn) {
      const recId = reconBtn.getAttribute('data-confirm-recon');
      const idx = reconQueueData.findIndex(r => r.id === recId);
      if (idx !== -1) {
        const item = reconQueueData[idx];
        reconQueueData.splice(idx, 1);
        renderAll();
        showToast(state.lang === 'en'
          ? `Reconciled ${item.id} (${item.stmtDesc}) via go-recon-svc`
          : `Berhasil rekonsiliasi ${item.id} (${item.stmtDesc})`);
      }
    }

    const closeModalAttr = e.target.closest('[data-close-modal]');
    if (closeModalAttr) {
      const modalId = closeModalAttr.getAttribute('data-close-modal');
      document.getElementById(modalId).classList.remove('open');
    }
  });

  // Report Switcher (P&L vs Balance Sheet)
  document.querySelectorAll('[data-report]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.reportType = btn.getAttribute('data-report');
      document.querySelectorAll('[data-report]').forEach(b => b.classList.toggle('active', b === btn));
      renderFinancialReportsModule();
    });
  });

  // Open Create Invoice Modal
  const openInvModal = () => {
    document.getElementById('invoiceModalBackdrop').classList.add('open');
    updateInvoiceModalPreview();
  };
  document.getElementById('dashNewInvoiceBtn').addEventListener('click', openInvModal);
  document.getElementById('salesNewInvoiceBtn').addEventListener('click', openInvModal);

  const updateInvoiceModalPreview = () => {
    const sub = parseFloat(document.getElementById('invAmountInput').value) || 0;
    const taxRate = parseFloat(document.getElementById('invTaxSelect').value) || 0;
    const total = sub * (1 + taxRate);
    document.getElementById('invLiveTotalPreview').textContent =
      `Total + Tax: ${formatMoney(total)}`;
  };
  document.getElementById('invAmountInput').addEventListener('input', updateInvoiceModalPreview);
  document.getElementById('invTaxSelect').addEventListener('change', updateInvoiceModalPreview);

  // Submit Create Invoice Form
  document.getElementById('createInvoiceForm').addEventListener('submit', e => {
    e.preventDefault();
    const customer = document.getElementById('invCustomerInput').value.trim();
    const dueDate = document.getElementById('invDueInput').value;
    const sub = parseFloat(document.getElementById('invAmountInput').value) || 1000;
    const taxRate = parseFloat(document.getElementById('invTaxSelect').value) || 0;
    const total = Math.round(sub * (1 + taxRate));

    const newId = `INV-2030-0${892 + invoicesData.length}`;
    const taxLabel = taxRate === 0.11 ? 'PPN 11%' : taxRate === 0.09 ? 'GST 9%' : 'Zero 0%';

    invoicesData.unshift({
      id: newId,
      customer,
      issueDate: '2030-11-07',
      dueDate,
      taxLabel,
      status: 'PENDING',
      baseTotal: total
    });

    document.getElementById('invoiceModalBackdrop').classList.remove('open');
    document.getElementById('invCustomerInput').value = '';
    switchView('sales');
    renderAll();
    showToast(state.lang === 'en'
      ? `Created ${newId} for ${customer} via go-invoice-svc`
      : `Faktur ${newId} untuk ${customer} berhasil diterbitkan`);
  });

  // Open Post Journal Modal
  const openJournalModal = () => {
    document.getElementById('journalModalBackdrop').classList.add('open');
  };
  document.getElementById('dashNewJournalBtn').addEventListener('click', openJournalModal);
  document.getElementById('ledgerNewJournalBtn').addEventListener('click', openJournalModal);

  const validateJournalBalance = () => {
    const dr = parseFloat(document.getElementById('jrnDebitVal').value) || 0;
    const cr = parseFloat(document.getElementById('jrnCreditVal').value) || 0;
    const statusBadge = document.getElementById('jrnBalanceStatus');
    const submitBtn = document.getElementById('jrnSubmitBtn');

    if (dr > 0 && Math.abs(dr - cr) < 0.001) {
      statusBadge.className = 'badge badge-positive mono';
      statusBadge.textContent = `BALANCED: DR $${dr.toLocaleString()} == CR $${cr.toLocaleString()}`;
      submitBtn.disabled = false;
    } else {
      statusBadge.className = 'badge badge-danger mono';
      statusBadge.textContent = `OUT OF BALANCE: DIFF $${Math.abs(dr - cr).toLocaleString()}`;
      submitBtn.disabled = true;
    }
  };
  document.getElementById('jrnDebitVal').addEventListener('input', validateJournalBalance);
  document.getElementById('jrnCreditVal').addEventListener('input', validateJournalBalance);

  document.getElementById('createJournalForm').addEventListener('submit', e => {
    e.preventDefault();
    const memo = document.getElementById('jrnMemoInput').value.trim();
    const drCode = document.getElementById('jrnDebitAcct').value;
    const amount = parseFloat(document.getElementById('jrnDebitVal').value) || 0;

    const acct = coaData.find(a => a.code === drCode);
    if (acct) acct.baseBal += amount;

    document.getElementById('journalModalBackdrop').classList.remove('open');
    document.getElementById('jrnMemoInput').value = '';
    switchView('ledger');
    renderAll();
    showToast(state.lang === 'en'
      ? `Posted atomic journal (${memo}) to go-ledger-core`
      : `Jurnal umum (${memo}) berhasil diposting ke Buku Besar`);
  });

  // Command Palette (Ctrl+K / Cmd+K)
  const cmdBackdrop = document.getElementById('cmdPaletteBackdrop');
  const cmdInput = document.getElementById('cmdSearchInput');
  const cmdList = document.getElementById('cmdPaletteList');

  const commands = [
    { labelEn: 'Go to Executive Overview', labelId: 'Buka Ringkasan Eksekutif', action: () => switchView('dashboard') },
    { labelEn: 'Go to Sales & Invoicing', labelId: 'Buka Penjualan & Faktur', action: () => switchView('sales') },
    { labelEn: 'Go to Cash & Bank Reconciliation', labelId: 'Buka Rekonsiliasi Bank', action: () => switchView('cashbank') },
    { labelEn: 'Go to General Ledger & COA', labelId: 'Buka Buku Besar & Daftar Akun', action: () => switchView('ledger') },
    { labelEn: 'Go to Financial Statements (P&L / Balance Sheet)', labelId: 'Buka Laporan Keuangan (Laba Rugi / Neraca)', action: () => switchView('reports') },
    { labelEn: 'Inspect Next.js + Go Microservices Blueprint', labelId: 'Lihat Arsitektur Microservices Next.js + Go', action: () => switchView('architecture') },
    { labelEn: 'Action: Create New Sales Invoice', labelId: 'Aksi: Buat Faktur Penjualan Baru', action: () => openInvModal() },
    { labelEn: 'Action: Post Double-Entry Journal', labelId: 'Aksi: Buat Jurnal Umum Baru', action: () => openJournalModal() },
    { labelEn: 'Switch Scale: UMKM / Micro-SME', labelId: 'Ubah Skala: UMKM / Mikro', action: () => document.querySelector('[data-tier="umkm"]').click() },
    { labelEn: 'Switch Scale: Enterprise Multi-Entity', labelId: 'Ubah Skala: Enterprise Multi-Entitas', action: () => document.querySelector('[data-tier="enterprise"]').click() },
    { labelEn: 'Toggle Language: English / Bahasa Indonesia', labelId: 'Ganti Bahasa: Inggris / Indonesia', action: () => {
      const nextLang = state.lang === 'en' ? 'id' : 'en';
      document.querySelector(`[data-lang="${nextLang}"]`).click();
    }}
  ];

  function renderCmdList(filterText = '') {
    const q = filterText.toLowerCase();
    const matched = commands.filter(c =>
      c.labelEn.toLowerCase().includes(q) || c.labelId.toLowerCase().includes(q)
    );
    cmdList.innerHTML = matched.map((c, idx) => `
      <button type="button" class="nav-item" data-cmd-idx="${ commands.indexOf(c) }" style="padding: 10px 12px;">
        <span>${state.lang === 'en' ? c.labelEn : c.labelId}</span>
        <span class="kbd-shortcut">↵</span>
      </button>
    `).join('');
  }

  document.getElementById('openCmdPaletteBtn').addEventListener('click', () => {
    cmdBackdrop.classList.add('open');
    cmdInput.value = '';
    renderCmdList('');
    setTimeout(() => cmdInput.focus(), 50);
  });

  cmdInput.addEventListener('input', e => renderCmdList(e.target.value));

  cmdList.addEventListener('click', e => {
    const btn = e.target.closest('[data-cmd-idx]');
    if (btn) {
      const idx = parseInt(btn.getAttribute('data-cmd-idx'), 10);
      cmdBackdrop.classList.remove('open');
      commands[idx].action();
    }
  });

  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      cmdBackdrop.classList.toggle('open');
      if (cmdBackdrop.classList.contains('open')) {
        cmdInput.value = '';
        renderCmdList('');
        setTimeout(() => cmdInput.focus(), 50);
      }
    } else if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
    }
  });
});
