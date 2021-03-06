

/**
 * Class, for obtaing paths to necessary files or any file in particular
 * Works in Unix/Linux/Windows
 */
export class SmartPath {
    
    constructor(path){      
        // shell runs shell commands  
        this.shell = require('shelljs');
        this.path = path;
    }
    
    getAnyFilePath(filename){
        return this.shell
            .find(this.path)
            .filter((file) => {    
                 return file.match(filename); 
            })[0].toString();
    }
    
    getClusterConnectionsPath(){
        
        return this.shell
            .find(this.path)
            .filter((file) => {                 
                 return file.match(/clusterConnections.txt/); 
            }).toString();
    }    
    
    getSummaryTablePath(){
        // 'CLUSTER_ANNOTATION_SUMMARY_TABLE.csv'
        return this.getAnyFilePath(/CLUSTER_ANNOTATION_SUMMARY_TABLE.csv/);
    }
    
    getClassificationPath(){
        return this.getAnyFilePath(/automatic_classification.csv/);
    }
    
    getSummaryPath(){
        return this.getAnyFilePath(/summary$/);
    }
    
    getRMPath(){
        return this.getAnyFilePath(/RM_output_tablesummary.csv/)
    }
    
    getBlastxPath(){
        return this.getAnyFilePath(/seqClust\/clustering\/blastx$/);
    }
    
    getClustersPath(){
        return this.getAnyFilePath(/seqClust\/clustering\/clusters$/);
    }
}