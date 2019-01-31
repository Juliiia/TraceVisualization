class UiVisualisationCreator{

    static visualizeNetworkGraph(arrayWithJsons){
        console.log('# UiVisualisationCreator - visualizeNetworkGraph');
        console.log(arrayWithJsons);
        if(arrayWithJsons.length > 0){
            for(let i=0; i < arrayWithJsons.length; i++){
                this.createGrap(arrayWithJsons[i][1], arrayWithJsons[i][0]);
            }
        }
    }

    static createGrap(jsonData, artefactName){
        let entities = jsonData.entities;

        // create group
        let parentSelector = $('#svgVis');
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("id", artefactName);
        group.setAttribute('class', 'svg-pan-zoom_viewport');


        for(let i=0; i < entities.length; i++ ){
            let circle = this.drawNode(entities[i]);
            group.append(circle);
        }
        parentSelector.append(group);

        // pan-zoom
        let panZoomInstance = svgPanZoom('#svgVis', {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true,
            minZoom: 0.1
          });

    }

    static drawNode(json){
        let circles = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circles.setAttribute("cx", json.coordinates.x);
        circles.setAttribute("cy", json.coordinates.y);
        circles.setAttribute('fill', '#0000FF');
        circles.setAttribute("r",2);
        return circles;
    }

}