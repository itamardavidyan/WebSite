const manager_name = 'שירה צוקרמן';
var dvalue = -1;

function createCSV(csv) {
    console.log("createCSV:");
    console.log(csv);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Users.csv';
    hiddenElement.click();
}

function createArray() {
    var csv = 'תעודת זהות, שם מלא, ערך,הערות\n';
    var deferred = $.Deferred();
    console.log("createArray")

    db.collection("users").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if(doc.data().name != manager_name) csv += doc.data().id + ',' + doc.data().name + ',' + doc.data().value + ',' + doc.data().comment + '\n';
        });
        createCSV(csv);
    });
}

export default class ShiftManagement {
    init(el) {
        el.innerHTML = `
            <p class="lead" id="dname">שם משתמש:</p>
            <table class="table table-striped table-bordered" id="shiftTable">
                <thead>
                    <tr>
                        <th>יום שבת</th>
                        <th>יום שישי</th>
                        <th>יום חמישי</th>
                        <th>יום רביעי</th>
                        <th>יום שלישי</th>
                        <th>יום שני</th>
                        <th>יום ראשון</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><button type="button" class="btn inner" name="18"> </button></td>
                        <td><button type="button" class="btn inner" name="15"> </button></td>
                        <td><button type="button" class="btn inner" name="12"> </button></td>
                        <td><button type="button" class="btn inner" name="9"> </button></td>
                        <td><button type="button" class="btn inner" name="6"> </button></td>
                        <td><button type="button" class="btn inner" name="3"> </button></td>
                        <td><button type="button" class="btn inner" name="0"> </button></td>
                        <td class="tdBold">בוקר</td>
                    </tr>
                    <tr>
                        <td><button type="button" class="btn inner" name="19"> </button></td>
                        <td><button type="button" class="btn inner" name="16"> </button></td>
                        <td><button type="button" class="btn inner" name="13"> </button></td>
                        <td><button type="button" class="btn inner" name="10"> </button></td>
                        <td><button type="button" class="btn inner" name="7"> </button></td>
                        <td><button type="button" class="btn inner" name="4"> </button></td>
                        <td><button type="button" class="btn inner" name="1"> </button></td>
                        <td class="tdBold">ערב</td>
                    </tr>
                    <tr>
                        <td><button type="button" class="btn inner" name="20"> </button></td>
                        <td><button type="button" class="btn inner" name="17"> </button></td>
                        <td><button type="button" class="btn inner" name="14"> </button></td>
                        <td><button type="button" class="btn inner" name="11"> </button></td>
                        <td><button type="button" class="btn inner" name="8"> </button></td>
                        <td><button type="button" class="btn inner" name="5"> </button></td>
                        <td><button type="button" class="btn inner" name="2"> </button></td>
                        <td class="tdBold">לילה</td>
                    </tr>
                </tbody>
            </table>
                
            <div class="comment-group" dir="rtl">
                <label for="comment">הערות:</label>
                <textarea class="form-control" rows="2" id="comment"></textarea>
            </div>

            <button id="btn-save" type="button" class="btn btn-success">שמור</button>
            <button id="btn-signout" type="button" class="btn btn-danger">שמור והתנתק</button>
            <button id="export" type="button" class="btn btn-info">ייצא</button>
            <button id="info" type="button" class="btn btn-info"><i class="fa fa-info-circle" aria-hidden="true"></i></button>
            <br>
            <p id="saveMsg">המשמרות נשמרו בהצלחה!</p>

            <!-- The Modal -->
            <div id="myModal" class="modal">
            <!-- Modal content -->
            <div class="modal-content">
                <div class="modal-header">
                    <span class="close" id="closeBtn">&times;</span>
                    <h3>רשימת בקרים:</h3>
                </div>
                <div class="modal-body">
                    <h4 style="color: red;">בקרים שלא הזינו משמרות:</h2>
                    <ul id="submitF">
                        <li>Coffee</li>
                    </ul>
                    <h4 style="color: green;">בקרים שהזינו משמרות:</h2>
                    <ul id="submitT">
                        <li>Coffee</li>
                    </ul>    
                </div>
            </div>

            </div>
        `;

        $('#btn-signout').on('click', function() {
            save();

            firebase.auth().signOut().then(function() {
              // Sign-out successful.
            }).catch(function(error) {
              // An error happened.
            });
        });

        $('#btn-save').on('click', function() {
            save();
        });


        $('.inner').on('click', function(){
            var button = $(this);
            var num = button.attr("name");
            console.log("num: " + num);
            console.log("before: " + dvalue);

            var color = button.css("background-color");
            // console.log("color: " + color);

            if (color == 'rgb(0, 128, 0)') {
                button.css("background-color", "red");
                dvalue -= Math.pow(2, num);
            }
            else {
                button.css("background-color", "green");
                dvalue += Math.pow(2, num);
            }

            console.log("after: " + dvalue);
        });

        $('#export').on('click', function() {
            createArray();
        });

        $('#info').on('click', function() {
            var today = new Date();
            var thisWeek = today.getWeek();

            $("#submitF").empty();
            $("#submitT").empty();

            $("#myModal").css("display", "block");

            firebase.firestore().collection('users').get().then(function(querySnapshot) {
                querySnapshot.forEach(function(docu) {
                    if (docu.data().name == manager_name) return;
                    if (docu.data().week == thisWeek) $("#submitT").append("<li>" + docu.data().name + "</li>");
                    else $("#submitF").append("<li>" + docu.data().name + "</li>");
                });
            });
        });

        $('#closeBtn').on('click', function() {
            $("#myModal").css("display", "none");
        });

        window.onclick = function(event) {
            var modal = document.getElementById('myModal');
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
} 


const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        const id   = user.uid;

        $(document).ready(function(){
            firebase.firestore().collection('users').doc(id).get().then(function(doc) {
                if (doc.data().name != manager_name) {
                    setDvalue(doc.data().value, setButtons);
                    $("#comment").text(doc.data().comment);
                }
                else {
                    $(".comment-group").css("display", "none");
                    $("#shiftTable").css("display", "none");
                }

                const name = doc.data().name;
                $("#dname").text("שם משתמש: " + name);
                if (name == 'איתמר דודיאן' || name == manager_name){
                    $('#export').css("display", "inline");
                    $('#info').css("display", "inline");
                }
            });
        });
    } else {
        // user not signed in, do nothing
    }
});

function setDvalue(value, callback) {
    // console.log("hi" + value);
    dvalue = value;
    callback();
}

function setButtons() {
    var value = dvalue;

    for (var j=0; j<=20; j++) {
        var name = j.toString();
        var button = document.getElementsByName(name)[0];
        if (value % 2 == 1) button.style.background='#008000';
        else button.style.background='#FF0000';
        value = Math.floor(value / 2);
    }
}

function save() {
    if (dvalue == -1) return;

    var today = new Date();
    var week = today.getWeek();

    var comment = $("#comment").val().replace(/\,/g, ';');;
    const value = dvalue;
    const userid = firebase.auth().currentUser.uid;
    firebase.firestore().collection('users').doc(userid).update({
      value, comment, week
    }).then(function(){
        $('#saveMsg').css("display", "block");
        $('#saveMsg').delay(2500).fadeOut();
    }).catch(function(error) {
        alert('error:\n' + error);
    });
}

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    var today = new Date(this.getFullYear(),this.getMonth(),this.getDate());
    var dayOfYear = ((today - onejan +1)/86400000);
    return Math.ceil(dayOfYear/7)
};

