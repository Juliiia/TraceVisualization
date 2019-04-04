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

    /**
     * returns an object with node information
     *
     * @param {Array} listOfEntityIds
     * @returns {Object}
     */
    getInfosForEntities(listOfEntityIds){
        let entities = this.jsonObject.entities;
        console.log(entities);
        let foundEntities = new Object();
        for(let i=0; i<entities.length; i++){
            if(listOfEntityIds.indexOf(entities[i].id) > -1){
                foundEntities[entities[i].id] = entities[i];
            }
        }
        console.log('FOUND:');
        console.log(foundEntities);
        return foundEntities;
    }

    /**
     * returns an object with node information
     * and link (from the sourceEntity) information
     * Beispiel return:
     * "Requirementsentity352:
     *  addictByTypes:0, approved:"false", artifact:"Requirements", id:"Requirementsentity352", incomingRelations:2, independence:0, name:"Func-Req-04", outgoingRelations:0, type:"REQU""
     *
     * @param {String} sourceEntityId
     * @param {Array} listOfEntityIds
     * @returns {Object}
     */
    getInfosForEntitiesAndLinks(sourceEntityId, listOfEntityIds){
        let links = this.jsonObject.links;
        let foundEntitiesWithLinks = this.getInfosForEntities(listOfEntityIds);
        console.log('-----------');
        console.log(foundEntitiesWithLinks);
        for(let i=0; i<links.length; i++) {
            if(links[i].sourceId == sourceEntityId
                && foundEntitiesWithLinks[links[i].targetId] != undefined){
                console.log(foundEntitiesWithLinks[links[i].targetId]);
                foundEntitiesWithLinks[links[i].targetId]['approved'] = links[i].approved;
            }
        }
        console.log(foundEntitiesWithLinks);
        console.log('-----------');
        return foundEntitiesWithLinks;
    }
}