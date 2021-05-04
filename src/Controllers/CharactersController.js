const axios = require('axios');
const stringSimilarity = require("string-similarity");



exports.get = (req, res, next) => {
    const {current_page, limit, name, status} =  req.query


    let page = current_page || 1;
    let per_page_items = limit;
    let offset = (page - 1) * per_page_items;
    let name_filter =  name || '';
    let status_filter =  status || '';

    axios.get(`https://rickandmortyapi.com/api/character/`).then((req) =>  {

        const results = req.data.results.slice(offset).slice(0, per_page_items).filter((item) => {
             if(stringSimilarity.compareTwoStrings(item.name, name_filter) >= 0.3 && item.status === status_filter) {
                return item;
            } 
        });


        const length = req.data.results.length

        res.status(200).send({
            info : {pages : Math.ceil(length / limit), count : length },
            results
        });
    })
    
 };

 exports.getSingleCharacter = (req, res, next) => {
    const {id} =  req.params

    console.log('character id =>', id)


    axios.get(`https://rickandmortyapi.com/api/character/${id}`).then((req) =>  {
        res.status(200).send(req.data);
    })
    
 };

 exports.getCharacterEpisode = (req, res, next) => {
    const {id} =  req.params

    console.log('character id =>', id)

    
    axios.get(`https://rickandmortyapi.com/api/character/${id}`).then( async (req) =>  {
         const PromiseResult = await Promise.all(req.data.episode.map((episode) => {
            return new Promise( async(resolve, reject) => {
                const episodeId = episode.match('([^\/]+$)')[0];
                console.log('episode id =>', episodeId)



                resolve(episodeId);
            })
        }))

        const PromiseResultAsString = PromiseResult.toString()
        const episodes = await axios.get(`https://rickandmortyapi.com/api/episode/${PromiseResultAsString}`);

        const newArray = await Promise.all(episodes.data.map((episodeInfo) => {return {name : episodeInfo.name, air_date: episodeInfo.air_date, episode : episodeInfo.episode}}))
        res.status(200).send( newArray);
    })
    
 };
 