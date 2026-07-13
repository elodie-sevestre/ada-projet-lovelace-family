// Désactive la transformation Babel de Jest, incompatible avec l'ESM natif
// (voir require is not defined / _getJestObj si ce fichier est supprimé)
export default {
  transform: {},
};
