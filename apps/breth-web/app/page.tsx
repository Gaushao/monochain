import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>breth portal</h1>
      <main className={styles.main}>
        <code>
          <a className="code" href="/wallet">Wallet</a>
        </code>
      </main>
      <footer className={styles.footer}>
        .
      </footer>
    </div>
  )
}
