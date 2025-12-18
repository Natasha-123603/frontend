export const summaryStats = [
  {
    id: "properties",
    label: "Total Properties",
    value: "128",
    change: "+12% vs last month",
    trend: "up",
  },
  {
    id: "bookings",
    label: "Total Bookings",
    value: "842",
    change: "+4% vs last month",
    trend: "up",
  },
  {
    id: "tasks",
    label: "Active Tasks",
    value: "36",
    change: "7 overdue",
    trend: "down",
  },
  {
    id: "revenue",
    label: "Revenue",
    value: "$182k",
    change: "+$12k vs last month",
    trend: "up",
  },
];

export const properties = [
  {
    id: "PR-1001",
    name: "Bayview Retreat",
    location: "San Francisco, CA",
    status: "Listed",
    occupancy: 87,
    nightlyRate: 420,
    photos: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=60",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=60",
    ],
  },
  {
    id: "PR-1002",
    name: "Mountain Escape",
    location: "Aspen, CO",
    status: "Maintenance",
    occupancy: 62,
    nightlyRate: 510,
    photos: [
      "https://images.unsplash.com/photo-1469796466635-455ede028aca?auto=format&fit=crop&w=900&q=60",
    ],
  },
  {
    id: "PR-1003",
    name: "Seaside Loft",
    location: "San Diego, CA",
    status: "Listed",
    occupancy: 75,
    nightlyRate: 350,
    photos: [
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=60",
    ],
  },
];

export const bookings = [
  {
    id: "BK-2401",
    guest: "Lauren Conner",
    property: "Bayview Retreat",
    checkIn: "2025-11-12",
    checkOut: "2025-11-18",
    status: "Confirmed",
    total: "$4,200",
  },
  {
    id: "BK-2402",
    guest: "James Lee",
    property: "Mountain Escape",
    checkIn: "2025-11-26",
    checkOut: "2025-11-30",
    status: "Pending",
    total: "$2,450",
  },
  {
    id: "BK-2403",
    guest: "Ana Gómez",
    property: "Seaside Loft",
    checkIn: "2025-12-02",
    checkOut: "2025-12-07",
    status: "Cancelled",
    total: "$0",
  },
];

export const bookingCalendar = [
  { date: "2025-11-24", count: 3 },
  { date: "2025-11-25", count: 4 },
  { date: "2025-11-26", count: 2 },
  { date: "2025-11-27", count: 6 },
  { date: "2025-11-28", count: 1 },
  { date: "2025-11-29", count: 5 },
  { date: "2025-11-30", count: 2 },
];

export const guests = [
  {
    id: "GS-010",
    name: "Kayla McKenzie",
    email: "kayla.mckenzie@luxe.stay",
    phone: "+1 555 023 211",
    loyaltyTier: "Gold",
    totalBookings: 8,
  },
  {
    id: "GS-011",
    name: "Leo Chen",
    email: "leo.chen@nomad.cc",
    phone: "+1 555 100 889",
    loyaltyTier: "Silver",
    totalBookings: 5,
  },
  {
    id: "GS-012",
    name: "Amelia Anders",
    email: "amelia.anders@atlas.com",
    phone: "+1 555 091 441",
    loyaltyTier: "Platinum",
    totalBookings: 12,
  },
];

export const payments = [
  {
    id: "PM-5001",
    guest: "Kayla McKenzie",
    property: "Bayview Retreat",
    amount: "$2,460",
    date: "2025-11-19",
    method: "Card",
    status: "Completed",
  },
  {
    id: "PM-5002",
    guest: "Leo Chen",
    property: "Mountain Escape",
    amount: "$3,120",
    date: "2025-11-21",
    method: "ACH",
    status: "Pending",
  },
  {
    id: "PM-5003",
    guest: "James Lee",
    property: "Seaside Loft",
    amount: "$1,980",
    date: "2025-11-22",
    method: "Card",
    status: "Failed",
  },
];

export const tasks = [
  {
    id: "TS-101",
    title: "Replace linens",
    assignee: "Maya Patel",
    column: "To Do",
    due: "Nov 26",
    priority: "High",
  },
  {
    id: "TS-102",
    title: "Restock minibar",
    assignee: "Victor Hugo",
    column: "In Progress",
    due: "Nov 27",
    priority: "Medium",
  },
  {
    id: "TS-103",
    title: "Deep clean pool",
    assignee: "Contractor",
    column: "In Progress",
    due: "Nov 30",
    priority: "High",
  },
  {
    id: "TS-104",
    title: "Guest gift baskets",
    assignee: "Reception",
    column: "Review",
    due: "Nov 25",
    priority: "Low",
  },
  {
    id: "TS-105",
    title: "HVAC inspection",
    assignee: "Facilities",
    column: "Done",
    due: "Nov 22",
    priority: "Medium",
  },
];

export const users = [
  {
    id: "US-01",
    name: "Nora Summers",
    email: "nora@luxehost.com",
    role: "Admin",
    permissions: ["properties", "bookings", "payments", "users"],
    status: "Active",
  },
  {
    id: "US-02",
    name: "Evan Sterling",
    email: "evan@luxehost.com",
    role: "Manager",
    permissions: ["properties", "bookings", "tasks"],
    status: "Away",
  },
  {
    id: "US-03",
    name: "Grace Moon",
    email: "grace@luxehost.com",
    role: "Staff",
    permissions: ["tasks"],
    status: "Active",
  },
];

export const roleMenus = {
  Admin: [
    { label: "Dashboard", href: "/", icon: "🏠", section: "Overview" },
    { label: "Properties", href: "/properties", icon: "🏡", section: "Operations" },
    { label: "Bookings", href: "/bookings", icon: "📅", section: "Operations" },
    { label: "Guests", href: "/guests", icon: "👥", section: "People" },
    { label: "Payments", href: "/payments", icon: "💳", section: "Finance" },
    { label: "Tasks", href: "/tasks", icon: "📝", section: "Operations" },
    {
      label: "User Management",
      href: "/users",
      icon: "🛡️",
      section: "Administration",
    },
  ],
  Manager: [
    { label: "Dashboard", href: "/", icon: "🏠", section: "Overview" },
    { label: "Properties", href: "/properties", icon: "🏡", section: "Operations" },
    { label: "Bookings", href: "/bookings", icon: "📅", section: "Operations" },
    { label: "Guests", href: "/guests", icon: "👥", section: "People" },
    { label: "Tasks", href: "/tasks", icon: "📝", section: "Operations" },
  ],
  Staff: [
    { label: "Dashboard", href: "/", icon: "🏠", section: "Overview" },
    { label: "Tasks", href: "/tasks", icon: "📝", section: "Operations" },
    { label: "Guests", href: "/guests", icon: "👥", section: "People" },
  ],
};

