export default async function handler(req, res) {
  // For Next.js API routes (alternative to Netlify Functions)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const formData = req.body

    // Validate required fields
    if (!formData.name || !formData.mobile || !formData.pincode) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Send to Zapier/Make webhook
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

    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
    })
  } catch (error) {
    console.error('Form handler error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    })
  }
}
