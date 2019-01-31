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
        this.isfilterChanged = true;
    }

    addNewOriginJson(artefaktName, pathToJsonFile){
        console.log('FilteredDataCollector - addNewOriginJson');
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
        if(this.originJsonList.length > 0 && this.isfilterChanged){
            let arrayWithJsons = [];
            // check filter map
            // query results
            if(!this.selectedFilter){
                // get all data structures
                for(let i=0; i < this.originJsonList.length; i++){
                    let item = [];
                    item[0] = this.originJsonList[i].artefactName;
                    item[1] = this.originJsonList[i].jsonObject;
                    arrayWithJsons[i] = item;
                }
            }
            // send json to visualise
            UiVisualisationCreator.visualizeNetworkGraph(arrayWithJsons);
            this.isfilterChanged = false;
        }
    }

    static onError(title, message){
        // TODO: ein zentrales Alert
        let text = title + 'inside FilteredDataCollector: \n' + message;
        console.error(text);
    }
}
