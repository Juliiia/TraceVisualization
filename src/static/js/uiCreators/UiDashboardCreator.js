let uiDashboardCreator = null
class UiDashboardCreator{

    constructor() {
        if(!uiDashboardCreator){
            this.entityAndRelationTypesManager = new EntityAndRelationTypeManager();
            uiDashboardCreator = this;
        } else {
            return uiDashboardCreator;
        }

    }

    createArtifactInfoView(artifactName, nrOfNodes, nrOfLinks){
        console.log('UiDashboardCreator - createArtifactInfoView');
        let parentElement = $('#artifactInformationView');
        let newChildElement = UiElementLib.getDashboardElementSubsection(artifactName);

        // clean existing Information
        UiElementLib.removeChildElementIfExists(parentElement, 'div.' + artifactName);

        let titleElement = UiElementLib.getSectionTitle(artifactName);
        let nodesInfoElement = UiElementLib.getKeyValuePair('Entities', nrOfNodes);
        let linksInfoElement = UiElementLib.getKeyValuePair('Links', nrOfLinks);

        newChildElement.append(titleElement);
        newChildElement.append(nodesInfoElement);
        newChildElement.append(linksInfoElement);
        parentElement.append(newChildElement);
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
        let selectedInfoDiv = $('#selectedNodeInformationView').empty();

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
                console.log(key);
                console.log(value);
                let text = key + ' (' + value.length + ')';
                let id = UiElementLib.getGlobalLinkFilterId(selectedElement.data('artifact'), key);
                let label = UiElementLib.getLabelWithCustomColor(text, id, null, that.entityAndRelationTypesManager.getColorOfType(key));
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

}