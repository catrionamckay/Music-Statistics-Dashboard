Music Statistics Dashboard

Created by Catriona McKay and Christopher Renslow.

Features:

    Spotify Authentication:
        To use this app you have to authenticate through Spotify.
        Press the button on the landing page to go to Spotify to login in.

    Artist Search:
        The page will load with Ed Sheeran as the default being shown. 
        To pull up a new artist, type in the search bar for any artist and the most popular under that search string should appear after pressing "Enter" or clicking the search button.

    Charts:

        There are several charts on the page that show different information.
        You can cycle which graph is shown with the button labelled "Cycle Graphs."
        You can hover over graph elements to see more data. On some this is needed to see all information.
        The line graph may take longer to load as the implemtation requires several API call due to Spotify's API Structure.


    Artist's Discogrpahy:
        Under the picture of the artist that is displayed, there is their discography.
        You can click each album/single to expand it to see songs. Click the album again to close that album's tracks.

    Static Stats:

        The stats on the right show info about the artist.

    Related Artists:
        The bottom bar shows the artist that is searched for's related artists.
        You can click each of these to pull up the Stats page for that artist.
        Some artists may not have this section, indicating that Spotify isn't currently tracking related artists for the selected artist.


Known Issues:
    -The line graph charts sometimes loads out of order due to 
    API calls not returning chronologically.

    -The number of albums is sometimes not accurate because spotify has a limit of albums returned per API call and if the artists's # of albums exceeds that, it shows that limit which by default is 20.

    -Sometimes the page will load for a second without any data.
    -The artists images are sometimes not perfect circles. This is an issue with how images in Spotify's API are not of uniform size.
    
    -When artists have less than 2 LPs in their catalog, most of the graphs won't really show any data/won't work.