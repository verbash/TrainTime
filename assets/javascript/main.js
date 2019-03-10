
  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyBDtIBXMm3aOsB4dOzWpGRoP2P1j1qtYQI",
    authDomain: "traintime-22d5e.firebaseapp.com",
    databaseURL: "https://traintime-22d5e.firebaseio.com",
    projectId: "traintime-22d5e",
    storageBucket: "traintime-22d5e.appspot.com",
    messagingSenderId: "725617664539"
  };
  firebase.initializeApp(config);

// send form to database

let database = firebase.database();
$(document).ready(function () {

    $('form').on('submit', function (event) {
        event.preventDefault();
        database.ref().push({
            trainName: $('#trainName').val().trim(),
            destination: $('#destination').val().trim(),
            firstTrainTime: $('#firstTrainTime').val().trim(),
            frequency: $('#frequency').val().trim(),
            timestamp: firebase.database.ServerValue.TIMESTAMP
        })
        $('form').get(0).reset();
    })

// pull data from database

    database.ref().on('child_added', function (snapshot) {

        //pull the easy stuff from firebase
        let trainName = snapshot.val().trainName; 
        console.log("trainName "+ trainName);
        let destination = snapshot.val().destination;
        console.log("destination "+ destination);
        let Frequency = snapshot.val().frequency;
        console.log("Frequency "+ Frequency);
        let firstTrainTime = snapshot.val().firstTrainTime;


    // Calculate nextArrival
    let currentTime = moment().format("HH:mm");
    console.log("currentTime "+ currentTime);
    console.log("firstTrainTime "+ firstTrainTime);
    let firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1,"years");
    console.log("firstTrainTimeConverted "+ firstTrainTimeConverted);
    let differenceTime = moment().diff(moment(firstTrainTimeConverted, "minutes"));
    console.log("differenceTime "+ differenceTime);
    let tRemainder = differenceTime % Frequency;
    console.log("tRemainder "+ tRemainder);
    let nextArrival = differenceTime - tRemainder;
    let NextArrival = moment(nextArrival).format("HH:mm");
    
    console.log("NextArrival "+ NextArrival);

    // calculate minutesAway
      let minuteLast = nextArrival % Frequency;
      console.log("minuteLast " + minuteLast);
      let minutesAway = Frequency - minuteLast;
      console.log("minutesAway "+ minutesAway);




// print to table       
        let newRow = `<tr>
                        <td>${snapshot.val().trainName}</td>
                        <td>${snapshot.val().destination}</td>
                        <td>${snapshot.val().frequency}</td>
                        <td>${NextArrival}</td>
                        <td>${minutesAway}</td>
                    </tr>`
        $('#trainTable').append(newRow);

        
    }, function(error) {
        console.log("Error yo " + error);
    })

})
