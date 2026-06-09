import styles from './Reviews.module.css';

export default function Reviews() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={`${styles.heading} animate-fade-in`}>What People Say</h2>
        <div className={styles.singleCardContainer}>
          <div className={`${styles.card} animate-fade-in`}>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.text}>&quot;Most professional in Lehigh.&quot;</p>
            <div className={styles.author}>— Nas</div>
          </div>
        </div>
      </div>
    </section>
  );
}

