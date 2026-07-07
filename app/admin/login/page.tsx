import { login } from './actions'

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background px-4"
      style={{ fontFamily: "var(--font-sans, sans-serif)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 40 40" fill="none" style={{ width: 40, height: 40 }}>
              <path d="M20 2L2 15V38H38V15L20 2Z" fill="var(--primary)" />
              <path d="M20 10L10 18V32H30V18L20 10Z" fill="var(--primary-foreground)" />
            </svg>
          </div>
          <div
            className="font-serif text-2xl font-medium tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-serif, serif)" }}
          >
            PARMAR
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mt-0.5">
            Properties · Admin
          </div>
        </div>

        {/* Card */}
        <div
          className="bg-card border border-border p-8"
          style={{ borderRadius: "2px" }}
        >
          <h1 className="text-base font-medium text-foreground mb-6">
            Sign in to continue
          </h1>

          <form action={login} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email-address"
                className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2"
              >
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@example.com"
                className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 outline-none focus:border-primary transition-colors"
                style={{ borderRadius: "2px" }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 outline-none focus:border-primary transition-colors"
                style={{ borderRadius: "2px" }}
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full bg-primary text-primary-foreground text-sm font-medium tracking-wide py-3 hover:bg-primary/90 transition-colors"
              style={{ borderRadius: "2px" }}
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Parmar Properties · Restricted access
        </p>
      </div>
    </div>
  )
}
