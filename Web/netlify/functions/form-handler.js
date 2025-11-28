// Netlify Functions handler for form submissions
// This function sends data to Zapier/Make webhook and sends confirmation email

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    }
  }

  try {
    const formData = JSON.parse(event.body)
    
    // Validate required fields
    if (!formData.name || !formData.mobile || !formData.pincode) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      }
    }

    // Send to Zapier/Make webhook (configure ZAPIER_WEBHOOK_URL in Netlify env vars)
    const webhookUrl = process.env.ZAPIER_WEBHOOK_URL
    
    if (webhookUrl) {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email || '',
          pincode: formData.pincode,
          visitDate: formData.visitDate || '',
          roofType: formData.roofType || '',
          electricityBill: formData.electricityBill || '',
          message: formData.message || '',
          timestamp: new Date().toISOString(),
          source: 'Website Booking Form',
        }),
      })

      if (!webhookResponse.ok) {
        console.error('Webhook error:', await webhookResponse.text())
      }
    }

    // Optional: Send confirmation email using SendGrid, Mailgun, etc.
    // Configure your email service API key in Netlify env vars
    if (process.env.SENDGRID_API_KEY && formData.email) {
      // Example SendGrid integration
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      
      const msg = {
        to: formData.email,
        from: 'info@suryassolar.com',
        subject: 'Booking Confirmation - Surya\'s Solar',
        text: `Dear ${formData.name},\n\nThank you for booking a free home visit with Surya's Solar. Our team will contact you within 24 hours to confirm your appointment.\n\nBest regards,\nSurya's Solar Team`,
        html: `
          <h2>Booking Confirmation</h2>
          <p>Dear ${formData.name},</p>
          <p>Thank you for booking a free home visit with Surya's Solar. Our team will contact you within 24 hours to confirm your appointment.</p>
          <p><strong>Your Details:</strong></p>
          <ul>
            <li>Mobile: ${formData.mobile}</li>
            <li>Pincode: ${formData.pincode}</li>
            ${formData.visitDate ? `<li>Preferred Date: ${formData.visitDate}</li>` : ''}
          </ul>
          <p>Best regards,<br/>Surya's Solar Team</p>
        `,
      }
      
      try {
        await sgMail.send(msg)
      } catch (emailError) {
        console.error('Email sending error:', emailError)
      }
    }

    // Send notification to admin
    if (process.env.ADMIN_EMAIL && process.env.SENDGRID_API_KEY) {
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      
      const adminMsg = {
        to: process.env.ADMIN_EMAIL,
        from: 'info@suryassolar.com',
        subject: '🔔 New Booking Request',
        html: `
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Mobile:</strong> ${formData.mobile}</p>
          <p><strong>Email:</strong> ${formData.email || 'Not provided'}</p>
          <p><strong>Pincode:</strong> ${formData.pincode}</p>
          <p><strong>Preferred Visit Date:</strong> ${formData.visitDate || 'Not specified'}</p>
          <p><strong>Roof Type:</strong> ${formData.roofType || 'Not specified'}</p>
          <p><strong>Electricity Bill:</strong> ${formData.electricityBill || 'Not specified'}</p>
          <p><strong>Message:</strong> ${formData.message || 'None'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN')}</p>
        `,
      }
      
      try {
        await sgMail.send(adminMsg)
      } catch (emailError) {
        console.error('Admin email error:', emailError)
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Form submitted successfully' 
      }),
    }
  } catch (error) {
    console.error('Form handler error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
    }
  }
}
