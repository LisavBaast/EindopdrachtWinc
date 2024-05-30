import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heading,
  Image,
  Text,
  List,
  ListItem,
  Button,
  Input,
} from "@chakra-ui/react";
import { fetchEvents, fetchCategories } from "../components/EventService";
import AddEventModal from "../components/AddEventModal";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const getEventsAndCategories = async () => {
      try {
        const [eventsData, categoriesData] = await Promise.all([
          fetchEvents(),
          fetchCategories(),
        ]);
        setEvents(eventsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    getEventsAndCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
  };

  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearchTerm = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? event.categoryIds.includes(parseInt(selectedCategory))
      : true;
    return matchesSearchTerm && matchesCategory;
  });

  return (
    <div>
      <Heading as="h1" size="lg">
        Events
      </Heading>
      <label htmlFor="categoryFilter">Filter category: </label>
      <select
        id="categoryFilter"
        onChange={handleCategoryChange}
        value={selectedCategory}
      >
        <option value="">All</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button colorScheme="blue" onClick={() => setIsModalOpen(true)}>
        Add event
      </Button>
      <List spacing={4}>
        {filteredEvents.map((event) => {
          const eventCategories = event.categoryIds
            .map((categoryId) => {
              const category = categories.find(
                (cat) => String(cat.id) === String(categoryId)
              );
              return category ? category.name : "Unknown";
            })
            .filter((name) => name !== "Unknown")
            .join(", ");

          return (
            <ListItem key={event.id}>
              <Link to={`/events/${event.id}`}>
                <Heading>{event.title}</Heading>
                <Text>{event.description}</Text>
                <Image src={event.image} />
                <Text>
                  Starttime: {new Date(event.startTime).toLocaleString()}
                </Text>
                <Text>Endtime: {new Date(event.endTime).toLocaleString()}</Text>
                <Text>Categories: {eventCategories}</Text>
              </Link>
            </ListItem>
          );
        })}
      </List>
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addEvent={addEvent}
      />
    </div>
  );
};

export default EventsPage;
