function uploadFile() {
    console.log('uplaod');
    // get file
    let input = ($('#inputCSV'))[0];
    console.log(input.files);

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
        let fileReader = new FileReader();

        fileReader.onloadend = function(){
            sendToServer(fileReader.result);
        };

        fileReader.readAsDataURL(file);
    }
}

function sendToServer(data) {
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:5000/fileuploader',
        data: data,
        contentType: false,
        cache: false,
        processData: false,
        success: function(data) {
           $("#test").append(data);
        }
    });
}