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

const STORAGE_KEY = "richai_admin_credentials";
const apiBase = (import.meta.env.VITE_APP_API_URL || "https://healthai.up.railway.app").replace(/\/$/, "");
const NAV_ITEMS: Array<{ id: AdminSection; label: string; shortLabel: string; description: string }> = [
  { id: "overview", label: "Overview", shortLabel: "OV", description: "Key operational snapshot" },
  { id: "users", label: "Users", shortLabel: "US", description: "App registrations and account activity" },
  { id: "sales", label: "Sales", shortLabel: "SA", description: "Orders, revenue, and payment status" }
];

const encodeBasicAuth = (username: string, password: string) =>
  `Basic ${window.btoa(`${username}:${password}`)}`;

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

function AdminPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [dashboard, setDashboard] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  const recentUsers = useMemo(() => dashboard?.users.slice(0, 5) || [], [dashboard]);
  const recentOrders = useMemo(() => dashboard?.orders.slice(0, 5) || [], [dashboard]);

  const selectedUser = useMemo(() => {
    if (!dashboard?.users.length) return null;
    return (
      dashboard.users.find((user) => user.id === selectedUserId) ||
      dashboard.users[0] ||
      null
    );
  }, [dashboard, selectedUserId]);

  const selectedOrder = useMemo(() => {
    if (!dashboard?.orders.length) return null;
    return (
      dashboard.orders.find((order) => order.id === selectedOrderId) ||
      dashboard.orders[0] ||
      null
    );
  }, [dashboard, selectedOrderId]);

  const sectionMeta = getSectionMeta(activeSection, dashboard, lastSyncedAt);
  const isSignedIn = Boolean(dashboard);
  const canSubmit = username.trim().length > 0 && password.trim().length > 0;

  const fetchDashboard = async (
    nextUsername: string,
    nextPassword: string,
    options?: { preserveSection?: boolean }
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBase}/api/admin/overview`, {
        headers: {
          Authorization: encodeBasicAuth(nextUsername, nextPassword)
        }
      });

      const payload = (await response.json().catch(() => null)) as AdminOverview | { error?: string } | null;
      if (!response.ok || !payload || ("error" in payload && typeof payload.error === "string")) {
        throw new Error(
          payload && "error" in payload && payload.error === "admin_auth_required"
            ? "Invalid admin username or password."
            : "Unable to load dashboard."
        );
      }

      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ username: nextUsername, password: nextPassword })
      );
      setDashboard(payload as AdminOverview);
      setLastSyncedAt(Date.now());
      setSelectedUserId((payload as AdminOverview).users[0]?.id || null);
      setSelectedOrderId((payload as AdminOverview).orders[0]?.id || null);
      if (!options?.preserveSection) {
        setActiveSection("overview");
      }
    } catch (nextError) {
      setDashboard(null);
      setSelectedUserId(null);
      setSelectedOrderId(null);
      setError(nextError instanceof Error ? nextError.message : "Unable to load dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as { username?: string; password?: string };
      if (parsed.username) setUsername(parsed.username);
      if (parsed.password) {
        setPassword(parsed.password);
        void fetchDashboard(parsed.username || "admin", parsed.password, { preserveSection: true });
      }
    } catch {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (dashboard?.users.length && !dashboard.users.some((user) => user.id === selectedUserId)) {
      setSelectedUserId(dashboard.users[0].id);
    }
  }, [dashboard, selectedUserId]);

  useEffect(() => {
    if (dashboard?.orders.length && !dashboard.orders.some((order) => order.id === selectedOrderId)) {
      setSelectedOrderId(dashboard.orders[0].id);
    }
  }, [dashboard, selectedOrderId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetchDashboard(username.trim(), password);
  };

  const handleRefresh = () => {
    void fetchDashboard(username.trim(), password, { preserveSection: true });
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setPassword("");
    setDashboard(null);
    setError("");
    setSelectedUserId(null);
    setSelectedOrderId(null);
    setLastSyncedAt(null);
    setActiveSection("overview");
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
          <span className="admin-filter-placeholder">Search and filters reserved for next iteration</span>
        </div>
        {dashboard?.users.length ? (
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
                {dashboard.users.map((user) => {
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
            <strong>No users found</strong>
            <p>User records from the app service will appear here once people register.</p>
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
              <dd>{selectedUser.id}</dd>
            </div>
          </dl>
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
            <span className="admin-filter-placeholder">Filters reserved for the next admin release</span>
          </div>
          {dashboard?.orders.length ? (
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
                  {dashboard.orders.map((order) => {
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
              <strong>No sales found</strong>
              <p>Server-side app orders will appear here after new purchases are recorded.</p>
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
                <dd>{selectedOrder.id}</dd>
              </div>
            </dl>
          ) : (
            <div className="admin-empty-card admin-empty-detail">
              <strong>No detail available</strong>
              <p>Select an order row to review sale metadata and payment context.</p>
            </div>
          )}
        </aside>
      </section>
    </div>
  );

  return (
    <div className="admin-workspace">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-brand-block">
            <span className="admin-brand-mark">RA</span>
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
                  <span className="admin-nav-badge">{item.shortLabel}</span>
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
          <div className="admin-side-status">
            <span className={`admin-side-dot${isSignedIn ? " is-online" : ""}`} />
            <div>
              <strong>{isSignedIn ? "Live session" : "Signed out"}</strong>
              <small>{isSignedIn ? `Source: ${apiBase}` : "Authenticate to load admin data"}</small>
            </div>
          </div>

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
