import styles from './PwnedBadge.module.css'

export default function PwnedBadge({ pwned }) {
  if (pwned === null || pwned === undefined) return null

  if (pwned.error) {
    return (
      <div className={`${styles.badge} ${styles.unknown}`}>
        ⚠ HIBP indisponível — verifique manualmente em haveibeenpwned.com
      </div>
    )
  }

  if (pwned.pwned) {
    return (
      <div className={`${styles.badge} ${styles.danger}`}>
        ✗ VAZADA — encontrada em {pwned.breach_count?.toLocaleString()} vazamentos de dados
      </div>
    )
  }

  return (
    <div className={`${styles.badge} ${styles.safe}`}>
      ✓ NÃO encontrada em vazamentos conhecidos
    </div>
  )
}
