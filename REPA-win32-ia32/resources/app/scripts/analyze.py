#!/usr/bin/python

import sys
import os
import getopt

def getFolderPath():
	try:
		opts, args = getopt.getopt(sys.argv[1:],"hf:c:")
	except getopt.GetoptError:
		print "error with arguments"
		sys.exit(2) 	

	folder = None
	cutoff = None

	for opt, arg in opts:		
		if opt == '-h':
			print 'Display this help'
			sys.exit()
		elif opt in ("-f", "--folder"):					 
			folder = arg 

	return folder


def process(path):

	print 'running process'

	CUTOFF = 10

	# path seperator
	sep = os.sep

	fullPath = sep.join((path,'seqclust','clustering','clusterConnections.txt'))
	
	nodes = {}
	links = list()

	with open(fullPath, 'r') as f:
		for line in f:			
			line = line.rstrip('\n')

			connection = line.split(' ')
			strength = int(connection[2])

			if strength > CUTOFF:

				node1 = connection[0]
				node2 = connection[1]

				if node1 != node2:
					link = (node1, node2, strength)
					links.append(link)

				else:	# they are the same					
					nodes[node1] = strength

	return (nodes, links)

def indentifySuperClusters(clusters):

	ndoes = clusters[0]
	links = clusters[1]

	sClusters = list() # super clusters

	for link in links:

		found = False
		for cluster in sClusters:
			if link[0] in cluster or link[1] in cluster:
				print  link[0] + ',' + link[1] + 'found in'
				print cluster
				if link[0] in cluster:
					cluster.append(link[1])
				else:
					cluster.append(link[0])	
				found = True

		if not found:
			s = list()
			s.append(link[0])
			s.append(link[1])
			sClusters.append(s)
				

		
	for cluster in sClusters:
		print cluster		

	return True

	

def createJson(clusters):	

	nodes = clusters[0]
	links = clusters[1]

	# map nodes
	json = '{ "nodes": [\n'

	indices = {}

	index = 0	
	for link in links:	
		if link[0] not in indices:
			indices[link[0]] = index
			json +=  '{"name":"' + link[0] + '", "group":' + str(index) + ', "size":' + str(nodes[link[0]]) + '},\n' 
			index = index + 1

		if link[1] not in indices:						
			indices[link[1]] = index
			json +=  '{"name":"' + link[1] + '", "group":' + str(index) + ', "size":' + str(nodes[link[1]]) + '},\n' 
			index = index + 1
	
	json = json[:-2] # removes the last two characters
	json += '],\n'

	# map links
	json += '"links":[\n'

	for link in links:
		json += '{"source":' + str(indices[link[0]]) + ','
		json += '"target":' + str(indices[link[1]]) + ','
		json += '"value":' + str(link[2]) + '},\n'

	json = json[:-2] # removes the last two characters
	json += ']}'
		
	return json

def saveToFile(name, string):
	f = open(name, 'w+')
	f.write(string)
	f.close()

def main():	

	print 'start'

	folder = getFolderPath()

	if folder == False:
		print "Folder not specified"
		sys.exit(2)

	clusters = process(folder)
	indentifySuperClusters(clusters)
	json = createJson(clusters)
	saveToFile('output/clusters.json', json)

	print 'Done'

main()	