import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
} from "@chakra-ui/react";
import { addEventToServer, fetchCategories, fetchUsers } from "./EventService";
import { useNavigate } from "react-router-dom";

const AddEventModal = ({ isOpen, onClose, addEvent }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, usersData] = await Promise.all([
          fetchCategories(),
          fetchUsers(),
        ]);
        setCategories(categoriesData);
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch categories or users", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now().toString(),
      title,
      description,
      location,
      startTime,
      endTime,
      image,
      categoryIds: [selectedCategory],
      createdBy: selectedUser,
    };
    try {
      const savedEvent = await addEventToServer(newEvent);
      addEvent(savedEvent);
      onClose();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add new event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Location</FormLabel>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Starttime</FormLabel>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Eindtime</FormLabel>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Image URL</FormLabel>
            <Input value={image} onChange={(e) => setImage(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Select
              placeholder="Selecteer categorie"
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>User</FormLabel>
            <Select
              onChange={(e) => setSelectedUser(e.target.value)}
              value={selectedUser}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Add
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddEventModal;
