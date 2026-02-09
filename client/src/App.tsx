import Home from "./pages/Home";
import ColorProvider from "./hooks/ColorProvider";
import AuthProvider from "./hooks/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <ColorProvider>
        <Home />
      </ColorProvider>
    </AuthProvider>
  );
}

export default App;
