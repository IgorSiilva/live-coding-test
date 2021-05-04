const CharactersController = require('../Controllers/CharactersController');

module.exports = (app) => {
   app.get('/character', CharactersController.get);
   app.get('/character/:id', CharactersController.getSingleCharacter)
   app.get('/character/:id/episode', CharactersController.getCharacterEpisode)
}