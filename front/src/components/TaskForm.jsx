import { useState } from "react";
import "./TaskForm.css";

const Status = [
  { value: "A_FAIRE", label: "À faire" },
  { value: "TERMINEE", label: "Terminée" },
];

const TaskForm = ({ onCreate, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assignation, setAssignation] = useState("");
  const [error, setError] = useState("");

  const isNameValid = name.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault(); // empêche le rechargement de la page
  };
};
