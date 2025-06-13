
"use client";
import { useEffect, useState } from 'react';
import styles from './SaturnBackground.module.css';

const SaturnBackground = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.saturnContainer}>
      <div className={styles.saturn}>
        <div className={styles.ringsOuter}>
          <div className={styles.ringsInner}></div>
        </div>
        <div className={styles.planet}></div>
      </div>
    </div>
  );
};

export default SaturnBackground;
