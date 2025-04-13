<template>
    <div class="modal-container notification-modal">
        <p class="notification">Are you sure you want to mark this task as done? You will not be able to see it anymore.</p>
        <div class="btn-container">
            <button class="btn" @click="cancelDelete">Cancel</button>
            <button class="btn confirm-btn" @click="confirmDelete">Mark as done</button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        cancelDelete() {
            this.$emit("cancel-done-mark");
        },

        confirmDelete() {
            this.$emit("mark-task-as-done");
        }
    }
}
</script>

<style scoped>
    .notification-modal {
        height: 100px;
        padding: 30px;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

    }

    .notification {
        font-size: 15px;
        font-weight: 600;
    }

    .btn-container {
        align-self: flex-end;

        display: flex;
        gap: 20px;
    }

    .btn {
        border: none;
        background: transparent;
        font-size: 15px;
        font-weight: 400;
    }

    .confirm-btn {
        background-color: #fff;
        border: none;
        border-radius: 20px;
        padding: 10px 20px;

        font-weight: 600;
    }
</style>