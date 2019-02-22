class OriginJson{

    constructor(artefactName, pathToJsonFile){
        console.log('# OriginJson - Constructor(' + artefactName + ', ' + pathToJsonFile + ')');
        this.artefactName = artefactName;
        this.jsonObject = null;
        this.getJsonStructureFromFile(pathToJsonFile);
        this.uiFilterCreator = null;
        this.jsonDataCompleted = false;
        this.viewCoordinates = new Object();
    }

    /**
     * loads the new json structure from the file and
     * adds a new UiFilterCreator if it not exists
     *
     * @param {String} path - path to json file
     */
    getJsonStructureFromFile(path){
        console.log('OriginJson - loadJsonStructureFromFile ' + path);
        this.jsonObject = null;
        this.jsonDataCompleted = false;
        let that = this;
        $.getJSON('../' + path, function (data) {
            that.jsonObject = data;
        }).done(function () {

            if(!that.jsonObject){
                that.onError('jsonStructure = null', 'could not load json from file: ' + path);
            } else {
                if(!that.uiFilterCreator){
                    that.getUiFilterCreator();
                }
                // notify for finished loading
                that.jsonDataCompleted = true;
                new FilteredDataCollector().notifyThatOriginJsonIsCompleted(that.artefactName);
                that.uiFilterCreator.createFilter();
            }
        });
    }

    getNewViewFromFile(viewName, path){
        let that = this;
        let jsonData = null;
        $.getJSON('../' + path, function (data) {
            jsonData = data;
        }).done(function () {
            if(jsonData){
                // add to view list
                that.viewCoordinates[viewName] = jsonData;
                new FilteredDataCollector().notifyNewViewDataLoaded(that.artefactName, viewName);
            } else {
                that.onError('jsonData = null', 'could not load json from file: ' + path);
            }
        });
        return;
    }

    getUiFilterCreator(){
        this.uiFilterCreator = UiFilterAndInfoViewCreatorFactory.createUiFilterCreator(this.artefactName, this);
    }

    getNrOfAllNodes(){
        return Object.keys(this.jsonObject['entities']).length;
    }

    getNrOfAllLinks(){
        return Object.keys(this.jsonObject['links']).length;
    }

    getAllNodeTypesWithNrOfTypes(){
        let entities = this.jsonObject.entities;
        let nodeTypesWithNr = new Object();

        for(let key in entities){

            if(nodeTypesWithNr[entities[key].type]){
                // increment counter
                nodeTypesWithNr[entities[key].type] = nodeTypesWithNr[entities[key].type] + 1
            } else {
                // create element
                nodeTypesWithNr[entities[key].type] = 1;
            }
        }
        return nodeTypesWithNr;
    }

    getAllLinkTypesWithNrOfTypes(){
        let links = this.jsonObject.links;
        let linkTypesWithNr = new Object();

        for(let i=0; i<links.length; i++){
            if(linkTypesWithNr[links[i].relation]){
                // increment counter
                linkTypesWithNr[links[i].relation] = linkTypesWithNr[links[i].relation] + 1
            } else {
                // create element
                linkTypesWithNr[links[i].relation] = 1;
            }
        }
        return linkTypesWithNr;
    }

    onError(title, message){
        // TODO: ein zentrales Alert
        let text = title + 'inside OriginJson: \n' + message;
        console.error(text);
    }

}