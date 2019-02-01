// TODO: make static methodes with class
function toggleSidebar() {
    $('.ui.sidebar')
        .sidebar({
            onHide: function() {
                loadVisualization();
            }
        })
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('toggle');
}

function loadVisualization(){
    let filteredDataCollector = new FilteredDataCollector();
    filteredDataCollector.visualizeJsonStructure();
    return;
}

function startFileUploader() {
    let inputElementId = $(this).attr('form');
    let inputElement = $('#' + inputElementId);
    let artifactName = inputElement.attr('name');

    // get input
    let input = (inputElement)[0];

    if (!input) {
        alert("Um, couldn't find the fileinput element.");
    } else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    } else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    } else {
        updateInputLabel(input.files[0].path, artifactName);
        FileUploader.uploadFile(input.files[0], artifactName);
        startLoaderAndHideFilter(artifactName);
    }
    return;
}

function updateInputLabel(path, artifactName) {
    let label = $('#inputCSVLabel' + artifactName);
    label.empty();
    label.append(path);
    return;
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
}

function handleLabelClick() {
    let filterdDataCollector = new FilteredDataCollector();
    // check if already active
    if($(this).hasClass('active')){
        $(this).removeClass('active');
        filterdDataCollector.addDeselectionToFilter($(this).attr('id'));
    } else {
        $(this).addClass('active');
        filterdDataCollector.removeDeselectionFromFilter($(this).attr('id'));
    }
}


// addEventListeners /////////////////////////////

$(document).ready(function () {
    $('#sidebarOpener').click(toggleSidebar);
    $('.csvFileUploaderButton').click(startFileUploader);
});
