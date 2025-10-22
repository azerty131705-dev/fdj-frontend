import React, { useState } from "react";
import axios from "axios";

export default function LotoPage() {
    const [username, setUsername] = useState("");
    const [numbers, setNumbers] = useState([]);
    const [chance, setChance] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleNumberChange = (index, value) => {
        const updated = [...numbers];
        updated[index] = value ? parseInt(value) : "";
        setNumbers(updated);
    };

    const handleSubmit = async () => {
        if (numbers.length !== 5 || numbers.some((n) => !n) || !chance || !username) {
            setMessage("❌ Remplis tous les champs avant de jouer !");
            return;
        }

        setIsSending(true);
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/loto", {
                username,
                numbers: numbers.map((n) => parseInt(n)),
                chance: parseInt(chance),
            });

            if (response.data.status === "ok") {
                setMessage(`✅ ${response.data.message}`);
            } else {
                setMessage(`⚠️ ${response.data.message}`);
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Erreur lors de l'envoi, réessaie plus tard !");
        }
        setIsSending(false);
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
                🎱 LOTO VIRTUEL
            </h1>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Nom du joueur"
                    className="border p-2 w-full rounded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <div>
                    <h2 className="font-semibold mb-2">Tes 5 numéros :</h2>
                    <div className="grid grid-cols-5 gap-2">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <input
                                key={i}
                                type="number"
                                className="border p-2 rounded text-center"
                                value={numbers[i] || ""}
                                onChange={(e) => handleNumberChange(i, e.target.value)}
                                min="1"
                                max="49"
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="font-semibold mb-2">Numéro chance :</h2>
                    <input
                        type="number"
                        className="border p-2 rounded w-full text-center"
                        value={chance}
                        onChange={(e) => setChance(e.target.value)}
                        min="1"
                        max="10"
                    />
                </div>

                {/* 🟢 Aperçu du ticket */}
                <div className="mt-4 p-4 bg-gray-50 border rounded-lg text-center">
                    <h3 className="font-semibold text-gray-700 mb-2">🎫 Ton ticket :</h3>
                    {username && <p className="text-sm">👤 <strong>{username}</strong></p>}
                    {numbers.length > 0 && (
                        <p>🔢 Numéros : {numbers.filter((n) => n).join(", ") || "Aucun"}</p>
                    )}
                    {chance && <p>🌟 Numéro chance : {chance}</p>}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSending}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full"
                >
                    {isSending ? "Envoi en cours..." : "🎟️ Valider ma participation"}
                </button>

                {message && (
                    <p className="mt-4 text-center text-gray-800 font-semibold">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
