export const onRequestPost: PagesFunction = async ({ request, env }) => {
  try {
    const data = await request.json();
    if (!data?.email || !data?.name) {
      return new Response('Bad Request', { status: 400 });
    }
    const mail = {
      personalizations: [
        { to: [{ email: env.SITE_EMAIL_TO || 'machao2024.996@gmail.com' }] }
      ],
      from: {
        email: env.SITE_EMAIL_FROM || 'noreply@medibridge.global',
        name: 'MediBridge Global',
      },
      subject: `New inquiry from ${data.name}`,
      content: [{
        type: 'text/plain',
        value: `Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || ''}
Country: ${data.country || ''}
TWOV: ${data.twov ? 'Yes' : 'No'}
Lang: ${data.lang}
UA: ${data.userAgent}
URL: ${data.url}
Time: ${data.ts}
---
Need: ${data.need || ''}`,
      }]
    };
    const resp = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(mail),
    });
    if (!resp.ok) {
      const msg = await resp.text();
      return new Response('Mail send failed: ' + msg, { status: 500 });
    }
    return new Response('OK');
  } catch (e) {
    return new Response('Server error', { status: 500 });
  }
};
