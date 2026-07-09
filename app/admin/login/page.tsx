import { login } from './actions'
import Image from "next/image"

export default function LoginPage() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-white"
      style={{ fontFamily: "var(--font-sans, sans-serif)" }}
    >
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1758193431355-54df41421657?w=1600&h=900&fit=crop&auto=format" 
          alt="Luxury Architecture"
          fill
          className="object-cover opacity-80 scale-105 animate-[kenburns_20s_ease-out_forwards]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-white/30" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 40 40" fill="none" style={{ width: 48, height: 48 }}>
              <path d="M20 2L2 15V38H38V15L20 2Z" fill="hsl(var(--primary))" />
              <path d="M20 10L10 18V32H30V18L20 10Z" fill="hsl(var(--primary) / 0.7)" />
            </svg>
          </div>
          <div
            className="font-serif text-3xl font-medium tracking-tight text-foreground"
          >
            PARMAR
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mt-1">
            Properties · Admin
          </div>
        </div>

        {/* Glassmorphic Card */}
        <div
          className="bg-white/60 backdrop-blur-3xl border border-white p-8 rounded-3xl shadow-2xl shadow-black/5"
        >
          <h1 className="text-lg font-medium text-foreground mb-6 font-serif">
            Secure Sign In
          </h1>

          <form action={login} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="email-address"
                className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2"
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
                className="w-full bg-white/50 border border-border text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all duration-300 rounded-xl"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2"
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
                className="w-full bg-white/50 border border-border text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all duration-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-primary text-primary-foreground text-sm font-semibold tracking-wide py-3.5 hover:bg-primary/90 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 rounded-xl"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          Restricted access
        </p>
      </div>
    </div>
  )
}
