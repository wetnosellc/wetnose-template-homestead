// User-Worker entry for the Classic template inside the Wetnose for Platforms
// dispatch namespace.
//
// The built Astro site in `../dist/` is served via the Workers Static Assets
// binding. This shim exists so the dispatch namespace has a script to invoke;
// it delegates every request straight to `env.ASSETS`.
//
// One instance of this Worker is deployed per kennel as `kennel-{kennelId}`
// into the `wetnose-sites` namespace. The dispatcher Worker selects it by
// hostname lookup in KV.

export interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
