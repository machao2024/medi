export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data?.email || !data?.name) {
      return new Response(JSON.stringify({ error: 'Name and email are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Honeypot check - if filled, silently succeed without sending
    if (data.hp) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Compose email content
    const emailBody = `
New Inquiry from MediBridge Global

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Country: ${data.country || 'Not provided'}
TWOV Assessment: ${data.twov ? 'Yes' : 'No'}
Language: ${data.lang || 'en'}

Needs:
${data.need || 'Not provided'}

---
Submitted at: ${data.ts || new Date().toISOString()}
User Agent: ${data.userAgent || 'Unknown'}
Page URL: ${data.url || 'Unknown'}
    `.trim();

    // Send email via MailChannels (free for Cloudflare Workers/Pages)
    const mailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: env.SITE_EMAIL_TO || 'machao2024.996@gmail.com' }],
          },
        ],
        from: {
          email: env.SITE_EMAIL_FROM || 'noreply@medical2025.2024-996.tech',
          name: 'MediBridge Global',
        },
        subject: `New Inquiry from ${data.name} - MediBridge Global`,
        content: [
          {
            type: 'text/plain',
            value: emailBody,
          },
        ],
      }),
    });

    if (!mailResponse.ok) {
      const errorText = await mailResponse.text();
      console.error('MailChannels error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error('Contact form error:', e);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
