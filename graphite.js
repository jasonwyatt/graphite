;(function(){
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
        
        // ------------- begin setup ---------------- //
        
        for ( var i = 0, length = nodes.length; i < length; i++ ) {
            this.addNode(nodes[i]);
        }
        
        for ( var i = 0, length = edges.length; i < length; i++ ) {
            this.addEdge(edges[i]);
        }
    };
    
    var graphite = {
        Node: Node,
        Edge: Edge,
        Graph: Graph
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
