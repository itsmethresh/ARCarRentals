import { describe, it, expect } from 'vitest';
import { render, screen } from '../test-utils';
import { Rating } from '@components/ui/Rating';

describe('Rating Component', () => {
  it('renders correct number of stars', () => {
    render(<Rating value={3} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5); // Default maxValue is 5
  });

  it('renders with custom maxValue', () => {
    render(<Rating value={3} maxValue={10} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(10);
  });

  it('displays rating value when showValue is true', () => {
    render(<Rating value={4.5} showValue />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('does not display rating value when showValue is false', () => {
    render(<Rating value={4.5} />);
    expect(screen.queryByText('4.5')).not.toBeInTheDocument();
  });

  it('renders stars as disabled when readonly is true', () => {
    render(<Rating value={3} readonly />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('renders stars as enabled when readonly is false', () => {
    render(<Rating value={3} readonly={false} onChange={() => {}} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it('calls onChange when star is clicked and not readonly', () => {
    const handleChange = vi.fn();
    render(<Rating value={3} readonly={false} onChange={handleChange} />);
    
    const buttons = screen.getAllByRole('button');
    buttons[4].click(); // Click 5th star
    
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it('has proper accessibility labels', () => {
    render(<Rating value={3} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-label', 'Rate 1 out of 5');
    expect(buttons[4]).toHaveAttribute('aria-label', 'Rate 5 out of 5');
  });
});
