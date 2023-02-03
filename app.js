require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:
let SpotifyWebApi = require('spotify-web-api-node');

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token'])
    })
    .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:

app.get('/', (req,res)=>{
    res.render('home')
})
let allArtists
app.get('/artist-search', async(req,res)=>{
    const ourQueries = req.query
    // console.log(ourQueries.artistName)
    await spotifyApi
        .searchArtists(ourQueries.artistName)
        .then((data) => {
            // console.log('The received data from the API: ', data.body.artists.items)
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            allArtists =  data.body.artists.items
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
    res.render('artist-search-results', {allArtists})
})

app.get('/albums/:id', async(req,res)=>{
    const ourParams = req.params.id
    // console.log(ourParams)
    let allAlbums 
    await spotifyApi
    .getArtistAlbums(ourParams)
    .then((data) => {
        // console.log('The received data from the API: ', data.body.items[0].images[0].url)
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        allAlbums= data.body.items
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
    res.render('albums', {allAlbums})
})

app.get('/tracks/:id', async(req,res)=>{
    const ourParams = req.params.id
    // console.log(ourParams)
    let allTracks 
    await spotifyApi
    .getAlbumTracks(ourParams)
    .then((data) => {
        console.log('The received data from the API: ', data.body)
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        allTracks= data.body.items
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
    res.render('tracks', {allTracks})
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
