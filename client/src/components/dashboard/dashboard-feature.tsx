import { Link } from 'react-router'

export default function DashboardFeature() {
  return (
    <div className="w-full">
      {/* Top Badge */}
      <div className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 px-4 py-1.5 mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Solana • AI • MEV Protection
        </p>
      </div>

      {/* Heading */}
      <h1
        className="
            text-4xl
            sm:text-5xl
            lg:text-7xl
            font-semibold
            tracking-tight
            leading-[1.05]
            max-w-5xl
          "
      >
        Smarter swaps with{' '}
        <span className="text-gray-400 dark:text-gray-500">
          real-time AI protection.
        </span>
      </h1>

      {/* Description */}
      <p
        className="
            mt-8
            text-base
            sm:text-lg
            leading-relaxed
            text-gray-600
            dark:text-gray-400
            max-w-2xl
          "
      >
        Aroha DEX analyzes swap conditions before execution and helps protect
        users from unsafe routes, excessive slippage, and risky transaction
        behavior on Solana.
      </p>

      {/* CTA */}
      <div className="mt-10">
        <Link
          to="/account"
          className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-black
              dark:bg-white
              text-white
              dark:text-black
              px-6
              py-3
              text-sm
              font-medium
              transition-all
              hover:opacity-90
            "
        >
          Go to Account
        </Link>
      </div>

      {/* Stats */}
      <div
        className="
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-10
            mt-20
            pt-10
            border-t
            border-black/10
            dark:border-white/10
          "
      >
        <div>
          <h2 className="text-2xl font-semibold">AI</h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Risk prediction engine
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Live</h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Solana transaction analysis
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Safe</h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Dynamic protection system
          </p>
        </div>
      </div>
    </div>
  )
}
