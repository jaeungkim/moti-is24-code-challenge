"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import PersonForm from "./PersonForm";
import RelationshipForm from "./RelationshipForm";
import cytoscape, { Core } from "cytoscape";
import dagre from "cytoscape-dagre";
import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import EditPersonForm from "./EditPersonForm";

interface NodeData {
  personId: string;
  id: string;
  name: string;
}

interface EdgeData {
  relationshipId: string;
  id: string;
  source: string;
  target: string;
  label: string;
}

interface GraphData {
  nodes: { data: NodeData }[];
  edges: { data: EdgeData }[];
}

cytoscape.use(dagre);

const RelationshipGraph = () => {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
  });
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [showRelationshipForm, setShowRelationshipForm] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editError, setEditError] = useState<any>(null);
  const [personFormServerError, setPersonFormServerError] = useState<
    string | null
  >(null);
  const [relationshipFormServerError, setRelationshipFormServerError] =
    useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<
    string | null
  >(null);

  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedPersonName, setSelectedPersonName] = useState<string | null>(
    null
  );

  const [entityToDelete, setEntityToDelete] = useState<
    "relationship" | "person" | null
  >(null);

  const [cyInstance, setCyInstance] = useState<Core | null>(null);

  const handleEditSubmit = async (formData: any, personId: any) => {
    try {
      const response = await axios.put(
        `http://localhost:3030/api/person/${personId}`,
        formData
      );
      console.log("Updated successfully", response.data);
    } catch (error) {
      console.error("Error updating person:", error);
      setEditError("Error updating person");
    }
  };

  const deleteRelationship = async () => {
    if (!selectedRelationshipId || !cyInstance) return;

    try {
      await axios.delete(
        `http://localhost:3030/api/relationships/${selectedRelationshipId}`
      );

      const edgeToRemove = cyInstance.elements(
        `edge[relationshipId="${selectedRelationshipId}"]`
      );
      edgeToRemove.remove();

      setGraphData((prevData) => ({
        ...prevData,
        edges: prevData.edges.filter(
          (edge) => edge.data.relationshipId !== selectedRelationshipId
        ),
      }));

      setShowConfirmDelete(false);
      setSelectedRelationshipId(null);
    } catch (error) {
      console.error("Error deleting relationship:", error);
    }
  };

  const deletePerson = async () => {
    if (!selectedPersonId || !cyInstance) return;

    try {
      await axios.delete(
        `http://localhost:3030/api/person/${selectedPersonId}`
      );

      const nodeToRemove = cyInstance.elements(
        `node[personId="${selectedPersonId}"]`
      );
      const edgesToRemove = cyInstance.elements(
        `edge[source="${selectedPersonId}"], edge[target="${selectedPersonId}"]`
      );

      nodeToRemove.remove();
      edgesToRemove.remove();

      setGraphData((prevData) => ({
        nodes: prevData.nodes.filter(
          (node) => node.data.personId !== selectedPersonId
        ),
        edges: prevData.edges.filter(
          (edge) =>
            edge.data.source !== selectedPersonId &&
            edge.data.target !== selectedPersonId
        ),
      }));

      setShowConfirmDelete(false);
      setSelectedPersonId(null);
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  };

  const handleDelete = (
    entityType: "relationship" | "person",
    entityId: string | null
  ) => {
    setShowConfirmDelete(true);
    setEntityToDelete(entityType);
    if (entityType === "relationship") {
      setSelectedRelationshipId(entityId);
    } else if (entityType === "person") {
      setSelectedPersonId(entityId);
    }
  };

  useEffect(() => {
    const fetchGraphData = async () => {
      const persons = await axios.get("http://localhost:3030/api/person");
      const relationships = await axios.get(
        "http://localhost:3030/api/relationships"
      );

      const nodes = persons.data.map((person: any) => ({
        data: { id: person.name, name: person.name, personId: person._id },
      }));

      const edges = relationships.data.map((rel: any, index: number) => ({
        data: {
          id: `e${index}`,
          source: rel.person1,
          target: rel.person2,
          label: rel.relationshipType,
          relationshipId: rel._id,
        },
      }));

      setGraphData({ nodes, edges });
    };

    fetchGraphData();
  }, []);

  useEffect(() => {
    if (graphData.nodes.length && graphData.edges.length) {
      if (!cyInstance) {
        const cy: Core = cytoscape({
          container: document.getElementById("cy"),
          elements: {
            nodes: graphData.nodes,
            edges: graphData.edges,
          },
          style: [
            {
              selector: "node",
              style: {
                "background-color": "#666",
                label: "data(name)",
              },
            },
            {
              selector: "edge",
              style: {
                width: 2,
                "line-color": "#ccc",
                "target-arrow-color": "#ccc",
                "target-arrow-shape": "triangle",
                label: "data(label)",
                "curve-style": "bezier",
                "control-point-step-size": 40,
              },
            },
          ],
          layout: {
            name: "dagre",
            nodeSep: 300,
            edgeSep: 0,
            rankSep: 50,
            fit: true,
            animate: true,
          } as any,
        });

        setCyInstance(cy);

        cy.on("tap", "node", function (evt: any) {
          const personId = evt.target.data("personId");
          const personName = evt.target.data("name");
          setSelectedPersonName(personName);
          // handleDelete("person", personId);
          setSelectedPersonId(personId);
          setShowActionModal(true);
        });

        cy.on("tap", "edge", function (evt: any) {
          const relationshipId = evt.target.data("relationshipId");
          handleDelete("relationship", relationshipId);
        });
      }
    }
  }, [graphData]);

  const handlePersonFormSubmit = async (data: any) => {
    try {
      const response = await axios.post(
        "http://localhost:3030/api/person",
        data
      );
      setPersonFormServerError(null);
      setGraphData((prevData: any) => ({
        ...prevData,
        nodes: [
          ...prevData.nodes,
          { data: { id: response.data.name, name: response.data.name } },
        ],
      }));
      setShowPersonForm(false);
    } catch (error: any) {
      console.error("Error creating person:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setPersonFormServerError(error.response.data.message);
      } else {
        setPersonFormServerError(
          "An error occurred while submitting the form."
        );
      }
    }
  };

  const handleRelationshipFormSubmit = async (data: any) => {
    try {
      const response = await axios.post(
        "http://localhost:3030/api/relationships",
        data
      );

      setRelationshipFormServerError(null);

      const newEdgeId = `e${graphData.edges.length}`;

      setGraphData((prevData: any) => ({
        ...prevData,
        edges: [
          ...(prevData.edges || []),
          {
            data: {
              id: newEdgeId,
              source: response.data.person1,
              target: response.data.person2,
              label: response.data.relationshipType,
            },
          },
        ],
      }));

      setShowRelationshipForm(false);
    } catch (error: any) {
      console.error("Error creating relationship:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setRelationshipFormServerError(error.response.data.message);
      } else {
        setRelationshipFormServerError(
          "An error occurred while submitting the form."
        );
      }
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowAddPersonModal(true)}
        className="bg-green-500 text-white p-2 rounded"
      >
        Add a Person
      </button>

      <button
        onClick={() => setShowRelationshipForm(true)}
        className="bg-green-500 text-white p-2 rounded"
      >
        Add a Relationship
      </button>

      <AnimatePresence>
        {showActionModal && (
          <Transition appear show={showActionModal}>
            <Dialog
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center"
              onClose={() => setShowActionModal(false)}
            >
              <div className="fixed inset-0 bg-black opacity-30"></div>
              <div className="bg-white p-4 max-w-md mx-auto rounded shadow z-20">
                <Dialog.Title className="text-lg font-medium">
                  {`Actions for ${selectedPersonName}`}
                </Dialog.Title>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setShowActionModal(false);
                      setShowEditForm(true);
                    }}
                    className="btn btn-primary mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowActionModal(false);
                      handleDelete("person", selectedPersonId);
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showEditForm && (
          <Transition appear show={showEditForm}>
            <Dialog
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center"
              onClose={() => setShowEditForm(false)}
            >
              <div className="fixed inset-0 bg-black opacity-30"></div>
              <div className="bg-white p-4 max-w-md mx-auto rounded shadow z-20">
                <Dialog.Title className="text-2xl mb-4">
                  Edit Person
                </Dialog.Title>
                <EditPersonForm
                  personId={selectedPersonId}
                  onSubmit={handleEditSubmit}
                  error={editError}
                  onClose={() => setShowEditForm(false)}
                />
              </div>
            </Dialog>
          </Transition>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddPersonModal && (
          <Transition appear show={showAddPersonModal}>
            <Dialog
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center"
              onClose={() => setShowAddPersonModal(false)}
            >
              <div className="fixed inset-0 bg-black opacity-30"></div>
              <div className="bg-white p-4 max-w-md mx-auto rounded shadow z-20">
                <Dialog.Title className="text-2xl mb-4">
                  Add a New Person
                </Dialog.Title>
                <PersonForm
                  onSubmit={handlePersonFormSubmit}
                  error={personFormServerError}
                />
                <button
                  onClick={() => setShowAddPersonModal(false)}
                  className="bg-red-500 text-white p-2 rounded mt-4"
                >
                  Cancel
                </button>
              </div>
            </Dialog>
          </Transition>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRelationshipForm && (
          <Transition appear show={showRelationshipForm}>
            <Dialog
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center"
              onClose={() => setShowRelationshipForm(false)}
            >
              <div className="fixed inset-0 bg-black opacity-30"></div>
              <div className="bg-white p-4 max-w-md mx-auto rounded shadow z-20">
                <Dialog.Title className="text-2xl mb-4">
                  Add Relationship
                </Dialog.Title>
                <RelationshipForm
                  onSubmit={handleRelationshipFormSubmit}
                  people={graphData.nodes}
                  serverError={relationshipFormServerError}
                />
                <button
                  onClick={() => setShowRelationshipForm(false)}
                  className="bg-red-500 text-white p-2 rounded mt-4"
                >
                  Cancel
                </button>
              </div>
            </Dialog>
          </Transition>
        )}
      </AnimatePresence>

      <div
        id="cy"
        style={{ width: "100vw", height: "calc(100vh - 36px)" }}
      ></div>

      <AnimatePresence>
        {showConfirmDelete && (
          <Transition appear show={showConfirmDelete}>
            <Dialog
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center"
              onClose={() => setShowConfirmDelete(false)}
            >
              <div className="fixed inset-0 bg-black opacity-30"></div>{" "}
              <div className="bg-white p-4 max-w-md mx-auto rounded shadow z-20">
                <Dialog.Title className="text-lg font-medium">
                  {`Delete ${
                    entityToDelete
                      ? entityToDelete.charAt(0).toUpperCase() +
                        entityToDelete.slice(1)
                      : "Entity"
                  }`}
                </Dialog.Title>

                <Dialog.Description className="text-md">
                  {`Are you sure you want to delete this ${entityToDelete}?`}
                </Dialog.Description>
                <div className="mt-4">
                  <button
                    onClick={
                      entityToDelete === "relationship"
                        ? deleteRelationship
                        : deletePerson
                    }
                    className="btn btn-primary mr-2"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RelationshipGraph;
