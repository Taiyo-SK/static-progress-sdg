'use strict';


function getAllData() {
    fetch("/goals.json")
        .then((result) => {
            return result.json();
        })
        .then((data) => console.log(data));
}

