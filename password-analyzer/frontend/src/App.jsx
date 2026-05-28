import { useState, useCallback, useRef } from 'react'
import axios from 'axios'
import {
  calcScore,
  calcEntropy,
  getCharsetSize,
  getCrackTimes,
  getVulnerabilities,
} from './utils/analyzer'
import StrengthBar from './components/StrengthBar'
import EntropyViz from './components/EntropyViz'
import MetricsGrid from './components/MetricsGrid'
import VulnerabilityTags from './components/VulnerabilityTags'
import CrackTime from './components/CrackTime'
import PwnedBadge from './components/PwnedBadge'
import PasswordSuggestion from './components/PasswordSuggestion'
import styles from './App.module.css'

function SectionLabel({ children }) {
  return <div className={styles.sectionLabel}>{children}</div>
}

export default function App() {
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [pwned, setPwned] = useState(null)
  const debounceRef = useRef(null)

  const score = calcScore(password)
  const entropy = calcEntropy(password)
  const charsetSize = getCharsetSize(password)
  const crackTimes = getCrackTimes(password)
  const vulnerabilities = getVulnerabilities(password)
  const uppercase = (password.match(/[A-Z]/g) || []).length
  const special = (password.match(/[^a-zA-Z0-9]/g) || []).length

  const checkPwned = useCallback((pw) => {
    if (!pw) { setPwned(null); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.post('/api/analyze', { password: pw })
        setPwned(res.data.pwned)
      } catch {
        setPwned({ error: true })
      }
    }, 600)
  }, [])

  function handleChange(e) {
    const val = e.target.value
    setPassword(val)
    checkPwned(val)
  }

  const hasInput = password.length > 0

  return (
    <div className={styles.terminal}>
      <div className={styles.titleBar}>
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
        </div>
        <span className={styles.titleText}>PASSWORD_ANALYZER v2.4.1</span>
      </div>

      <div className={styles.body}>
        <div className={styles.promptLine}>
          <span className={styles.promptSymbol}>root@sec:~$</span>
          <input
            className={styles.passwordInput}
            type={visible ? 'text' : 'password'}
            value={password}
            onChange={handleChange}
            placeholder="digite sua senha aqui..."
            autoComplete="off"
            spellCheck="false"
          />
          <button
            className={styles.toggleBtn}
            onClick={() => setVisible(v => !v)}
          >
            {visible ? 'HIDE' : 'SHOW'}
          </button>
        </div>

        {!hasInput ? (
          <div className={styles.emptyState}>
            aguardando entrada<span className={styles.blink}>_</span>
          </div>
        ) : (
          <>
            <hr className={styles.divider} />

            <SectionLabel>// força geral</SectionLabel>
            <StrengthBar score={score} />

            <SectionLabel>// entropia (bits)</SectionLabel>
            <EntropyViz entropy={entropy} />

            <SectionLabel>// métricas</SectionLabel>
            <MetricsGrid
              length={password.length}
              charsetSize={charsetSize}
              uppercase={uppercase}
              special={special}
            />

            <SectionLabel>// vulnerabilidades detectadas</SectionLabel>
            <VulnerabilityTags tags={vulnerabilities} />

            <SectionLabel>// tempo estimado para quebrar</SectionLabel>
            <CrackTime times={crackTimes} />

            <SectionLabel>// verificação de vazamentos (HaveIBeenPwned)</SectionLabel>
            <PwnedBadge pwned={pwned} />

            <PasswordSuggestion />
          </>
        )}
      </div>
    </div>
  )
}
