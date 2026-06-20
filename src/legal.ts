// Canonical legal text for Vynyl. Rendered in-app by screens/Legal.tsx and
// mirrored in TERMS.md / PRIVACY.md at the repo root.
//
// IMPORTANT: This is a plain-language template, not legal advice. Before you
// publish or monetise Vynyl, fill in the [bracketed] placeholders and have a
// lawyer review it — and switch off the unofficial JioSaavn backend (see the
// "Before you publish" checklist in README.md).

export const LAST_UPDATED = "21 June 2026";
export const CONTACT_EMAIL = "[your-email@example.com]"; // TODO: replace before sharing publicly
export const OWNER = "the developer of Vynyl"; // TODO: replace with your name / company
export const JURISDICTION = "India"; // TODO: confirm your jurisdiction

export interface LegalSection {
  heading: string;
  body: string[];
}

export const TERMS: LegalSection[] = [
  {
    heading: "1. About these terms",
    body: [
      `Vynyl ("the App") is an independent, non-commercial music-player project made by ${OWNER} ("we", "us"). By using the App you agree to these Terms. If you do not agree, please do not use the App.`,
      "The App is currently provided for personal, non-commercial use only (a learning / portfolio project). It is not sold, and it carries no advertising or subscriptions.",
    ],
  },
  {
    heading: "2. The music is not ours",
    body: [
      "Vynyl does not own, host, or store any music. It is a player that requests songs, artwork, and metadata from third-party music services. All audio, cover art, names, and trademarks belong to their respective owners — the artists, labels, and the services that license them.",
      "Vynyl is not affiliated with, sponsored by, or endorsed by any music service, record label, or artist. Their content is shown subject to their own terms, and may change or become unavailable at any time.",
    ],
  },
  {
    heading: "3. Acceptable use",
    body: [
      "You agree to use the App only for your own personal listening. You will not: download, copy, redistribute, or sell any content obtained through the App; remove or bypass any technical protection; use the App to infringe anyone's copyright; or use it in any way that breaks the terms of the underlying music services.",
    ],
  },
  {
    heading: "4. Intellectual property",
    body: [
      "The App's own source code, design, and branding are owned by us and provided under the project's licence. This does not extend any rights to the third-party music or artwork played through the App.",
    ],
  },
  {
    heading: "5. No warranty",
    body: [
      'The App is provided "as is" and "as available", without warranties of any kind. We do not guarantee that any song will be available, that playback will be uninterrupted, or that the App will be error-free. Music availability depends entirely on third-party services we do not control.',
    ],
  },
  {
    heading: "6. Limitation of liability",
    body: [
      "To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the App, including any loss arising from third-party content or service outages.",
    ],
  },
  {
    heading: "7. Copyright & takedowns",
    body: [
      `Vynyl does not host content, but we respect copyright. If you believe the App references material in a way that infringes your rights, contact us at ${CONTACT_EMAIL} and we will respond promptly.`,
    ],
  },
  {
    heading: "8. Changes & contact",
    body: [
      `We may update these Terms; continued use means you accept the changes. These Terms are governed by the laws of ${JURISDICTION}. Questions: ${CONTACT_EMAIL}.`,
    ],
  },
];

export const PRIVACY: LegalSection[] = [
  {
    heading: "1. The short version",
    body: [
      "Vynyl is built to need as little of your data as possible. There is no account, no login, and no server run by us that stores your information.",
    ],
  },
  {
    heading: "2. What stays on your device",
    body: [
      "Your liked songs and your audio-quality preference are saved locally on your device (in the browser/app storage) so the App remembers them. This data never leaves your device and is not sent to us. Clearing the App's data removes it.",
    ],
  },
  {
    heading: "3. Requests to third-party services",
    body: [
      "When you search or play a song, the App sends that request to third-party music services to fetch results and audio. Those services may receive technical information (such as your IP address) as part of any normal internet request, and their own privacy policies apply. We do not control or receive that data.",
    ],
  },
  {
    heading: "4. No tracking or selling",
    body: [
      "We do not run analytics, advertising, or trackers in this version, and we do not sell or share personal data. If that ever changes (for example, if accounts or analytics are added in a future public release), this policy will be updated and consent obtained where required.",
    ],
  },
  {
    heading: "5. Children & your rights",
    body: [
      "The App is not directed at children under 13. Because we hold no personal data about you, there is nothing for us to access, correct, or delete on our side; you remain in control of the local data on your device.",
    ],
  },
  {
    heading: "6. Contact",
    body: [`Questions about privacy: ${CONTACT_EMAIL}.`],
  },
];

export const LICENSES: { name: string; license: string }[] = [
  { name: "React & React-DOM", license: "MIT" },
  { name: "Vite", license: "MIT" },
  { name: "crypto-js", license: "MIT" },
  { name: "Plus Jakarta Sans (font)", license: "SIL Open Font License 1.1" },
];
