/** True only for hardware-accelerated WebGL: software renderers would make the page sluggish. */
let cached: boolean | null = null;
export function hasFastWebGL() {
  if (cached !== null) return cached;
  if (new URLSearchParams(location.search).get('3d') === 'force') return (cached = true);
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true })) as WebGLRenderingContext | null;
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    const name = info ? String(gl!.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    cached = !!gl && !/swiftshader|llvmpipe|software|basic render/i.test(name);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}
