let uiDashboardCreator = null
class UiDashboardCreator{

    constructor(uiFilterAndInfoViewManager) {
        if(!uiDashboardCreator){
            this.uiFilterAndInfoViewManager = uiFilterAndInfoViewManager;
            this.entityAndRelationTypesManager = new EntityAndRelationTypeManager();
            this.selectedNodeElement = $('#selectedNodeInformationView');
            this.artifactInfoElement = $('#artifactInformationView');
            uiDashboardCreator = this;
        } else {
            return uiDashboardCreator;
        }

    }

    createArtifactInfoView(artifactName, nrOfNodes, nrOfLinks){
        console.log('UiDashboardCreator - createArtifactInfoView');
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
        let newChildElement = UiElementLib.getDashboardElementSubsection(artifactName)

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
            let label = UiElementLib.getLabel(text, id, null);
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

        // create pairs
        let title = UiElementLib.getSectionTitle('Selected Node');
        let namePair = UiElementLib.getKeyValuePair('Name', selectedElement.data('name'));
        let typePair = UiElementLib.getKeyValuePair('Type', selectedElement.data('type'));
        let outNeighborsPair = UiElementLib.getKeyValuePair('Outgoing Relations', selectedElement.data('outrelations'));
        let inNeighborsPair = UiElementLib.getKeyValuePair('Incoming Relations', selectedElement.data('inrelations'));
        let independence = UiElementLib.getKeyValuePair('Independence', selectedElement.data('independence'));
        let idPair = UiElementLib.getKeyValuePair('Id', selectedElement.data('id'));
        let artifactPair = UiElementLib.getKeyValuePair('Artifact', selectedElement.data('artifact'));

        // add outgoing link types
        let that = this;
        let subSectionRelations = UiElementLib.getDashboardElementSubsection('linkTypes');
        let addictbytypes = selectedElement.data('addictbytypes');
        if(addictbytypes != 0){
             $.each(addictbytypes, function (key, value) {
                let text = key + ' (' + value.length + ')';
                let id = UiElementLib.getGlobalLinkFilterId(selectedElement.data('artifact'), key);
                let label = UiElementLib.getLabelWithCustomColor(text, id, handleLabelWithToggleClick, that.entityAndRelationTypesManager.getColorOfType(key));
                label.setAttribute('data-entityids', value);
                subSectionRelations.append(label);
             });
        }
        let addictByTypes = UiElementLib.getKeyValuePair('Addict by Types', subSectionRelations);

        selectedInfoDiv.append(title);
        selectedInfoDiv.append(artifactPair);
        selectedInfoDiv.append(namePair);
        selectedInfoDiv.append(typePair);
        selectedInfoDiv.append(outNeighborsPair);
        selectedInfoDiv.append(inNeighborsPair);
        selectedInfoDiv.append(independence);
        selectedInfoDiv.append(idPair);
        selectedInfoDiv.append(addictByTypes);
        return;
    }

    /**
     * displays all related entities of the special relation type
     * @param {HTMLElement} selectedRelationType
     */
    createToggleInfoForReletedEntities(selectedRelationType){
        console.log(selectedRelationType.data('entityids'));
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
        let allEntitiesWithInfo = this.uiFilterAndInfoViewManager.getEntityInfos(allEntities);
        let allEntityAttributes = ViewRegister.getEntityAttributes();

        if(allEntities.length < 6){
            let accordion = UiElementLib.getAccordionDiv();
            for(let i=0; i<allEntities.length; i++){
                let entityInfo = allEntitiesWithInfo[allEntities[i]];
                let content = document.createElement('div');

                for(let ii=0; ii<allEntityAttributes.length; ii++){
                    let element = UiElementLib.getKeyValuePair(allEntityAttributes[ii], entityInfo[allEntityAttributes[ii]]);
                    content.append(element);
                }

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