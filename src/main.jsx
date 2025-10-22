import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import BetPage from "./pages/BetPage";
import LotoPage from "./pages/LotoPage";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                {/* Barre de navigation */}
                <nav className="bg-blue-700 text-white p-4 flex justify-center gap-6">
                    <Link to="/" className="hover:underline">?? Paris sportifs</Link>
                </nav>

                <main className="p-6">
                    <Routes>
                        <Route path="/" element={<BetPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
