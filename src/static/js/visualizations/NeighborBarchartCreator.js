class NeighborBarchartCreator {

    constructor(){
        this.entityAndRelationTypeManager = new EntityAndRelationTypeManager();
        this.parentElement = $('#neighborVisualisation');
    }

    visualizeNeighborChart(arrayWithJsons){
        let svgId = 'neighborSVG';

        // clean
        UiElementLib.removeChildElementIfExists(this.parentElement, '#' + svgId);
        this.parentElement.empty();

        // add title
        let title = UiElementLib.getSectionTitle('Neighbor Visualization');
        this.parentElement.append(title);

        // add dropdown for sorting
        let dropdown = UiElementLib.getDropdownElement('Sort by', ViewRegister.getNeighborBarchartSortOptions(), neighborBarChartSortSelectionState, 'neighborBarChartSortSelection', dropdownClicked);
        this.parentElement.append(dropdown);

        // add SVG Tag
        let svgElement = UiElementLib.getSVGTag(svgId, null,1200, 1000);
        this.parentElement.append(svgElement);
        // add listener to have the print option
        svgElement.addEventListener('contextmenu', openContextMenu);

        let that  = this;
        $.each(arrayWithJsons, function (key, value) {
            that.createBarchart(value, svgElement);
        });

        // pan-zoom
        let panZoomInstance = svgPanZoom('#' + svgId, {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true,
            minZoom: 0.1
          });
    }

    createBarchart(array, svg){

        let baseInfoEntities = array['baseInfo']['entities'];
        let baseInfoLinks = array['baseInfo']['links'];
        let coordinates = array['viewInfo'];

        let types = array['viewInfo']['info']['selectedType'].split(',');
        let entitySize = array['viewInfo']['info']['entitySize'];
        let spaceBetweenEntities = array['viewInfo']['info']['spaceBetweenEntitiesSize'];
        let spaceBetweenArtifacts = array['viewInfo']['info']['spaceBetweenArtifactsSize'];
        let maxNrOfRelations = array['viewInfo']['info']['max'];
        let minNrOfRelations = array['viewInfo']['info']['min'];

        // draw middle scale
        let scale = this.drawMiddleLine(spaceBetweenArtifacts, maxNrOfRelations, minNrOfRelations, entitySize, spaceBetweenEntities);
        svg.append(scale);

        let displayedNodeIds = [];

        // create Nodes
        let nodeGroup = UiElementLib.getSVGGroup('nodeGroup', null);
        for(let i=0; i<baseInfoEntities.length; i++){
            if(types.indexOf(baseInfoEntities[i]['type']) > -1){
                displayedNodeIds.push(baseInfoEntities[i]['id']);
                let node = this.drawNode(baseInfoEntities[i], coordinates[baseInfoEntities[i]['id']], entitySize);
                nodeGroup.append(node);
            }
        }

        // create links
        let linkGroup = UiElementLib.getSVGGroup('linkGroup', null);
        let markerGroup = UiElementLib.getSVGGroup('markerGroup', null);
        for(let i=0; i<baseInfoLinks.length; i++) {

            if(displayedNodeIds.indexOf(baseInfoLinks[i]['sourceId']) > -1 && displayedNodeIds.indexOf(baseInfoLinks[i]['targetId']) > -1){
                let linkClass = UiElementLib.getGlobalLinkFilterId(baseInfoLinks[i]['artifact'], baseInfoLinks[i]['relation'], baseInfoLinks[i]['sourceId'], baseInfoLinks[i]['targetId']);
                let arrowId = UiElementLib.getGlobalArrowId(baseInfoLinks[i]['sourceId'], baseInfoLinks[i]['relation'], baseInfoLinks[i]['targetId']);
                // create Link
                let link = UiElementLib.getSVGCurveElement(coordinates[baseInfoLinks[i]['sourceId']], coordinates[baseInfoLinks[i]['targetId']], linkClass);
                link.setAttribute('marker-end', 'url(#'+ arrowId +')');
                linkGroup.append(link);

                // create arrow
                let arrow = UiElementLib.getSVGArrow(arrowId, entitySize, linkClass);
                markerGroup.append(arrow);
            }
        }

        svg.append(linkGroup);
        svg.append(markerGroup);
        svg.append(nodeGroup);
    }

    drawNode(json, coordinatesInfo, radius){
        let circleClass = UiElementLib.getGlobalEntityFilterId(json.artifact, json.id, json.type);
        let circles = UiElementLib.getSVGCircleElement(json, coordinatesInfo, circleClass, radius, this.entityAndRelationTypeManager.getColorOfType(json['type']));
        circles.addEventListener('click', handleNodeClick);
        return circles;
    }

    drawMiddleLine(spaceBetweenArtifacts, maxRelations, minRelations, sizeOfEntity, space) {
        let scaleGroup = UiElementLib.getSVGGroup('scaleGroup');
        let x = spaceBetweenArtifacts/2;

        let sourceCoordinates = new Object();
        sourceCoordinates.x = x;
        sourceCoordinates.y = -minRelations;

        let targetCoordinates = new Object();
        targetCoordinates.x = x;
        targetCoordinates.y = -maxRelations * (sizeOfEntity + space);

        let line = UiElementLib.getSVGLineElement(sourceCoordinates, targetCoordinates, 'neighborScale');
        scaleGroup.append(line)
        // add scale
        let parts = 10;
        let spaceBetween = targetCoordinates.y / parts;
        let counter = maxRelations / parts;

        for(let p = 0; p < parts; p++){
            let textNode = UiElementLib.getSVGTextElement(x-5,p*spaceBetween, Math.round(p*counter));
            scaleGroup.append(textNode);
        }

        return scaleGroup;
    }

    highlightSelection(deselectionList){
        // select all
        this.parentElement.find('.deselect').removeClass('deselect');
        // deselect selection2
        if(deselectionList.length > 0){
            for(let i=0; i<deselectionList.length; i++){
                this.parentElement.find( '.' + deselectionList[i] ).addClass('deselect');
            }
        }
    }

    highlightNodeAndLinks(elementId, artifact){
        this.parentElement.find('.clicked').removeClass('clicked');
        this.parentElement.find('.dependentClicked').removeClass('dependentClicked');

        // mark node
        let nodeId = UiElementLib.getGlobelEntityId(artifact, elementId);
        this.parentElement.find('.' + nodeId).addClass('clicked');

        // mark dependent links
        let sourceNodeId = UiElementLib.getGlobalLinkSourceEntityId(elementId);
        let targetNodeId = UiElementLib.getGlobalLinkTargetEntityId(elementId);
        this.parentElement.find('.' + targetNodeId).addClass('clicked');

        let linksToTarget = this.parentElement.find('.' + sourceNodeId);
        if(linksToTarget.length > 0){
            for(let i=0; i<linksToTarget.length; i++){
                let classes = linksToTarget[i].className.baseVal.split(/\s+/);
                for(let ii=0; ii<classes.length; ii++){
                    if(classes[ii].includes('to_')){
                        // get id
                        let id = classes[ii].split('_')[1];
                        id = UiElementLib.getGlobelEntityId(artifact, id);
                        this.parentElement.find('.' + id).addClass('dependentClicked');
                    }
                }
            }
        }
        linksToTarget.addClass('clicked');

        return;
    }
}