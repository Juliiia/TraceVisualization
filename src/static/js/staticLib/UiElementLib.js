class  UiElementLib {

    ////////////////////////////////////////////////////////////////
    // DASHBOARD ELEMENTS //////////////////////////////////////////
    ////////////////////////////////////////////////////////////////

    static getSectionTitle(title){
        let paddingDiv = document.createElement('div');
        paddingDiv.setAttribute('class', 'titleDiv');

        let element = document.createElement('span');
        element.setAttribute('class', 'sectionTitle');
        element.append(title);
        paddingDiv.append(element);

        return paddingDiv;
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

    /**
     * creates a div element with 50% width
     *
     * @param {String} id
     * @param {String} className
     * @returns {HTMLElement}
     */
    static getHalfWidthDiv(id, className){
        let element = document.createElement('div');
        element.setAttribute('id', id);
        let elementClass = 'halfWidth';
        if(className != null){
            elementClass = elementClass + ' ' + className;
        }
        element.setAttribute('class', elementClass);
        return element;
    }

    ////////////////////////////////////////////////////////////////
    // TEXT ELEMENTS ///////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////

    static getKeyValuePair(text, value){
        let element = document.createElement('div');
        element.setAttribute('class', 'keyValuePair');
        element.append(text + ': ');

        let valueElement = document.createElement('span');
        valueElement.setAttribute('class', 'valueOfKey');
        valueElement.append(value);

        element.append(valueElement);
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

    static getSpanWithClass(className){
        let element = document.createElement('span');
        element.setAttribute('class', className);
        return element;
    }

    static getBoldTextWithSpace(text){
        let element = document.createElement('span');
        element.setAttribute('class', 'bold spaceBeforeAfter');
        element.append(text);
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

    static getErrorDiv(message){
        let element = document.createElement('div');
        element.setAttribute('class', 'errorDiv');
        element.append(message);
        return element;
    }

    static getDropdownElement(title, options, startValue, idName, onClickListener){
        let element = document.createElement('div');
        element.setAttribute('id', idName);

        let subheaderElement = document.createElement('div');
        subheaderElement.setAttribute('class', 'ui sub header');
        subheaderElement.append(title);

        let selectElement = document.createElement('select');
        selectElement.setAttribute('class', 'ui fluid search dropdown');
        selectElement.setAttribute('data-parentid', idName);
        selectElement.addEventListener('click', onClickListener);

        for(let i=0; i<options.length; i++){

            let optionElement = document.createElement('option');
            optionElement.setAttribute('value', options[i]);
            optionElement.append(options[i]);

            if(options[i] == startValue){
                optionElement.setAttribute('selected', 'selected');
            }

            selectElement.append(optionElement);
        }

        element.append(subheaderElement);
        element.append(selectElement);

        return element;
    }

    static getSpacer(){
        let element = document.createElement('div');
        element.setAttribute('class', 'space');
        return element;
    }

    static getLoadingSpinner(){
        let element = document.createElement('div');
        element.setAttribute('class', 'loader');
        return element;
    }

    static getLoadingSpinnerWithInfo(info){
        let element = document.createElement('div');
        element.setAttribute('class', 'loaderWithInfo');

        let infoSpan = document.createElement('span');
        infoSpan.setAttribute('class', 'loadingInfo')
        infoSpan.append(info);

        element.append(this.getLoadingSpinner());
        element.append(infoSpan);
        return element;
    }

    /**
     * creates an accordion element.
     * Based on Semantic UI: https://semantic-ui.com/modules/accordion.html
     * @returns {HTMLElement} empty accordion
     */
    static getAccordionDiv(){
        let element = document.createElement('div');
        element.setAttribute('class', 'ui styled fluid accordion');
        return element;
    }

    /**
     * creates a element of an accordion and append it.
     * Based on Semantic UI: https://semantic-ui.com/modules/accordion.html
     * @param {HTMLElement} accordion
     * @param {String} title
     * @param {String || HTMLElement} content
     * @returns {HTMLElement} accordion with element
     */
    static getAccordionElement(accordion, title, content){
        // title
        let titleDiv = document.createElement('div');
        titleDiv.setAttribute('class', 'title');
        let icon = document.createElement('i');
        icon.setAttribute('class', 'dropdown icon')
        titleDiv.append(icon);
        titleDiv.append(title);
        accordion.append(titleDiv);

        // content
        let contentDiv = document.createElement('div');
        contentDiv.setAttribute('class', 'content');
        let p = document.createElement('p');
        p.setAttribute('class', 'transition hidden');
        p.append(content);
        contentDiv.append(p);
        accordion.append(contentDiv);

        return accordion;
    }

    ////////////////////////////////////////////////////////////////
    // SVG ELEMENTS ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////

    static getSVGTag(id, className, width, height){
        let element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        element.setAttribute('id', id);
        if(className != null){
            element.setAttribute('class', className);
        }
        element.setAttribute('width', width);
        element.setAttribute('height', height);
        return element;
    }

    static getSVGGroup(className, idName){
        let element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        element.setAttribute('class', className);
        if(idName != null){
            element.setAttribute('id', idName);
        }
        return element;
    }

    static getSVGCircleElement(entityInfoJson, coordinatesInfo, className, radius, color){
        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", coordinatesInfo.x);
        circle.setAttribute("cy", coordinatesInfo.y);
        circle.setAttribute('fill', color);
        circle.setAttribute('fill-opacity', 1);
        circle.setAttribute('class', className);

        circle.setAttribute('data-name', entityInfoJson['name']);
        circle.setAttribute('data-type', entityInfoJson['type']);
        circle.setAttribute('data-id', entityInfoJson['id']);
        circle.setAttribute('data-outrelations', entityInfoJson['outgoingRelations']);
        circle.setAttribute('data-inrelations', entityInfoJson['incomingRelations']);
        circle.setAttribute('data-artifact', entityInfoJson['artifact']);
        circle.setAttribute('data-addictbytypes', JSON.stringify(entityInfoJson['addictByTypes']));
        // circle.setAttribute('data-origin', entityInfoJson['origin']);
        // circle.setAttribute('data-responsible', entityInfoJson['responsible']);
        circle.setAttribute('data-independence', entityInfoJson['independence']);
        circle.setAttribute("r", radius);
        return circle;
    }

    static getSVGLineElement(sourceCoordinates, targetCoordinates, className){
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', sourceCoordinates.x);
        line.setAttribute('y1', sourceCoordinates.y);
        line.setAttribute('x2', targetCoordinates.x);
        line.setAttribute('y2', targetCoordinates.y);
        line.setAttribute('y2', targetCoordinates.y);
        line.setAttribute('class', className);
        return line;
    }

    static getSVGTextElement(x, y, text){
        let elementNS = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        elementNS.setAttribute('x', x);
        elementNS.setAttribute('y', y);
        elementNS.setAttribute('fill', 'black');
        elementNS.append(text);
        return elementNS;
    }

    static getSVGCurveElement(sourceCoordinates, targetCoordinates, className){
        let elementNS = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let div = 0;
        if(targetCoordinates.y > sourceCoordinates.y){
            div = sourceCoordinates.y + (targetCoordinates.y - sourceCoordinates.y)/2;
        } else {
            div = targetCoordinates.y + (sourceCoordinates.y - targetCoordinates.y)/2;
        }

        elementNS.setAttribute('d', 'M' + sourceCoordinates.x + ',' + sourceCoordinates.y + '  C'+targetCoordinates.x+',' + div + '  ' +targetCoordinates.x+ ',' + div + ' ' + targetCoordinates.x + ',' + targetCoordinates.y );
        elementNS.setAttribute('fill', 'none');
        elementNS.setAttribute('stroke-width', '2px');
        elementNS.setAttribute('class', className + ' curved');
        return elementNS;
    }

    static getSVGArrow(id, radius, className){
        let arrowLength = 4;
        let arrowWidth = 2;
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // 'M0,0 L0,6 L9,3 z'
        path.setAttribute('d', 'M0,0 L0,' + arrowWidth + ' L' + arrowLength + ',' + arrowWidth/2 + ' z');
        path.setAttribute('fill', 'black');
        path.setAttribute('class', className + ' arrow');
        let arrow = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        arrow.setAttribute('id', id);
        arrow.setAttribute('markerWidth', arrowLength + 1);
        arrow.setAttribute('markerHeight', arrowLength + 1);
        arrow.setAttribute('refX', arrowLength + radius);
        arrow.setAttribute('refY', arrowWidth/2);
        arrow.setAttribute('orient', 'auto');
        arrow.setAttribute('markerUnits', 'userSpaceOnUse');
        arrow.append(path);
        return arrow;
    }

    ////////////////////////////////////////////////////////////////
    // FUNCTIONALITY ///////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////

    static removeChildElementIfExists(parentElement, childSelector){
        if(parentElement.find(childSelector).length !== 0){
            parentElement.find(childSelector).remove();
        }
    }

    ////////////////////////////////////////////////////////////////
    // SPECIAL NAMES & IDS /////////////////////////////////////////
    ////////////////////////////////////////////////////////////////

    static getGlobalEntityFilterId(artifactName, localId, type){
        let typeClass = UiElementLib.getGlobalEntityTypeClass(artifactName, type);
        let nodeId = UiElementLib.getGlobelEntityId(artifactName, localId);
        return typeClass + ' ' + nodeId;
    }

    static getGlobalLinkFilterId(artifactName, localId, sourceId, targetId){
        let nodeId = UiElementLib.getGlobalLinkSourceEntityId(sourceId) + ' ' + UiElementLib.getGlobalLinkTargetEntityId(targetId);
        let linkId = UiElementLib.getGlobalLinkTypeClass(artifactName, localId);
        return nodeId + ' ' + linkId;
    }

    static getGlobalArrowId(source, relation, target){
        return source + relation + target;
    }

    static getGlobalEntityTypeClass(artifact, type){
        return artifact + '_typ_' + type;
    }

    static getGlobalLinkTypeClass(artifact, type){
        return artifact + '_links_relation_' + type;
    }

    static getGlobelEntityId(artifactName, localId){
        return artifactName + '_entities_' + localId;
    }

    static getGlobalLinkSourceEntityId(sourceId){
        return 'from_' + sourceId;
    }

    static getGlobalLinkTargetEntityId(targetId){
        return 'to_' + targetId;
    }

    static getSVGId(artifactName){
        return 'svg' + artifactName;
    }

    static getD3Id(artifactName){
        return 'd3' + artifactName;
    }
}