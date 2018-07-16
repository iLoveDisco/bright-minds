class App {
    constructor () {
        this.currentIndex = 0;
        this.pictures = document.getElementsByClassName("slides");
        this.navButtons = document.getElementsByClassName("nav");
        this.signInButton = document.querySelector("#signIn_id");
        this.signOutButton = document.querySelector("#signOut_id");
        this.avatarPic = document.querySelector("#avatar_id");
        this.blogList = document.querySelector("#blogList_id");
        this.titleTextBox = document.querySelector("#titleTextBox_id");
        this.descTextBox = document.querySelector("#descTextBox_id");

        this.entries = [];
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

    renderDropDown () {
        $('.learnMore').click(function (event) {
            event.preventDefault();
            $(this).next('.learnMore_drop').toggleClass('in');
        })    
    }

    renderNavButtons() {
        const navButtonIds = ["home_id", "programs_id", "parents_id", "contact_id", "blog_id"];
        for(let i = 0; i < this.navButtons.length; i++) {
            this.navButtons[i] // navButtonIds[] must have same order as nav bar
                .addEventListener('click', this.scrollIntoView.bind(this, navButtonIds[i]));
        }
    }

    handleUserChange () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                this.email = user.email;
                this.user = user;
                
                this.avatarPic.src = user.photoURL;

                this.signInButton.style.display = "none";
                this.signOutButton.style.display = "block";
                
            } else {
                // No user is signed in.
                this.signOutButton.style.display = "none";
                this.signInButton.style.display = "block";
                
            }
        }.bind(this));
    }

    handleSubmit (ev) {
        ev.preventDefault();
        const entry = {
            title: this.titleTextBox.value,
            desc: this.descTextBox.value,
        }
        this.addEntry(entry)
    }

    addEntry(entry) {
        this.entries.push(entry);
        const item = this.renderEntry(entry);
        this.blogList.appendChild(item);
    }

    renderEntry(entry) {
        const item = document.createElement("div");
        const titleNode = this.createNode(entry.title, "h2");
        const descNode = this.createNode(entry.desc, "p");
        item.appendChild(titleNode);
        item.appendChild(descNode);

        return item;
    }

    createNode(content, element) {
        const node = document.createElement(element);
        const contentNode = document.createTextNode(content);
        node.appendChild(contentNode);
        return node;
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

    renderSignIn () {
        this.signInButton.addEventListener('click', this.signIn);
    }

    renderSignOut () {
        this.signOutButton.addEventListener('click', this.signOut);
    }

    renderForm () {
        const form = document.querySelector('form')
        form.addEventListener('submit', (ev) => {
            ev.preventDefault()
            this.handleSubmit(ev);
        })
    }

    renderItems() {
        this.renderForm();
        this.renderNavButtons ();
        this.renderDropDown();
        this.renderSignIn();
        this.renderSignOut();
    }
}

const app = new App()

