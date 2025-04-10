<template>
    <div class="calendar" ref="calendar">
        <div class="timeline-header" ref="timelineHeader">
            <div
                class="timeline-cell"
                v-for="date in visibleDates"
                :key="date"
                ref="columns"
            >
                <p class="date-text">{{ date }}</p>
                <div class="delimeter"></div>
            </div>
        </div>

        <div
            v-for="(task, index) in validTasks"
            :key="task.id"
            class="task-bar"
            :style="getTaskStyle(task, index)"
            @mousemove="(event) => showTaskInfo(event, task)"
            @mouseenter="cancelClose"
            @mouseleave="startClose"
        ></div>

        <TaskInfoModal
            :visible="modalInfo.visible"
            :x="modalInfo.x"
            :y="modalInfo.y"
            :color="modalInfo.color"
            @cancel-close="cancelClose"
            @start-close="startClose"
        >
            <div>
                {{ modalInfo.task.name }}
            </div>
        </TaskInfoModal>
    </div>
</template>

<script>
import TaskInfoModal from "./taskInfoModal.vue";

export default {
    components: {
        TaskInfoModal,
    },

    props: {
        tasks: {
            type: Array,
            required: true,
        },
        groups: {
            type: Array,
            required: true,
        },
        selectedGroups: {
            type: Array,
            required: true,
        },
    },

    data() {
        const today = new Date();
        const startVisibleDate = new Date(today);
        startVisibleDate.setDate(today.getDate() - 1);

        return {
            startVisibleDate,
            dates: [],
            // scrollThreshold: 100,
            // direction: "",
            columnPositions: [],

            modalInfo: {
                visible: false,
                x: 0,
                y: 0,
                task: null,
                color: "#fff",
            },
            timerId: null,
        };
    },

    computed: {
        visibleDates() {
            return this.dates;
        },

        validTasks() {
            const timeValidTasks = this.tasks.filter(
                (task) => new Date(task.finish_date) >= new Date(this.dates[0])
            );
            return timeValidTasks.filter((task) => {
                const taskGroup = task.group;
                return this.selectedGroups.includes(taskGroup);
            });
        },
    },

    mounted() {
        // this.$refs.calendar.addEventListener('scroll', this.handleScroll);

        this.loadNextDates();

        this.$nextTick(() => {
            const columns = this.$refs.columns;
            if (columns && columns.length) {
                this.columnPositions = Array.from(columns).map(
                    (column, index) => {
                        return {
                            left: column.offsetLeft - 20,
                            right: column.offsetLeft + column.offsetWidth,
                        };
                    }
                );
            }
        });
    },

    methods: {
        formatDate(date) {
            date = new Date(date);
            const formattedDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            return formattedDate;
        },

        loadNextDates() {
            let currentLast = this.dates[0];
            if (!currentLast) {
                currentLast = this.startVisibleDate;
            }

            currentLast.setDate(currentLast.getDate());
            const newDates = [];
            for (let i = 0; i < 100; i++) {
                this.dates.push(this.formatDate(currentLast));
                currentLast.setDate(currentLast.getDate() + 1);
            }
        },

        getTaskStyle(task, index) {
            const calendarStart = new Date(this.dates[0]);
            const taskStart = new Date(task.start_date);
            const taskFinish = new Date(task.finish_date);

            const ms = 24 * 60 * 60 * 1000;
            const startDaysFromStart = Math.max(
                0,
                Math.floor((taskStart - calendarStart) / ms)
            );
            const finishDaysFromStart = Math.min(
                this.columnPositions.length - 1,
                Math.floor((taskFinish - calendarStart) / ms)
            );

            const leftColumn = this.columnPositions[startDaysFromStart];
            const rightColumn = this.columnPositions[finishDaysFromStart];

            if (!leftColumn || !rightColumn) return {};

            const left = leftColumn.left;
            const width = rightColumn.right - left;
            const top = index * 30 + 100;

            const color = this.groups.find(
                (group) => group.id === task.group
            ).color_hex;

            return {
                position: "absolute",
                left: `${left}px`,
                width: `${width}px`,
                top: `${top}px`,
                backgroundColor: color,
            };
        },

        showTaskInfo(event, task) {
            clearTimeout(this.timerId);

            const taskGroup = this.groups.find(
                (group) => task.group === group.id
            );

            this.modalInfo = {
                visible: true,
                x: event.clientX,
                y: event.clientY,
                task,
                color: taskGroup.color_hex,
            };

            console.log(this.modalInfo.x, this.modalInfo.y);
        },

        startClose() {
            this.timerId = setTimeout(() => {
                this.modalInfo.visible = false;
            }, 200);
        },

        cancelClose() {
            clearTimeout(this.timerId);
            this.timerId = null;
        }

        
        // handleScroll() {
        //     console.log('handle scroll');
        //     const timelineHeader = this.$refs.timelineHeader;
        //     const scrollPosition = timelineHeader.scrollLeft;

        //     if (scrollPosition < this.scrollThreshold) {
        //         this.direction = 'left';
        //         this.loadPrevoiousDates();
        //     }

        //     if (timelineHeader.scrollWidth - scrollPosition - timelineHeader.clientWidth < this.scrollThreshold) {
        //         this.direction = 'right';
        //         this.loadNextDates();
        //     }
        // },

        // loadPrevoiousDates() {
        //     let currentFirst = this.dates[0];
        //     if (!currentFirst) {
        //         currentFirst = this.startVisibleDate;
        //     }

        //     currentFirst.setDate(currentFirst.getDate() - 1);
        //     const newDates = [];
        //     for (let i = 0; i < 5; i++) {
        //         newDates.push(this.formatDate(currentFirst));
        //         currentFirst.setDate(currentFirst.getDate() - 1);
        //     }

        //     this.dates = [...newDates.reverse(), ...this.dates];
        // },
    },
};
</script>
