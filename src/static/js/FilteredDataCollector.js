let filteredDataCollectorInstance = null;

class FilteredDataCollector{

    constructor() {
        console.log('# FilteredDataCollector - constructor');
        if(!filteredDataCollectorInstance){
            this.deselectedFilterList = [];
            this.originJsonList = [];
            filteredDataCollectorInstance = this;
            this.isfilterChanged = false;
            this.uiVisualisationCreator = new UiVisualisationCreator();
        } else {
            return filteredDataCollectorInstance;
        }
    }

    addNewOriginJson(artefaktName, pathToJsonFile){
        this.newDataAvailable = 'LOADING';
        // replace an old artifact json
        if(this.originJsonList.length > 0){
            for(let i=0; i<this.originJsonList.length; i++){
                if(this.originJsonList[i].artefactName == artefaktName){
                    this.originJsonList[i].getJsonStructureFromFile(pathToJsonFile);
                    return;
                }
            }
        }
        let originJson = new OriginJson(artefaktName, pathToJsonFile);
        this.originJsonList.push(originJson);
    }

    addNewViewCoordinatesToOriginJson(artifactName, viewName, pathToJson){
        if(this.originJsonList.length > 0) {
            for(let i=0; i<this.originJsonList.length; i++) {
                if(this.originJsonList[i].artefactName == artifactName){
                    this.originJsonList[i].getNewViewFromFile(viewName, pathToJson);
                    return;
                }
            }
        }
        return;
    }

    visualizeJsonStructure(){
        if(this.isfilterChanged){
            this.updateVisualisation();
            return;
        }
        return;
    }

    // TODO: maybe better to hold an array of all jsons and only update them if json changes
    visualizeJsonStructureConsiderFilter(artifactName){
        if (this.originJsonList.length > 0) {
            // if jsons are existing and there was a new filter selected or a new json was loaded
            let arrayWithJsons = [];

            // get all data structures
            for (let i = 0; i < this.originJsonList.length; i++) {
                if(artifactName == this.originJsonList[i].artefactName){
                    let item = [];
                    item[0] = this.originJsonList[i].artefactName;
                    item[1] = this.originJsonList[i].jsonObject;
                    arrayWithJsons.push(item);
                }
            }
            // send json to visualise
            this.uiVisualisationCreator.visualizeNetworkGraph(arrayWithJsons);

            // highlight selections
            if(this.isfilterChanged){
                this.updateVisualisation();
            }

            return;

        } else {
            this.onError('No Json', 'There are no json data available.')
        }
        return;
    }

    visualizeView(artifactName, viewName){
        if (this.originJsonList.length > 0) {

            let arrayWithViewInfo = new Object();

            if (ViewRegister.isSingleArtifactView(viewName)) {

                for (let i = 0; i < this.originJsonList.length; i++) {
                    if (this.originJsonList[i].artefactName == artifactName) {
                        arrayWithViewInfo['artifactName'] = this.originJsonList[i].artefactName;
                        arrayWithViewInfo['baseInfo'] = this.originJsonList[i].jsonObject;
                        arrayWithViewInfo['viewInfo'] = this.originJsonList[i].viewCoordinates[viewName];
                        break;
                    }
                }

            } else {
                // if the view needs coordinates of all artifacts
                for (let i = 0; i < this.originJsonList.length; i++) {
                    // TODO: check ob Req und code da sind
                    let item = new Object();
                    item['artifactName'] = this.originJsonList[i].artefactName;
                    item['baseInfo'] = this.originJsonList[i].jsonObject;
                    // check if all artifacts contains the view coordinates
                    if(this.originJsonList[i].viewCoordinates[viewName]){
                        item['viewInfo'] = this.originJsonList[i].viewCoordinates[viewName];
                    } else {
                        return;
                    }
                    arrayWithViewInfo[i] = item;
                }
            }

            this.uiVisualisationCreator.visualizeView(viewName, arrayWithViewInfo);
            return;

        } else {
            this.onError('No Data', 'CLASS: FilteredDataCollector METHODE: visualizeView MESSAGE: Could not find origin jsons!')
        }
        return;
    }

    visualizeBaseStructure(artifactName){
        if (this.originJsonList.length > 0) {
            // if jsons are existing and there was a new filter selected or a new json was loaded
            let arrayWithJsons = [];

            // get all data structures
            for (let i = 0; i < this.originJsonList.length; i++) {
                if (artifactName == this.originJsonList[i].artefactName) {
                    let item = [];
                    item[0] = this.originJsonList[i].artefactName;
                    item[1] = this.originJsonList[i].jsonObject;
                    arrayWithJsons.push(item);
                }
            }
            this.uiVisualisationCreator.visualizeBaseInformations(arrayWithJsons);
        } else {
            this.onError('No Json', 'There are no json data available.')
        }
        return;
    }

    updateVisualisation(){
        this.uiVisualisationCreator.highlightSelection(this.deselectedFilterList);
        this.isfilterChanged = false;
    }

    entitySelected(elementId, artifact){
        this.uiVisualisationCreator.entitySelected(elementId, artifact);
        return;
    }

    addDeselectionToFilter(selection){
        //TODO: check if filter was really changed to old version
        this.isfilterChanged = true;
        if(!this.deselectedFilterList.includes(selection)){
            this.deselectedFilterList.push(selection);
        }
        return;
    }

    removeDeselectionFromFilter(selection){
        this.isfilterChanged = true;
        if(this.deselectedFilterList.includes(selection)){
            let index = this.deselectedFilterList.indexOf(selection);
            this.deselectedFilterList.splice(index, 1);
        }
        return;
    }

    /**
     * if client is waiting for Server result.
     * newDataAvailable ist imported to handle early visualisation requests
     */
    notifyThatWaitForNewJsonData(){
        this.newDataAvailable = 'LOADING';
        return;
    }

    /**
     * if there was an error
     */
    notifyIfErrorOccur(){
        this.newDataAvailable = 'NO';
        return;
    }

    /**
     * checks if the variable jsonDataCompleted == true of all OriginJson objects
     */
    notifyThatOriginJsonIsCompleted(artifactName){
        this.visualizeBaseStructure(artifactName);
        return;
    }

    notifyNewViewDataLoaded(artifactName, viewName){
        this.visualizeView(artifactName, viewName);
        return;
    }

    onError(title, message){
        // TODO: ein zentrales Alert
        let text = title + 'inside FilteredDataCollector: \n' + message;
        console.error(text);
        return;
    }
}
