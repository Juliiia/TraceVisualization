class  ViewRegister {

    // ARTIFACTS ------------------------------------------------------

    static getReqArtifactName(){
        return 'Requirements';
    }

    static getSourceCodeArtifactName(){
        return 'SourceCode';
    }

    static getEntityAttributes(){
        let attributes = [];
        attributes.push('artifact');
        attributes.push('name');
        attributes.push('type');
        attributes.push('outgoingRelations');
        attributes.push('incomingRelations');
        attributes.push('independence');
        attributes.push('id');
        return attributes;
    }

    // NETWORK VIEW ------------------------------------------------------

    static getNetworkViewName(){
        return 'Networkgraph';
    }
    static getNetworkViewTitle(){
        return 'Networkgraph';
    }

    // NEIGHBOR BARCHART ------------------------------------------------------

    static getNeighborBarchartName(){
        return 'NeighborBarchart'
    }

    static getNeighborBarchartSortOptions(){
        let options = [];
        options.push('outgoingRelations');
        options.push('incomingRelations');
        options.push('independence');
        return options;
    }

    static getNeighborBarchartSortDefaultOption(){
        return 'outgoingRelations';
    }

    // SANKEY DIAGRAM ------------------------------------------------------

    static getSankeyDiagramName(){
        return 'SankeyDiagram'
    }

    static getSankeyDiagramTitle(){
        return 'Sankey Diagram'
    }

    // ------------------------------------------------------

    static isSingleArtifactView(artifactName){
        switch (artifactName) {
            case this.getNetworkViewName():
                return true;
            case this.getNeighborBarchartName():
                return false;
            case this.getSankeyDiagramName():
                return true;
        }
    }
}