import Home from "./pages/Home";
import ColorProvider from "./hooks/ColorProvider";
import AuthProvider from "./hooks/AuthProvider";
import FavoritesProvider from "./hooks/FavoritesProvider";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ColorProvider>
          <Home />
        </ColorProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
