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
        this.handleUserChange();
        this.loadEntries();
        this.renderItems();
    }

    initializeFireBase () {
        // Initialize Firebase
        const config = {
            apiKey: "AIzaSyAKnCSvOCaVHHuD2fErdBYWNchTwgiumzg",
            authDomain: "bright-minds-da4fe.firebaseapp.com",
            databaseURL: "https://bright-minds-da4fe.firebaseio.com",
            projectId: "bright-minds-da4fe",
            storageBucket: "bright-minds-da4fe.appspot.com",
            messagingSenderId: "297217562922"
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
        const navButtons = document.getElementsByClassName("nav");
        const navButtonIds = ["home_id", "programs_id", "parents_id", "contact_id", "blog_id"];
        for(let i = 0; i < navButtons.length; i++) {
            navButtons[i] // navButtonIds[] must have same order as nav bar
                .addEventListener('click', this.scrollIntoView.bind(this, navButtonIds[i]));
        }
    }

    handleUserChange () {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.email = user.email;
                this.user = user;
                
                this.avatarPic.src = user.photoURL;

                // show sign out (avatar)
                this.signInButton.style.display = "none";
                this.signOutButton.style.display = "block";
                
            } else {
                // show sign in
                this.signOutButton.style.display = "none";
                this.signInButton.style.display = "block";
            }
        });
    }

    renderItems() {
        this.renderForm();
        this.renderNavButtons ();
        this.renderDropDown();
        this.renderSignIn();
        this.renderSignOut();
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
            title: this.titleTextBox.value,
            desc: this.descTextBox.value,
            author: this.user.displayName,
            avatar: this.user.photoURL,
            date: this.formatDate(new Date()),
        }
        this.addEntry(entry);
    }

    formatDate (today) {
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();
        return mm + '/' + dd + '/' + yyyy;
    }

    loadEntries() {
        const ref = firebase.database().ref();
        ref.on("value", snapshot => {
            const database = snapshot.val()['entries'];
            console.log(database);
            Object.keys(database).map(key => this.blogList.appendChild(this.renderEntry(database[key])));
         })
    }

    addEntry(entry) {
        const database = firebase.database();
        const currentDate = new Date();
        database.ref('entries/' + currentDate.toString()).set(entry);
        location.reload();
    }

    renderEntry(entry) {
        const item = document.createElement("div");
        item.setAttribute('class', 'blogPanel');

        const userInfoNode = this.renderUserInfoNode(entry);
        item.appendChild(userInfoNode);

        const bodyNode = this.renderBodyNode(entry);
        item.appendChild(bodyNode);

        return item;
    }

    renderUserInfoNode (entry) {
        const userInfoNode = document.createElement("div");
        userInfoNode.setAttribute('class', 'blogBody');
        // profile picture
        const avatar = document.createElement("img");
        avatar.setAttribute('class', 'icon');
        avatar.src = entry.avatar;
        userInfoNode.appendChild(avatar);
        // name
        const nameNode = this.createNode(entry.author, "h3");
        nameNode.setAttribute('id', 'displayName_id')
        userInfoNode.appendChild(nameNode);
        // date
        const dateNode = this.createNode(entry.date, 'li');
        userInfoNode.appendChild(dateNode);

        return userInfoNode;
    }

    renderBodyNode (entry) {
        const bodyNode = document.createElement("div");
        bodyNode.setAttribute('class', 'blogBody');
        // article title
        const titleNode = this.createNode(entry.title, "h2");
        bodyNode.appendChild(titleNode);
        // article body
        const descNode = this.createNode(entry.desc, "p");
        descNode.innerHTML = descNode.innerHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');
        bodyNode.appendChild(descNode);
        return bodyNode;
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
}

const app = new App()

