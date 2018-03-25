
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBHknQGg2Io4hHdYIJ8GZw93kTdIFAGfn0",
    authDomain: "train-schedule-a2087.firebaseapp.com",
    databaseURL: "https://train-schedule-a2087.firebaseio.com",
    projectId: "train-schedule-a2087",
    storageBucket: "train-schedule-a2087.appspot.com",
    messagingSenderId: "136698610432"
  };
  firebase.initializeApp(config);


var database = firebase.database();



$("#addTrainBtn").on("click", function(event) {
    event.preventDefault();

    var trainName = $("#trainName").val().trim();
    var destination = $("#trainDes").val().trim();
    var firstTrain = moment($("#firstTrain").val().trim(), "HH,mm").subtract(10, "years").format("HH");
    var frequency = $("#frequency").val().trim();


    if (trainName == "") {
        alert('Enter a train name.');
        return false;
    }
    if (destination == "") {
        alert('Enter a destination.');
        return false;
    }
    if (firstTrain == "") {
        alert('Enter a first train time.');
        return false;
    }
    if (frequency == "") {
        alert('Enter a frequency');
        return false;
    }

    database.ref().push({
        name: trainName,
        dest: destination,
        first: firstTrain,
        freq: frequency
    })

    $("#trainName").val("");
    $("#trainDes").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");

    return false;
});


  
//firebase event for adding trains to the database
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
//store in a variable
    var trName = childSnapshot.val().name;
    var trDesination = childSnapshot.val().dest;
    var trFirstTrain = childSnapshot.val().first;
    var trFrequency = childSnapshot.val().freq;
    console.log(trName, trDesination, trFirstTrain, trFrequency);

    //calculate minutes until arrival
    var currentTime = moment();
        console.log(moment(currentTime).format("HH:mm"));

        var firstTimeConverted = moment(trFirstTrain, "HH:mm").subtract(1, "years");

        var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("Difference in time: " + timeDiff);

        var remainder = timeDiff % trFrequency;
        console.log("Remainder: ", remainder);

        var minsUntilTrain = trFrequency - remainder;
        console.log("Time Until Train: " + minsUntilTrain);

        var nextTrainTime = moment().add(minsUntilTrain, "minutes");
        var nextArrival = moment(nextTrainTime).format("HH:mm");
        console.log("Next arrival: " + moment(nextTrainTime).format("HH:mm"));

        $("#trainTable > tbody").append("<tr><td>" + trName + "</td><td>" + trDesination + "</td><td>" + trFrequency + "</td><td>" + nextArrival + "</td><td>" + minsUntilTrain + "</td></tr>");

});

   
