import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

interface AdminUser {
  id: string;
  email: string | null;
  name: string | null;
  provider: string;
  country?: string | null;
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

interface AdminOverview {
  stats: {
    totalUsers: number;
    totalSales: number;
    totalRevenue: number;
    latestUserAt: number | null;
    latestSaleAt: number | null;
  };
  users: AdminUser[];
  orders: AdminOrder[];
}

type AdminSection = "overview" | "users" | "sales";
type FetchStatus = "idle" | "restored" | "authenticated" | "refresh_failed" | "expired";
type DateRangeFilter = "all" | "7d" | "30d" | "90d";
type UserSortKey = "createdAt_desc" | "createdAt_asc" | "lastLoginAt_desc" | "name_asc" | "email_asc";
type OrderSortKey = "createdAt_desc" | "createdAt_asc" | "price_desc" | "price_asc" | "status_asc" | "customer_asc";

const apiBase = (import.meta.env.VITE_APP_API_URL || "/api").replace(/\/$/, "");
const directApiBase = (import.meta.env.VITE_ADMIN_DIRECT_API_URL || "https://healthai.up.railway.app/api").replace(/\/$/, "");
const NAV_ITEMS: Array<{ id: AdminSection; label: string; shortLabel: string; description: string }> = [
  { id: "overview", label: "Overview", shortLabel: "OV", description: "Key operational snapshot" },
  { id: "users", label: "Users", shortLabel: "US", description: "App registrations and account activity" },
  { id: "sales", label: "Sales", shortLabel: "SA", description: "Orders, revenue, and payment status" }
];

const encodeBasicAuth = (username: string, password: string) =>
  `Basic ${window.btoa(`${username}:${password}`)}`;

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

const getDateRangeThreshold = (range: DateRangeFilter) => {
  if (range === "all") return null;

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  return Date.now() - days * 24 * 60 * 60 * 1000;
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
  const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const retryableStatuses = new Set([404, 405, 429, 500, 502, 503, 504]);

  const requestViaBroker = () =>
    fetch(`${apiBase}/admin/overview-auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: nextUsername, password: nextPassword })
    });

  const requestDirect = () =>
    fetch(`${apiBase}/admin/overview`, {
      headers: {
        Authorization: encodeBasicAuth(nextUsername, nextPassword)
      }
    });

  const requestDirectUpstream = () =>
    fetch(`${directApiBase}/admin/overview`, {
      headers: {
        Authorization: encodeBasicAuth(nextUsername, nextPassword)
      }
    });

  const strategies: Array<() => Promise<Response>> = [
    requestViaBroker,
    requestDirect,
    requestDirectUpstream,
    requestViaBroker,
    requestDirect,
    requestDirectUpstream
  ];
  let lastResponse: Response | null = null;
  let lastError: unknown = null;

  for (let index = 0; index < strategies.length; index += 1) {
    try {
      const response = await strategies[index]();
      lastResponse = response;

      if (!retryableStatuses.has(response.status)) {
        return response;
      }
    } catch (error) {
      lastError = error;
    }

    if (index < strategies.length - 1) {
      await wait(250 + index * 150);
    }
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw lastError instanceof Error ? lastError : new TypeError("Unable to reach the admin service.");
};

function AdminPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [captchaLeft, setCaptchaLeft] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaRight, setCaptchaRight] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaInput, setCaptchaInput] = useState("");
  const [dashboard, setDashboard] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<FetchStatus>("idle");
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
  const [globalLookupQuery, setGlobalLookupQuery] = useState("");
  const [copiedField, setCopiedField] = useState("");

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
    options?: { preserveSection?: boolean; restoredSession?: boolean }
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
        throw new Error(
          authFailure ? "Invalid admin username or password." : "Unable to load dashboard."
        );
      }

      setDashboard(payload as AdminOverview);
      setLastSyncedAt(Date.now());
      setSelectedUserId((payload as AdminOverview).users[0]?.id || null);
      setSelectedOrderId((payload as AdminOverview).orders[0]?.id || null);
      setStatus(options?.restoredSession ? "restored" : "authenticated");
      setFlashMessage(
        options?.restoredSession
          ? "Restored your admin session."
          : "Dashboard synced successfully."
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
        setLastSyncedAt(null);
        setStatus("expired");
      } else if (!dashboard) {
        setSelectedUserId(null);
        setSelectedOrderId(null);
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
    if (!copiedField) return;

    const timeout = window.setTimeout(() => setCopiedField(""), 1800);
    return () => window.clearTimeout(timeout);
  }, [copiedField]);

  useEffect(() => {
    if (!flashMessage) return;

    const timeout = window.setTimeout(() => setFlashMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [flashMessage]);

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
    setPassword("");
    setDashboard(null);
    setError("");
    setStatus("idle");
    setFlashMessage("Signed out of the admin console.");
    setSelectedUserId(null);
    setSelectedOrderId(null);
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
      ["Order ID", "Order Number", "Customer", "User Email", "User ID", "Plan", "Payment Method", "Status", "Total", "Created", "Source"],
      ...filteredOrders.map((order) => [
        order.id,
        order.orderNumber,
        order.customerName || "",
        order.userEmail || "",
        order.userId || "",
        order.planLabel || order.plan,
        order.paymentMethod || "",
        order.status,
        order.price,
        formatDate(order.createdAt),
        order.source || ""
      ])
    ]);
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
          <span className="admin-kpi-label">Total sales</span>
          <strong>{dashboard?.stats.totalSales ?? 0}</strong>
          <small>Latest sale: {formatDate(dashboard?.stats.latestSaleAt ?? null)}</small>
        </article>
        <article className="admin-kpi-card">
          <span className="admin-kpi-label">Revenue tracked</span>
          <strong>{formatCurrency(dashboard?.stats.totalRevenue ?? 0)}</strong>
          <small>Current app-side order records</small>
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
    <section className="admin-master-detail">
      <article className="admin-panel-card">
        <div className="admin-panel-head admin-panel-head-tight">
          <div>
            <p className="admin-panel-kicker">Users</p>
            <h3>Registrations list</h3>
          </div>
          <div className="admin-controls">
            <label className="admin-control-field">
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
        </div>
        {filteredUsers.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
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
                <dt>Registered</dt>
                <dd>{formatDate(selectedUser.createdAt)}</dd>
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
  );

  const renderSales = () => (
    <div className="admin-section-stack">
      <section className="admin-summary-strip">
        <article className="admin-summary-card">
          <span className="admin-status-label">Total orders</span>
          <strong>{dashboard?.stats.totalSales ?? 0}</strong>
        </article>
        <article className="admin-summary-card">
          <span className="admin-status-label">Revenue</span>
          <strong>{formatCurrency(dashboard?.stats.totalRevenue ?? 0)}</strong>
        </article>
      </section>

      <section className="admin-master-detail">
        <article className="admin-panel-card">
          <div className="admin-panel-head admin-panel-head-tight">
            <div>
              <p className="admin-panel-kicker">Sales</p>
              <h3>Order records</h3>
            </div>
            <div className="admin-controls">
              <label className="admin-control-field">
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
          </div>
          {filteredOrders.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
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
                    <small>{item.description}</small>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          {isSignedIn ? (
            <div className="admin-session-card">
              <span className="admin-status-label">Signed in as</span>
              <strong>{username.trim() || "admin"}</strong>
              <small>{status === "restored" ? "Session restored from this browser." : "Session stored for this browser session."}</small>
            </div>
          ) : null}
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
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPage;
