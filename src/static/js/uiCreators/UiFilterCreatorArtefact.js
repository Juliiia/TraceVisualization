class UiFilterCreatorArtefact{

    constructor(artefactName, originJsonReference) {
        console.log('# UiFilterCreatorArtefact - Constructor');
        this.artefactName = artefactName;
        this.originJson = originJsonReference;

        this.initialisiereFilter();
    }

    initialisiereFilter(){
        let mainSelector = 'div#filterSection' + this.artefactName + '.item';

        // make filterOptions visible
        if($(mainSelector + ' .filterOptionsSection').hasClass('hidden')){
            $(mainSelector + ' .filterOptionsSection').removeClass('hidden');
        }

        // add content to info box
        let infoboxSelector = mainSelector + ' .filterOptionsSection div.shortInfoBox p';
        let infobox = $(infoboxSelector);
        let textNode = document.createTextNode('Number of Entities: ' + this.originJson.getNrOfAllNodes() + '\n Number of Links: ' + this.originJson.getNrOfAllLinks());
        infobox.append(textNode);
    }

}