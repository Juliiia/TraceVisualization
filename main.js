const {app, BrowserWindow} = require('electron')

// make a instance of BrowserWindow and load the index.html
function createWindow () {
    window = new BrowserWindow({width: 800, height: 600})
    window.loadFile('index.html')

    let pyshell =  require('python-shell');

    pyshell.PythonShell.run('backend/hello.py', null, function  (err, results)  {
         if  (err)  throw err;
         console.log('hello.py finished.');
         console.log('results', results);
    });

    pyshell.PythonShell.run('backend/engine.py', null, function (err, results) {
        if  (err)  console.log(err);
        console.log('engine.py finished.');
        console.log('results', results);
    });
    
}


// run the createWindow app
app.on('ready', createWindow)

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
})