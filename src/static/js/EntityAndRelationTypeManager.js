let typeManagerInstance = null;

class EntityAndRelationTypeManager{

    constructor(){
        console.log('# EntityAndRelationTypeManager - constructor');
        if(!typeManagerInstance){
            this.typeJson = null;
            this.loadJson();
            typeManagerInstance = this;
        } else {
            return typeManagerInstance;
        }
    }

    loadJson(){
        let path = '../src/static/js/lib/entityAndRelationTypes.json';
        let that = this;
        $.getJSON(path, function (data) {
            that.typeJson = data;
        }).done(function () {
            if(!that.typeJson){
                that.onError('json Error', 'Could not load Json from ' + path);
            } else{
                that.displayAllTypesReadMode();
            }
        })
    }

    displayAllTypesEditMode(){
        let parentEntityDivElement = $('#settingsSidebar #nodeTypesSetup div').empty();
        let parentLinkDivElement = $('#settingsSidebar #linkTypesSetup div').empty();

        // add all entity types
        $.each(this.typeJson['entitiesTypes'], function (key, value) {
            let group = document.createElement('div');
            group.setAttribute('class', 'form-group');

            let innergroup = document.createElement('div');
            innergroup.setAttribute('class', 'inner-group');

            let label = UiElementLib.getBeginOfLineLabel(key + ': ');
            let colorpicker = UiElementLib.getColorPickerInput('color-' + key, value[0].color);
            let textarea = UiElementLib.getTextAreaInput('desc-' + key, value[0].desc);

            innergroup.append(label);
            innergroup.append(colorpicker);
            group.append(innergroup);
            group.append(textarea);

            parentEntityDivElement.append(group);
        });

        $.each(this.typeJson['relationTypes'], function (key, value) {
            let group = document.createElement('div');
            group.setAttribute('class', 'form-group');

            let innergroup = document.createElement('div');
            innergroup.setAttribute('class', 'inner-group');

            let label = UiElementLib.getBeginOfLineLabel(key + ': ');
            let colorpicker = UiElementLib.getColorPickerInput('color-' + key, value[0].color);
            let textarea = UiElementLib.getTextAreaInput('desc-' + key, value[0].desc);

            innergroup.append(label);
            innergroup.append(colorpicker);
            group.append(innergroup);
            group.append(textarea);

            parentLinkDivElement.append(group);
        });
    }

    displayAllTypesReadMode(){
        let parentEntityDivElement = $('#settingsSidebar #nodeTypesSetup div').empty();
        let parentLinkDivElement = $('#settingsSidebar #linkTypesSetup div').empty();

        $.each(this.typeJson['entitiesTypes'], function (key, value) {
            console.log(key);
            console.log(value);
            let group = document.createElement('div');

            let label = UiElementLib.getLabelWithCustomColor(key, key, null, value[0].color);
            let descText = UiElementLib.getSpanWithClass('marginLeft');
            let name = UiElementLib.getBoldTextWithSpace(value[0].name);
            descText.append(name);
            descText.append(value[0].desc);

            group.append(label);
            group.append(descText);

            parentEntityDivElement.append(group);
        });

        $.each(this.typeJson['relationTypes'], function (key, value) {
            console.log(key);
            console.log(value);
            let group = document.createElement('div');
            let label = UiElementLib.getLabelWithCustomColor(key, key, null, value[0].color);
            let descText = UiElementLib.getSpanWithClass('marginLeft');
            let name = UiElementLib.getBoldTextWithSpace(value[0].primaryDirection);
            descText.append(name);
            descText.append(value[0].desc);

            group.append(label);
            group.append(descText);

            parentLinkDivElement.append(group);
        });
    }

    saveChanges(){
        console.log('save');
        $.each(this.typeJson, function (key, value) {
            let colorCode = $('#color-' + key).val();
            let textDesc = $('#desc-' + key).val();
            value[0].color = colorCode;
            value[0].desc = textDesc;
        });

        this.displayAllTypesReadMode();
    }

    getColorOfType(type){
        let colorCode = '#e6e6e6';
        if(this.typeJson['entitiesTypes'][type]){
            colorCode = this.typeJson['entitiesTypes'][type][0].color;
        } else if(this.typeJson['relationTypes'][type]){
            colorCode = this.typeJson['relationTypes'][type][0].color;
        }
        return colorCode;
    }

    onError(title, message){
        // TODO: ein zentrales Alert
        let text = title + 'inside OriginJson: \n' + message;
        console.error(text);
    }
}