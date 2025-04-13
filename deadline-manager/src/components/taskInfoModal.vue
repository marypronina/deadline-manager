<template>
    <div
        v-if="visible"
        class="task-info"
        :style="{ top: `${y}px`, left: `${x}px`, backgroundColor: color }"
        @mouseenter="$emit('cancel-close')"
        @mouseleave="$emit('start-close')"
    >
        <div class="modal-row-container">
            <p class="task-name" :style="{ color: chooseColor(color) }">
                {{ task.name }}
            </p>
            <div class="toggle-btn" id="toggle-btn" @click="changeExpanded">
                <svg
                    :class="{ rotated: expanded }"
                    :fill="chooseColor(color)"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    style="transform: scaleY(0.7)"
                >
                    <path
                        d="M1.5 4l10.5 14 10.5-14 1.5 1.1-12 16-12-16 1.5-1.1z"
                    />
                </svg>
            </div>
        </div>

        <div v-if="expanded" class="task-details">
            <div class="deadline-container">
                <svg
                    :fill="chooseColor(color)"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                >
                    <path
                        d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 11h6v1h-7v-9h1v8z"
                    />
                </svg>

                <p :style="{ color: chooseColor(color) }">
                    {{ formatDate(task.finish_date) }}
                </p>
            </div>

            <p :style="{ color: chooseColor(color) }" class="task-description">
                {{ task.description }}
            </p>

            <p
                v-if="taskLinks?.length"
                class="links-info"
                :style="{ color: chooseColor(color) }"
            >
                Links:
            </p>
            <div class="links-container">
                <div v-for="link in taskLinks" :key="link.id">
                    <a
                        :href="link.url"
                        target="_blank"
                        class="link-info"
                        :style="{ color: chooseColor(color) }"
                        >{{ link.name }}</a
                    >
                </div>
            </div>

            <div style="margin-top: 30px" class="modal-row-container">
                <svg
                    :fill="chooseColor(color)"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    stroke-linejoin="round"
                    stroke-miterlimit="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style="transform: scale(1.3); transform-origin: center; margin-left: 5px"
                >
                    <path
                        d="m19 20.25c0-.402-.356-.75-.75-.75-2.561 0-11.939 0-14.5 0-.394 0-.75.348-.75.75s.356.75.75.75h14.5c.394 0 .75-.348.75-.75zm-12.023-7.083c-1.334 3.916-1.48 4.232-1.48 4.587 0 .527.46.749.749.749.352 0 .668-.137 4.574-1.493zm1.06-1.061 3.846 3.846 8.824-8.814c.195-.195.293-.451.293-.707 0-.255-.098-.511-.293-.706-.692-.691-1.742-1.741-2.435-2.432-.195-.195-.451-.293-.707-.293-.254 0-.51.098-.706.293z"
                        fill-rule="nonzero"
                    />
                </svg>
                <btn
                    :style="{
                        backgroundColor: chooseColor(color),
                        color: color,
                    }"
                    class="done-btn"
                    @click="markAsDone"
                    >Done!</btn
                >
            </div>
        </div>
    </div>
</template>

<script>
import { chooseColor } from "@/services/color";
import { formatDate } from "@/services/date";
import { markTaskAsDone } from "@/services/tasks";

export default {
    props: {
        visible: Boolean,
        x: Number,
        y: Number,
        color: String,
        task: Object,
        links: Array,
    },

    data() {
        return {
            chooseColor,
            formatDate,
            expanded: false,
        };
    },

    methods: {
        changeExpanded() {
            ym(101003231, "reachGoal", "toggle-btn");
            this.expanded = !this.expanded;
        },
        markAsDone() {
            this.$emit("mark-as-done", this.task.id);
        }
    },

    computed: {
        taskLinks() {
            return this.links.filter((link) => link.task === this.task.id);
        },
    },
};
</script>

<style scoped>
.modal-row-container {
    padding: 0;
    min-width: 300px;

    display: flex;
    justify-content: space-between;
}

.toggle-btn {
    cursor: pointer;
    width: 24px;
}

.task-details {
    padding: 30px 0 10px 0;
}

svg {
    width: 24px;
    transition: transform 0.3s ease;
}

.rotated {
    transform: rotate(180deg) scaleY(0.7) !important;
}

.deadline-container {
    display: flex;
    gap: 20px;
    align-items: center;
}

.task-description {
    margin-top: 20px;
    font-weight: 300;
}

.links-info {
    margin: 20px 0 10px 0;
    font-weight: 500;
}

.links-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.link-info {
    font-weight: 300;

    cursor: pointer;
    text-decoration: underline;
}

.done-btn {
    padding: 9px 12px;
    border: 0;
    border-radius: 20px;

    font-size: 18px;
    font-weight: 600;

    cursor: pointer;
}
</style>
