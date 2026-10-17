import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';
import { axeViolations } from '../../test/axe';

function Example(props: Partial<React.ComponentProps<typeof Tabs>>) {
  return (
    <Tabs defaultValue="all" {...props}>
      <TabList aria-label="People">
        <Tab value="all">All</Tab>
        <Tab value="recent">Recent</Tab>
        <Tab value="new" disabled>New</Tab>
        <Tab value="together">Together</Tab>
      </TabList>
      <TabPanel value="all">All people</TabPanel>
      <TabPanel value="recent">Recent people</TabPanel>
      <TabPanel value="new">New people</TabPanel>
      <TabPanel value="together">Together people</TabPanel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('wires tabs and panels together', () => {
    render(<Example />);
    const tab = screen.getByRole('tab', { name: 'All' });
    const panel = screen.getByRole('tabpanel');
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    expect(panel).toHaveTextContent('All people');
  });

  it('uses a roving tabindex', () => {
    render(<Example />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.tabIndex)).toEqual([0, -1, -1, -1]);
  });

  it('moves with arrow keys, skips disabled tabs, wraps, and supports Home/End', async () => {
    render(<Example />);
    screen.getByRole('tab', { name: 'All' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Recent' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Recent people');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Together' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'All' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Together' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'All' })).toHaveFocus();
  });

  it('waits for Enter in manual activation mode', async () => {
    render(<Example activation="manual" />);
    screen.getByRole('tab', { name: 'All' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('All people');
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Recent people');
  });

  it('supports controlled usage', async () => {
    const onValueChange = vi.fn();
    render(<Example value="recent" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Together' }));
    expect(onValueChange).toHaveBeenCalledWith('together');
    // Still controlled: the parent did not update `value`.
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Recent people');
  });

  it('changes tab on a horizontal touch swipe', () => {
    render(<Example />);
    const panel = screen.getByRole('tabpanel');
    fireEvent.pointerDown(panel, { pointerId: 1, pointerType: 'touch', clientX: 300, clientY: 100 });
    fireEvent.pointerUp(panel, { pointerId: 1, pointerType: 'touch', clientX: 120, clientY: 110 });
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Recent people');
  });

  it('ignores mostly-vertical drags', () => {
    render(<Example />);
    const panel = screen.getByRole('tabpanel');
    fireEvent.pointerDown(panel, { pointerId: 1, pointerType: 'touch', clientX: 300, clientY: 100 });
    fireEvent.pointerUp(panel, { pointerId: 1, pointerType: 'touch', clientX: 220, clientY: 400 });
    expect(screen.getByRole('tabpanel')).toHaveTextContent('All people');
  });

  it('omits aria-controls when a tab has no panel in the DOM', () => {
    render(
      <Tabs defaultValue="light" variant="segmented">
        <TabList aria-label="Theme">
          <Tab value="light">Light</Tab>
          <Tab value="dark">Dark</Tab>
        </TabList>
      </Tabs>,
    );
    for (const tab of screen.getAllByRole('tab')) expect(tab).not.toHaveAttribute('aria-controls');
  });

  it('only points inactive tabs at panels that are mounted', () => {
    render(<Example />);
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-controls');
    expect(screen.getByRole('tab', { name: 'Recent' })).not.toHaveAttribute('aria-controls');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Example />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
