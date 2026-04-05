export interface ClientActivity {
  id: string;
  type: "call" | "email" | "meeting" | "note" | "payment" | "project";
  title: string;
  description: string;
  date: string;
  by?: string;
}

export interface ClientDocument {
  id: string;
  name: string;
  type: "contract" | "invoice" | "photo" | "other";
  date: string;
  size: string;
}

export interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  status: "paid" | "due" | "overdue" | "partial";
  issueDate: string;
  dueDate: string;
  paidAmount: number;
}

export interface ClientPayment {
  id: string;
  amount: number;
  method: "UPI" | "Bank Transfer" | "Cash" | "Card" | "Cheque";
  date: string;
  reference?: string;
  invoiceId?: string;
  note?: string;
}

export interface ClientEvent {
  id: string;
  name: string;
  date: string;
  venue: string;
  type: "mehendi" | "haldi" | "sangeet" | "wedding" | "reception" | "engagement" | "pre-wedding" | "other";
  status: "upcoming" | "completed" | "in-progress";
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  partnerName: string;
  phone: string;
  email: string;
  city: string;
  address?: string;
  status: "active" | "past" | "vip";
  totalSpend: number;
  pendingAmount: number;
  projects: number;
  lastProject: string;
  source: string;
  rating: number;
  weddingDate?: string;
  notes?: string;
  tags: string[];
  activities: ClientActivity[];
  documents: ClientDocument[];
  invoices: ClientInvoice[];
  payments: ClientPayment[];
  events: ClientEvent[];
  createdAt: string;
}

export const sampleClients: Client[] = [
  {
    id: "c1",
    name: "Priya Sharma",
    partnerName: "Rahul Kapoor",
    phone: "+91 99887 76655",
    email: "priya.sharma@gmail.com",
    city: "Delhi",
    address: "B-42, Greater Kailash II, New Delhi",
    status: "active",
    totalSpend: 350000,
    pendingAmount: 75000,
    projects: 1,
    lastProject: "Royal Wedding Package",
    source: "Instagram",
    rating: 5,
    weddingDate: "2026-04-15",
    notes: "Prefers candid style photography. Very responsive on WhatsApp.",
    tags: ["premium", "referral-potential", "candid"],
    activities: [
      { id: "a1", type: "call", title: "Discussed album layout", description: "Client wants a 40-page premium album with matte finish", date: "2026-03-28", by: "Raj Patel" },
      { id: "a2", type: "payment", title: "Received ₹1,50,000", description: "Second milestone payment via UPI", date: "2026-03-20" },
      { id: "a3", type: "meeting", title: "Pre-wedding shoot planning", description: "Finalized Jaipur as location for pre-wedding shoot", date: "2026-03-15", by: "Amit Kumar" },
      { id: "a4", type: "note", title: "Special request", description: "Client wants drone shots of the baraat procession", date: "2026-03-10" },
      { id: "a5", type: "project", title: "Project created", description: "Royal Wedding Package booked", date: "2026-02-20" },
    ],
    documents: [
      { id: "d1", name: "Wedding Contract.pdf", type: "contract", date: "2026-02-20", size: "2.4 MB" },
      { id: "d2", name: "Advance Invoice.pdf", type: "invoice", date: "2026-02-20", size: "156 KB" },
    ],
    invoices: [
      { id: "inv1", invoiceNumber: "INV-2026-001", description: "Advance – Royal Wedding Package", amount: 150000, status: "paid", issueDate: "2026-02-20", dueDate: "2026-02-25", paidAmount: 150000 },
      { id: "inv2", invoiceNumber: "INV-2026-002", description: "Milestone 2 – Pre-wedding shoot", amount: 125000, status: "paid", issueDate: "2026-03-15", dueDate: "2026-03-20", paidAmount: 125000 },
      { id: "inv3", invoiceNumber: "INV-2026-003", description: "Final – Album & Delivery", amount: 75000, status: "due", issueDate: "2026-03-28", dueDate: "2026-04-10", paidAmount: 0 },
    ],
    payments: [
      { id: "pay1", amount: 150000, method: "UPI", date: "2026-02-22", reference: "UPI-REF-78456", invoiceId: "inv1", note: "Advance payment" },
      { id: "pay2", amount: 125000, method: "UPI", date: "2026-03-20", reference: "UPI-REF-91023", invoiceId: "inv2", note: "Second milestone" },
    ],
    events: [
      { id: "ev1", name: "Mehendi Ceremony", date: "2026-04-13", venue: "Home – Greater Kailash II", type: "mehendi", status: "upcoming" },
      { id: "ev2", name: "Sangeet Night", date: "2026-04-14", venue: "The Grand, New Delhi", type: "sangeet", status: "upcoming" },
      { id: "ev3", name: "Wedding Ceremony", date: "2026-04-15", venue: "The Grand, New Delhi", type: "wedding", status: "upcoming", notes: "Main ceremony – drone shots requested for baraat" },
      { id: "ev4", name: "Reception", date: "2026-04-16", venue: "The Grand, New Delhi", type: "reception", status: "upcoming" },
      { id: "ev5", name: "Pre-wedding Shoot", date: "2026-03-20", venue: "Jaipur – Nahargarh Fort", type: "pre-wedding", status: "completed" },
    ],
    createdAt: "2026-02-15",
  },
  {
    id: "c2",
    name: "Ananya Desai",
    partnerName: "Vikram Malhotra",
    phone: "+91 88776 65544",
    email: "ananya.d@gmail.com",
    city: "Jaipur",
    address: "45, Civil Lines, Jaipur",
    status: "active",
    totalSpend: 250000,
    pendingAmount: 130000,
    projects: 1,
    lastProject: "Premium Wedding Package",
    source: "Referral",
    rating: 4,
    weddingDate: "2026-05-10",
    notes: "Referred by Kavya Reddy. Budget conscious but quality oriented.",
    tags: ["referral", "budget-flex"],
    activities: [
      { id: "a6", type: "email", title: "Sent mood board", description: "Shared Pinterest-style mood board for pre-wedding", date: "2026-03-25", by: "Neha Gupta" },
      { id: "a7", type: "payment", title: "Received ₹1,00,000", description: "Advance payment via bank transfer", date: "2026-03-01" },
      { id: "a8", type: "project", title: "Project created", description: "Premium Wedding Package booked", date: "2026-02-28" },
    ],
    documents: [
      { id: "d3", name: "Wedding Contract.pdf", type: "contract", date: "2026-02-28", size: "2.1 MB" },
    ],
    invoices: [
      { id: "inv4", invoiceNumber: "INV-2026-004", description: "Advance – Premium Wedding", amount: 100000, status: "paid", issueDate: "2026-02-28", dueDate: "2026-03-05", paidAmount: 100000 },
      { id: "inv5", invoiceNumber: "INV-2026-005", description: "Milestone 2 – Event coverage", amount: 100000, status: "due", issueDate: "2026-04-01", dueDate: "2026-04-15", paidAmount: 0 },
      { id: "inv6", invoiceNumber: "INV-2026-006", description: "Final – Post-production", amount: 50000, status: "due", issueDate: "2026-05-15", dueDate: "2026-05-30", paidAmount: 0 },
    ],
    payments: [
      { id: "pay3", amount: 100000, method: "Bank Transfer", date: "2026-03-01", reference: "NEFT-44201", invoiceId: "inv4" },
    ],
    events: [
      { id: "ev6", name: "Mehendi & Haldi", date: "2026-05-08", venue: "Home – Civil Lines, Jaipur", type: "mehendi", status: "upcoming" },
      { id: "ev7", name: "Wedding Ceremony", date: "2026-05-10", venue: "Raj Palace, Jaipur", type: "wedding", status: "upcoming" },
      { id: "ev8", name: "Reception Dinner", date: "2026-05-11", venue: "Raj Palace, Jaipur", type: "reception", status: "upcoming" },
    ],
    createdAt: "2026-02-25",
  },
  {
    id: "c3",
    name: "Meera Iyer",
    partnerName: "Aditya Nair",
    phone: "+91 77665 54433",
    email: "meera.iyer@yahoo.com",
    city: "Mumbai",
    address: "12A, Bandra West, Mumbai",
    status: "past",
    totalSpend: 180000,
    pendingAmount: 0,
    projects: 1,
    lastProject: "Gold Wedding Package",
    source: "Website",
    rating: 5,
    weddingDate: "2025-12-20",
    notes: "Very happy with results. Gave 5-star Google review.",
    tags: ["completed", "review-given", "testimonial"],
    activities: [
      { id: "a9", type: "note", title: "Testimonial received", description: "Posted 5-star review on Google with photos", date: "2026-01-15" },
      { id: "a10", type: "payment", title: "Final payment received", description: "₹30,000 final settlement via UPI", date: "2026-01-05" },
    ],
    documents: [
      { id: "d4", name: "Final Invoice.pdf", type: "invoice", date: "2026-01-05", size: "180 KB" },
      { id: "d5", name: "Wedding Contract.pdf", type: "contract", date: "2025-10-10", size: "2.2 MB" },
    ],
    invoices: [
      { id: "inv7", invoiceNumber: "INV-2025-010", description: "Advance – Gold Package", amount: 80000, status: "paid", issueDate: "2025-10-10", dueDate: "2025-10-15", paidAmount: 80000 },
      { id: "inv8", invoiceNumber: "INV-2025-015", description: "Milestone – Event coverage", amount: 70000, status: "paid", issueDate: "2025-12-01", dueDate: "2025-12-10", paidAmount: 70000 },
      { id: "inv9", invoiceNumber: "INV-2026-001B", description: "Final – Album delivery", amount: 30000, status: "paid", issueDate: "2025-12-25", dueDate: "2026-01-05", paidAmount: 30000 },
    ],
    payments: [
      { id: "pay4", amount: 80000, method: "UPI", date: "2025-10-12", invoiceId: "inv7" },
      { id: "pay5", amount: 70000, method: "Bank Transfer", date: "2025-12-05", invoiceId: "inv8" },
      { id: "pay6", amount: 30000, method: "UPI", date: "2026-01-05", invoiceId: "inv9", note: "Final settlement" },
    ],
    events: [
      { id: "ev9", name: "Haldi Ceremony", date: "2025-12-19", venue: "Home – Bandra, Mumbai", type: "haldi", status: "completed" },
      { id: "ev10", name: "Wedding Ceremony", date: "2025-12-20", venue: "JW Marriott, Mumbai", type: "wedding", status: "completed" },
      { id: "ev11", name: "Reception", date: "2025-12-21", venue: "JW Marriott, Mumbai", type: "reception", status: "completed" },
    ],
    createdAt: "2025-10-05",
  },
  {
    id: "c4",
    name: "Kavya Reddy",
    partnerName: "Arjun Menon",
    phone: "+91 66554 43322",
    email: "kavya.r@outlook.com",
    city: "Hyderabad",
    address: "Plot 7, Jubilee Hills, Hyderabad",
    status: "vip",
    totalSpend: 520000,
    pendingAmount: 50000,
    projects: 2,
    lastProject: "Platinum Destination",
    source: "Referral",
    rating: 5,
    weddingDate: "2026-06-01",
    notes: "Repeat client. First project was engagement, now full wedding. Very high standards.",
    tags: ["vip", "repeat", "destination", "high-value"],
    activities: [
      { id: "a11", type: "meeting", title: "Venue recce", description: "Visited Udaipur venue for destination wedding setup", date: "2026-03-30", by: "Raj Patel" },
      { id: "a12", type: "call", title: "Budget discussion", description: "Discussed add-on packages for drone + same-day edit", date: "2026-03-22", by: "Vikram Singh" },
      { id: "a13", type: "payment", title: "Received ₹2,50,000", description: "Advance for destination wedding via bank transfer", date: "2026-03-15" },
      { id: "a14", type: "project", title: "Second project created", description: "Platinum Destination Wedding booked", date: "2026-03-10" },
      { id: "a15", type: "email", title: "Sent portfolio samples", description: "Shared destination wedding portfolio link", date: "2026-03-05", by: "Neha Gupta" },
    ],
    documents: [
      { id: "d6", name: "Destination Contract.pdf", type: "contract", date: "2026-03-10", size: "3.1 MB" },
      { id: "d7", name: "Engagement Contract.pdf", type: "contract", date: "2025-08-15", size: "2.0 MB" },
      { id: "d8", name: "Advance Invoice.pdf", type: "invoice", date: "2026-03-15", size: "165 KB" },
    ],
    invoices: [
      { id: "inv10", invoiceNumber: "INV-2025-008", description: "Engagement Shoot", amount: 120000, status: "paid", issueDate: "2025-08-15", dueDate: "2025-08-20", paidAmount: 120000 },
      { id: "inv11", invoiceNumber: "INV-2026-007", description: "Advance – Platinum Destination", amount: 250000, status: "paid", issueDate: "2026-03-10", dueDate: "2026-03-15", paidAmount: 250000 },
      { id: "inv12", invoiceNumber: "INV-2026-008", description: "Milestone 2 – Pre-wedding + Setup", amount: 100000, status: "partial", issueDate: "2026-04-01", dueDate: "2026-04-15", paidAmount: 50000 },
      { id: "inv13", invoiceNumber: "INV-2026-009", description: "Final – Delivery & Album", amount: 100000, status: "due", issueDate: "2026-06-15", dueDate: "2026-07-01", paidAmount: 0 },
    ],
    payments: [
      { id: "pay7", amount: 120000, method: "Bank Transfer", date: "2025-08-18", invoiceId: "inv10" },
      { id: "pay8", amount: 250000, method: "Bank Transfer", date: "2026-03-15", reference: "NEFT-88102", invoiceId: "inv11" },
      { id: "pay9", amount: 50000, method: "UPI", date: "2026-04-05", invoiceId: "inv12", note: "Partial payment" },
    ],
    events: [
      { id: "ev12", name: "Engagement Ceremony", date: "2025-09-10", venue: "Taj Falaknuma, Hyderabad", type: "engagement", status: "completed" },
      { id: "ev13", name: "Pre-wedding Shoot", date: "2026-04-20", venue: "Udaipur Lake", type: "pre-wedding", status: "upcoming" },
      { id: "ev14", name: "Mehendi", date: "2026-05-30", venue: "Oberoi Udaivilas, Udaipur", type: "mehendi", status: "upcoming" },
      { id: "ev15", name: "Sangeet Night", date: "2026-05-31", venue: "Oberoi Udaivilas, Udaipur", type: "sangeet", status: "upcoming" },
      { id: "ev16", name: "Wedding Ceremony", date: "2026-06-01", venue: "Oberoi Udaivilas, Udaipur", type: "wedding", status: "upcoming", notes: "Cinematic film + drone coverage" },
      { id: "ev17", name: "Reception", date: "2026-06-02", venue: "Oberoi Udaivilas, Udaipur", type: "reception", status: "upcoming" },
    ],
    createdAt: "2025-08-01",
  },
  {
    id: "c5",
    name: "Nisha Patel",
    partnerName: "Dev Shah",
    phone: "+91 55443 32211",
    email: "nisha.p@gmail.com",
    city: "Ahmedabad",
    address: "15, SG Highway, Ahmedabad",
    status: "past",
    totalSpend: 150000,
    pendingAmount: 0,
    projects: 1,
    lastProject: "Classic Package",
    source: "WhatsApp",
    rating: 4,
    weddingDate: "2025-11-15",
    tags: ["completed"],
    activities: [
      { id: "a16", type: "payment", title: "Final payment", description: "All dues cleared", date: "2025-12-10" },
    ],
    documents: [],
    invoices: [
      { id: "inv14", invoiceNumber: "INV-2025-005", description: "Advance – Classic Package", amount: 60000, status: "paid", issueDate: "2025-09-20", dueDate: "2025-09-25", paidAmount: 60000 },
      { id: "inv15", invoiceNumber: "INV-2025-012", description: "Final – Classic Package", amount: 90000, status: "paid", issueDate: "2025-11-20", dueDate: "2025-12-05", paidAmount: 90000 },
    ],
    payments: [
      { id: "pay10", amount: 60000, method: "Cash", date: "2025-09-22", invoiceId: "inv14" },
      { id: "pay11", amount: 90000, method: "UPI", date: "2025-12-10", invoiceId: "inv15" },
    ],
    events: [
      { id: "ev18", name: "Wedding Ceremony", date: "2025-11-15", venue: "Regenta Resort, Ahmedabad", type: "wedding", status: "completed" },
      { id: "ev19", name: "Reception", date: "2025-11-16", venue: "Regenta Resort, Ahmedabad", type: "reception", status: "completed" },
    ],
    createdAt: "2025-09-20",
  },
  {
    id: "c6",
    name: "Ritu Singh",
    partnerName: "Karan Verma",
    phone: "+91 44332 21100",
    email: "ritu.singh@gmail.com",
    city: "Lucknow",
    address: "Gomti Nagar, Lucknow",
    status: "active",
    totalSpend: 300000,
    pendingAmount: 100000,
    projects: 1,
    lastProject: "Premium Wedding",
    source: "Instagram",
    rating: 4,
    weddingDate: "2026-04-28",
    notes: "Very active on social media, wants all content for reels.",
    tags: ["social-media", "reels"],
    activities: [
      { id: "a17", type: "call", title: "Discussed timeline", description: "Confirmed shoot schedule for all events", date: "2026-03-28", by: "Raj Patel" },
      { id: "a18", type: "payment", title: "Second milestone", description: "₹1,00,000 received via UPI", date: "2026-03-20" },
      { id: "a19", type: "project", title: "Project created", description: "Premium Wedding booked", date: "2026-02-10" },
    ],
    documents: [
      { id: "d9", name: "Wedding Contract.pdf", type: "contract", date: "2026-02-10", size: "2.3 MB" },
    ],
    invoices: [
      { id: "inv16", invoiceNumber: "INV-2026-010", description: "Advance – Premium Wedding", amount: 100000, status: "paid", issueDate: "2026-02-10", dueDate: "2026-02-15", paidAmount: 100000 },
      { id: "inv17", invoiceNumber: "INV-2026-011", description: "Milestone 2 – Event coverage", amount: 100000, status: "paid", issueDate: "2026-03-15", dueDate: "2026-03-20", paidAmount: 100000 },
      { id: "inv18", invoiceNumber: "INV-2026-012", description: "Final – Post-production & Reels", amount: 100000, status: "due", issueDate: "2026-04-20", dueDate: "2026-05-05", paidAmount: 0 },
    ],
    payments: [
      { id: "pay12", amount: 100000, method: "UPI", date: "2026-02-12", invoiceId: "inv16" },
      { id: "pay13", amount: 100000, method: "UPI", date: "2026-03-20", invoiceId: "inv17" },
    ],
    events: [
      { id: "ev20", name: "Mehendi", date: "2026-04-26", venue: "Home – Gomti Nagar, Lucknow", type: "mehendi", status: "upcoming" },
      { id: "ev21", name: "Sangeet", date: "2026-04-27", venue: "Vivanta, Lucknow", type: "sangeet", status: "upcoming" },
      { id: "ev22", name: "Wedding Ceremony", date: "2026-04-28", venue: "Vivanta, Lucknow", type: "wedding", status: "upcoming", notes: "Full reel content needed" },
      { id: "ev23", name: "Reception", date: "2026-04-29", venue: "Vivanta, Lucknow", type: "reception", status: "upcoming" },
    ],
    createdAt: "2026-02-05",
  },
  {
    id: "c7",
    name: "Sanya Gupta",
    partnerName: "Rohan Mehta",
    phone: "+91 99001 22334",
    email: "sanya.g@gmail.com",
    city: "Udaipur",
    address: "Lake Palace Road, Udaipur",
    status: "vip",
    totalSpend: 680000,
    pendingAmount: 180000,
    projects: 2,
    lastProject: "Royal Destination Wedding",
    source: "Referral",
    rating: 5,
    weddingDate: "2026-07-20",
    notes: "Highest value client. Destination wedding at Lake Palace. Wants cinematic film.",
    tags: ["vip", "destination", "cinematic", "high-value"],
    activities: [
      { id: "a20", type: "meeting", title: "Final walkthrough", description: "Venue walkthrough with full team planned", date: "2026-04-02", by: "Raj Patel" },
      { id: "a21", type: "payment", title: "Received ₹3,00,000", description: "Advance for royal package", date: "2026-03-10" },
      { id: "a22", type: "project", title: "Project created", description: "Royal Destination Wedding booked", date: "2026-03-05" },
    ],
    documents: [
      { id: "d10", name: "Royal Package Contract.pdf", type: "contract", date: "2026-03-05", size: "3.5 MB" },
    ],
    invoices: [
      { id: "inv19", invoiceNumber: "INV-2026-013", description: "Advance – Royal Destination", amount: 300000, status: "paid", issueDate: "2026-03-05", dueDate: "2026-03-10", paidAmount: 300000 },
      { id: "inv20", invoiceNumber: "INV-2026-014", description: "Milestone – Pre-production", amount: 200000, status: "due", issueDate: "2026-05-01", dueDate: "2026-05-15", paidAmount: 0 },
      { id: "inv21", invoiceNumber: "INV-2026-015", description: "Final – Film + Album", amount: 180000, status: "due", issueDate: "2026-08-01", dueDate: "2026-08-15", paidAmount: 0 },
    ],
    payments: [
      { id: "pay14", amount: 300000, method: "Bank Transfer", date: "2026-03-10", reference: "NEFT-99201", invoiceId: "inv19" },
    ],
    events: [
      { id: "ev24", name: "Pre-wedding Shoot", date: "2026-05-15", venue: "Lake Pichola, Udaipur", type: "pre-wedding", status: "upcoming" },
      { id: "ev25", name: "Mehendi", date: "2026-07-18", venue: "Lake Palace, Udaipur", type: "mehendi", status: "upcoming" },
      { id: "ev26", name: "Sangeet", date: "2026-07-19", venue: "Lake Palace, Udaipur", type: "sangeet", status: "upcoming" },
      { id: "ev27", name: "Wedding Ceremony", date: "2026-07-20", venue: "Lake Palace, Udaipur", type: "wedding", status: "upcoming", notes: "Cinematic film – full day coverage" },
      { id: "ev28", name: "Reception", date: "2026-07-21", venue: "Lake Palace, Udaipur", type: "reception", status: "upcoming" },
    ],
    createdAt: "2026-03-01",
  },
  {
    id: "c8",
    name: "Divya Joshi",
    partnerName: "Nikhil Tiwari",
    phone: "+91 88990 11223",
    email: "divya.j@gmail.com",
    city: "Pune",
    address: "Koregaon Park, Pune",
    status: "active",
    totalSpend: 220000,
    pendingAmount: 90000,
    projects: 1,
    lastProject: "Gold Wedding Package",
    source: "Google",
    rating: 4,
    weddingDate: "2026-05-25",
    tags: ["google-lead"],
    activities: [
      { id: "a23", type: "call", title: "Package finalization", description: "Upgraded from Classic to Gold package", date: "2026-03-18", by: "Vikram Singh" },
      { id: "a24", type: "payment", title: "Advance received", description: "₹1,00,000 via card payment", date: "2026-03-12" },
    ],
    documents: [
      { id: "d11", name: "Contract.pdf", type: "contract", date: "2026-03-12", size: "2.1 MB" },
    ],
    invoices: [
      { id: "inv22", invoiceNumber: "INV-2026-016", description: "Advance – Gold Package", amount: 100000, status: "paid", issueDate: "2026-03-12", dueDate: "2026-03-15", paidAmount: 100000 },
      { id: "inv23", invoiceNumber: "INV-2026-017", description: "Milestone – Event day", amount: 70000, status: "due", issueDate: "2026-05-20", dueDate: "2026-05-25", paidAmount: 0 },
      { id: "inv24", invoiceNumber: "INV-2026-018", description: "Final – Delivery", amount: 50000, status: "due", issueDate: "2026-06-10", dueDate: "2026-06-20", paidAmount: 0 },
    ],
    payments: [
      { id: "pay15", amount: 100000, method: "Card", date: "2026-03-12", invoiceId: "inv22", note: "Card payment at office" },
    ],
    events: [
      { id: "ev29", name: "Engagement Party", date: "2026-04-10", venue: "Home – Koregaon Park, Pune", type: "engagement", status: "upcoming" },
      { id: "ev30", name: "Wedding Ceremony", date: "2026-05-25", venue: "Oxford Golf Resort, Pune", type: "wedding", status: "upcoming" },
      { id: "ev31", name: "Reception", date: "2026-05-26", venue: "Oxford Golf Resort, Pune", type: "reception", status: "upcoming" },
    ],
    createdAt: "2026-03-08",
  },
];

export const statusConfig = {
  active: { label: "Active", color: "text-emerald-500", bgColor: "bg-emerald-500/15", borderColor: "border-emerald-500/30", dot: "bg-emerald-500" },
  past: { label: "Completed", color: "text-muted-foreground", bgColor: "bg-muted", borderColor: "border-border", dot: "bg-muted-foreground" },
  vip: { label: "VIP", color: "text-primary", bgColor: "bg-primary/15", borderColor: "border-primary/30", dot: "bg-primary" },
} as const;

export const activityIcons = {
  call: "PhoneCall",
  email: "Mail",
  meeting: "Users",
  note: "FileText",
  payment: "IndianRupee",
  project: "Briefcase",
} as const;
