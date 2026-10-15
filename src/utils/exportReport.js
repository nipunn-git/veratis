// Generates and downloads a complete forensic investigation report

export function generateReportFile(investigation) {
  const timestamp = new Date().toISOString();
  const content = `# VERATIS FORENSIC MEDIA INVESTIGATION REPORT
================================================================================
CASE IDENTIFIER: ${investigation.code}
CASE TITLE:      ${investigation.title}
DATE COMPILED:    ${timestamp}
INVESTIGATOR:    ${investigation.leadInvestigator}
THREAT LEVEL:    ${investigation.threatLevel}
CATEGORY:        ${investigation.category}

--------------------------------------------------------------------------------
1. EXECUTIVE VERDICT & PROBABILITY ASSESSMENT
--------------------------------------------------------------------------------
DETERMINATION:     ${investigation.verdict}
CONFIDENCE RATING: ${investigation.verdictConfidence}%
SUBJECT SUMMARY:   ${investigation.subject}

--------------------------------------------------------------------------------
2. MULTI-AXIS DECEPTION RADAR (DEVIATION INDEX / 100)
--------------------------------------------------------------------------------
- Visual Signal Deviation:      ${investigation.radarScores.visual} / 100
  Analysis: ${investigation.radarAnalysis.visual}

- Contextual Anomaly:           ${investigation.radarScores.contextual} / 100
  Analysis: ${investigation.radarAnalysis.contextual}

- Temporal Desynchronization:   ${investigation.radarScores.temporal} / 100
  Analysis: ${investigation.radarAnalysis.temporal}

- Digital Source Provenance:    ${investigation.radarScores.source} / 100
  Analysis: ${investigation.radarAnalysis.source}

- Claim Falsification Score:    ${investigation.radarScores.claim} / 100
  Analysis: ${investigation.radarAnalysis.claim}

--------------------------------------------------------------------------------
3. EVIDENCE AUTOPSY & REGION-OF-INTEREST FINDINGS
--------------------------------------------------------------------------------
${investigation.annotations.map((ann, idx) => `
[FINDING #${idx + 1}] ${ann.title} (${ann.severity.toUpperCase()})
Location: [x: ${ann.x}%, y: ${ann.y}%]
Label:    ${ann.label}
Details:  ${ann.detail}
`).join('')}

--------------------------------------------------------------------------------
4. CHRONOLOGICAL EVIDENCE TIMELINE
--------------------------------------------------------------------------------
${investigation.timeline.map(item => `
[${item.date} // ${item.time}] - ${item.event.toUpperCase()}
Platform:    ${item.platform}
Status:      ${item.status.toUpperCase()}
Observation: ${item.description}
`).join('')}

--------------------------------------------------------------------------------
5. COMPETING HYPOTHESES & PROBABILITY WEIGHING
--------------------------------------------------------------------------------
${investigation.competingHypotheses.map(hyp => `
* HYPOTHESIS: ${hyp.title} (${hyp.probability}% PROBABILITY - ${hyp.status})
  Rationale: ${hyp.description}
  Supporting Evidence:
    ${hyp.supporting.length > 0 ? hyp.supporting.map(s => `+ ${s}`).join('\n    ') : 'None'}
  Contradicting Evidence:
    ${hyp.contradicting.length > 0 ? hyp.contradicting.map(c => `- ${c}`).join('\n    ') : 'None'}
`).join('\n')}

--------------------------------------------------------------------------------
6. UNCERTAINTY MATRIX & EPISTEMIC LIMITATIONS
--------------------------------------------------------------------------------
WHAT IS DEFINITIVELY KNOWN:
${investigation.uncertaintyEngine.known.map(k => `[KNOWN]     ${k}`).join('\n')}

WHAT IS CURRENTLY UNKNOWN / INSUFFICIENT DATA:
${investigation.uncertaintyEngine.unknown.map(u => `[UNKNOWN]   ${u}`).join('\n')}

WHAT IS EPISTEMICALLY UNTESTABLE:
${investigation.uncertaintyEngine.untestable.map(t => `[UNTESTABLE] ${t}`).join('\n')}

================================================================================
DISCLAIMER & INTEGRITY NOTICE:
VERATIS produces investigative forensic hypotheses based on mathematical, 
frequency-domain, optical, and contextual correlation. This dossier is an 
open-architecture verification record intended for journalistic, intelligence, 
and legal verification scrutiny.
================================================================================
`;

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `VERATIS_${investigation.code}_FORENSIC_DOSSIER.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
