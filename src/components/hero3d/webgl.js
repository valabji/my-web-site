/**
 * Cheap, cached WebGL capability probe. Used to decide whether to mount
 * the real 3D hero or fall back to the CSS terminal. Runs client-side only.
 */
let cached = null;

export function hasWebGL() {
  if (cached !== null) return cached;
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return (cached = false);
  }
  try {
    const canvas = document.createElement('canvas');
    const ctx =
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'));
    cached = !!ctx;
    // Free the probe context immediately — browsers cap the number of live
    // WebGL contexts, and we only ever needed it to test for support.
    if (ctx) ctx.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}
