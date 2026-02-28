import { HttpError } from '../utils/http-error.js';

function percentileRank(values, value) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.filter((v) => v <= value).length;
  return (count / sorted.length) * 100;
}

export function runPayFairnessAnalysis(rows, opts) {
  if (!rows.length) {
    throw new HttpError(400, 'No score/salary data available for selected cohort.');
  }

  const scoreVals = rows.map((r) => Number(r.score));
  const payVals = rows.map((r) => Number(r.salary));

  const scoreTopPct = opts.scoreTopPct ?? 75;
  const scoreBottomPct = opts.scoreBottomPct ?? 25;
  const payTopPct = opts.payTopPct ?? 50;
  const payBottomPct = opts.payBottomPct ?? 50;

  return rows.map((r) => {
    const scorePercentile = percentileRank(scoreVals, Number(r.score));
    const payPercentile = percentileRank(payVals, Number(r.salary));

    let quadrant = 'balanced';
    if (scorePercentile >= scoreTopPct && payPercentile <= payBottomPct) {
      quadrant = opts.starsLabel || 'stars_underpaid';
    } else if (scorePercentile <= scoreBottomPct && payPercentile >= payTopPct) {
      quadrant = opts.overpaidLabel || 'overpaid_underperformer';
    }

    return {
      ...r,
      scorePercentile: Number(scorePercentile.toFixed(2)),
      payPercentile: Number(payPercentile.toFixed(2)),
      quadrant,
    };
  });
}
