import { login } from './actions'
import Image from "next/image"

export default function LoginPage() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-black"
      style={{ fontFamily: "var(--font-sans, sans-serif)" }}
    >
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1758193431355-54df41421657?w=1600&h=900&fit=crop&auto=format" 
          alt="Luxury Architecture"
          fill
          className="object-cover opacity-50 scale-105 animate-[kenburns_20s_ease-out_forwards]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 40 40" fill="none" style={{ width: 48, height: 48 }} className="drop-shadow-lg">
              <path d="M20 2L2 15V38H38V15L20 2Z" fill="#ffffff" />
              <path d="M20 10L10 18V32H30V18L20 10Z" fill="rgba(255,255,255,0.7)" />
            </svg>
          </div>
          <div
            className="font-serif text-3xl font-medium tracking-tight text-white drop-shadow-lg"
          >
            PARMAR
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-sans mt-1">
            Properties · Admin
          </div>
        </div>

        {/* Glassmorphic Card */}
        <div
          className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl shadow-black"
        >
          <h1 className="text-lg font-medium text-white mb-6 font-serif">
            Secure Sign In
          </h1>

          <form action={login} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="email-address"
                className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 mb-2"
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
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm px-4 py-3 outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300 rounded-xl"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 mb-2"
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
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm px-4 py-3 outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-white text-black text-sm font-semibold tracking-wide py-3.5 hover:bg-white/90 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-white/20 transition-all duration-300 rounded-xl"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-white/40">
          Restricted access
        </p>
      </div>
    </div>
  )
}
