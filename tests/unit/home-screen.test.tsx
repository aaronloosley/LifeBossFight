import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { missionTemplates } from '@/data/missions/templates';
import { createMissionRun } from '@/lib/mission-engine';
import HomePage from '@/app/(app)/home/page';

describe('home screen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders active missions header', () => {
    render(<HomePage />);
    expect(screen.getByText('Active Missions')).toBeInTheDocument();
  });

  it('shows resume details for an active run', async () => {
    const run = createMissionRun('demo-user', missionTemplates[0]);
    localStorage.setItem('lbf_runs', JSON.stringify([run]));
    localStorage.setItem('lbf_session', 'demo');

    render(<HomePage />);

    expect(await screen.findByText(/Next move:/i)).toBeInTheDocument();
    expect(screen.getByText(/Demo mode/i)).toBeInTheDocument();
  });
});
