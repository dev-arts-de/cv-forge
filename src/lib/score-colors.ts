export function getScoreColor(score: number): string {
  if (score >= 60) return '#16A34A'
  if (score >= 30) return '#D97706'
  return '#DC2626'
}

export function getScoreBg(score: number): string {
  if (score >= 60) return '#DCFCE7'
  if (score >= 30) return '#FEF3C7'
  return '#FEE2E2'
}

export function scoreToStatus(score: number): 'green' | 'yellow' | 'red' {
  if (score >= 60) return 'green'
  if (score >= 30) return 'yellow'
  return 'red'
}
