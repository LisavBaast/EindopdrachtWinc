import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchEvents,
  fetchUsers,
  updateEvent,
  deleteEvent,
} from "../components/EventService";
import EditEventModal from "../components/EditEventModal";
import {
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";

export const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  useEffect(() => {
    const getEventAndUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const [eventsData, usersData] = await Promise.all([
          fetchEvents(),
          fetchUsers(),
        ]);
        const eventDetails = eventsData.find((event) => event.id === id);
        setEvent(eventDetails);
        setUsers(usersData);
      } catch (error) {
        setError("Het ophalen van het evenement is mislukt.");
      } finally {
        setLoading(false);
      }
    };

    getEventAndUsers();
  }, [id]);

  if (loading) {
    return <div>Evenement wordt geladen...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!event) {
    return <div>Evenement niet gevonden.</div>;
  }

  console.log("Event Details:", event);
  console.log("Users:", users);

  const createdByUser = users.find(
    (user) => String(user.id) === String(event.createdBy)
  );
  const createdByName = createdByUser
    ? createdByUser.name
    : "Onbekende gebruiker";
  const createdByImage = createdByUser ? createdByUser.image : "";

  // Update evenementdetails
  const handleSaveEvent = async (editedEvent) => {
    try {
      await updateEvent(editedEvent);
      setEvent(editedEvent);
      toast({
        title: "Evenement bijgewerkt",
        description: "De wijzigingen zijn succesvol opgeslagen.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Fout bijwerken evenement",
        description:
          "Er is een fout opgetreden bij het bijwerken van het evenement.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Delete event
  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(id);
      toast({
        title: "Event deleted",
        description: "The event is deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Delete is going wrong",
        description: "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <Button onClick={() => setIsEditModalOpen(true)}>Edit</Button>
      <Button colorScheme="red" onClick={onOpen}>
        Delete
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Event
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure that you want to delete the event?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteEvent} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={event}
        onSave={handleSaveEvent}
      />
      <h1>{event.title}</h1>
      <img src={event.image} alt={event.title} />
      <p>{event.description}</p>
      <p>Location: {event.location}</p>
      <p>Starttime: {new Date(event.startTime).toLocaleString()}</p>
      <p>Endtime: {new Date(event.endTime).toLocaleString()}</p>
      <p>Created By: {createdByName}</p>
      {createdByImage && (
        <img
          src={createdByImage}
          alt={createdByName}
          style={{ width: "100px", borderRadius: "50%" }}
        />
      )}
    </div>
  );
};

export default EventPage;
