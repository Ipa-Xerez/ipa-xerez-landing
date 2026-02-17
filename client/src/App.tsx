import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PWAInstallButton } from "./components/PWAInstallButton";
import { PWAUpdateNotification } from "./components/PWAUpdateNotification";
import { PWAOfflineIndicator } from "./components/PWAOfflineIndicator";
import { PWAAndroidInstall } from "./components/PWAAndroidInstall";
import Home from "./pages/Home";
import InstallGuide from "./pages/InstallGuide";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import BlogAdmin from "./pages/BlogAdmin";
import Calendar from "./pages/Calendar";
import NewsletterAdmin from "./pages/NewsletterAdmin";
import Unsubscribe from "./pages/Unsubscribe";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/admin/blog"} component={BlogAdmin} />
      <Route path={"/calendar"} component={Calendar} />
      <Route path={"/admin/newsletter"} component={NewsletterAdmin} />
      <Route path={"/unsubscribe"} component={Unsubscribe} />
      <Route path={"/install"} component={InstallGuide} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <PWAOfflineIndicator />
          <PWAUpdateNotification />
          <PWAAndroidInstall />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
