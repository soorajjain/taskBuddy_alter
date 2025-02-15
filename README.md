# Task Management Tool

## Overview

This is a responsive task management application built using React and TypeScript, with Firebase integration for authentication and data storage. The application allows users to create, organize, and track their tasks efficiently with features like task categorization, sorting, drag-and-drop, batch actions, and customizable views.

## Features

### 1. User Authentication

- Firebase Authentication with Google Sign-In.

### 2. Task Management

- Create, edit, and delete tasks.
- Categorize tasks as 'Work' or 'Personal'.
- Set due dates for tasks.
- Drag-and-drop to rearrange tasks.
- Sort tasks by due date (ascending/descending).

### 3. Batch Actions

- Delete multiple tasks at once.
- Mark multiple tasks as complete.

### 4. Task History & Activity Log

- Tracks creation, edits, and deletions.
- Displays an activity log for each task.

### 5. File Attachments

- Upload files when creating/editing tasks.
- View attached files in task details.
- **File Storage Implementation:**
  - Store the file in `localStorage` as a Blob (binary data) or Base64 string.
  - Use `FileReader` to convert the file into a Base64 string before storage.
  - Generate a URL for the file and store this URL in the database (instead of storing the Base64 string directly).
  - Retrieve the file using the saved URL in `localStorage` and display it when needed.

### 6. Filtering & Search

- Filter tasks by category, tags, and date range.
- Search tasks by title.

### 7. Board/List View

- Switch between Kanban-style board view and list view.

### 8. Responsive Design

- Mobile-first approach ensuring usability on all screen sizes.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Firebase Firestore for database
- **Authentication:** Firebase Authentication (Google Sign-In)
- **Hosting:** Github Hosting

## Installation & Setup

### Prerequisites

- Node.js (v16+ recommended)
- Firebase account

### Steps to Run the Project

1. Clone the repository:
   ```sh
   git clone https://github.com/soorajjain/taskBuddy_alter.git
   cd task-management-tool
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore Database and Firebase Authentication (Google Sign-In).
   - Get Firebase configuration details and add them to `.env`:
     ```sh
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Deployment

- The project is deployed at: [Live Demo](https://soorajjain.github.io/taskBuddy_alter)

## Challenges Faced & Solutions

1. **Drag-and-Drop Complexity:** Used `react-beautiful-dnd` to enhance user experience.
2. **Task History Tracking:** Created a separate collection to store all task activity logs.
3. **File storage:** Since I didn’t have a cloud storage subscription, I used localStorage to store file data. Additionally, I used browser-image-compression to compress and store images efficiently.

## Future Enhancements

- Dark mode support.
- More customizable filters.

## License

This project is open-source and available under the MIT License.

## Contact

For any inquiries or hiring opportunities, please reach out to:

- **Name:** Sooraj Jain
- **Email:** [soorajjain51@gmail.com](mailto:soorajjain51@gmail.com)
- **Phone:** +91 9945732421
- **Location:** Bangalore


# taskBuddy
# taskBuddy
# taskBuddy_alter
