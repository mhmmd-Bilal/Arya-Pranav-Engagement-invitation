// ─────────────────────────────────────────────────────────────────────────────
// ALL WEDDING CONTENT LIVES HERE. Components only read from this file.
// Names, parents, dates and venue below are SAMPLE placeholders — replace them
// with the client's real details before launch.
//
// Images are referenced by name (see scripts/images.json + ATTRIBUTIONS.md).
// To use a client photo: save it as photos-src/<name>.jpg and run `npm run images`.
// Dates are ISO 8601 with the venue's UTC offset so the countdown is exact
// for guests in any timezone.
// ─────────────────────────────────────────────────────────────────────────────

export const weddingData = {
  bride: {
    name: 'Arya',
    fullName: 'Arya',
    parents: 'Mrs. Sunita & Mr. Rajesh Sharma',
    relation: 'Daughter of',
    about:
      'An architect who sketches doorways wherever she travels, collects old brass lamps and believes every evening deserves jasmine.',
    image: 'bride-portrait-red-lehenga',
  },
  groom: {
    name: 'Pranav',
    fullName: 'Pranav',
    parents: 'Mrs. Kavita & Mr. Anil Mehra',
    relation: 'Son of',
    about:
      'A doctor with a quiet laugh, a weakness for monsoon chai and an unshakeable habit of planting a tree on every birthday.',
    image: 'groom-jasmine-garden',
  },

  // The moment the countdown runs to (the wedding muhurat).
  date: '2026-12-31T15:00:00+05:30',
  displayDate: '31 December 2026',
  numericDate: '31.12.2026',
  timeLabel: '3:00 PM IST · Engagement',
  city: 'Kannur, Kerala',
  hashtag: '#AryaAndPranav',

  opening: {
    image: 'mandap-garden-morning',
    button: 'Enter the celebration',
  },

  hero: {
    image: 'rings-diamond-moody',
    tagline: 'And so begins our favourite chapter, a lifetime of us.',
  },

  invitation: {
    blessing: 'With the blessings of our elders',
    // Words wrapped in *asterisks* are set in italic.
    statement:
      'Together with our families, we invite you to a garden where the old banyan has watched over *generations* — to witness the beginning of our *forever*.',
    announcement:
      'Amid love, laughter and the company of those we cherish, we’d love for you to be there too!!',
    families: 'The Sharma & Mehra families',
    image: 'hanging-jasmine-couple',
  },

  story: [
    {
      date: 'June 2021',
      title: 'The first meeting',
      text: 'A crowded rooftop in Jaipur, a power cut, and two strangers sharing the light of one phone torch.',
      image: 'couple-forest-path',
    },
    {
      date: 'June 2021',
      title: 'The first conversation',
      text: 'What began as small talk about old architecture lasted until the lights came back — and long after.',
      image: 'couple-river-rock',
    },
    {
      date: 'Winter 2022',
      title: 'Small, special things',
      text: 'Monsoon drives, terrible poetry, a hundred cups of chai and one very patient banyan tree.',
      image: 'couple-garden-embrace',
    },
    {
      date: 'March 2026',
      title: 'The question',
      text: 'Under strings of jasmine, surrounded by both families, a question was asked and answered with happy tears.',
      image: 'rings-hands-gold',
    },
    {
      date: 'December 2026',
      title: 'Forever begins',
      text: 'And now we invite you to the garden where our next chapter begins.',
      image: 'couple-ivory-embrace',
    },
  ],

  events: [
    {
      name: 'A Moment in Forever, Our Engagement',
      date: 'Thursday, 31 December 2026',
      time: '3:00 PM – 6:00 PM',
      venue: 'Bala Beach Resort',
      description: 'An afternoon by the sea as we exchange rings with the people we love most around us.',
      image: 'rings-hands-gold',
      mapQuery: 'Bala Beach Resort, Payyambalam Beach Road, Chalad, Kannur',
    },
    {
      name: "Into 2027 With You, Our New Year's Celebration",
      date: 'Thursday, 31 December 2026',
      time: '8:00 PM – 1:00 AM',
      venue: 'Bala Beach Resort',
      description: 'Dinner, music and dancing as we welcome the new year — and our new chapter — together.',
      image: 'couple-floral-arch-night',
      mapQuery: 'Bala Beach Resort, Payyambalam Beach Road, Chalad, Kannur',
    },
  ],

  venue: {
    name: 'Bala Beach Resort',
    address: 'Payyambalam Beach Road, Chalad, Kannur, Kerala',
    // Used for the embedded map, Open in Maps and Get Directions.
    mapQuery: 'Bala Beach Resort, Payyambalam Beach Road, Chalad, Kannur',
    image: 'rings-gold-moss',
    note: 'The resort sits right on Payyambalam beach.',
  },

  countdown: { image: 'rings-diamond-roses' },

  // span: how much room the photo takes in the editorial grid (desktop).
  gallery: [
    { image: 'mandap-garden-morning', alt: 'White floral mandap in a misty garden', span: 'tall' },
    { image: 'couple-ivory-embrace', alt: 'Couple embracing in ivory outfits', span: 'wide' },
    { image: 'white-floral-console', alt: 'Antique console framed by white florals', span: 'small' },
    { image: 'lawn-drapes-table', alt: 'Draped canopy over a garden lawn', span: 'tall' },
    { image: 'henna-hands-dark', alt: 'Hands with henna and bangles', span: 'small' },
    { image: 'couple-garden-embrace', alt: 'Couple sharing a quiet moment in the garden', span: 'tall' },
    { image: 'sweetheart-table-florals', alt: 'Sweetheart table beneath white flowers', span: 'wide' },
    { image: 'candlelit-white-table', alt: 'Candlelit table with white roses', span: 'tall' },
    { image: 'hanging-jasmine-couple', alt: 'Hanging jasmine strings behind the couple', span: 'wide' },
    { image: 'couple-forest-path', alt: 'Couple on a tree-lined path', span: 'small' },
  ],

  rsvp: {
    deadline: '15 December 2026',
    maxGuests: 6,
    image: 'sweetheart-table-florals',
    // The POST endpoint comes from VITE_RSVP_ENDPOINT (see .env.example).
    contactText: 'If you have trouble responding online, please call +91 00000 00000.',
  },

  closing: {
    image: 'rings-peony-bouquet',
    message:
      'Amid love, laughter and the company of those we cherish. We’d love for you to be there too!!',
    signOff: 'With lots n lots of love,',
  },

  social: [
    // { label: 'Instagram', url: 'https://instagram.com/...' },
  ],
};
