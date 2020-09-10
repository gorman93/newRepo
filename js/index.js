function getData () {
    return new Promise((resolve, reject) => {
        var baseUrl = "https://leadersofadmin.ru/api/v1/statistics/event/teams/points";
        var defaultSearch = "?event_id=63005&case_id=71479&checkpoints=108984";
        var url;
        if(window.location.search) {
            url = baseUrl + window.location.search;
        } else {
            url = baseUrl + defaultSearch;
        }
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "************************"
            },
        })
        .then(function(response) {
            return resolve(response.json());
        })
        .catch(function(error) {
            return reject(error);
        })
    });
}

function createListSection(teams, start, end) {
    var listContainer = document.getElementById("listContainer");
    var listSection = document.createElement("div");
    listSection.className = "listSection";
    var list = document.createElement("ol");
    list.className = "list";
    list.setAttribute("start", start + 1);
    var listItem;
    for(var i = start; i < end; i++) {
        listItem = document.createElement("li");
        listItem.innerHTML = teams[i].name;
        listItem.setAttribute("title", teams[i].points.total.toFixed(2));
        list.appendChild(listItem);
    }
    listSection.appendChild(list);
    listContainer.appendChild(listSection);
}

function paintInUI(teams) {
    if(teams.length <= 10) {
        createListSection(teams, 0, teams.length);
    } else if(teams.length <= 20) {
        createListSection(teams, 0, 10);
        createListSection(teams, 10, teams.length);
    } else {
        var middle = Math.floor(teams.length / 2);
        if(teams.length % 2 == 1) {
            middle = middle + 1;
        }
        createListSection(teams, 0, middle);
        createListSection(teams, middle, teams.length);
    }
}

window.onload = function () {
    getData()
    .then(function(result) {
        var teams;
        if(result.teams) {
            teams = result.teams.sort((teamA, teamB) => teamB.points.total - teamA.points.total);
        } else {
            teams = [];
        }
        if(teams.length) {
            paintInUI(teams);
        }
    })
    .catch(function(error) {
        console.log("Error", error);
    })
}
