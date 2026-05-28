import styles from './EntropyViz.module.css'

const BLOCKS = 40
const MAX_ENTROPY = 128

export default function EntropyViz({ entropy }) {
  const filled = Math.floor((entropy / MAX_ENTROPY) * BLOCKS)
  const partial = ((entropy / MAX_ENTROPY) * BLOCKS) % 1 > 0.4

  const label =
    entropy >= 80
      ? `${entropy} bits — excelente`
      : entropy >= 50
      ? `${entropy} bits — razoável`
      : `${entropy} bits — baixa`

  return (
    <div className={styles.wrapper}>
      <div className={styles.blocks}>
        {Array.from({ length: BLOCKS }, (_, i) => (
          <div
            key={i}
            className={`${styles.block} ${
              i < filled
                ? styles.filled
                : i === filled && partial
                ? styles.half
                : ''
            }`}
          />
        ))}
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  )
}
