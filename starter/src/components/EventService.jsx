//Get events
const API_URL_EVENTS = "http://localhost:3000/events";

export const fetchEvents = async () => {
  const response = await fetch(API_URL_EVENTS);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const addEventToServer = async (newEvent) => {
  const response = await fetch(API_URL_EVENTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newEvent),
  });
  if (!response.ok) {
    throw new Error("Failed to add new event");
  }
  return response.json();
};

//Get Users
const API_URL_USERS = "http://localhost:3000/users";

export const fetchUsers = async () => {
  const response = await fetch(API_URL_USERS);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await response.json();
  return data;
};

//Get Categories
const API_URL_CATEGORIES = "http://localhost:3000/categories";

export const fetchCategories = async () => {
  const response = await fetch(API_URL_CATEGORIES);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  const data = await response.json();
  return data;
};

// Update Event
export const updateEvent = async (updatedEvent) => {
  try {
    const response = await fetch(
      `http://localhost:3000/events/${updatedEvent.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update event");
    }
    return updatedEvent;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

//Delete event
export const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`http://localhost:3000/events/${eventId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete event");
    }
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};
