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
        let fileUploader = new FileUploader();
        fileUploader.uploadFile(input.files[0], artifactName);
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

    let uiDashboardCreator = new UiDashboardCreator();
    uiDashboardCreator.createSelectedEntityInfoView($(this));

    return;
}

function handleLabelWithToggleClick() {
    let uiDashboardCreator = new UiDashboardCreator();
    uiDashboardCreator.createToggleInfoForReletedEntities($(this));
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
    console.log(neighborBarChartSortSelectionState);
    if($(this)[0].value != neighborBarChartSortSelectionState){
        neighborBarChartSortSelectionState = $(this)[0].value;
        // query for new coordinates
        let fileUploader = new FileUploader();
        fileUploader.requestNeighborBarchartCoordinates(neighborBarChartSortSelectionState);
    }
}

function initAccordion(){
    $('.ui.accordion')
      .accordion()
    ;
}

function openContextMenu(event){
    let top = event.clientY;
    let left = event.clientX;
    console.log(top);
    console.log(left);

    // Show contextmenu
    $("#contextMenu").css({
        top: top + "px",
        left: left + "px",
        display: "block"
    });

    // add id of svg to contextMenu
    $("#contextMenu").data('svgId', $(this).attr('id'));
}

function hideContextMenu(){
    $("#contextMenu").hide();
    $("#contextMenu").removeData('svgId');
}

function svg2PDF(){
    console.log('print');
    console.log($("#contextMenu").data('svgId'));
    let elementId = $("#contextMenu").data('svgId');
    let element = document.getElementById(elementId);
    html2pdf(element);
}

// addEventListeners /////////////////////////////

$(document).ready(function () {
    $(document).click(hideContextMenu);
    $('#switchToEditButton').click(switchEntityAndTypeManagerToEditMode);
    $('#saveTypesButton').click(switchAndSaveChanges);
    $('#cancelTypesButton').click(switchEntityAndTypeManagerToViewMode);
    $('#sidebarOpener').click(toggleUploadSidebar);
    $('#setupSidebarOpener').click(toggleSetupSidebar);
    $('.csvFileUploaderButton').click(startFileUploader);
    $('input.custom-file-input').change(displayFileName);
    $('#printSVG2PDF').click(svg2PDF);
});
