/**
 * VERATIS NEUTRALIZER — Forensic Framing Analysis & Epistemic De-Escalation Engine
 * 
 * Provides:
 * 1. Predefined high-fidelity forensic sample cases
 * 2. Client-side heuristic analysis engine for arbitrary user inputs
 * 3. Exact phrase span identification and categorization
 * 4. Three-layer breakdown (Claim, Evidence, Framing)
 * 5. Epistemic qualification preserving uncertainty and avoiding truth inflation
 * 6. Inline text diffing between original and neutralized content
 */

export const ANALYSIS_MODES = [
  { id: 'all', label: 'General Content Analysis', description: 'Comprehensive framing, certainty, and emotional language analysis' },
  { id: 'headlines', label: 'Sensationalized Headlines', description: 'Detects clickbait hooks, breathless capitalization, and shock framing' },
  { id: 'messages', label: 'Suspicious Messages', description: 'Identifies artificial urgency, chain-forwarding pressure, and panic prompts' },
  { id: 'misinformation', label: 'Potential Misinformation', description: 'Isolates unverified allegations and absolute certainty claims' },
  { id: 'manipulative', label: 'Manipulative Language', description: 'Flags ad hominem attacks, tribal polarization, and emotional manipulation' },
];

export const FRAMING_CATEGORIES = {
  EMOTIONAL: {
    id: 'emotional',
    name: 'Emotionally loaded wording',
    color: 'amber',
    bgClass: 'bg-amber-100/80 text-amber-900 border-amber-300',
    highlightClass: 'bg-amber-100 border-b-2 border-amber-400 text-zinc-900',
    dotClass: 'bg-amber-500',
  },
  SENSATIONAL: {
    id: 'sensational',
    name: 'Sensationalism',
    color: 'rose',
    bgClass: 'bg-rose-100/80 text-rose-900 border-rose-300',
    highlightClass: 'bg-rose-100 border-b-2 border-rose-400 text-zinc-900',
    dotClass: 'bg-rose-500',
  },
  CERTAINTY: {
    id: 'certainty',
    name: 'Unsupported certainty',
    color: 'purple',
    bgClass: 'bg-purple-100/80 text-purple-900 border-purple-300',
    highlightClass: 'bg-purple-100 border-b-2 border-purple-400 text-zinc-900',
    dotClass: 'bg-purple-500',
  },
  URGENCY: {
    id: 'urgency',
    name: 'Urgency or pressure',
    color: 'orange',
    bgClass: 'bg-orange-100/80 text-orange-900 border-orange-300',
    highlightClass: 'bg-orange-100 border-b-2 border-orange-400 text-zinc-900',
    dotClass: 'bg-orange-500',
  },
  CONTEXT: {
    id: 'context',
    name: 'Missing context',
    color: 'blue',
    bgClass: 'bg-blue-100/80 text-blue-900 border-blue-300',
    highlightClass: 'bg-blue-100 border-b-2 border-blue-400 text-zinc-900',
    dotClass: 'bg-blue-500',
  },
  ALLEGATION: {
    id: 'allegation',
    name: 'Unsubstantiated allegation',
    color: 'red',
    bgClass: 'bg-red-100/80 text-red-900 border-red-300',
    highlightClass: 'bg-red-100 border-b-2 border-red-400 text-zinc-900',
    dotClass: 'bg-red-500',
  },
  MISLEADING: {
    id: 'misleading',
    name: 'Potentially misleading framing',
    color: 'indigo',
    bgClass: 'bg-indigo-100/80 text-indigo-900 border-indigo-300',
    highlightClass: 'bg-indigo-100 border-b-2 border-indigo-400 text-zinc-900',
    dotClass: 'bg-indigo-500',
  },
};

// 5 Rich Built-in Demonstration Cases
export const SAMPLE_CASES = [
  {
    id: 'case-headline-scandal',
    title: 'Sensational College Scandal Headline',
    pillLabel: 'College Scandal',
    mode: 'headlines',
    categoryLabel: 'Sensationalized headlines',
    original: 'SHOCKING! College authorities CAUGHT covering up a MASSIVE scandal!',
    neutralized: 'A post alleges that college authorities concealed an incident. The supplied text does not establish whether the allegation is true.',
    epistemicNote: 'Preserves the core assertion as an unverified allegation while removing sensational capitalization and unsupported certainty.',
    framingSignals: [
      {
        phrase: 'SHOCKING!',
        category: FRAMING_CATEGORIES.SENSATIONAL.name,
        categoryKey: 'SENSATIONAL',
        explanation: 'Hyperbolic capitalized exclamation designed to induce immediate emotional arousal before the reader evaluates the claim.',
        alternative: 'Reportedly (or omit entirely)',
        severity: 'High',
      },
      {
        phrase: 'CAUGHT',
        category: FRAMING_CATEGORIES.CERTAINTY.name,
        categoryKey: 'CERTAINTY',
        explanation: 'Presumes deliberate guilt and covert intent as an established legal fact prior to independent confirmation.',
        alternative: 'alleged to have',
        severity: 'Critical',
      },
      {
        phrase: 'covering up',
        category: FRAMING_CATEGORIES.MISLEADING.name,
        categoryKey: 'MISLEADING',
        explanation: 'Infers active systemic conspiracy and intentional deception without presenting an evidentiary trail.',
        alternative: 'concealed or failed to disclose',
        severity: 'Medium',
      },
      {
        phrase: 'a MASSIVE scandal',
        category: FRAMING_CATEGORIES.EMOTIONAL.name,
        categoryKey: 'EMOTIONAL',
        explanation: 'Vague, intensifying label intended to inflate the scale without detailing specific events or official findings.',
        alternative: 'an incident',
        severity: 'Medium',
      },
    ],
    threeLayerAnalysis: {
      claim: {
        title: 'CLAIM ASSERTION',
        summary: 'Administrative leadership at an educational institution took deliberate steps to withhold information regarding an internal incident.',
        details: [
          'Subject: College authorities / administration',
          'Asserted Action: Covert suppression of an internal event',
          'Status of Claim: Unverified third-party assertion',
        ],
      },
      evidence: {
        title: 'EVIDENTIARY AUDIT',
        supplied: [
          'No empirical evidence provided in the text',
          'No official inquiry reports, dates, or named institutions cited',
        ],
        missing: [
          'Name or jurisdiction of the college institution',
          'Specific nature or timeline of the purported incident',
          'Official institutional response or judicial filing',
          'Corroboration from independent investigative bodies',
        ],
      },
      framing: {
        title: 'FRAMING & RHETORICAL TACTICS',
        tactics: [
          'All-caps attention-seeking exclamation ("SHOCKING!")',
          'Presumption of guilt framing ("CAUGHT") bypassing legal due process',
          'Vague superlatives ("MASSIVE scandal") substituting for concrete data',
        ],
      },
    },
    changesExplanation: [
      'Reframed uncorroborated accusation as an unverified allegation rather than established fact.',
      'Removed emotional capitalization ("SHOCKING!") and alarmist exclamation mark.',
      'Replaced accusatory certainty ("CAUGHT") with neutral investigative reporting attribution.',
      'Added explicit epistemic clarification noting the supplied text does not verify truthfulness.',
    ],
  },
  {
    id: 'case-atm-panic',
    title: 'Suspicious Bank Run Forward',
    pillLabel: 'Bank Run Panic',
    mode: 'messages',
    categoryLabel: 'Suspicious messages',
    original: "URGENT FORWARD TO EVERYONE YOU KNOW: Secret government mandate takes effect tonight shutting down all bank ATMs! Withdraw your cash immediately before it's too late!",
    neutralized: "A circulated message claims that upcoming government policies will suspend automated teller machine access. The text provides no verifiable citations or institutional confirmation.",
    epistemicNote: 'Removes artificial viral panic and social-engineering directives while documenting the absence of official regulatory sources.',
    framingSignals: [
      {
        phrase: 'URGENT FORWARD TO EVERYONE YOU KNOW:',
        category: FRAMING_CATEGORIES.URGENCY.name,
        categoryKey: 'URGENCY',
        explanation: 'Artificial chain-forwarding pressure designed to bypass critical evaluation through fear of missing out.',
        alternative: 'A circulated message states',
        severity: 'Critical',
      },
      {
        phrase: 'Secret government mandate',
        category: FRAMING_CATEGORIES.CONTEXT.name,
        categoryKey: 'CONTEXT',
        explanation: 'Posits clandestine regulatory action without referencing official gazettes, ministerial orders, or regulatory bodies.',
        alternative: 'unannounced regulatory measures',
        severity: 'High',
      },
      {
        phrase: 'shutting down all bank ATMs!',
        category: FRAMING_CATEGORIES.CERTAINTY.name,
        categoryKey: 'CERTAINTY',
        explanation: 'Categorical absolute claim asserting total national banking disruption without operational evidence.',
        alternative: 'may impact automated teller services',
        severity: 'High',
      },
      {
        phrase: "Withdraw your cash immediately before it's too late!",
        category: FRAMING_CATEGORIES.URGENCY.name,
        categoryKey: 'URGENCY',
        explanation: 'Coercive behavioral directive calculated to incite bank-run behavior and collective panic.',
        alternative: 'The message advises cash withdrawals',
        severity: 'Critical',
      },
    ],
    threeLayerAnalysis: {
      claim: {
        title: 'CLAIM ASSERTION',
        summary: 'Banking system automated teller machines will become inoperable tonight following an undisclosed governmental directive.',
        details: [
          'Subject: National banking infrastructure and ATM networks',
          'Asserted Action: Imminent total shutdown ordered by government',
          'Call to Action: Urgent immediate physical cash withdrawal',
        ],
      },
      evidence: {
        title: 'EVIDENTIARY AUDIT',
        supplied: [
          'Zero empirical citations, banking association notices, or central bank bulletins',
        ],
        missing: [
          'Executive order or regulatory gazette number',
          'Statements from financial institutions or banking oversight boards',
          'Geographic scope or jurisdiction details',
          'Independent journalistic verification',
        ],
      },
      framing: {
        title: 'FRAMING & RHETORICAL TACTICS',
        tactics: [
          'Urgency exploitation to trigger viral messaging forwards',
          'Fear-inducing scarcity framing ("before it\'s too late!")',
          'Conspiratorial secrecy premise ("Secret government mandate")',
        ],
      },
    },
    changesExplanation: [
      'Eliminated coercive distribution imperatives ("FORWARD TO EVERYONE") and panic triggers.',
      'Replaced categorical shutdown declarations with qualified claim attribution.',
      'Documented the total lack of verified regulatory or central banking references.',
    ],
  },
  {
    id: 'case-biolab-leak',
    title: 'Unverified Bio-Lab Allegation',
    pillLabel: 'Bio-Lab Leak',
    mode: 'misinformation',
    categoryLabel: 'Potential misinformation',
    original: 'Leaked whistleblower documents 100% PROVE secret bio-lab engineered catastrophic outbreak to manipulate upcoming elections.',
    neutralized: 'An unverified statement claims that leaked documents link research facility operations to a recent outbreak and political objectives. No corroborating documentation or chain-of-custody is provided.',
    epistemicNote: 'Preserves the thesis while neutralizing unwarranted mathematical certainty ("100% PROVE") and conspiratorial qualifiers.',
    framingSignals: [
      {
        phrase: 'Leaked whistleblower documents',
        category: FRAMING_CATEGORIES.ALLEGATION.name,
        categoryKey: 'ALLEGATION',
        explanation: 'Invokes anonymous insider disclosure without providing document hashes, provenance, or credentialed verification.',
        alternative: 'Purported disclosure files',
        severity: 'High',
      },
      {
        phrase: '100% PROVE',
        category: FRAMING_CATEGORIES.CERTAINTY.name,
        categoryKey: 'CERTAINTY',
        explanation: 'Absolute certainty claim designed to discourage skepticism regarding complex epidemiological and geopolitical assertions.',
        alternative: 'purport to indicate',
        severity: 'Critical',
      },
      {
        phrase: 'secret bio-lab engineered',
        category: FRAMING_CATEGORIES.MISLEADING.name,
        categoryKey: 'MISLEADING',
        explanation: 'Sensational framing leveraging cinematic tropes rather than scientific genomic sequencing or peer-reviewed records.',
        alternative: 'a research facility was connected to',
        severity: 'High',
      },
      {
        phrase: 'catastrophic outbreak to manipulate upcoming elections',
        category: FRAMING_CATEGORIES.EMOTIONAL.name,
        categoryKey: 'EMOTIONAL',
        explanation: 'Attributes coordinated political intent and deliberate biological warfare without corroborating forensic evidence.',
        alternative: 'an outbreak with asserted political implications',
        severity: 'High',
      },
    ],
    threeLayerAnalysis: {
      claim: {
        title: 'CLAIM ASSERTION',
        summary: 'A biological pathogen was engineered intentionally by a covert facility with the explicit goal of altering election outcomes.',
        details: [
          'Source Material: Unspecified leaked whistleblower records',
          'Asserted Mechanism: Engineered pathogen release',
          'Asserted Motivation: Electoral manipulation',
        ],
      },
      evidence: {
        title: 'EVIDENTIARY AUDIT',
        supplied: [
          'No documents, forensic hashes, or primary source texts attached',
        ],
        missing: [
          'Document chain-of-custody or metadata authenticity',
          'Peer-reviewed genomic analysis or phylogenetic tree confirmation',
          'Verification from non-partisan oversight bodies or international health monitors',
        ],
      },
      framing: {
        title: 'FRAMING & RHETORICAL TACTICS',
        tactics: [
          'False mathematical certainty ("100% PROVE")',
          'Conspiratorial agency projection ("secret bio-lab")',
          'Affective political weaponization tying health events to election cycles',
        ],
      },
    },
    changesExplanation: [
      'Downgraded absolute certainty claim ("100% PROVE") to unverified evidentiary assertion.',
      'Identified lack of document chain-of-custody and verified whistleblower provenance.',
      'Replaced incendiary phrasing with neutral descriptive language while preserving claim thesis.',
    ],
  },
  {
    id: 'case-polarizing-post',
    title: 'Ad Hominem Political Engagement Bait',
    pillLabel: 'Outrage Bait',
    mode: 'manipulative',
    categoryLabel: 'Manipulative language',
    original: 'Only brainwashed sheep believe the mainstream narrative. Retweet if you want the corrupt establishment ARRESTED immediately!',
    neutralized: 'A social post rejects prevailing news accounts and calls on readers to endorse legal actions against public figures. The post expresses subjective political sentiment rather than empirical findings.',
    epistemicNote: 'Filters out dehumanizing ad hominem attacks and engagement-bait algorithms while clearly demarcating subjective political opinion from factual reporting.',
    framingSignals: [
      {
        phrase: 'Only brainwashed sheep',
        category: FRAMING_CATEGORIES.EMOTIONAL.name,
        categoryKey: 'EMOTIONAL',
        explanation: 'Dehumanizing insult aimed at invalidating opposing viewpoints without engaging with factual arguments.',
        alternative: 'Those accepting prevailing reports',
        severity: 'Critical',
      },
      {
        phrase: 'mainstream narrative',
        category: FRAMING_CATEGORIES.MISLEADING.name,
        categoryKey: 'MISLEADING',
        explanation: 'Monolithic dismissal of varied independent reporting sources to foster epistemic closure.',
        alternative: 'prevailing media coverage',
        severity: 'Medium',
      },
      {
        phrase: 'Retweet if you want',
        category: FRAMING_CATEGORIES.URGENCY.name,
        categoryKey: 'URGENCY',
        explanation: 'Algorithmic engagement tactic that exploits emotional tribalism to maximize distribution velocity.',
        alternative: '(Omit engagement command)',
        severity: 'High',
      },
      {
        phrase: 'the corrupt establishment ARRESTED immediately!',
        category: FRAMING_CATEGORIES.EMOTIONAL.name,
        categoryKey: 'EMOTIONAL',
        explanation: 'Moral condemnation coupled with demands for summary legal action without specifying statutory violations or evidence.',
        alternative: 'legal scrutiny of public institutions',
        severity: 'High',
      },
    ],
    threeLayerAnalysis: {
      claim: {
        title: 'CLAIM ASSERTION',
        summary: 'Mainstream news reports are fundamentally untruthful, and institutional leadership should face immediate detention.',
        details: [
          'Target: General news media and public officials',
          'Asserted Position: Institutional corruption requiring criminal detention',
          'Underlying Nature: Affective political expression / opinion',
        ],
      },
      evidence: {
        title: 'EVIDENTIARY AUDIT',
        supplied: [
          'No factual evidence, legal charges, or factual counter-arguments provided',
        ],
        missing: [
          'Specific statutory infractions or criminal penal codes violated',
          'Identities of specific accused officials or institutional bodies',
          'Substantiated counter-evidence refuting specific news reports',
        ],
      },
      framing: {
        title: 'FRAMING & RHETORICAL TACTICS',
        tactics: [
          'Dehumanizing outgroup derogation ("brainwashed sheep")',
          'In-group solidarity baiting to drive social share metrics',
          'Vague criminalization of political opponents without due process',
        ],
      },
    },
    changesExplanation: [
      'Removed dehumanizing ad hominem insults ("brainwashed sheep").',
      'Categorized content as subjective political advocacy rather than factual reporting.',
      'Neutralized punitive demands into descriptive references to proposed legal scrutiny.',
    ],
  },
  {
    id: 'case-science-breakthrough',
    title: 'Sensational Medical Science Claim',
    pillLabel: 'Medical Miracle',
    mode: 'headlines',
    categoryLabel: 'Sensationalized headlines',
    original: 'Scientists STUNNED as revolutionary breakthrough renders all modern medicine completely obsolete overnight!',
    neutralized: 'An article claims that recent scientific research significantly challenges established medical practices. The excerpt does not cite published study data, peer review, or clinical trial results.',
    epistemicNote: 'Preserves the topic of scientific innovation while eliminating hyperbolic absolutes ("completely obsolete overnight") and emotional dramatization.',
    framingSignals: [
      {
        phrase: 'Scientists STUNNED',
        category: FRAMING_CATEGORIES.SENSATIONAL.name,
        categoryKey: 'SENSATIONAL',
        explanation: 'Anthropomorphic emotional exaggeration depicting researchers in collective shock to manufacture wonder.',
        alternative: 'Researchers report findings',
        severity: 'High',
      },
      {
        phrase: 'revolutionary breakthrough',
        category: FRAMING_CATEGORIES.EMOTIONAL.name,
        categoryKey: 'EMOTIONAL',
        explanation: 'Promotional superlative commonly used in clickbait journalism to inflate incremental research.',
        alternative: 'new scientific findings',
        severity: 'Medium',
      },
      {
        phrase: 'renders all modern medicine completely obsolete',
        category: FRAMING_CATEGORIES.CERTAINTY.name,
        categoryKey: 'CERTAINTY',
        explanation: 'Categorical absolute overstatement dismissing established pharmacology without clinical trial verification.',
        alternative: 'may challenge certain conventional therapies',
        severity: 'Critical',
      },
      {
        phrase: 'overnight!',
        category: FRAMING_CATEGORIES.SENSATIONAL.name,
        categoryKey: 'SENSATIONAL',
        explanation: 'Artificial temporal compression framing iterative scientific discovery as instantaneous disruption.',
        alternative: '(Omit temporal exaggeration)',
        severity: 'Medium',
      },
    ],
    threeLayerAnalysis: {
      claim: {
        title: 'CLAIM ASSERTION',
        summary: 'A new scientific finding has invalidated the entirety of existing medical practice and pharmacological treatments.',
        details: [
          'Domain: Medical science and clinical therapeutics',
          'Asserted Impact: Comprehensive invalidation of existing treatments',
          'Asserted Horizon: Immediate overnight transformation',
        ],
      },
      evidence: {
        title: 'EVIDENTIARY AUDIT',
        supplied: [
          'No journal name, DOI link, sample size, or clinical trial phase provided',
        ],
        missing: [
          'Citations in indexed peer-reviewed medical publications',
          'Human clinical trial methodology and replication datasets',
          'Review or consensus from medical regulatory agencies (e.g., FDA, EMA, WHO)',
        ],
      },
      framing: {
        title: 'FRAMING & RHETORICAL TACTICS',
        tactics: [
          'Breathless superlatives ("STUNNED", "revolutionary")',
          'Totalizing exaggeration ("renders all modern medicine completely obsolete")',
          'Instantaneous timeline distortion ("overnight!")',
        ],
      },
    },
    changesExplanation: [
      'Softened categorical claims of total medical obsolescence to realistic descriptive terms.',
      'Documented the absence of peer-reviewed journal citations or clinical trial evidence.',
      'Removed emotional exclamation points and anthropomorphic shock framing.',
    ],
  },
];

// Heuristic keyword definitions for custom input analysis
const SENSATIONAL_WORDS = [
  'shocking', 'bombshell', 'exposed', 'caught', 'massive', 'mind-blowing',
  'unbelievable', 'insane', 'jaw-dropping', 'explosive', 'terrifying',
  'horrific', 'nightmare', 'disaster', 'scandal', 'bizarre', 'stunned',
  'shatters', 'destroys', 'obliterates', 'panic', 'chaos', 'furious'
];

const CERTAINTY_WORDS = [
  '100% prove', '100% proved', 'undeniable', 'indisputable', 'conclusively',
  'definitely', 'absolutely', 'guaranteed', 'fact', 'facts', 'irrefutable',
  'unquestionable', 'everyone knows', 'without a doubt', 'total proof',
  'proven fact', 'completely proven'
];

const URGENCY_WORDS = [
  'urgent', 'forward immediately', 'forward to everyone', 'before it\'s too late',
  'act now', 'wake up', 'share this before it\'s deleted', 'don\'t wait',
  'retweet if', 'share if you agree', 'breaking news', 'warning', 'alert'
];

const EMOTIONAL_ADJECTIVES = [
  'corrupt', 'evil', 'vile', 'disgusting', 'sick', 'monstrous',
  'brainwashed', 'sheep', 'crooked', 'shameless', 'traitor', 'tyrant',
  'bloodsucking', 'criminal', 'hypocrites', 'puppet', 'scum'
];

const CONSPIRACY_MARKERS = [
  'secret government', 'they don\'t want you to know', 'cover up', 'cover-up',
  'hidden agenda', 'cabal', 'globalists', 'shadow government', 'orchestrated',
  'deep state', 'engineered crisis', 'bio-lab', 'faked', 'false flag'
];

/**
 * Client-Side Heuristic Analyzer for arbitrary user text
 * Parses sentences, detects framing signals, computes three layers,
 * and synthesizes an epistemically qualified neutralized version.
 */
export function analyzeContentHeuristic(rawText, mode = 'all') {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return null;
  }

  const text = rawText.trim();

  // 1. Check if user input closely matches one of our predefined sample cases
  const matchingSample = SAMPLE_CASES.find(sc => 
    sc.original.toLowerCase().trim() === text.toLowerCase() ||
    text.toLowerCase().includes(sc.original.toLowerCase().slice(0, 30))
  );

  if (matchingSample) {
    return {
      ...matchingSample,
      isDemoSample: true,
      diffChunks: computeSimpleDiff(matchingSample.original, matchingSample.neutralized),
    };
  }

  // 2. Perform Dynamic Heuristic Framing Analysis
  const detectedSignals = [];
  const lowerText = text.toLowerCase();

  // Helper to test words and extract exact casing from original
  const checkMatches = (list, category, severity, defaultAlt, explanationGen) => {
    list.forEach(phrase => {
      const regex = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        const foundStr = match[0];
        // avoid duplicate overlaps
        if (!detectedSignals.some(s => s.phrase.toLowerCase() === foundStr.toLowerCase())) {
          detectedSignals.push({
            phrase: foundStr,
            category: category.name,
            categoryKey: category.id.toUpperCase(),
            severity,
            alternative: defaultAlt(foundStr),
            explanation: explanationGen(foundStr),
          });
        }
      }
    });
  };

  // Capitalization check (Words in ALL CAPS of length >= 3)
  const allCapsWords = text.match(/\b[A-Z]{3,}\b/g) || [];
  allCapsWords.forEach(word => {
    if (!['THE', 'AND', 'FOR', 'NOT', 'BUT', 'ALL', 'OUT'].includes(word)) {
      if (!detectedSignals.some(s => s.phrase === word)) {
        detectedSignals.push({
          phrase: word,
          category: FRAMING_CATEGORIES.SENSATIONAL.name,
          categoryKey: 'SENSATIONAL',
          severity: 'Medium',
          alternative: word.charAt(0) + word.slice(1).toLowerCase(),
          explanation: `Capitalized word intended to visually magnify urgency or emotional impact.`,
        });
      }
    }
  });

  // Multiple punctuation (!! or ?!)
  const punctMatch = text.match(/[!?]{2,}/g);
  if (punctMatch) {
    punctMatch.forEach(p => {
      if (!detectedSignals.some(s => s.phrase === p)) {
        detectedSignals.push({
          phrase: p,
          category: FRAMING_CATEGORIES.SENSATIONAL.name,
          categoryKey: 'SENSATIONAL',
          severity: 'Low',
          alternative: '.',
          explanation: 'Excessive punctuation used to manufacture dramatic tension.',
        });
      }
    });
  }

  // Check categories
  checkMatches(
    SENSATIONAL_WORDS,
    FRAMING_CATEGORIES.SENSATIONAL,
    'High',
    () => 'noteworthy or significant',
    w => `Sensationalized keyword ('${w}') used to prime dramatic reaction rather than factual inquiry.`
  );

  checkMatches(
    CERTAINTY_WORDS,
    FRAMING_CATEGORIES.CERTAINTY,
    'Critical',
    () => 'purports to indicate',
    w => `Unwarranted certainty statement ('${w}') asserting unverified conclusions as indisputable fact.`
  );

  checkMatches(
    URGENCY_WORDS,
    FRAMING_CATEGORIES.URGENCY,
    'High',
    () => '(omit urgency prompt)',
    w => `Artificial pressure trigger ('${w}') urging immediate reaction or viral redistribution.`
  );

  checkMatches(
    EMOTIONAL_ADJECTIVES,
    FRAMING_CATEGORIES.EMOTIONAL,
    'High',
    () => 'critics of the matter',
    w => `Emotionally charged or pejorative adjective ('${w}') substituting for substantive evidence.`
  );

  checkMatches(
    CONSPIRACY_MARKERS,
    FRAMING_CATEGORIES.MISLEADING,
    'Critical',
    () => 'unverified institutional allegations',
    w => `Conspiratorial framing ('${w}') suggesting clandestine collusion without public verification.`
  );

  // 3. Build Neutralized Rewriting
  let neutralized = text;

  // Replace all detected phrases with neutral alternatives or softened phrasing
  // Sort by length descending to replace longest phrases first
  const sortedSignals = [...detectedSignals].sort((a, b) => b.phrase.length - a.phrase.length);

  sortedSignals.forEach(signal => {
    const alt = signal.alternative.startsWith('(') ? '' : signal.alternative;
    const reg = new RegExp(escapeRegExp(signal.phrase), 'g');
    neutralized = neutralized.replace(reg, alt);
  });

  // Clean double spaces and lingering punctuation
  neutralized = neutralized
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,!?:])/g, '$1')
    .replace(/[!?]{2,}/g, '.')
    .replace(/!/g, '.')
    .trim();

  // If text contained strong allegations or lacks verified grounding, frame epistemically
  const hasStrongAllegations = detectedSignals.some(s => 
    ['CERTAINTY', 'ALLEGATION', 'MISLEADING', 'SENSATIONAL'].includes(s.categoryKey)
  );

  if (hasStrongAllegations) {
    // Wrap with objective journalistic qualification
    if (!neutralized.toLowerCase().startsWith('a report') && !neutralized.toLowerCase().startsWith('an unverified')) {
      neutralized = `A statement asserts that ${decapitalizeFirstLetter(neutralized)} The supplied text does not provide independent corroboration for this claim.`;
    }
  } else if (detectedSignals.length === 0) {
    neutralized = text;
  }

  // 4. Construct Three-Layer Analysis
  const threeLayerAnalysis = {
    claim: {
      title: 'CLAIM ASSERTION',
      summary: extractCoreClaim(text),
      details: [
        `Asserted Premise: ${summarizePremise(text)}`,
        `Subject Identified: ${extractSubject(text)}`,
        `Epistemic Status: ${detectedSignals.length > 0 ? 'Uncorroborated external statement' : 'Standard descriptive statement'}`,
      ],
    },
    evidence: {
      title: 'EVIDENTIARY AUDIT',
      supplied: extractSuppliedEvidence(text),
      missing: [
        'Named author or verifiable primary source credentials',
        'Official documents, public registers, or forensic artifacts',
        'Cross-corroboration by independent investigative organizations',
        'Direct chain-of-custody or temporal verification metadata',
      ],
    },
    framing: {
      title: 'FRAMING & RHETORICAL TACTICS',
      tactics: detectedSignals.length > 0
        ? detectedSignals.slice(0, 4).map(s => `${s.category}: Flagged "${s.phrase}" — ${s.explanation}`)
        : ['The input uses predominantly standard narrative phrasing with minimal sensational framing.'],
    },
  };

  // 5. Construct Changes Explanation
  const changesExplanation = detectedSignals.length > 0
    ? [
        `Identified ${detectedSignals.length} potential framing signal${detectedSignals.length > 1 ? 's' : ''} across ${[...new Set(detectedSignals.map(s => s.category))].join(', ')}.`,
        'Preserved the underlying substantive claim while converting assertive claims into qualified observations.',
        'Neutralized emotionally charged vocabulary and stripped hyperbolic punctuation.',
        'Added explicit epistemic demarcation indicating that neutral phrasing does not imply factual accuracy.',
      ]
    : [
        'The submitted text exhibited minimal sensational markers.',
        'Preserved original language while verifying lack of manipulative framing devices.',
      ];

  const epistemicNote = detectedSignals.length > 0
    ? 'Preserved the core claim while qualifying certainty and documenting the absence of independent verification.'
    : 'No overt emotional manipulation detected; content presented with standard rhetorical framing.';

  return {
    id: `custom-analysis-${Date.now()}`,
    title: 'Custom Content Framing Analysis',
    mode,
    categoryLabel: ANALYSIS_MODES.find(m => m.id === mode)?.label || 'General Content Analysis',
    original: text,
    neutralized,
    epistemicNote,
    framingSignals: detectedSignals,
    threeLayerAnalysis,
    changesExplanation,
    isDemoSample: false,
    diffChunks: computeSimpleDiff(text, neutralized),
  };
}

/**
 * Text diffing helper: generates list of chunks with type: 'same' | 'added' | 'removed'
 */
export function computeSimpleDiff(original = '', neutralized = '') {
  const origWords = original.split(/\s+/).filter(Boolean);
  const neutWords = neutralized.split(/\s+/).filter(Boolean);

  const chunks = [];
  let i = 0;
  let j = 0;

  while (i < origWords.length || j < neutWords.length) {
    if (i < origWords.length && j < neutWords.length && origWords[i].toLowerCase() === neutWords[j].toLowerCase()) {
      chunks.push({ type: 'same', text: neutWords[j] + ' ' });
      i++;
      j++;
    } else {
      // Look ahead for match
      let matchInNeut = neutWords.slice(j, j + 4).findIndex(w => i < origWords.length && w.toLowerCase() === origWords[i].toLowerCase());
      let matchInOrig = origWords.slice(i, i + 4).findIndex(w => j < neutWords.length && w.toLowerCase() === neutWords[j].toLowerCase());

      if (matchInNeut !== -1) {
        // Words added in neutralized
        for (let k = 0; k < matchInNeut; k++) {
          chunks.push({ type: 'added', text: neutWords[j + k] + ' ' });
        }
        j += matchInNeut;
      } else if (matchInOrig !== -1) {
        // Words removed from original
        for (let k = 0; k < matchInOrig; k++) {
          chunks.push({ type: 'removed', text: origWords[i + k] + ' ' });
        }
        i += matchInOrig;
      } else {
        if (i < origWords.length) {
          chunks.push({ type: 'removed', text: origWords[i] + ' ' });
          i++;
        }
        if (j < neutWords.length) {
          chunks.push({ type: 'added', text: neutWords[j] + ' ' });
          j++;
        }
      }
    }
  }

  return chunks;
}

// Helpers
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function decapitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function extractCoreClaim(text) {
  const firstSentence = text.split(/[.!?]/)[0]?.trim();
  if (!firstSentence) return 'The supplied excerpt asserts an unspecified proposition.';
  return `The text contends that: "${firstSentence.slice(0, 140)}${firstSentence.length > 140 ? '...' : ''}"`;
}

function summarizePremise(text) {
  const words = text.split(/\s+/).slice(0, 12).join(' ');
  return `${words}...`;
}

function extractSubject(text) {
  const words = text.split(/\s+/);
  return words.slice(0, 3).join(' ') || 'Unspecified actors';
}

function extractSuppliedEvidence(text) {
  const hasNumbers = /\b\d+\b/.test(text);
  const hasQuotes = /["']/.test(text);
  const hasLinks = /https?:\/\//i.test(text);

  const evidence = [];
  if (hasNumbers) evidence.push('Includes numerical references within body text');
  if (hasQuotes) evidence.push('Contains quotation marks attributing spoken remarks');
  if (hasLinks) evidence.push('Embeds hyperlink pointer in content');

  if (evidence.length === 0) {
    evidence.push('No primary documents, scientific citations, or official statements provided in text.');
  }

  return evidence;
}
