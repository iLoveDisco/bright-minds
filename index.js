class App {
    constructor () {
        this.currentIndex = 0;
        this.pictures = document.getElementsByClassName("slides");
        this.navButtons = document.getElementsByClassName("nav");
        this.renderItems()
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

    dropDown () {
        $('.learnMore').click(function (event) {
            event.preventDefault();
            $(this).next('.learnMore_drop').toggleClass('in');
        })    
    }

    renderItems() {
        const navButtonIds = ["home_id", "programs_id", "parents_id", "contact_id"];
        for(let i = 0; i < this.navButtons.length; i++) {
            this.navButtons[i] // navButtonIds[] must have same order as nav bar
                .addEventListener('click', this.scrollIntoView.bind(this, navButtonIds[i]));
        }

        this.dropDown();
    }
}
const app = new App() 