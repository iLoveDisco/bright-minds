class Blog {
    constructor () {
        this.admins = ["erictu32@gmail.com", "brightmind111@gmail.com"];
        this.blogList = document.querySelector("#blogList_id");
        this.loadEntries();
        this.renderForm();
    }

    renderForm () {
        const form = document.querySelector('#form_id');
        form.addEventListener('submit', (ev) => {
            ev.preventDefault()
            this.handleSubmit(ev);
        });
    }

    loadEntries() {
        const ref = firebase.database().ref();
        ref.once("value").then(snapshot => {
            const database = snapshot.val()['entries'];
            const sortedEntries = Object.keys(database).sort((a,b) => {
                return parseInt(b) - parseInt(a); // Sort by most recent
            })
            
            sortedEntries.forEach(key => {
                this.blogList.appendChild(this.renderEntry(database[key]))
            });// Append to bloglist
         })
    }

    isUnAuth () {
        return document.querySelector("#form_id").name != "3a49z83!?3";
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
            date: this.formatBlogDate(new Date()),
            id: ""
        }
        this.addEntry(entry);
    }

    formatBlogDate (today) {
        const dd = today.getDate();
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const mm = months[today.getMonth()];
        const yyyy = today.getFullYear();
        return `~ ${mm} ${dd}, ${yyyy} ~`;
    }

    addEntry(entry) {
        if (this.isUnAuth()) {
            alert('Unauthorized access');
            return;
        }
        const database = firebase.database();
        const currentTime = new Date().getTime();
        entry['id'] = currentTime;
        database.ref('entries/' + currentTime).set(entry);
        location.reload();
    }

    deleteEntry(entryID, ev) {
        if (this.isUnAuth()) {
            alert('Unauthorized access');
            return;
        }
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
}

const app3 = new Blog();