let filteredDataCollectorInstance = null;

class FilteredDataCollector{

    constructor() {
        console.log('# FilteredDataCollector - constructor');
        if(!filteredDataCollectorInstance){
            this.selectedFilter = null; /* Map */
            this.originJsonList = [] /* List of OriginJson.js */
            filteredDataCollectorInstance = this;
        } else {
            return filteredDataCollectorInstance;
        }
        this.isfilterChanged = false;
        this.askForVisualisation = false;
    }

    addNewOriginJson(artefaktName, pathToJsonFile){
        console.log('FilteredDataCollector - addNewOriginJson');
        this.isDataOfAllOrigenJsonCompleted = false;
        // replace an old artefact json
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

    visualizeJsonStructure(){
        console.log('FilteredDataCollector - visualizeJsonStructure');
        if(this.isfilterChanged) {
            this.visualizeJsonStructureConsiderFilter();
        } else {
            this.askForVisualisation = true;
            console.log('ask later');
        }
    }

    visualizeJsonStructureConsiderFilter(){
        console.log('FilteredDataCollector - visualizeJsonStructureConsiderFilter');
        if (this.originJsonList.length > 0) {
            // if jsons are existing and there was a new filter selected or a new json was loaded
            let arrayWithJsons = [];
            // check filter map
            // query results
            if (!this.selectedFilter) {
                // get all data structures
                for (let i = 0; i < this.originJsonList.length; i++) {
                    let item = [];
                    item[0] = this.originJsonList[i].artefactName;
                    item[1] = this.originJsonList[i].jsonObject;
                    console.log(this.originJsonList[i].jsonObject);
                    arrayWithJsons[i] = item;
                }
            }
            // send json to visualise
            UiVisualisationCreator.visualizeNetworkGraph(arrayWithJsons);
            this.isfilterChanged = false;
            return;
        }
    }

    notifyThatOriginJsonIsCompleted(){
        console.log('FilteredDataCollector - notifyThatOriginJsonIsCompleted');
        this.isfilterChanged = true;
        if(this.askForVisualisation){
            this.visualizeJsonStructure();
            this.askForVisualisation = false;
        }
    }

    static onError(title, message){
        // TODO: ein zentrales Alert
        let text = title + 'inside FilteredDataCollector: \n' + message;
        console.error(text);
    }
}
