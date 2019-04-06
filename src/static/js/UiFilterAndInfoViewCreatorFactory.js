let uiFilterAndInfoViewCreatorFactory = null;

class UiFilterAndInfoViewCreatorFactory{

    constructor(){
        if(!uiFilterAndInfoViewCreatorFactory){
            uiFilterAndInfoViewCreatorFactory = this;
            this.uiFilterAndInfoViewCreater_Requirements = null;
            this.uiFilterAndInfoViewCreater_SourceCode = null;
        }else{
            return uiFilterAndInfoViewCreatorFactory;
        }
    }

    createUiFilterCreator(artifactName, originJsonReference){
        switch (artifactName) {
            case 'Requirements':
                if(!this.uiFilterAndInfoViewCreater_Requirements){
                    this.uiFilterAndInfoViewCreater_Requirements = new UiFilterAndInfoViewCreatorArtefact(artifactName, originJsonReference);
                }
                return this.uiFilterAndInfoViewCreater_Requirements;
                break;

            case 'SourceCode':
                if(!this.uiFilterAndInfoViewCreater_SourceCode) {
                    this.uiFilterAndInfoViewCreater_SourceCode = new UiFilterAndInfoViewCreatorArtefact(artifactName, originJsonReference);
                }
                return this.uiFilterAndInfoViewCreater_SourceCode;
                break;

            default:
                this.onError('Matching Error', 'could not find correct UiFilterAndInfoViewCreatorFactory for: ' + artifactName);
        }
        return;
    }

    getExistingCreatorByArtifact(artifactName){
        switch (artifactName) {
            case 'Requirements':
                if(!this.uiFilterAndInfoViewCreater_Requirements){
                    return null;
                }else{
                    return this.uiFilterAndInfoViewCreater_Requirements;
                }
                break;
            case 'SourceCode':
                if(!this.uiFilterAndInfoViewCreater_SourceCode) {
                    return null;
                }else{
                    return this.uiFilterAndInfoViewCreater_SourceCode;
                }
                break;
            default:
                return null;
        }
        return;
    }

    static onError(title, message){
        // TODO: ein zentrales Alert
        let text = title + 'inside UiFilterAndInfoViewCreatorFactory: \n' + message;
        console.error(text);
        return;
    }
    // TODO: artefactNames als zentrales Enum
}