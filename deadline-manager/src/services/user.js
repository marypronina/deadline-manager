import pb from '../services/pocketBase';

export async function getCurrentUser() {
    try {
        const user = await pb.authStore.model;

        return user;
    } catch (error) {
        console.error('Error user authentication: ', error);
    }
}