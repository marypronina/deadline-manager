import pb from '../services/pocketBase';

export async function getUserTasks(userId) {
    try {
        const response = await pb.collection('tasks').getFullList({
            expand: 'group.user',
            filter: `group.user.id = "${userId}"`
        });

        return response;
    } catch(error) {
        console.error('Error fetching user tasks: ', error);
    }
}

export async function createTask(task) {
    try {
        const createdTask = await pb.collection('tasks').create(task);
        return createdTask;
    } catch (error) {
        console.error('Error creating task: ', error);
    }
}

export async function markTaskAsDone(taskId) {
    try {
        const updated = await pb.collection('tasks').update(taskId, {
            status: "done",
        });
    } catch (error) {
        console.error('Error setting status task: ', error);
    }
}