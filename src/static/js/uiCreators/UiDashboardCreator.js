class UiDashboardCreator{

    constructor() {
        this.entityAndRelationTypesManager = new EntityAndRelationTypeManager();
    }

    createArtifactInfoView(artifactName, nrOfNodes, nrOfLinks){
        console.log('UiDashboardCreator - createArtifactInfoView');
        let parentElement = $('#artifactInformationView');
        let newChildElement = UiElementLib.getDashboardElementSubsection(artifactName);

        // clean existing Information
        this.removeChildElementIfExists(parentElement, 'div.' + artifactName);

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
        this.removeChildElementIfExists(parentElement, 'div.' + artifactName);

        let titleElement = UiElementLib.getSectionTitle(artifactName + ' Color Legend');

        let subSectionEntities = UiElementLib.getDashboardElementSubsection('entityTypes');
        let subTitleEntity = UiElementLib.getSubSectionTitle('Entity Types: ');

        subSectionEntities.append(subTitleEntity);

        // append labels for entity types
        $.each(nodetypes, function (key, nr) {
            console.log(key);
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

    removeChildElementIfExists(parentElement, childSelector){
        if(parentElement.find(childSelector).length !== 0){
            parentElement.find(childSelector).remove();
        }
    }

}