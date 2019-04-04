class UiFilterAndInfoViewCreatorFactory{

    static createUiFilterCreator(artefactName, originJsonReference){
        switch (artefactName) {
            case 'Requirements':
                console.log('create Requ filterandinfoview');
                return new UiFilterAndInfoViewCreatorArtefact(artefactName, originJsonReference);
                break;

            case 'SourceCode':
                console.log('create Sourcecode filterandinfoview');
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