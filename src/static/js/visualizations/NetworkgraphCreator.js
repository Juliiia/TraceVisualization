class NetworkgraphCreator{

    constructor(){
        this.entityAndRelationTypeManager = new EntityAndRelationTypeManager();
        this.parentElement = $('#visualisation');
    }

    visualizeNetworkGraph(arrayWithJsons){
        // TODO: clean svg
        this.removeChildElementIfExists(this.parentElement, '.loader');
        // create new
        console.log('UiVisualisationCreator - visualizeNetworkGraph');
        console.log(arrayWithJsons);

        this.createGraph(arrayWithJsons);
        return;
    }

    createGraph(array){
        console.log('UiVisualisationCreator - createGraph');

        let artifactName = array.artifactName;
        let entities = array.baseInfo.entities;
        let links = array.baseInfo.links;
        let entityCoordinatesMap = array.viewInfo;

        // create parent svg and title
        let childDiv = document.createElement('div');
        childDiv.setAttribute('id', 'svgDiv' + artifactName);

        let childId = UiElementLib.getSVGId(artifactName);

        // clean old
        this.removeChildElementIfExists(this.parentElement, '#' + childId);

        let svgElement = UiElementLib.getSVGTag(childId, 1000, 800);

        // create group for each artifact json
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("id", artifactName);

        // create node for each entity
        let nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        nodeGroup.setAttribute("class", 'entities');
        for(let i=0; i < entities.length; i++ ){
            let circle = this.drawNode(entities[i], artifactName, entityCoordinatesMap[entities[i].id]);
            nodeGroup.append(circle);
        }

        // creat line for each link
        let linkGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        let markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        linkGroup.setAttribute("class", 'links');
        for(let i=0; i < links.length; i++){
            let id = links[i].sourceId + links[i].relation + links[i].targetId;

            let link = this.drawLine(id, artifactName, links[i], entityCoordinatesMap[links[i].sourceId], entityCoordinatesMap[links[i].targetId])
            let arrow = this.drawArrow(id);
            markerGroup.append(arrow);
            linkGroup.append(link);
        }

        // create Title
        let sectionTitle = document.createElement('div');
        sectionTitle.setAttribute('class', 'paddingSmall');

        // append all
        sectionTitle.append(UiElementLib.getSectionTitle(artifactName + ' ' + ViewRegister.getNetworkViewTitle()));
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

    drawNode(json, artifactName, coordinatesInfo){
        let cicleClass = artifactName + '_entities_type_' + json.type;
        let circles = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circles.setAttribute("cx", coordinatesInfo.x);
        circles.setAttribute("cy", coordinatesInfo.y);
        circles.setAttribute('fill', this.entityAndRelationTypeManager.getColorOfType(json.type));
        circles.setAttribute('fill-opacity', 1);
        circles.setAttribute('class', cicleClass);

        circles.setAttribute('data-name', json.name);
        circles.setAttribute('data-neighbors', coordinatesInfo.neighbors);
        circles.setAttribute('data-type', json.type);
        circles.setAttribute('data-id', json.id);
        circles.setAttribute('data-artifact', artifactName);

        let radius = coordinatesInfo.neighbors * 0.5;
        if(radius < 1){
            radius = 1;
        } else if(radius > 6){
            radius = 6;
        }

        circles.setAttribute("r", radius);
        circles.addEventListener('click', handleNodeClick);

        return circles;
    }

    drawLine(id, artifactName, json, sourceCoordinates, targetCoordinates){
        let lineClass= artifactName + '_links_relation_' + json.relation;
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', sourceCoordinates.x);
        line.setAttribute('y1', sourceCoordinates.y);
        line.setAttribute('x2', targetCoordinates.x);
        line.setAttribute('y2', targetCoordinates.y);
        line.setAttribute('y2', targetCoordinates.y);
        line.setAttribute('stroke', 'black');
        line.setAttribute('stroke-width', 0.2);
        line.setAttribute('class', lineClass);
        line.setAttribute('marker-end', 'url(#'+ id +')');
        return line;
    }

    drawArrow(id){
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M0,0 L0,6 L9,3 z');
        path.setAttribute('fill', 'black');
        let arrow = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        arrow.setAttribute('id', id);
        arrow.setAttribute('markerWidth', 10);
        arrow.setAttribute('markerHeight', 10);
        arrow.setAttribute('refX', 14);
        arrow.setAttribute('refY', 3);
        arrow.setAttribute('orient', 'auto');
        arrow.setAttribute('markerUnits', 'strokeWidth');
        arrow.append(path);
        return arrow;
    }

    removeChildElementIfExists(parentElement, childSelector){
        console.log('Remove ' + parentElement.find(childSelector).length);
        if(parentElement.find(childSelector).length !== 0){
            parentElement.find(childSelector).remove();
        }
    }

}