'use client';
import styles from './CarWindowSelector.module.css';

export default function CarWindowSelector({ 
  vehicleTier, 
  selectedWindows, 
  onToggleWindow, 
  onSelectAll,
  onClear
}) {
  
  const isSelected = (id) => selectedWindows.includes(id);

  // SVG paths depending on vehicle tier (sedan, suv, xl)
  // We'll use a slightly different layout for SUV/XL to show a more "blocky" rear
  
  const getPaths = () => {
    // Default Sedan / Coupe
    let paths = {
      WINDSHIELD: "M 220 70 Q 50 150 50 200 Q 50 250 220 330 L 240 270 Q 140 200 240 130 Z",
      SUN_STRIP: "M 220 70 Q 50 150 50 200 Q 50 250 220 330 C 180 300, 180 100, 220 70 Z", // Approximate sun strip area (left edge)
      FRONT_RIGHT: "M 260 65 L 420 65 L 420 190 L 260 190 Q 230 130 260 65",
      FRONT_LEFT: "M 260 335 L 420 335 L 420 210 L 260 210 Q 230 270 260 335",
      REAR_RIGHT: "M 440 65 L 560 65 Q 600 65 600 190 L 440 190 Z",
      REAR_LEFT: "M 440 335 L 560 335 Q 600 335 600 210 L 440 210 Z",
      REAR_WINDSHIELD: "M 620 80 Q 750 120 750 200 Q 750 280 620 320 L 605 260 Q 660 200 605 140 Z"
    };

    if (vehicleTier === 'SUV' || vehicleTier === 'XL') {
      // Boxier look, maybe an extra cargo window representation
      paths.REAR_RIGHT = "M 440 65 L 540 65 L 540 190 L 440 190 Z";
      paths.REAR_LEFT = "M 440 335 L 540 335 L 540 210 L 440 210 Z";
      paths.CARGO_RIGHT = "M 560 65 L 640 65 Q 660 65 660 190 L 560 190 Z";
      paths.CARGO_LEFT = "M 560 335 L 640 335 Q 660 335 660 210 L 560 210 Z";
      paths.REAR_WINDSHIELD = "M 680 70 L 750 70 L 750 330 L 680 330 L 660 250 L 660 150 Z"; // Flatter rear glass
    }

    return paths;
  };

  const p = getPaths();
  const isSUV = vehicleTier === 'SUV' || vehicleTier === 'XL';

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Click the windows you want tinted</h3>
      <p className={styles.instructions}>
        (Top = Passenger Side, Bottom = Driver Side)
      </p>
      
      <div className={styles.svgContainer}>
        <svg viewBox="0 0 800 400" className={styles.carDiagram}>
          
          {/* FRONT WINDSHIELD */}
          <path 
            className={`${styles.window} ${isSelected('WINDSHIELD') ? styles.selected : ''}`}
            d={p.WINDSHIELD}
            onClick={() => onToggleWindow('WINDSHIELD')}
          />
          {/* Optional Sun Strip overlaid or separate. We'll make it a smaller shape at the front. */}
          <path 
            className={`${styles.sunstrip} ${isSelected('SUN_STRIP') ? styles.selected : ''}`}
            d="M 180 120 Q 80 160 80 200 Q 80 240 180 280 C 130 250, 130 150, 180 120 Z"
            onClick={() => onToggleWindow('SUN_STRIP')}
          />

          {/* FRONT WINDOWS */}
          <path 
            className={`${styles.window} ${isSelected('FRONT_RIGHT') ? styles.selected : ''}`}
            d={p.FRONT_RIGHT}
            onClick={() => onToggleWindow('FRONT_RIGHT')}
          />
          <path 
            className={`${styles.window} ${isSelected('FRONT_LEFT') ? styles.selected : ''}`}
            d={p.FRONT_LEFT}
            onClick={() => onToggleWindow('FRONT_LEFT')}
          />

          {/* REAR WINDOWS (Includes cargo if SUV) */}
          <path 
            className={`${styles.window} ${isSelected('REAR_RIGHT') ? styles.selected : ''}`}
            d={p.REAR_RIGHT}
            onClick={() => onToggleWindow('REAR_RIGHT')}
          />
          <path 
            className={`${styles.window} ${isSelected('REAR_LEFT') ? styles.selected : ''}`}
            d={p.REAR_LEFT}
            onClick={() => onToggleWindow('REAR_LEFT')}
          />

          {isSUV && (
            <>
              {/* For SUVs, clicking rear windows toggles cargo as well, or they are just separate clickable sections that map to the same REAR_RIGHT id */}
              <path 
                className={`${styles.window} ${isSelected('REAR_RIGHT') ? styles.selected : ''}`}
                d={p.CARGO_RIGHT}
                onClick={() => onToggleWindow('REAR_RIGHT')}
              />
              <path 
                className={`${styles.window} ${isSelected('REAR_LEFT') ? styles.selected : ''}`}
                d={p.CARGO_LEFT}
                onClick={() => onToggleWindow('REAR_LEFT')}
              />
            </>
          )}

          {/* REAR WINDSHIELD */}
          <path 
            className={`${styles.window} ${isSelected('REAR_WINDSHIELD') ? styles.selected : ''}`}
            d={p.REAR_WINDSHIELD}
            onClick={() => onToggleWindow('REAR_WINDSHIELD')}
          />
          
        </svg>
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.controlBtn} onClick={onSelectAll}>
          Select Complete Car
        </button>
        <button type="button" className={styles.controlBtn} onClick={onClear}>
          Clear Selection
        </button>
      </div>
    </div>
  );
}
