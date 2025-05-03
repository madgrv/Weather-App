import { AppLayout } from './components/AppLayout';
import { ThemeProvider } from './components/ui/theme-provider';

function App() {
	return (
		<ThemeProvider defaultTheme="light">
			<div className="min-h-screen bg-background text-foreground">
				<AppLayout />
			</div>
		</ThemeProvider>
	);
}

export default App;
