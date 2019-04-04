let uiVisualisationCreator = null;

class UiVisualisationCreator{

    constructor() {
        if(uiVisualisationCreator){
            return uiVisualisationCreator;
        } else {
            this.networkgraphCreator = new NetworkgraphCreator();
            this.neighborTypChartCreator = new NeighborBarchartCreator();
            this.sankeyDiagramCreator = new SankeyDiagram();
            uiVisualisationCreator = this;
        }
    }

    visualizeBaseInformations(arrayWithJsons){
        console.log('UiVisualisationCreator - visualizeNetworkGraph');
        // add loading spinner to visualisation
        $('#visualisation').append(UiElementLib.getLoadingSpinner());

    }

    visualizeView(viewName, array){
        switch (viewName) {
            case ViewRegister.getNetworkViewName():
                this.networkgraphCreator.visualizeNetworkGraph(array);
                return;
            case ViewRegister.getNeighborBarchartName():
                this.neighborTypChartCreator.visualizeNeighborChart(array);
                return;
            case ViewRegister.getSankeyDiagramName():
                this.sankeyDiagramCreator.visualizeSankeyDiagram(array);
                return;
            default:
                this.onError('View Finding Error', 'Can not find visualization for: ' + viewName);
        }
    }

    entitySelected(elementId, artifact){
        this.neighborTypChartCreator.highlightNodeAndLinks(elementId, artifact);
        this.networkgraphCreator.highlightNodeAndLinks(elementId, artifact);
        this.sankeyDiagramCreator.highlightNodeAndLinks(elementId, artifact);
    }

    highlightSelection(deselectionList){
        this.networkgraphCreator.highlightSelection(deselectionList);
        this.neighborTypChartCreator.highlightSelection(deselectionList);
    }

    onError(title, message){
        // TODO: ein zentrales Alert
        let text = title + 'inside FilteredDataCollector: \n' + message;
        console.error(text);
        return;
    }
}