import axe from 'axe-core';

/** Runs axe against a container and returns violation ids (empty = pass). */
export async function axeViolations(container: Element) {
  const results = await axe.run(container, {
    rules: {
      // jsdom has no layout or colour computation.
      'color-contrast': { enabled: false },
      region: { enabled: false },
    },
  });
  return results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(', ')}`);
}
