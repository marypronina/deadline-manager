<template>
    <section>
        <div class="container main-container">
            <div class="settings">
                <div class="greetings">
                    <h2 v-if="user">Hi,</h2>
                    <h2 v-if="user" class="icon-text">
                        {{ user.name }}!
                        <img
                            src="../assets/icons/settings.png"
                            alt="settings"
                            class="icon"
                        />
                    </h2>
                    <p v-else>loading user...</p>
                </div>
                <div class="groups">
                    <h6>Groups:</h6>
                    <div v-if="groups" class="flex-col-container">
                        <div
                            v-for="group in groups.slice().reverse()"
                            :key="group.id"
                            class="group-item"
                        >
                            <label class="custom-checkbox">
                                <input
                                    type="checkbox"
                                    v-model="selectedGroups"
                                    :value="group.id"
                                />
                                <span
                                    class="checkbox-background"
                                    :style="{
                                        backgroundColor: group.color_hex,
                                        '--checkbox-check-color': chooseColor(group.color_hex),
                                    }"
                                ></span>
                                {{ group.name }}
                            </label>
                        </div>
                    </div>
                    <p @click="handleCreateGroupModal" class="group-text">
                        <span class="add"></span>Add new group
                    </p>
                </div>
                <span @click="handleCreateTaskModal" class="add large"></span>
            </div>
            <div class="tasks-grid">
                <div
                    v-for="group in filteredGroupedTasks.slice().reverse()"
                    :key="group.id"
                    class="group-column"
                >
                    <h3 class="group-title" :style="{ color: '#232323' }">
                        {{ group.name }}
                    </h3>
                    <div v-for="task in group.tasks.slice().reverse()" :key="task.id">
                        <TaskCard :task="task" :color="group.color_hex" :links="taskLinks(task.id)"/>
                    </div>
                </div>
            </div>
        </div>
        <CreateGroupModal
            :showModal="showCreateGroupModal"
            @close="handleCreateGroupModal"
            @groupCreated="handleNewGroup"
        />
        <CreateTaskModal
            :showModal="showCreateTaskModal"
            :groups="groups"
            @close="handleCreateTaskModal"
            @taskCreated="handleNewTask"
        />
    </section>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

import TaskCard from "./taskCard.vue";
import CreateGroupModal from "./createGroupModal.vue";
import CreateTaskModal from "./createTaskModal.vue";

import { getCurrentUser } from "../services/user";
import { getUserGroups } from "../services/groups";
import { getUserTasks } from "../services/tasks";
import { getUserLinks } from "../services/links";

import { chooseColor } from "@/services/color";

export default {
    components: {
        TaskCard,
        CreateGroupModal,
        CreateTaskModal,
    },
    setup() {
        const router = useRouter();

        const user = ref(null);

        const groups = ref([]);
        const selectedGroups = ref([]);
        const tasks = ref([]);
        const groupedTasks = ref([]);
        const links = ref([]);

        const showCreateGroupModal = ref(false);
        const showCreateTaskModal = ref(false);

        onMounted(async () => {
            try {
                user.value = await getCurrentUser();
                const userId = user.value.id;
                if (userId) {
                    await fetchGroups(userId);
                    await fetchTasks(userId);
                    await fetchLinks(userId);
                } else {
                    router.push("/auth");
                }
            } catch (error) {
                console.error("Error user authentication: ", error);
            }
        });

        const fetchGroups = async (userId) => {
            try {
                groups.value = await getUserGroups(userId);
                selectedGroups.value = groups.value.map((group) => group.id);
            } catch (error) {
                console.error("Error fetching groups: ", error);
            }
        };

        const fetchTasks = async (userId) => {
            try {
                tasks.value = await getUserTasks(userId);

                sortTasksByGroups();
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            }
        };

        const fetchLinks = async (userId) => {
            try {
                links.value = await getUserLinks(userId);
                console.log(links.value);
            } catch (error) {
                console.error("Error fetching links: ", error);
            }
        }

        const sortTasksByGroups = async () => {
            groupedTasks.value = groups.value.map((group) => ({
                ...group,
                tasks: tasks.value.filter((task) => task.group === group.id),
            }));
        };

        const filteredGroupedTasks = computed(() => {
            return groupedTasks.value.filter((group) =>
                selectedGroups.value.includes(group.id)
            );
        });

        const taskLinks = (taskId) => {
            return links.value.filter((link) => link.task === taskId);
        };

        const handleCreateGroupModal = () => {
            showCreateGroupModal.value = !showCreateGroupModal.value;
        };

        const handleCreateTaskModal = () => {
            showCreateTaskModal.value = !showCreateTaskModal.value;
        };

        const handleNewGroup = (group) => {
            groups.value.push(group);
            selectedGroups.value.push(group.id);
            sortTasksByGroups();
        };

        const handleNewTask = (task) => {
            tasks.value.push(task);
            sortTasksByGroups();
        };

        return {
            user,

            groups,
            selectedGroups,
            groupedTasks,
            filteredGroupedTasks,
            taskLinks,

            handleCreateGroupModal,
            showCreateGroupModal,
            handleNewGroup,

            handleCreateTaskModal,
            showCreateTaskModal,
            handleNewTask,

            chooseColor,
        };
    },
};
</script>
