class FileUploader {

    static uploadFile(data, artifactName) {
        let that = this;
        // get or create FilteredDataCollector()
        let filteredDataCollector = new FilteredDataCollector();
        filteredDataCollector.notifyThatWaitForNewJsonData();

        $.when(this.requestJson(data.path, artifactName)).then(function () {
            that.requestNetworkGraphCoordinates(artifactName);
        })
    }

    static requestJson(path, artifactName){
        let dfd = $.Deferred();

        let formdata = new FormData();
        formdata.append('header', artifactName);
        formdata.append('path',path);

        // query to server
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:5000/fileuploader',
            data: formdata,
            cache: false,
            processData: false,
            contentType: false,
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
                let filteredDataCollector = new FilteredDataCollector();
                filteredDataCollector.notifyIfErrorOccur();
                // TODO: display to client
                return;
            },
            success: function (data) {
                console.log('Path to Json ' + data);
                let filteredDataCollector = new FilteredDataCollector();
                filteredDataCollector.addNewOriginJson(artifactName, data);
                return dfd.promise();
            }

        });
    }

    static requestNetworkGraphCoordinates(artifactName){
        let that = this;
        console.log('requestNetworkGraphCoordinates ' + artifactName);
        $.get("http://127.0.0.1:5000/networkgraphcreator", {name: artifactName}).done(function (data) {
            console.log('From Server: ' + data);
            if(data == 'waiting'){
                setTimeout(function () {
                    that.requestNetworkGraphCoordinates(artifactName)
                }, 3000);
            } else {
                let filteredDataCollector = new FilteredDataCollector();
                filteredDataCollector.addNewViewCoordinatesToOriginJson(artifactName, ViewRegister.getNetworkViewName(), data);
            }
        }).fail(function () {
            console.log('GET REQUEST FAILED');
        });
    }
}