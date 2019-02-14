let uiVisualisationCreator = null;

class UiVisualisationCreator{

    constructor() {
        if(uiVisualisationCreator){
            return uiVisualisationCreator;
        } else {
            this.networkgraphCreator = new NetworkgraphCreator();
            uiVisualisationCreator = this;
        }
    }

    visualizeBaseInformations(arrayWithJsons){
        console.log('UiVisualisationCreator - visualizeNetworkGraph');
        console.log(arrayWithJsons);
        // add loading spinner to visualisation
        $('#visualisation').append(UiElementLib.getLoadingSpinner());

    }

    visualizeView(viewName, array){
        switch (viewName) {
            case ViewRegister.getNetworkViewName():
                this.networkgraphCreator.visualizeNetworkGraph(array);
                return;
            default:
                this.onError('View Finding Error', 'Can not find visualization for: ' + viewName);
        }
    }

    highlightSelection(deselectionList){
        // select all
        $('svg').find('.deselect').removeClass('deselect');
        // deselect selection2
        if(deselectionList.length > 0){
            for(let i=0; i<deselectionList.length; i++){
                $('svg').find( '.' + deselectionList[i] ).addClass('deselect');
            }
        }
    }

    onError(title, message){
        // TODO: ein zentrales Alert
        let text = title + 'inside FilteredDataCollector: \n' + message;
        console.error(text);
        return;
    }
}