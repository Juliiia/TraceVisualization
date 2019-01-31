function toggleSidbar() {
    $('.ui.sidebar')
        .sidebar({
            onHide: function() {
              console.log('on Hide');
              loadVisualization();
            }
        })
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('toggle');
}

function loadVisualization(){
    console.log('loadVisualization');
    let filteredDataCollector = new FilteredDataCollector();
    filteredDataCollector.visualizeJsonStructure();
}