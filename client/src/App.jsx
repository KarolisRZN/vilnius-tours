import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/Home";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
