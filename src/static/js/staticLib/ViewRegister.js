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
        attributes.push('outgoingrelations');
        attributes.push('incomingrelations');
        attributes.push('independence');
        attributes.push('id');
        return attributes;
    }

    static getEntityWithLinkAttributes(){
        let attributes = ViewRegister.getEntityAttributes();
        attributes.push('approved');
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
        options.push('outgoingrelations');
        options.push('incomingrelations');
        options.push('independence');
        return options;
    }

    static getNeighborBarchartSortDefaultOption(){
        return 'outgoingrelations';
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