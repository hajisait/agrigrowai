import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — AgriAI Assist" },
      {
        name: "description",
        content:
          "How AgriAI Assist handles farmer data, location, uploaded crop photos, cookies and advertising partners.",
      },
      { property: "og:title", content: "Privacy Policy — AgriAI Assist" },
      { property: "og:description", content: "Our data, cookie and advertising practices explained simply." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

const UPDATED = "3 August 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-9">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="text-sm leading-relaxed text-foreground/70 space-y-2">{children}</div>
    </section>
  );
}

export function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="px-6 pt-28 pb-16 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-foreground/45 mt-2 mb-10">Last updated: {UPDATED}</p>

        <Section title="1. Who we are">
          <p>
            AgriAI Assist is a free farming advisory web app offering an AI assistant, crop disease
            detection, weather forecasts, mandi prices, government scheme information and farm
            calculators for Indian farmers.
          </p>
        </Section>

        <Section title="2. Information we collect">
          <ul className="list-disc pl-5 space-y-1">
            <li><b>Questions you type or speak</b> to the AI assistant, so we can generate an answer.</li>
            <li><b>Photos you upload</b> of crops or soil health cards, used only to produce your analysis.</li>
            <li><b>Approximate location</b> (only if you allow it, or the city name you type) to show local weather and prices.</li>
            <li><b>Local device storage</b> for your language, theme, saved alerts and calculator inputs. This stays on your device.</li>
            <li><b>Basic technical data</b> such as IP address and browser type, used for security and abuse prevention.</li>
          </ul>
          <p>We do not ask for your name, Aadhaar, bank details or land records, and you should never enter them here.</p>
        </Section>

        <Section title="3. How we use it">
          <p>
            Only to deliver the feature you requested, to keep the service secure and rate-limited
            against abuse, and to improve accuracy. We do not sell your personal data.
          </p>
        </Section>

        <Section title="4. AI processing">
          <p>
            Your questions and uploaded images are sent to third-party AI model providers (such as
            Google Gemini and our AI gateway) purely to generate a response. Advice is informational
            and is not a substitute for your local Krishi Vigyan Kendra or agronomist.
          </p>
        </Section>

        <Section title="5. Cookies and advertising">
          <p>
            We use minimal local storage for your preferences. This site may display advertising and
            sponsored/affiliate offers. If Google AdSense is enabled, Google and its partners may use
            cookies or device identifiers to serve ads, including personalised ads based on your prior
            visits to this and other sites.
          </p>
          <p>
            You can opt out of personalised advertising at{" "}
            <a
              className="text-primary font-semibold underline"
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>{" "}
            or via{" "}
            <a
              className="text-primary font-semibold underline"
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
            >
              aboutads.info
            </a>
            . Sponsored links may earn us a commission at no extra cost to you.
          </p>
        </Section>

        <Section title="6. Third-party services">
          <p>
            We rely on trusted providers for hosting, database/auth, weather data, market price data
            and AI inference. Each processes only the minimum data needed for its function.
          </p>
        </Section>

        <Section title="7. Data retention">
          <p>
            Preferences stay on your device until you clear your browser data. Server-side request
            logs are kept only briefly for security and diagnostics.
          </p>
        </Section>

        <Section title="8. Children">
          <p>The service is not directed at children under 13, and we do not knowingly collect their data.</p>
        </Section>

        <Section title="9. Your choices">
          <p>
            You can deny location access, avoid uploading photos, and clear stored preferences from
            your browser settings at any time. To request deletion of anything you believe we hold,
            contact us below.
          </p>
        </Section>

        <Section title="10. Contact">
          <p>
            Questions about this policy? Email{" "}
            <a className="text-primary font-semibold underline" href="mailto:support@agrigrowai.app">
              support@agrigrowai.app
            </a>
            .
          </p>
        </Section>
      </main>
      <Footer />
    </>
  );
}
