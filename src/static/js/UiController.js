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
}

function startFileUploader() {
    let inputElementId = $(this).attr('form');
    let inputElement = $('#' + inputElementId);
    let artifactName = inputElement.attr('name');
    let input = (inputElement)[0];

    if (!input) {
        alert("Um, couldn't find the fileinput element.");
    } else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    } else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    } else {
        FileUploader.uploadFile(input.files[0], artifactName);
        startLoaderAndHideFilter(artifactName);
    }
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
    // check if already active
    if($(this).hasClass('active')){
        $(this).removeClass('active');
        // TODO: update Filter
    } else {
        $(this).addClass('active');
        // TODO: update Filter
    }
}


// addEventListeners /////////////////////////////

$(document).ready(function () {
    $('#sidebarOpener').click(toggleSidebar);
    $('.csvFileUploaderButton').click(startFileUploader);
});
