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
    
    CUTOFF <- 10
    
    connection <- file(path, open = 'r')
    linn <- readLines(connection)
    
    superClustersLinks <- new.env(hash = TRUE, parent = emptyenv())
    nodes <- new.env(hash = TRUE, parent = emptyenv())
    sizes <- new.env(hash = TRUE, parent = emptyenv())
    
    for(i in 1:length(linn)){
        
        line <- linn[i]
        link <- unlist(strsplit(line, ' ')) 
        
        strength <- as.numeric(link[3])
        
        if(strength > CUTOFF ){
            # print(link)
            
            cluster1 <- link[1]
            cluster2 <- link[2]
            
            # get only link with different clusters 
            if(cluster1 != cluster2){            
                if( is.null(superClustersLinks[[cluster1]])){                                
                    superClustersLinks[[cluster1]] <- new.env(hash = TRUE, parent =   emptyenv())
                }
                
                if( is.null(nodes[[cluster1]]) ){
                    nodes[[cluster1]] <- TRUE
                }
                
                if( is.null(nodes[[cluster2]])){
                    nodes[[cluster2]] <- TRUE
                }
                
                superClustersLinks[[cluster1]][[cluster2]] <- strength
            } else{
                sizes[[cluster1]] <- strength
            }
        }
    }
    
    close(connection)
    
    return(list( links = superClustersLinks, nodes = nodes, sizes = sizes ))
}

identifyClusters <- function(links){

    superClusters <- c() # vector   

    for(l in ls(links)){
        link <- ls(links[[l]])
        for(h in link){

            print('--------------------------------')
            print('l & h ')
            print(l)
            print(h)

            node1 <- l
            node2 <- h

           
            print(length(superClusters))
            print('adding to new')
            print(node1)

            if( length(superClusters) == 0 ){
              
                print('empty list')
                # empty list
                # create new super cluster and add new element
                
                nodeList <-  new.env(hash = TRUE, parent = emptyenv())
                nodeList[[node1]] <- TRUE
                nodeList[[node2]] <- TRUE
                superClusters <- c( superClusters, nodeList)    
                print(length(superClusters))

                # superClusters[[index]] <- new.env(hash = TRUE, parent = emptyenv())
                # superClusters[[index]][[node1]] <- TRUE
                # superClusters[[index]][[node2]] <- TRUE
                
                

            } else {
                print('non empty list')

                for(j in 1:(length(superClusters)-1)) {
                    nList <- superClusters[j]

                    found <- FALSE
                    print(nList)

                    # for(n in ls(nList)){
                    #     if(n == node1 || n == node2){
                    #         print('found match')
                    #         nList[[node1]] <- TRUE
                    #         nList[[node2]] <- TRUE
                    #         found <- TRUE
                    #     }
                    # }

                    if(found){
                        print('founded')                        
                    } else {
                        print('not found')
                    }



                } 
               

                    # for(n in ls(nodes)) {
                    #     if(node1 == n){
                    #         return(TRUE)
                    #     }
                       
                    # }

                    # we didnt find match
                    # create new cluster with this node
                    # index <- toString( length(ls(superClusters)) + 1 )
                    # superClusters[[index]] <- new.env(hash = TRUE, parent = emptyenv())
                    # superClusters[[index]][[node]] <- TRUE
            }    

            
        }
    }
}

displaySuperClusters <- function(superClusters, nodes, sizes){
    
    index <- 0
    
    json <- '{ "nodes": [\n'
    
    for(k in ls(nodes) ){         
        nodes[[k]] <- index
        index <- index + 1
        size <- sizes[[k]]
        node <- paste('{\"name\":\"',k,'",\"group\":',index,', \"size\":',size,' },\n')
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
    print('Start !')
    path <- getPath()
    process <- processFile(path)
    json <- displaySuperClusters(process$links, process$nodes, process$sizes )
    identifyClusters(process$links)
    saveToFile('output/clusters.json', json)
    print("Done")
}

main()