class UiFilterAndInfoViewCreatorFactory{

    static createUiFilterCreator(artefactName, originJsonReference){
        switch (artefactName) {
            case 'Requirements':
                return new UiFilterAndInfoViewCreatorArtefact(artefactName, originJsonReference);
                break;

            case 'SourceCode':
                return new UiFilterAndInfoViewCreatorArtefact(artefactName, originJsonReference);
                break;

            default:
                this.onError('Matching Error', 'could not find correct UiFilterAndInfoViewCreatorFactory for: ' + artefactName);
        }
    }

    static onError(title, message){
        // TODO: ein zentrales Alert
        let text = title + 'inside UiFilterAndInfoViewCreatorFactory: \n' + message;
        console.error(text);
    }
    // TODO: artefactNames als zentrales Enum
}