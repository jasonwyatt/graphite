(function(){
    'use strict';
    
    var undefined;
    
    function has (obj, key) {
        // summary:
        //      "Safe" alternative to directly calling hasOwnProperty on the 
        //      provided object.
        // obj: Object
        //      Object to determine if a property exists on.
        // key: String|Number
        //      Name of the property.
        // returns:
        //      Boolean. Whether or not the object has a property with the name of
        //      `key`.
        return Object.prototype.hasOwnProperty.apply(obj, [key]);
    }
    
    function objAttr (obj, key, value) {
        // summary:
        //      Gets/Sets an attribute of an object.  If `value` is undefined
        //      the function will get the current value of the attribute. If 
        //      `value` is provided, it will be the new value of the attribute.
        // obj: Object
        //      Object to evaluate/modify.
        // key: String|Number
        //      Name of the attribute to get/set.
        // value: Anything
        //      OPTIONAL. If provided, the new value for the attribute.
        // returns:
        //      Anything. The value of the attribute.
        if ( typeof value !== 'undefined' ) {
            obj[key] = value;
        }
        
        if ( has(obj, key) ) {
            return obj[key];
        }
        return undefined;
    }
    
    function objRemoveAttr (obj, key) {
        // summary:
        //      Removes an attribute from an object.
        // obj: Object
        //      Object to remove the attribute from.
        // key: String|number
        //      Name of the attribute to remove.
        delete obj[key];
    }
    
    var __idCache = {};
    function generateID (objType) {
        // summary:
        //      Generates a unique ID for the specified object type.
        // objType: String
        //      Type of object to generate a unique ID for.
        // returns:
        //      String. Unique ID.
        
        if ( !has(__idCache, objType ) ) {
            __idCache[objType] = 0;
        }
        __idCache[objType] += 1;
        return objType + '_' + __idCache[objType];
    }
    
    function binarySearchById (collection, obj) {
        // summary:
        //      Performs a binary search using the `getId()` function of the 
        //      objects in the collection as the comparable value.
        // collection: Array<Object with getID()>
        //      Collection to search within.
        // obj: Object (with getId())
        //      Object to search for.
        // returns: 
        //      Object. Search results.
        //      
        //      Example:
        //      {
        //          // index: Number
        //          //      Index in the collection where the obj was found, or 
        //          //      where it should've been found.
        //          index: 0,
        //          
        //          // obj: Object
        //          //      The object, if it was found, null otherwise.
        //          obj: obj
        //      }
        
        var start = 0;
        var end = collection.length - 1;
        
        while ( start < end ) {
            var middle = Math.floor(( start + end ) / 2);
            
            if ( collection[middle] === obj ) {
                return {
                    index: middle,
                    obj: collection[middle]
                };
            } else {
                if ( collection[middle].getId() < obj.getId() ) {
                    start = middle + 1;
                } else {
                    end = middle - 1;
                }
            }
        }
        
        return {
            index: start + 1,
            obj: null
        };
    }
    
    var Node = function (attrs) {
        // summary:
        //      Class. Defines a Graph Node.
        // attrs: Object
        //      Attributes for the graph node.
        
        attrs = attrs || {};
        
        // meta: Object
        //      Meta data for the node.
        var meta = {};
        
        // id: String
        //      Unique ID for the node.
        var id = generateID('Node');
        
        // ------------- begin methods -------------- //
        
        this.getId = function getId () {
            // summary:
            //      Gets the ID for the graph node.
            // returns:
            //      String. Unique ID for the graph node.
            return id;    
        };
        this.attr = function attr (key, value) {
            // summary:
            //      Gets/Sets an attribute of the Node.  If `value` is undefined
            //      the function will get the current value of the attribute. If 
            //      `value` is provided, it will be the new value of the attribute.
            // key: String|Number
            //      Name of the attribute to get/set.
            // value: Anything
            //      OPTIONAL. If provided, the new value for the attribute.
            // returns:
            //      Anything. The value of the attribute on the Node.
            return objAttr(attrs, key, value);
        };
        this.removeAttr = function removeAttr (key) {
            // summary:
            //      Removes an attribute from the Node.
            // key: String|Number
            //      Name of the attribute to remove.
            objRemoveAttr(attrs, key);
        };
        this.meta = function meta (key, value) {
            // summary:
            //      Gets/Sets meta data for the Node.  If `value` is undefined
            //      the function will get the current value of the meta data. If 
            //      `value` is provided, it will be the new value of the meta data.
            // key: String|Number
            //      Name of the meta data to get/set.
            // value: Anything
            //      OPTIONAL. If provided, the new value for the meta data.
            // returns:
            //      Anything. The value of the meta data on the Node.
            return objAttr(meta, key, value);
        };
        this.removeMeta = function removeMeta (key) {
            // summary:
            //      Removes a meta data value from the Node.
            // key: String|Number
            //      Name of the meta data value to remove.
            objRemoveAttr(meta, key);
        };
        this.resetMeta = function resetMeta () {
            // summary:
            //      Resets the meta data for the Node.
            meta = {};
        };
        this.toString = function toString () {
            // summary:
            //      Returns a string representation of the Node.
            // returns:
            //      String. String representation of the Node.
            
            return '<Node('+this.getId()+')>';
        };
    };
    
    var Edge = function (from, to, attrs) {
        // summary:
        //      Class. Defines a graph edge.
        // from: Node
        //      "From" Node.
        // to: Node
        //      "To" Node.
        // attrs: Object
        //      Attributes about the graph edge.
        
        attrs = attrs || {};
        
        // meta: Object
        //      Meta data for the edge.
        var meta = {};
        
        // id: String
        //      Unique ID for the edge.
        var id = generateID('Edge');
        
        // ------------- begin methods -------------- //
        
        this.getId = function getId () {
            // summary:
            //      Gets the ID for the graph edge.
            // returns:
            //      String. Unique ID for the graph edge.
            return id;    
        };
        this.attr = function attr (key, value) {
            // summary:
            //      Gets/Sets an attribute of the Edge.  If `value` is undefined
            //      the function will get the current value of the attribute. If 
            //      `value` is provided, it will be the new value of the attribute.
            // key: String|Number
            //      Name of the attribute to get/set.
            // value: Anything
            //      OPTIONAL. If provided, the new value for the attribute.
            // returns:
            //      Anything. The value of the attribute on the Edge.
            return objAttr(attrs, key, value);
        };
        this.removeAttr = function removeAttr (key) {
            // summary:
            //      Removes an attribute from the Edge.
            // key: String|Number
            //      Name of the attribute to remove.
            objRemoveAttr(attrs, key);
        };
        this.meta = function meta (key, value) {
            // summary:
            //      Gets/Sets meta data for the Edge.  If `value` is undefined
            //      the function will get the current value of the meta data. If 
            //      `value` is provided, it will be the new value of the meta data.
            // key: String|Number
            //      Name of the meta data to get/set.
            // value: Anything
            //      OPTIONAL. If provided, the new value for the meta data.
            // returns:
            //      Anything. The value of the meta data on the Edge.
            return objAttr(meta, key, value);
        };
        this.removeMeta = function removeMeta (key) {
            // summary:
            //      Removes a meta data value from the Edge.
            // key: String|Number
            //      Name of the meta data value to remove.
            objRemoveAttr(meta, key);
        };
        this.resetMeta = function resetMeta () {
            // summary:
            //      Resets the meta data for the Edge.
            meta = {};
        };
        this.getFromNode = function getFromNode () {
            // summary:
            //      Gets the "From" Node.
            // returns:
            //      Node. The "From" node for the edge.
            return from;
        };
        this.getToNode = function getToNode () {
            // summary:
            //      Gets the "To" Node.
            // returns:
            //      Node. The "To" node for the edge.
            return to;
        };
        this.toString = function toString () {
            // summary:
            //      Returns a string representation of the Edge.
            // returns:
            //      String. String representation of the Edge.
            return '<Edge('+this.getId()+') from '+from+' to '+to+'>';
        };
    };
    
    var Graph = function (nodes, edges, directed) {
        // summary:
        //      Class. Defines a graphite graph.
        // nodes: Array<Node>
        //      Array of nodes that make up the graph.
        // edges: Array<Edge>
        //      Array of edges that make up the graph.
        // directed: Boolean
        //      OPTIONAL. Defaults to `true`. Whether or not the graph is a 
        //      directed graph.
        
        if ( typeof directed === 'undefined' || ( directed !== true && directed !== false ) ) {
            directed = true;
        }
        
        // _nodes: Array<Node>
        //      Local copy of the graph's nodes. Will remain sorted by ID for 
        //      fast traversal.
        var _nodes = [];
        
        // _edges: Array<Edge>
        //      Local copy of the graph's edges. Will remain sorted by ID for
        //      fast traversal.
        var _edges = [];
        
        // id: String
        //      Unique ID for the graph.
        var id = generateID('Graph');
        
        // edgesById: Object
        //      Cache of edges, accessible by their ids.
        var edgesById = {};
        
        // nodesById: Object
        //      Cache of nodes, accessible by their ids.
        var nodesById = {};
        
        // edgesByNodeId: Object
        //      One-to-many mapping of Node IDs to Edges. Edges will remain 
        //      sorted by ID for fast traversal.
        var edgesByNodeId = {};
        
        // ------------- begin methods -------------- //
        
        this.getId = function getId () {
            // summary:
            //      Gets the ID for the graph.
            // returns:
            //      String. Unique ID for the graph.
            return id;
        };
        this.hasEdge = function hasEdge (edge) {
            // summary:
            //      Determines whether or not the graph contains the specified 
            //      edge. O(1)
            // edge: Edge|String
            //      Edge (or edge's ID) to search for.
            // returns:
            //      Boolean. Whether or not the graph contains the specified 
            //      edge.
            
            if ( typeof edge !== 'string' ) {
                edge = edge.getId();
            }
            
            return typeof edgesById[edge] !== 'undefined';
        };
        this.getEdge = function getEdge (edge) {
            // summary:
            //      Gets an edge from the graph. If the edge does not exist in 
            //      the graph, this function will return undefined. O(1)
            // edge: Edge|String
            //      Edge (or edge's ID) to get from the graph.
            // returns:
            //      Edge. The edge we're looking for, or undefined if the edge 
            //      does not exist in the grah.
            
            if ( typeof edge !== 'string' ) {
                edge = edge.getId();
            }
            
            return edgesById[edge];
        };
        this.addEdge = function addEdge (edge) {
            // summary:
            //      Adds an edge to the graph.  If the edge is a duplicate, 
            //      this method will be a no-op. O(log n)
            // edge: Edge
            //      Edge to add to the graph.
            
            if ( this.hasEdge(edge) ) {
                return;
            }
            
            // if we don't have the given edge, let's add it:
            //      - inject into sorted array _edges
            //      - add to the id-mapped collection
            //      - add the from/to nodes
            //      - add the edge to the edgesByNodeId for the from/to nodes.
            
            var searchResults = binarySearchById(_edges, edge);
            _edges.splice(searchResults.index, 0, edge);
            
            edgesById[edge.getId()] = edge;
            
            var fromNode = edge.getFromNode();
            var toNode = edge.getToNode();
            this.addNode(fromNode);
            this.addNode(toNode);
            
            searchResults = binarySearchById(edgesByNodeId[fromNode.getId()], edge);
            if ( searchResults.obj === null ) {
                edgesByNodeId[fromNode.getId()].splice(searchResults.index, 0, edge);
            }
            if ( !directed ) {
                searchResults = binarySearchById(edgesByNodeId[toNode.getId()], edge);
                if ( searchResults.obj === null ) {
                    edgesByNodeId[toNode.getId()].splice(searchResults.index, 0, edge);
                }
            }
        };
        this.removeEdge = function removeEdge (edge) {
            // summary:
            //      Removes the edge from the graph. If the edge does not 
            //      exist, this method will be a no-op. O(log e)
            // edge: Edge|String
            //      Edge (or edge's ID) to remove from the graph.
            
            if ( !this.hasEdge(edge) ) {
                return;
            }
            
            // if we have the edge, do the following:
            //      - remove the edge from _edges
            //      - remove it from edgesById mapping
            //      - remove it from its from/to nodes' edgesByNodeId lists
            
            var searchResults = binarySearchById(_edges, edge);
            _edges.splice(searchResults.index, 1);
            
            delete edgesById[edge.getId()];
            
            var fromNode = edge.getFromNode();
            var toNode = edge.getToNode();
            
            var searchResults = binarySearchById(edgesByNodeId[fromNode.getId()], edge);
            if ( searchResults.obj !== null ) {
                edgesByNodeId[fromNode.getId()].splice(searchResults.index, 1);
            }
            if ( !directed ) {
                searchResults = binarySearchById(edgesByNodeId[toNode.getId()], edge);
                if ( searchResults.obj !== null ) {
                    edgesByNodeId[toNode.getId()].splice(searchResults.index, 1);
                }
            }
        };
        this.hasNode = function hasNode (node) {
            // summary:
            //      Determines whether or not the graph contains the specified 
            //      node. O(1)
            // node: Node|String
            //      Node (or node's ID) to search for.
            // returns:
            //      Boolean. Whether or not the graph contains the specified 
            //      node.
            
            if ( typeof node !== 'string' ) {
                node = node.getId();
            }
            return typeof nodesById[node] !== 'undefined';
        };
        this.getNodes = function getNodes () {
            // summary:
            //      Gets an array containing all of the nodes in the graph.
            // returns:
            //      Array containing all of the nodes in the graph.

            return _nodes.slice();
        };
        this.getNode = function getNode (node) {
            // summary:
            //      Gets a node from the graph. If the node does not exist in 
            //      the graph, this function will return undefined. O(1)
            // edge: Node|String
            //      Node (or node's ID) to get from the graph.
            
            if ( typeof node !== 'string' ) {
                node = node.getId();
            }
            return nodesById[node];
        };
        this.addNode = function addNode (node) {
            // summary:
            //      Adds a node to the graph. If the node is a duplciate, this 
            //      method will be a no-op. O(log n)
            // node: Node
            //      Node to add to the graph.
            
            if ( this.hasNode(node) ) {
                return;
            }
            
            // if we dont already have the node, we'll inject it into the 
            //  sorted list of nodes, add it to the nodesById collection, and 
            //  create an empty array in the edgesByNodeId collection.
            
            var searchResults = binarySearchById(_nodes, node);
            _nodes.splice(searchResults.index, 0, node);
            
            nodesById[node.getId()] = node;
            
            edgesByNodeId[node.getId()] = [];
        };
        this.removeNode = function removeNode (node) {
            // summary:
            //      Removes a node from the graph. Will also remove the edges 
            //      attached to the node.  If the node does not exist in the 
            //      graph, this method will be a no-op. O(e log v)
            // node: Node|String
            //      Node (or node's ID) to remove from the graph.
            // returns:
            //      Array<Edge>. Edges that were attached to the node.
            
            if ( !this.hasNode(node) ) {
                return;
            }
            
            // if we have the node, make sure to do the following:
            //      - remove it from the list of nodes: _nodes
            //      - remove it from nodesById mapping
            //      - remove the edges attached to the node.
            //      - remove the edgesByNodeId entry for the node
            
            var searchResults = binarySearchById(_nodes, node);
            _nodes.splice(searchResults.index, 1);
            
            delete nodesById[node.getId()];
            
            var edges = edgesByNodeId[node.getId()];
            for ( var i = 0, length = edges.length; i < length; i++ ) {
                this.removeEdge(edges[i]);
            }
            delete edgesByNodeId[node.getId()];
            
            return edges;
        };
        this.getEdges = function getEdges () {
            // summary:
            //      Gets all of the edges in the graph.
            // returns:
            //      Array containing all of the edges in the graph.
            
            return _edges.slice();
        };
        this.getOutgoingEdges = function getOutgoingEdges (node) {
            // summary:
            //      Returns an array containing references to all of the 
            //      outgoing edges of the specified Node. If the graph does not 
            //      contain the specified node, this function will throw an 
            //      error. O(1)
            // node: graphite.Node
            //      Node to find the outgoing edges for.
            // returns:
            //      Array<graphite.Edge>. Array of outgoing edges from the 
            //      specified node. 
            // throws:
            //      Throws an exception if the node is not in the graph.
            
            if ( !this.hasNode(node) ) {
                throw new Error("Node "+node+" not contained within the graph "+this);
            }
            
            var outgoingEdges = [],
                nodeEdges = edgesByNodeId[node.getId()];
            
            for ( var i = 0, len = nodeEdges.length; i < len; i++ ) {
                outgoingEdges.push(nodeEdges[i]);
            }
            
            return outgoingEdges;
        };
        this.getIncomingEdges = function getIncomingEdges (node) {
            // summary:
            //      Returns an array containing references to all of the 
            //      incoming edges for the specified Node. If the graph does 
            //      not contain the specified node, this function will throw 
            //      an exception. If the graph is undirected, O(1). 
            //      Else: O(E)
            // node: graphite.Node
            //      Node to find the incoming edges for.
            // returns:
            //      Array<graphite.Edge>. Array of incoming edges for the 
            //      specified node. 
            // throws:
            //      Throws an exception if the node is not in the graph.
            
            if ( !this.hasNode(node) ) {
                throw new Error("Node "+node+" not contained within the graph "+this);
            }
            
            if ( !directed ) {
                return this.getOutgoingEdges(node);
            }
            
            var incoming = [];
            
            for ( var i = 0, len = _edges.length; i < len; i++ ) {
                if ( _edges[i].getToNode() === node ) {
                    incoming.push(_edges[i]);
                }
            }
            
            return incoming;
        };
        this.toString = function toString () {
            // summary:
            //      Returns a string representation of the Graph.
            // returns:
            //      String. String representation of the Graph.
            return '<Graph('+this.getId()+')>';
        };
        this.getShortestPath = function getShortestPath(startNode, endNode, edgeWeightCallback, searchHeuristicCallback){
            // summary:
            //      Finds the shortest path between the start node and the end 
            //      node in the graph using Dijkstra's algorithm if heuristic 
            //      is not given, or A* if a heuristic is provided. TODO: A*
            // startNode: Node
            //      The starting point in the graph. If the node is not part of 
            //      the graph an exception will be thrown.
            // endNode: Node
            //      The ending point in the graph. If the node is not part of 
            //      the graph, an exception will be thrown.
            // edgeWeightCallback: function
            //      Callback used to calculate the weight of edges between 
            //      nodes. It will be passed an Edge object. Returns a non-
            //      negative number.
            // searchHeuristicCallback: function
            //      Callback used as a search heuristic for A* pathfinding.
            //      TODO: Figure out what this heuristic will be passed and
            //      should return.
            // returns:
            //      Array<Edge>. The edges required to get from startNode to 
            //      endNode, or null - if no path is possible.
            // throws:
            //      Exception if either the start or end nodes is not part of 
            //      the graph.
            
            if ( !this.hasNode(startNode) || !this.hasNode(endNode) ) {
                throw new Error("One of the endpoint nodes is not contained within the graph.");
            }
            
            // implementation of dijkstra's algorithm from Wikipedia:
            //  http://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
            // TODO: Use a min fibonacci heap instead of naiive solution
            //
            // TODO: conditionally do A* if searchHeuristic Callback is 
            // available
            //

            var unvisited = [];

            for ( var i = 0, len = _nodes.length; i < len; i++ ) {
                _nodes[i].meta('distance', Number.POSITIVE_INFINITY);
                _nodes[i].meta('visited', false);
                _nodes[i].meta('best_incoming_edge', null);
                unvisited.push(_nodes[i]);
            }
            startNode.meta('distance', 0);
            
            function popMin(){
                var minDistance = Number.POSITIVE_INFINITY;
                var minDistanceIndex = 0;

                for ( var i = 0, len = unvisited.length; i < len; i++ ) {
                    if ( unvisited[i].meta('distance') < minDistance ) {
                        minDistance = unvisited[i].meta('distance');
                        minDistanceIndex = i;
                    }
                }

                var result = unvisited[minDistanceIndex];
                unvisited.splice(minDistanceIndex, 1);
                return result;
            }

            while ( unvisited.length > 0 ) {
                var current = popMin();

                if ( current.meta('distance') === Number.POSITIVE_INFINITY ) {
                    return null;
                }

                if ( current === endNode ) {
                    // we're done...
                    break;
                }

                var outgoingEdges = this.getOutgoingEdges(current);
                for ( var i = 0, len = outgoingEdges.length; i < len; i++ ) {
                    var neighbor = outgoingEdges[i].getToNode();
                    var stepDistance = edgeWeightCallback(current, neighbor);
                    var total = current.meta('distance') + stepDistance;

                    if ( total < neighbor.meta('distance') ) {
                        neighbor.meta('distance', total);
                        neighbor.meta('best_incoming_edge', outgoingEdges[i]);
                    }
                }
            }

            // reconstruct the path.
            var path = [];
            while ( current !== startNode ) {
                path.unshift(current.meta('best_incoming_edge'));
                current = path[0].getFromNode();
            }

            // reset all the meta data.
            for ( var i = 0, len = _nodes.length; i < len; i++ ) {
                _nodes[i].resetMeta();
            }

            return path;
        };

        // ------------- begin setup ---------------- //
        
        for ( var i = 0, length = nodes.length; i < length; i++ ) {
            this.addNode(nodes[i]);
        }
        
        for ( var i = 0, length = edges.length; i < length; i++ ) {
            this.addEdge(edges[i]);
        }
    };

    function drawRaphaelGraph(paper, graph, options) {
        // summary:
        //      Draws the provided graph onto the given RaphaelJS Paper object.
        //      Will use a force-directed layout algorithm. 
        //
        //      TODO: allow for various layout algorithms. 
        //
        //      Adds references to the Raphael elements to the nodes and edges 
        //      as attributes. Will use the ID function so that the references 
        //      are unique to the drawing, unless a value for the "drawingId" 
        //      parameter is provided in the options.
        //
        //      NOTE: Written for RaphaelJS 2.1.0
        // paper: RaphaelJS Paper
        //      Drawing surface where the graph will be drawn.
        // graph: graphite.Graph
        //      Graphite graph object.
        // options: Object
        //      Settings for the drawing. Defaults are shown below.
        //      
        //          // top: Number
        //          //      The top edge of the drawing area for the graph.
        //          top: 0,
        //
        //          // left: Number
        //          //      The left edge of the drawing area for the graph.
        //          left: 0,
        //
        //          // width: Number
        //          //      The width of the drawing area for the graph.
        //          width: 500,
        //
        //          // height: Number
        //          //      The height of the drawing area for the graph.
        //          height: 500,
        //
        //          // drawingId: Number|String
        //          //      ID for the drawing. This ID will be used as a key 
        //          //      on the nodes/edges in the graph in order to inject 
        //          //      attributes into those objects for references to 
        //          //      the Raphael Elements.
        //          drawingId: /* generated */
        //
        //          // edgeLengthCallback: function(nodeA, nodeB)
        //          //      Function used to provide insight into the lengths 
        //          //      of the edges in the graph.  Should return a number 
        //          //      representing the distance from `nodeA` to `nodeB`.
        //          edgeLengthCallback: function(nodeA, nodeB) 
        //      
        // returns:
        //      Object. Example:
        //      
        //          // drawingId: Number|String. 
        //          //      The ID of the drawing, if it wasn't supplied in the
        //          //      options object, one will be generated.
        //          drawingId: /* generated */,
        //
        //          // raphaelSet: RaphaelJS Set object
        //          //      RaphaelJS set object containing the nodes and 
        //          //      edges of the graph.
        //          raphaelSet: ...
        //      

        if ( typeof options === 'undefined' ) {
            options = {};
        }
        
        // set up defaults.
        var top = options.top || 0,
            left = options.left || 0,
            width = options.width || 500,
            height = options.height || 500,
            drawingId = options.drawingId || generateID('drawing'),
            edgeLengthCallback = options.edgeLengthCallback || function() { return 100; };

        // get the graph elements
        var nodes = graph.getNodes(),
            edges = graph.getEdges();

        // iteration variables
        var i, j, k, iLen, jLen, kLen;

        // drawing settings. TODO: make these configurable.
        var nodeRadius = 20,
            nodeColor = '#000000',
            nodeLabelColor = '#FFFFFF',
            nodeLabelSize = 8,
            edgeColor = '#000000',
            edgeWidth = 2,
            edgeArrowSize = 10;

        var resultSet = paper.set();

        // build the elements for the nodes.
        for ( i = 0, iLen = nodes.length; i < iLen; i++ ) {
            var nodeGroup = nodes[i].attr(
                    drawingId, 
                    paper.set()
                ),
                nodeElem = paper.circle(0, 0, nodeRadius),
                nodeLabel = paper.text(0, 0, nodes[i].attr('label') || nodes[i].getId()+'');

            // Add the circle and label to the node group, and place the group 
            //  randomly inside the display area.
            nodeGroup.push(nodeElem, nodeLabel);
            var x = Math.random()*width + left,
                y = Math.random()*height + top;
            nodeGroup.attr({
                x: x,
                y: y,
                cx: x,
                cy: y
            });

            nodeElem.attr({
                fill: nodeColor
            });

            nodeLabel.attr({
                "text-anchor": "middle",
                fill: nodeLabelColor
            });

            resultSet.push(nodeGroup);
        }

        // TODO
        
        return {
            drawingId: drawingId,
            raphaelSet: resultSet
        };
    }
    
    var graphite = {
        Node: Node,
        Edge: Edge,
        Graph: Graph,
        drawRaphaelGraph: drawRaphaelGraph 
    };
    
    // export the graphite library.
    if ( typeof define === 'function' ) {
        // export via AMD.
        define(function(){ return graphite; });
    } else if (typeof module !== 'undefined' && module.exports) {
        // export via CommonJS
        module.exports = graphite;
    } else if ( typeof window !== 'undefined' ) {
        // export for plain old JS in the browser
        window.graphite = graphite;
    }
})();
