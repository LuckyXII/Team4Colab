let provider = new firebase.auth.GithubAuthProvider();

const logInButton = document.getElementById('log-in');
const userContainer = document.getElementById('container');

logInButton.addEventListener('click', () => {
    firebase.auth().signInWithPopup(provider).then(result => {
        let user = result.user;
        console.log(user);
        userContainer.innerHTML = `<div class="user-box">
                <img src=${user.photoURL} alt="" class="profile-picture">
                <h4>${user.displayName}</h4>
                <hr class="divider">
                <span class="favorites"><i class="material-icons">favorite_border</i>Favorites</span>
                <span class="log-out" id="log-out">Log out</span>
            </div>`;
        document.getElementById('log-out').addEventListener('click', () => {
            firebase.auth().signOut().then(() => {
                console.log('Du är utloggad.');
                userContainer.innerHTML = `<button type="button" class="btn" id="log-in">Log in</button>`;
            }).catch(error => {
                console.log(error);
            });
        })
    }).catch(error => {
        console.log(error);
    });
});