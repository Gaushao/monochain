import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>docs</h1>
      <main className={styles.main}>
        <h2>breth</h2>
        <ul>
          <li>
            <a href='breth/ChipToken.md'>ChipToken</a>
          </li>
        </ul>
      </main>
      <footer className={styles.footer}>
        missing something? try it by your own
      </footer>
    </div>
  )
}
