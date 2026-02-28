import { HttpError } from '../utils/http-error.js';

export function validateFormulaConfig(config) {
  const components = config?.components || [];
  if (components.length < 2 || components.length > 4) {
    throw new HttpError(400, 'Formula must include between 2 and 4 components.');
  }

  const total = components.reduce((sum, c) => sum + Number(c.weight || 0), 0);
  if (Math.round(total) !== 100) {
    throw new HttpError(400, 'Component weights must sum to 100%.');
  }

  for (const c of components) {
    if (![5, 10, 100].includes(Number(c.scale))) {
      throw new HttpError(400, `Unsupported rating scale for ${c.name}. Use 5, 10, or 100.`);
    }
  }
}

function normalizeToHundred(value, scale) {
  return (Number(value) / Number(scale)) * 100;
}

export function calculateScore(config, componentValues, managerOverridePct = 0) {
  validateFormulaConfig(config);

  if (managerOverridePct < -10 || managerOverridePct > 10) {
    throw new HttpError(400, 'Manager override must be between -10% and +10%.');
  }

  let weighted = 0;
  for (const component of config.components) {
    const raw = componentValues?.[component.name];
    if (raw === undefined || raw === null) {
      throw new HttpError(400, `Missing component value for ${component.name}`);
    }

    const normalized = normalizeToHundred(raw, component.scale);
    weighted += normalized * (Number(component.weight) / 100);
  }

  const overrideMultiplier = 1 + managerOverridePct / 100;
  const finalScore = Math.max(0, Math.min(100, weighted * overrideMultiplier));

  return {
    baseScore: Number(weighted.toFixed(2)),
    finalScore: Number(finalScore.toFixed(2)),
    trend: null,
  };
}

export function getScoreTrend(historyNewestFirst = []) {
  if (historyNewestFirst.length < 2) return '→';
  const [current, previous] = historyNewestFirst;
  if (current.final_score > previous.final_score) return '↗';
  if (current.final_score < previous.final_score) return '↘';
  return '→';
}
