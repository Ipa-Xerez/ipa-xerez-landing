import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PWAInstallButton } from "./components/PWAInstallButton";
import { PWAUpdateNotification } from "./components/PWAUpdateNotification";
import { PWAOfflineIndicator } from "./components/PWAOfflineIndicator";
import { PWAAndroidInstall } from "./components/PWAAndroidInstall";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import Home from "./pages/Home";
import InstallGuide from "./pages/InstallGuide";
import Gallery from "./pages/Gallery";
import Calendar from "./pages/Calendar";
import EventDetail from "./pages/EventDetail";
import Unsubscribe from "./pages/Unsubscribe";

import Inscription from "./pages/Inscription";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      
      {/* Public routes */}
      <Route path={"/"} component={Home} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/calendar"} component={Calendar} />
      <Route path={"/evento/:id"} component={EventDetail} />
      <Route path={"/unsubscribe"} component={Unsubscribe} />
      <Route path={"/install"} component={InstallGuide} />
      <Route path="/admin-blog" element={<AdminBlog />} />


      <Route path={"/inscripcion"} component={Inscription} />
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
          <PWAInstallPrompt />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
