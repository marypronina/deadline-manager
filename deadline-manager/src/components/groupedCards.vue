<template>
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
                <TaskCard
                    :task="task"
                    :color="group.color_hex"
                    :links="taskLinks(task.id)"
                />
            </div>
        </div>
    </div>
</template>

<script>
import TaskCard from './taskCard.vue';

export default {
    components: {
        TaskCard
    },

    props: {
        groupedTasks: {
            type: Array,
            required: true,
        },
        selectedGroups: {
            type: Array,
            required: true,
        },
        links: {
            type: Array,
            required: false,
        }
    },

    methods: {
        taskLinks (taskId) {
            return this.links.filter((link) => link.task === taskId);
        },
    }, 

    computed: {
        filteredGroupedTasks() {
            return this.groupedTasks.filter((group) =>
                this.selectedGroups.includes(group.id)
            );
        },
    }
}
</script>

