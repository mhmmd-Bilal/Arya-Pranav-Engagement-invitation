import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Check, Loader2 } from 'lucide-react';
import Kicker from '../common/Kicker';
import Picture from '../common/Picture';
import { EASE, MaskReveal, Reveal, RevealText } from '../common/Reveal';
import { submitRsvp } from '../../services/rsvpApi';
import { validateRsvp } from '../../utils/validateRsvp';
import { weddingData } from '../../data/weddingData';

const EMPTY = { name: '', contact: '', guests: '1', attending: '', message: '' };
const ERR = 'text-[#8A2E22]';
const inputCls =
  'mt-1 block w-full border-0 border-b bg-transparent px-0 py-3 font-serif text-xl text-espresso placeholder:text-espresso/30 transition-colors duration-300 focus:border-espresso focus:outline-none focus:ring-0 disabled:opacity-50 sm:text-2xl';

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="label text-espresso/55">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-2 text-xs text-espresso/45">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className={`mt-2 text-sm ${ERR}`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function RSVP() {
  const { rsvp } = weddingData;
  const uid = useId();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(null);

  const set = (key) => (e) => {
    const v = e.target.value;
    setValues((prev) => ({ ...prev, [key]: v }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const a11y = (key) => ({
    id: `${uid}-${key}`,
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `${uid}-${key}-error` : undefined,
    className: `${inputCls} ${errors[key] ? 'border-[#8A2E22]' : 'border-espresso/25'}`,
  });

  async function onSubmit(e) {
    e.preventDefault();
    const found = validateRsvp(values, rsvp.maxGuests);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`${uid}-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus('submitting');
    setServerError('');
    try {
      setSubmitted(await submitRsvp(values));
      setStatus('success');
    } catch (err) {
      setServerError(err.message);
      setStatus('error');
    }
  }

  const busy = status === 'submitting';

  return (
    <section id="rsvp" className="bg-linen section-x py-28 sm:py-36 lg:py-48">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Kicker index="02">RSVP</Kicker>
          <RevealText text="Kindly reply" className="display-lg mt-8 font-normal" />
          <Reveal className="mt-6 max-w-sm">
            <p className="font-serif text-xl italic text-espresso/70">
              We would be honoured by your presence. Please respond by {rsvp.deadline}.
            </p>
          </Reveal>
          <MaskReveal className="mt-12 hidden aspect-[4/3] w-4/5 lg:block" from="left">
            <Picture name={rsvp.image} alt="" sizes="30vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
          </MaskReveal>
        </div>

        <Reveal className="lg:col-span-6 lg:col-start-7 lg:pt-6">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'success' ? (
              <motion.div
                key="done"
                role="status"
                className="border-t border-espresso/15 pt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-espresso text-cream">
                  <Check className="size-6" strokeWidth={1.25} aria-hidden="true" />
                </span>
                <h3 className="display-md mt-8 font-normal">Thank you, {submitted.name.split(' ')[0]}.</h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-espresso/70">
                  {submitted.attending
                    ? `Your reply is saved. We can't wait to celebrate with you${submitted.guests > 1 ? ` and your party of ${submitted.guests}` : ''}.`
                    : 'You will be missed. Thank you for letting us know and for sending your blessings.'}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                noValidate
                onSubmit={onSubmit}
                className="space-y-10"
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                aria-busy={busy}
              >
                <Field id={`${uid}-name`} label="Your name" error={errors.name}>
                  <input {...a11y('name')} type="text" autoComplete="name" value={values.name} onChange={set('name')} disabled={busy} placeholder="Full name" />
                </Field>

                <Field id={`${uid}-contact`} label="Email or phone" error={errors.contact}>
                  <input {...a11y('contact')} type="text" inputMode="email" autoComplete="email" value={values.contact} onChange={set('contact')} disabled={busy} placeholder="you@example.com or +91 …" />
                </Field>

                <fieldset>
                  <legend className="label text-espresso/55">Will you attend?</legend>
                  <div
                    className="mt-4 grid gap-3 sm:grid-cols-2"
                    aria-describedby={errors.attending ? `${uid}-attending-error` : undefined}
                  >
                    {[
                      ['yes', 'Joyfully accepts'],
                      ['no', 'Regretfully declines'],
                    ].map(([v, label], i) => (
                      <label
                        key={v}
                        className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-full border px-6 transition-colors duration-300 has-[:checked]:border-espresso has-[:checked]:bg-espresso has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 ${errors.attending ? 'border-[#8A2E22]' : 'border-espresso/25 hover:border-espresso'}`}
                      >
                        <input
                          id={i === 0 ? `${uid}-attending` : undefined}
                          type="radio"
                          name="attending"
                          value={v}
                          checked={values.attending === v}
                          onChange={set('attending')}
                          disabled={busy}
                          aria-invalid={errors.attending ? 'true' : undefined}
                          className="size-4 accent-cream"
                        />
                        <span className="text-sm font-medium tracking-wide">{label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.attending && (
                    <p id={`${uid}-attending-error`} className={`mt-2 text-sm ${ERR}`}>
                      {errors.attending}
                    </p>
                  )}
                </fieldset>

                <AnimatePresence initial={false}>
                  {values.attending === 'yes' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <Field id={`${uid}-guests`} label="Number of guests, including you" error={errors.guests}>
                        <select {...a11y('guests')} value={values.guests} onChange={set('guests')} disabled={busy}>
                          {Array.from({ length: rsvp.maxGuests }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} {i === 0 ? 'guest' : 'guests'}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Field id={`${uid}-message`} label="A note for the couple (optional)" error={errors.message} hint={`${values.message.length}/500`}>
                  <textarea {...a11y('message')} rows={3} value={values.message} onChange={set('message')} disabled={busy} placeholder="Wishes, dietary needs…" className={`${a11y('message').className} resize-none`} />
                </Field>

                {status === 'error' && (
                  <div role="alert" className={`flex gap-3 border-l-2 border-[#8A2E22] bg-white/60 p-4 text-sm ${ERR}`}>
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <p>
                      {serverError} {rsvp.contactText}
                    </p>
                  </div>
                )}

                <button type="submit" disabled={busy} className="group btn-solid w-full disabled:cursor-wait disabled:opacity-80 sm:w-auto">
                  {busy ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Sending…
                    </>
                  ) : (
                    <>
                      Send reply
                      <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
