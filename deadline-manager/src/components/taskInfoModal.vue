<template>
    <div
        v-if="visible"
        class="task-info"
        :style="{ top: `${y}px`, left: `${x}px`, backgroundColor: color }"
        @mouseenter="$emit('cancel-close')"
        @mouseleave="$emit('start-close')"
    >
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        visible: Boolean,
        x: Number,
        y: Number,
        color: String,
    },

    // methods: {
    //     show() {
    //         this.$emit("showInfo");
    //     },
    //     hide() {
    //         this.$emit("hideInfo");
    //     },
    // },
};
</script>
