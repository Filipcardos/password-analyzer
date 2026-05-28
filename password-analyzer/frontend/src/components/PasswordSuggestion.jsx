import { useState } from 'react'
import { generateStrongPassword } from '../utils/analyzer'
import styles from './PasswordSuggestion.module.css'

export default function PasswordSuggestion() {
  const [suggestion, setSuggestion] = useState(generateStrongPassword)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(suggestion).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setSuggestion(generateStrongPassword())
      }, 2000)
    })
  }

  function handleRefresh() {
    setSuggestion(generateStrongPassword())
  }

  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <span className={styles.label}>// senha forte sugerida</span>
        <button className={styles.refreshBtn} onClick={handleRefresh} title="Gerar nova sugestão">
          ↻ nova
        </button>
      </div>
      <div className={styles.value} onClick={handleCopy}>
        {suggestion}
      </div>
      <div className={styles.hint}>
        {copied ? '✓ copiado!' : 'clique para copiar'}
      </div>
    </div>
  )
}
