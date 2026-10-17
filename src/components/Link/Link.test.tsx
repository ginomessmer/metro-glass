import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Link } from './Link';

describe('Link', () => {
  it('marks external links safely and announces the new tab', () => {
    render(<Link href="https://example.com" external>Docs</Link>);
    const link = screen.getByRole('link', { name: /docs.*opens in a new tab/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('keeps caller-provided target/rel on internal links', () => {
    render(<Link href="/a" target="_self" rel="next">A</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_self');
    expect(link).toHaveAttribute('rel', 'next');
  });

  it('intercepts plain clicks for client-side navigation', () => {
    const onNavigate = vi.fn();
    render(<Link href="/settings" onNavigate={onNavigate}>Settings</Link>);
    const allowed = fireEvent.click(screen.getByRole('link'));
    expect(allowed).toBe(false); // default prevented
    expect(onNavigate).toHaveBeenCalledWith('/settings');
  });

  it('lets modified clicks through (open in new tab)', () => {
    const onNavigate = vi.fn();
    render(<Link href="/settings" onNavigate={onNavigate}>Settings</Link>);
    fireEvent.click(screen.getByRole('link'), { metaKey: true });
    fireEvent.click(screen.getByRole('link'), { ctrlKey: true });
    expect(onNavigate).not.toHaveBeenCalled();
  });
});
