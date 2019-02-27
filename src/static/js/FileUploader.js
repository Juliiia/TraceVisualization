let fileUploader = null;

class FileUploader {

    constructor(){
        if(!fileUploader){
            this.isRequirementFileUploaded = false;
            this.isSourceCodeFileUploaded = false;
            fileUploader = this;
        } else {
            return fileUploader;
        }
    }

    uploadFile(data, artifactName) {
        let that = this;
        // get or create FilteredDataCollector()
        let filteredDataCollector = new FilteredDataCollector();
        filteredDataCollector.notifyThatWaitForNewJsonData();

        $.when(this.requestJson(data.path, artifactName)).done(function (data) {

            console.log('Path to Json ' + data);
            let filteredDataCollector = new FilteredDataCollector();
            filteredDataCollector.addNewOriginJson(artifactName, data);

            that.requestNetworkGraphCoordinates(artifactName);

            // send request only if both files are uploaded successful
            if(that.updateAndGetState(artifactName)){
                that.requestNeighborBarchartCoordinates(ViewRegister.getNeighborBarchartSortDefaultOption());
            }
        })
    }

    requestJson(path, artifactName){
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
            }

        });
    }

    requestNetworkGraphCoordinates(artifactName){
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

    requestNeighborBarchartCoordinates(sortby){
        let that = this;
        console.log('requestNeighborBarchartCoordinates ');
        $.get("http://127.0.0.1:5000/typeneighborsbarchartofall", {sortby: sortby}).done(function (data) {
            if(data == 'waiting'){
                /*setTimeout(function () {
                    that.requestNeighborBarchartCoordinates(sortby)
                }, 3000);*/
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

    saveEntityAndRelationFile(json){
        // TODO
    }

    /**
     * returns true if the other file was successful updated
     *
     * @param artifactName
     */
    updateAndGetState(artifactName){
        switch (artifactName) {
            case ViewRegister.getReqArtifactName():
                this.isRequirementFileUploaded = true;
                if(this.isSourceCodeFileUploaded){
                    return true;
                }
                break;

            case ViewRegister.getSourceCodeArtifactName():
                this.isSourceCodeFileUploaded = true;
                if(this.isRequirementFileUploaded){
                    return true;
                }
                break;
        }
        return false;
    }
}