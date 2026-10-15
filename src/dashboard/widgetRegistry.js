// Widget registry and default layout definitions for VERATIS Draggable Dashboard
// 6 forensic verification widgets matching 21st.dev draggable grid layout

export const DEFAULT_WIDGETS = [
  // ROW 1: Active Investigation Dossier (2 cols) | Synthetic Coherence (1 col) | Consensus Verification (1 col)
  {
    id: 'specimen-dossier',
    title: 'Active Investigation',
    category: 'forensics',
    defaultSpan: 'col-span-1 md:col-span-2 lg:col-span-2',
    visible: true,
    removable: true,
  },
  {
    id: 'synthetic-coherence',
    title: 'Synthetic Coherence',
    category: 'forensics',
    defaultSpan: 'col-span-1 md:col-span-1 lg:col-span-1',
    visible: true,
    removable: true,
  },
  {
    id: 'consensus-registry',
    title: 'Consensus Verification',
    category: 'forensics',
    defaultSpan: 'col-span-1 md:col-span-1 lg:col-span-1',
    visible: true,
    removable: true,
  },

  // ROW 2: Spectral Artifacts (1 col) | Propagation Velocity (2 cols) | Bayesian Arbitration (1 col)
  {
    id: 'spectral-artifacts',
    title: 'Spectral Artifacts',
    category: 'forensics',
    defaultSpan: 'col-span-1 md:col-span-1 lg:col-span-1',
    visible: true,
    removable: true,
  },
  {
    id: 'propagation-trail',
    title: 'Propagation Velocity',
    category: 'forensics',
    defaultSpan: 'col-span-1 md:col-span-2 lg:col-span-2',
    visible: true,
    removable: true,
  },
  {
    id: 'bayesian-verdict',
    title: 'Bayesian Arbitration',
    category: 'forensics',
    defaultSpan: 'col-span-1 md:col-span-1 lg:col-span-1',
    visible: true,
    removable: true,
  },
];

export const LAYOUT_PRESETS = [
  {
    id: 'default',
    name: 'Full Investigation Grid',
    description: 'Dossier, Radar, Consensus, Artifacts, Propagation, Bayesian',
  },
  {
    id: 'minimal',
    name: 'Compact Overview',
    description: 'Active Dossier and Synthetic Coherence only',
  },
];
