import pb from '../services/pocketBase';

export async function getUserLinks(userId) {
    try {
        const links = await pb.collection('links').getFullList({
            expand: 'task.group.user',
            filter: `task.group.user.id="${userId}"`
        });
        return links;
    } catch (error) {
        console.error('Error fetching links: ', error);
    }
}

export async function createLink(link) {
    try {
        const createdLink = await pb.collection('links').create(link);
        return createdLink;
    } catch (error) {
        console.error('Error creating link: ', error);
    }
}