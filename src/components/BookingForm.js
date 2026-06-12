'use client';
import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import styles from './BookingForm.module.css';
import { getPricingCategory, ADDONS, WINDOW_PRICES, getCustomPrice, PRICING_TIERS } from '../utils/pricing';
import CarWindowSelector from './CarWindowSelector';

const paypalOptions = {
  clientId: (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test").trim(),
  currency: "USD",
  intent: "capture"
};

export default function BookingForm() {
  const [serviceType, setServiceType] = useState('INSTALL'); // 'INSTALL' or 'DIY'
  const [selectedServices, setSelectedServices] = useState(['TINT']); // 'TINT', 'LED'
  const [selectedWindows, setSelectedWindows] = useState([]);

  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [bodyStyleOverride, setBodyStyleOverride] = useState('');
  
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Hash Navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#shop') {
        setServiceType('DIY');
        const element = document.getElementById('booking');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (window.location.hash === '#booking') {
        setServiceType('INSTALL');
        const element = document.getElementById('booking');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Initial makes load (NHTSA)
  useEffect(() => {
    setLoadingMakes(true);
    fetch('/api/carmakes')
      .then(res => res.json())
      .then(data => setMakes(data || []))
      .catch(err => console.error(err))
      .finally(() => setLoadingMakes(false));
  }, []);

  const handleYearChange = (val) => {
    setYear(val);
    if (!val || val.length !== 4) {
      setModels([]);
      setModel('');
    }
  };

  const handleMakeChange = (val) => {
    setMake(val);
    if (!val || !year || year.length !== 4) {
      setModels([]);
      setModel('');
      setBodyStyleOverride('');
    }
  };

  const handleModelChange = (val) => {
    setModel(val);
    setBodyStyleOverride(''); // reset override when model changes
  };

  // Fetch models when make/year changes
  useEffect(() => {
    if (!make || !year || year.length !== 4) {
      return;
    }
    
    setLoadingModels(true);
    fetch(`/api/carmodels?make=${encodeURIComponent(make)}&year=${year}`)
      .then(res => res.json())
      .then(data => {
        setModels(data || []);
        setModel('');
        setBodyStyleOverride('');
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingModels(false));
  }, [make, year]);

  let pricingCategory = getPricingCategory(make, model);
  if (bodyStyleOverride) {
    pricingCategory = PRICING_TIERS[bodyStyleOverride];
  }
  
  const handleToggleWindow = (winId) => {
    setSelectedWindows(prev => 
      prev.includes(winId) ? prev.filter(id => id !== winId) : [...prev, winId]
    );
  };

  const handleSelectAll = () => {
    const allWindows = ['WINDSHIELD', 'SUN_STRIP', 'FRONT_LEFT', 'FRONT_RIGHT', 'REAR_LEFT', 'REAR_RIGHT', 'REAR_WINDSHIELD'];
    if (pricingCategory.label === "Small SUV / Crossover" || pricingCategory.label === "Truck / Large SUV") {
      allWindows.push('CARGO_LEFT', 'CARGO_RIGHT');
    }
    setSelectedWindows(allWindows);
  };

  const handleClearSelection = () => {
    setSelectedWindows([]);
  };

  let tintPrice = getCustomPrice(selectedWindows, pricingCategory.label);

  let totalPrice = 0;
  if (selectedServices.includes('TINT')) {
    totalPrice += tintPrice;
  }
  if (serviceType === 'INSTALL' && selectedServices.includes('LED')) {
    totalPrice += ADDONS.LED_HEADLIGHTS.price;
  }

  const toggleService = (svc) => {
    setSelectedServices(prev => {
      if (prev.includes(svc)) {
        // Prevent deselecting both
        if (prev.length === 1) return prev;
        return prev.filter(s => s !== svc);
      } else {
        return [...prev, svc];
      }
    });
  };

  const submitOrder = async (orderData) => {
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }
      
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitOrder({
      serviceType,
      firstName, lastName, phone, email,
      year, make, model,
      selectedServices,
      selectedWindows,
      totalPrice
    });
  };

  if (status === 'success') {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>✓</div>
        <h3 className={styles.successTitle}>{serviceType === 'DIY' ? 'Order Confirmed' : 'Request Sent'}</h3>
        <p className={styles.successText}>
          Thank you, {firstName}! 
          {serviceType === 'DIY' 
            ? ' We have received your order and will ship your kit soon.'
            : ' We have received your booking request and will contact you shortly.'}
        </p>
        <button onClick={() => setStatus('idle')} className={styles.resetBtn}>
          {serviceType === 'DIY' ? 'Order Another Kit' : 'Book Another'}
        </button>
      </div>
    );
  }

  const isFormValid = year && make && model && firstName && lastName && phone;

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <section id="booking" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Book Your Service</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.modeToggle}>
            <div 
              id="toggle-install"
              className={`${styles.modeCard} ${serviceType === 'INSTALL' ? styles.modeCardActive : ''}`}
              onClick={() => setServiceType('INSTALL')}
            >
              <div className={styles.modeIcon}>🚗</div>
              <div className={styles.modeTitle}>In-Shop Tinting</div>
              <div className={styles.modeSubtitle}>Expert installation at our shop</div>
            </div>
            <div 
              id="toggle-diy"
              className={`${styles.modeCard} ${serviceType === 'DIY' ? styles.modeCardActive : ''}`}
              onClick={() => setServiceType('DIY')}
            >
              <div className={styles.modeIcon}>📦</div>
              <div className={styles.modeTitle}>DIY Pre-Cut Kit</div>
              <div className={styles.modeSubtitle}>Shipped to your door via UPS</div>
            </div>
          </div>

          <div className={`${styles.formGrid} ${styles.fadeSwap}`} key={serviceType}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>1. Vehicle Details</h3>

              <div className={styles.inputGroup}>
                <label htmlFor="vehicle-year">Year</label>
                <input 
                  id="vehicle-year"
                  type="number" 
                  min="1990" 
                  max={new Date().getFullYear() + 1} 
                  value={year} 
                  onChange={(e) => handleYearChange(e.target.value)} 
                  placeholder="e.g. 2023"
                  required 
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="vehicle-make">Make</label>
                <select 
                  id="vehicle-make"
                  value={make} 
                  onChange={(e) => handleMakeChange(e.target.value)}
                  disabled={makes.length === 0 || loadingMakes}
                  required
                  className={styles.input}
                >
                  <option value="">{loadingMakes ? 'Loading makes...' : 'Select Make'}</option>
                  {makes.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="vehicle-model">Model</label>
                <select 
                  id="vehicle-model"
                  value={model} 
                  onChange={(e) => handleModelChange(e.target.value)}
                  disabled={!year || !make || loadingModels}
                  required
                  className={styles.input}
                >
                  <option value="">
                    {!year || !make ? 'Select Year & Make first' 
                      : loadingModels ? 'Loading models...' 
                      : models.length === 0 ? 'No models found' : 'Select Model'}
                  </option>
                  {models.map(m => (
                    <option key={m.model} value={m.model}>{m.model}</option>
                  ))}
                </select>
              </div>

              {model && (
                <div className={styles.inputGroup}>
                  <label htmlFor="vehicle-body-style">Body Style (Optional override)</label>
                  <select 
                    id="vehicle-body-style"
                    value={bodyStyleOverride} 
                    onChange={(e) => setBodyStyleOverride(e.target.value)}
                    className={styles.input}
                  >
                    <option value="">Auto-detected ({pricingCategory.label})</option>
                    <option value="SEDAN">Sedan / Coupe</option>
                    <option value="SUV">Small SUV / Crossover</option>
                    <option value="XL">Truck / Large SUV</option>
                  </select>
                </div>
              )}
            </div>

            {serviceType === 'INSTALL' && (
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>2. Services Required</h3>
                <div className={styles.windowOptionsGrid}>
                  <div 
                    className={`${styles.windowCard} ${selectedServices.includes('TINT') ? styles.windowCardActive : ''}`}
                    onClick={() => toggleService('TINT')}
                  >
                    <div className={styles.windowCardTitle}>Window Tinting</div>
                    <div className={styles.windowCardPrice}>Price varies by window</div>
                  </div>
                  <div 
                    className={`${styles.windowCard} ${selectedServices.includes('LED') ? styles.windowCardActive : ''}`}
                    onClick={() => toggleService('LED')}
                  >
                    <div className={styles.windowCardTitle}>LED Headlights</div>
                    <div className={styles.windowCardPrice}>+${ADDONS.LED_HEADLIGHTS.price}</div>
                  </div>
                </div>
              </div>
            )}

            {selectedServices.includes('TINT') && (
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>{serviceType === 'INSTALL' ? '3' : '2'}. Window Coverage</h3>
                
                <CarWindowSelector 
                  vehicleTier={pricingCategory.label === "Truck / Large SUV" ? "XL" : pricingCategory.label === "Small SUV / Crossover" ? "SUV" : "SEDAN"}
                  selectedWindows={selectedWindows}
                  onToggleWindow={handleToggleWindow}
                  onSelectAll={handleSelectAll}
                  onClear={handleClearSelection}
                />
              </div>
            )}
              
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>{serviceType === 'INSTALL' ? '4' : '3'}. Contact Info</h3>
              
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label htmlFor="customer-first-name">First Name</label>
                  <input id="customer-first-name" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="customer-last-name">Last Name</label>
                  <input id="customer-last-name" type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className={styles.input} />
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="customer-phone">Phone Number</label>
                <input id="customer-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="(555) 555-5555" className={styles.input} />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="customer-email">Email Address</label>
                <input id="customer-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Optional" className={styles.input} />
              </div>
            </div>

            <div className={styles.summaryBox}>
              {selectedServices.includes('TINT') && (
                <div className={styles.summaryRow}>
                  <span>Window Coverage:</span>
                  <span>{selectedWindows.length} sections selected</span>
                </div>
              )}
              {serviceType === 'INSTALL' && selectedServices.includes('LED') && (
                <div className={styles.summaryRow}>
                  <span>LED Headlights:</span>
                  <span>${ADDONS.LED_HEADLIGHTS.price}</span>
                </div>
              )}
                {serviceType === 'DIY' && (
                  <div className={styles.summaryRow}>
                    <span>Shipping:</span>
                    <span style={{color: '#22C55E'}}>FREE</span>
                  </div>
                )}
                <div className={styles.summaryTotal}>
                  <span>Estimated Total:</span>
                  <span id="booking-total-price" className={styles.totalPrice}>${totalPrice}</span>
                </div>

                {status === 'error' && <div className={styles.errorAlert}>{errorMessage}</div>}
                
                {serviceType === 'INSTALL' ? (
                  <div className={styles.submitWrapper}>
                    <button 
                      type="submit" 
                      className={styles.submitBtn} 
                      disabled={status === 'loading' || !model || (selectedServices.includes('TINT') && selectedWindows.length === 0)}
                    >
                      {status === 'loading' ? 'Processing...' : 'Request Booking'}
                    </button>
                    <p className={styles.disclaimer}>No payment required to book. You pay when the work is done.</p>
                  </div>
                ) : (
                  <div className={styles.submitWrapper}>
                    {!isFormValid && (
                      <p className={styles.disclaimer} style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
                        Please fill out all required fields to proceed with payment.
                      </p>
                    )}
                    <div className={styles.paypalContainer}>
                      <PayPalButtons 
                        disabled={!isFormValid || totalPrice === 0}
                        style={{ layout: "vertical", color: "blue" }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [{
                              amount: {
                                value: totalPrice.toString()
                              },
                              description: `DIY Pre-Cut Tint Kit (${selectedWindows.length} pieces) - ${year} ${make} ${model}`
                            }]
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order.capture().then((details) => {
                            submitOrder({
                              serviceType,
                              firstName, lastName, phone, email,
                              year, make, model,
                              selectedWindows,
                              totalPrice,
                              paypalTransactionId: details.id,
                              shippingAddress: details.purchase_units[0].shipping?.address
                            });
                          });
                        }}
                      />
                      <p className={styles.paypalNote}>Secure checkout powered by PayPal. We will ship your kit.</p>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </form>
      </div>
    </section>
    </PayPalScriptProvider>
  );
}
