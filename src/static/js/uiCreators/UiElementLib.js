class  UiElementLib {

    static getSectionTitle(title){
        let element = document.createElement('span');
        element.setAttribute('class', 'sectionTitle');
        element.append(title);
        return element;
    }

    static getSubSectionTitle(title){
        let element = document.createElement('span');
        element.setAttribute('class', 'subSectionTitle');
        element.append(title);
        return element;
    }

    static getDashboardElementSubsection(className){
        let element = document.createElement('div');
        element.setAttribute('class', className + ' subElement');
        return element;
    }

        static getKeyValuePair(text, number){
        let element = document.createElement('div');
        element.setAttribute('class', 'keyValuePair');
        element.append(text + ': ');

        let value = document.createElement('span');
        value.setAttribute('class', 'valueOfKey');
        value.append(number);

        element.append(value);
        return element;
    }

    static getLabel(text, id, eventlListener) {
        let element = document.createElement('a');
        element.setAttribute('class', 'ui label active');
        element.setAttribute('id', id);
        element.append(text);
        if(eventlListener){
            element.addEventListener('click', eventlListener);
        }
        return element;
    }

    static getLabelWithCustomColor(text, id, eventListener, colorCode) {
        let element = this.getLabel(text, id, eventListener);
        element.style.backgroundColor = colorCode;
        return element;
    }

    static getColorPickerInput(id, defaultColor){
        let element = document.createElement('input');
        element.setAttribute('type', 'color');
        element.setAttribute('class', 'colorPicker');
        element.setAttribute('id', id);
        element.setAttribute('value', defaultColor);
        return element;
    }

    static getTextAreaInput(id, defaultText){
        let element = document.createElement('textarea');
        element.setAttribute('id', id);
        element.setAttribute('row', 2);
        element.value = defaultText;
        return element;
    }

    static getBeginOfLineLabel(text){
        let element = document.createElement('div');
        element.setAttribute('class', 'beginOfLineLabel');
        element.append(text);
        return element;
    }

    static getSVGTag(id, width, height){
        let element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        element.setAttribute('id', id);
        element.setAttribute('width', width);
        element.setAttribute('height', height);
        return element;
    }

    static getSpacer(){
        let element = document.createElement('div');
        element.setAttribute('class', 'space');
        return element;
    }

    // special names & ids

    static getGlobalEntityFilterId(artifactName, localId){
        return artifactName + '_entities_type_' + localId;
    }

    static getGlobalLinkFilterId(artifactName, localId){
        return artifactName + '_links_relation_' + localId;
    }

    static getSVGId(artifactName){
        return 'svg' + artifactName;
    }
}