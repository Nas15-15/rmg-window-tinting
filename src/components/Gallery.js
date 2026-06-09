'use client';
import { useState } from 'react';
import styles from './Gallery.module.css';

const IMAGES = [
  { src: "/gallery/images/work-1.jpg", alt: "Premium Window Tint 1" },
  { src: "/gallery/images/work-2.jpg", alt: "Premium Window Tint 2" },
  { src: "/gallery/images/work-3.jpg", alt: "Premium Window Tint 3" },
  { src: "/gallery/images/work-4.jpg", alt: "Premium Window Tint 4" },
  { src: "/gallery/images/work-5.jpg", alt: "Premium Window Tint 5" },
  { src: "/gallery/images/work-6.jpg", alt: "Premium Window Tint 6" },
];

const VIDEOS = [
  { src: "/gallery/videos/video-1.mp4" },
  { src: "/gallery/videos/video-2.mp4" },
  { src: "/gallery/videos/video-3.mp4" },
];

export default function Gallery() {
  const [filter, setFilter] = useState('ALL'); // ALL, PHOTOS, VIDEOS

  const showImages = filter === 'ALL' || filter === 'PHOTOS';
  const showVideos = filter === 'ALL' || filter === 'VIDEOS';

  return (
    <section id="gallery" className={styles.gallerySection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Our Recent Work</h2>
        <div className={styles.filters}>
          <button 
            className={`${styles.filterBtn} ${filter === 'ALL' ? styles.active : ''}`}
            onClick={() => setFilter('ALL')}
          >All</button>
          <button 
            className={`${styles.filterBtn} ${filter === 'PHOTOS' ? styles.active : ''}`}
            onClick={() => setFilter('PHOTOS')}
          >Photos</button>
          <button 
            className={`${styles.filterBtn} ${filter === 'VIDEOS' ? styles.active : ''}`}
            onClick={() => setFilter('VIDEOS')}
          >Videos</button>
        </div>
      </div>

      <div className={styles.grid}>
        {showImages && IMAGES.map((img, i) => (
          <div key={`img-${i}`} className={styles.mediaCard}>
            <div className={styles.imageWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className={styles.media} loading="lazy" />
              <div className={styles.overlay}>
                <span className={styles.viewText}>Premium Tint</span>
              </div>
            </div>
          </div>
        ))}
        {showVideos && VIDEOS.map((vid, i) => (
          <div key={`vid-${i}`} className={styles.mediaCard}>
             <div className={styles.videoWrapper}>
              <video 
                src={vid.src} 
                className={styles.media}
                playsInline
                preload="metadata"
                controls
                muted
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
