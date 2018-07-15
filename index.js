class App {
    constructor () {
        this.currentIndex = 0;
        this.pictures = document.getElementsByClassName("slides");
        this.navButtons = document.getElementsByClassName("nav");
        this.signInButton = document.getElementsByClassName("#signIn_id");
        this.email = "";
        this.renderItems();
        this.initializeFireBase();
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

    signIn () {

    }

    initializeFireBase () {
        // Initialize Firebase
        const config = {
            apiKey: "AIzaSyDWDSwJOvpioSAIFWF20OKdVDAXjJl6smE",
            authDomain: "bright-minds-1531248372967.firebaseapp.com",
            databaseURL: "https://bright-minds-1531248372967.firebaseio.com",
            projectId: "bright-minds-1531248372967",
            storageBucket: "bright-minds-1531248372967.appspot.com",
            messagingSenderId: "757275872031"
        };
        firebase.initializeApp(config);

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                this.email = user.email;
            } else {
                // No user is signed in.
            }
        });
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

