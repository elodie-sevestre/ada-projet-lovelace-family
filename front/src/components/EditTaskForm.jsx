// Modification d'une tâche

// récupérer le bouton modifier
// qd je clique sur le bouton modifier, un pop-up apparait pour modifier la tâche
// les champs name, description, points, status et assigantion sont pré-remplis
// récupérer l'état de chaque champs
// l'utilisateur modifie les champs manuellement
// l'utilisateur peut cliquer soit
// sur le bouton enregistrer -> modification de la bdd (ajouter un toast de qqs secondes pour pouvoir annuler si clique par erreur)
// sur le bouton annuler

// bouton modifier dans adahsboard

/* CategoryCard.jsx

const [editMode, setEditMode] = useState(false);
const [editName, setEditName] = useState(category.name);

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_URL}/categories/${category.id}/skills`);
      const data = await response.json();
      setSkills(data);
    } catch (err) {
      console.error("Erreur :", err);
      onError("Impossible de charger les compétences.");
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [category.id]);

<input
            type="text"
            className="category-name-input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveName();
              if (e.key === "Escape") { setEditMode(false); setEditName(category.name); }
            }}
            aria-label="Modifier le nom de la catégorie"
            autoFocus
          />

<button
          className="btn-category-edit"
          onClick={() => setEditMode(true)}
          aria-label={`Modifier le nom de la catégorie ${category.name}`}
        ></button>

*/
