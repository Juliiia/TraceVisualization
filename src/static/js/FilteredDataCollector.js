let filteredDataCollectorInstance = null;

class FilteredDataCollector{

    constructor() {
        console.log('# FilteredDataCollector - constructor');
        if(!filteredDataCollectorInstance){
            this.deselectedFilterList = [];
            this.originJsonList = [];
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

    /**
     * manage visualization Requests:#
     *      a) ask for visualization before new json is loaded -> askForVisualisation = true
     *      b) ask for visualization new Json is available but no new filter -> start visualization
     *      c) ask for visualization but no new filters are selected and no new Json are available-> do nothing
     *      d) ask for visualization no new Json is available but new filters -> start visualization
     */
    visualizeJsonStructure(){
        console.log('FilteredDataCollector - visualizeJsonStructure');
        if(this.newDataAvailable == 'LOADING'){
            // story a)
            console.log('ask Later');
            this.askForVisualisation = true;
            return;

        } else if(this.newDataAvailable == 'AVAILABLE') {
            // story b)
            this.visualizeJsonStructureConsiderFilter();
            this.newDataAvailable = 'NO';
            return;
        } else if(this.isfilterChanged){
            // story d)
            this.updateVisualisation();
            return;
        }
        // story c)
        console.log('do nothing');
        return;
    }

    // TODO: maybe better to hold an array of all jsons and only update them if json changes
    visualizeJsonStructureConsiderFilter(){
        console.log('FilteredDataCollector - visualizeJsonStructureConsiderFilter');
        if (this.originJsonList.length > 0) {
            // if jsons are existing and there was a new filter selected or a new json was loaded
            let arrayWithJsons = [];

            // get all data structures
            for (let i = 0; i < this.originJsonList.length; i++) {
                let item = [];
                item[0] = this.originJsonList[i].artefactName;
                item[1] = this.originJsonList[i].jsonObject;
                arrayWithJsons[i] = item;
            }
            // send json to visualise
            UiVisualisationCreator.visualizeNetworkGraph(arrayWithJsons);

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

    updateVisualisation(){
        console.log('FilteredDataCollector - updateVisualisation');
        UiVisualisationCreator.highlightSelection(this.deselectedFilterList);
        this.isfilterChanged = false;
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
    notifyThatOriginJsonIsCompleted(){
        console.log('FilteredDataCollector - notifyThatOriginJsonIsCompleted');

        for(let i=0; i<this.originJsonList.length; i++){
            if(!this.originJsonList[i].jsonDataCompleted){
                // if there is only one originjson objects which is still loading -> stop
                return;
            }
        }
        // continue if all jsonorigin objects are completed
        this.newDataAvailable = 'AVAILABLE';
        if(this.askForVisualisation){
            this.visualizeJsonStructure();
            this.askForVisualisation = false;
        }
        return;
    }

    onError(title, message){
        // TODO: ein zentrales Alert
        let text = title + 'inside FilteredDataCollector: \n' + message;
        console.error(text);
        return;
    }
}
