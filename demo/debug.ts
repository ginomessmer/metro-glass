/**
 * Rendering bisect for the demo. Open any page with `?debug` to get a panel
 * that switches suspected causes of iOS glass corruption on and off live, so
 * the real Personalise page can be tested instead of a reconstruction.
 */
const flags = {
  vt: 'view transitions (navigate with a plain update)',
  names: 'every view-transition-name',
  backdrop: 'backdrop-filter on glass and the app bar',
  entry: 'tile entry animation (@starting-style)',
  tilt: '3D perspective transform on tiles',
  blend: 'soft-light light layer (::after)',
  rim: 'masked specular rim (::before)',
  isolation: 'isolation: isolate on glass',
  wallpaper: 'fixed wallpaper attachment',
} as const;

type Flag = keyof typeof flags;

const css = `
html[data-off~='names'] * { view-transition-name: none !important; }
html[data-off~='backdrop'] .mg-glass, html[data-off~='backdrop'] .mg-appbar { backdrop-filter: none; }
@starting-style { html[data-off~='entry'] .mg-tile { opacity: 1; translate: 0 0; } }
html[data-off~='tilt'] .mg-tile { transform: none; transition: none; }
html[data-off~='blend'] .mg-glass::after { mix-blend-mode: normal; }
html[data-off~='rim'] .mg-glass::before { display: none; }
html[data-off~='isolation'] .mg-glass { isolation: auto; }
html[data-off~='wallpaper'] .mg-page { background-attachment: scroll; }
`;

export function mountDebug() {
  const root = document.documentElement;
  const off = new Set<Flag>();
  const nativeStart = (document as { startViewTransition?: unknown }).startViewTransition;

  const apply = () => {
    root.dataset.off = [...off].join(' ');
    (document as { startViewTransition?: unknown }).startViewTransition = off.has('vt') ? undefined : nativeStart;
    summary.textContent = off.size ? `off: ${[...off].join(', ')}` : 'everything on';
  };

  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);

  const panel = document.createElement('details');
  panel.style.cssText =
    'position:fixed;inset-inline:0;inset-block-end:0;z-index:99999;background:#111;color:#fff;font:14px system-ui;padding:8px 12px;border-top:1px solid #444;max-block-size:60dvh;overflow:auto';
  const summary = document.createElement('summary');
  summary.style.cssText = 'padding:6px 0;cursor:pointer';
  panel.append(summary);

  for (const key of Object.keys(flags) as Flag[]) {
    const label = document.createElement('label');
    label.style.cssText = 'display:flex;gap:10px;align-items:center;padding:10px 0;border-top:1px solid #333';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.style.cssText = 'inline-size:22px;block-size:22px;flex:none';
    box.addEventListener('change', () => {
      if (box.checked) off.add(key);
      else off.delete(key);
      apply();
    });
    label.append(box, `OFF · ${flags[key]}`);
    panel.append(label);
  }

  document.body.append(panel);
  apply();
}
