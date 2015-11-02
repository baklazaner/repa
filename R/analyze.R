# 
# author: Oliver Surina
# 

# loads path from command line argument -f/--folder
getPath <- function(){
    
    separator <- .Platform$file.sep
    file <- paste('seqclust','clustering','clusterConnections.txt', sep = separator)
    
    args <- commandArgs(trailingOnly = TRUE)    
    # TODO change to something smarter
    path <- args[2]    
    
    fullPath <- paste(path, file, sep = separator)
       
    return(fullPath)
}

processFile <- function(path){
    
    THRESH_HOLD <- 10
    
    connection <- file(path, open = 'r')
    linn <- readLines(connection)
    
    superClustersLinks <- new.env(hash = TRUE, parent = emptyenv())
    nodes <- new.env(hash = TRUE, parent = emptyenv())
   
    
    for(i in 1:length(linn)){
        
        line <- linn[i]
        link <- unlist(strsplit(line, ' ')) 
        
        strength <- as.numeric(link[3])
        
        if(strength > THRESH_HOLD ){
            # print(link)
            
            cluster1 <- link[1]
            cluster2 <- link[2]
            
            # get only link with different clusters 
            if(cluster1 != cluster2){            
                if( is.null(superClustersLinks[[cluster1]])){                                
                    superClustersLinks[[cluster1]] <- new.env(hash = TRUE, parent = emptyenv())
                }
                
                if( is.null(nodes[[cluster1]]) ){
                    nodes[[cluster1]] <- T
                }
                
                if( is.null(nodes[[cluster2]])){
                    nodes[[cluster2]] <- T
                }
                
                superClustersLinks[[cluster1]][[cluster2]] <- strength
            }
        }
    }
    
    close(connection)
    
    return(list( links = superClustersLinks, nodes = nodes ))
}

displaySuperClusters <- function(superClusters, nodes){
    
    index <- 0
    
    json <- '{ "nodes": [\n'
    
    for(k in ls(nodes) ){         
        nodes[[k]] <- index
        index <- index + 1
        node <- paste('{\"name\":\"',k,'",\"group\":',index,' },\n')
        json <- paste(json, node)
    }
    
    # remove key sepearotr before enclosing array 
    json <- substr(json, 1, nchar(json)-2) 
    json <- paste(json, '],\n "links": [\n')
    
    for(l in ls(superClusters) ){
        link <- ls(superClusters[[l]])
        for(h in link){
            json <- paste(json,'{"source":', nodes[[l]], ',')       
            json <- paste(json,'"target":', nodes[[h]], ',') 
            json <- paste(json,'"value":', superClusters[[l]][[h]], '},\n')
        }
    }
    
    json <- substr(json, 1, nchar(json)-2) 
    json <- paste(json, ']}')
    
    return(json)
    
}

saveToFile <- function(name, json){
    f <- file(name)
    writeLines(json, f)
    close(f)
}

main <- function(){    
    # start here
    path <- getPath()
    process <- processFile(path)
    json <- displaySuperClusters(process$links, process$nodes )
    saveToFile('output/clusters.json', json)
    print("Done")
}

main()