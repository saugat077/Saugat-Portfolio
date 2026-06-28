import { createClient } from '@sanity/client'
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  // We fetch at build time and rebuild via a Sanity webhook, so the build must
  // read the freshest published content. The CDN (useCdn: true) serves cached
  // query results to the build, which makes published edits show up stale.
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_READ_TOKEN,
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
