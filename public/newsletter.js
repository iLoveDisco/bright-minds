class Newsletter {
    constructor () {
        this.subscribeButton = document.querySelector("#subscribe_id");
        this.unsubscribeButton = document.querySelector("#unsubscribe_id");
        this.mailingList = document.querySelector("#mailing_list_id");
        this.mailingListButton = document.querySelector("#mailingListButton_id");
        this.renderSubscribe();
        this.renderUnsubscribe();
        this.renderMailingListButton();
    }

    isUnAuth () {
        return document.querySelector("#form_id").name != "3a49z83!?3";
    }

    renderSubscribe () {
        this.subscribeButton.addEventListener('click', this.handleSubmit.bind(this, 'sub'));
    }

    renderUnsubscribe () {
        this.unsubscribeButton.addEventListener('click', this.handleSubmit.bind(this, 'unsub'));
    }

    renderMailingListButton() {
        this.mailingListButton.addEventListener('click', this.showMailingList.bind(this));
    }

    showMailingList() {
        if (this.isUnAuth()) {
            alert('Unauthorized Access');
            return;
        }
        const ref = firebase.database().ref();
        ref.once('value').then(snapshot => {
            const database = snapshot.val()['Subscribed Emails'];
            const toDisplay = [];
            Object.keys(database).forEach(key => {
                toDisplay.push(database[key]);
            })
            this.mailingList.textContent = toDisplay.toString();
        })
    }

    handleSubmit (type) {
        const input = document.querySelector('#newsletter_input_id');
        if (!input.value.includes('@')) {
            alert('Please enter a real email address');
            return;
        }
        if(type === 'sub') {
            this.addEmail(input.value);
        } else if (type === 'unsub') {
            this.removeEmail (input.value);
        }
    }

    addEmail (entry) {
        this.subscribeButton.disabled = true;
        this.subscribeButton.style.opacity = .8;
        const id = new Date().getTime();
        const ref = firebase.database().ref();
        ref.once('value').then(snapshot => {
            const database = snapshot.val()['Subscribed Emails'];
            for(let i = 0; i < Object.keys(database).length; i++) {
                const key = Object.keys(database)[i];
                if (database[key] == entry) {
                    this.subscribeButton.textContent = "Already Subscribed!";
                    return; 
                };
            }
            firebase.database().ref('Subscribed Emails/' + id).set(entry);
            this.subscribeButton.textContent = 'Subscribed!';
            
        })
    }

    removeEmail (entry) {
        this.unsubscribeButton.disabled = true;
        this.unsubscribeButton.style.opacity = .8;
        const ref = firebase.database().ref();
        ref.once('value').then(snapshot => {
            const database = snapshot.val()['Subscribed Emails'];
            for(let i = 0; i < Object.keys(database).length; i++) {
                const key = Object.keys(database)[i];
                if(database[key] === entry) {
                    firebase.database().ref('Subscribed Emails/' + key).remove();
                    this.unsubscribeButton.textContent = 'Unsubscribed!';
                    return;
                }
            }
            this.unsubscribeButton.textContent = 'Email not found';
        });
    }

    
}

const app4 = new Newsletter ();