class App {
    constructor () {
        this.currentIndex = 0;
        this.pictures = document.getElementsByClassName("slides");
        this.navButtons = document.getElementsByClassName("nav");
        this.signInButton = document.getElementsByClassName("#signIn_id");
        this.signOutButton = document.querySelector("#signOut_id");
        this.email = "erictu32@gmail.com";
        this.user = "";
        this.initializeFireBase();
        this.renderItems();
        this.handleUserChange();
    }

    initializeFireBase () {
        // Initialize Firebase
        const config = {
            
        };
        firebase.initializeApp(config);
    }

    scrollIntoView (el_id) {
        const element = document.querySelector(`#${el_id}`)
        
        element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }

    handleUserChange () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                this.email = user.email;
                this.user = user;
                const avatarPic = document.querySelector("#avatar_id");
                avatarPic.src = user.photoURL;
            } else {
                // No user is signed in.
            }
        });
    }

    renderDropDown () {
        $('.learnMore').click(function (event) {
            event.preventDefault();
            $(this).next('.learnMore_drop').toggleClass('in');
        })    
    }

    authenticateGoogle () {
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(googleProvider);
    }

    signOut () {
        firebase.auth().signOut();
        location.reload();
    }

    renderSignIn () {
        this.signInButton.addEventListener('click', this.authenticateGoogle);
    }

    renderSignOut () {
        this.signOutButton.addEventListener('click', this.signOut);
    }

    renderNavButtons() {
        const navButtonIds = ["home_id", "programs_id", "parents_id", "contact_id", "blog_id"];
        for(let i = 0; i < this.navButtons.length; i++) {
            this.navButtons[i] // navButtonIds[] must have same order as nav bar
                .addEventListener('click', this.scrollIntoView.bind(this, navButtonIds[i]));
        }
    }

    renderItems() {
        this.renderNavButtons ();
        this.renderDropDown();
        this.renderSignIn();
        this.renderSignOut();
    }
}



const app = new App()

