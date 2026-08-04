import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { SpaRouterProvider, useSpaRouter } from "@/lib/spa-router";
import { Landing } from "@/routes/index";
import { AssistantPage } from "@/routes/assistant";
import { CalculatorPage } from "@/routes/calculator";
import { DiseasePage } from "@/routes/disease";
import { MarketPage } from "@/routes/market";
import { SchemesPage } from "@/routes/schemes";
import { WeatherPage } from "@/routes/weather";
import { FertilizerPage } from "@/routes/fertilizer";
import { CalendarPage } from "@/routes/calendar";
import { SoilPage } from "@/routes/soil";
import { AlertsPage } from "@/routes/alerts";
import { PricingPage } from "@/routes/pricing";
import { PrivacyPage } from "@/routes/privacy";
import { AuthPage } from "@/routes/auth";
import { AccountPage } from "@/routes/account";
import { RemindersPage } from "@/routes/reminders";
import { PromoPopup } from "@/components/site/PromoPopup";

function Routes() {
  const { path } = useSpaRouter();
  if (path === "/assistant") return <AssistantPage />;
  if (path === "/calculator") return <CalculatorPage />;
  if (path === "/disease") return <DiseasePage />;
  if (path === "/market") return <MarketPage />;
  if (path === "/schemes") return <SchemesPage />;
  if (path === "/weather") return <WeatherPage />;
  if (path === "/fertilizer") return <FertilizerPage />;
  if (path === "/calendar") return <CalendarPage />;
  if (path === "/soil") return <SoilPage />;
  if (path === "/alerts") return <AlertsPage />;
  if (path === "/pricing") return <PricingPage />;
  if (path === "/privacy") return <PrivacyPage />;
  if (path === "/auth") return <AuthPage />;
  if (path === "/account") return <AccountPage />;
  if (path === "/reminders") return <RemindersPage />;
  return <Landing />;
}

export function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <SpaRouterProvider>
          <Routes />
          <PromoPopup />
        </SpaRouterProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
