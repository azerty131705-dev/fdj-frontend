import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../services/api";ssss

const ParisSportifs = () => {
    const [matches, setMatches] = useState([]);
    const [selectedBets, setSelectedBets] = useState([]);
    const [stake, setStake] = useState("");
    const [bettorName, setBettorName] = useState(""); // 🆕 Nom du parieur
    const [totalOdds, setTotalOdds] = useState(0);
    const [potentialGain, setPotentialGain] = useState(0);
    const [loading, setLoading] = useState(true);

    // Charger les matchs du backend
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await api.get("/api/matches");
                setMatches(response.data);
            } catch (error) {
                console.error("Erreur chargement matchs :", error);
            }
        };

        fetchMatches();
    }, []);



    // Sélectionner / désélectionner un pari
    const toggleSelection = (match, choice, odd) => {
        const key = `${match.home_team}-${match.away_team}`;
        const existing = selectedBets.find((b) => b.key === key);

        if (existing && existing.choice === choice) {
            setSelectedBets(selectedBets.filter((b) => b.key !== key));
        } else {
            const updated = selectedBets.filter((b) => b.key !== key);
            updated.push({
                key,
                home_team: match.home_team,
                away_team: match.away_team,
                choice,
                odd,
            });
            setSelectedBets(updated);
        }
    };

    // Recalcul des cotes et gains
    useEffect(() => {
        if (selectedBets.length === 0) {
            setTotalOdds(0);
            setPotentialGain(0);
            return;
        }

        const total = selectedBets.reduce((acc, b) => acc + parseFloat(b.odd), 0);
        setTotalOdds(total);

        if (stake && !isNaN(stake)) {
            setPotentialGain((parseFloat(stake) * total).toFixed(2));
        } else {
            setPotentialGain(0);
        }
    }, [selectedBets, stake]);

    // Envoyer le pari vers le backend
    const handleSubmit = async () => {
        if (!bettorName.trim()) {
            alert("❌ Entre ton nom avant de valider ton pari !");
            return;
        }

        if (selectedBets.length === 0 || !stake) {
            alert("❌ Sélectionne au moins un pari et entre ta mise !");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8000/api/bet", {
                username: bettorName, // 🆕 envoi du nom du joueur
                selections: selectedBets,
                stake: parseFloat(stake),
            });
            alert(
                `✅ ${res.data.message}\nCote totale : ${res.data.total_odds}\nGain potentiel : ${res.data.potential_gain} €`
            );
            setSelectedBets([]);
            setStake("");
            setBettorName(""); // reset nom
        } catch (err) {
            alert("❌ Erreur lors de l’envoi du pari.");
            console.error(err);
        }
    };

    // Interface
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4">🏟️ Paris Sportifs</h1>

            {loading ? (
                <p className="text-center text-gray-500">Chargement des matchs...</p>
            ) : matches.length === 0 ? (
                <p className="text-center text-gray-400">Aucun match aujourd’hui.</p>
            ) : (
                <div className="space-y-6">
                    {matches.map((match, idx) => (
                        <div key={idx} className="border rounded-xl p-4 shadow-md bg-white">
                            <h2 className="font-semibold text-lg mb-1">{match.competition}</h2>
                            <p className="text-gray-700 mb-2">
                                {match.home_team} 🆚 {match.away_team} — 🕒 {match.start_time}
                            </p>
                            <div className="flex gap-3 justify-center">
                                {Object.entries(match.odds).map(([team, odd]) => {
                                    const isSelected = selectedBets.some(
                                        (b) =>
                                            b.home_team === match.home_team &&
                                            b.away_team === match.away_team &&
                                            b.choice === team
                                    );
                                    return (
                                        <button
                                            key={team}
                                            onClick={() => toggleSelection(match, team, odd)}
                                            className={`px-3 py-2 rounded-lg text-sm font-semibold border ${isSelected
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                        >
                                            {team === "Draw" ? "Match nul" : team} <br />
                                            <span className="text-blue-600">{odd}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 🧮 Récapitulatif du pari */}
            <div className="mt-8 border-t pt-4 text-center">
                <h3 className="text-xl font-semibold mb-2">🎟️ Ton pari</h3>
                <p>{selectedBets.length} sélection(s)</p>

                <div className="mt-3">
                    <label className="font-semibold mr-2">🧍 Nom du parieur :</label>
                    <input
                        type="text"
                        value={bettorName}
                        onChange={(e) => setBettorName(e.target.value)}
                        placeholder="Nom Prenom RP"
                        className="border p-2 rounded w-64 text-center"
                    />
                </div>

                <div className="mt-3">
                    <label className="font-semibold mr-2">💶 Mise (€) :</label>
                    <input
                        type="number"
                        min="1"
                        value={stake}
                        onChange={(e) => setStake(e.target.value)}
                        className="border p-2 rounded w-32 text-center"
                    />
                </div>

                <div className="mt-4 text-lg">
                    <p>📊 Cote totale : <span className="font-bold">{totalOdds.toFixed(2)}</span></p>
                    <p>💰 Gain potentiel : <span className="text-green-600 font-bold">{potentialGain} €</span></p>
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    Valider le pari ✅
                </button>
            </div>
        </div>
    );
};

export default ParisSportifs;
