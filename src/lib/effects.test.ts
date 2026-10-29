import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Regression: `useEffect(() => window.scrollTo(...))` returned a Promise in newer Chrome,
// React called it as cleanup and the shop crashed with "l is not a function".
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(f) ? [p] : [];
  });
}

describe('effects', () => {
  it('never uses a concise-body arrow in useEffect (its value would become the cleanup)', () => {
    const bad = files('src').filter((f) => /useEffect\(\(\)\s*=>\s*(?!\{)\s*window\./.test(readFileSync(f, 'utf8')));
    expect(bad).toEqual([]);
  });
});
