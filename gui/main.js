var remote = require('remote');
var dialog = remote.require('dialog');

function openFile(){
	dialog.showOpenDialog({ properties: ['openDirectory']}, folderSelected);
}  

function folderSelected(path){
	
	var shell = require('shelljs');
	var analyzer = shell.exec('python scripts/analyze.py -f ' + path, {async: true});
	analyzer.stdout.on('data', displayResult );
	analyzer.stderr.on('data', errorHandler );

}

function displayResult(result){
	console.debug(result);
	window.location = 'chart.html';
}

function errorHandler(error){
	console.error('R:', error);
}
      