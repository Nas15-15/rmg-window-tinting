'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import styles from './BookingForm.module.css';
import { getPricingCategory, ADDONS, DIY_KIT } from '../utils/pricing';

export default function BookingForm() {
  const [serviceType, setServiceType] = useState('INSTALL'); // 'INSTALL' or 'DIY'
  const [windowCount, setWindowCount] = useState(DIY_KIT.minWindows);

  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  
  const [selectedServices, setSelectedServices] = useState(['WINDOW_TINT']);
  
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

  const handleYearChange = (val) => {
    setYear(val);
    if (!val || val.length !== 4) {
      setMakes([]);
      setMake('');
      setModels([]);
      setModel('');
    } else {
      setLoadingMakes(true);
    }
  };

  const handleMakeChange = (val) => {
    setMake(val);
    if (!val) {
      setModels([]);
      setModel('');
    } else {
      setLoadingModels(true);
    }
  };

  // Fetch makes when year changes
  useEffect(() => {
    if (!year || year.length !== 4) {
      return;
    }
    
    fetch(`/api/carmakes?year=${year}`)
      .then(res => res.json())
      .then(data => {
        setMakes(data || []);
        setMake('');
        setModel('');
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingMakes(false));
  }, [year]);

  // Fetch models when make changes
  useEffect(() => {
    if (!make || !year || year.length !== 4) {
      return;
    }
    
    fetch(`/api/carmodels?make=${make}&year=${year}`)
      .then(res => res.json())
      .then(data => {
        setModels(data || []);
        setModel('');
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingModels(false));
  }, [make, year]);

  const pricingCategory = getPricingCategory(make, model);
  
  let totalPrice = 0;
  if (serviceType === 'INSTALL') {
    if (selectedServices.includes('WINDOW_TINT')) {
      totalPrice += model ? pricingCategory.basePrice : 0;
    }
    if (selectedServices.includes('LED_HEADLIGHTS')) {
      totalPrice += ADDONS.LED_HEADLIGHTS.price;
    }
  } else {
    totalPrice = windowCount * DIY_KIT.pricePerWindow;
  }

  const toggleService = (service) => {
    if (selectedServices.includes(service)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s !== service));
      }
    } else {
      setSelectedServices([...selectedServices, service]);
    }
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
    <section id="booking" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Book Your Service</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.modeToggle}>
            <div 
              className={`${styles.modeCard} ${serviceType === 'INSTALL' ? styles.modeCardActive : ''}`}
              onClick={() => setServiceType('INSTALL')}
            >
              <div className={styles.modeIcon}>🚗</div>
              <div className={styles.modeTitle}>In-Shop Tinting</div>
              <div className={styles.modeSubtitle}>Expert installation at our shop</div>
            </div>
            <div 
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
              <h3 className={styles.sectionTitle}>1. Service & Vehicle Details</h3>
              
              {serviceType === 'INSTALL' && (
                <div className={styles.inputGroup} style={{ marginBottom: '2rem' }}>
                  <label>What services do you need?</label>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={selectedServices.includes('WINDOW_TINT')} 
                        onChange={() => toggleService('WINDOW_TINT')} 
                      /> Window Tint
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={selectedServices.includes('LED_HEADLIGHTS')} 
                        onChange={() => toggleService('LED_HEADLIGHTS')} 
                      /> LED Headlight Upgrade
                    </label>
                  </div>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label>Year</label>
                <input 
                  type="number" 
                  min="1990" 
                  max={new Date().getFullYear()} 
                  value={year} 
                  onChange={(e) => handleYearChange(e.target.value)} 
                  placeholder="e.g. 2023"
                  required 
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Make</label>
                <select 
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
                <label>Model</label>
                <select 
                  value={model} 
                  onChange={(e) => setModel(e.target.value)}
                  disabled={models.length === 0 || loadingModels}
                  required
                  className={styles.input}
                >
                  <option value="">{loadingModels ? 'Loading models...' : 'Select Model'}</option>
                  {models.map(m => (
                    <option key={m.model} value={m.model}>{m.model}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>{serviceType === 'INSTALL' ? '2. Options & Add-ons' : '2. Kit Details'}</h3>
              
              {serviceType === 'INSTALL' ? (
                <p className={styles.disclaimer}>No additional options available for the selected services yet.</p>
              ) : (
                <div className={styles.inputGroup}>
                  <label>Number of Windows</label>
                  <select 
                    value={windowCount} 
                    onChange={(e) => setWindowCount(Number(e.target.value))}
                    className={styles.input}
                  >
                    {[...Array(7)].map((_, i) => {
                      const count = i + 2;
                      return (
                        <option key={count} value={count}>
                          {count} Windows — ${count * DIY_KIT.pricePerWindow}
                        </option>
                      );
                    })}
                  </select>
                  <span className={styles.helperText}>Custom laser-cut film for your vehicle&apos;s exact glass specs</span>
                  
                  <div className={styles.shippingBadge}>
                    ✓ FREE UPS Ground Shipping
                  </div>
                </div>
              )}
              
              <div className={styles.summaryBox}>
                {selectedServices.includes('WINDOW_TINT') && serviceType === 'INSTALL' && (
                  <div className={styles.summaryRow}>
                    <span>Vehicle Class:</span>
                    <span>{model ? pricingCategory.label : '-'}</span>
                  </div>
                )}
                {serviceType === 'INSTALL' ? (
                  <>
                    {selectedServices.includes('WINDOW_TINT') && (
                      <div className={styles.summaryRow}>
                        <span>Tint Base Price:</span>
                        <span>{model ? `$${pricingCategory.basePrice}` : '-'}</span>
                      </div>
                    )}
                    {selectedServices.includes('LED_HEADLIGHTS') && (
                      <div className={styles.summaryRow}>
                        <span>LED Headlights:</span>
                        <span>${ADDONS.LED_HEADLIGHTS.price}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.summaryRow}>
                    <span>Windows:</span>
                    <span>{windowCount}</span>
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
                  <span className={styles.totalPrice}>${totalPrice}</span>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>3. Contact Info</h3>
              
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className={styles.input} />
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="(555) 555-5555" className={styles.input} />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Optional" className={styles.input} />
              </div>
            </div>
          </div>

          {status === 'error' && <div className={styles.errorAlert}>{errorMessage}</div>}
          
          {serviceType === 'INSTALL' ? (
            <div className={styles.submitWrapper}>
              <button 
                type="submit" 
                className={styles.submitBtn} 
                disabled={status === 'loading' || !model}
              >
                {status === 'loading' ? 'Processing...' : 'Request Booking'}
              </button>
              <p className={styles.disclaimer}>No payment required to book. You pay when the work is done.</p>
            </div>
          ) : (
            <div className={styles.submitWrapper}>
              {isFormValid ? (
                <div className={styles.paypalContainer}>
                  <Script 
                    src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test'}&currency=USD`}
                    strategy="lazyOnload"
                    onLoad={() => {
                      if (window.paypal) {
                        window.paypal.Buttons({
                          createOrder: (data, actions) => {
                            return actions.order.create({
                              purchase_units: [{
                                amount: {
                                  value: totalPrice.toString()
                                },
                                description: `DIY Pre-Cut Tint Kit (${windowCount} Windows) - ${year} ${make} ${model}`
                              }]
                            });
                          },
                          onApprove: (data, actions) => {
                            return actions.order.capture().then((details) => {
                              // We got the payment and shipping info!
                              submitOrder({
                                serviceType,
                                firstName, lastName, phone, email,
                                year, make, model,
                                windowCount,
                                totalPrice,
                                paypalTransactionId: details.id,
                                shippingAddress: details.purchase_units[0].shipping.address
                              });
                            });
                          }
                        }).render('#paypal-button-container');
                      }
                    }}
                  />
                  <div id="paypal-button-container"></div>
                  <p className={styles.paypalNote}>Secure checkout powered by PayPal. We&apos;ll ship your kit within 2 business days.</p>
                </div>
              ) : (
                <p className={styles.disclaimer} style={{ color: 'var(--accent)' }}>Please fill out all required fields above to proceed with payment.</p>
              )}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
