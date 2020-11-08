var access_token;

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


$.ajax({
    url: 'https://api.spotify.com/v1/albums?ids=382ObEPsp2rxGrnsizN5TX%2C1A2GTWGtFfWp7KSQTwWOyo%2C2noRn2Aes5aoNVsU6iWThc',
    headers: {
        'Authorization': 'Bearer ' + access_token
    },
    success: function (response) {

        console.log(response.albums[0].name);
        document.getElementById("loggedinTitle").innerText = response.albums[0].name;
    }
});



