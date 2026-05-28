export const COMMON_PATTERNS = [
  '123456', 'password', 'senha', 'admin', 'qwerty', 'abc123',
  'letmein', 'welcome', 'monkey', 'dragon', 'master', 'login',
  '111111', '000000', '123123', 'iloveyou', 'sunshine', 'princess',
]

export function getCharsetSize(pw) {
  let size = 0
  if (/[a-z]/.test(pw)) size += 26
  if (/[A-Z]/.test(pw)) size += 26
  if (/[0-9]/.test(pw)) size += 10
  if (/[^a-zA-Z0-9]/.test(pw)) size += 32
  return size
}

export function calcEntropy(pw) {
  const cs = getCharsetSize(pw)
  if (!cs || !pw.length) return 0
  return Math.round(pw.length * Math.log2(cs))
}

export function calcScore(pw) {
  let score = 0
  score += Math.min(pw.length * 4, 40)
  if (/[a-z]/.test(pw)) score += 5
  if (/[A-Z]/.test(pw)) score += 10
  if (/[0-9]/.test(pw)) score += 10
  if (/[^a-zA-Z0-9]/.test(pw)) score += 15

  const lower = pw.toLowerCase()
  for (const p of COMMON_PATTERNS) {
    if (lower.includes(p)) { score -= 25; break }
  }

  if (/(.)\1{2,}/.test(pw)) score -= 10

  const entropy = calcEntropy(pw)
  score += Math.min(Math.floor(entropy / 2), 20)

  return Math.max(0, Math.min(100, score))
}

export function getStrength(score) {
  if (score < 20) return { label: 'CRÍTICA', color: '#ff2222' }
  if (score < 40) return { label: 'FRACA', color: '#ff4444' }
  if (score < 60) return { label: 'MODERADA', color: '#ffaa00' }
  if (score < 80) return { label: 'FORTE', color: '#88ff44' }
  return { label: 'MUITO FORTE', color: '#00ff41' }
}

export function formatCrackTime(seconds) {
  if (seconds < 1) return { label: 'INSTANTÂNEO', cls: 'instant' }
  if (seconds < 60) return { label: `${Math.round(seconds)} segundos`, cls: 'fast' }
  if (seconds < 3600) return { label: `${Math.round(seconds / 60)} minutos`, cls: 'fast' }
  if (seconds < 86400) return { label: `${Math.round(seconds / 3600)} horas`, cls: 'medium' }
  if (seconds < 2592000) return { label: `${Math.round(seconds / 86400)} dias`, cls: 'medium' }
  if (seconds < 31536000) return { label: `${Math.round(seconds / 2592000)} meses`, cls: 'slow' }
  if (seconds < 31536000 * 100) return { label: `${Math.round(seconds / 31536000)} anos`, cls: 'slow' }
  if (seconds < 31536000 * 1e6) return { label: `${Math.round(seconds / 31536000 / 1000)} mil anos`, cls: 'safe' }
  return { label: '> 1 bilhão de anos', cls: 'safe' }
}

export function getCrackTimes(pw) {
  const cs = getCharsetSize(pw) || 1
  const combinations = Math.pow(cs, pw.length)
  return {
    'Ataque online (100/s)': formatCrackTime(combinations / 100),
    'Força bruta (1B/s)': formatCrackTime(combinations / 1e9),
    'GPU cluster (100B/s)': formatCrackTime(combinations / 1e11),
    'ASIC avançado (1T/s)': formatCrackTime(combinations / 1e12),
  }
}

export function getVulnerabilities(pw) {
  const tags = []
  const lower = pw.toLowerCase()

  if (pw.length < 8) tags.push({ label: 'MUITO CURTA', severity: 'danger' })
  else if (pw.length < 12) tags.push({ label: 'CURTA', severity: 'warning' })
  if (!/[A-Z]/.test(pw)) tags.push({ label: 'SEM MAIÚSCULAS', severity: 'warning' })
  if (!/[0-9]/.test(pw)) tags.push({ label: 'SEM NÚMEROS', severity: 'warning' })
  if (!/[^a-zA-Z0-9]/.test(pw)) tags.push({ label: 'SEM ESPECIAIS', severity: 'warning' })
  if (/(.)\1{2,}/.test(pw)) tags.push({ label: 'CARACTERES REPETIDOS', severity: 'danger' })
  if (/^[a-zA-Z]+$/.test(pw)) tags.push({ label: 'SÓ LETRAS', severity: 'warning' })
  if (/^[0-9]+$/.test(pw)) tags.push({ label: 'SÓ NÚMEROS', severity: 'danger' })
  for (const p of COMMON_PATTERNS) {
    if (lower.includes(p)) { tags.push({ label: 'PADRÃO COMUM', severity: 'danger' }); break }
  }
  if (tags.length === 0) tags.push({ label: 'SEM VULNERABILIDADES', severity: 'ok' })
  return tags
}

export function generateStrongPassword(length = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*-_=+?'
  const required = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)],
    'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)],
    '0123456789'[Math.floor(Math.random() * 10)],
    '!@#$%^&*'[Math.floor(Math.random() * 8)],
  ]
  const rest = Array.from({ length: length - 4 }, () => chars[Math.floor(Math.random() * chars.length)])
  return [...required, ...rest].sort(() => Math.random() - 0.5).join('')
}
