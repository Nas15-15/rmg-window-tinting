import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.backgroundContainer}>
        <Image 
          src="/hero-image.jpg" 
          alt="Premium Window Tinting Result" 
          fill
          priority
          className={styles.backgroundImage}
        />
        <div className={styles.gradientOverlay}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.textContent}>
          <h1 className={`${styles.title} animate-fade-in stagger-2`}>
            Elevate Your Car&apos;s <span className={styles.highlight}>Status</span> & Protect Your Interior Now
          </h1>
          
          <p className={`${styles.subtitle} animate-fade-in stagger-3`}>
            With Our Window Tinting Service (100% Satisfaction Guarantee)
          </p>
          
          <div className={`${styles.actions} animate-fade-in stagger-4`}>
            <a href="#booking" className={styles.primaryBtn}>
              Book Your Transformation
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
            <a href="#shop" className={styles.secondaryBtn}>
              Shop DIY Pre-Cut Kits
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
