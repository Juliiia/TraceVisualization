function uploadFile() {
    // get file
    let input = ($('#inputCSV'))[0];

    if (!input) {
      alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");
    }
    else {
        let file = input.files[0];
        let form_data = new FormData(file);
        sendToServer(input.files[0]);
    }
}

function sendToServer(data) {
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:5000/fileuploader',
        data: data,
         cache:false,
          processData:false,
          contentType:false,
        error:function(xhr, ajaxOptions, thrownError){
            console.log(thrownError);
        },
        success: function(data) {
           console.log(data);
           let text = JSON.stringify(data);
           $("#test").append(text);
        }
    });
}