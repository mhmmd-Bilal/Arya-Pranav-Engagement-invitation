const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]{7,20}$/;

/** Returns { field: message } for every invalid field; empty object when valid. */
export function validateRsvp(values, maxGuests) {
  const errors = {};
  const name = values.name.trim();
  const contact = values.contact.trim();

  if (name.length < 2) errors.name = 'Please enter your full name.';
  else if (name.length > 80) errors.name = 'Please keep your name under 80 characters.';

  if (!contact) errors.contact = 'Please share an email or phone number.';
  else if (!EMAIL.test(contact) && !(PHONE.test(contact) && contact.replace(/\D/g, '').length >= 7)) {
    errors.contact = 'Enter a valid email address or phone number.';
  }

  if (!values.attending) errors.attending = 'Please let us know if you can join.';

  if (values.attending === 'yes') {
    const n = Number(values.guests);
    if (!Number.isInteger(n) || n < 1 || n > maxGuests) errors.guests = `Choose between 1 and ${maxGuests} guests.`;
  }

  if (values.message.length > 500) errors.message = 'Please keep your message under 500 characters.';
  return errors;
}
