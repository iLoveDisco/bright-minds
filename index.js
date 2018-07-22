class App {
    constructor () {
        this.signInButton = document.querySelector("#signIn_id");
        this.signOutButton = document.querySelector("#signOut_id");
        this.avatarPic = document.querySelector("#avatar_id");
        this.blogList = document.querySelector("#blogList_id");
        this.titleTextBox = document.querySelector("#titleTextBox_id");
        this.descTextBox = document.querySelector("#descTextBox_id");
        this.entries = {};
        this.admins = ["erictu32@gmail.com"];
        this.user = 'default';
        this.initializeFireBase();
        this.renderItems();
        this.loadEntries();
    }

    initializeFireBase () {
        // Initialize Firebase
        const config = {
            
        };
        firebase.initializeApp(config);
    }

    loadEntries() {
        const ref = firebase.database().ref();
        ref.on("value", snapshot => {
            const database = snapshot.val()['entries'];
            Object.keys(database).sort((a,b) => {
                return parseInt(a) - parseInt(b);
            }).map(key => this.blogList.appendChild(this.renderEntry(database[key])));
         })
    }

    renderItems() {
        this.renderNavButtons();
        this.renderDropDown();
        this.renderForm();
        this.renderSignIn();
        this.renderSignOut();
    }

    renderNavButtons() {
        const navButtons = document.getElementsByClassName("nav");
        const navButtonIds = ["home_id", "programs_id", "parents_id", "contact_id", "blog_id"];
        for(let i = 0; i < navButtons.length; i++) {
            navButtons[i] // navButtonIds[] must have same order as nav bar
                .addEventListener('click', this.scrollIntoView.bind(this, navButtonIds[i]));
        }
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

    renderForm () {
        const form = document.querySelector('#form_id');
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                if(this.admins.includes(this.user.email)) {
                    form.style.display = "visible";
                }
            } else {
                form.style.display = "none";
            }
        });
        
        form.addEventListener('submit', (ev) => {
            ev.preventDefault()
            this.handleSubmit(ev);
        })
    }

    handleSubmit (ev) { // current user is visible
        ev.preventDefault();
        const entry = {
            articleTitle: this.titleTextBox.value,
            body: this.descTextBox.value,
            displayName: this.user.displayName,
            date: this.formatDate(new Date()),
        }
        this.addEntry(entry);
    }

    formatDate (today) {
        const dd = today.getDate();
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const mm = months[today.getMonth()];
        const yyyy = today.getFullYear();
        return `${mm} ${dd}, ${yyyy}`;
    }

    addEntry(entry) {
        const database = firebase.database();
        const currentDate = new Date();
        database.ref('entries/' + this.formatKey(currentDate)).set(entry);
        location.reload();
    }

    formatKey (today) {
        return today.getTime();
    }

    renderEntry(entry) {
        const item = document.querySelector("#blog_entry_id").cloneNode(true);
        const properties = Object.keys(entry);
        properties.forEach(property => {
            const el = item.querySelector(`.${property}`) // get the children inside item.
            if (el) { // if el != null
              if (property === "icon") el.src = entry[property];
              el.textContent = entry[property];
              el.setAttribute('title', entry[property]);
            }
          })
        return item;
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
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.email = user.email;
                this.user = user;
                this.avatarPic.src = user.photoURL;
                // show sign out (avatar)
                this.signInButton.style.display = "none";
                this.signOutButton.style.display = "block";
            }
        });
        this.signOutButton.addEventListener('click', this.signOut);
    }

    renderSignIn () {
        this.signOutButton.style.display = "none";
        this.signInButton.style.display = "block";
        this.signInButton.addEventListener('click', this.signIn);
    }
}

const app = new App()

