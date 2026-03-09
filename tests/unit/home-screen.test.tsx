import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/(app)/home/page';

describe('home screen', () => {
  it('renders active missions header', () => {
    render(<HomePage />);
    expect(screen.getByText('Active Missions')).toBeInTheDocument();
  });
});
