class UiFilterCreatorArtefact{

    constructor(artefactName, originJsonReference) {
        console.log('# UiFilterCreatorArtefact - Constructor');
        this.artefactName = artefactName;
        this.originJson = originJsonReference;
    }

    createFilter(){
        let mainSelector = 'div#filterSection' + this.artefactName + '.item';

        // hide loading
        this.hideLoading(mainSelector);

        // make filterOptions visible
        this.cleanAndDisplayFilter(mainSelector);

        // add content to info box
        let infobox = $(mainSelector + ' .filterOptionsSection div.shortInfoBox');
        let textNode = document.createTextNode('Number of Entities: ' + this.originJson.getNrOfAllNodes() + '\n Number of Links: ' + this.originJson.getNrOfAllLinks());
        infobox.append(textNode);

        // add Filter content

        return;
    }

    hideLoading(mainSelectorString){
        $(mainSelectorString + ' .loader').addClass('hidden');
        return;
    }

    cleanAndDisplayFilter(mainSelectorSting){
        // clean
        $(mainSelectorSting + ' .filterOptionsSection .shortInfoBox').empty();
        $(mainSelectorSting + ' .filterOptionsSection .filter').empty();

        // make visible
        if($(mainSelectorSting + ' .filterOptionsSection').hasClass('hidden')){
            $(mainSelectorSting + ' .filterOptionsSection').removeClass('hidden');
        }
        return;
    }
}