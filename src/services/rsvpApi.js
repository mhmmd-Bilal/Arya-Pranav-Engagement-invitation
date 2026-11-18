// The only place the site talks to an RSVP backend.
// Set VITE_RSVP_ENDPOINT to any URL that accepts a JSON POST
// (your own API, a Google Apps Script web app, Formspree, etc.).
const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT;

export const rsvpEnabled = Boolean(ENDPOINT);

export class RsvpError extends Error {}

export async function submitRsvp(values) {
  if (!ENDPOINT) {
    throw new RsvpError('Online RSVP is not open yet.');
  }
  const payload = {
    name: values.name.trim(),
    contact: values.contact.trim(),
    attending: values.attending === 'yes',
    guests: values.attending === 'yes' ? Number(values.guests) : 0,
    message: values.message.trim(),
    submittedAt: new Date().toISOString(),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) throw new RsvpError(`We couldn't save your response (error ${res.status}). Please try again.`);
    return payload;
  } catch (err) {
    if (err instanceof RsvpError) throw err;
    throw new RsvpError(
      err.name === 'AbortError'
        ? 'The connection timed out. Please check your network and try again.'
        : "We couldn't reach the server. Please check your connection and try again.",
    );
  } finally {
    clearTimeout(timer);
  }
}
