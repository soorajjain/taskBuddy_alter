import { db } from "../firebase.ts";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy, where, writeBatch } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const addActivityHistory = async (taskId, action) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Get the current user's ID

  if (!userId) {
    throw new Error("User not authenticated.");
  }

  try {
    await addDoc(collection(db, "activity_history"), {
      taskId,
      action,
      userId, // Add userId to the activity history
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Error adding activity history: ", e);
  }
};

export const addTask = async (task) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Get the current user's ID

  if (!userId) {
    throw new Error("User not authenticated.");
  }

  try {
    // const attachmentURLs = await Promise.all(
    //   task.attachments.map(async (compressedFile) => {
    //     return compressedFile.fileKey;
    //   })
    // );

    const tasksSnapshot = await getDocs(query(collection(db, "tasks"), orderBy("orderIndex", "asc")));

    const batch = writeBatch(db);
    tasksSnapshot.docs.forEach((doc) => {
      const taskData = doc.data();
      batch.update(doc.ref, {
        orderIndex: taskData.orderIndex + 1,
      });
    });

    const docRef = await addDoc(collection(db, "tasks"), {
      ...task,
      // attachments: attachmentURLs,
      created_at: new Date().toISOString(),
      orderIndex: 0,
      userId, // Add the userId to the task document
    });


    await addActivityHistory(docRef.id, `Task "${task.title}" created`);

    await batch.commit();

  } catch (e) {
    console.error("Error adding task: ", e);
  }
};

export const updateTask = async (id, updatedTask) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Get the current user's ID

  if (!userId) {
    throw new Error("User not authenticated.");
  }

  try {
    const taskRef = doc(db, "tasks", id);
    const taskSnapshot = await getDoc(taskRef);

    if (taskSnapshot.exists()) {
      const task = taskSnapshot.data();

      // Check if the current user is the owner of the task
      if (task.userId !== userId) {
        throw new Error("You are not authorized to update this task.");
      }

      const currentStatus = task.track_status;
      const newStatus = updatedTask.track_status;

      if (currentStatus !== newStatus) {
        await addActivityHistory(id, `Task "${task.title}" status updated to "${newStatus}"`);
      }

      await updateDoc(taskRef, updatedTask);
    }
  } catch (e) {
    console.error("Error updating task: ", e);
  }
};

export const deleteTask = async (id) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Get the current user's ID

  if (!userId) {
    throw new Error("User not authenticated.");
  }

  try {
    const taskRef = doc(db, "tasks", id);
    const taskSnapshot = await getDoc(taskRef);

    if (taskSnapshot.exists()) {
      const task = taskSnapshot.data();

      // Check if the current user is the owner of the task
      if (task.userId !== userId) {
        throw new Error("You are not authorized to delete this task.");
      }

      await addActivityHistory(id, `Task "${task.title}" marked as deleted`);
      await deleteDoc(taskRef);
    }
  } catch (e) {
    console.error("Error deleting task: ", e);
  }
};

export const getTasks = async () => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Get the current user's ID

  if (!userId) {
    throw new Error("User not authenticated.");
  }

  try {
    // Query with ordering by orderIndex first, then created_at, and filter by userId
    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", userId), // Filter by userId
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
  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Get the current user's ID

  if (!userId) {
    throw new Error("User not authenticated.");
  }

  try {
    const batchUpdates = tasks.map(async (task, index) => {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, { orderIndex: index });
    });
    await Promise.all(batchUpdates);
  } catch (e) {
    console.error("Error updating task order: ", e);
  }
};

export const getActivityLogs = async (taskId) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Get the current user's ID

  if (!userId) {
    throw new Error("User not authenticated.");
  }

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