<template>
    <div class="container auth">
        <form @submit.prevent="login">
            <div>
                <label for="email">Enter your email:<br /> </label>
                <input v-model="email" type="email" name="email" id="email" class="auth"
                    placeholder="deadlinemanager@gmail.com" required />
            </div>
            <div>
                <label for="password">Enter your password:<br /> </label>
                <input v-model="password" type="password" name="password" id="password" class="auth" required />
            </div>
            <div class="cntr">
                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
                <button type="submit" class="btn primary-btn">Log in</button>
                <a @click.prevent="openRegistration">First time here? <span class="link link-small">Register!</span></a>
            </div>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue';
import pb from '../services/pocketBase';

export default {
    emits: ['successLogin', 'setAuthType'],

    setup(_, { emit }) {
        const email = ref("");
        const password = ref("");
        const errorMessage = ref("");

        const login = async () => {
            try {
                pb.authStore.clear();

                const authData = await pb.collection('users').authWithPassword(email.value, password.value);
                if (pb.authStore.isValid) {
                    emit('successLogin');
                }
            } catch (error) {
                errorMessage.value = "Wrong email or password. Please try again.";
            }
        };

        const openRegistration = () => {
            emit('setAuthType', 'registration');
        };

        return { email, password, login, errorMessage, openRegistration };
    }
}
</script>



<style scoped>
form {
    margin-top: 125px;
}
</style>