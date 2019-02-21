// TODO: make static
function toggleUploadSidebar() {
    $('#uploadSidebar')
        .sidebar({
            onHide: function () {
                loadVisualization();
            }
        })
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('toggle');
}

function toggleSetupSidebar() {
    $('#settingsSidebar')
        .sidebar({
           onShow: function () {
                let typeManager = new EntityAndRelationTypeManager();
           }
        })
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('toggle');
}

function switchEntityAndTypeManagerToEditMode() {
    hideElement($('#switchToEditButton'));
    visibleElement($('#saveTypesButton'));
    visibleElement($('#cancelTypesButton'));

    let typeManager = new EntityAndRelationTypeManager();
    typeManager.displayAllTypesEditMode();
}

function switchEntityAndTypeManagerToViewMode() {
    visibleElement($('#switchToEditButton'));
    hideElement($('#saveTypesButton'));
    hideElement($('#cancelTypesButton'));

    let typeManager = new EntityAndRelationTypeManager();
    typeManager.displayAllTypesReadMode();
}

function switchAndSaveChanges() {
    visibleElement($('#switchToEditButton'));
    hideElement($('#saveTypesButton'));
    hideElement($('#cancelTypesButton'));

    let typeManager = new EntityAndRelationTypeManager();
    typeManager.saveChanges();
}

function loadVisualization() {
    let filteredDataCollector = new FilteredDataCollector();
    filteredDataCollector.visualizeJsonStructure();
    return true;
}

function startFileUploader() {
    let inputElementId = $(this).attr('form');
    let inputElement = $('#' + inputElementId);
    let artifactName = inputElement.attr('name');
    let errormessage;

    // get input
    let input = (inputElement)[0];

    if (!input) {
        errormessage = "Um, couldn't find the fileinput element.";
    } else if (!input.files) {
        errormessage = "This browser doesn't seem to support the `files` property of file inputs.";
    } else if (!input.files[0]) {
        errormessage = "Please select a file before clicking 'Load'";
    } else {
        FileUploader.uploadFile(input.files[0], artifactName);
        startLoaderAndHideFilter(artifactName);
        return true;
    }

    resetInputLabel(artifactName);
    alert(errormessage);
    return true;
}

function displayFileName() {
    updateInputLabel($(this)[0].files[0].name, $(this).attr('name'));
    return true;
}

function updateInputLabel(text, artifactName) {
    let label = $('#inputCSVLabel' + artifactName);
    label.empty();
    label.append(text);
    return true;
}

function resetInputLabel(artifactName) {
    updateInputLabel('Choose CSV file', artifactName);
    return true;
}

function startLoaderAndHideFilter(artifactName) {
    // display Loader
    //TODO: better to ask for parent element and children then use names
    let loadingDiv = $('#filterSection' + artifactName + ' .loader');
    if (loadingDiv.hasClass('hidden')) {
        loadingDiv.removeClass('hidden');
    }

    // hide filter
    $('#filterSection' + artifactName + ' .filterOptionsSection').addClass('hidden');
    return true;
}

function handleLabelClick() {
    let filterdDataCollector = new FilteredDataCollector();
    // check if already active
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        filterdDataCollector.addDeselectionToFilter($(this).attr('id'));
    } else {
        $(this).addClass('active');
        filterdDataCollector.removeDeselectionFromFilter($(this).attr('id'));
    }
    return true;
}

function handleNodeClick(){
    let filterdDataCollector = new FilteredDataCollector();
    filterdDataCollector.entitySelected($(this));

    // clean div
    let selectedInfoDiv = $('#selectedNodeInformationView').empty();
    let title = UiElementLib.getSectionTitle('Selected Node');
    let namePair = UiElementLib.getKeyValuePair('Name', $(this).data('name'));
    let typePair = UiElementLib.getKeyValuePair('Type', $(this).data('type'));
    let origin = UiElementLib.getKeyValuePair('Origin', $(this).data('origin'));
    let responsible = UiElementLib.getKeyValuePair('Responsible', $(this).data('responsible'));
    let outNeighborsPair = UiElementLib.getKeyValuePair('outgoing Relations', $(this).data('outrelations'));
    let inNeighborsPair = UiElementLib.getKeyValuePair('incoming Relations', $(this).data('inrelations'));
    let idPair = UiElementLib.getKeyValuePair('Id', $(this).data('id'));
    let artifactPair = UiElementLib.getKeyValuePair('Artifact', $(this).data('artifact'));

    selectedInfoDiv.append(title);
    selectedInfoDiv.append(artifactPair);
    selectedInfoDiv.append(namePair);
    selectedInfoDiv.append(typePair);
    selectedInfoDiv.append(outNeighborsPair);
    selectedInfoDiv.append(inNeighborsPair);
    selectedInfoDiv.append(origin);
    selectedInfoDiv.append(responsible);
    selectedInfoDiv.append(idPair);
    return;
}

function hideElement(element){
    element.addClass('hidden');
    return true;
}

function visibleElement(element){
    if(element.hasClass('hidden')){
        element.removeClass('hidden');
    }
    return true;
}

let neighborBarChartSortSelectionState = ViewRegister.getNeighborBarchartSortDefaultOption();
function dropdownClicked(){
    console.log($(this).data('parentid'));
    if($(this)[0].value != neighborBarChartSortSelectionState){
        neighborBarChartSortSelectionState = $(this)[0].value;
        // query for new coordinates
        FileUploader.requestNeighborBarchartCoordinates(neighborBarChartSortSelectionState);
    }
}
// addEventListeners /////////////////////////////

$(document).ready(function () {
    $('#switchToEditButton').click(switchEntityAndTypeManagerToEditMode);
    $('#saveTypesButton').click(switchAndSaveChanges);
    $('#cancelTypesButton').click(switchEntityAndTypeManagerToViewMode);
    $('#sidebarOpener').click(toggleUploadSidebar);
    $('#setupSidebarOpener').click(toggleSetupSidebar);
    $('.csvFileUploaderButton').click(startFileUploader);
    $('input.custom-file-input').change(displayFileName);
});
