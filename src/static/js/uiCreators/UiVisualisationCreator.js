let uiVisualisationCreator = null;

class UiVisualisationCreator{

    constructor() {
        if(uiVisualisationCreator){
            return uiVisualisationCreator;
        } else {
            this.networkgraphCreator = new NetworkgraphCreator();
            // single visualisation for both artifacts
            this.neighborTypChartCreator = new NeighborBarchartCreator();

            // visualisation for each artifact
            this.sankeyDiagramCreators = new Object();
            this.networkgraphCreators = new Object();
            uiVisualisationCreator = this;
        }
    }

    visualizeBaseInformations(arrayWithJsons){
        console.log('UiVisualisationCreator - visualizeNetworkGraph');
        // add loading spinner to visualisation
        $('#visualisation').append(UiElementLib.getLoadingSpinner());

    }

    visualizeView(viewName, array){
        console.log(array.artifactName);
        let artifact = array.artifactName;
        switch (viewName) {
            case ViewRegister.getNeighborBarchartName():
                this.neighborTypChartCreator.visualizeNeighborChart(array);
                return;

            case ViewRegister.getNetworkViewName():
                if(this.networkgraphCreators[artifact] == undefined) {
                    this.networkgraphCreators[artifact] = new NetworkgraphCreator();
                }
                this.networkgraphCreators[artifact].visualizeNetworkGraph(array);
                return;

            case ViewRegister.getSankeyDiagramName():
                if(this.sankeyDiagramCreators[artifact] == undefined){
                    this.sankeyDiagramCreators[artifact] = new SankeyDiagram();
                }
                this.sankeyDiagramCreators[artifact].visualizeSankeyDiagram(array);
                return;
            default:
                this.onError('View Finding Error', 'Can not find visualization for: ' + viewName);
        }
    }

    entitySelected(elementId, artifact){
        this.neighborTypChartCreator.highlightNodeAndLinks(elementId, artifact);

        // start selection for network
        if(this.networkgraphCreators[artifact] != undefined) {
            this.networkgraphCreators[artifact].highlightNodeAndLinks(elementId, artifact);
        }

        // start selection for sankey
        if(this.sankeyDiagramCreators[artifact] != undefined) {
            this.sankeyDiagramCreators[artifact].highlightNodeAndLinks(elementId, artifact);
        }
    }

    highlightSelection(deselectionList){
        this.neighborTypChartCreator.highlightSelection(deselectionList);

        // deselect on all networks
        for(let network in this.networkgraphCreators){
            this.networkgraphCreators[network].highlightSelection(deselectionList);
        }

        // todo: for sankey
    }

    onError(title, message){
        // TODO: ein zentrales Alert
        let text = title + 'inside FilteredDataCollector: \n' + message;
        console.error(text);
        return;
    }
}