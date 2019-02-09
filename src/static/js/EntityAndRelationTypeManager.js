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
        let parentUndetDivElement = $('#settingsSidebar #undeterminedTypesSetup div').empty();

        console.log(this.typeJson);
        $.each(this.typeJson, function (key, value) {
            console.log(key);
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

           switch (value[0].type) {
               case 'entity' :
                   parentEntityDivElement.append(group);
                   break;
               case 'relation':
                   parentLinkDivElement.append(group);
                   break;
               default:
                   parentUndetDivElement.append(group);
           }
        });
    }

    displayAllTypesReadMode(){
        let parentEntityDivElement = $('#settingsSidebar #nodeTypesSetup div').empty();
        let parentLinkDivElement = $('#settingsSidebar #linkTypesSetup div').empty();
        let parentUndetDivElement = $('#settingsSidebar #undeterminedTypesSetup div').empty();

        $.each(this.typeJson, function (key, value) {
           let group = document.createElement('div');
           let label = UiElementLib.getLabelWithCustomColor(key, key, null, value[0].color);
           let descText = document.createElement('span');
           descText.append( value[0].desc);

           group.append(label);
           group.append(descText);

           switch (value[0].type) {
               case 'entity' :
                   parentEntityDivElement.append(group);
                   break;
               case 'relation':
                   parentLinkDivElement.append(group);
                   break;
               default:
                   parentUndetDivElement.append(group);
           }
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
        if(this.typeJson[type]){
            colorCode = this.typeJson[type][0].color;
        }
        return colorCode;
    }

    onError(title, message){
        // TODO: ein zentrales Alert
        let text = title + 'inside OriginJson: \n' + message;
        console.error(text);
    }
}