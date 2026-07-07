import Link from "next/link";
import { logout } from "./login/actions";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-theme admin-layout">
      <aside className="admin-sidebar">
        {/* Logo — same mark as public Navbar */}
        <Link href="/" className="logo" style={{ textDecoration: "none", color: "var(--admin-text-dark)", marginBottom: "32px" }}>
          <svg viewBox="0 0 40 40" fill="none" style={{ width: 24, height: 24, flexShrink: 0 }}>
            <path d="M20 2L2 15V38H38V15L20 2Z" fill="var(--primary)" />
            <path d="M20 10L10 18V32H30V18L20 10Z" fill="var(--primary-foreground)" />
          </svg>
          <span style={{ fontFamily: "var(--font-serif, serif)", fontSize: "17px", fontWeight: 500, letterSpacing: "-0.01em" }}>
            PARMAR
          </span>
        </Link>

        <div style={{
          fontSize: "10px",
          fontWeight: 600,
          color: "var(--admin-text-faint)",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          marginBottom: "20px",
          paddingLeft: "4px",
        }}>
          Admin Console
        </div>

        <nav className="admin-nav">
          <Link href="/admin">Overview</Link>
          <Link href="/admin/developers">Developers</Link>
          <Link href="/admin/projects">Projects</Link>
          <Link href="/admin/inventory">Inventory</Link>
          <Link href="/admin/settings">Settings</Link>
        </nav>

        <div style={{ marginTop: "auto", borderTop: "1px solid var(--admin-border)", paddingTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            href="/"
            style={{
              color: "var(--admin-text-muted)",
              fontSize: "13px",
              textDecoration: "none",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "color 0.2s",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "14px", height: "14px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Gallery
          </Link>

          <form action={logout}>
            <button
              type="submit"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "var(--admin-text-muted)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "color 0.2s",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "14px", height: "14px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}