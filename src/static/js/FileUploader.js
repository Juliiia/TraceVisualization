class FileUploader {

    static uploadFile(data, artifactName) {
        let that = this;
        // get or create FilteredDataCollector()
        let filteredDataCollector = new FilteredDataCollector();
        filteredDataCollector.notifyThatWaitForNewJsonData();

        $.when(this.requestJson(data.path, artifactName)).done(function (data) {

            console.log('Path to Json ' + data);
            let filteredDataCollector = new FilteredDataCollector();
            filteredDataCollector.addNewOriginJson(artifactName, data);

            that.requestNetworkGraphCoordinates(artifactName);
            that.requestNeighborBarchartCoordinates();
        })
    }

    static requestJson(path, artifactName){
        let dfd = $.Deferred();

        let formdata = new FormData();
        formdata.append('header', artifactName);
        formdata.append('path',path);

        // query to server
        return $.ajax({
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
            },

        });
    }

    static requestNetworkGraphCoordinates(artifactName){
        let that = this;
        console.log('requestNetworkGraphCoordinates ' + artifactName);
        $.get("http://127.0.0.1:5000/networkgraphcreator", {name: artifactName}).done(function (data) {
            if(data == 'waiting'){
                setTimeout(function () {
                    that.requestNetworkGraphCoordinates(artifactName)
                }, 3000);
            } else {
                let filteredDataCollector = new FilteredDataCollector();
                filteredDataCollector.addNewViewCoordinatesToOriginJson(artifactName, ViewRegister.getNetworkViewName(), data);
            }
        }).fail(function () {
            console.log('GET REQUEST FAILED: requestNetworkGraphCoordinates');
        });
    }

    static requestNeighborBarchartCoordinates(){
        console.log('requestNeighborBarchartCoordinates ');
        $.get("http://127.0.0.1:5000/typeneighborsbarchartofall").done(function (data) {
            if(data == 'waiting'){
                setTimeout(function () {
                    that.requestNeighborBarchartCoordinates()
                }, 3000);
            } else {
                // add new coordinate so origen jsons by filteredDataCollector
                let filteredDataCollector = new FilteredDataCollector();
                console.log('DATA: ' + data);
                let paths = data.split(';');
                for(let i = 0; i < paths.length; i++){
                    // TODO: do it better
                    if(paths[i].includes('Requirements')){
                        filteredDataCollector.addNewViewCoordinatesToOriginJson('Requirements', ViewRegister.getNeighborBarchartName(), paths[i])
                    } else if(paths[i].includes('SourceCode')){
                        filteredDataCollector.addNewViewCoordinatesToOriginJson('SourceCode', ViewRegister.getNeighborBarchartName(), paths[i])
                    }
                }
                return;
            }
        }).fail(function () {
            console.log('GET REQUEST FAILED: requestNeighborBarchartCoordinates');
        });
    }

    static saveEntityAndRelationFile(json){
        // TODO
    }
}