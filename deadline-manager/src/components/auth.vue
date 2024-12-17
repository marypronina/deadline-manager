<template>
    <section>
        <div class="container center">
            <h1>Welcome to <br /> Deadline Manager</h1>

            <div class="container auth">
                <h3>Log in</h3>
                <form action="" method="get">
                    <div>
                        <label for="name">Enter your email:<br /> </label>
                        <input type="email" name="email" id="email" class="auth" required />
                    </div>
                    <div>
                        <label for="email">Enter your password:<br /> </label>
                        <input type="text" name="pswd" id="pswd" class="auth" required />
                    </div>
                    <div class="cntr">
                        <input type="submit" class="btn primary-btn" value="Log in" />
                        <a>First time here? <span class="link link-small">Register!</span></a>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>


<style scoped>
section {
    height: 100%;
}

</style>
