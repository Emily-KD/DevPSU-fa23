function getHashParams() {

    var hashParams = {};

    var e
    var r = /([^&;=]+)=?([^&;]*)/g;
    var q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
        hashParams[e[1]] = decodeURIComponent(e[2]); // 'Hello%20World%21" -> 'Hello World'
    }

    return hashParams;

}

let params = getHashParams();
let access_token = params.access_token;
let client = params.client;
let error = params.error;

if (error) {
    alert("There was an error during authentication.");
} else {
    console.log("No error during authentication!");
    if(access_token) {
        $.ajax( {
            url: "https://api.spotify.com/v1/me",
            headers: {
                Authorization: "Bearer " + access_token,
            },

            success: function(response) {
                $('#login').hide();
                $('#loggedin').show();
            },
        });
    } else {
        console.log("No access token!");
    }
}


function retrieve_tracks(timeRangeSlug) {
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRangeSlug}",
        header: {
            Authorization: "Brearer " + access_token,
        },

        success: function (response) {
            let data{
                trackList : response.items,
                total: 0,
                json: true,
            };

            for (var i = 0; i < data.trackList.length; i++) {
                data.total
            }
        }
    })
}

document.getElementById("short_term").addEventListener(
    "click",
    function() {
        retrieve_tracks("short_term");
    },
    false
);

document.getElementById("medium_term").addEventListener(
    "click",
    function() {
        retrieve_tracks("medium_term");
    },
    false
);

document.getElementById("long_term").addEventListener(
    "click",
    function() {
        retrieve_tracks("long_term");
    },
    false
);