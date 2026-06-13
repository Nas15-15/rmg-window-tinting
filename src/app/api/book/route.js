import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Validate email format
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate phone format (at least 10 digits)
const isValidPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
};

const WINDOW_LABELS = {
  WINDSHIELD: 'Full Windshield',
  SUN_STRIP: 'Sun Strip',
  FRONT_LEFT: 'Front Driver Side (Left)',
  FRONT_RIGHT: 'Front Passenger Side (Right)',
  REAR_LEFT: 'Rear Driver Side (Left)',
  REAR_RIGHT: 'Rear Passenger Side (Right)',
  CARGO_LEFT: 'Cargo Driver Side (Left)',
  CARGO_RIGHT: 'Cargo Passenger Side (Right)',
  REAR_WINDSHIELD: 'Rear Windshield',
};

export async function POST(request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();
    
    const { 
      serviceType, 
      firstName, lastName, phone, email, 
      year, make, model, 
      selectedServices, addons, selectedWindows, 
      totalPrice,
      paypalTransactionId, shippingAddress 
    } = body;
    
    // Basic validation
    if (!firstName || !lastName || !phone || !year || !make || !model) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    
    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }
    
    if (serviceType === 'DIY' && (!paypalTransactionId || !shippingAddress)) {
      return NextResponse.json({ error: 'Missing payment or shipping details for DIY kit' }, { status: 400 });
    }

    const ownerEmailsRaw = process.env.OWNER_EMAIL || '';
    const ownerEmails = ownerEmailsRaw.split(',').map(e => e.trim()).filter(e => e);
    
    if (ownerEmails.length === 0) {
      console.warn("OWNER_EMAIL not configured in .env");
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    let htmlContent = '';
    let emailSubject = '';

    const windowCount = selectedWindows ? selectedWindows.length : 0;
    const windowsList = selectedWindows && selectedWindows.length > 0
      ? selectedWindows.map(w => WINDOW_LABELS[w] || w).join(', ')
      : 'None selected';

    if (serviceType === 'DIY') {
      emailSubject = `New DIY Kit Order (PAID): ${year} ${make} ${model} - ${firstName} ${lastName}`;
      
      const addressLine1 = shippingAddress.address_line_1 || '';
      const addressLine2 = shippingAddress.address_line_2 ? `, ${shippingAddress.address_line_2}` : '';
      const city = shippingAddress.admin_area_2 || '';
      const state = shippingAddress.admin_area_1 || '';
      const zip = shippingAddress.postal_code || '';
      const country = shippingAddress.country_code || '';
      
      const fullAddress = `${addressLine1}${addressLine2}<br>${city}, ${state} ${zip} ${country}`;

      htmlContent = `
        <h2>New DIY Pre-Cut Tint Kit Order</h2>
        <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">PAID VIA PAYPAL</span></p>
        <p><strong>Transaction ID:</strong> ${paypalTransactionId}</p>
        <hr />
        <h3>Customer Details</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <hr />
        <h3>Shipping Address</h3>
        <p>${fullAddress}</p>
        <hr />
        <h3>Order Details</h3>
        <p><strong>Vehicle:</strong> ${year} ${make} ${model}</p>
        <p><strong>Windows Count:</strong> ${windowCount}</p>
        <p><strong>Selected Windows:</strong> ${windowsList}</p>
        <p><strong>Total Paid:</strong> $${totalPrice}</p>
        <br>
        <p><em>Note: You can print the shipping label directly from your PayPal dashboard using the transaction ID above.</em></p>
      `;
    } else {
      emailSubject = `New In-Shop Booking: ${year} ${make} ${model} - ${firstName} ${lastName}`;
      const servicesText = selectedServices && selectedServices.length > 0 
        ? selectedServices.map(s => {
            if (s === 'TINT' || s === 'WINDOW_TINT') return 'Window Tinting';
            if (s === 'LED' || s === 'LED_HEADLIGHTS') return 'LED Headlights';
            return s;
          }).join(', ') 
        : 'Window Tinting';
      
      htmlContent = `
        <h2>New In-Shop Window Tinting Booking</h2>
        <p><strong>Status:</strong> <span style="color: orange; font-weight: bold;">UNPAID (Pay in shop)</span></p>
        <hr />
        <h3>Customer Details</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <hr />
        <h3>Vehicle Details</h3>
        <p><strong>Vehicle:</strong> ${year} ${make} ${model}</p>
        <p><strong>Services Needed:</strong> ${servicesText}</p>
        ${(selectedServices && (selectedServices.includes('TINT') || selectedServices.includes('WINDOW_TINT'))) ? `
          <p><strong>Windows Count:</strong> ${windowCount}</p>
          <p><strong>Selected Windows:</strong> ${windowsList}</p>
        ` : ''}
        <p><strong>Estimated Total:</strong> $${totalPrice}</p>
      `;
    }

    // Only attempt to send if we have a resend key, otherwise just return success (for development)
    if (process.env.RESEND_API_KEY) {
      const data = await resend.emails.send({
        from: `RMG Tinting <${fromEmail}>`,
        to: ownerEmails.length > 0 ? ownerEmails : ['delivered@resend.dev'],
        subject: emailSubject,
        html: htmlContent,
      });

      if (data.error) {
        console.error("Resend error:", data.error);
        const detailedMessage = data.error.message || JSON.stringify(data.error);
        return NextResponse.json({ error: `Failed to dispatch email notification: ${detailedMessage}` }, { status: 500 });
      }
    } else {
      console.log("Mock email sent. Payload:", body);
    }

    return NextResponse.json({ success: true, message: 'Booking confirmed' });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Internal server error processing booking' }, { status: 500 });
  }
}
