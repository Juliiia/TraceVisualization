function uploadFile(artefactName) {
    // TODO: filter leeren
    // get file
    let input = ($('#inputCSVRequirements'))[0]; //TODO: dynamisch abrufen

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
        //et data = new FormData(file);
        sendToServer(file, artefactName);
    }
}

function sendToServer(data, artefactName) {
    console.log(data);
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:5000/fileuploader',
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        },
        success: function (data) {
            console.log('Path to Json' + data);
            // Workaround
            let filteredDataCollector = new FilteredDataCollector();
            filteredDataCollector.addNewOriginJson(artefactName, data);
            // let text = JSON.stringify(data);
            // $("#test").append(text);
        }
    })
}