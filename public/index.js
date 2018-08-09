class App {
    constructor () {
        this.blogList = document.querySelector("#blogList_id");
        this.admins = ["erictu32@gmail.com", "brightminds111@gmail.com"];
        this.loadStylesheet();
        this.initializeFireBase();
        this.checkUser();
        this.renderItems();
        this.loadEntries();
    }

    loadStylesheet () {
        if (window.innerWidth <= 420)
            $("#indexCSS_id").attr("href", "mobile.css");
    }

    initializeFireBase () {
        // Initialize Firebase
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
                    }
                }
            } else {
                // show sign in button
                document.querySelector("#signIn_id").style.display = "block";
                document.querySelector("#signOut_id").style.display = "none";
            }
        });
    }

    loadEntries() {
        const space = document.createElement("div");
        space.style.paddingBottom = "0vw";
        this.blogList.appendChild(space);

        const ref = firebase.database().ref();
        ref.on("value", snapshot => {
            const database = snapshot.val()['entries'];
            Object.keys(database).sort((a,b) => {
                return parseInt(b) - parseInt(a); // Sort by most recent
            }).map(key => this.blogList.appendChild(this.renderEntry(database[key])));// Append to bloglist
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
        for(let i = 0; i < navButtonIds.length; i++) {
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
        form.addEventListener('submit', (ev) => {
            ev.preventDefault()
            this.handleSubmit(ev);
        });
        const adminList = document.createElement("h3");
        adminList.appendChild(document.createTextNode(`Current administrators: ${this.admins}`))
        form.appendChild(adminList)
    }

    handleSubmit (ev) { // current user is visible
        ev.preventDefault();
        const titleTextBox = document.querySelector("#titleTextBox_id");
        const nameTextBox = document.querySelector('#nameTextBox_id')
        const descTextBox = document.querySelector("#descTextBox_id");
        const entry = {
            articleTitle: titleTextBox.value,
            body: descTextBox.value,
            displayName: nameTextBox.value,
            date: this.formatDate(new Date()),
            id: ""
        }
        this.addEntry(entry);
    }

    formatDate (today) {
        const dd = today.getDate();
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const mm = months[today.getMonth()];
        const yyyy = today.getFullYear();
        return `~ ${mm} ${dd}, ${yyyy} ~`;
    }

    addEntry(entry) {
        const database = firebase.database();
        const currentTime = new Date().getTime();
        entry['id'] = currentTime;
        database.ref('entries/' + currentTime).set(entry);
        location.reload();
    }

    deleteEntry(entryID, ev) {
        const database = firebase.database();
        database.ref('entries/' + entryID).remove();
        location.reload();
    }

    renderEntry(entry) {
        const item = document.querySelector("#blog_entry_id").cloneNode(true);
        const properties = Object.keys(entry);
        properties.forEach(property => {
            const el = item.querySelector(`.${property}`) // get the children inside item.
            if (el) { // if el != null
                switch (property) {
                    case "icon":
                        el.src = entry[property];
                        break;
                    case "body": 
                        el.innerHTML = this.formatBody(entry.body);
                        return;
                    case "id":
                        el.addEventListener('click', this.deleteEntry.bind(this, entry.id))
                        return;
                }
              // else
              el.textContent = entry[property];
            }
          })
        item.style.display = "block";
        return item;
    }

    formatBody(text) {
        return text.replace(/(?:\r\n|\r|\n)/g, '<br>');// replaces all returns with <br>
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

const app = new App()

