import { QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "components/error-boundary/error-boundary";
import LoadingIndicator from "components/loading-indicator/loading-indicator";
import { queryClient } from "lib/api";
import { loadZodLocale } from "lib/i18n";
import { getLocale } from "lib/paraglide/runtime";
import { AppRouter } from "lib/router";
import { StrictMode, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "style/main.scss";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error(
		"Something has gone terribly wrong. The app couldn't find its home :(",
	);
}

const root = createRoot(rootElement);

const App = () => {
	const locale = getLocale();

	useEffect(() => {
		document.documentElement.setAttribute("lang", locale);
		loadZodLocale(locale);
	}, [locale]);

	return (
		<StrictMode>
			<ErrorBoundary
				fallback={(error) => <pre>{error.toString()}</pre>}
			>
				<Suspense fallback={<LoadingIndicator />}>
					<QueryClientProvider client={queryClient}>
						<AppRouter queryClient={queryClient} />
					</QueryClientProvider>
				</Suspense>
			</ErrorBoundary>
		</StrictMode>
	);
};

root.render(<App />);
