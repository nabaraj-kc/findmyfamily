import { MockCase } from '../data/mockCases';

export interface MatchResult {
  score: number;
  reasons: string[];
}

export interface MatchPair {
  missing: MockCase;
  found: MockCase;
  result: MatchResult;
}

export function calculateMatchConfidence(missing: MockCase, found: MockCase): MatchResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Gender Match (Mandatory unless unknown)
  // Simple check since our data only has 'male' / 'female' / 'other'
  if (missing.gender && found.gender && missing.gender !== found.gender) {
    if (missing.gender !== 'other' && found.gender !== 'other') {
      return { score: 0, reasons: ['Gender mismatch'] };
    }
  } else {
    score += 10;
    reasons.push('Gender match');
  }

  // 2. Age Proximity
  if (missing.age && found.age) {
    const ageDiff = Math.abs(missing.age - found.age);
    if (ageDiff <= 2) {
      score += 40;
      reasons.push(`Age within 2 years (${missing.age} vs ${found.age})`);
    } else if (ageDiff <= 5) {
      score += 20;
      reasons.push(`Age within 5 years (${missing.age} vs ${found.age})`);
    }
  }

  // 3. Location / District
  if (missing.districtId === found.districtId) {
    score += 30;
    reasons.push('Same district');
  }

  // 4. Keyword Overlap (Features & Clothing)
  const getKeywords = (text?: string) => {
    if (!text) return [];
    return text.toLowerCase().split(/[\s,.-]+/).filter(w => w.length > 3);
  };

  const missingKeywords = [...getKeywords(missing.features), ...getKeywords(missing.clothing)];
  const foundKeywords = [...getKeywords(found.features), ...getKeywords(found.clothing)];

  let keywordMatches = 0;
  const matchedWords: string[] = [];
  
  missingKeywords.forEach(kw => {
    if (foundKeywords.includes(kw) && !matchedWords.includes(kw)) {
      keywordMatches++;
      matchedWords.push(kw);
    }
  });

  if (keywordMatches > 0) {
    const points = Math.min(30, keywordMatches * 10);
    score += points;
    reasons.push(`Matched keywords: ${matchedWords.join(', ')}`);
  }

  // Normalize max score to 100
  score = Math.min(100, score);

  return { score, reasons };
}

export function getHighConfidenceMatches(cases: MockCase[], threshold = 50): MatchPair[] {
  const missingCases = cases.filter(c => c.status === 'missing');
  const foundCases = cases.filter(c => c.status === 'safe' || c.status === 'injured');

  const matches: MatchPair[] = [];

  missingCases.forEach(missing => {
    foundCases.forEach(found => {
      const result = calculateMatchConfidence(missing, found);
      if (result.score >= threshold) {
        matches.push({ missing, found, result });
      }
    });
  });

  // Sort by highest score first
  return matches.sort((a, b) => b.result.score - a.result.score);
}
