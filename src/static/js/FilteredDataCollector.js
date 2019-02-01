let filteredDataCollectorInstance = null;

class FilteredDataCollector{

    constructor() {
        console.log('# FilteredDataCollector - constructor');
        if(!filteredDataCollectorInstance){
            this.selectedFilter = null; /* Map */
            this.originJsonList = [] /* List of OriginJson.js */
            filteredDataCollectorInstance = this;
            this.newDataAvailable = 'NO'; /* contains 3 states: NO, LOADING, AVAILABLE */
            this.askForVisualisation = false;
            this.isfilterChanged = false;
        } else {
            return filteredDataCollectorInstance;
        }
    }

    addNewOriginJson(artefaktName, pathToJsonFile){
        console.log('FilteredDataCollector - addNewOriginJson');
        this.newDataAvailable = 'LOADING';
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

    /**
     * manage visualization Requests:#
     *      a) ask for visualization before new json is loaded -> askForVisualisation = true
     *      b) ask for visualization new Json is available but no new filter -> start visualization
     *      c) ask for visualization but no new filters are selected and no new Json are available-> do nothing
     *      d) all right -> start visualization
     */
    visualizeJsonStructure(){
        console.log('FilteredDataCollector - visualizeJsonStructure');
        console.log()
        if(this.newDataAvailable == 'LOADING'){
            // story a)
            console.log('ask Later');
            this.askForVisualisation = true;
            return;

        } else if(this.isfilterChanged || this.newDataAvailable == 'AVAILABLE') {
            // story d) & b)
            console.log('visualize');
            this.visualizeJsonStructureConsiderFilter();
            this.newDataAvailable = 'NO';
            this.isfilterChanged = false;
            return;
        }
        // story c)
        console.log('do nothing');
        return;
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
            return;
        }
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

    notifyThatOriginJsonIsCompleted(){
        console.log('FilteredDataCollector - notifyThatOriginJsonIsCompleted');
        this.newDataAvailable = 'AVAILABLE';
        if(this.askForVisualisation){
            this.visualizeJsonStructure();
            this.askForVisualisation = false;
        }
        return;
    }

    static onError(title, message){
        // TODO: ein zentrales Alert
        let text = title + 'inside FilteredDataCollector: \n' + message;
        console.error(text);
        return;
    }
}
