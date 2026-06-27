import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static HTML export — emits the site as static HTML to `out/`.
  output: 'export',
  // next/image optimisation needs a server; with a static export we serve
  // pre-sized Sanity CDN URLs directly, so disable the optimiser.
  images: { unoptimized: true },
}

export default nextConfig
