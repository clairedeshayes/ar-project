export function getFirstArticle(name) {
  endpoint =
    'https://fr.wikipedia.org/w/api.php?action=opensearch&search=' +
    name +
    '&limit=1&format=json&origin=*';
  fetch(endpoint)
    .then(response => response)
    .catch(() =>
      console.error('Erreur: Impossible de récupérer la page wiki.')
    );
}
