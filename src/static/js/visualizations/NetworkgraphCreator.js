class NetworkgraphCreator{

    constructor(){
        this.entityAndRelationTypeManager = new EntityAndRelationTypeManager();
        this.parentElement = $('#visualisation');
    }

    visualizeNetworkGraph(arrayWithJsons){
        UiElementLib.removeChildElementIfExists(this.parentElement, '.loader');
        // create new
        this.createGraph(arrayWithJsons);
        return;
    }

    createGraph(array){
        console.log('UiVisualisationCreator - createGraph');

        let artifactName = array.artifactName;
        let entities = array.baseInfo.entities;
        let links = array.baseInfo.links;
        let entityCoordinatesMap = array.viewInfo;
        let nodesWithRadius = new Object();

        // create parent svg and title
        let childDiv = UiElementLib.getHalfWidthDiv('svgDiv' + ViewRegister.getNetworkViewName() + artifactName, null);

        let childId = UiElementLib.getSVGId(artifactName);

        // clean old
        UiElementLib.removeChildElementIfExists(this.parentElement, '#' + childId);

        let svgElement = UiElementLib.getSVGTag(childId, null,900, 800);
        // add listener to have the print option
        svgElement.addEventListener('contextmenu', openContextMenu);

        // create group for each artifact json
        let group = UiElementLib.getSVGGroup('artifactGroup', artifactName);

        // create node for each entity
        let nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        nodeGroup.setAttribute("class", 'entities');
        for(let i=0; i < entities.length; i++ ){
            let radius = this.calculateRadius(entities[i]['outgoingrelations']);
            let circle = this.drawNode(entities[i], entityCoordinatesMap[entities[i]['id']], radius);
            nodesWithRadius[entities[i]['id']] = radius;
            nodeGroup.append(circle);
        }

        // creat line for each link
        let linkGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        let markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        linkGroup.setAttribute("class", 'links');
        for(let i=0; i < links.length; i++){
            let id = UiElementLib.getGlobalArrowId(links[i]['sourceId'], links[i]['relation'], links[i]['targetId']);
            let lineClass= UiElementLib.getGlobalLinkFilterId(artifactName, links[i]['relation'], links[i]['sourceId'], links[i]['targetId']) + ' smallSvgLines';

            let link = this.drawLine(id, artifactName, links[i], entityCoordinatesMap[links[i]['sourceId']], entityCoordinatesMap[links[i]['targetId']], lineClass);
            // get radius to find the right place for arrows
            let radius = 3;
            if(nodesWithRadius[links[i]['targetId']]){
                radius = nodesWithRadius[links[i]['targetId']];
            }
            let arrow = UiElementLib.getSVGArrow(id, radius, lineClass);
            markerGroup.append(arrow);
            linkGroup.append(link);
        }

        // append all
        let sectionTitle = UiElementLib.getSectionTitle(artifactName + ' ' + ViewRegister.getNetworkViewTitle());
        this.parentElement.append(childDiv);
        childDiv.append(sectionTitle);
        childDiv.append(svgElement);
        group.append(linkGroup);
        group.append(markerGroup);
        group.append(nodeGroup);
        svgElement.append(group);


        // pan-zoom
        let panZoomInstance = svgPanZoom('#' + childId, {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true,
            minZoom: 0.1
          });

        return true;
    }

    calculateRadius(nrOfOutgoingLinks){
        let radius = nrOfOutgoingLinks * 0.5;
        if(radius < 1){
            radius = 1;
        } else if(radius > 6){
            radius = 6;
        }
        return radius
    }

    drawNode(json, coordinatesInfo, radius){
        let circleClass = UiElementLib.getGlobalEntityFilterId(json.artifact, json.id, json.type);

        let circles = UiElementLib.getSVGCircleElement(json, coordinatesInfo, circleClass, radius, this.entityAndRelationTypeManager.getColorOfType(json['type']));

        circles.addEventListener('click', handleNodeClick);

        return circles;
    }

    drawLine(id, artifactName, json, sourceCoordinates, targetCoordinates, className){
        let line = UiElementLib.getSVGLineElement(sourceCoordinates, targetCoordinates, className);
        line.setAttribute('marker-end', 'url(#'+ id +')');
        return line;
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

        // mark node
        let nodeId = UiElementLib.getGlobelEntityId(artifact, elementId);
        this.parentElement.find('.' + nodeId).addClass('clicked');

        // mark dependent links
        let sourceNodeId = UiElementLib.getGlobalLinkSourceEntityId(elementId);
        let targetNodeId = UiElementLib.getGlobalLinkTargetEntityId(elementId);
        this.parentElement.find('.' + sourceNodeId).addClass('clicked');
        this.parentElement.find('.' + targetNodeId).addClass('clicked');
        return;
    }
}