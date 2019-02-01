class UiFilterCreatorArtefact{

    constructor(artefactName, originJsonReference) {
        console.log('# UiFilterCreatorArtefact - Constructor');
        this.artefactName = artefactName;
        this.originJson = originJsonReference;
    }

    createFilter(){
        console.log('UiFilterCreatorArtefact - createFilter');
        let mainSelector = 'div#filterSection' + this.artefactName + '.item';

        // hide loading
        this.hideLoading(mainSelector);

        // make filterOptions visible
        this.cleanAndDisplayFilter(mainSelector);

        // add content to info box
        this.updateShortInfo(mainSelector);

        // add entity type filter
        this.updateEntityTypeFilter(mainSelector);

        // add link type filter
        this.updateLinkTypeFilter(mainSelector);

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

    updateShortInfo(mainSelectorSting){
        let infobox = $(mainSelectorSting + ' .filterOptionsSection div.shortInfoBox');
        let titleSpan = this.getFilterTitle('Short Info:');
        let textSpan = document.createElement('span');
        let textNode = document.createTextNode('Number of Entities: ' + this.originJson.getNrOfAllNodes() + '\n Number of Links: ' + this.originJson.getNrOfAllLinks());
        textSpan.append(textNode);
        infobox.append(titleSpan);
        infobox.append(textSpan);
        return;
    }

    updateEntityTypeFilter(mainSelectorSting){
        let that = this;
        let filter = $(mainSelectorSting + ' .filterOptionsSection div.filter');

        // add filter div
        let entityTypeFilter = document.createElement('div');
        entityTypeFilter.setAttribute('class', 'entityTypeFilter');

        // add title
        let title = this.getFilterTitle('Entity Types:');
        entityTypeFilter.append(title);

        // add options
        let nodesAndCounter = this.originJson.getAllNodeTypesWithNrOfTypes();
        $.each(nodesAndCounter, function (key, nr) {
           let text = key + ' (' + nr + ')';
           let id = that.artefactName + '_entities_type_' + key; // TODO: one class for all Rules like ids
           let label = that.getLabel(text, id);
           entityTypeFilter.append(label);
        });

        filter.append(entityTypeFilter);
        // add space behind
        filter.append(this.getSpacer());
        return;
    }

    updateLinkTypeFilter(mainSelectorSting){
        let that = this;
        let filter = $(mainSelectorSting + ' .filterOptionsSection div.filter');

        // add filter div
        let linkTypeFilter = document.createElement('div');
        linkTypeFilter.setAttribute('class', 'linkTypeFilter');

        // add title
        let title = this.getFilterTitle('Link Types:');
        linkTypeFilter.append(title);

        // add options
        let linksAndCounter = this.originJson.getAllLinkTypesWithNrOfTypes();
        $.each(linksAndCounter, function (key, nr) {
            let text = key + ' (' + nr + ')';
            let id = that.artefactName + '_links_relation_' + key;
            let label = that.getLabel(text, id);
            linkTypeFilter.append(label);
        });

        filter.append(linkTypeFilter);
        return;
    }

    getFilterTitle(title){
        let element = document.createElement('span');
        element.setAttribute('class', 'filterTitle');
        element.append(title);
        return element;
    }

    getLabel(text, id){
        let element = document.createElement('a');
        element.setAttribute('class', 'ui label active');
        element.setAttribute('id', id);
        element.append(text);
        element.addEventListener('click', handleLabelClick);
        return element;
    }

    getSpacer(){
        let element = document.createElement('div');
        element.setAttribute('class', 'space');
        return element;
    }
}