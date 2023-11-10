// gets parameters from the url
function getHashParams() {

    var hashParams = {};

    // 'Hello%20World%21' -> 'Hello World'
    var e;
    var r = /([^&;=]+)=?([^&;]*)/g;
    var q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
        hashParams[e[1]] = decodeURIComponent(e[2]); // 'Hello%20World%21" -> 'Hello World'
    }

    return hashParams;

}

//formats millisecond time to minutes and seconds - MM:SS
function formatMs(time_in_ms) {
    minutes = Math.floor(time_in_ms / 60000);
    seconds = ((time_in_ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

/*
updates table body with track information 
params:
    tableBody - element from html page 
    tracklist - trackList data from API response
*/
function populatePolaroids(polaroidContainer, trackList) {
    populatePolaroids.innerHTML = ""
    for (const track of trackList) {
        const polaroid = document.createElement('div');
        polaroid.className = 'polaroid';

        const imgElem = document.createElement('img');
        imgElem.src = track.album.images[1].url;

        const idElm = document.createElement('p');
        idElm.textContent = track.id;

        const titleElm = document.createElement('p');
        titleElm.textContent = track.name;

        const nameElm = document.createElement('p');
        nameElm.textContent = `${track.artists.map(artist => artist.name)}`;

        polaroid.append(imgElem);
        polaroid.appendChild(idElm);
        polaroid.appendChild(titleElm);
        polaroid.appendChild(nameElm);
        // row.appendChild(durationCell);

        polaroidContainer.appendChild(polaroid);
    }

}

// request top 10 tracks from spotify API
function retrieveTracks(timeRangeSlug) {
    $.ajax({
        url: `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRangeSlug}`,
        headers: {
            Authorization: "Bearer " + access_token,
        },
        success: function (response) {
            let data = {
                trackList: response.items,
                total: 0,
                json: true,
            };
            for (var i = 0; i < data.trackList.length; i++) {
                data.total += data.trackList[i].duration_ms;
                data.trackList[i].id = (i + 1 < 10 ? "0" : "") + (i + 1); // leading 0 so all numbers are 2 digits
            }
            const polaroidContainer = document.getElementById('polaroidContainer');
            populatePolaroids(polaroidContainer, data.trackList);
            //document.getElementById("totalLength").innerText = formatMs(data.total);
        },
    });
}

//requesr user's current queue from spotify API
function getQueue() {
    $.ajax({
        url: 'https://api.spotify.com/v1/me/player/queue',
        headers: {
            Authorization: "Bearer " + access_token,
        },
        success: function (response) {
            console.log(response)
            let data = {
                trackList: response.queue,
                total: 0,
                json: true,
            };
            for (var i = 0; i < data.trackList.length; i++) {
                data.total += data.trackList[i].duration_ms;
                data.trackList[i].id = (i + 1 < 10 ? "0" : "") + (i + 1); // leading 0 so all numbers are 2 digits
            }
            const tableBody = document.getElementById('trackTableBody');
            updateTableBody(tableBody, data.trackList);
            document.getElementById("totalValue").innerText = formatMs(data.total);
        }
    });
}

// get access tokens from the URL
let params = getHashParams();
let access_token = params.access_token,
    client = params.client,
    error = params.error;

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

            success: function (response) {
                console.log("Good job!");
                $('#login').hide();
                $('#loggedin').show();
            },
        });
    } 
    else {
        console.log("No access token!");
    }
}

function updateCurrentPlaying() {
    $.ajax({
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: {
            'Authorization': "Bearer " + access_token,
        },
        success: function(response) {
            if (response && response.item) {
                var trackName = response.item.name;
                var artists = response.item.artists.map(function(artist) {
                    return artist.name;
                }).join(", ");
                var progress = response.progress_ms;
                var duration = response.duration_ms;

                document.getElementById('duration').textContent = formatMs(duration);
                document.getElementById('progress').textContent = formatMs(progress);
                if (response.item.album && response.item.album.images.length > 0) {
                    var albumCoverUrl = response.item.album.images[0].url;
                    document.getElementById('album-cover').src = albumCoverUrl;
                }
                document.getElementById('current-track').textContent = trackName;
                document.getElementById('current-artist').textContent = track;
            }
        }
    })
}


// assign functions to top tracks buttons
document.getElementById("short_term").addEventListener(
    "click",
    function () {
        retrieveTracks("short_term");
    },
    false
);
document.getElementById("medium_term").addEventListener(
    "click",
    function () {
        retrieveTracks("medium_term");
    },
    false
);
document.getElementById("long_term").addEventListener(
    "click",
    function () {
        retrieveTracks("long_term");
    },
    false
);
// assign function to current queue button
document.getElementById("queue_button").addEventListener(
    "click",
    function () {
        getQueue()
    },
    false
)

/*
document.getElementById("play-button").addEventListener(
    "click",
    function () {
        getQueue()
    },
    false
)
*/

