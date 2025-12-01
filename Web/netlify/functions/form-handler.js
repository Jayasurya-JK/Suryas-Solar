// Netlify Functions handler for form submissions
// This function sends data to Zapier/Make webhook

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
    if (!formData.name || !formData.mobile) {
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
          address: formData.address || '',
          pincode: formData.pincode || '',
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
