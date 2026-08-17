export default [
  {
    rules: {
      'no-unused-vars': 'error', // variable déclarée mais jamais utilisée → erreur
      'no-console': 'warn', // console.log oublié → avertissement (pas bloquant)
      'no-unreachable': 'error', // code après un return → erreur
      eqeqeq: ['error', 'always'], // impose === au lieu de ==
      'prefer-const': 'error', // si une variable n'est jamais réassignée → const
    },
  },
  prettier, //ajoute prettier dans la config eslint pour éviter les conflits entre les deux
];
