// https://www.kirupa.com/html5/shuffling_array_js.htm
Array.prototype.shuffle = function () {
    let input = this;

    for (let i = input.length - 1; i >= 0; i--) {

        let randomIndex = Math.floor(Math.random() * (i + 1));
        let itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}

async function get(partial) {

    let headers = {
        'Access-Control-Allow-Origin': window.location.host,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    return await fetch(window.location.protocol + "//" + window.location.host + partial,
        {
            mode: "cors",
            headers,
            method: "GET"
        })
        .then(async function (response) {
            return await response.json();
        })
        .catch(function (exc) {
            console.log(exc);
            return null;
        })
}

async function shuffle_tiles()
{
    let data = await get("/data.json");
    let elements = Array.from(document.getElementsByClassName('bingo-item')).shuffle();
    for (let i = 0; i < elements.length; i++) {
        elements[i].innerHTML = "<span>" + data['bingo'][i] + "</span>";
    }
    document.getElementById('title').innerText = data['title'];
}

function load_state()
{
    try{
        let storage = localStorage.getItem('data');
        if (storage === null){
            return {};
        }
        return JSON.parse(localStorage.getItem('data'));
    }
    catch(error){
        console.log("Error: " + error);
        return null;
    }
}

function apply_state()
{
    let state = load_state();
    for (let each in state){
        if (state.hasOwnProperty(each)) {
            let tile = document.getElementById(each.toString());
            if (state[each]) {
                tile.classList.add('flip-tile');
                tile.classList.add('bg-selected');
            }
        }
    }
}

function save_state(data)
{
    localStorage.setItem('data', JSON.stringify(data));
}


function toggle_tile(tile_id)
{
    let state = load_state();
    let tile = document.getElementById(tile_id);
    if (tile.classList.contains('flip-tile')){
        tile.classList.remove('flip-tile');
        tile.classList.remove('bg-selected');
        state[tile_id] = false
    }
    else{
        tile.classList.add('flip-tile');
        tile.classList.add('bg-selected');
        state[tile_id] = true
    }
    save_state(state);
    // noinspection JSIgnoredPromiseFromCall
    check_all_true();
}

async function check_all_true()
{
    let state = load_state();
    if ( Object.keys(state).length === 25){
        for (let each in state){
            if (state.hasOwnProperty(each)) {
                if (state[each] === false){
                    return;
                }
            }
        }
        let data = await get("/data.json");
        localStorage.clear();
        document.getElementById('title').innerText = data['winning_title'];
        window.scrollTo(0,0);
    }
}
