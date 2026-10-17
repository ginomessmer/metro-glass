import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TileGrid, TileGroup } from './TileGrid';
import { Tile } from '../Tile/Tile';
import { axeViolations } from '../../test/axe';

function Start({ zoomed }: { zoomed?: boolean }) {
  return (
    <TileGrid aria-label="Start" semanticZoom defaultZoomed={zoomed}>
      <TileGroup title="Life">
        <Tile title="Mail" onClick={() => {}} />
      </TileGroup>
      <TileGroup title="Play">
        <Tile title="Music" onClick={() => {}} />
      </TileGroup>
    </TileGrid>
  );
}

describe('TileGrid', () => {
  it('exposes a labelled region with labelled groups', () => {
    render(<Start />);
    expect(screen.getByRole('region', { name: 'Start' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Life' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Play' })).toBeInTheDocument();
  });

  it('makes tiles inert and offers one button per group when zoomed out', async () => {
    const { container } = render(<Start zoomed />);
    for (const tiles of container.querySelectorAll('.mg-tile-group__tiles')) {
      expect(tiles).toHaveAttribute('inert');
    }
    const open = screen.getByRole('button', { name: 'Open Play' });
    await userEvent.click(open);
    expect(screen.getByRole('button', { name: 'Music' })).toHaveFocus();
    expect(container.querySelector('[inert]')).toBeNull();
    expect(screen.queryByRole('button', { name: /^Open/ })).toBeNull();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Start />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
