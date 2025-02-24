<template>
    <div class="container auth">
        <form @submit.prevent="register">
            <div>
                <label for="email">Enter your email:<br /> </label>
                <input v-model="email" type="email" name="email" id="email" class="auth"
                    placeholder="deadlinemanager@gmail.com" required />
            </div>
            <div>
                <label for="name">Enter your username:<br /> </label>
                <input v-model="name" type="text" name="name" id="name" class="auth" placeholder="Jane Doe" required />
            </div>
            <div>
                <label for="password">Enter your password:<br /> </label>
                <input v-model="password" type="password" name="password" id="password" class="auth" required />
            </div>
            <div>
                <label for="password">Enter your password again:<br /> </label>
                <input v-model="passwordConfirmation" type="password" name="passwordConfirmation"
                    id="passwordConfirmation" class="auth" required />
            </div>
            <div class="cntr">
                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
                <button type="submit" class="btn primary-btn">Register</button>
                <a @click.prevent="openLogin">Already have an account? <span class="link link-small">Get back to
                        login!</span></a>
            </div>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue';
import PocketBase from 'pocketbase';

export default {
    emits: ['successRegistration', 'setAuthType'],

    setup(_, { emit }) {
        const email = ref("");
        const name = ref("");
        const password = ref("");
        const passwordConfirmation = ref("");

        const errorMessage = ref("");

        const register = async () => {
            try {
                const pb = new PocketBase('http://127.0.0.1:8090');

                const user = await pb.collection('users').create({
                    email: email.value,
                    name: name.value,
                    password: password.value,
                    passwordConfirm: passwordConfirmation.value,
                });
                
                emit('successRegistration');
            } catch (error) {
                console.log(error.data);
                if (error?.data?.data?.email) {
                    errorMessage.value = "User with this email already exists.";
                } else if (error?.data?.data?.passwordConfirm) {
                    errorMessage.value = `Passwords don't match. Please check them.`;
                } else if (error?.data?.data?.password) {
                    errorMessage.value = `Passwords should have at least 8 characters.`;
                } else {
                    errorMessage.value = "Something went wrong. Please try again.";
                }
            }
        };

        const openLogin = () => {
            emit('setAuthType', 'login');
        };

        return { email, name, password, passwordConfirmation, register, errorMessage, openLogin };
    }
}
</script>



<style scoped>
form {
    margin-top: 125px;
}
</style>