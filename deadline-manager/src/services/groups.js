import pb from '../services/pocketBase';

export async function getUserGroups(userId) {
    try {
        const response = await pb.collection('task_groups').getFullList({
            filter: `user.id="${userId}"`
        });
        
        return response;
    } catch (error) {
        console.error('Error fetching user groups: ', error);
    }
}

export async function createGroup(group) {
    try {
        const createdGroup = await pb.collection('task_groups').create(group);
        return createdGroup;
    } catch (error) {
        console.error('Error creating group: ', error);
    }
}