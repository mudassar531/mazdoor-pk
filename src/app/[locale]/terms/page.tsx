import { unstable_setRequestLocale } from 'next-intl/server';

export const metadata = { title: 'Terms of Use' };

export default function Terms({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return (
    <div className="container max-w-3xl py-12 prose prose-neutral">
      <h1 className="text-3xl font-bold">Terms of Use</h1>
      <p className="text-sm text-neutral-500">Last updated: May 2026</p>

      <p className="text-neutral-700">By using MazdoorPK you agree to these terms.</p>

      <h2 className="mt-8 text-xl font-semibold">What MazdoorPK is</h2>
      <p className="text-neutral-700">MazdoorPK is a free directory. Workers list their own services and contact details. Customers contact workers directly. We are not a party to any agreement between customers and workers.</p>

      <h2 className="mt-8 text-xl font-semibold">No guarantees</h2>
      <p className="text-neutral-700">We do not vet, verify, employ, or insure workers. We do not guarantee quality, pricing, availability or safety. Use your own judgement before hiring.</p>

      <h2 className="mt-8 text-xl font-semibold">Acceptable use</h2>
      <ul className="ml-6 list-disc space-y-1 text-neutral-700">
        <li>Post real information about yourself only.</li>
        <li>No fake listings, no illegal services, no harassment, no scams.</li>
        <li>Do not impersonate someone else.</li>
        <li>Do not scrape or bulk-extract worker contact details.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Moderation</h2>
      <p className="text-neutral-700">We may remove any listing at any time for any reason — especially listings that look fraudulent, spammy, or unsafe.</p>

      <h2 className="mt-8 text-xl font-semibold">No liability</h2>
      <p className="text-neutral-700">MazdoorPK is provided &quot;as is&quot;. To the maximum extent allowed by law, we are not liable for any loss arising out of your use of the service or your interaction with anyone you find on it.</p>

      <h2 className="mt-8 text-xl font-semibold">Changes</h2>
      <p className="text-neutral-700">We may update these terms; the &quot;last updated&quot; date will change. Continued use means you accept the updates.</p>

      <h2 className="mt-8 text-xl font-semibold">Contact</h2>
      <p className="text-neutral-700">Email <a className="text-brand-700 underline" href="mailto:molaa.531@gmail.com">molaa.531@gmail.com</a>.</p>
    </div>
  );
}
