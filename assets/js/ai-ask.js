async function askAI() {
    const title = document.title?.trim() || "";
    const url = location.href;
    const selection = (window.getSelection?.().toString().trim()) || "";

    const getMeta = (name) => document.querySelector(`meta[name="${name}"]`)?.content?.trim() || "";
    const metaDesc = getMeta("wiki-description") || getMeta("description");
    const metaTags = getMeta("wiki-tags");
    const metaCat  = getMeta("wiki-category");

    const opt = (label, val) => val ? `- ${label} : ${val}\n` : "";

    const prompt =
        `Rôle : Tu es un coach pédagogique pour étudiant en BUT Informatique (niveau 1 à 3, bac +1 à +3).
Ta mission : m'aider à COMPRENDRE et à RÉFLÉCHIR par moi-même, sans me donner la réponse toute faite.

Contexte de la page :
- Titre : ${title}
- Lien : ${url}
${opt("Catégorie", metaCat)}${opt("Mots-clés", metaTags)}${opt("Résumé/meta", metaDesc)}${selection ? `- Passage sélectionné : """\n${selection}\n"""\n` : ""}

Consignes pour ta réponse :
1) Commence par un petit diagnostic (≤3 points) sur le sujet ou mes difficultés possibles.
2) Pose 3 à 5 questions qui m’aident à raisonner par étapes.
3) Donne des indices progressifs plutôt que des réponses directes.
4) Explique la méthode ou la logique du raisonnement.
5) Ajoute un mini-exercice ou un cas concret à tester.
6) Signale les erreurs ou confusions fréquentes.
7) Termine avec des conseils concrets ou ressources pour aller plus loin.

Format attendu :
- Diagnostic rapide  
- Questions guidées  
- Indices graduels  
- Mini-exercice  
- Pièges courants  
- Prochaines étapes

Contexte étudiant :
- Niveau : BUT Informatique (bac +1 à +3)
- Objectif : comprendre le sujet de la page ci-dessus sans que tu fasses le travail à ma place.`;

    try {
        await navigator.clipboard.writeText(prompt);
        alert("Tu peux utiliser le prompt dans ton presse papier sur toute IA pour t'aider.");
    } catch (e) {
        console.error("❌ Erreur lors de la copie :", e);
        const ta = document.createElement("textarea");
        ta.value = prompt;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
    }
}