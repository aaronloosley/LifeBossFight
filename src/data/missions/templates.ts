import { MissionTemplate } from '@/lib/mission-engine/types';

export const missionTemplates: MissionTemplate[] = [
  {
    id: 'tmpl-burst-pipe',
    slug: 'burst-pipe',
    title: 'Burst Pipe',
    category: 'Home Emergency',
    threatLevel: 'High',
    missionType: 'Time-Critical',
    summary: 'Contain the leak, capture the damage, alert the right people.',
    estimatedMinutes: 35,
    status: 'live',
    active: true,
    cover: { icon: 'Droplets', gradient: 'from-cyan-500/40 to-blue-900/70' },
    phases: [
      { id: 'stabilise', label: 'Stabilise', summary: 'Reduce immediate risk and contain spread.' },
      { id: 'secure-evidence', label: 'Secure Evidence', summary: 'Capture proof before changes occur.' },
      { id: 'notify', label: 'Notify the Right People', summary: 'Create a contact trail quickly.' },
      { id: 'protect', label: 'Protect Your Position', summary: 'Keep receipts and factual updates.' },
      { id: 'close', label: 'Close & Follow Up', summary: 'Review and generate your report pack.' }
    ],
    stepDefinitions: [
      {
        id: 'water-off',
        phaseId: 'stabilise',
        title: 'Turn off water supply if safe',
        instruction: 'Find your stop tap and turn it off. If unsafe, step back and call emergency help.',
        whyItMatters: 'Stopping flow limits escalating damage quickly.',
        urgency: 'Now',
        warningText: 'Avoid electrics in wet areas.',
        avoidText: 'Do not stand in water while touching appliances.',
        evidencePolicy: 'recommended',
        completionType: 'check',
        followUpMinutes: 10
      },
      {
        id: 'move-valuables',
        phaseId: 'stabilise',
        title: 'Move valuables out of splash zones',
        instruction: 'Relocate documents, electronics, and soft furnishings to dry areas.',
        whyItMatters: 'Prevents secondary losses while you handle contacts.',
        urgency: 'Now',
        evidencePolicy: 'none',
        completionType: 'check'
      },
      {
        id: 'photo-source',
        phaseId: 'secure-evidence',
        title: 'Take clear photos of leak and damage',
        instruction: 'Capture source, wide-room shots, and close-up damage angles.',
        whyItMatters: 'Visual timeline helps repairs, insurance, and disputes.',
        urgency: 'Soon',
        evidencePolicy: 'required',
        completionType: 'evidence'
      },
      {
        id: 'discovery-note',
        phaseId: 'secure-evidence',
        title: 'Log when you discovered the issue',
        instruction: 'Add a short factual note: time found, what you saw, what you did first.',
        whyItMatters: 'Creates a reliable factual baseline.',
        urgency: 'Soon',
        evidencePolicy: 'required',
        completionType: 'note'
      },
      {
        id: 'contact-owner',
        phaseId: 'notify',
        title: 'Contact landlord/agent/plumber',
        instruction: 'Log who you contacted, channel used, and any promised response time.',
        whyItMatters: 'Demonstrates prompt notification and follow-up.',
        urgency: 'Soon',
        evidencePolicy: 'recommended',
        completionType: 'contact-log',
        followUpMinutes: 60
      },
      {
        id: 'policy-details',
        phaseId: 'notify',
        title: 'Save insurance or provider details',
        instruction: 'Record policy number/provider if available to speed next actions.',
        whyItMatters: 'Avoids delays during claims or escalation.',
        urgency: 'Later',
        evidencePolicy: 'recommended',
        completionType: 'note'
      },
      {
        id: 'receipt-log',
        phaseId: 'protect',
        title: 'Save emergency receipts',
        instruction: 'Upload temporary repair and cleanup receipts with labels.',
        whyItMatters: 'Creates reimbursement-ready records.',
        urgency: 'Later',
        evidencePolicy: 'required',
        completionType: 'evidence'
      },
      {
        id: 'worsening-damage',
        phaseId: 'protect',
        title: 'Track any worsening damage',
        instruction: 'Add quick updates if spread or structural issues increase.',
        whyItMatters: 'Shows ongoing impact and response speed.',
        urgency: 'Later',
        evidencePolicy: 'recommended',
        completionType: 'note'
      },
      {
        id: 'review-evidence',
        phaseId: 'close',
        title: 'Review evidence completeness',
        instruction: 'Check photos, notes, contact attempts, and receipts are all present.',
        whyItMatters: 'Completes your report pack with less stress later.',
        urgency: 'Later',
        evidencePolicy: 'none',
        completionType: 'check'
      },
      {
        id: 'generate-report',
        phaseId: 'close',
        title: 'Generate mission summary',
        instruction: 'Create your in-app report pack and mark safe to pause or complete.',
        whyItMatters: 'Converts incident chaos into an actionable record.',
        urgency: 'Later',
        evidencePolicy: 'none',
        completionType: 'check'
      }
    ],
    reportConfig: { includeContacts: true, includeEvidence: true, includeTimeline: true }
  },
  {
    id: 'tmpl-car-accident',
    slug: 'car-accident',
    title: 'Car Accident',
    category: 'Transport',
    threatLevel: 'High',
    missionType: 'Time-Critical',
    summary: 'Coming soon',
    estimatedMinutes: 25,
    status: 'coming-soon',
    active: false,
    cover: { icon: 'Car', gradient: 'from-blue-500/30 to-slate-800' },
    phases: [],
    stepDefinitions: [],
    reportConfig: { includeContacts: true, includeEvidence: true, includeTimeline: true }
  }
];
