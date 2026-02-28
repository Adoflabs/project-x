const defaultKeywords = ['burnout', 'resign', 'unhappy', 'leaving'];

export function evaluateFlightRisk(employeeContext, config) {
  const riskConfig = {
    scoreDropThreshold: config?.scoreDropThreshold ?? 15,
    missedCheckinsThreshold: config?.missedCheckinsThreshold ?? 2,
    peerFeedbackFloor: config?.peerFeedbackFloor ?? 3,
    keywords: config?.keywords?.length ? config.keywords : defaultKeywords,
    tenureSensitivity: Boolean(config?.tenureSensitivity),
  };

  const reasons = [];

  if ((employeeContext.scoreDrop || 0) >= riskConfig.scoreDropThreshold) {
    reasons.push(`score_drop_${employeeContext.scoreDrop}`);
  }

  if ((employeeContext.missedCheckins || 0) >= riskConfig.missedCheckinsThreshold) {
    reasons.push(`missed_checkins_${employeeContext.missedCheckins}`);
  }

  if ((employeeContext.peerFeedbackAvg || 5) < riskConfig.peerFeedbackFloor) {
    reasons.push(`peer_feedback_below_${riskConfig.peerFeedbackFloor}`);
  }

  const notesText = (employeeContext.notes || '').toLowerCase();
  const matchedKeyword = riskConfig.keywords.find((k) => notesText.includes(String(k).toLowerCase()));
  if (matchedKeyword) {
    reasons.push(`keyword_${matchedKeyword}`);
  }

  if (riskConfig.tenureSensitivity && (employeeContext.tenureMonths || 0) <= 6 && reasons.length > 0) {
    reasons.push('early_tenure_sensitivity');
  }

  return {
    flagged: reasons.length > 0,
    reasons,
  };
}
