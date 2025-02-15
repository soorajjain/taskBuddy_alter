import { db, storage } from "../firebase.ts";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy, where, writeBatch } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Helper function to add activity history
const addActivityHistory = async (taskId, action) => {
  try {
    await addDoc(collection(db, "activity_history"), {
      taskId,
      action,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Error adding activity history: ", e);
  }
};

export const addTask = async (task) => {
  console.log(task);
  try {
    const attachmentURLs = await Promise.all(
      task.attachments.map(async (compressedFile) => {
        return compressedFile.fileKey;
      })
    );

    // Get the existing tasks ordered by 'orderIndex'
    const tasksSnapshot = await getDocs(query(collection(db, "tasks"), orderBy("orderIndex", "asc")));

    // Increment the orderIndex of all existing tasks
    const batch = writeBatch(db);
    tasksSnapshot.docs.forEach((doc) => {
      const taskData = doc.data();
      batch.update(doc.ref, {
        orderIndex: taskData.orderIndex + 1,
      });
    });

    // Add the new task with orderIndex 0
    const docRef = await addDoc(collection(db, "tasks"), {
      ...task,
      attachments: attachmentURLs,
      created_at: new Date().toISOString(),
      orderIndex: 0,
    });

    console.log("Task added with ID: ", docRef.id);

    await addActivityHistory(docRef.id, `Task "${task.title}" created`);

    await batch.commit();

  } catch (e) {
    console.error("Error adding task: ", e);
  }
};


export const updateTask = async (id, updatedTask) => {
  try {
    const taskRef = doc(db, "tasks", id);
    const taskSnapshot = await getDoc(taskRef);

    if (taskSnapshot.exists()) {
      const task = taskSnapshot.data();
      const currentStatus = task.track_status;
      const newStatus = updatedTask.track_status;

      if (currentStatus !== newStatus) {
        await addActivityHistory(id, `Task "${task.title}" status updated to "${newStatus}"`);
      }

      await updateDoc(taskRef, updatedTask);
      console.log("Task updated with ID: ", id);
    }
  } catch (e) {
    console.error("Error updating task: ", e);
  }
};

export const deleteTask = async (id) => {
  try {
    const taskRef = doc(db, "tasks", id);
    const taskSnapshot = await getDoc(taskRef);

    if (taskSnapshot.exists()) {
      const task = taskSnapshot.data();
      await addActivityHistory(id, `Task "${task.title}" marked as deleted`);
      await deleteDoc(taskRef);
      console.log("Task deleted with ID: ", id);
    }
  } catch (e) {
    console.error("Error deleting task: ", e);
  }
};

export const getTasks = async () => {
  try {
    // Query with ordering by orderIndex first, then created_at
    const tasksQuery = query(
      collection(db, "tasks"),
      orderBy("orderIndex", "asc")
    );

    const querySnapshot = await getDocs(tasksQuery);
    const tasks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return tasks;
  } catch (e) {
    console.error("Error getting tasks: ", e);
    return [];
  }
};


export const updateTaskOrder = async (tasks) => {
  try {
    const batchUpdates = tasks.map(async (task, index) => {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, { orderIndex: index });
    });
    await Promise.all(batchUpdates);
    console.log("Task order updated successfully");
  } catch (e) {
    console.error("Error updating task order: ", e);
  }
};

export const getActivityLogs = async (taskId) => {
  try {
    let activityQuery = taskId 
      ? query(
          collection(db, "activity_history"), 
          where("taskId", "==", taskId),
          orderBy("timestamp", "desc") // Order by timestamp in descending order (newest first)
        ) 
      : query(
          collection(db, "activity_history"),
          orderBy("timestamp", "desc") // Order by timestamp in descending order for all records
        );

    const querySnapshot = await getDocs(activityQuery);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error getting activity logs: ", e);
    return [];
  }
};

