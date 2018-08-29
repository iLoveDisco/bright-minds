class Items {
    constructor () {
        this.admins = ["erictu32@gmail.com", "brightmind111@gmail.com"];
        this.loadStylesheet();
        this.initializeFireBase();
        this.checkUser();
        this.renderItems();
    }

    saveScrollPosition () {
        window.sessionStorage.setItem('scrollPos', window.scrollY + "");
    }

    loadScrollPosition () {
        const scrollY = parseInt(window.sessionStorage.getItem('scrollPos'));
        window.scrollTo(0, scrollY);
    }

    loadStylesheet () {
        if (window.innerWidth <= 600)
            $("#indexCSS_id").attr("href", "mobile-bright-minds-tutoring.css");
    }

    initializeFireBase () {
        const config = {
            
        };
        firebase.initializeApp(config);
    }

    checkUser () {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                document.querySelector("#avatar_id").src = user.photoURL;
                // show sign out (avatar)
                document.querySelector("#signIn_id").style.display = "none";
                document.querySelector("#signOut_id").style.display = "block";
                // if right user
                if (this.admins.includes(user.email)) {
                    // show admin-only tools
                    const elements = document.getElementsByClassName("admin-only");
                    for(let i = 0; i < elements.length; i++) {
                        elements[i].style.display = "block";
                        elements[i].name = "3a49z83!?3";
                    }
                }
            } else {
                // show sign in button
                document.querySelector("#signIn_id").style.display = "block";
                document.querySelector("#signOut_id").style.display = "none";
            }
        });
    }

    renderItems() {
        this.renderNavButtons();
        this.renderSignIn();
        this.renderSignOut();
    }

    renderNavButtons() {
        const navButtons = document.getElementsByClassName("nav");
        const navButtonIds = ["home_id", "programs_id", "parents_id", "contact_id", "blog_id"];
        for(let i = 0; i < navButtonIds.length; i++) {
            navButtons[i] // navButtonIds[] must have same order as nav bar
                .addEventListener('click', this.scrollIntoView.bind(this, navButtonIds[i]));
        }
    }

    scrollIntoView (el_id) {
        const element = document.querySelector(`#${el_id}`)
        element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }

    signIn () {
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        googleProvider.setCustomParameters({
            prompt: 'select_account'
         });
        firebase.auth().signInWithRedirect(googleProvider);
    }

    signOut () {
        firebase.auth().signOut();
        location.reload();
    }

    renderSignOut () {
        document.querySelector("#signOut_id").addEventListener('click', this.signOut);
    }

    renderSignIn () {
        document.querySelector("#signIn_id").addEventListener('click', this.signIn);
    }
}

const items = new Items()


