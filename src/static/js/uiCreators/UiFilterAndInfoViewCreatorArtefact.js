class UiFilterAndInfoViewCreatorArtefact{
    //TODO: rename to UiFilterAndInfoViewManager
    //TODO: filterViewCreator auslagern

    constructor(artefactName, originJsonReference) {
        console.log('# UiFilterAndInfoViewCreatorArtefact - Constructor');
        this.artefactName = artefactName;
        this.originJson = originJsonReference;
        this.uiDashboardCreator = new UiDashboardCreator(this);
    }

    createFilter(){
        console.log('UiFilterAndInfoViewCreatorArtefact - createFilter');
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

        // create info view
        this.uiDashboardCreator.createArtifactInfoView(this.artefactName, this.originJson.getNrOfAllNodes(), this.originJson.getNrOfAllLinks());

        // create color legend
        this.uiDashboardCreator.createColorLegend(this.artefactName, this.originJson.getAllNodeTypesWithNrOfTypes(), this.originJson.getAllLinkTypesWithNrOfTypes());

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
        let titleSpan = UiElementLib.getSubSectionTitle('Short Info:');
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
        let title = UiElementLib.getSubSectionTitle('Entity Types:');
        entityTypeFilter.append(title);

        // add options
        let nodesAndCounter = this.originJson.getAllNodeTypesWithNrOfTypes();
        $.each(nodesAndCounter, function (key, nr) {
           let text = key + ' (' + nr + ')';
           let id = UiElementLib.getGlobalEntityTypeClass(that.artefactName, key);
           let label = UiElementLib.getLabel(text, id, handleLabelClick);
           entityTypeFilter.append(label);
        });

        filter.append(entityTypeFilter);
        // add space behind
        filter.append(UiElementLib.getSpacer());
        return;
    }

    updateLinkTypeFilter(mainSelectorSting){
        let that = this;
        let filter = $(mainSelectorSting + ' .filterOptionsSection div.filter');

        // add filter div
        let linkTypeFilter = document.createElement('div');
        linkTypeFilter.setAttribute('class', 'linkTypeFilter');

        // add title
        let title = UiElementLib.getSubSectionTitle('Link Types:');
        linkTypeFilter.append(title);

        // add options
        let linksAndCounter = this.originJson.getAllLinkTypesWithNrOfTypes();
        $.each(linksAndCounter, function (key, nr) {
            let text = key + ' (' + nr + ')';
            let id = UiElementLib.getGlobalLinkTypeClass(that.artefactName, key);
            let label = UiElementLib.getLabel(text, id, handleLabelClick);
            linkTypeFilter.append(label);
        });

        filter.append(linkTypeFilter);
        return;
    }

    getEntityInfos(listOfEntityIds){
        return this.originJson.getInfosForEntities(listOfEntityIds);
    }
}