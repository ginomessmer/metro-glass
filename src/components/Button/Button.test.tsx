import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { vi } from 'vitest';
import { Button } from './Button';
import { axeViolations } from '../../test/axe';

describe('Button', () => {
  it('is a type="button" by default and forwards its ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
    expect(ref.current).toBe(button);
  });

  it('does not fire when disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('activates from the keyboard', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('circle buttons are named by aria-label and hide the icon', async () => {
    const { container } = render(<Button shape="circle" icon={<svg />} aria-label="Add" />);
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(container.querySelector('.mg-button__icon')).toHaveAttribute('aria-hidden', 'true');
    expect(await axeViolations(container)).toEqual([]);
  });
});
