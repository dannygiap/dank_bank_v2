function init_home() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/users?session=' + getCookie('session_id'));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            document.getElementById('name').innerText = json['nickname'];
        }
    };
    xhr.send();
}

window.onload = function () {
    init_home();
};

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return 0;
}