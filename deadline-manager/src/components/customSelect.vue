<template>
    <div class="custom-select">
        <div class="selection" @click="handleDropdown">
            <span v-if="selectedGroup" class="color-circle" :style="{ backgroundColor: selectedGroup?.color_hex }"></span>
            {{ selectedGroup?.name || "Select a group" }}
        </div>
        <ul v-if="showDropdown" class="dropdown">
            <li v-for="group in groups" :key="group.id" @click="selectGroup(group)" class="dropdown-item">
                <span class="color-circle" :style="{ backgroundColor: group.color_hex }"></span>
                {{ group.name }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showDropdown: false,
            selectedGroup: null,
        }
    },
    props: {
        groups: {
            type: Array,
            required: true,
        }
    },
    methods: {
        handleDropdown() {
            this.showDropdown = !this.showDropdown;
        },
        selectGroup(group) {
            this.selectedGroup = group;
            this.handleDropdown();
            this.$emit("update:modelValue", group);
        }
    }
}

</script>