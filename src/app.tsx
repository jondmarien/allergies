import { useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { useSettings } from '@/state/profileStore';
import { HomePage } from '@/routes/Home';
import { CardPage } from '@/routes/Card';
import { ProfilePage } from '@/routes/Profile';
import { SettingsPage } from '@/routes/Settings';
import { SharePage } from '@/routes/Share';
import { PublicCardPage } from '@/routes/PublicCard';

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, cardContrast } = useSettings();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.cardContrast = cardContrast;
  }, [theme, cardContrast]);

  return <>{children}</>;
}

export function App() {
  return (
    <ThemeProvider>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/card" component={CardPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/share" component={SharePage} />
        <Route path="/c/:data" component={PublicCardPage} />
        <Route>
          <div className="flex min-h-dvh items-center justify-center">
            <p>Not found</p>
          </div>
        </Route>
      </Switch>
    </ThemeProvider>
  );
}
