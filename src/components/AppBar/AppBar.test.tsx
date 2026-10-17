import { act, render, screen } from '@testing-library/react';
import { AppBar, AppBarBrand, AppBarItem } from './AppBar';
import { axeViolations } from '../../test/axe';

function Bar(props: { morph?: boolean }) {
  return (
    <AppBar {...props} brand={<AppBarBrand href="/" logo={<svg />}>metro glass</AppBarBrand>}>
      <AppBarItem href="/hub" current>Hub</AppBarItem>
      <AppBarItem href="/settings">Personalise</AppBarItem>
    </AppBar>
  );
}

describe('AppBar', () => {
  it('renders a banner with a labelled navigation list', () => {
    render(<Bar />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav.querySelectorAll('li')).toHaveLength(2);
  });

  it('marks the current item', () => {
    render(<Bar />);
    expect(screen.getByRole('link', { name: 'Hub' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Personalise' })).not.toHaveAttribute('aria-current');
  });

  it('keeps the brand name as the accessible name even when it collapses visually', () => {
    render(<Bar />);
    expect(screen.getByRole('link', { name: 'metro glass' })).toHaveAttribute('href', '/');
  });

  it('drives the morph from scroll position when scroll timelines are unsupported', () => {
    render(<Bar />);
    const bar = screen.getByRole('banner');
    expect(bar).toHaveAttribute('data-morph');
    // Run frames immediately (returning 0 = "no frame pending" afterwards).
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    act(() => {
      window.scrollY = 48;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(bar.style.getPropertyValue('--mg-appbar-progress')).toBe('0.5');
    act(() => {
      window.scrollY = 500;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(bar.style.getPropertyValue('--mg-appbar-progress')).toBe('1');
  });

  it('does not morph when disabled', () => {
    render(<Bar morph={false} />);
    expect(screen.getByRole('banner')).not.toHaveAttribute('data-morph');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Bar />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
