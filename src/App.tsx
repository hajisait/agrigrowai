import { I18nProvider } from "@/lib/i18n";
import { SpaRouterProvider, useSpaRouter } from "@/lib/spa-router";
import { Landing } from "@/routes/index";
import { AssistantPage } from "@/routes/assistant";
import { CalculatorPage } from "@/routes/calculator";
import { DiseasePage } from "@/routes/disease";
import { MarketPage } from "@/routes/market";
import { SchemesPage } from "@/routes/schemes";
import { WeatherPage } from "@/routes/weather";

function Routes() {
  const { path } = useSpaRouter();
  if (path === "/assistant") return <AssistantPage />;
  if (path === "/calculator") return <CalculatorPage />;
  if (path === "/disease") return <DiseasePage />;
  if (path === "/market") return <MarketPage />;
  if (path === "/schemes") return <SchemesPage />;
  if (path === "/weather") return <WeatherPage />;
  return <Landing />;
}

export function App() {
  return (
    <I18nProvider>
      <SpaRouterProvider>
        <Routes />
      </SpaRouterProvider>
    </I18nProvider>
  );
}