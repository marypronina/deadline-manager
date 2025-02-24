<template>
    <div v-if="showModal" class="modal-container">
        <div class="close">
            <img
                src="../assets/icons/close.png"
                alt="close"
                class="close-icon"
                @click="closeModal"
            />
        </div>
        <div class="cntr modal-title">
            <h4>Create new group</h4>
        </div>

        <form @submit.prevent="addGroup">
            <div>
                <div class="cntr">
                    <input
                        v-model="name"
                        type="text"
                        name="name"
                        id="name"
                        class="name"
                        placeholder="Name"
                        required
                    />
                </div>

                <div class="color-container">
                    <!-- <label for="color" class="color-label">Color:</label> -->
                    <div class="color-input-wrapper">
                        <input
                            v-model="hexColor"
                            type="text"
                            class="hex-input"
                            placeholder="#000000"
                            readonly
                        />
                        <div
                            class="color-picker-circle"
                            :style="{ backgroundColor: hexColor }"
                            @click="openColorPicker"
                        ></div>
                        <input
                            ref="colorPicker"
                            type="color"
                            v-model="hexColor"
                            class="color-picker"
                            @input="updateColor"
                        />
                    </div>
                </div>
            </div>

            <div class="cntr">
                <button type="submit" class="btn primary-btn">Create!</button>
            </div>
        </form>
    </div>
</template>

<script>
import { getCurrentUser } from "../services/user";
import { createGroup } from "../services/groups";

export default {
    props: {
        showModal: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            name: "",
            hexColor: "#1976D2",
        };
    },
    methods: {
        closeModal() {
            this.$emit("close");
        },
        async addGroup() {
            try {
                const user = await getCurrentUser();

                if (!user) {
                    throw new Error("User not found");
                }
                const newGroup = {
                    name: this.name,
                    color_hex: this.hexColor,
                    user: user.id,
                };

                const createdGroup = await createGroup(newGroup);

                this.$emit("groupCreated", createdGroup);
                this.closeModal();
            } catch (error) {
                console.error("Error creating group: ", error);
            }
        },
        openColorPicker() {
            this.$refs.colorPicker.click();
        },
        updateColor(event) {
            this.hexColor = event.target.value;
        },
    },
};
</script>
