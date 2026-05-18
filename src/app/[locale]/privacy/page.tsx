import { unstable_setRequestLocale } from 'next-intl/server';

export const metadata = { title: 'Privacy Policy' };

export default function Privacy({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return (
    <div className="container max-w-3xl py-12 prose prose-neutral">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-sm text-neutral-500">Last updated: May 2026</p>

      <h2 className="mt-8 text-xl font-semibold">What we collect</h2>
      <ul className="ml-6 list-disc space-y-1 text-neutral-700">
        <li><strong>Account info:</strong> email and password (hashed) when you sign up as a worker.</li>
        <li><strong>Public profile info:</strong> name, phone, WhatsApp number, city, area, services, rates, photo, bio. You choose to publish all of this.</li>
        <li><strong>Technical info:</strong> standard server logs (IP, browser) for security and to fight spam.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">How we use it</h2>
      <p className="text-neutral-700">Your public profile fields are shown to anyone visiting MazdoorPK so customers can call or WhatsApp you. Your email and password are never shown publicly and are used only to log you in.</p>

      <h2 className="mt-8 text-xl font-semibold">What we don&apos;t do</h2>
      <ul className="ml-6 list-disc space-y-1 text-neutral-700">
        <li>We do not sell your data to third parties.</li>
        <li>We do not run ads (today).</li>
        <li>We do not handle payments — any payment is directly between you and the worker.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Third parties</h2>
      <p className="text-neutral-700">We use Supabase (database + auth) and Vercel (hosting). Both store data outside Pakistan and have their own privacy policies.</p>

      <h2 className="mt-8 text-xl font-semibold">Delete your data</h2>
      <p className="text-neutral-700">From your Dashboard you can pause your listing or delete your account. To request full deletion, email <a className="text-brand-700 underline" href="mailto:molaa.531@gmail.com">molaa.531@gmail.com</a>.</p>

      <h2 className="mt-8 text-xl font-semibold">Contact</h2>
      <p className="text-neutral-700">Questions? Email <a className="text-brand-700 underline" href="mailto:molaa.531@gmail.com">molaa.531@gmail.com</a>.</p>
    </div>
  );
}
