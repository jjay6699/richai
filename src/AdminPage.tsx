import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

interface AdminUser {
  id: string;
  email: string | null;
  name: string | null;
  provider: string;
  country?: string | null;
  referralCode?: string | null;
  createdAt: number;
  lastLoginAt: number;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  userId: string | null;
  userEmail: string | null;
  customerName: string | null;
  plan: string;
  planLabel?: string | null;
  price: number;
  currency: string;
  paymentMethod?: string | null;
  status: string;
  couponCode?: string | null;
  source: string;
  createdAt: number;
}

interface AdminReferralAgent {
  id: string;
  code: string;
  codeType: "plus" | "pro" | "superadmin";
  name: string | null;
  email: string | null;
  phone?: string | null;
  createdAt: number;
  updatedAt: number;
  redemptionCount?: number;
  latestRedeemedAt?: number | null;
}

interface AdminAgentRedemption {
  id: string;
  agentId: string | null;
  code: string;
  userId: string;
  redeemedAt: number;
  periodStart: number;
  periodEnd: number;
}

interface AdminSubscriptionSnapshot {
  userId: string;
  tier: "free" | "plus" | "pro" | "superadmin";
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId?: string | null;
  status: string | null;
  currentPeriodStart: number | null;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean | number;
  createdAt: number;
  updatedAt: number;
}

interface AdminAttributedOrder extends AdminOrder {
  agentId: string | null;
  agentCode: string;
  deliveryAddress?: Record<string, any> | null;
  recommendations?: Array<Record<string, any>>;
}

interface AdminSubscriptionBillingEvent {
  id: string;
  eventKey: string;
  userId: string;
  agentId: string | null;
  agentCode: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeInvoiceId: string | null;
  eventType: string;
  tier: "free" | "plus" | "pro" | "superadmin";
  status: string | null;
  amount: number | null;
  currency: string | null;
  billingPeriodStart: number | null;
  billingPeriodEnd: number | null;
  occurredAt: number;
  createdAt: number;
  metadata?: Record<string, any> | null;
}

interface AdminDiscountCoupon {
  id: string;
  code: string;
  title: string | null;
  description: string | null;
  discountType: "percent" | "fixed_amount";
  discountValue: number;
  currency: string;
  minimumSubtotal: number | null;
  maxDiscountAmount: number | null;
  startsAt: number | null;
  endsAt: number | null;
  usageLimit: number | null;
  usageCount: number;
  perUserLimit: number | null;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

interface AdminUserDetails {
  profile: Record<string, any>;
  shippingAddress: {
    id: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postcode: string;
    isDefault: boolean;
    updatedAt: number;
  } | null;
  shippingAddresses: Array<{
    id: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postcode: string;
    isDefault: boolean;
    updatedAt: number;
  }>;
}

interface AdminOverview {
  stats: {
    totalUsers: number;
    totalSales: number;
    totalRevenue: number;
    potentialSales: number;
    potentialRevenue: number;
    latestUserAt: number | null;
    latestSaleAt: number | null;
  };
  users: AdminUser[];
  orders: AdminOrder[];
  referralAgents: AdminReferralAgent[];
  agentRedemptions?: AdminAgentRedemption[];
  subscriptions?: AdminSubscriptionSnapshot[];
  attributedOrders?: AdminAttributedOrder[];
  subscriptionBillingEvents?: AdminSubscriptionBillingEvent[];
  discountCoupons?: AdminDiscountCoupon[];
}

interface AdminReferralSummary {
  code: string;
  agentUserId: string | null;
  agentName: string | null;
  agentEmail: string | null;
  totalOrders: number;
  totalRevenue: number;
  paidOrders: number;
  paidRevenue: number;
  monthOrders: number;
  monthRevenue: number;
  monthPaidOrders: number;
  monthPaidRevenue: number;
  uniqueCustomers: number;
  latestSaleAt: number | null;
}

interface ReferralCodeRow {
  id: string;
  code: string;
  name: string | null;
  email: string | null;
  source: "managed" | "user";
  createdAt: number | null;
  totalOrders: number;
  paidRevenue: number;
}

interface AgentPerformanceRow extends AdminReferralAgent {
  redemptions: number;
  redemptionsInRange: number;
  activeTrials: number;
  activePaidUsers: number;
  convertedUsers: number;
  renewalCount: number;
  subscriptionRevenue: number;
  firstPaymentRevenue: number;
  renewalRevenue: number;
  orderRevenue: number;
  paidOrderCount: number;
  totalRevenue: number;
  latestActivityAt: number | null;
  attributedUsers: number;
}

interface AgentAttributedUserRow {
  userId: string;
  email: string | null;
  name: string | null;
  country: string | null;
  redeemedAt: number;
  currentTier: string;
  subscriptionStatus: string | null;
  trialEnd: number | null;
  firstPaidAt: number | null;
  lastRenewalAt: number | null;
  subscriptionRevenue: number;
  orderCount: number;
  orderRevenue: number;
  totalRevenue: number;
  lastActivityAt: number | null;
}

type AdminSection = "overview" | "users" | "sales" | "agents" | "codes" | "coupons" | "analytics";
type FetchStatus = "idle" | "authenticated" | "refresh_failed" | "expired";
type DateRangeFilter = "all" | "7d" | "30d" | "90d" | "365d" | "custom";
type AgentCodeType = "plus" | "pro" | "superadmin";
type UserSortKey = "createdAt_desc" | "createdAt_asc" | "lastLoginAt_desc" | "name_asc" | "email_asc";
type OrderSortKey = "createdAt_desc" | "createdAt_asc" | "price_desc" | "price_asc" | "status_asc" | "customer_asc";
type AgentSortKey =
  | "totalRevenue_desc"
  | "subscriptionRevenue_desc"
  | "orderRevenue_desc"
  | "latestActivity_desc"
  | "redemptions_desc"
  | "createdAt_desc";
type AgentWorkspaceTab = "directory" | "create";
type AgentDetailTab = "summary" | "users" | "timeline";
type CodeSortKey = "createdAt_desc" | "createdAt_asc" | "code_asc";

const apiBase = (import.meta.env.VITE_APP_API_URL || "/api").replace(/\/$/, "");
const directApiBase = (import.meta.env.VITE_ADMIN_DIRECT_API_URL || "https://healthai.up.railway.app/api").replace(/\/$/, "");
const ADMIN_SESSION_KEY = "richai_admin_session";
const NAV_ITEMS: Array<{ id: AdminSection; label: string; shortLabel: string; description: string }> = [
  { id: "overview", label: "Overview", shortLabel: "OV", description: "Key operational snapshot" },
  { id: "users", label: "Users", shortLabel: "US", description: "App registrations and account activity" },
  { id: "sales", label: "Sales", shortLabel: "SA", description: "Orders, revenue, and payment status" },
  { id: "agents", label: "Agent", shortLabel: "AG", description: "Create agent access codes and track redemptions" },
  { id: "coupons", label: "Discount coupons", shortLabel: "DC", description: "Create and manage customer discount coupons" },
  { id: "analytics", label: "Analytics", shortLabel: "AN", description: "Trend and performance insights" }
];

const encodeBasicAuth = (username: string, password: string) => {
  const raw = `${username}:${password}`;
  const bytes = new TextEncoder().encode(raw);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `Basic ${window.btoa(binary)}`;
};

const copyToClipboard = async (value: string) => {
  if (!navigator?.clipboard?.writeText) return false;

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
};

const formatDate = (timestamp: number | null) =>
  timestamp
    ? new Date(timestamp).toLocaleString("en-MY", {
        dateStyle: "medium",
        timeStyle: "short"
      })
    : "--";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2
  }).format(value || 0);

const formatAgentCodeTypeLabel = (value: AgentCodeType | string | null | undefined) => {
  if (value === "pro") return "Pro";
  if (value === "superadmin") return "SuperAdmin";
  return "Plus";
};

const getDateRangeThreshold = (range: DateRangeFilter) => {
  if (range === "all") return null;
  if (range === "custom") return null;

  const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365;
  return Date.now() - days * 24 * 60 * 60 * 1000;
};

const getDateInputBoundary = (value: string, boundary: "start" | "end") => {
  if (!value) return null;

  const parsed = new Date(`${value}${boundary === "end" ? "T23:59:59.999" : "T00:00:00.000"}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
};

const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["active", "trialing", "past_due"]);

const isActivePaidSubscription = (subscription: AdminSubscriptionSnapshot | null | undefined) => {
  if (!subscription) return false;
  if (subscription.tier !== "plus" && subscription.tier !== "pro" && subscription.tier !== "superadmin") return false;

  const now = Date.now();
  const status = subscription.status?.trim().toLowerCase() || "";
  const isStripeBacked = Boolean(subscription.stripeSubscriptionId);
  const isWithinManualPeriod = !subscription.currentPeriodEnd || subscription.currentPeriodEnd > now;
  return ACTIVE_SUBSCRIPTION_STATUSES.has(status) && (isStripeBacked || isWithinManualPeriod);
};

const normalizeCsvValue = (value: string | number | null | undefined) => {
  const raw = value == null ? "" : String(value);
  return `"${raw.replace(/"/g, '""')}"`;
};

const triggerCsvDownload = (filename: string, rows: Array<Array<string | number | null | undefined>>) => {
  const csv = rows.map((row) => row.map((value) => normalizeCsvValue(value)).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const getProviderLabel = (value: string) => {
  if (value === "password") return "Password";
  if (value === "google") return "Google";
  return value || "Unknown";
};

const getStatusTone = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (normalized === "processing") return "pending";
  if (normalized === "paid" || normalized === "completed" || normalized === "succeeded") return "success";
  if (normalized === "failed" || normalized === "cancelled") return "danger";
  return "neutral";
};

const formatShortDate = (value: string) => {
  if (!value) return "--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const formatShippingAddress = (address: AdminUserDetails["shippingAddress"]) => {
  if (!address) return "--";
  const parts = [
    address.addressLine1,
    address.addressLine2,
    `${address.postcode} ${address.city}`.trim(),
    address.state
  ].filter(Boolean);
  return parts.join(", ");
};

const isPaidOrder = (status: string) => ["paid", "completed", "succeeded"].includes(status.trim().toLowerCase());

const getCurrentMonthStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
};

const getSectionMeta = (
  activeSection: AdminSection,
  dashboard: AdminOverview | null,
  lastSyncedAt: number | null
) => {
  if (activeSection === "users") {
    return {
      kicker: "Users",
      title: "App registrations",
      description: "Review who has registered in the mobile app and inspect their latest account activity.",
      badge: dashboard ? `${dashboard.users.length} total records` : "Awaiting data",
      timestampLabel: "Latest registration",
      timestampValue: formatDate(dashboard?.stats.latestUserAt ?? null)
    };
  }

  if (activeSection === "sales") {
    return {
      kicker: "Sales",
      title: "App orders",
      description: "Track order records, payment method choice, revenue, and the latest commerce activity.",
      badge: dashboard ? `${dashboard.orders.length} total records` : "Awaiting data",
      timestampLabel: "Latest sale",
      timestampValue: formatDate(dashboard?.stats.latestSaleAt ?? null)
    };
  }

  if (activeSection === "agents") {
    return {
      kicker: "Agent",
      title: "Agent access codes",
      description: "Create a code for an agent. Users can redeem it for Plus, Pro, or internal SuperAdmin access.",
      badge: dashboard ? `${dashboard.referralAgents.length} codes` : "Awaiting data",
      timestampLabel: "Latest redemption",
      timestampValue: formatDate(
        (dashboard?.referralAgents || []).reduce<number | null>((latest, item) => {
          if (!item.latestRedeemedAt) return latest;
          return latest && latest > item.latestRedeemedAt ? latest : item.latestRedeemedAt;
        }, null)
      )
    };
  }

  if (activeSection === "codes") {
    return {
      kicker: "Referral codes",
      title: "Agent code management",
      description: "Create, review, and retire referral codes issued to agents.",
      badge: dashboard ? `${dashboard.referralAgents.length} managed codes` : "Awaiting data",
      timestampLabel: "Last synced",
      timestampValue: formatDate(lastSyncedAt)
    };
  }

  if (activeSection === "coupons") {
    return {
      kicker: "Discount coupons",
      title: "Customer discount management",
      description: "Create percentage or fixed-amount coupons and control validity windows & usage limits.",
      badge: dashboard ? "Discount coupon rules" : "Awaiting data",
      timestampLabel: "Last synced",
      timestampValue: formatDate(lastSyncedAt)
    };
  }

  if (activeSection === "analytics") {
    return {
      kicker: "Analytics",
      title: "Performance analytics",
      description: "Understand registration and revenue trends with conversion and engagement metrics.",
      badge: dashboard ? "Operational trends" : "Awaiting data",
      timestampLabel: "Last synced",
      timestampValue: formatDate(lastSyncedAt)
    };
  }

  return {
    kicker: "Overview",
    title: "Control room",
    description: "See the current state of registrations and sales from the app service in one operational workspace.",
    badge: dashboard ? "Live admin data" : "Sign in to load data",
    timestampLabel: "Last synced",
    timestampValue: formatDate(lastSyncedAt)
  };
};

const requestAdminOverview = async (nextUsername: string, nextPassword: string) => {
  const authHeader = { Authorization: encodeBasicAuth(nextUsername, nextPassword) };
  const transientStatuses = new Set([429, 500, 502, 503, 504]);
  const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
  let lastProxyResponse: Response | null = null;
  let sawProxyAuthFailure = false;

  const proxyRequests: Array<() => Promise<Response>> = [
    () =>
      fetch(`${apiBase}/admin/overview-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: nextUsername, password: nextPassword })
      }),
    () =>
      fetch(`${apiBase}/admin/overview`, {
        headers: authHeader
      })
  ];

  for (let attempt = 0; attempt < 2; attempt += 1) {
    for (const run of proxyRequests) {
      try {
        const response = await run();
        lastProxyResponse = response;

        if (response.ok) {
          return response;
        }

        if (response.status === 401 || response.status === 403) {
          sawProxyAuthFailure = true;
        }
      } catch {
        // Continue to next strategy.
      }
    }

    if (attempt < 1) {
      await wait(300);
    }
  }

  if (sawProxyAuthFailure && lastProxyResponse) {
    return lastProxyResponse;
  }

  let lastUpstreamError: unknown = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${directApiBase}/admin/overview`, {
        headers: authHeader
      });
      if (response.ok) {
        return response;
      }

      if (response.status === 401 || response.status === 403) {
        if (lastProxyResponse && transientStatuses.has(lastProxyResponse.status)) {
          return lastProxyResponse;
        }
        return response;
      }

      if (!transientStatuses.has(response.status)) {
        return response;
      }

      if (attempt === 2) {
        return response;
      }
    } catch (error) {
      lastUpstreamError = error;
    }

    if (attempt < 2) {
      await wait(300 + attempt * 250);
    }
  }

  if (lastProxyResponse) return lastProxyResponse;
  throw lastUpstreamError instanceof Error ? lastUpstreamError : new TypeError("Unable to reach the admin service.");
};

const requestReferralAgentCreate = async (
  nextUsername: string,
  nextPassword: string,
  payload: { code: string; codeType: AgentCodeType; name?: string | null; email?: string | null; phone?: string | null }
) => {
  const authHeader = { Authorization: encodeBasicAuth(nextUsername, nextPassword), "Content-Type": "application/json" };
  let lastErrorResponse: Response | null = null;

  const attempts: Array<() => Promise<Response>> = [
    () =>
      fetch(`${apiBase}/admin/referral-agents`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify(payload)
      }),
    () =>
      fetch(`${directApiBase}/admin/referral-agents`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify(payload)
      })
  ];

  for (const run of attempts) {
    try {
      const response = await run();
      if (response.ok) return response;
      lastErrorResponse = response;
    } catch {
      // continue to next strategy
    }
  }

  if (lastErrorResponse) return lastErrorResponse;
  throw new TypeError("Unable to reach the admin service.");
};

const requestReferralAgentDelete = async (
  nextUsername: string,
  nextPassword: string,
  agentId: string
) => {
  const authHeader = { Authorization: encodeBasicAuth(nextUsername, nextPassword) };
  let lastErrorResponse: Response | null = null;

  const attempts: Array<() => Promise<Response>> = [
    () =>
      fetch(`${apiBase}/admin/referral-agents/${agentId}`, {
        method: "DELETE",
        headers: authHeader
      }),
    () =>
      fetch(`${directApiBase}/admin/referral-agents/${agentId}`, {
        method: "DELETE",
        headers: authHeader
      })
  ];

  for (const run of attempts) {
    try {
      const response = await run();
      if (response.ok) return response;
      lastErrorResponse = response;
    } catch {
      // continue to next strategy
    }
  }

  if (lastErrorResponse) return lastErrorResponse;
  throw new TypeError("Unable to reach the admin service.");
};

const requestDiscountCouponsList = async (nextUsername: string, nextPassword: string) => {
  const authHeader = { Authorization: encodeBasicAuth(nextUsername, nextPassword) };
  let lastErrorResponse: Response | null = null;

  const attempts: Array<() => Promise<Response>> = [
    () => fetch(`${apiBase}/admin/discount-coupons`, { headers: authHeader }),
    () => fetch(`${directApiBase}/admin/discount-coupons`, { headers: authHeader })
  ];

  for (const run of attempts) {
    try {
      const response = await run();
      if (response.ok) return response;
      lastErrorResponse = response;
    } catch {
      // continue
    }
  }

  if (lastErrorResponse) return lastErrorResponse;
  throw new TypeError("Unable to reach the admin service.");
};

const requestDiscountCouponCreate = async (
  nextUsername: string,
  nextPassword: string,
  payload: {
    code: string;
    title?: string | null;
    description?: string | null;
    discountType: "percent" | "fixed_amount";
    discountValue: number;
    currency?: string;
    minimumSubtotal?: number | null;
    maxDiscountAmount?: number | null;
    startsAt?: string | number | null;
    endsAt?: string | number | null;
    usageLimit?: number | null;
    perUserLimit?: number | null;
    isActive?: boolean;
  }
) => {
  const authHeader = { Authorization: encodeBasicAuth(nextUsername, nextPassword), "Content-Type": "application/json" };
  let lastErrorResponse: Response | null = null;

  const attempts: Array<() => Promise<Response>> = [
    () =>
      fetch(`${apiBase}/admin/discount-coupons`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify(payload)
      }),
    () =>
      fetch(`${directApiBase}/admin/discount-coupons`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify(payload)
      })
  ];

  for (const run of attempts) {
    try {
      const response = await run();
      if (response.ok) return response;
      lastErrorResponse = response;
    } catch {
      // continue
    }
  }

  if (lastErrorResponse) return lastErrorResponse;
  throw new TypeError("Unable to reach the admin service.");
};

const requestDiscountCouponDelete = async (nextUsername: string, nextPassword: string, couponId: string) => {
  const authHeader = { Authorization: encodeBasicAuth(nextUsername, nextPassword) };
  let lastErrorResponse: Response | null = null;

  const attempts: Array<() => Promise<Response>> = [
    () => fetch(`${apiBase}/admin/discount-coupons/${couponId}`, { method: "DELETE", headers: authHeader }),
    () => fetch(`${directApiBase}/admin/discount-coupons/${couponId}`, { method: "DELETE", headers: authHeader })
  ];

  for (const run of attempts) {
    try {
      const response = await run();
      if (response.ok) return response;
      lastErrorResponse = response;
    } catch {
      // continue
    }
  }

  if (lastErrorResponse) return lastErrorResponse;
  throw new TypeError("Unable to reach the admin service.");
};

const requestAdminUserDetails = async (nextUsername: string, nextPassword: string, userId: string) => {
  const authHeader = { Authorization: encodeBasicAuth(nextUsername, nextPassword) };
  let lastErrorResponse: Response | null = null;

  const attempts: Array<() => Promise<Response>> = [
    () => fetch(`${apiBase}/admin/users/${userId}/details`, { headers: authHeader }),
    () => fetch(`${directApiBase}/admin/users/${userId}/details`, { headers: authHeader })
  ];

  for (const run of attempts) {
    try {
      const response = await run();
      if (response.ok) return response;
      lastErrorResponse = response;
    } catch {
      // continue
    }
  }

  if (lastErrorResponse) return lastErrorResponse;
  throw new TypeError("Unable to reach the admin service.");
};

const requestOrderStatusUpdate = async (
  nextUsername: string,
  nextPassword: string,
  orderId: string,
  status: "failed" | "cancelled"
) => {
  const authHeader = { Authorization: encodeBasicAuth(nextUsername, nextPassword), "Content-Type": "application/json" };
  const payload = { status };
  let lastErrorResponse: Response | null = null;

  const attempts: Array<() => Promise<Response>> = [
    () =>
      fetch(`${apiBase}/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify(payload)
      }),
    () =>
      fetch(`${directApiBase}/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify(payload)
      })
  ];

  for (const run of attempts) {
    try {
      const response = await run();
      if (response.ok) return response;
      lastErrorResponse = response;
    } catch {
      // continue
    }
  }

  if (lastErrorResponse) return lastErrorResponse;
  throw new TypeError("Unable to reach the admin service.");
};

function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaLeft, setCaptchaLeft] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaRight, setCaptchaRight] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaInput, setCaptchaInput] = useState("");
  const [dashboard, setDashboard] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setStatus] = useState<FetchStatus>("idle");
  const [flashMessage, setFlashMessage] = useState("");
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [usersQuery, setUsersQuery] = useState("");
  const [usersProviderFilter, setUsersProviderFilter] = useState("all");
  const [usersDateRange, setUsersDateRange] = useState<DateRangeFilter>("all");
  const [usersSort, setUsersSort] = useState<UserSortKey>("createdAt_desc");
  const [salesQuery, setSalesQuery] = useState("");
  const [salesStatusFilter, setSalesStatusFilter] = useState("all");
  const [salesDateRange, setSalesDateRange] = useState<DateRangeFilter>("all");
  const [salesSort, setSalesSort] = useState<OrderSortKey>("createdAt_desc");
  const [agentQuery, setAgentQuery] = useState("");
  const [agentDateRange, setAgentDateRange] = useState<DateRangeFilter>("30d");
  const [agentDateStart, setAgentDateStart] = useState("");
  const [agentDateEnd, setAgentDateEnd] = useState("");
  const [agentSort, setAgentSort] = useState<AgentSortKey>("totalRevenue_desc");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentWorkspaceTab, setAgentWorkspaceTab] = useState<AgentWorkspaceTab>("directory");
  const [agentDetailTab, setAgentDetailTab] = useState<AgentDetailTab>("summary");
  const [newAgentCode, setNewAgentCode] = useState("");
  const [newAgentCodeType, setNewAgentCodeType] = useState<AgentCodeType>("plus");
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentEmail, setNewAgentEmail] = useState("");
  const [newAgentPhone, setNewAgentPhone] = useState("");
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [codeQuery, setCodeQuery] = useState("");
  const [codeSort, setCodeSort] = useState<CodeSortKey>("createdAt_desc");
  const [globalLookupQuery, setGlobalLookupQuery] = useState("");
  const [copiedField, setCopiedField] = useState("");

  const [discountCoupons, setDiscountCoupons] = useState<AdminDiscountCoupon[]>([]);
  const [couponQuery, setCouponQuery] = useState("");
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponTitle, setNewCouponTitle] = useState("");
  const [newCouponDescription, setNewCouponDescription] = useState("");
  const [newCouponDiscountType, setNewCouponDiscountType] = useState<"percent" | "fixed_amount">("percent");
  const [newCouponDiscountValue, setNewCouponDiscountValue] = useState("10");
  const [newCouponMinSubtotal, setNewCouponMinSubtotal] = useState("");
  const [newCouponMaxDiscount, setNewCouponMaxDiscount] = useState("");
  const [newCouponStartsAt, setNewCouponStartsAt] = useState("");
  const [newCouponEndsAt, setNewCouponEndsAt] = useState("");
  const [newCouponUsageLimit, setNewCouponUsageLimit] = useState("");
  const [newCouponPerUserLimit, setNewCouponPerUserLimit] = useState("");
  const [newCouponIsActive, setNewCouponIsActive] = useState(true);
  const [isSavingCoupon, setIsSavingCoupon] = useState(false);
  const [isSavingOrderStatus, setIsSavingOrderStatus] = useState(false);
  const [userDetails, setUserDetails] = useState<AdminUserDetails | null>(null);
  const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(false);

  const recentUsers = useMemo(() => dashboard?.users.slice(0, 5) || [], [dashboard]);
  const recentOrders = useMemo(() => dashboard?.orders.slice(0, 5) || [], [dashboard]);
  const providerOptions = useMemo(() => {
    if (!dashboard?.users.length) return [];
    return Array.from(new Set(dashboard.users.map((user) => user.provider).filter(Boolean))).sort();
  }, [dashboard]);
  const salesStatusOptions = useMemo(() => {
    if (!dashboard?.orders.length) return [];
    return Array.from(new Set(dashboard.orders.map((order) => order.status).filter(Boolean))).sort();
  }, [dashboard]);
  const filteredUsers = useMemo(() => {
    if (!dashboard?.users.length) return [];

    const query = usersQuery.trim().toLowerCase();
    const threshold = getDateRangeThreshold(usersDateRange);

    return dashboard.users
      .filter((user) => {
      const matchesProvider = usersProviderFilter === "all" || user.provider === usersProviderFilter;
      const matchesDate = !threshold || user.createdAt >= threshold;
      const matchesQuery =
        !query ||
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.country?.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      return matchesProvider && matchesDate && Boolean(matchesQuery);
    })
      .sort((left, right) => {
        switch (usersSort) {
          case "createdAt_asc":
            return left.createdAt - right.createdAt;
          case "lastLoginAt_desc":
            return right.lastLoginAt - left.lastLoginAt;
          case "name_asc":
            return (left.name || "").localeCompare(right.name || "");
          case "email_asc":
            return (left.email || "").localeCompare(right.email || "");
          case "createdAt_desc":
          default:
            return right.createdAt - left.createdAt;
        }
      });
  }, [dashboard, usersDateRange, usersProviderFilter, usersQuery, usersSort]);
  const filteredOrders = useMemo(() => {
    if (!dashboard?.orders.length) return [];

    const query = salesQuery.trim().toLowerCase();
    const threshold = getDateRangeThreshold(salesDateRange);

    return dashboard.orders
      .filter((order) => {
      const matchesStatus = salesStatusFilter === "all" || order.status === salesStatusFilter;
      const matchesDate = !threshold || order.createdAt >= threshold;
      const matchesQuery =
        !query ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName?.toLowerCase().includes(query) ||
        order.userEmail?.toLowerCase().includes(query) ||
        order.plan.toLowerCase().includes(query) ||
        order.planLabel?.toLowerCase().includes(query) ||
        order.couponCode?.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query);

      return matchesStatus && matchesDate && Boolean(matchesQuery);
    })
      .sort((left, right) => {
        switch (salesSort) {
          case "createdAt_asc":
            return left.createdAt - right.createdAt;
          case "price_desc":
            return right.price - left.price;
          case "price_asc":
            return left.price - right.price;
          case "status_asc":
            return left.status.localeCompare(right.status);
          case "customer_asc":
            return (left.customerName || left.userEmail || "").localeCompare(right.customerName || right.userEmail || "");
          case "createdAt_desc":
          default:
            return right.createdAt - left.createdAt;
        }
      });
  }, [dashboard, salesDateRange, salesQuery, salesSort, salesStatusFilter]);
  const agentInsights = useMemo(() => {
    if (!dashboard) {
      return {
        rows: [] as AgentPerformanceRow[],
        selectedAgent: null as AgentPerformanceRow | null,
        selectedUsers: [] as AgentAttributedUserRow[],
        selectedTimeline: [] as Array<{ id: string; label: string; meta: string; occurredAt: number }>,
        totalRedemptions: 0
      };
    }

    const threshold = getDateRangeThreshold(agentDateRange);
    const customStart = getDateInputBoundary(agentDateStart, "start");
    const customEnd = getDateInputBoundary(agentDateEnd, "end");
    const matchesRange = (timestamp: number | null | undefined) => {
      if (!timestamp) return false;
      if (agentDateRange === "custom") {
        if (customStart && timestamp < customStart) return false;
        if (customEnd && timestamp > customEnd) return false;
        return true;
      }
      return !threshold || timestamp >= threshold;
    };
    const usersById = new Map((dashboard.users || []).map((user) => [user.id, user] as const));
    const subscriptionsByUserId = new Map(
      (dashboard.subscriptions || []).map((subscription) => [subscription.userId, subscription] as const)
    );
    const agentByCode = new Map(
      (dashboard.referralAgents || []).map((agent) => [agent.code.trim().toUpperCase(), agent] as const)
    );
    const resolveAgentId = (agentId: string | null | undefined, code: string | null | undefined) =>
      agentId || (code ? agentByCode.get(code.trim().toUpperCase())?.id || null : null);

    const redemptionsByAgent = new Map<string, AdminAgentRedemption[]>();
    (dashboard.agentRedemptions || []).forEach((redemption) => {
      const resolvedAgentId = resolveAgentId(redemption.agentId, redemption.code);
      if (!resolvedAgentId) return;
      const current = redemptionsByAgent.get(resolvedAgentId) || [];
      current.push(redemption);
      redemptionsByAgent.set(resolvedAgentId, current);
    });

    const ordersByAgent = new Map<string, AdminAttributedOrder[]>();
    (dashboard.attributedOrders || []).forEach((order) => {
      const resolvedAgentId = resolveAgentId(order.agentId, order.agentCode);
      if (!resolvedAgentId) return;
      const current = ordersByAgent.get(resolvedAgentId) || [];
      current.push(order);
      ordersByAgent.set(resolvedAgentId, current);
    });

    const eventsByAgent = new Map<string, AdminSubscriptionBillingEvent[]>();
    (dashboard.subscriptionBillingEvents || []).forEach((event) => {
      const resolvedAgentId = resolveAgentId(event.agentId, event.agentCode);
      if (!resolvedAgentId) return;
      const current = eventsByAgent.get(resolvedAgentId) || [];
      current.push(event);
      eventsByAgent.set(resolvedAgentId, current);
    });

    const query = agentQuery.trim().toLowerCase();
    const rows = (dashboard.referralAgents || [])
      .map((agent) => {
        const redemptions = redemptionsByAgent.get(agent.id) || [];
        const attributedOrders = (ordersByAgent.get(agent.id) || []).filter((order) => isPaidOrder(order.status));
        const allEvents = eventsByAgent.get(agent.id) || [];
        const invoicePaidEvents = allEvents
          .filter((event) => event.eventType === "invoice_paid")
          .sort((left, right) => left.occurredAt - right.occurredAt);
        const redemptionsInRange = redemptions.filter((redemption) => matchesRange(redemption.redeemedAt));
        const ordersInRange = attributedOrders.filter((order) => matchesRange(order.createdAt));
        const paidEventsByUser = new Map<string, AdminSubscriptionBillingEvent[]>();

        invoicePaidEvents.forEach((event) => {
          const current = paidEventsByUser.get(event.userId) || [];
          current.push(event);
          paidEventsByUser.set(event.userId, current);
        });

        let convertedUsers = 0;
        let firstPaymentRevenue = 0;
        let renewalCount = 0;
        let renewalRevenue = 0;
        paidEventsByUser.forEach((events) => {
          const sorted = [...events].sort((left, right) => left.occurredAt - right.occurredAt);
          const first = sorted[0];
          if (first && matchesRange(first.occurredAt)) {
            convertedUsers += 1;
            firstPaymentRevenue += first.amount || 0;
          }
          sorted.slice(1).forEach((event) => {
            if (!matchesRange(event.occurredAt)) return;
            renewalCount += 1;
            renewalRevenue += event.amount || 0;
          });
        });

        const attributedUserIds = Array.from(new Set(redemptions.map((redemption) => redemption.userId)));
        const activeTrials = attributedUserIds.filter((userId) => {
          const subscription = subscriptionsByUserId.get(userId);
          return Boolean(
            subscription &&
              isActivePaidSubscription(subscription) &&
              !subscription.stripeSubscriptionId
          );
        }).length;
        const activePaidUsers = attributedUserIds.filter((userId) => {
          const subscription = subscriptionsByUserId.get(userId);
          return Boolean(
            subscription &&
              isActivePaidSubscription(subscription) &&
              subscription.stripeSubscriptionId
          );
        }).length;

        const subscriptionRevenue = invoicePaidEvents
          .filter((event) => matchesRange(event.occurredAt))
          .reduce((sum, event) => sum + (event.amount || 0), 0);
        const orderRevenue = ordersInRange.reduce((sum, order) => sum + order.price, 0);
        const latestActivityAt = [
          ...redemptions.map((item) => item.redeemedAt),
          ...attributedOrders.map((item) => item.createdAt),
          ...allEvents.map((item) => item.occurredAt)
        ].reduce<number | null>((latest, value) => (!latest || value > latest ? value : latest), null);

        return {
          ...agent,
          redemptions: redemptions.length,
          redemptionsInRange: redemptionsInRange.length,
          activeTrials,
          activePaidUsers,
          convertedUsers,
          renewalCount,
          subscriptionRevenue,
          firstPaymentRevenue,
          renewalRevenue,
          orderRevenue,
          paidOrderCount: ordersInRange.length,
          totalRevenue: subscriptionRevenue + orderRevenue,
          latestActivityAt,
          attributedUsers: attributedUserIds.length
        } satisfies AgentPerformanceRow;
      })
      .filter((agent) => {
        if (!query) return true;
        return (
          agent.code.toLowerCase().includes(query) ||
          agent.name?.toLowerCase().includes(query) ||
          agent.email?.toLowerCase().includes(query) ||
          agent.phone?.toLowerCase().includes(query)
        );
      })
      .sort((left, right) => {
        switch (agentSort) {
          case "subscriptionRevenue_desc":
            return right.subscriptionRevenue - left.subscriptionRevenue || right.totalRevenue - left.totalRevenue;
          case "orderRevenue_desc":
            return right.orderRevenue - left.orderRevenue || right.totalRevenue - left.totalRevenue;
          case "latestActivity_desc":
            return (right.latestActivityAt || 0) - (left.latestActivityAt || 0);
          case "redemptions_desc":
            return right.redemptions - left.redemptions || right.totalRevenue - left.totalRevenue;
          case "createdAt_desc":
            return right.createdAt - left.createdAt;
          case "totalRevenue_desc":
          default:
            return right.totalRevenue - left.totalRevenue || (right.latestActivityAt || 0) - (left.latestActivityAt || 0);
        }
      });

    const selectedAgent =
      rows.find((agent) => agent.id === selectedAgentId) ||
      rows[0] ||
      null;
    const selectedAgentOrders = selectedAgent
      ? (ordersByAgent.get(selectedAgent.id) || []).filter((order) => isPaidOrder(order.status))
      : [];
    const selectedAgentEvents = selectedAgent ? eventsByAgent.get(selectedAgent.id) || [] : [];

    const selectedUsers: AgentAttributedUserRow[] = selectedAgent
      ? ((redemptionsByAgent.get(selectedAgent.id) || [])
          .map((redemption) => {
            const user = usersById.get(redemption.userId);
            const subscription = subscriptionsByUserId.get(redemption.userId);
            const userOrders = selectedAgentOrders.filter((order) => order.userId === redemption.userId);
            const userEvents = selectedAgentEvents
              .filter((event) => event.userId === redemption.userId && event.eventType === "invoice_paid")
              .sort((left, right) => left.occurredAt - right.occurredAt);
            const firstPaidAt = userEvents[0]?.occurredAt || null;
            const lastRenewalAt = userEvents.length > 1 ? userEvents[userEvents.length - 1].occurredAt : null;
            const subscriptionRevenue = userEvents.reduce((sum, event) => sum + (event.amount || 0), 0);
            const orderRevenue = userOrders.reduce((sum, order) => sum + order.price, 0);
            const lastActivityAt = [
              redemption.redeemedAt,
              ...userEvents.map((event) => event.occurredAt),
              ...userOrders.map((order) => order.createdAt)
            ].reduce<number | null>((latest, value) => (!latest || value > latest ? value : latest), null);

            return {
              userId: redemption.userId,
              email: user?.email || null,
              name: user?.name || null,
              country: user?.country || null,
              redeemedAt: redemption.redeemedAt,
              currentTier: isActivePaidSubscription(subscription) ? subscription?.tier || "free" : "free",
              subscriptionStatus: subscription?.status || null,
              trialEnd: redemption.periodEnd || null,
              firstPaidAt,
              lastRenewalAt,
              subscriptionRevenue,
              orderCount: userOrders.length,
              orderRevenue,
              totalRevenue: subscriptionRevenue + orderRevenue,
              lastActivityAt
            };
          })
          .sort((left, right) => (right.totalRevenue - left.totalRevenue) || ((right.lastActivityAt || 0) - (left.lastActivityAt || 0))))
      : [];

    const selectedTimeline = selectedAgent
      ? [
          ...(redemptionsByAgent.get(selectedAgent.id) || []).map((redemption) => {
            const user = usersById.get(redemption.userId);
            return {
              id: `redemption-${redemption.id}`,
              label: `${user?.name || user?.email || redemption.userId} redeemed ${selectedAgent.code}`,
              meta: `${formatAgentCodeTypeLabel(selectedAgent.codeType)} access granted`,
              occurredAt: redemption.redeemedAt
            };
          }),
          ...(selectedAgentEvents
            .filter((event) => event.eventType !== "trial_granted")
            .map((event) => ({
            id: `event-${event.id}`,
            label:
              event.eventType === "invoice_paid"
                ? `Subscription payment ${formatCurrency(event.amount || 0)}`
                : event.eventType === "invoice_failed"
                  ? "Subscription payment failed"
                  : event.eventType === "subscription_cancelled"
                    ? "Subscription cancelled"
                    : event.eventType === "subscription_cancel_scheduled"
                      ? "Cancellation scheduled"
                      : event.eventType === "subscription_started"
                        ? "Subscription started"
                        : "Trial granted",
            meta: usersById.get(event.userId)?.email || event.userId,
            occurredAt: event.occurredAt
          }))),
          ...(selectedAgentOrders
            .filter((order) => isPaidOrder(order.status))
            .map((order) => ({
              id: `order-${order.id}`,
              label: `Supplement order ${order.orderNumber}`,
              meta: `${order.customerName || order.userEmail || order.userId || "User"} - ${formatCurrency(order.price)}`,
              occurredAt: order.createdAt
            })))
        ]
          .sort((left, right) => right.occurredAt - left.occurredAt)
          .slice(0, 18)
      : [];

    return {
      rows,
      selectedAgent,
      selectedUsers,
      selectedTimeline,
      totalRedemptions: (dashboard.referralAgents || []).reduce((sum, agent) => sum + (agent.redemptionCount || 0), 0)
    };
  }, [agentDateEnd, agentDateRange, agentDateStart, agentQuery, agentSort, dashboard, selectedAgentId]);
  const referralSummaries = useMemo(() => {
    if (!dashboard) return [];

    const monthStart = getCurrentMonthStart();
    const referralAgentMap = new Map(
      (dashboard?.users || [])
        .filter((user) => user.referralCode?.trim())
        .map((user) => [user.referralCode!.trim().toUpperCase(), user] as const)
    );
    const managedAgentMap = new Map(
      (dashboard?.referralAgents || [])
        .filter((agent) => agent.code?.trim())
        .map((agent) => [agent.code.trim().toUpperCase(), agent] as const)
    );
    const referralMap = new Map<
      string,
      AdminReferralSummary & { customerKeys: Set<string> }
    >();

    const seedCode = (code: string) => {
      if (referralMap.has(code)) return;
      const userAgent = referralAgentMap.get(code);
      const managedAgent = managedAgentMap.get(code);
      referralMap.set(code, {
        code,
        agentUserId: userAgent?.id || null,
        agentName: managedAgent?.name || userAgent?.name || null,
        agentEmail: managedAgent?.email || userAgent?.email || null,
        totalOrders: 0,
        totalRevenue: 0,
        paidOrders: 0,
        paidRevenue: 0,
        monthOrders: 0,
        monthRevenue: 0,
        monthPaidOrders: 0,
        monthPaidRevenue: 0,
        uniqueCustomers: 0,
        latestSaleAt: null,
        customerKeys: new Set<string>()
      });
    };

    for (const code of referralAgentMap.keys()) seedCode(code);
    for (const code of managedAgentMap.keys()) seedCode(code);

    dashboard.orders.forEach((order) => {
      const rawCode = order.couponCode?.trim();
      if (!rawCode) return;

      const code = rawCode.toUpperCase();
      seedCode(code);
      const existing = referralMap.get(code);
      if (!existing) return;

      existing.totalOrders += 1;
      existing.totalRevenue += order.price;

      if (isPaidOrder(order.status)) {
        existing.paidOrders += 1;
        existing.paidRevenue += order.price;
      }

      if (order.createdAt >= monthStart) {
        existing.monthOrders += 1;
        existing.monthRevenue += order.price;

        if (isPaidOrder(order.status)) {
          existing.monthPaidOrders += 1;
          existing.monthPaidRevenue += order.price;
        }
      }

      if (!existing.latestSaleAt || order.createdAt > existing.latestSaleAt) {
        existing.latestSaleAt = order.createdAt;
      }

      const customerKey =
        order.userId || order.userEmail?.toLowerCase() || order.customerName?.toLowerCase() || order.orderNumber;
      existing.customerKeys.add(customerKey);
      existing.uniqueCustomers = existing.customerKeys.size;
    });

    return Array.from(referralMap.values()).map(({ customerKeys: _customerKeys, ...summary }) => summary);
  }, [dashboard]);
  const referralCodeRows = useMemo(() => {
    if (!dashboard) return [];

    const summaryMap = new Map(
      referralSummaries.map((summary) => [summary.code.toUpperCase(), summary])
    );
    const rowMap = new Map<string, ReferralCodeRow>();

    (dashboard.referralAgents || []).forEach((agent) => {
      const code = agent.code.trim().toUpperCase();
      if (!code) return;
      const summary = summaryMap.get(code);
      rowMap.set(code, {
        id: agent.id,
        code,
        name: agent.name || null,
        email: agent.email || null,
        source: "managed",
        createdAt: agent.createdAt || null,
        totalOrders: summary?.totalOrders ?? 0,
        paidRevenue: summary?.paidRevenue ?? 0
      });
    });

    (dashboard.users || []).forEach((user) => {
      const rawCode = user.referralCode?.trim();
      if (!rawCode) return;
      const code = rawCode.toUpperCase();
      if (rowMap.has(code)) return;
      const summary = summaryMap.get(code);
      rowMap.set(code, {
        id: user.id,
        code,
        name: user.name || null,
        email: user.email || null,
        source: "user",
        createdAt: user.createdAt || null,
        totalOrders: summary?.totalOrders ?? 0,
        paidRevenue: summary?.paidRevenue ?? 0
      });
    });

    const query = codeQuery.trim().toLowerCase();
    return Array.from(rowMap.values())
      .filter((row) =>
        !query ||
        row.code.toLowerCase().includes(query) ||
        row.name?.toLowerCase().includes(query) ||
        row.email?.toLowerCase().includes(query)
      )
      .sort((left, right) => {
        switch (codeSort) {
          case "createdAt_asc":
            return (left.createdAt || 0) - (right.createdAt || 0);
          case "code_asc":
            return left.code.localeCompare(right.code);
          case "createdAt_desc":
          default:
            return (right.createdAt || 0) - (left.createdAt || 0);
        }
      });
  }, [codeQuery, codeSort, dashboard, referralSummaries]);
  const overviewStats = useMemo(() => {
    if (!dashboard) {
      return {
        newUsers7d: 0,
        users30d: 0,
        paidOrders30d: 0,
        failedOrders30d: 0,
        revenue30d: 0,
        averageOrderValue: 0
      };
    }

    const last7Days = getDateRangeThreshold("7d") ?? 0;
    const last30Days = getDateRangeThreshold("30d") ?? 0;
    const recentUsers7d = dashboard.users.filter((user) => user.createdAt >= last7Days);
    const recentUsers30d = dashboard.users.filter((user) => user.createdAt >= last30Days);
    const recentOrders30d = dashboard.orders.filter((order) => order.createdAt >= last30Days);
    const paidOrders30d = recentOrders30d.filter((order) =>
      ["paid", "completed", "succeeded"].includes(order.status.trim().toLowerCase())
    );
    const failedOrders30d = recentOrders30d.filter((order) =>
      ["failed", "cancelled"].includes(order.status.trim().toLowerCase())
    );
    const revenue30d = paidOrders30d.reduce((sum, order) => sum + order.price, 0);
    const averageOrderValue = dashboard.stats.totalSales ? dashboard.stats.totalRevenue / dashboard.stats.totalSales : 0;

    return {
      newUsers7d: recentUsers7d.length,
      users30d: recentUsers30d.length,
      paidOrders30d: paidOrders30d.length,
      failedOrders30d: failedOrders30d.length,
      revenue30d,
      averageOrderValue
    };
  }, [dashboard]);

  const selectedUser = useMemo(() => {
    if (!filteredUsers.length) return null;
    return (
      filteredUsers.find((user) => user.id === selectedUserId) ||
      filteredUsers[0] ||
      null
    );
  }, [filteredUsers, selectedUserId]);

  const selectedOrder = useMemo(() => {
    if (!filteredOrders.length) return null;
    return (
      filteredOrders.find((order) => order.id === selectedOrderId) ||
      filteredOrders[0] ||
      null
    );
  }, [filteredOrders, selectedOrderId]);
  const linkedUserForOrder = useMemo(() => {
    if (!selectedOrder?.userId || !dashboard?.users.length) return null;
    return dashboard.users.find((user) => user.id === selectedOrder.userId) || null;
  }, [dashboard, selectedOrder]);
  const globalLookupResults = useMemo(() => {
    if (!dashboard || !globalLookupQuery.trim()) return [];

    const query = globalLookupQuery.trim().toLowerCase();
    const userMatches = dashboard.users
      .filter((user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.country?.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      )
      .slice(0, 4)
      .map((user) => ({
        key: `user-${user.id}`,
        type: "user" as const,
        id: user.id,
        title: user.name || "Unnamed user",
        subtitle: user.email || user.id,
        meta: `Registered ${formatDate(user.createdAt)}`
      }));

    const orderMatches = dashboard.orders
      .filter((order) =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName?.toLowerCase().includes(query) ||
        order.userEmail?.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query) ||
        order.plan.toLowerCase().includes(query) ||
        order.planLabel?.toLowerCase().includes(query)
      )
      .slice(0, 4)
      .map((order) => ({
        key: `order-${order.id}`,
        type: "order" as const,
        id: order.id,
        title: order.orderNumber,
        subtitle: order.customerName || order.userEmail || "Unassigned customer",
        meta: `${order.status} · ${formatCurrency(order.price)}`
      }));

    return [...userMatches, ...orderMatches].slice(0, 8);
  }, [dashboard, globalLookupQuery]);
  const relatedOrdersForUser = useMemo(() => {
    if (!selectedUser || !dashboard?.orders.length) return [];

    return dashboard.orders
      .filter(
        (order) =>
          order.userId === selectedUser.id ||
          (selectedUser.email && order.userEmail?.toLowerCase() === selectedUser.email.toLowerCase())
      )
      .sort((left, right) => right.createdAt - left.createdAt)
      .slice(0, 5);
  }, [dashboard, selectedUser]);
  const orderCustomerHistory = useMemo(() => {
    if (!selectedOrder || !dashboard?.orders.length) {
      return {
        orders: [] as AdminOrder[],
        totalOrders: 0,
        totalRevenue: 0
      };
    }

    const matches = dashboard.orders
      .filter((order) => {
        if (selectedOrder.userId && order.userId === selectedOrder.userId) return true;
        if (selectedOrder.userEmail && order.userEmail?.toLowerCase() === selectedOrder.userEmail.toLowerCase()) return true;
        return false;
      })
      .sort((left, right) => right.createdAt - left.createdAt);

    return {
      orders: matches.slice(0, 5),
      totalOrders: matches.length,
      totalRevenue: matches.reduce((sum, order) => sum + order.price, 0)
    };
  }, [dashboard, selectedOrder]);

  const sectionMeta = getSectionMeta(activeSection, dashboard, lastSyncedAt);
  const isSignedIn = Boolean(dashboard);
  const captchaAnswer = captchaLeft + captchaRight;
  const isCaptchaValid = Number(captchaInput.trim()) === captchaAnswer;
  const canSubmit = username.trim().length > 0 && password.trim().length > 0 && isCaptchaValid;

  const refreshCaptcha = () => {
    setCaptchaLeft(Math.floor(Math.random() * 9) + 1);
    setCaptchaRight(Math.floor(Math.random() * 9) + 1);
    setCaptchaInput("");
  };

  const fetchDashboard = async (
    nextUsername: string,
    nextPassword: string,
    options?: { preserveSection?: boolean }
  ) => {
    setIsLoading(true);
    setError("");
    setFlashMessage("");

    try {
      const response = await requestAdminOverview(nextUsername, nextPassword);

      const payload = (await response.json().catch(() => null)) as AdminOverview | { error?: string } | null;
      if (!response.ok || !payload || ("error" in payload && typeof payload.error === "string")) {
        const authFailure =
          response.status === 401 ||
          response.status === 403 ||
          (payload && "error" in payload && payload.error === "admin_auth_required");
        const transientFailure = [429, 500, 502, 503, 504].includes(response.status);
        throw new Error(
          authFailure
            ? "Invalid admin username or password."
            : transientFailure
              ? "Admin service is temporarily unavailable."
              : "Unable to load dashboard."
        );
      }

      setDashboard(payload as AdminOverview);
      // discount coupons are loaded on-demand (coupons tab) to keep overview payload small.
      setLastSyncedAt(Date.now());
      setSelectedUserId((payload as AdminOverview).users[0]?.id || null);
      setSelectedOrderId((payload as AdminOverview).orders[0]?.id || null);
      setSelectedAgentId((payload as AdminOverview).referralAgents?.[0]?.id || null);
      sessionStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify({ username: nextUsername, password: nextPassword })
      );
      setStatus("authenticated");
      setFlashMessage(
        "Dashboard synced successfully."
      );
      if (!options?.preserveSection) {
        setActiveSection("overview");
      }
    } catch (nextError) {
      const nextMessage =
        nextError instanceof TypeError
          ? "Unable to reach the admin service. Check the production proxy or local /api proxy and try again."
          : nextError instanceof Error
            ? nextError.message
            : "Unable to load dashboard.";
      const isAuthError = nextMessage === "Invalid admin username or password.";

      if (isAuthError) {
        setDashboard(null);
        setSelectedUserId(null);
        setSelectedOrderId(null);
        setSelectedAgentId(null);
        setLastSyncedAt(null);
        setStatus("expired");
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
      } else if (!dashboard) {
        setSelectedUserId(null);
        setSelectedOrderId(null);
        setSelectedAgentId(null);
      } else {
        setStatus("refresh_failed");
      }

      if (!dashboard || isAuthError) {
        setDashboard(isAuthError ? null : dashboard);
      }
      setError(nextMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDiscountCoupons = async () => {
    if (!username.trim() || !password) return;
    setIsLoading(true);
    setError("");
    setFlashMessage("");

    try {
      const response = await requestDiscountCouponsList(username.trim(), password);
      const payload = (await response.json().catch(() => null)) as { coupons?: AdminDiscountCoupon[]; error?: string } | null;
      if (!response.ok || !payload?.coupons) {
        throw new Error("Unable to load discount coupons.");
      }
      setDiscountCoupons(payload.coupons);
      setFlashMessage("Discount coupons synced.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to load discount coupons.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDiscountCoupons = useMemo(() => {
    const query = couponQuery.trim().toLowerCase();
    if (!query) return discountCoupons;
    return discountCoupons.filter((coupon) => {
      return (
        coupon.code.toLowerCase().includes(query) ||
        coupon.title?.toLowerCase().includes(query) ||
        coupon.description?.toLowerCase().includes(query)
      );
    });
  }, [couponQuery, discountCoupons]);

  const handleCreateDiscountCoupon = async () => {
    const code = newCouponCode.trim().toUpperCase();
    if (!code) {
      setError("Coupon code is required.");
      return;
    }

    const discountValue = Number(newCouponDiscountValue);
    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      setError("Discount value must be a positive number.");
      return;
    }

    setIsSavingCoupon(true);
    setError("");
    setFlashMessage("");

    try {
      const minSubtotal = newCouponMinSubtotal.trim() ? Number(newCouponMinSubtotal) : null;
      if (newCouponMinSubtotal.trim() && (!Number.isFinite(minSubtotal!) || minSubtotal! < 0)) {
        throw new Error("Minimum subtotal must be a valid number.");
      }

      const maxDiscount = newCouponMaxDiscount.trim() ? Number(newCouponMaxDiscount) : null;
      if (newCouponMaxDiscount.trim() && (!Number.isFinite(maxDiscount!) || maxDiscount! < 0)) {
        throw new Error("Max discount must be a valid number.");
      }

      const usageLimit = newCouponUsageLimit.trim() ? Number(newCouponUsageLimit) : null;
      if (newCouponUsageLimit.trim() && (!Number.isFinite(usageLimit!) || usageLimit! < 1)) {
        throw new Error("Usage limit must be a whole number >= 1.");
      }

      const perUserLimit = newCouponPerUserLimit.trim() ? Number(newCouponPerUserLimit) : null;
      if (newCouponPerUserLimit.trim() && (!Number.isFinite(perUserLimit!) || perUserLimit! < 1)) {
        throw new Error("Per-user limit must be a whole number >= 1.");
      }

      const response = await requestDiscountCouponCreate(username.trim(), password, {
        code,
        title: newCouponTitle.trim() || null,
        description: newCouponDescription.trim() || null,
        discountType: newCouponDiscountType,
        discountValue,
        currency: "MYR",
        minimumSubtotal: minSubtotal,
        maxDiscountAmount: maxDiscount,
        startsAt: newCouponStartsAt.trim() || null,
        endsAt: newCouponEndsAt.trim() || null,
        usageLimit,
        perUserLimit,
        isActive: newCouponIsActive
      });

      const payload = (await response.json().catch(() => null)) as { coupon?: AdminDiscountCoupon; error?: string } | null;
      if (!response.ok || !payload?.coupon) {
        if (payload?.error === "invalid_coupon_code") {
          throw new Error("Coupon code must be 3-32 characters (letters, numbers, '-' or '_').");
        }
        if (payload?.error === "coupon_code_in_use") {
          throw new Error("That coupon code is already in use.");
        }
        throw new Error("Unable to create discount coupon.");
      }

      setDiscountCoupons((current) => [payload.coupon!, ...current]);
      setNewCouponCode("");
      setNewCouponTitle("");
      setNewCouponDescription("");
      setNewCouponDiscountType("percent");
      setNewCouponDiscountValue("10");
      setNewCouponMinSubtotal("");
      setNewCouponMaxDiscount("");
      setNewCouponStartsAt("");
      setNewCouponEndsAt("");
      setNewCouponUsageLimit("");
      setNewCouponPerUserLimit("");
      setNewCouponIsActive(true);
      setFlashMessage("Discount coupon created.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to create discount coupon.");
    } finally {
      setIsSavingCoupon(false);
    }
  };

  const handleDeleteDiscountCoupon = async (couponId: string, code: string) => {
    const confirmed = window.confirm(`Delete discount coupon ${code}? This cannot be undone.`);
    if (!confirmed) return;

    setIsSavingCoupon(true);
    setError("");
    setFlashMessage("");

    try {
      const response = await requestDiscountCouponDelete(username.trim(), password, couponId);
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        if (payload?.error === "coupon_not_found") {
          throw new Error("That coupon no longer exists.");
        }
        throw new Error("Unable to delete discount coupon.");
      }
      setDiscountCoupons((current) => current.filter((coupon) => coupon.id !== couponId));
      setFlashMessage("Discount coupon deleted.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to delete discount coupon.");
    } finally {
      setIsSavingCoupon(false);
    }
  };

  const handleMarkOrderFailed = async (orderId: string, orderNumber: string) => {
    const confirmed = window.confirm(`Mark order ${orderNumber} as failed? This will close out the payment attempt.`);
    if (!confirmed) return;

    setIsSavingOrderStatus(true);
    setError("");
    setFlashMessage("");

    try {
      const response = await requestOrderStatusUpdate(username.trim(), password, orderId, "failed");
      const payload = (await response.json().catch(() => null)) as { order?: AdminOrder; error?: string } | null;

      if (!response.ok || !payload?.order) {
        if (payload?.error === "order_already_paid") {
          throw new Error("That order is already paid and cannot be updated.");
        }
        if (payload?.error === "order_not_found") {
          throw new Error("That order no longer exists.");
        }
        throw new Error("Unable to update order status.");
      }

      const updatedOrder = payload.order;
      setDashboard((current) => {
        if (!current) return current;
        return {
          ...current,
          orders: current.orders.map((order) => (order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order))
        };
      });
      setSelectedOrderId(updatedOrder.id);
      setFlashMessage(`Order ${updatedOrder.orderNumber} marked as failed.`);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to update order status.");
    } finally {
      setIsSavingOrderStatus(false);
    }
  };

  useEffect(() => {
    if (!isSignedIn) return;
    if (activeSection !== "coupons" && activeSection !== "codes") return;
    if (discountCoupons.length) return;
    void fetchDiscountCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, isSignedIn]);

  const renderCoupons = () => {
    return (
      <div className="admin-section-stack">
        <section className="admin-panel-card">
          <div className="admin-panel-head">
            <div>
              <p className="admin-panel-kicker">Discount coupons</p>
              <h3>Create new coupon</h3>
            </div>
            <button type="button" className="admin-link-button" onClick={fetchDiscountCoupons} disabled={isLoading}>
              Refresh
            </button>
          </div>

          <div className="admin-coupon-form">
            <div className="admin-controls admin-controls-roomy">
              <label className="admin-control-field">
                <span>Code</span>
                <input value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value)} placeholder="WELCOME10" />
              </label>
              <label className="admin-control-field">
                <span>Title</span>
                <input value={newCouponTitle} onChange={(e) => setNewCouponTitle(e.target.value)} placeholder="Welcome discount" />
              </label>
              <label className="admin-control-field">
                <span>Discount type</span>
                <select value={newCouponDiscountType} onChange={(e) => setNewCouponDiscountType(e.target.value as any)}>
                  <option value="percent">Percent (%)</option>
                  <option value="fixed_amount">Fixed amount (MYR)</option>
                </select>
              </label>
              <label className="admin-control-field">
                <span>Value</span>
                <input value={newCouponDiscountValue} onChange={(e) => setNewCouponDiscountValue(e.target.value)} inputMode="decimal" placeholder={newCouponDiscountType === "percent" ? "10" : "20"} />
              </label>
            </div>

            <div className="admin-controls admin-controls-roomy">
              <label className="admin-control-field admin-control-field-wide">
                <span>Description (optional)</span>
                <input value={newCouponDescription} onChange={(e) => setNewCouponDescription(e.target.value)} placeholder="Internal note for admins" />
              </label>
            </div>

            <details className="admin-advanced">
              <summary>Usage + validity (optional)</summary>
              <div className="admin-controls admin-controls-roomy">
                <label className="admin-control-field">
                  <span>Min subtotal</span>
                  <input value={newCouponMinSubtotal} onChange={(e) => setNewCouponMinSubtotal(e.target.value)} inputMode="decimal" placeholder="0" />
                </label>
                <label className="admin-control-field">
                  <span>Max discount</span>
                  <input value={newCouponMaxDiscount} onChange={(e) => setNewCouponMaxDiscount(e.target.value)} inputMode="decimal" placeholder="0" />
                </label>
                <label className="admin-control-field">
                  <span>Starts at</span>
                  <input type="date" value={newCouponStartsAt} onChange={(e) => setNewCouponStartsAt(e.target.value)} />
                </label>
                <label className="admin-control-field">
                  <span>Ends at</span>
                  <input type="date" value={newCouponEndsAt} onChange={(e) => setNewCouponEndsAt(e.target.value)} />
                </label>
                <label className="admin-control-field">
                  <span>Usage limit</span>
                  <input value={newCouponUsageLimit} onChange={(e) => setNewCouponUsageLimit(e.target.value)} inputMode="numeric" placeholder="100" />
                </label>
                <label className="admin-control-field">
                  <span>Per-user limit</span>
                  <input value={newCouponPerUserLimit} onChange={(e) => setNewCouponPerUserLimit(e.target.value)} inputMode="numeric" placeholder="1" />
                </label>
              </div>
            </details>

            <div className="admin-form-actions admin-form-actions-roomy">
              <label className="admin-control-field">
                <span>Status</span>
                <select value={newCouponIsActive ? "1" : "0"} onChange={(e) => setNewCouponIsActive(e.target.value === "1")}>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </label>
              <button
                type="button"
                className="admin-submit-button"
                onClick={handleCreateDiscountCoupon}
                disabled={isSavingCoupon || !newCouponCode.trim()}
              >
                {isSavingCoupon ? "Creating..." : "Create coupon"}
              </button>
            </div>
          </div>
        </section>

        <section className="admin-panel-card">
          <div className="admin-panel-head">
            <div>
              <p className="admin-panel-kicker">Issued coupons</p>
              <h3>Customer discount coupons</h3>
            </div>
          </div>
          <section className="admin-filters-bar">
            <div className="admin-controls">
              <label className="admin-control-field admin-control-field-wide">
                <span>Search</span>
                <input value={couponQuery} onChange={(e) => setCouponQuery(e.target.value)} placeholder="Code or title" />
              </label>
              <span className="admin-filter-summary">Showing {filteredDiscountCoupons.length}</span>
            </div>
          </section>

          {filteredDiscountCoupons.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Min subtotal</th>
                    <th>Max discount</th>
                    <th>Usage</th>
                    <th>Active</th>
                    <th>Valid</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDiscountCoupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td>{coupon.code}</td>
                      <td>{coupon.discountType === "percent" ? "Percent" : "Fixed"}</td>
                      <td>
                        {coupon.discountType === "percent" ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)}
                      </td>
                      <td>{coupon.minimumSubtotal == null ? "--" : formatCurrency(coupon.minimumSubtotal)}</td>
                      <td>{coupon.maxDiscountAmount == null ? "--" : formatCurrency(coupon.maxDiscountAmount)}</td>
                      <td>
                        {coupon.usageCount}
                        {coupon.usageLimit != null ? ` / ${coupon.usageLimit}` : ""}
                      </td>
                      <td>
                        <span className={`admin-tag admin-tag-${coupon.isActive ? "success" : "neutral"}`}>
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <small>
                          {coupon.startsAt ? formatDate(coupon.startsAt) : "--"} → {coupon.endsAt ? formatDate(coupon.endsAt) : "--"}
                        </small>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-link-button"
                          onClick={() => handleDeleteDiscountCoupon(coupon.id, coupon.code)}
                          disabled={isSavingCoupon}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-card">
              <strong>No discount coupons yet</strong>
              <p>Create your first customer coupon like WELCOME10.</p>
            </div>
          )}
        </section>
      </div>
    );
  };

  useEffect(() => {
    if (filteredUsers.length && !filteredUsers.some((user) => user.id === selectedUserId)) {
      setSelectedUserId(filteredUsers[0].id);
    }
  }, [filteredUsers, selectedUserId]);

  useEffect(() => {
    if (filteredOrders.length && !filteredOrders.some((order) => order.id === selectedOrderId)) {
      setSelectedOrderId(filteredOrders[0].id);
    }
  }, [filteredOrders, selectedOrderId]);

  useEffect(() => {
    if (agentInsights.rows.length && !agentInsights.rows.some((agent) => agent.id === selectedAgentId)) {
      setSelectedAgentId(agentInsights.rows[0].id);
    }
  }, [agentInsights.rows, selectedAgentId]);

  useEffect(() => {
    if (!copiedField) return;

    const timeout = window.setTimeout(() => setCopiedField(""), 1800);
    return () => window.clearTimeout(timeout);
  }, [copiedField]);

  useEffect(() => {
    if (!flashMessage) return;

    const timeout = window.setTimeout(() => setFlashMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [flashMessage]);

  useEffect(() => {
    if (!isSignedIn || !selectedUser?.id) {
      setUserDetails(null);
      return;
    }
    let cancelled = false;
    const loadDetails = async () => {
      setIsLoadingUserDetails(true);
      try {
        const response = await requestAdminUserDetails(username.trim(), password, selectedUser.id);
        const payload = (await response.json().catch(() => null)) as AdminUserDetails | { error?: string } | null;
        if (!response.ok || !payload || ("error" in payload && payload.error)) {
          throw new Error("Unable to load user details.");
        }
        if (!cancelled) {
          setUserDetails(payload as AdminUserDetails);
        }
      } catch (nextError) {
        if (!cancelled) {
          setUserDetails(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingUserDetails(false);
        }
      }
    };
    void loadDetails();
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, selectedUser?.id, username, password]);

  useEffect(() => {
    if (dashboard) return;
    const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { username?: string; password?: string } | null;
      if (!parsed?.username || !parsed?.password) return;
      setUsername(parsed.username);
      setPassword(parsed.password);
      void fetchDashboard(parsed.username, parsed.password, { preserveSection: true });
    } catch {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isCaptchaValid) {
      setError("Please solve the security question correctly.");
      refreshCaptcha();
      return;
    }

    await fetchDashboard(username.trim(), password);
  };

  const handleRefresh = () => {
    void fetchDashboard(username.trim(), password, { preserveSection: true });
  };

  const handleLogout = () => {
    setUsername("");
    setPassword("");
    setDashboard(null);
    setError("");
    setStatus("idle");
    setFlashMessage("Signed out of the admin console.");
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setSelectedUserId(null);
    setSelectedOrderId(null);
    setSelectedAgentId(null);
    setUserDetails(null);
    setLastSyncedAt(null);
    setActiveSection("overview");
    refreshCaptcha();
  };

  const handleCopy = async (label: string, value: string | null | undefined) => {
    if (!value) return;
    const didCopy = await copyToClipboard(value);
    setCopiedField(didCopy ? label : "");
  };

  const exportUsersCsv = () => {
    triggerCsvDownload("admin-users.csv", [
      ["User ID", "Name", "Email", "Provider", "Country", "Registered", "Last Login"],
      ...filteredUsers.map((user) => [
        user.id,
        user.name || "",
        user.email || "",
        getProviderLabel(user.provider),
        user.country || "",
        formatDate(user.createdAt),
        formatDate(user.lastLoginAt)
      ])
    ]);
  };

  const exportOrdersCsv = () => {
    triggerCsvDownload("admin-sales.csv", [
      ["Order ID", "Order Number", "Customer", "User Email", "User ID", "Plan", "Payment Method", "Status", "Coupon Code", "Total", "Created", "Source"],
      ...filteredOrders.map((order) => [
        order.id,
        order.orderNumber,
        order.customerName || "",
        order.userEmail || "",
        order.userId || "",
        order.planLabel || order.plan,
        order.paymentMethod || "",
        order.status,
        order.couponCode || "",
        order.price,
        formatDate(order.createdAt),
        order.source || ""
      ])
    ]);
  };

  const handleCreateReferralAgent = async () => {
    const code = newAgentCode.trim().toUpperCase();
    if (!code) {
      setError("Referral code is required.");
      return;
    }

    setIsSavingAgent(true);
    setError("");
    setFlashMessage("");

    try {
      const response = await requestReferralAgentCreate(username.trim(), password, {
        code,
        codeType: newAgentCodeType,
        name: newAgentName.trim() || null,
        email: newAgentEmail.trim() || null,
        phone: newAgentPhone.trim() || null
      });

      const payload = (await response.json().catch(() => null)) as
        | { agent?: AdminReferralAgent; error?: string }
        | null;

      if (!response.ok || !payload?.agent) {
        if (payload?.error === "invalid_referral_code") {
          throw new Error("Agent code must be 4-24 characters using only letters and numbers.");
        }
        if (payload?.error === "invalid_email") {
          throw new Error("Please enter a valid agent email address.");
        }
        if (payload?.error === "referral_code_in_use") {
          throw new Error("That agent code is already assigned to another user or agent.");
        }
        throw new Error("Unable to create agent code.");
      }

      const createdAgent = payload.agent;
      if (!createdAgent) {
        throw new Error("Unable to create agent code.");
      }
      setDashboard((current) => {
        if (!current) return current;
        return {
          ...current,
          referralAgents: [createdAgent, ...(current.referralAgents || [])]
        };
      });
      setNewAgentCode("");
      setNewAgentCodeType("plus");
      setNewAgentName("");
      setNewAgentEmail("");
      setNewAgentPhone("");
      setFlashMessage("Agent access code created.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to create agent code.");
    } finally {
      setIsSavingAgent(false);
    }
  };

  const handleDeleteReferralAgent = async (agentId: string, code: string) => {
    if (!agentId) return;
    const confirmed = window.confirm(`Delete referral code ${code}? This cannot be undone.`);
    if (!confirmed) return;

    setIsSavingAgent(true);
    setError("");
    setFlashMessage("");

    try {
      const response = await requestReferralAgentDelete(username.trim(), password, agentId);

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        if (payload?.error === "agent_not_found") {
          throw new Error("That referral code no longer exists.");
        }
        throw new Error("Unable to delete referral code.");
      }

      setDashboard((current) => {
        if (!current) return current;
        return {
          ...current,
          referralAgents: (current.referralAgents || []).filter((agent) => agent.id !== agentId)
        };
      });
      setFlashMessage("Referral code deleted.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to delete referral code.");
    } finally {
      setIsSavingAgent(false);
    }
  };

  const openLookupResult = (result: { type: "user" | "order"; id: string }) => {
    if (result.type === "user") {
      setSelectedUserId(result.id);
      setActiveSection("users");
    } else {
      setSelectedOrderId(result.id);
      setActiveSection("sales");
    }
    setGlobalLookupQuery("");
  };

  const renderOverview = () => (
    <div className="admin-section-stack">
      <section className="admin-kpi-grid">
        <article className="admin-kpi-card">
          <span className="admin-kpi-label">Registered users</span>
          <strong>{dashboard?.stats.totalUsers ?? 0}</strong>
          <small>Latest registration: {formatDate(dashboard?.stats.latestUserAt ?? null)}</small>
        </article>
        <article className="admin-kpi-card">
          <span className="admin-kpi-label">Paid orders</span>
          <strong>{dashboard?.stats.totalSales ?? 0}</strong>
          <small>Latest paid order: {formatDate(dashboard?.stats.latestSaleAt ?? null)}</small>
        </article>
        <article className="admin-kpi-card">
          <span className="admin-kpi-label">Paid revenue</span>
          <strong>{formatCurrency(dashboard?.stats.totalRevenue ?? 0)}</strong>
          <small>Potential revenue: {formatCurrency(dashboard?.stats.potentialRevenue ?? 0)}</small>
        </article>
      </section>

      <section className="admin-kpi-grid admin-kpi-grid-secondary">
        <article className="admin-kpi-card">
          <span className="admin-kpi-label">New users, 7 days</span>
          <strong>{overviewStats.newUsers7d}</strong>
          <small>{overviewStats.users30d} registrations in the last 30 days</small>
        </article>
        <article className="admin-kpi-card">
          <span className="admin-kpi-label">Paid orders, 30 days</span>
          <strong>{overviewStats.paidOrders30d}</strong>
          <small>{overviewStats.failedOrders30d} failed or cancelled in the same period</small>
        </article>
        <article className="admin-kpi-card">
          <span className="admin-kpi-label">Revenue, 30 days</span>
          <strong>{formatCurrency(overviewStats.revenue30d)}</strong>
          <small>Average order value: {formatCurrency(overviewStats.averageOrderValue)}</small>
        </article>
      </section>

      <section className="admin-overview-grid">
        <article className="admin-panel-card">
          <div className="admin-panel-head">
            <div>
              <p className="admin-panel-kicker">Latest registrations</p>
              <h3>Recent app users</h3>
            </div>
            <button className="admin-link-button" type="button" onClick={() => setActiveSection("users")}>
              View all users
            </button>
          </div>
          {recentUsers.length ? (
            <div className="admin-activity-list">
              {recentUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className="admin-activity-row"
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setActiveSection("users");
                  }}
                >
                  <div className="admin-activity-main">
                    <strong>{user.name || "Unnamed user"}</strong>
                    <span>{user.email || "No email provided"}</span>
                  </div>
                  <div className="admin-activity-meta">
                    <span className={`admin-tag admin-tag-${getStatusTone(user.provider)}`}>
                      {getProviderLabel(user.provider)}
                    </span>
                    <small>{formatDate(user.createdAt)}</small>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="admin-empty-card">
              <strong>No registrations yet</strong>
              <p>New app signups will appear here once users start creating accounts.</p>
            </div>
          )}
        </article>

        <article className="admin-panel-card">
          <div className="admin-panel-head">
            <div>
              <p className="admin-panel-kicker">Latest orders</p>
              <h3>Recent sales activity</h3>
            </div>
            <button className="admin-link-button" type="button" onClick={() => setActiveSection("sales")}>
              View all sales
            </button>
          </div>
          {recentOrders.length ? (
            <div className="admin-activity-list">
              {recentOrders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  className="admin-activity-row"
                  onClick={() => {
                    setSelectedOrderId(order.id);
                    setActiveSection("sales");
                  }}
                >
                  <div className="admin-activity-main">
                    <strong>{order.orderNumber}</strong>
                    <span>{order.customerName || order.userEmail || "Unassigned customer"}</span>
                  </div>
                  <div className="admin-activity-meta">
                    <span className={`admin-tag admin-tag-${getStatusTone(order.status)}`}>
                      {order.status}
                    </span>
                    <small>{formatCurrency(order.price)}</small>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="admin-empty-card">
              <strong>No sales recorded yet</strong>
              <p>Once the app starts creating server-side orders, the latest ones will show here.</p>
            </div>
          )}
        </article>
      </section>

      <section className="admin-status-strip">
        <article className="admin-status-card">
          <span className="admin-status-label">Source API</span>
          <strong>{apiBase}</strong>
        </article>
        <article className="admin-status-card">
          <span className="admin-status-label">Connection</span>
          <strong>{dashboard ? "Connected" : "Signed out"}</strong>
        </article>
        <article className="admin-status-card">
          <span className="admin-status-label">Last sync</span>
          <strong>{formatDate(lastSyncedAt)}</strong>
        </article>
      </section>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-section-stack">
      <section className="admin-filters-bar">
        <div className="admin-controls">
          <label className="admin-control-field admin-control-field-wide">
            <span>Search</span>
            <input
              value={usersQuery}
              onChange={(event) => setUsersQuery(event.target.value)}
              placeholder="Name, email, country, or user ID"
            />
          </label>
          <label className="admin-control-field">
            <span>Provider</span>
            <select
              value={usersProviderFilter}
              onChange={(event) => setUsersProviderFilter(event.target.value)}
            >
              <option value="all">All providers</option>
              {providerOptions.map((provider) => (
                <option key={provider} value={provider}>
                  {getProviderLabel(provider)}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-control-field">
            <span>Date range</span>
            <select
              value={usersDateRange}
              onChange={(event) => setUsersDateRange(event.target.value as DateRangeFilter)}
            >
              <option value="all">All time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </label>
          <label className="admin-control-field">
            <span>Sort by</span>
            <select
              value={usersSort}
              onChange={(event) => setUsersSort(event.target.value as UserSortKey)}
            >
              <option value="createdAt_desc">Newest registrations</option>
              <option value="createdAt_asc">Oldest registrations</option>
              <option value="lastLoginAt_desc">Latest login</option>
              <option value="name_asc">Name A-Z</option>
              <option value="email_asc">Email A-Z</option>
            </select>
          </label>
          <button type="button" className="admin-link-button" onClick={exportUsersCsv} disabled={!filteredUsers.length}>
            Export CSV
          </button>
          <span className="admin-filter-summary">
            Showing {filteredUsers.length} of {dashboard?.users.length ?? 0}
          </span>
        </div>
      </section>

      <section className="admin-master-detail">
        <article className="admin-panel-card">
          <div className="admin-panel-head">
            <div>
              <p className="admin-panel-kicker">Users</p>
              <h3>Registrations list</h3>
            </div>
          </div>
        {filteredUsers.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table admin-table-compact">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Provider</th>
                  <th>Country</th>
                  <th>Registered</th>
                  <th>Last login</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const isSelected = selectedUser?.id === user.id;
                  return (
                    <tr
                      key={user.id}
                      className={isSelected ? "is-selected" : ""}
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      <td>{user.name || "--"}</td>
                      <td>{user.email || "--"}</td>
                      <td>
                        <span className={`admin-tag admin-tag-${getStatusTone(user.provider)}`}>
                          {getProviderLabel(user.provider)}
                        </span>
                      </td>
                      <td>{user.country || "--"}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>{formatDate(user.lastLoginAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-card admin-empty-expanded">
            <strong>No matching users</strong>
            <p>Adjust the current search or provider filter to inspect different registrations.</p>
          </div>
        )}
        </article>

        <aside className="admin-detail-card">
          <div className="admin-detail-head">
            <p className="admin-panel-kicker">Selected user</p>
            <h3>{selectedUser?.name || "No user selected"}</h3>
            <span className="admin-detail-subtitle">
              {selectedUser?.email || "Choose a row to inspect user account details."}
            </span>
          </div>
          {selectedUser ? (
            <>
            <div className="admin-detail-summary-grid">
              <article className="admin-detail-summary-card">
                <span className="admin-status-label">Linked orders</span>
                <strong>{relatedOrdersForUser.length}</strong>
              </article>
              <article className="admin-detail-summary-card">
                <span className="admin-status-label">User spend</span>
                <strong>{formatCurrency(relatedOrdersForUser.reduce((sum, order) => sum + order.price, 0))}</strong>
              </article>
            </div>

            <dl className="admin-detail-grid">
              <div>
                <dt>Provider</dt>
                <dd>{getProviderLabel(selectedUser.provider)}</dd>
              </div>
              <div>
                <dt>Country</dt>
                <dd>{selectedUser.country || "--"}</dd>
              </div>
              <div>
                <dt>Date of birth</dt>
                <dd>{userDetails?.profile?.dob ? formatShortDate(userDetails.profile.dob) : isLoadingUserDetails ? "Loading..." : "--"}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{userDetails?.shippingAddress?.phone || (isLoadingUserDetails ? "Loading..." : "--")}</dd>
              </div>
              <div>
                <dt>Registered</dt>
                <dd>{formatDate(selectedUser.createdAt)}</dd>
              </div>
              <div className="admin-detail-block">
                <dt>Delivery address</dt>
                <dd>{isLoadingUserDetails ? "Loading..." : formatShippingAddress(userDetails?.shippingAddress || null)}</dd>
              </div>
              <div>
                <dt>Last login</dt>
                <dd>{formatDate(selectedUser.lastLoginAt)}</dd>
              </div>
              <div className="admin-detail-block">
                <dt>User ID</dt>
                <dd className="admin-copy-row">
                  <span>{selectedUser.id}</span>
                  <button type="button" className="admin-copy-button" onClick={() => handleCopy("user-id", selectedUser.id)}>
                    {copiedField === "user-id" ? "Copied" : "Copy"}
                  </button>
                </dd>
              </div>
              <div className="admin-detail-block">
                <dt>Email</dt>
                <dd className="admin-copy-row">
                  <span>{selectedUser.email || "--"}</span>
                  {selectedUser.email ? (
                    <button type="button" className="admin-copy-button" onClick={() => handleCopy("user-email", selectedUser.email)}>
                      {copiedField === "user-email" ? "Copied" : "Copy"}
                    </button>
                  ) : null}
                </dd>
              </div>
            </dl>

            <div className="admin-related-panel">
              <div className="admin-related-panel-head">
                <p className="admin-panel-kicker">Related orders</p>
                <strong>{relatedOrdersForUser.length ? "Customer history" : "No linked orders"}</strong>
              </div>
              {relatedOrdersForUser.length ? (
                <div className="admin-mini-list">
                  {relatedOrdersForUser.map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      className="admin-mini-row"
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setActiveSection("sales");
                      }}
                    >
                      <div>
                        <strong>{order.orderNumber}</strong>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="admin-mini-row-meta">
                        <span className={`admin-tag admin-tag-${getStatusTone(order.status)}`}>{order.status}</span>
                        <small>{formatCurrency(order.price)}</small>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="admin-related-note">No order records are currently linked to this user.</div>
              )}
            </div>
            </>
          ) : (
            <div className="admin-empty-card admin-empty-detail">
              <strong>No detail available</strong>
              <p>Select a user row to load their registration details.</p>
            </div>
          )}
        </aside>
      </section>
    </div>
  );

  const renderSales = () => (
    <div className="admin-section-stack">
      <section className="admin-summary-strip">
        <article className="admin-summary-card">
          <span className="admin-status-label">Paid orders</span>
          <strong>{dashboard?.stats.totalSales ?? 0}</strong>
        </article>
        <article className="admin-summary-card">
          <span className="admin-status-label">Paid revenue</span>
          <strong>{formatCurrency(dashboard?.stats.totalRevenue ?? 0)}</strong>
        </article>
        <article className="admin-summary-card">
          <span className="admin-status-label">Potential revenue</span>
          <strong>{formatCurrency(dashboard?.stats.potentialRevenue ?? 0)}</strong>
        </article>
      </section>

      <section className="admin-filters-bar">
        <div className="admin-controls">
          <label className="admin-control-field admin-control-field-wide">
            <span>Search</span>
            <input
              value={salesQuery}
              onChange={(event) => setSalesQuery(event.target.value)}
              placeholder="Order, customer, email, plan, or order ID"
            />
          </label>
          <label className="admin-control-field">
            <span>Status</span>
            <select
              value={salesStatusFilter}
              onChange={(event) => setSalesStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              {salesStatusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-control-field">
            <span>Date range</span>
            <select
              value={salesDateRange}
              onChange={(event) => setSalesDateRange(event.target.value as DateRangeFilter)}
            >
              <option value="all">All time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </label>
          <label className="admin-control-field">
            <span>Sort by</span>
            <select
              value={salesSort}
              onChange={(event) => setSalesSort(event.target.value as OrderSortKey)}
            >
              <option value="createdAt_desc">Newest orders</option>
              <option value="createdAt_asc">Oldest orders</option>
              <option value="price_desc">Highest value</option>
              <option value="price_asc">Lowest value</option>
              <option value="status_asc">Status A-Z</option>
              <option value="customer_asc">Customer A-Z</option>
            </select>
          </label>
          <button type="button" className="admin-link-button" onClick={exportOrdersCsv} disabled={!filteredOrders.length}>
            Export CSV
          </button>
          <span className="admin-filter-summary">
            Showing {filteredOrders.length} of {dashboard?.orders.length ?? 0}
          </span>
        </div>
      </section>

      <section className="admin-master-detail">
        <article className="admin-panel-card">
          <div className="admin-panel-head">
            <div>
              <p className="admin-panel-kicker">Sales</p>
              <h3>Order records</h3>
            </div>
          </div>
          {filteredOrders.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table admin-table-wide">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Plan</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <tr
                        key={order.id}
                        className={isSelected ? "is-selected" : ""}
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        <td>{order.orderNumber}</td>
                        <td>{order.customerName || order.userEmail || "--"}</td>
                        <td>{order.planLabel || order.plan}</td>
                        <td>{order.paymentMethod || "--"}</td>
                        <td>
                          <span className={`admin-tag admin-tag-${getStatusTone(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{formatCurrency(order.price)}</td>
                        <td>{formatDate(order.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-card admin-empty-expanded">
              <strong>No matching sales</strong>
              <p>Adjust the current search or status filter to inspect different order records.</p>
            </div>
          )}
        </article>

        <aside className="admin-detail-card">
          <div className="admin-detail-head">
            <p className="admin-panel-kicker">Selected sale</p>
            <h3>{selectedOrder?.orderNumber || "No sale selected"}</h3>
            <span className="admin-detail-subtitle">
              {selectedOrder?.customerName || selectedOrder?.userEmail || "Choose an order row to inspect sale details."}
            </span>
          </div>
        {selectedOrder ? (
          <>
            <div className="admin-detail-summary-grid">
              <article className="admin-detail-summary-card">
                <span className="admin-status-label">Customer orders</span>
                <strong>{orderCustomerHistory.totalOrders}</strong>
              </article>
              <article className="admin-detail-summary-card">
                <span className="admin-status-label">Customer spend</span>
                <strong>{formatCurrency(orderCustomerHistory.totalRevenue)}</strong>
              </article>
            </div>

            <dl className="admin-detail-grid">
              <div>
                <dt>Customer</dt>
                <dd>{selectedOrder.customerName || "--"}</dd>
              </div>
              <div>
                <dt>User email</dt>
                <dd>{selectedOrder.userEmail || "--"}</dd>
              </div>
              <div>
                <dt>Plan</dt>
                <dd>{selectedOrder.planLabel || selectedOrder.plan}</dd>
              </div>
              <div>
                <dt>Payment method</dt>
                <dd>{selectedOrder.paymentMethod || "--"}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{selectedOrder.status}</dd>
              </div>
              <div>
                <dt>Coupon</dt>
                <dd>{selectedOrder.couponCode || "--"}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{formatCurrency(selectedOrder.price)}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{formatDate(selectedOrder.createdAt)}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>{selectedOrder.source || "--"}</dd>
              </div>
              <div className="admin-detail-block">
                <dt>Order ID</dt>
                <dd className="admin-copy-row">
                  <span>{selectedOrder.id}</span>
                  <button type="button" className="admin-copy-button" onClick={() => handleCopy("order-id", selectedOrder.id)}>
                    {copiedField === "order-id" ? "Copied" : "Copy"}
                  </button>
                </dd>
              </div>
              <div className="admin-detail-block">
                <dt>User ID</dt>
                <dd className="admin-copy-row">
                  <span>{selectedOrder.userId || "--"}</span>
                  {selectedOrder.userId ? (
                    <button type="button" className="admin-copy-button" onClick={() => handleCopy("order-user-id", selectedOrder.userId)}>
                      {copiedField === "order-user-id" ? "Copied" : "Copy"}
                    </button>
                  ) : null}
                </dd>
              </div>
            </dl>
            {selectedOrder.status.trim().toLowerCase() === "processing" ? (
              <div className="admin-detail-actions">
                <button
                  type="button"
                  className="admin-link-button admin-link-danger"
                  onClick={() => handleMarkOrderFailed(selectedOrder.id, selectedOrder.orderNumber)}
                  disabled={isSavingOrderStatus}
                >
                  {isSavingOrderStatus ? "Updating..." : "Mark failed"}
                </button>
                <small>Unpaid orders auto-expire after 12 hours.</small>
              </div>
            ) : null}
            <div className="admin-related-panel">
              <div className="admin-related-panel-head">
                <p className="admin-panel-kicker">Customer history</p>
                <strong>{orderCustomerHistory.orders.length ? "Related orders" : "Single order record"}</strong>
              </div>
              {orderCustomerHistory.orders.length ? (
                <div className="admin-mini-list">
                  {orderCustomerHistory.orders.map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      className={`admin-mini-row${order.id === selectedOrder.id ? " is-active" : ""}`}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <div>
                        <strong>{order.orderNumber}</strong>
                        <span>{order.planLabel || order.plan}</span>
                      </div>
                      <div className="admin-mini-row-meta">
                        <span className={`admin-tag admin-tag-${getStatusTone(order.status)}`}>{order.status}</span>
                        <small>{formatCurrency(order.price)}</small>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="admin-related-note">No additional orders are linked to this customer yet.</div>
              )}
            </div>
          </>
          ) : (
            <div className="admin-empty-card admin-empty-detail">
              <strong>No detail available</strong>
              <p>Select an order row to review sale metadata and payment context.</p>
            </div>
          )}
          {selectedOrder && linkedUserForOrder ? (
            <div className="admin-related-action">
              <button
                type="button"
                className="admin-link-button"
                onClick={() => {
                  setSelectedUserId(linkedUserForOrder.id);
                  setActiveSection("users");
                }}
              >
                Open linked user
              </button>
            </div>
          ) : (
            selectedOrder && selectedOrder.userId ? (
              <div className="admin-related-note">No matching user record was found for this order.</div>
            ) : null
          )}
        </aside>
      </section>
    </div>
  );

  const renderAnalytics = () => {
    const users = dashboard?.users ?? [];
    const orders = dashboard?.orders ?? [];
    const paidOrders = orders.filter((order) => isPaidOrder(order.status));
    const conversionRate = users.length ? (paidOrders.length / users.length) * 100 : 0;
    const averageRevenuePerUser = users.length ? (dashboard?.stats.totalRevenue ?? 0) / users.length : 0;
    const returningCustomers = orders.filter((order) =>
      orders.filter((candidate) => candidate.userId && candidate.userId === order.userId).length > 1
    );
    const repeatRate = paidOrders.length ? (returningCustomers.length / paidOrders.length) * 100 : 0;
    const referredPaidOrders = paidOrders.filter((order) => order.couponCode?.trim());
    const referredRevenue = referredPaidOrders.reduce((sum, order) => sum + order.price, 0);
    const referredRevenueShare = dashboard?.stats.totalRevenue
      ? (referredRevenue / dashboard.stats.totalRevenue) * 100
      : 0;
    const paidOrderRate = orders.length ? (paidOrders.length / orders.length) * 100 : 0;

    const buildMonthlySeries = <T,>(items: T[], getTimestamp: (item: T) => number, getValue: (item: T) => number) => {
      const now = new Date();
      const buckets = Array.from({ length: 6 }, (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        return {
          key,
          label: date.toLocaleString("en-MY", { month: "short" }),
          value: 0
        };
      });

      const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));
      items.forEach((item) => {
        const date = new Date(getTimestamp(item));
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const bucket = bucketMap.get(key);
        if (bucket) bucket.value += getValue(item);
      });

      const maxValue = Math.max(...buckets.map((bucket) => bucket.value), 0);
      return buckets.map((bucket) => ({
        ...bucket,
        width: maxValue ? `${Math.max((bucket.value / maxValue) * 100, bucket.value > 0 ? 12 : 0)}%` : "0%"
      }));
    };

    const revenueTrend = buildMonthlySeries(paidOrders, (order) => order.createdAt, (order) => order.price);
    const signupTrend = buildMonthlySeries(users, (user) => user.createdAt, () => 1);

    const topPlans = Array.from(
      orders.reduce((map, order) => {
        const key = order.planLabel || order.plan;
        const current = map.get(key) || { label: key, orders: 0, revenue: 0 };
        current.orders += 1;
        if (isPaidOrder(order.status)) current.revenue += order.price;
        map.set(key, current);
        return map;
      }, new Map<string, { label: string; orders: number; revenue: number }>())
    )
      .map(([, value]) => value)
      .sort((left, right) => right.revenue - left.revenue || right.orders - left.orders)
      .slice(0, 5);

    const topCountries = Array.from(
      users.reduce((map, user) => {
        const key = user.country?.trim() || "Unknown";
        map.set(key, (map.get(key) || 0) + 1);
        return map;
      }, new Map<string, number>())
    )
      .map(([label, count]) => ({ label, count }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 5);

    const providerMix = Array.from(
      users.reduce((map, user) => {
        const key = getProviderLabel(user.provider);
        map.set(key, (map.get(key) || 0) + 1);
        return map;
      }, new Map<string, number>())
    )
      .map(([label, count]) => ({ label, count }))
      .sort((left, right) => right.count - left.count);

    const statusMix = Array.from(
      orders.reduce((map, order) => {
        const key = order.status;
        map.set(key, (map.get(key) || 0) + 1);
        return map;
      }, new Map<string, number>())
    )
      .map(([label, count]) => ({ label, count, tone: getStatusTone(label) }))
      .sort((left, right) => right.count - left.count);

    const topReferralCodes = [...referralSummaries]
      .sort((left, right) => right.monthPaidRevenue - left.monthPaidRevenue)
      .slice(0, 5);

    return (
      <div className="admin-section-stack">
        <section className="admin-kpi-grid">
          <article className="admin-kpi-card">
            <span className="admin-kpi-label">User to paid conversion</span>
            <strong>{conversionRate.toFixed(1)}%</strong>
            <small>{paidOrders.length} paid orders from {users.length} users</small>
          </article>
          <article className="admin-kpi-card">
            <span className="admin-kpi-label">Revenue per user</span>
            <strong>{formatCurrency(averageRevenuePerUser)}</strong>
            <small>Total revenue distributed across registered users</small>
          </article>
          <article className="admin-kpi-card">
            <span className="admin-kpi-label">Repeat purchase rate</span>
            <strong>{repeatRate.toFixed(1)}%</strong>
            <small>{returningCustomers.length} repeat orders detected</small>
          </article>
          <article className="admin-kpi-card">
            <span className="admin-kpi-label">Paid order rate</span>
            <strong>{paidOrderRate.toFixed(1)}%</strong>
            <small>{paidOrders.length} of {orders.length} orders reached a paid/completed state</small>
          </article>
        </section>

        <section className="admin-kpi-grid admin-kpi-grid-secondary">
          <article className="admin-kpi-card">
            <span className="admin-kpi-label">New users (7 days)</span>
            <strong>{overviewStats.newUsers7d}</strong>
            <small>{overviewStats.users30d} in last 30 days</small>
          </article>
          <article className="admin-kpi-card">
            <span className="admin-kpi-label">Paid orders (30 days)</span>
            <strong>{overviewStats.paidOrders30d}</strong>
            <small>{overviewStats.failedOrders30d} failed/cancelled</small>
          </article>
          <article className="admin-kpi-card">
            <span className="admin-kpi-label">Revenue (30 days)</span>
            <strong>{formatCurrency(overviewStats.revenue30d)}</strong>
            <small>AOV {formatCurrency(overviewStats.averageOrderValue)}</small>
          </article>
          <article className="admin-kpi-card">
            <span className="admin-kpi-label">Coupon revenue share</span>
            <strong>{referredRevenueShare.toFixed(1)}%</strong>
            <small>{formatCurrency(referredRevenue)} from orders with discount coupons</small>
          </article>
        </section>

        <section className="admin-overview-grid admin-analytics-grid">
          <article className="admin-panel-card">
            <div className="admin-panel-head">
              <div>
                <p className="admin-panel-kicker">Revenue trend</p>
                <h3>Paid revenue by month</h3>
              </div>
            </div>
            <div className="admin-analytics-series">
              {revenueTrend.map((bucket) => (
                <div key={bucket.key} className="admin-analytics-row">
                  <span>{bucket.label}</span>
                  <div className="admin-analytics-bar-track">
                    <div className="admin-analytics-bar-fill" style={{ width: bucket.width }} />
                  </div>
                  <strong>{formatCurrency(bucket.value)}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="admin-panel-card">
            <div className="admin-panel-head">
              <div>
                <p className="admin-panel-kicker">Signup trend</p>
                <h3>User registrations by month</h3>
              </div>
            </div>
            <div className="admin-analytics-series">
              {signupTrend.map((bucket) => (
                <div key={bucket.key} className="admin-analytics-row">
                  <span>{bucket.label}</span>
                  <div className="admin-analytics-bar-track">
                    <div className="admin-analytics-bar-fill admin-analytics-bar-fill-soft" style={{ width: bucket.width }} />
                  </div>
                  <strong>{bucket.value}</strong>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="admin-overview-grid admin-analytics-grid">
          <article className="admin-panel-card">
            <div className="admin-panel-head">
              <div>
                <p className="admin-panel-kicker">Product performance</p>
                <h3>Top plans by paid revenue</h3>
              </div>
            </div>
            {topPlans.length ? (
              <div className="admin-mini-list">
                {topPlans.map((plan) => (
                  <div key={plan.label} className="admin-mini-row admin-mini-row-static">
                    <div>
                      <strong>{plan.label}</strong>
                      <span>{plan.orders} orders</span>
                    </div>
                    <div className="admin-mini-row-meta">
                      <small>{formatCurrency(plan.revenue)}</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty-card">
                <strong>No plan data yet</strong>
                <p>Plan performance will appear once orders start coming through the app.</p>
              </div>
            )}
          </article>

          <article className="admin-panel-card">
            <div className="admin-panel-head">
              <div>
                <p className="admin-panel-kicker">Order quality</p>
                <h3>Status distribution</h3>
              </div>
            </div>
            {statusMix.length ? (
              <div className="admin-mini-list">
                {statusMix.map((status) => (
                  <div key={status.label} className="admin-mini-row admin-mini-row-static">
                    <div>
                      <strong>{status.label}</strong>
                      <span>{status.count} orders</span>
                    </div>
                    <div className="admin-mini-row-meta">
                      <span className={`admin-tag admin-tag-${status.tone}`}>{status.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty-card">
                <strong>No order quality data yet</strong>
                <p>Order status mix will show up once transactions are recorded.</p>
              </div>
            )}
          </article>
        </section>

        <section className="admin-overview-grid admin-analytics-grid">
          <article className="admin-panel-card">
            <div className="admin-panel-head">
              <div>
                <p className="admin-panel-kicker">Acquisition mix</p>
                <h3>Providers and top countries</h3>
              </div>
            </div>
            <div className="admin-analytics-split">
              <div className="admin-mini-list">
                {providerMix.map((provider) => (
                  <div key={provider.label} className="admin-mini-row admin-mini-row-static">
                    <div>
                      <strong>{provider.label}</strong>
                      <span>Auth provider</span>
                    </div>
                    <div className="admin-mini-row-meta">
                      <small>{provider.count} users</small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="admin-mini-list">
                {topCountries.map((country) => (
                  <div key={country.label} className="admin-mini-row admin-mini-row-static">
                    <div>
                      <strong>{country.label}</strong>
                      <span>Registered users</span>
                    </div>
                    <div className="admin-mini-row-meta">
                      <small>{country.count}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="admin-panel-card">
            <div className="admin-panel-head">
              <div>
                <p className="admin-panel-kicker">Referral leaders</p>
                <h3>Top codes this month</h3>
              </div>
            </div>
            {topReferralCodes.length ? (
              <div className="admin-mini-list">
                {topReferralCodes.map((referral) => (
                  <div key={referral.code} className="admin-mini-row admin-mini-row-static">
                    <div>
                      <strong>{referral.agentName || referral.agentEmail || referral.code}</strong>
                      <span>{referral.code}</span>
                    </div>
                    <div className="admin-mini-row-meta">
                      <small>{formatCurrency(referral.monthPaidRevenue)}</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty-card">
                <strong>No referral leaders yet</strong>
                <p>Top agent codes will appear here once referred paid orders start coming in.</p>
              </div>
            )}
          </article>
        </section>
      </div>
    );
  };

  const renderAgents = () => {
    const selectedAgent = agentInsights.selectedAgent;
    const topAgent = agentInsights.rows[0] || null;

    return (
      <div className="admin-section-stack">
        <section className="admin-panel-card">
          <div className="admin-panel-head">
            <div>
              <p className="admin-panel-kicker">Agent workspace</p>
              <h3>Agent performance and code management</h3>
              <p className="admin-panel-copy">
                Keep agent codes, renewals, attributed revenue, and user activity in one cleaner workspace.
              </p>
            </div>
            <div className="admin-segmented-control" role="tablist" aria-label="Agent workspace views">
              <button
                type="button"
                className={`admin-segmented-button${agentWorkspaceTab === "directory" ? " is-active" : ""}`}
                onClick={() => setAgentWorkspaceTab("directory")}
              >
                Agent directory
              </button>
              <button
                type="button"
                className={`admin-segmented-button${agentWorkspaceTab === "create" ? " is-active" : ""}`}
                onClick={() => setAgentWorkspaceTab("create")}
              >
                Create code
              </button>
            </div>
          </div>
        </section>

        {agentWorkspaceTab === "create" ? (
          <section className="admin-panel-card">
            <div className="admin-panel-head">
              <div>
                <p className="admin-panel-kicker">Create code</p>
                <h3>Issue an agent access code</h3>
                <p className="admin-panel-copy">
                  Choose what the code unlocks at redemption time. Contact details are optional and attribution remains attached to that agent after redemption.
                </p>
              </div>
            </div>
            <div className="admin-detail-summary-grid admin-create-code-summary">
              <article className="admin-detail-summary-card">
                <span className="admin-status-label">Plus</span>
                <strong>1 month</strong>
                <small>Good for regular agent-led trials.</small>
              </article>
              <article className="admin-detail-summary-card">
                <span className="admin-status-label">Pro</span>
                <strong>1 month</strong>
                <small>Unlocks higher report allowance during the access period.</small>
              </article>
              <article className="admin-detail-summary-card">
                <span className="admin-status-label">SuperAdmin</span>
                <strong>Unlimited testing</strong>
                <small>Internal admin testing access without report limits.</small>
              </article>
            </div>
            <div className="admin-controls admin-controls-roomy">
              <label className="admin-control-field">
                <span>Code</span>
                <input value={newAgentCode} onChange={(event) => setNewAgentCode(event.target.value.toUpperCase())} placeholder="e.g. AGENT01" />
              </label>
              <label className="admin-control-field">
                <span>Code type</span>
                <select value={newAgentCodeType} onChange={(event) => setNewAgentCodeType(event.target.value as AgentCodeType)}>
                  <option value="plus">Plus</option>
                  <option value="pro">Pro</option>
                  <option value="superadmin">SuperAdmin</option>
                </select>
              </label>
              <label className="admin-control-field">
                <span>Agent name</span>
                <input value={newAgentName} onChange={(event) => setNewAgentName(event.target.value)} placeholder="Optional" />
              </label>
              <label className="admin-control-field">
                <span>Agent email</span>
                <input value={newAgentEmail} onChange={(event) => setNewAgentEmail(event.target.value)} placeholder="Optional" />
              </label>
              <label className="admin-control-field">
                <span>Phone number</span>
                <input value={newAgentPhone} onChange={(event) => setNewAgentPhone(event.target.value)} placeholder="Optional" />
              </label>
              <button type="button" className="admin-submit-button" onClick={handleCreateReferralAgent} disabled={isSavingAgent}>
                {isSavingAgent ? "Creating..." : `Create ${formatAgentCodeTypeLabel(newAgentCodeType)} code`}
              </button>
            </div>
          </section>
        ) : null}

        {agentWorkspaceTab === "directory" ? (
          <>
            <section className="admin-kpi-grid">
              <article className="admin-kpi-card">
                <span className="admin-kpi-label">Codes created</span>
                <strong>{dashboard?.referralAgents.length ?? 0}</strong>
                <small>All issued agent access codes.</small>
              </article>
              <article className="admin-kpi-card">
                <span className="admin-kpi-label">Total redemptions</span>
                <strong>{agentInsights.totalRedemptions}</strong>
                <small>Users who redeemed an agent access code.</small>
              </article>
              <article className="admin-kpi-card">
                <span className="admin-kpi-label">Tracked revenue</span>
                <strong>{formatCurrency(agentInsights.rows.reduce((sum, agent) => sum + agent.totalRevenue, 0))}</strong>
                <small>Subscriptions and paid supplement orders in the selected period.</small>
              </article>
              <article className="admin-kpi-card">
                <span className="admin-kpi-label">Top agent this period</span>
                <strong>{topAgent?.name || topAgent?.code || "--"}</strong>
                <small>{topAgent ? formatCurrency(topAgent.totalRevenue) : "No revenue yet"}</small>
              </article>
            </section>

            <section className="admin-panel-card">
              <div className="admin-panel-head">
                <div>
                  <p className="admin-panel-kicker">Agent directory</p>
                  <h3>Sort and select an agent</h3>
                </div>
              </div>
              <section className="admin-filters-bar">
                <div className="admin-controls">
                  <label className="admin-control-field admin-control-field-wide">
                    <span>Search</span>
                    <input value={agentQuery} onChange={(event) => setAgentQuery(event.target.value)} placeholder="Code, name, email, or phone" />
                  </label>
                  <label className="admin-control-field">
                    <span>Period</span>
                    <select value={agentDateRange} onChange={(event) => setAgentDateRange(event.target.value as DateRangeFilter)}>
                      <option value="all">All time</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="365d">Last 12 months</option>
                      <option value="7d">Last 7 days</option>
                      <option value="custom">Custom range</option>
                    </select>
                  </label>
                  {agentDateRange === "custom" ? (
                    <>
                      <label className="admin-control-field">
                        <span>Start date</span>
                        <input type="date" value={agentDateStart} onChange={(event) => setAgentDateStart(event.target.value)} />
                      </label>
                      <label className="admin-control-field">
                        <span>End date</span>
                        <input type="date" value={agentDateEnd} onChange={(event) => setAgentDateEnd(event.target.value)} />
                      </label>
                    </>
                  ) : null}
                  <label className="admin-control-field">
                    <span>Sort</span>
                    <select value={agentSort} onChange={(event) => setAgentSort(event.target.value as AgentSortKey)}>
                      <option value="totalRevenue_desc">Total revenue</option>
                      <option value="subscriptionRevenue_desc">Subscription revenue</option>
                      <option value="orderRevenue_desc">Supplement revenue</option>
                      <option value="latestActivity_desc">Latest activity</option>
                      <option value="redemptions_desc">Redemptions</option>
                      <option value="createdAt_desc">Newest code</option>
                    </select>
                  </label>
                </div>
              </section>
              {agentInsights.rows.length ? (
                <div className="admin-table-wrap">
                  <table className="admin-table admin-table-wide">
                    <thead>
                      <tr>
                        <th>Agent</th>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Contact</th>
                        <th>Redeemed</th>
                        <th>Converted</th>
                        <th>Active paid</th>
                        <th>Sub revenue</th>
                        <th>Order revenue</th>
                        <th>Total revenue</th>
                        <th>Latest activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentInsights.rows.map((agent) => (
                        <tr
                          key={agent.id}
                          className={selectedAgent?.id === agent.id && isAgentModalOpen ? "is-selected" : ""}
                          onClick={() => {
                            setSelectedAgentId(agent.id);
                            setAgentDetailTab("summary");
                            setIsAgentModalOpen(true);
                          }}
                        >
                          <td>
                            <strong>{agent.name || "--"}</strong>
                            <br />
                            <small>{agent.attributedUsers} attributed users</small>
                          </td>
                          <td>{agent.code}</td>
                          <td>{formatAgentCodeTypeLabel(agent.codeType)}</td>
                          <td>{agent.email || agent.phone || "--"}</td>
                          <td>{agent.redemptionsInRange}</td>
                          <td>{agent.convertedUsers}</td>
                          <td>{agent.activePaidUsers}</td>
                          <td>{formatCurrency(agent.subscriptionRevenue)}</td>
                          <td>{formatCurrency(agent.orderRevenue)}</td>
                          <td>{formatCurrency(agent.totalRevenue)}</td>
                          <td>{formatDate(agent.latestActivityAt || null)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="admin-empty-card">
                  <strong>No agent codes yet</strong>
                  <p>Create a code to start tracking redemptions, renewals, and attributed orders.</p>
                </div>
              )}
            </section>

            {selectedAgent && isAgentModalOpen ? (
              <div className="admin-agent-modal-backdrop" onClick={() => setIsAgentModalOpen(false)} role="presentation">
                <div
                  className="admin-agent-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="agent-modal-title"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="admin-detail-head">
                    <div>
                      <p className="admin-panel-kicker">Agent profile</p>
                      <h3 id="agent-modal-title">{selectedAgent.name || selectedAgent.code}</h3>
                      <span className="admin-detail-subtitle">
                        {formatAgentCodeTypeLabel(selectedAgent.codeType)} code - {selectedAgent.code} - {selectedAgent.email || selectedAgent.phone || "No contact details"}
                      </span>
                    </div>
                    <div className="admin-detail-actions">
                      <button type="button" className="admin-copy-button" onClick={() => handleCopy(`agent-${selectedAgent.id}`, selectedAgent.code)}>
                        {copiedField === `agent-${selectedAgent.id}` ? "Copied" : "Copy code"}
                      </button>
                      <button type="button" className="admin-copy-button" onClick={() => handleDeleteReferralAgent(selectedAgent.id, selectedAgent.code)}>
                        Delete
                      </button>
                      <button type="button" className="admin-copy-button" onClick={() => setIsAgentModalOpen(false)}>
                        Close
                      </button>
                    </div>
                  </div>

                  <div className="admin-segmented-control" role="tablist" aria-label="Selected agent detail views">
                    <button
                      type="button"
                      className={`admin-segmented-button${agentDetailTab === "summary" ? " is-active" : ""}`}
                      onClick={() => setAgentDetailTab("summary")}
                    >
                      Summary
                    </button>
                    <button
                      type="button"
                      className={`admin-segmented-button${agentDetailTab === "users" ? " is-active" : ""}`}
                      onClick={() => setAgentDetailTab("users")}
                    >
                      Users
                    </button>
                    <button
                      type="button"
                      className={`admin-segmented-button${agentDetailTab === "timeline" ? " is-active" : ""}`}
                      onClick={() => setAgentDetailTab("timeline")}
                    >
                      Activity
                    </button>
                  </div>

                  {agentDetailTab === "summary" ? (
                    <>
                      <div className="admin-detail-summary-grid">
                        <article className="admin-detail-summary-card">
                          <span className="admin-status-label">Attributed users</span>
                          <strong>{selectedAgent.attributedUsers}</strong>
                        </article>
                        <article className="admin-detail-summary-card">
                          <span className="admin-status-label">Total revenue</span>
                          <strong>{formatCurrency(selectedAgent.totalRevenue)}</strong>
                        </article>
                        <article className="admin-detail-summary-card">
                          <span className="admin-status-label">Subscription revenue</span>
                          <strong>{formatCurrency(selectedAgent.subscriptionRevenue)}</strong>
                        </article>
                        <article className="admin-detail-summary-card">
                          <span className="admin-status-label">Supplement revenue</span>
                          <strong>{formatCurrency(selectedAgent.orderRevenue)}</strong>
                        </article>
                      </div>
                      <dl className="admin-detail-grid">
                        <div>
                          <dt>Redeemed users</dt>
                          <dd>{selectedAgent.redemptionsInRange}</dd>
                        </div>
                        <div>
                          <dt>Converted users</dt>
                          <dd>{selectedAgent.convertedUsers}</dd>
                        </div>
                        <div>
                          <dt>Active paid now</dt>
                          <dd>{selectedAgent.activePaidUsers}</dd>
                        </div>
                        <div>
                          <dt>Trial users active</dt>
                          <dd>{selectedAgent.activeTrials}</dd>
                        </div>
                        <div>
                          <dt>Renewals</dt>
                          <dd>{selectedAgent.renewalCount}</dd>
                        </div>
                        <div>
                          <dt>First payments</dt>
                          <dd>{formatCurrency(selectedAgent.firstPaymentRevenue)}</dd>
                        </div>
                        <div>
                          <dt>Renewal revenue</dt>
                          <dd>{formatCurrency(selectedAgent.renewalRevenue)}</dd>
                        </div>
                        <div>
                          <dt>Paid orders</dt>
                          <dd>{selectedAgent.paidOrderCount}</dd>
                        </div>
                        <div>
                          <dt>Code created</dt>
                          <dd>{formatDate(selectedAgent.createdAt)}</dd>
                        </div>
                        <div>
                          <dt>Latest activity</dt>
                          <dd>{formatDate(selectedAgent.latestActivityAt || null)}</dd>
                        </div>
                      </dl>
                    </>
                  ) : null}

                  {agentDetailTab === "users" ? (
                    agentInsights.selectedUsers.length ? (
                      <div className="admin-table-wrap">
                        <table className="admin-table admin-table-wide">
                          <thead>
                            <tr>
                              <th>User</th>
                              <th>Redeemed</th>
                              <th>Current tier</th>
                              <th>First paid</th>
                              <th>Last renewal</th>
                              <th>Subscription rev</th>
                              <th>Paid orders</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {agentInsights.selectedUsers.map((user) => (
                              <tr key={`${selectedAgent.id}-${user.userId}`}>
                                <td>
                                  <strong>{user.name || user.email || user.userId}</strong>
                                  <br />
                                  <small>{user.email || user.country || user.userId}</small>
                                </td>
                                <td>{formatDate(user.redeemedAt)}</td>
                                <td>{user.currentTier.toUpperCase()}</td>
                                <td>{formatDate(user.firstPaidAt)}</td>
                                <td>{formatDate(user.lastRenewalAt)}</td>
                                <td>{formatCurrency(user.subscriptionRevenue)}</td>
                                <td>{user.orderCount}</td>
                                <td>{formatCurrency(user.totalRevenue)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="admin-empty-card">
                        <strong>No attributed users yet</strong>
                        <p>Once people redeem this code, their renewals and purchases will appear here.</p>
                      </div>
                    )
                  ) : null}

                  {agentDetailTab === "timeline" ? (
                    agentInsights.selectedTimeline.length ? (
                      <div className="admin-mini-list">
                        {agentInsights.selectedTimeline.map((event) => (
                          <div key={event.id} className="admin-mini-row admin-mini-row-static">
                            <div>
                              <strong>{event.label}</strong>
                              <span>{event.meta}</span>
                            </div>
                            <div className="admin-mini-row-meta">
                              <span>{formatDate(event.occurredAt)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="admin-empty-card">
                        <strong>No tracked activity yet</strong>
                        <p>We'll start filling this once a user redeems the code or Stripe sends billing activity.</p>
                      </div>
                    )
                  ) : null}
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    );
  };

  const renderCodes = () => {
    return (
      <div className="admin-section-stack">
        <section className="admin-panel-card">
          <div className="admin-panel-head">
            <div>
              <p className="admin-panel-kicker">Referral codes</p>
              <h3>Create new code</h3>
            </div>
          </div>
          <div className="admin-controls">
            <label className="admin-control-field">
              <span>Code</span>
              <input
                value={newAgentCode}
                onChange={(event) => setNewAgentCode(event.target.value)}
                placeholder="ORFD26"
              />
            </label>
            <label className="admin-control-field">
              <span>Agent name</span>
              <input
                value={newAgentName}
                onChange={(event) => setNewAgentName(event.target.value)}
                placeholder="Agent name (optional)"
              />
            </label>
            <label className="admin-control-field">
              <span>Agent email</span>
              <input
                value={newAgentEmail}
                onChange={(event) => setNewAgentEmail(event.target.value)}
                placeholder="name@example.com (optional)"
              />
            </label>
            <button
              type="button"
              className="admin-submit-button"
              onClick={handleCreateReferralAgent}
              disabled={isSavingAgent || !newAgentCode.trim()}
              style={{ alignSelf: "end" }}
            >
              {isSavingAgent ? "Creating..." : "Create code"}
            </button>
          </div>
        </section>

        <section className="admin-panel-card">
          <div className="admin-panel-head">
            <div>
              <p className="admin-panel-kicker">Managed codes</p>
              <h3>Issued referral codes</h3>
            </div>
          </div>
          <section className="admin-filters-bar">
            <div className="admin-controls">
              <label className="admin-control-field admin-control-field-wide">
                <span>Search code</span>
                <input
                  value={codeQuery}
                  onChange={(event) => setCodeQuery(event.target.value)}
                  placeholder="Code, agent, or email"
                />
              </label>
              <label className="admin-control-field">
                <span>Sort by</span>
                <select
                  value={codeSort}
                  onChange={(event) => setCodeSort(event.target.value as CodeSortKey)}
                >
                  <option value="createdAt_desc">Newest</option>
                  <option value="createdAt_asc">Oldest</option>
                  <option value="code_asc">Code A-Z</option>
                </select>
              </label>
              <span className="admin-filter-summary">
                Showing {referralCodeRows.length}
              </span>
            </div>
          </section>
          {referralCodeRows.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Agent</th>
                    <th>Email</th>
                    <th>Source</th>
                    <th>Total orders</th>
                    <th>Paid revenue</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {referralCodeRows.map((row) => (
                    <tr key={`${row.source}-${row.id}-${row.code}`}>
                      <td>{row.code}</td>
                      <td>{row.name || "--"}</td>
                      <td>{row.email || "--"}</td>
                      <td>{row.source === "managed" ? "Managed" : "User"}</td>
                      <td>{row.totalOrders}</td>
                      <td>{formatCurrency(row.paidRevenue)}</td>
                      <td>{formatDate(row.createdAt)}</td>
                      <td>
                        {row.source === "managed" ? (
                          <button
                            type="button"
                            className="admin-link-button"
                            onClick={() => handleDeleteReferralAgent(row.id, row.code)}
                            disabled={isSavingAgent}
                          >
                            Delete
                          </button>
                        ) : (
                          "--"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-card">
              <strong>No referral codes yet</strong>
              <p>Create your first agent code to start tracking referred sales.</p>
            </div>
          )}
        </section>

        {renderCoupons()}
      </div>
    );
  };

  if (!isSignedIn) {
    return (
      <main
        className="admin-content-auth-only"
        style={{ minHeight: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <section
          className="admin-login-layout"
          style={{ width: "100%", display: "grid", placeItems: "center", padding: "2rem" }}
        >
          <article className="admin-login-panel" style={{ width: "min(100%, 520px)" }}>
            <div className="admin-login-panel-head">
              <h3>Admin login</h3>
            </div>

            <form className="admin-login-form" onSubmit={handleSubmit}>
              <label className="admin-input-field">
                <span>Username</span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  placeholder="Enter username"
                />
              </label>

              <label className="admin-input-field">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter password"
                />
              </label>

              <label className="admin-input-field">
                <span>Security check: {captchaLeft} + {captchaRight} = ?</span>
                <input
                  inputMode="numeric"
                  value={captchaInput}
                  onChange={(event) => setCaptchaInput(event.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="Enter answer"
                />
              </label>

              {error ? <p className="admin-inline-error">{error}</p> : null}

              <button className="admin-submit-button" type="submit" disabled={!canSubmit || isLoading}>
                {isLoading ? "Checking access..." : "Sign in"}
              </button>
            </form>
          </article>
        </section>
      </main>
    );
  }

  return (
    <div className="admin-workspace">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-brand-block">
            <div>
              <p className="admin-brand-eyebrow">RichAI</p>
              <h1 className="admin-brand-title">Admin</h1>
              <p className="admin-brand-copy">Operational access for registrations, order records, and app activity.</p>
            </div>
          </div>

          <nav className="admin-nav" aria-label="Admin sections">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const disabled = !isSignedIn;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`admin-nav-item${isActive ? " is-active" : ""}`}
                  onClick={() => {
                    if (disabled) return;
                    setActiveSection(item.id);
                  }}
                  disabled={disabled}
                >
                  <span className="admin-nav-copy">
                    <strong>{item.label}</strong>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-side-actions">
            <button
              className="admin-side-button"
              type="button"
              onClick={handleRefresh}
              disabled={!isSignedIn || isLoading}
            >
              Refresh data
            </button>
            <button
              className="admin-side-button"
              type="button"
              onClick={handleLogout}
              disabled={!isSignedIn}
            >
              Log out
            </button>
            <a className="admin-side-link" href="/">
              Back to site
            </a>
          </div>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-content-header">
          <div className="admin-title-group">
            <p className="admin-content-kicker">{sectionMeta.kicker}</p>
            <div className="admin-title-row">
              <h2>{isSignedIn ? sectionMeta.title : "Admin access"}</h2>
              <span className="admin-title-badge">{isSignedIn ? sectionMeta.badge : "Protected route"}</span>
            </div>
            <p className="admin-content-copy">
              {isSignedIn
                ? sectionMeta.description
                : "Sign in with your admin credentials to access registrations, sales, and operational reporting from the app service."}
            </p>
          </div>

          <div className="admin-toolbar">
            <div className="admin-toolbar-card">
              <span>{isSignedIn ? sectionMeta.timestampLabel : "API source"}</span>
              <strong>{isSignedIn ? sectionMeta.timestampValue : apiBase}</strong>
            </div>
            <div className="admin-toolbar-card">
              <span>Connection</span>
              <strong>{isLoading ? "Loading..." : isSignedIn ? "Connected" : "Not connected"}</strong>
            </div>
          </div>
        </header>

        {flashMessage ? <div className="admin-flash-message">{flashMessage}</div> : null}
        {isSignedIn && error ? <div className="admin-inline-warning">{error}</div> : null}
        {isSignedIn ? (
          <section className="admin-lookup-bar">
            <label className="admin-lookup-field">
              <span>Global lookup</span>
              <input
                value={globalLookupQuery}
                onChange={(event) => setGlobalLookupQuery(event.target.value)}
                placeholder="Search users, emails, order numbers, plans, or IDs"
              />
            </label>
            {globalLookupQuery.trim() ? (
              <div className="admin-lookup-results">
                {globalLookupResults.length ? (
                  globalLookupResults.map((result) => (
                    <button
                      key={result.key}
                      type="button"
                      className="admin-lookup-result"
                      onClick={() => openLookupResult(result)}
                    >
                      <div>
                        <strong>{result.title}</strong>
                        <span>{result.subtitle}</span>
                      </div>
                      <div className="admin-lookup-meta">
                        <span className="admin-tag admin-tag-neutral">{result.type}</span>
                        <small>{result.meta}</small>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="admin-empty-card">
                    <strong>No matches found</strong>
                    <p>Try a user email, order number, plan name, or internal ID.</p>
                  </div>
                )}
              </div>
            ) : null}
          </section>
        ) : null}

        {!isSignedIn ? (
          <section className="admin-login-layout">
            <article className="admin-login-panel">
              <div className="admin-login-panel-head">
                <p className="admin-panel-kicker">Protected access</p>
                <h3>Sign in to unlock the control room</h3>
                <p>
                  The website does not store app data. It only fetches operational data from the app service after successful admin authentication.
                </p>
              </div>

              <form className="admin-login-form" onSubmit={handleSubmit}>
                <label className="admin-input-field">
                  <span>Username</span>
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                    placeholder="Enter admin username"
                  />
                </label>

                <label className="admin-input-field">
                  <span>Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter admin password"
                  />
                </label>

                {error ? <p className="admin-inline-error">{error}</p> : null}

                <button className="admin-submit-button" type="submit" disabled={!canSubmit || isLoading}>
                  {isLoading ? "Checking access..." : "Open dashboard"}
                </button>
              </form>
            </article>

            <article className="admin-login-note">
              <p className="admin-panel-kicker">What becomes available</p>
              <h3>Live operational visibility</h3>
              <div className="admin-note-list">
                <div className="admin-note-item">
                  <strong>Registrations</strong>
                  <span>Inspect app signups, providers, countries, and latest login activity.</span>
                </div>
                <div className="admin-note-item">
                  <strong>Sales</strong>
                  <span>Track order creation, payment method choice, order status, and revenue totals.</span>
                </div>
                <div className="admin-note-item">
                  <strong>Refreshable sync</strong>
                  <span>Reload the app admin feed without leaving the panel.</span>
                </div>
              </div>
            </article>
          </section>
        ) : (
          <div className="admin-main-body">
            {activeSection === "overview" && renderOverview()}
            {activeSection === "users" && renderUsers()}
            {activeSection === "sales" && renderSales()}
            {activeSection === "agents" && renderAgents()}
            {activeSection === "coupons" && renderCoupons()}
            {activeSection === "codes" && renderCodes()}
            {activeSection === "analytics" && renderAnalytics()}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPage;
