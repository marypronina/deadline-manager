<template>
    <section>
        <div class="container center">
            <h1>Welcome to <br /> <span class="accent">Deadline</span> Manager</h1>

            <div class="container auth">
                <Login v-if="authType === 'login'" @successLogin="routeToHome" @setAuthType="setAuthType" />
                <Registration v-if="authType === 'registration'" @successRegistration="routeToHome"
                    @setAuthType="setAuthType" />
            </div>
        </div>
    </section>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Login from './login.vue';
import Registration from './registration.vue';

export default {
    components: {
        Login,
        Registration,
    },
    setup() {
        const router = useRouter();
        const authType = ref("login");

        const routeToHome = () => {
            router.push('/home');
        };

        const setAuthType = (newAuthType) => {
            authType.value = newAuthType;
        }

        return { authType, routeToHome, setAuthType };
    }
}
</script>



<style scoped>
section {
    height: 100%;
}

form {
    margin-top: 125px;
}
</style>
