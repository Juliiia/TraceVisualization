function toggleSidbar() {
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