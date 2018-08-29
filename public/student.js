class Student {
    constructor () {
        this.renderRegisterStudentButton();
        blog.loadEntries('Students', document.querySelector('#student_list_id'), this.renderStudent.bind(this));
    }

    renderRegisterStudentButton () {
        document.querySelector("#registration_button_id")
            .addEventListener('click', this.handleRegistrationSubmit.bind(this));
    }   

    handleRegistrationSubmit() {
        const student = this.getStudentInfo();
        this.addStudent(student);
    }

    getStudentInfo () {
        const firstName = document.querySelector("#first_name_input_id").value;
        const lastName = document.querySelector("#last_name_input_id").value;
        const goal = document.querySelector("#goal_input_id").value;
        const date = document.querySelector("#enrollmentDate_input_id").value;
        
        const info = {
            id:new Date().getTime(),
            name: `${firstName} ${lastName}`,
            dateEnrolled: date,
            goals: goal,
            completedAssignments: {}
        }
        return info;
    }

    addStudent(student) {
        if (blog.isUnAuth()) return;
        firebase.database().ref('Students/' + student.id).set(student);
        location.reload();
    }

    deleteStudent(student){
        if (blog.isUnAuth()) return;
        if (!confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) return;
        firebase.database().ref('Students/' + student.id).remove();
        location.reload();
    }

    renderStudent(student) {
        const item = document.querySelector("#student_entry_id").cloneNode(true);
        item.style.display = 'block';
        item.querySelector('.studentName').textContent = student.name;
        item.querySelector('.dateEnrolled').textContent = `Date Enrolled: ${student.dateEnrolled}`;
        item.querySelector('.monthlyGoals').textContent = `Monthly Goal: ${student.goals} booklets per month`;
        item.querySelector('.studentDeleteButton').addEventListener('click', this.deleteStudent.bind(this, student));
        item.querySelector('.assignmentSubmissionButton').addEventListener('click', this.addAssignment.bind(this, student.id, item.querySelector("#assignmentInput_id")));
        item.querySelector('.chartButton').addEventListener('click', this.drawChart.bind(this,student,item));
        item.querySelector('.goalEditButton').addEventListener('click', this.renderEditInput.bind(this, student, item));
        // this.drawChart(student.id, item);
        firebase.database().ref().once("value").then(snapshot => {
            if (blog.isUnAuth()) return;
            items.loadScrollPosition();
            const database = snapshot.val()[`Students`][student.id]['completedAssignments'];// find the correct spot in database
            const sortedEntries = Object.keys(database).sort((a,b) => {
                return parseInt(b) - parseInt(a); // Sort database keys by most recent
            })
            sortedEntries.forEach(key => {
                item.querySelector('.assignmentList').appendChild(this.renderAssignment(database[key], student))
            });// Append to list
         })
        return item;
    }

    renderAssignment(assignment, student) {
        const item = document.querySelector(".assignment").cloneNode(true);
        item.querySelector(".assignmentDeleteButton").style.display = 'block';
        item.querySelector(".assignmentDeleteButton").addEventListener('click', this.deleteAssignment.bind(this, assignment.id, student.id));
        item.querySelector(".assignmentContent").innerHTML = `<b>${assignment.bookletName}</b> completed on <b>${assignment.dateCompleted}</b>`;
        return item;
    }

    addAssignment (id, input) {
        if(input.querySelector('.bookletNameInput').value == '' || input.querySelector('.bookletDateCompleted').value == '') {
            alert('Please fill out all fields');
            return;
        }
        const assignment = {
            id: new Date().getTime(),
            bookletName: input.querySelector('.bookletNameInput').value,
            dateCompleted: input.querySelector('.bookletDateCompleted').value
        }
        firebase.database().ref(`Students/${id}/completedAssignments/${assignment.id}`).set(assignment);
        items.saveScrollPosition();
        location.reload();
    }

    deleteAssignment (assignmentID, studentID) {
        const directory = `Students/${studentID}/completedAssignments/${assignmentID}`;
        firebase.database().ref(directory).remove();
        items.saveScrollPosition();
        document.location.reload();
    }

    renderEditInput (student, item) {
        item.querySelector('.goalEditInput').style.display = 'block';
        item.querySelector('.goalEditSubmitButton').style.display = 'block';
        item.querySelector('.goalEditButton').style.display = 'none';
        item.querySelector('.goalEditSubmitButton').addEventListener('click', this.editInput.bind(this, student, item));
    }

    editInput(student, item) {
        const editedGoal = item.querySelector('.goalEditInput').value;
        if (editedGoal === ""){
            alert('Please fill out field');
            return;
        }
        firebase.database().ref(`Students/${student.id}/goals`).set(editedGoal);
        items.saveScrollPosition();
        location.reload();
    }

    drawChart(student, item) {
        item.querySelector('.chartButton').style.display = 'none';
        const options = {
            title: 'Booklets Completed Per Month',
            curveType: 'none',
            legend: { position: 'bottom' }
        };
        let dataArray = [['Month', 'Number of Booklets Completed', 'Monthly Booklet Goal']];
        const ref = firebase.database().ref();
        ref.once('value').then(snapshot => {
            const assignmentDatabase = snapshot.val()['Students'][student.id]['completedAssignments'];
            if (assignmentDatabase) {
                const assignmentIDs = Object.keys(assignmentDatabase);
                const assignmentDates = {};
                assignmentIDs.forEach(key => {
                    const formatedDate = assignmentDatabase[key]['dateCompleted'].substring(0,7).replace('-','');// Format into sortable values
                    if (!Object.keys(assignmentDates).includes(formatedDate)) {
                        assignmentDates[formatedDate] = 1;
                    } else {
                        assignmentDates[formatedDate] += 1;
                    }
                })
                const sortedDates = Object.keys(assignmentDates).sort((a,b) => {
                    return parseInt(a) - parseInt(b); // Sort database keys by most recent
                })
                let milestone = parseInt(student.goals);
                sortedDates.forEach(key => {
                    dataArray.push([this.formatDate(key), assignmentDates[key], milestone]);
                })
                const dataTable = google.visualization.arrayToDataTable(dataArray);
                item.querySelector('.assignmentChart').style.display = 'block';
                const chart = new google.visualization.LineChart(item.querySelector('.assignmentChart'));
                chart.draw(dataTable, options);
            } 
        });
    }
    /**
     * Changes date (i.e 201808) to formated date (i.e August, 2018)
     * @param {*} date 
     */
    formatDate(date) {
        const months = ["Jan.","Feb.","Mar.","Apr.","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."];
        return `${months[parseInt(date.substring(5)) - 1]} ${date.substring(0,4)}`;
    }

    

}

const student = new Student();