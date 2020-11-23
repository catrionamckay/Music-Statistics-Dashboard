var access_token;
google.charts.load("current", { packages: ["corechart"] });
google.charts.load("current", { packages: ["histogram"] });
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

//graph3 global varibles for future use
var graph4;
var data4;
var options4;

let graphloc = document.getElementById("graphs")
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
            document.getElementById("artist").innerHTML = response.artists.items[0].name;
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
                fontName: 'Bitter',
                fontSize: '15'
            };

            graph1 = new google.visualization.PieChart(document.getElementById('graphs'));
            graph1.draw(data1, options1);
        }

    });
    graphloc.onclick = function () {

        switch (clicks) {
            case 4:
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
                            fontName: 'Bitter',
                            fontSize: '15'
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
                                    },
                                    fontName: 'Bitter',
                                    fontSize: '15'
                                    
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
                        artistID = response.artists.items[0].id;
                        var albumSearch = "https://api.spotify.com/v1/artists/" + artistID + "/albums?include_groups=album&market=US&limit=50"
                        $.ajax({
                            url: albumSearch,
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                            },
                            success: function (response) {
                                var albums = [];
                                var count = 0;
                                response.items.forEach(element => {
                                    albums[count] = element.id;
                                    count++;
                                })
                                data3 = new google.visualization.DataTable();
                                data3.addColumn('string', 'Album');
                                data3.addColumn('number', 'Popularity');
                                //console.log(albums[5]);
                                for (var i = albums.length-1; i > 0; i--) {
                                    let albumtoSearch = "https://api.spotify.com/v1/albums/" + albums[i];
                                    console.log(i);
                                    $.ajax({
                                        url: albumtoSearch,
                                        headers: {
                                            'Authorization': 'Bearer ' + access_token
                                        },
                                        success: function (respAlbums) {
                                            //console.log(respAlbums.popularity);

                                            options3 = {
                                                title: artistName + "'s Popularity of Albums",
                                                //is3D: true,
                                                legend: { position: "bottom" },
                                                bar: {
                                                    groupWidth: "50%"
                                                },
                                                orientation: "horizontal",
                                                pointSize: 5,
                                                fontName: 'Bitter',
                                                fontSize: '15', 
                                                hAxis: {
                                                    title: "(Hover over points to see popularity)",
                                                    textPosition: 'none'
                                                }
                                            };
                                            //console.log(respAlbums.name);
                                            data3.addRow([respAlbums.name +" (" +respAlbums.release_date+ ")", respAlbums.popularity]);
                                            graph3 = new google.visualization.LineChart(document.getElementById('graphs'));
                                            graph3.draw(data3, options3);
                                            


                                        }

                                    });

                                }


                            }
                        });

                    }
                });
                break;
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
                                data4 = new google.visualization.DataTable();
                                data4.addColumn('string', 'Album');
                                data4.addColumn('number', 'Release');
                                var start = response.items[response.total-1].release_date.substring(0,4);
                                console.log(start);
                                var end = response.items[0].release_date.substring(0,4);
                                response.items.forEach(element => {
                                    console.log(element.release_date);
                                    var year = element.release_date.substring(0, 4);
                                    data4.addRow([element.name, parseInt(year)]);
                                });

                                options4 = {
                                    title: artistName + "'s Albums per year",
                                    is3D: true,
                                    legend: { position: "bottom" },
                                    bar: {
                                        groupWidth: "50%"
                                    },
                                    hAxis: {
                                        title: "Album Releases per year from "+ start+ "-" + end,
                                        textPosition: 'none'
                                        
                                    },
                                    fontName: 'Bitter',
                                    fontSize: '15',
                                    histogram: { 
                                        bucketSize: 1,
                                        
                                    }

                                };

                                graph4 = new google.visualization.Histogram(document.getElementById('graphs'));
                                graph4.draw(data4, options4);
                            }
                        });

                    }
                });
                break;


        }
        clicks++;
        if (clicks > 4)
            clicks = 1;
        console.log(clicks);
    };



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

                    header.innerHTML = "Album(s):"
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

                        }

                    });


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
            var relatedArtists = "https://api.spotify.com/v1/artists/" + artistID + "/related-artists";
            var relatedRow = document.getElementById("related-artists");
            relatedRow.innerHTML = '';
            $.ajax({
                url: relatedArtists,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    var artistDiv;
                    var artistPic;
                    var artistName;
                    var text;
                    var extendedDiv = document.createElement("div");
                    console.log("successful in getting related Artists.");
                    response.artists.forEach(artist => {
                        artistDiv = document.createElement("div");
                        artistDiv.setAttribute("class", "artist-div");
                        //artistDiv.setAttribute("class", "col-12 col-sm-3");
                        //console.log(artist.name);
                        artistName = document.createElement("button");
                        artistName.setAttribute("class", "search-btn");
                        artistName.value = artist.name;
                        artistName.setAttribute("onclick", "relatedArtistSearch(this.value)");
                        artistPic = document.createElement("img");
                        text = document.createTextNode(artist.name);
                        artistName.appendChild(text);
                        artistPic.setAttribute("src", artist.images[2].url);
                        artistDiv.appendChild(artistName);
                        artistDiv.appendChild(artistPic);
                        extendedDiv.appendChild(artistDiv);
                    });
                    extendedDiv.setAttribute("id", "extendedDiv");
                    relatedRow.appendChild(extendedDiv);
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

function relatedArtistSearch(value) {
    var searchInput = document.getElementById("artist-name");
    searchInput.value = value;
    searchButton.click();
}
function resizeGraph(){
    graph1.draw(data1,options1);
    graph2.draw(data2,options2);
    graph3.draw(data3,options3);
    graph4.draw(data4,options4);
}
window.onload = resizeGraph;
window.onresize = resizeGraph;








