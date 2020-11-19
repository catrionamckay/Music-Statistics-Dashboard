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
                    $('#artist').hide();
                    $('#row-3').hide();
                    $('#related-artists').hide();

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
var artistName;

//graph1 global varibles for future use
var graph1;
var data1;
var options1;

//graph2 global varibles for future use
var graph2;
var data2;
var options2;

//graph3 global varibles for future use
var graph3;
var data3;
var options3;

let graphloc = document.getElementById("graphnav")
var clicks = 1;
searchButton.addEventListener("click", function getUserSearch() {
    clicks = 1;
    $('#artist').show();
    $('#row-3').show();
    $('#related-artists').show();
    var artistID = "";
    var x = document.querySelector("#artist-name");

    x = encodeURI(x.value);
    //console.log(x);
    artistToSearch = "https://api.spotify.com/v1/search?q=" + x + "&type=artist&market=US&limit=1";
    //console.log(artistToSearch);
    $.ajax({
        url: artistToSearch,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
            artistID = response.artists.items[0].id;
            albumSearch = "https://api.spotify.com/v1/artists/" + artistID + "/albums"

            //console.log(response);
            artistName = response.artists.items[0].name;
            document.getElementById("loggedinTitle").innerHTML = response.artists.items[0].name;
            document.getElementById("fol").innerHTML = reformatFollowerCount(response.artists.items[0].followers.total);
            //console.log(response.artists.items[0].images[1].url);
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
            data1 = new google.visualization.DataTable();
            data1.addColumn('string', 'Genre');
            data1.addColumn('number', 'Num');
            response.artists.items[0].genres.forEach(element => {
                //console.log(element);
                data1.addRow([element, 1]);
            });

            options1 = {
                title: response.artists.items[0].name + "'s Genres of Music",
                is3D: true,
                legend: { position: "bottom" },
            };

            graph1 = new google.visualization.PieChart(document.getElementById('graphs'));
            graph1.draw(data1, options1);
        }

    });
    graphloc.addEventListener('click', function () {

        switch (clicks) {
            case 1:
                $.ajax({
                    url: artistToSearch,
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function (response) {
                        artistID = response.artists.items[0].id;
                        var albumSearch = "https://api.spotify.com/v1/artists/" + artistID + "/albums?include_groups=album&market=US&limit=50"
                        $.ajax({
                            url: albumSearch,
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                            },
                            success: function (response) {
                                //console.log(response);

                                //var data = new google.visualization.DataTable();
                                data2 = new google.visualization.DataTable();
                                data2.addColumn('string', 'Album');
                                data2.addColumn('number', 'Songs Per Album');
                                response.items.forEach(element => {
                                    //console.log(element.name);
                                    data2.addRow([element.name, element.total_tracks]);
                                });

                                options2 = {
                                    title: artistName + "'s Songs per Album",
                                    //is3D: true,
                                    legend: { position: "bottom" },
                                    bar: {
                                        groupWidth: "50%"
                                    },
                                    orientation: "horizontal",
                                    hAxis: {
                                        title: "(Hover over bars to see numbers)",
                                        textPosition: 'none'
                                    }
                                };

                                graph2 = new google.visualization.BarChart(document.getElementById('graphs'));
                                graph2.draw(data2, options2);
                            }
                        });

                    }
                });
                break;


            case 3:
                $.ajax({
                    url: artistToSearch,
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function (response) {


                        //var data = new google.visualization.DataTable();
                        data1 = new google.visualization.DataTable();
                        data1.addColumn('string', 'Genre');
                        data1.addColumn('number', 'Num');
                        response.artists.items[0].genres.forEach(element => {
                            //console.log(element);
                            data1.addRow([element, 1]);
                        });

                        options1 = {
                            title: response.artists.items[0].name + "'s Genres of Music",
                            is3D: true,
                            legend: { position: "bottom" },
                        };

                        graph1 = new google.visualization.PieChart(document.getElementById('graphs'));
                        graph1.draw(data1, options1);
                    }

                });
                break;

            case 2:
                $.ajax({
                    url: artistToSearch,
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function (response) {
                        artistID = response.artists.items[0].id;
                        var albumSearch = "https://api.spotify.com/v1/artists/" + artistID + "/albums?include_groups=album&market=US&limit=50"
                        $.ajax({
                            url: albumSearch,
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                            },
                            success: function (response) {
                                //console.log(response);

                                //var data = new google.visualization.DataTable();
                                data3 = new google.visualization.DataTable();
                                data3.addColumn('string', 'Album');
                                data3.addColumn('number', 'Songs Per Album');
                                response.items.forEach(element => {
                                    //console.log(element.name);
                                    data3.addRow([element.name, element.total_tracks]);
                                });

                                options3 = {
                                    title: artistName + "'s Songs per Album",
                                    //is3D: true,
                                    legend: { position: "bottom" },
                                    bar: {
                                        groupWidth: "50%"
                                    },
                                    orientation: "horizontal",
                                    hAxis: {
                                        title: "(Hover over bars to see numbers)",
                                        textPosition: 'none'
                                    }
                                };

                                graph3 = new google.visualization.LineChart(document.getElementById('graphs'));
                                graph3.draw(data3, options3);
                            }
                        });

                    }
                });
                break;
        }
        clicks++;
        if (clicks > 3)
            clicks = 1;
        console.log(clicks);
    });



    $.ajax({
        url: artistToSearch,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
            artistID = response.artists.items[0].id;
            var albumSearch = "https://api.spotify.com/v1/artists/" + artistID + "/albums?include_groups=album&market=US&limit=50"
            $.ajax({
                url: albumSearch,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    //console.log(response.items);
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

    $.ajax({
        url: artistToSearch,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
            artistID = response.artists.items[0].id;
            var albumSearch = "https://api.spotify.com/v1/artists/" + artistID + "/albums?include_groups=album&market=US&limit=50"
            $.ajax({
                url: albumSearch,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    document.getElementById("albums").innerHTML = '';
                    //console.log(response.items);
                    var header = document.createElement("h3");
                    var albumName;
                    var albumlist = document.createElement("ul");
                    var listitem;
                    var albumDiv = document.createElement("div");

                    var albumID;
                    var tracks;

                    header.innerHTML = "Album Lists:"
                    albumDiv.appendChild(albumlist);
                    document.getElementById("albums").appendChild(header);
                    document.getElementById("albums").appendChild(albumDiv);
                    response.items.forEach(album => {
                        if (document.getElementById(album.name.replace(/[ :()]/g, '-')) === null) {
                            albumID = album.id;
                            albumName = document.createElement("button");
                            listitem = document.createElement("li");
                            albumName.value = album.name;
                            albumName.innerHTML = album.name;

                            tracks = "https://api.spotify.com/v1/albums/" + albumID + "/tracks";
                            $.ajax({
                                url: tracks,
                                headers: {
                                    'Authorization': 'Bearer ' + access_token
                                },
                                success: function (response) {
                                    //console.log("Tracks added for" + album.name);
                                    var trackList = document.createElement("ul");
                                    var trackbtn;
                                    var trackName;
                                    response.items.forEach(track => {
                                        trackbtn = document.createElement("button");
                                        trackName = document.createElement("li");
                                        trackbtn.value = track.name;
                                        trackbtn.innerHTML = track.name;
                                        trackName.appendChild(trackbtn);
                                        listitem.appendChild(trackName);
                                        trackList.appendChild(trackName);
                                        trackList.style.display = 'none';
                                    });
                                    trackList.classList.add("track-list");
                                    document.getElementById(album.name.replace(/[ :()]/g, '-')).appendChild(trackList);

                                }
                            });

                            albumDiv.appendChild(albumName);
                            albumDiv.setAttribute("class", "albumbtn");
                            listitem.setAttribute("id", album.name.replace(/[ :()]/g, '-'));
                            listitem.setAttribute("class", "albumLi");
                            listitem.setAttribute("onclick", "toggleTracks(this);");
                            listitem.appendChild(albumName);
                            albumlist.appendChild(listitem);
                            //console.log(album.name);
                        }

                    });


                }
            });

        }
    });

    document.getElementById("artist-name").value = '';

});

// this function makes it so that when pressing enter in the search box it searches the artist.
var searchInput = document.querySelector("#artist-name");
searchInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        searchButton.click();
    }
});

// This function returns the follower refomated if over 1,000
function reformatFollowerCount(followerCount) {
    var newNumber;
    if (followerCount < 1000) {
        return followerCount;
    }
    if (followerCount < 1000000) {
        newNumber = followerCount / 1000.0;
        newNumber = newNumber.toFixed(1);
        return newNumber + "K";
    }
    newNumber = followerCount / 1000000.0;
    newNumber = newNumber.toFixed(1);
    return newNumber + "M";
}

/*
var clicks = 0;
function graphs() {
    ++clicks;
    if (clicks == 1 || clicks % 2 !== 0) {
        $('#graph1').hide();
        $('#graph2').hide();
        $('#graph3').show();
        $('#graph4').show();
    }
    else{
        $('#graph1').show();
        $('#graph2').show();
        $('#graph3').hide();
        $('#graph4').hide();
    }
    //console.log(clicks);
}
*/


function toggleTracks(element) {
    //console.log("Element " + element.id);

    //var list = document.querySelector(element.id);
    var parent = element.closest('.albumLi');
    var list = parent.getElementsByClassName('track-list');
    //console.log(list);
    //list.forEach(item =>{
    for (const item of list) {
        //console.log(item.style.display);
        if (item.style.display === 'none') {
            item.style.display = 'block';
        }
        else {
            item.style.display = 'none';
        }
    }

}




