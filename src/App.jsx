import Router from "./Router/Router";
//import { AuthProvider } from "./Context/AuthContext";
import { SnackbarProvider } from "./Context/SnackbarContext";
import { ThemeProviderComponent } from "./context/ThemeContext";

function App() {
  return (
//    <AuthProvider>
      <ThemeProviderComponent>
        <SnackbarProvider>
          <Router />
        </SnackbarProvider>
      </ThemeProviderComponent>
 //   </AuthProvider>
  );
}

export default App;
