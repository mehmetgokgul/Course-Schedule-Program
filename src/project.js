class Course {
    constructor(code, name, semesterYear, credit, type, department, numStudents, instructor, hoursPreference) {
        this.code = code;
        this.name = name;
        this.semesterYear = semesterYear;
        this.credit = credit;
        this.type = type;
        this.department = department;
        this.numStudents = numStudents;
        this.instructor = instructor;
        this.hoursPreference = hoursPreference;
    }
}

function parseCourseCSV(csvContent) {
    const courses = [];

    const lines = csvContent.split('\n');

    lines.forEach(line => {
        const items = line.trim().split(',');

        const code = items[0];
        const name = items[1];
        const semesterYear = parseInt(items[2]);
        const credit = parseInt(items[3]);
        const type = items[4];
        const department = items[5];
        const numStudents = parseInt(items[6]);
        const instructor = items[7];
        const hoursPreference = items[8];

        const course = new Course(code, name, semesterYear, credit, type, department, numStudents, instructor, hoursPreference);
        courses.push(course);
    });

    return courses;
}

class Classroom {
    constructor(name, capacity) {
        this.name = name;
        this.capacity = capacity;
        this.occupiedSlots = {
            Monday: {},
            Tuesday: {},
            Wednesday: {},
            Thursday: {},
            Friday: {}
        }; // Keep track of occupied time slots for each day
    }

    occupySlot(day, timeSlot) {
        if (this.occupiedSlots[day]) {
            this.occupiedSlots[day][timeSlot] = true;
        } else {
            console.log(`Invalid day ${day}`);
        }
    }

    isSlotOccupied(day, timeSlot) {
        if (this.occupiedSlots[day]) {
            return this.occupiedSlots[day].hasOwnProperty(timeSlot);
        } else {
            console.log(`Invalid day ${day}`);
            return false;
        }
    }
}

function parseClassroomCSV(csvContent) {
    const classrooms = [];

    const lines = csvContent.split('\n');

    lines.forEach(line => {
        const items = line.trim().split(';');

        const name = items[0];
        const capacity = items[1];

        const classroom = new Classroom(name, capacity);
        classrooms.push(classroom);
    });

    return classrooms;
}

class ServiceCourse {
    constructor(courseCode, day, hours) {
        this.courseCode = courseCode;
        this.day = day;
        this.hours = hours;
    }
}

function parseServiceCSV(csvContent) {
    const serviceCourses = [];

    const lines = csvContent.split('\n');

    lines.forEach(line => {
        const items = line.trim().split(',');

        
        const courseCode = items.shift();
        const day = items.shift(); 
        const hoursString = items.join(',');
        const hours = hoursString.split(',').map(hour => hour.replace(/"/g, ''));

        const serviceCourse = new ServiceCourse(courseCode, day, hours);
        serviceCourses.push(serviceCourse);
    });

    return serviceCourses;
}

class Busy {
    constructor(instructor, day, times) {
        this.instructor = instructor;
        this.day = day;
        this.times = times;
    }
}

function parseBusyCSV(csvContent) {
    const busyTimes = [];

    const lines = csvContent.split('\n');

    lines.forEach(line => {
        const items = line.trim().split(',');

        const instructor = items.shift();
        const day = items.shift();
        const timesString = items.join(',');
        const times = timesString.split(',').map(time => time.replace(/"/g, ''));

        const busy = new Busy(instructor, day, times);
        busyTimes.push(busy);
    });

    return busyTimes;
}

class Instructor {
    constructor(name) {
        this.name = name;
        this.busyTimes = [];
        this.courses = [];
    }

    addBusyTimes(busy) {
        this.busyTimes.push(busy);
    }

    addCourse(course) {
        this.courses.push(course);
    }
}

function generateSchedule(courses, classrooms, serviceCourses, busyTimes, instructors) {
    const availableSlots = initializeAvailableSlots();
    const usedCourses = [];

    assignServiceCourses(serviceCourses, availableSlots, classrooms, usedCourses, courses);
    handleCourses(courses, availableSlots, classrooms, instructors, usedCourses);

    // Print the schedule
    console.log("Schedule:");
    Object.entries(availableSlots).forEach(([day, slots]) => {
        console.log(`Day: ${day}`);
        slots.forEach(slot => {
            if (slot.lessons) {
                slot.lessons.forEach(lesson => {
                    console.log(`- Time: ${slot.time}, Course: ${lesson.course}, Instructor: ${lesson.instructor}, Classroom: ${lesson.classroom}`);
                });
            }
        });
    });

    return usedCourses;
}


function initializeAvailableSlots() {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const availableSlots = {};

    weekdays.forEach(day => {
        availableSlots[day] = [];
        for (let hour = 8; hour < 16; hour++) {
            availableSlots[day].push({ time: `${hour}:30`});
        }
    });

    return availableSlots;
}

function handleCourses(courses, availableSlots, classrooms, instructors, usedCourses) {
    courses.forEach(course => {
        const { code, numStudents, semesterYear } = course;                                                         // Check for semester year aswell
        if (usedCourses.includes(code)) return;                                                                     // If the course is already used, skip 

        const instructor = instructors.find(inst => inst.name === course.instructor);
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        let scheduled = false;

        for (let day of weekdays) {
            if (instructor.busyTimes.some(busy => busy.day === day)) continue;                                      // Skip days when the instructor is busy

            for (let slot of availableSlots[day]) {
                if (isInstructorOccupied(slot, instructor)) continue;                                               // Check if the instructor is already occupied at this slot
                const classroom = findAvailableClassroom(classrooms, day, slot.time, numStudents);

                if (classroom && isSlotAvailableForYear(slot, semesterYear)) {
                    if (!slot.lessons) slot.lessons = [];                                                           // Initialize the lessons array if it doesn't exist

                    slot.lessons.push({ course: code, instructor: instructor.name, classroom: classroom.name, semesterYear });
                    markClassroomOccupied(classrooms, day, slot.time, classroom.name);
                    instructor.addBusyTimes(new Busy(instructor.name, day, [slot.time]));
                    scheduled = true;
                    usedCourses.push(code);
                    break;                                                                                          // Break from the slot loop once scheduled
                }
            }

            if (scheduled) break;                                                                                   // Break from the day loop if scheduled
        }

        if (!scheduled) {
            console.log(`No available slots for course ${code} with instructor ${instructor.name}`);
        }
    });
}

function isSlotAvailableForYear(slot, semesterYear) {
    if (!slot.lessons) return true;

    return !slot.lessons.some(lesson => lesson.semesterYear === semesterYear);
}

function isInstructorOccupied(slot, instructor) {
    return slot.lessons && slot.lessons.some(lesson => lesson.instructor === instructor.name);
}

function findAvailableClassroom(classrooms, day, time, numStudents) {
    return classrooms.find(classroom => {
        return !classroom.isSlotOccupied(day, time) && classroom.capacity >= numStudents;
    });
}

function markClassroomOccupied(classrooms, day, timeSlot, classroomName) {
    const classroom = classrooms.find(c => c.name === classroomName);
    if (classroom) {
        classroom.occupySlot(day, timeSlot);
    }
}

function assignServiceCourses(serviceCourses, availableSlots, classrooms, usedCourses, courses) {
    serviceCourses.forEach(serviceCourse => {
        const { day, hours, courseCode } = serviceCourse;
        hours.forEach(hour => {
            const timeSlot = `${hour}`;
            if (day in availableSlots) {
                const slotIndex = availableSlots[day].findIndex(slot => slot.time.startsWith(hour));
                if (slotIndex !== -1) {
                    const classroom = findAvailableClassroomService(classrooms, day, timeSlot);
                    if (classroom) {
                        if (!availableSlots[day][slotIndex].lessons) {
                            availableSlots[day][slotIndex].lessons = [];
                        }
                        const instructor = getInstructorByCourseCode(courses, courseCode);
                        // Check if the same course is already scheduled at the same time slot
                        const existingLesson = availableSlots[day][slotIndex].lessons.find(lesson =>
                            lesson.course === courseCode && lesson.instructor === instructor
                        );
                        if (!existingLesson) {
                            availableSlots[day][slotIndex].lessons.push({ course: courseCode, instructor: instructor, classroom: classroom.name });
                            classroom.occupySlot(day, timeSlot);
                            console.log(`Course ${courseCode} added.`);
                        } else {
                            console.log(`Course ${courseCode} is already scheduled at the same time with the same instructor.`);
                        }
                    } else {
                        console.log(`No available classroom for ${courseCode}.`);
                    }
                } else {
                    console.log(`No available slots for ${courseCode}.`);
                }
            } else {
                console.log(`No available slots for ${courseCode}.`);
            }
        });

        usedCourses.push(courseCode);
    });
}

function findAvailableClassroomService(classrooms, day, timeSlot) {
    return classrooms.find(classroom => {
        const isOccupied = classroom.isSlotOccupied(day, timeSlot);
        return !isOccupied;
    });
}

function getInstructorByCourseCode(courses, courseCode) {
    const course = courses.find(course => course.code === courseCode);
    return course ? course.instructor : null;
}

function filereader(filePath){
    return fs.readFileSync(filePath, 'utf-8');
}

const fs = require('fs');

function run(){

// Dosya yollarını belirtin
const classroomFilePath = './resources/classroom.csv';
const coursesFilePath = './resources/courses.csv';
const busyFilePath = './resources/busy.csv';
const serviceFilePath = './resources/service.csv';

// Dosyalardan verileri okuyun
const classroomCSVContent = filereader(classroomFilePath);
const coursesCSVContent = filereader(coursesFilePath);
const busyCSVContent = filereader(busyFilePath);
const serviceCSVContent = filereader(serviceFilePath);

// Parçalama fonksiyonlarıyla verileri işleyin
const classrooms = parseClassroomCSV(classroomCSVContent);
const courses = parseCourseCSV(coursesCSVContent);
const busyTimes = parseBusyCSV(busyCSVContent);
const serviceCourses = parseServiceCSV(serviceCSVContent);

// Burada instructor ve kullanılan derslerin verilerini işleyebilirsiniz.
const instructors = [];

busyTimes.forEach(busy => {
    const { instructor, day, times } = busy;

    let existingInstructor = instructors.find(existing => existing.name === instructor);
    if (!existingInstructor) {

        existingInstructor = new Instructor(instructor);
        instructors.push(existingInstructor);
    }

    const existingBusy = existingInstructor.busyTimes.find(b => b.day === day);
    if (existingBusy) {

        existingBusy.times.push(...times);
    } else {

        existingInstructor.addBusyTimes(new Busy(instructor, day, times));
    }
});

courses.forEach(course => {
    const { instructor } = course;

    let existingInstructor = instructors.find(existing => existing.name === instructor);
    if (!existingInstructor) {

        existingInstructor = new Instructor(instructor);
        instructors.push(existingInstructor);
    }

    existingInstructor.addCourse(course);
});

console.log(instructors);
const schedule = generateSchedule(courses, classrooms, serviceCourses, busyTimes, instructors);
console.log(schedule);
console.log(instructors);
}

run();