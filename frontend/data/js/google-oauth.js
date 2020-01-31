function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    let id_token = googleUser.getAuthResponse().id_token;
    console.log('Token: ' + id_token);
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    document.getElementById('main-text').innerText = 'Welcome, ' + profile.getName();
    document.getElementById('login-photo').innerHTML = '<img src="'+profile.getImageUrl()+'" alt="profile-photo">';

    send_token(id_token);
}

function send_token(id_token) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/g-oauth?idtoken=' + id_token);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
        }
    };
    xhr.send();
}