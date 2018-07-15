class App {
    constructor () {
        this.currentIndex = 0;
        this.pictures = document.getElementsByClassName("slides");
        this.navButtons = document.getElementsByClassName("nav");
        this.signInButton = document.getElementsByClassName("#signIn_id");
        this.email = "erictu32@gmail.com";
        this.renderItems();
        this.initializeFireBase();
        this.handleEmailChange();
    }

    carousel() {
        for (let i = 0; i < this.pictures.length; i++) {
           this.pictures[i].style.display = "none";  
        }
        this.currentIndex++;
        if (this.currentIndex > this.pictures.length) {this.currentIndex = 1}    
        this.pictures[this.currentIndex - 1].style.display = "";
        setTimeout(this.carousel.bind(this), 7000); // Change image every 2 seconds
    }

    scrollIntoView (el_id) {
        const element = document.querySelector(`#${el_id}`)
        
        element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }

    handleEmailChange () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                this.email = user.email;
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

    initializeFireBase () {
        // Initialize Firebase
        const config = {
            apiKey: "nice try lol",
            authDomain: "nice try lol",
            databaseURL: "nice try lol",
            projectId: "nice try lol",
            storageBucket: "nice try lol",
            messagingSenderId: "nice try lol"
        };
        firebase.initializeApp(config);
    }

    renderSignIn () {
        const signInButton = document.querySelector("#signIn_id");
        signInButton.addEventListener('click', this.authenticateGoogle);
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
    }
}



const app = new App()

