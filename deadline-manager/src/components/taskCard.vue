<template>
    <div class="task-card" :style="{ backgroundColor: color }" draggable="true" @dragstart="handleDragStart" @dragend="handleDragEnd">
        <h4 class="task-title" :style="{ color: textColor }">{{ task.name }}</h4>
        <p class="task-description" :style="{ color: textColor }">{{ task.description }}</p>
        <div v-for="link in links" :key="link.id">
            <a :href="link.url" target="_blank" class="link" :style="{ color: textColor }">{{ link.name }}</a>
        </div>
        <p :style="{ color: textColor }">Deadline:</p>
        <p class="task-dates" :style="{ color: textColor }">{{ formatDate(task.finish_date) }}</p>
    </div>
</template>

<script>
import { chooseColor } from '../services/color';

export default {
    props: {
        task: {
            type: Object,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        links: {
            type: Array,
            required: false,
        }
    },
    computed: {
        textColor() {
            return chooseColor(this.color);
        },
        style() {
            return `color: ${this.textColor} !important; background-color: ${this.color};`;
        }
    },
    methods: {
        formatDate(date) {
            const [dateTime] = date.split(' ');
            const [day, month, year] = dateTime.split('-');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[month - 1]}. ${day}, ${year}`;
        },
    },
};
</script>
