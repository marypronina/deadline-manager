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
            <h4>Create new task</h4>
        </div>

        <form @submit.prevent="addTask">
            <div class="cntr">
                <CustomSelect
                    :groups="groups"
                    v-model="selectedGroup"
                ></CustomSelect>

                <input
                    v-model="name"
                    type="text"
                    name="name"
                    id="name"
                    class="name"
                    placeholder="Task name"
                    required
                />

                <textarea
                    v-model="description"
                    rows="5"
                    name="description"
                    id="despription"
                    class="description scroll"
                    placeholder="Description of yout task"
                ></textarea>

                <div>
                    <label for="deadline">Deadline:</label>
                    <input
                        v-model="deadline"
                        type="date"
                        name="deadline"
                        id="deadline"
                        class="deadline"
                        placeholder=""
                        required
                    />
                </div>

                <div class="links">
                    <label>Links:</label>
                    <div v-if="links.length" class="link-list">
                        <div v-for="link in links" :key="link.id">
                            <a
                                :href="link.url"
                                target="_blank"
                                class="link-in-list"
                                >{{ link.name }}</a
                            >
                            <img
                                src="../assets/icons/close.png"
                                alt="delete link"
                                class="delete-link"
                                @click="deleteLink(link.id)"
                            />
                        </div>
                    </div>
                    <form class="new-link">
                        <input
                            v-model="linkName"
                            type="text"
                            name="linkName"
                            id="linkName"
                            class="link-name"
                            placeholder="Name your link"
                        />
                        <input
                            v-model="linkUrl"
                            type="text"
                            name="linkUrl"
                            id="linkUrl"
                            class="link-url"
                            placeholder="Insert a link"
                        />
                        <span @click="addLink" class="add"></span>
                    </form>
                </div>

                <button type="submit" class="btn primary-btn">Create!</button>
            </div>
        </form>
    </div>
</template>

<script>
import CustomSelect from "./customSelect.vue";
import { createTask } from "../services/tasks";
import { createLink } from "../services/links";

export default {
    components: {
        CustomSelect,
    },
    data() {
        return {
            selectedGroup: null,
            name: null,
            description: null,
            deadline: null,

            links: [],
            linkCounter: 0,
            linkName: null,
            linkUrl: null,
        };
    },
    props: {
        showModal: {
            type: Boolean,
            required: true,
        },
        groups: {
            type: Array,
            required: true,
        },
    },
    methods: {
        closeModal() {
            this.$emit("close");
        },
        addLink() {
            if (!this.linkName || !this.linkUrl) {
                return;
            }
            const newLink = {
                id: this.linkCounter++,
                name: this.linkName,
                url: this.linkUrl,
            };
            this.links.push(newLink);
        },
        deleteLink(linkId) {
            this.links = this.links.filter((link) => link.id !== linkId);
        },
        async addTask() {
            const newTask = {
                name: this.name,
                description: this.description,
                start_date: new Date(),
                finish_date: this.deadline,
                group: this.selectedGroup.id,
            };
            const task = await createTask(newTask);

            await this.postLinks(task.id);

            this.$emit("taskCreated", task);

            this.closeModal();
        },
        async postLinks(taskId) {
            for (const link of this.links) {
                const newLink = {
                    name: link.name,
                    url: link.url,
                    task: taskId,
                };

                const createdLink = await createLink(newLink);
            }
        },
    },
};
</script>

<style scoped>
label {
    font-size: 20px;
}
.cntr.modal-title {
    margin: 70px 0 25px 0;
}

span.add {
    margin: 0;
}

input.name:focus {
    outline: auto;
}
</style>
