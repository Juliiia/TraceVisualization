class UiFilterAndInfoViewCreatorArtefact{
    //TODO: filterViewCreator auslagern

    constructor(artefactName, originJsonReference) {
        console.log('# UiFilterAndInfoViewCreatorArtefact - Constructor for ' + artefactName);
        this.artefactName = artefactName;
        this.originJson = originJsonReference;
        this.entityAndRelationTypesManager = new EntityAndRelationTypeManager();
        this.artifactInfoElement = $('#artifactInformationView');
        this.selectedNodeElement = $('#selectedNodeInformationView');
    }

    createFilter(){
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
        this.createArtifactInfoView(this.artefactName, this.originJson.getNrOfAllNodes(), this.originJson.getNrOfAllLinks());

        // create color legend
        this.createColorLegend(this.artefactName, this.originJson.getAllNodeTypesWithNrOfTypes(), this.originJson.getAllLinkTypesWithNrOfTypes());

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

    createArtifactInfoView(artifactName, nrOfNodes, nrOfLinks){
        let newChildElement = UiElementLib.getDashboardElementSubsection(artifactName);

        // clean existing Information
        UiElementLib.removeChildElementIfExists(this.artifactInfoElement, 'div.' + artifactName);

        let titleElement = UiElementLib.getSectionTitle(artifactName);
        let nodesInfoElement = UiElementLib.getKeyValuePair('Entities', nrOfNodes);
        let linksInfoElement = UiElementLib.getKeyValuePair('Links', nrOfLinks);

        newChildElement.append(titleElement);
        newChildElement.append(nodesInfoElement);
        newChildElement.append(linksInfoElement);
        this.artifactInfoElement.append(newChildElement);
        return true;
    }

    createColorLegend(artifactName, nodetypes, linktypes) {
        let that = this;
        let parentElement = $('#colorLegendView');
        let newChildElement = UiElementLib.getDashboardElementSubsection(artifactName);

        // clean existing Informations
        UiElementLib.removeChildElementIfExists(parentElement, 'div.' + artifactName);

        let titleElement = UiElementLib.getSectionTitle(artifactName + ' Color Legend');

        let subSectionEntities = UiElementLib.getDashboardElementSubsection('entityTypes');
        let subTitleEntity = UiElementLib.getSubSectionTitle('Entity Types: ');

        subSectionEntities.append(subTitleEntity);

        // append labels for entity types
        $.each(nodetypes, function (key, nr) {
           let text = key + ' (' + nr + ')';
           let id = UiElementLib.getGlobalEntityFilterId(artifactName, key);
           let label = UiElementLib.getLabelWithCustomColor(text, id, null, that.entityAndRelationTypesManager.getColorOfType(key));
           subSectionEntities.append(label);
        });

        let subSectionLinks = UiElementLib.getDashboardElementSubsection('linkTypes');
        let subTitleLink = UiElementLib.getSubSectionTitle('Link Types: ');
        subSectionLinks.append(subTitleLink);

        // append labels for link types
        $.each(linktypes, function (key, nr) {
            let text = key + ' (' + nr + ')';
            let id = UiElementLib.getGlobalLinkFilterId(artifactName, key);
            let label = UiElementLib.getLabelWithCustomColor(text, id, null, that.entityAndRelationTypesManager.getColorOfType(key));
            subSectionLinks.append(label);
        });

        newChildElement.append(titleElement);
        newChildElement.append(subSectionEntities);
        newChildElement.append(subSectionLinks);
        parentElement.append(newChildElement);
        return true;
    }

    createSelectedEntityInfoView(selectedElement){
        // clean div
        let selectedInfoDiv = this.selectedNodeElement.empty();

        // add title
        let title = UiElementLib.getSectionTitle('Selected Node');
        selectedInfoDiv.append(title);

        // create pairs
        let allEntityAttributes = ViewRegister.getEntityAttributes();
        for(let i=0; i<allEntityAttributes.length; i++){
            let element = UiElementLib.getKeyValuePair(allEntityAttributes[i], selectedElement.data(allEntityAttributes[i]));
            selectedInfoDiv.append(element);
        }

        // add outgoing link types
        let that = this;
        let subSectionRelations = UiElementLib.getDashboardElementSubsection('linkTypes');
        let addictbytypes = selectedElement.data('addictbytypes');
        if(addictbytypes != 0){
             $.each(addictbytypes, function (key, value) {
                let text = key + ' (' + value.length + ')';
                let id = UiElementLib.getGlobalLinkFilterId(selectedElement.data('artifact'), key);
                let label = UiElementLib.getLabelWithCustomColor(text, id, handleLabelWithToggleClick, that.entityAndRelationTypesManager.getColorOfType(key));
                label.setAttribute('data-artifact', selectedElement.data('artifact'));
                label.setAttribute('data-entityids', value);
                label.setAttribute('data-sourceentity', selectedElement.data('id'));
                subSectionRelations.append(label);
             });
        } else {
            subSectionRelations.append('-');
        }
        let addictByTypes = UiElementLib.getKeyValuePair('Addict by Types', subSectionRelations);

        selectedInfoDiv.append(addictByTypes);
        return;
    }

    /**
     * displays all related entities of the special relation type
     *
     * @param {HTMLElement} selectedRelationType
     */
    createToggleInfoForReletedEntities(selectedRelationType){
        let sourceId = selectedRelationType.data('sourceentity');
        let subSectionDiv;

        // clean or create toggleInfoSubsection Div
        if(this.selectedNodeElement.find('.toggleInfoSubsection').length > 0){
             subSectionDiv = this.selectedNodeElement.find('.toggleInfoSubsection').empty();
        } else {
            subSectionDiv = UiElementLib.getDashboardElementSubsection('toggleInfoSubsection');
            this.selectedNodeElement.append(subSectionDiv);
        }

        // append new Information
        let allEntities = selectedRelationType.data('entityids').split(',');
        let allEntitiesWithInfo = this.originJson.getInfosForEntitiesAndLinks(sourceId, allEntities);
        let allEntityAttributes = ViewRegister.getEntityWithLinkAttributes();

        if(allEntities.length < 6){
            // create on accordion
            let accordion = UiElementLib.getAccordionDiv();
            for(let i=0; i<allEntities.length; i++){
                let entityInfo = allEntitiesWithInfo[allEntities[i]];
                let content = document.createElement('div');

                for(let ii=0; ii<allEntityAttributes.length; ii++){
                    let element = UiElementLib.getKeyValuePair(allEntityAttributes[ii], entityInfo[allEntityAttributes[ii]]);
                    content.append(element);
                }

                // add "go to" button
                let button = UiElementLib.getButtonWithIcon(entityInfo['id'], 'floatRight marginBefore', 'arrow right', 'go to this');
                button = UiElementLib.addEntityDataToElement(button, entityInfo);
                button.addEventListener('click', handleNodeClick);
                let div = UiElementLib.getClearDiv();
                content.append(button);
                content.append(div);

                accordion = UiElementLib.getAccordionElement(accordion, entityInfo['name'], content);
            }
            subSectionDiv.append(accordion);
            initAccordion();
        } else {
            let p = document.createElement('p');
            p.setAttribute('class', 'wrapText');
            p.append(selectedRelationType.data('entityids'));
            subSectionDiv.append(p);
        }
        return;
    }
}