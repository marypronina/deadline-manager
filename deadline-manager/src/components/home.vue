<template>
    <section>
        <div class="top-settings flex-row-container">
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

            <div class="switchers-container">
                <button
                    class="switcher"
                    :class="{ active: viewMode === 'groupedCards' }"
                    @click="viewMode = 'groupedCards'"
                >
                    Grouped
                </button>
                <button
                    class="switcher"
                    :class="{ active: viewMode === 'timeline' }"
                    @click="viewMode = 'timeline'"
                >
                    Timeline
                </button>
            </div>
        </div>
        <div class="container main-container">
            <div class="settings">
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
                                        '--checkbox-check-color': chooseColor(
                                            group.color_hex
                                        ),
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

            <div v-if="viewMode === 'groupedCards'">
                <GroupedCards
                    :groupedTasks="groupedTasks"
                    :selectedGroups="selectedGroups"
                    :links="links"
                />
            </div>
            <div v-else>
                <Timeline
                    :tasks="tasks"
                    :groups="groups"
                    :selectedGroups="selectedGroups"
                    :links="links"
                    @show-confirm-notification="openConfirmNotification"
                />
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

        <ConfirmNotification 
            v-if="showConfirmNotification"
            @cancel-done-mark="closeConfirmNotificationModal"
            @mark-task-as-done="confirmMarkAsDone"
        />
    </section>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

import GroupedCards from "./groupedCards.vue";
import Timeline from "./timeline.vue";
import CreateGroupModal from "./createGroupModal.vue";
import CreateTaskModal from "./createTaskModal.vue";
import ConfirmNotification from "./confirmNotification.vue";

import { getCurrentUser } from "../services/user";
import { getUserGroups } from "../services/groups";
import { getUserTasks } from "../services/tasks";
import { markTaskAsDone } from "../services/tasks";
import { getUserLinks } from "../services/links";

import { chooseColor } from "@/services/color";

export default {
    components: {
        GroupedCards,
        Timeline,

        CreateGroupModal,
        CreateTaskModal,
        ConfirmNotification,
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

        const showConfirmNotification = ref(false);
        const taskForMarking = ref(null);

        const viewMode = ref("timeline");

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

                tasks.value = tasks.value.filter((task) => task.status !== "done");
                sortTasksByGroups();
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            }
        };

        const fetchLinks = async (userId) => {
            try {
                links.value = await getUserLinks(userId);
            } catch (error) {
                console.error("Error fetching links: ", error);
            }
        };

        const sortTasksByGroups = async () => {
            groupedTasks.value = groups.value.map((group) => ({
                ...group,
                tasks: tasks.value.filter((task) => task.group === group.id),
            }));
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

        const openConfirmNotification = (taskId) => {
            taskForMarking.value = taskId;
            showConfirmNotification.value = true;
        };

        const closeConfirmNotificationModal = () => {
            showConfirmNotification.value = false;
        }

        const confirmMarkAsDone = async () => {
            await markTaskAsDone(taskForMarking.value);
            tasks.value = tasks.value.filter((task) => task.id !== taskForMarking.value);
            taskForMarking.value = null;

            closeConfirmNotificationModal();
        }

        return {
            user,
            viewMode,

            groups,
            tasks,
            selectedGroups,
            groupedTasks,
            links,

            handleCreateGroupModal,
            showCreateGroupModal,
            handleNewGroup,

            handleCreateTaskModal,
            showCreateTaskModal,
            handleNewTask,

            openConfirmNotification,
            showConfirmNotification,
            closeConfirmNotificationModal,
            confirmMarkAsDone,

            chooseColor,
        };
    },
};
</script>
