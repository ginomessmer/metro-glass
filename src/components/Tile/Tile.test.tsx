import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Tile } from './Tile';
import { axeViolations } from '../../test/axe';

describe('Tile', () => {
  it('renders a button when clickable and reports clicks', async () => {
    const onClick = vi.fn();
    render(<Tile title="Mail" badge={3} onClick={onClick} />);
    const tile = screen.getByRole('button', { name: /mail/i });
    await userEvent.click(tile);
    expect(onClick).toHaveBeenCalledOnce();
    expect(tile).toHaveAttribute('data-size', 'medium');
  });

  it('renders a link with href', () => {
    render(<Tile title="Calendar" href="/calendar" />);
    expect(screen.getByRole('link', { name: 'Calendar' })).toHaveAttribute('href', '/calendar');
  });

  it('renders a static, non-focusable div otherwise', () => {
    const { container } = render(<Tile title="Weather" />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(container.firstElementChild?.tagName).toBe('DIV');
  });

  it('tilts while pressed and releases on pointer up', () => {
    render(<Tile title="Mail" onClick={() => {}} />);
    const tile = screen.getByRole('button');
    fireEvent.pointerDown(tile, { pointerId: 1, button: 0, clientX: 0, clientY: 0 });
    expect(tile).toHaveAttribute('data-pressed');
    expect(tile.style.getPropertyValue('--mg-press')).not.toBe('');
    fireEvent.pointerUp(tile, { pointerId: 1 });
    expect(tile).not.toHaveAttribute('data-pressed');
  });

  it('stays pressed until every touch on it is lifted (multi-touch)', () => {
    render(<Tile title="Mail" onClick={() => {}} />);
    const tile = screen.getByRole('button');
    fireEvent.pointerDown(tile, { pointerId: 1, button: 0 });
    fireEvent.pointerDown(tile, { pointerId: 2, button: 0 });
    fireEvent.pointerUp(tile, { pointerId: 1 });
    expect(tile).toHaveAttribute('data-pressed');
    fireEvent.pointerUp(tile, { pointerId: 2 });
    expect(tile).not.toHaveAttribute('data-pressed');
  });

  it('cycles live faces and pauses while hovered', () => {
    vi.useFakeTimers();
    render(
      <Tile title="News" liveInterval={1000}>
        <span>First</span>
        <span>Second</span>
      </Tile>,
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    // jsdom has no Web Animations, so the tile swaps faces without animating.
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('Second')).toBeInTheDocument();

    fireEvent.pointerEnter(screen.getByText('Second').closest('.mg-tile')!);
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText('Second')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('scopes an accent override to the tile', () => {
    render(<Tile title="Music" accent="lime" onClick={() => {}} />);
    const tile = screen.getByRole('button');
    expect(tile.style.getPropertyValue('--mg-accent')).toBe('#a4c400');
    expect(tile).toHaveAttribute('data-mg-accent');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Tile title="Mail" badge={2} onClick={() => {}} />
        <Tile title="Calendar" href="#" />
        <Tile title="Photos" />
      </div>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
