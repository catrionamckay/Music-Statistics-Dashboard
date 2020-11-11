var access_token;
google.charts.load("current", { packages: ["corechart"] });
//google.charts.setOnLoadCallback(drawChart);

(function () {

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }
    var params = getHashParams();

    access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {
            // render oauth info


            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {

                    $('#login').hide();
                    $('#loggedin').show();



                }
            });
        } else {
            // render initial screen
            $('#login').show();
            $('#loggedin').hide();
        }


    }
})();


//This code block processes the users artist search
//The artist is grabbed from the input box after search button is pressed,
//then is formed into URL for the API call
//API Call is made and artist ID is grabbed for future calls
var artistToSearch = "";

var searchButton = document.querySelector("#search");
searchButton.addEventListener("click", async function getUserSearch() {

    var artistID = "";
    var x = document.querySelector("#artist-name");
    x = encodeURI(x.value);
    console.log(x);
    artistToSearch = "https://api.spotify.com/v1/search?q=" + x + "&type=artist&market=US&limit=1";
    console.log(artistToSearch);
    $.ajax({
        url: artistToSearch,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
            artistID = response.artists.items[0].id;
            albumSearch =  "https://api.spotify.com/v1/artists/"+artistID+"/albums"
            
            console.log(response);
            document.getElementById("loggedinTitle").innerHTML = response.artists.items[0].name;
            document.getElementById("fol").innerHTML = response.artists.items[0].followers.total + " followers";
            console.log(response.artists.items[0].images[1].url);
            document.getElementById("ArtistPic").setAttribute("src", response.artists.items[0].images[2].url);
            document.getElementById("pop").innerHTML = response.artists.items[0].popularity;
        }
    });
    
    $.ajax({
        url: artistToSearch,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {


            //var data = new google.visualization.DataTable();
            data = new google.visualization.DataTable();
            data.addColumn('string', 'Genre');
            data.addColumn('number', 'Num');
            response.artists.items[0].genres.forEach(element => {
                console.log(element);
                data.addRow([element, 1]);
            });

            var options = {
                title: response.artists.items[0].name + "'s Genres of Music",
                is3D: true,
            };

            var chart = new google.visualization.PieChart(document.getElementById('graphs'));
            chart.draw(data, options);
        }

    });
    $.ajax({
        url: artistToSearch,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
            artistID = response.artists.items[0].id;
            var albumSearch =  "https://api.spotify.com/v1/artists/"+artistID+"/albums?include_groups=album&market=US&limit=50"
            $.ajax({
                url: albumSearch,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    console.log(response.items);
                    var numSongs = 0;
                    response.items.forEach(element => {
                        numSongs += element.total_tracks;
                        
                    });
                    document.getElementById("songs").innerHTML = numSongs;
                    document.getElementById("alb").innerHTML = response.items.length;
                    
                    
                }
            });
            
        }
    });


});









