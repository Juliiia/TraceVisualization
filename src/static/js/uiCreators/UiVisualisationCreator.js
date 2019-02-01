class UiVisualisationCreator{

    static visualizeNetworkGraph(arrayWithJsons){
        // TODO: clean svg

        // create new
        console.log('# UiVisualisationCreator - visualizeNetworkGraph');
        if(arrayWithJsons.length > 0){
            for(let i=0; i < arrayWithJsons.length; i++){
                this.createGraph(arrayWithJsons[i][1], arrayWithJsons[i][0]);
            }
        }
        return;
    }

    static createGraph(jsonData, artefactName){
        let entities = jsonData.entities;
        let links = jsonData.links;
        let entityCoordinatesMap = new Object();

        // create group for each artifact json
        let parentSelector = $('#svgVis');
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("id", artefactName);

        // create node for each entity
        let nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        nodeGroup.setAttribute("class", 'entities');
        for(let i=0; i < entities.length; i++ ){
            entityCoordinatesMap[entities[i].id] = entities[i].coordinates;
            let circle = this.drawNode(entities[i]);
            nodeGroup.append(circle);
        }

        // creat line for each link
        let linkGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        let markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        linkGroup.setAttribute("class", 'links');
        for(let i=0; i < links.length; i++){
            let id = links[i].sourceId + links[i].relation + links[i].targetId;

            let link = this.drawLine(id, links[i], entityCoordinatesMap[links[i].sourceId], entityCoordinatesMap[links[i].targetId])
            let arrow = this.drawArrow(id);
            markerGroup.append(arrow);
            linkGroup.append(link);
        }

        group.append(linkGroup);
        group.append(markerGroup);
        group.append(nodeGroup);
        parentSelector.append(group);

        // pan-zoom
        let panZoomInstance = svgPanZoom('#svgVis', {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true,
            minZoom: 0.1
          });

        return;
    }

    static drawNode(json){
        let circles = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circles.setAttribute("cx", json.coordinates.x);
        circles.setAttribute("cy", json.coordinates.y);
        circles.setAttribute('fill', '#0000FF');
        circles.setAttribute("r",1);
        return circles;
    }

    static drawLine(id, json, sourceCoordinates, targetCoordinates){
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', sourceCoordinates.x);
        line.setAttribute('y1', sourceCoordinates.y);
        line.setAttribute('x2', targetCoordinates.x);
        line.setAttribute('y2', targetCoordinates.y);
        line.setAttribute('y2', targetCoordinates.y);
        line.setAttribute('stroke', 'black');
        line.setAttribute('stroke-width', 0.2);
        line.setAttribute('marker-end', 'url(#'+ id +')');
        return line;
    }

    static drawArrow(id){
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M0,0 L0,6 L9,3 z');
        path.setAttribute('fill', 'black');
        let arrow = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        arrow.setAttribute('id', id);
        arrow.setAttribute('markerWidth', 10);
        arrow.setAttribute('markerHeight', 10);
        arrow.setAttribute('refX', 0);
        arrow.setAttribute('refY', 3);
        arrow.setAttribute('orient', 'auto');
        arrow.setAttribute('markerUnits', 'strokeWidth');
        arrow.append(path);
        return arrow;
    }

}