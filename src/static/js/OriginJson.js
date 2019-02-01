class OriginJson{

    constructor(artefactName, pathToJsonFile){
        console.log('# OriginJson - Constructor(' + artefactName + ', ' + pathToJsonFile + ')');
        this.artefactName = artefactName;
        this.jsonObject = null;
        this.getJsonStructureFromFile(pathToJsonFile);
        this.uiFilterCreator = null;
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
                new FilteredDataCollector().notifyThatOriginJsonIsCompleted();
                that.uiFilterCreator.createFilter();
            }
        });
    }

    getUiFilterCreator(){
        this.uiFilterCreator = UiFilterCreatorFactory.createUiFilterCreator(this.artefactName, this);
    }

    getNrOfAllNodes(){
        console.log(this.jsonObject);
        return this.jsonObject['entities'].length
    }

    getNrOfAllLinks(){
        return this.jsonObject['links'].length
    }

    getAllNodeTypesWithNrOfTypes(){
        let entities = this.jsonObject.entities;
        let nodeTypesWithNr = new Object();

        for(let i=0; i<entities.length; i++){
            if(nodeTypesWithNr[entities[i].type]){
                // increment counter
                nodeTypesWithNr[entities[i].type] = nodeTypesWithNr[entities[i].type] + 1
            } else {
                // create element
                nodeTypesWithNr[entities[i].type] = 1;
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