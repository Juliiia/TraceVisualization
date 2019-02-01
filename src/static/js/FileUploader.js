class FileUploader {

    static uploadFile(data, artifactName) {
        // get or create FilteredDataCollector()
        let filteredDataCollector = new FilteredDataCollector();
        filteredDataCollector.notifyThatWaitForNewJsonData();

        // query to server
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:5000/fileuploader',
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
                filteredDataCollector.notifyIfErrorOccur();
            },
            success: function (data) {
                console.log('Path to Json' + data);
                filteredDataCollector.addNewOriginJson(artifactName, data);
            }
        })
    }
}