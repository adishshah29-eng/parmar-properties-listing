import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-theme admin-layout">
      <aside className="admin-sidebar">
        <Link href="/" className="logo" style={{ textDecoration: "none", color: "var(--admin-text-dark)" }}>
          <svg viewBox="0 0 32 32" fill="none" style={{ width: "24px", height: "24px" }}>
            <path d="M16 2L2 12V30H30V12L16 2Z" fill="var(--admin-text-dark)" />
            <path d="M16 8L8 14V26H24V14L16 8Z" fill="#FFFFFF" />
          </svg>
          Parmar<span style={{ color: "var(--admin-text-muted)" }}>Properties</span>
        </Link>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--admin-text-faint)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Admin Console</div>
        <nav className="admin-nav">
          <Link href="/admin">Overview</Link>
          <Link href="/admin/developers">Developers</Link>
          <Link href="/admin/projects">Projects</Link>
          <Link href="/admin/inventory">Inventory</Link>
          <Link href="/admin/settings">Settings</Link>
        </nav>
        <div style={{ marginTop: "auto", borderTop: "1px solid var(--admin-border, #EBEBEB)", paddingTop: "24px" }}>
          <Link href="/" style={{ color: "var(--admin-text-muted)", fontSize: "14px", textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px", height: "16px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Gallery
          </Link>
        </div>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}