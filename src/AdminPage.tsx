import { useEffect, useState } from "react";
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

const STORAGE_KEY = "richai_admin_credentials";
const apiBase = (import.meta.env.VITE_APP_API_URL || "https://healthai.up.railway.app").replace(/\/$/, "");

const encodeBasicAuth = (username: string, password: string) =>
  `Basic ${window.btoa(`${username}:${password}`)}`;

const formatDate = (timestamp: number | null) =>
  timestamp ? new Date(timestamp).toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" }) : "—";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2
  }).format(value || 0);

function AdminPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [dashboard, setDashboard] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const hasSession = password.trim().length > 0;

  const fetchDashboard = async (nextUsername: string, nextPassword: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBase}/api/admin/overview`, {
        headers: {
          Authorization: encodeBasicAuth(nextUsername, nextPassword)
        }
      });

      const payload = (await response.json().catch(() => null)) as AdminOverview | { error?: string } | null;
      if (
        !response.ok ||
        !payload ||
        ("error" in payload && typeof payload.error === "string")
      ) {
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
    } catch (nextError) {
      setDashboard(null);
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
        void fetchDashboard(parsed.username || "admin", parsed.password);
      }
    } catch {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetchDashboard(username.trim(), password);
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setPassword("");
    setDashboard(null);
    setError("");
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <p className="admin-kicker">Admin</p>
            <h1>RichAI control room</h1>
            <p className="admin-subtitle">
              This dashboard reads live user registrations and sales from the app service at <code>{apiBase}</code>.
            </p>
          </div>
          <div className="admin-header-actions">
            {dashboard ? (
              <>
                <button className="admin-secondary-button" type="button" onClick={() => void fetchDashboard(username, password)}>
                  Refresh
                </button>
                <button className="admin-primary-button" type="button" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <a className="admin-secondary-button" href="/">
                Back to site
              </a>
            )}
          </div>
        </header>

        {!dashboard ? (
          <section className="admin-login-card">
            <div className="admin-login-copy">
              <p className="admin-eyebrow">Protected access</p>
              <h2>Sign in to `/admin`</h2>
              <p>
                Use the admin username and password configured on the app service. The website itself does not store app data.
              </p>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
              <label className="admin-field">
                <span>Username</span>
                <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
              </label>

              <label className="admin-field">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </label>

              {error ? <p className="admin-error">{error}</p> : null}

              <button className="admin-primary-button" type="submit" disabled={isLoading || !hasSession}>
                {isLoading ? "Checking access..." : "Open dashboard"}
              </button>
            </form>
          </section>
        ) : (
          <>
            <section className="admin-metrics-grid">
              <article className="admin-metric-card">
                <span className="admin-metric-label">Registered users</span>
                <strong>{dashboard.stats.totalUsers}</strong>
                <small>Latest: {formatDate(dashboard.stats.latestUserAt)}</small>
              </article>
              <article className="admin-metric-card">
                <span className="admin-metric-label">Total sales</span>
                <strong>{dashboard.stats.totalSales}</strong>
                <small>Latest: {formatDate(dashboard.stats.latestSaleAt)}</small>
              </article>
              <article className="admin-metric-card">
                <span className="admin-metric-label">Revenue tracked</span>
                <strong>{formatCurrency(dashboard.stats.totalRevenue)}</strong>
                <small>Current app-side order records</small>
              </article>
            </section>

            <section className="admin-data-grid">
              <article className="admin-table-card">
                <div className="admin-card-header">
                  <div>
                    <p className="admin-eyebrow">Users</p>
                    <h2>App registrations</h2>
                  </div>
                  <span className="admin-chip">{dashboard.users.length} shown</span>
                </div>
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
                      {dashboard.users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name || "—"}</td>
                          <td>{user.email || "—"}</td>
                          <td>{user.provider}</td>
                          <td>{user.country || "—"}</td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td>{formatDate(user.lastLoginAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="admin-table-card">
                <div className="admin-card-header">
                  <div>
                    <p className="admin-eyebrow">Sales</p>
                    <h2>App orders</h2>
                  </div>
                  <span className="admin-chip">{dashboard.orders.length} shown</span>
                </div>
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
                      {dashboard.orders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.orderNumber}</td>
                          <td>{order.customerName || order.userEmail || "—"}</td>
                          <td>{order.planLabel || order.plan}</td>
                          <td>{order.paymentMethod || "—"}</td>
                          <td>{order.status}</td>
                          <td>{formatCurrency(order.price)}</td>
                          <td>{formatDate(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
