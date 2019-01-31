class UiFilterCreatorFactory{

    static createUiFilterCreator(artefactName, originJsonReference){
        switch (artefactName) {
            case 'Requirements':
                return new UiFilterCreatorArtefact(artefactName, originJsonReference);
                break;
            default:
                this.onError('Matching Error', 'could not find correct UiFilterCreatorFactory for: ' + artefactName);
        }
    }

    static onError(title, message){
        // TODO: ein zentrales Alert
        let text = title + 'inside UiFilterCreatorFactory: \n' + message;
        console.error(text);
    }
    // TODO: artefactNames als zentrales Enum
}