import { HttpError } from '../utils/http-error.js';

function percentileRank(values, value) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.filter((v) => v <= value).length;
  return (count / sorted.length) * 100;
}

export function runPayFairnessAnalysis(rows, opts) {
  // Filter rows with null/undefined/invalid salary to avoid NaN distorting percentiles
  const validRows = rows.filter((r) => r.salary != null && !isNaN(Number(r.salary)));
  const excludedCount = rows.length - validRows.length;

  if (!validRows.length) {
    throw new HttpError(400, 'No score/salary data available for selected cohort.');
  }

  const scoreVals = validRows.map((r) => Number(r.score));
  const payVals = validRows.map((r) => Number(r.salary));

  const scoreTopPct = opts.scoreTopPct ?? 75;
  const scoreBottomPct = opts.scoreBottomPct ?? 25;
  const payTopPct = opts.payTopPct ?? 75;
  const payBottomPct = opts.payBottomPct ?? 25;

  const results = validRows.map((r) => {
    const scorePercentile = percentileRank(scoreVals, Number(r.score));
    const payPercentile = percentileRank(payVals, Number(r.salary));

    let quadrant;
    if (scorePercentile >= scoreTopPct && payPercentile < payTopPct) {
      // High performer, underpaid
      quadrant = opts.starsLabel || 'stars_underpaid';
    } else if (scorePercentile >= scoreTopPct && payPercentile >= payTopPct) {
      // High performer, well paid — retain
      quadrant = 'retained_star';
    } else if (scorePercentile <= scoreBottomPct && payPercentile >= payTopPct) {
      // Low performer, overpaid
      quadrant = opts.overpaidLabel || 'overpaid_underperformer';
    } else {
      // Low performer, low pay
      quadrant = 'low_investment';
    }

    return {
      ...r,
      scorePercentile: Number(scorePercentile.toFixed(2)),
      payPercentile: Number(payPercentile.toFixed(2)),
      quadrant,
    };
  });

  return { results, excludedCount };
}
