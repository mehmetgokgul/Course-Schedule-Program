# CENG206 PROJECT

## Project Overview

### Classes:
- **Course**: Represents individual courses within an educational institution. It encapsulates attributes such as course code, name, semester year, credit, type, department, number of students, instructor, and hours preference.
- **Classroom**: Represents physical spaces within the institution where classes take place. It holds properties like name, capacity (number of students it can accommodate), and a data structure to track occupied time slots.
- **ServiceCourse**: Class handles special service courses offered by the institution. It includes properties such as course code, day of the week the course is offered, and specific hours during which it takes place.
- **Busy**: Class denotes an instructor's busy times on specific days. It includes properties like the instructor's name, the day of the week, and an array of time slots indicating when the instructor is occupied.
- **Instructor**: Represents the teaching staff of the institution. It contains properties such as the instructor's name, a list of their busy times, and the courses they teach.
- **ScheduledClass**: This class is used to represent scheduled lessons. Each scheduled lesson contains information such as day, time, course, grade, and year. In this class, the total of the lessons planned during the course schedules is kept.

### Functions:
- **parseCourseCSV(csvContent)**: This function takes a CSV string containing course data and processes it, creating an array of Course objects.
- **parseClassroomCSV(csvContent)**: Retrieving a CSV string containing data about the given classes, this function processes the string and creates an array of Classroom objects.
- **parseServiceCSV(csvContent)**: This function processes a CSV string containing information about service courses and creates an array of ServiceCourse objects.
- **parseBusyCSV(csvContent)**: This function takes a CSV string containing the times the instructor was busy, processes the string, and creates an array of Busy objects.
- **generateSchedule(courses, classrooms, serviceCourses, busyTimes, instructors)**: This function creates a course schedule through a list of courses offered, classes, service lessons, teacher time, and instructors.
- **initializeAvailableSlots()**: This function initializes the available slots for weekdays and returns them as an array.
- **handleCourses(courses, availableSlots, classrooms, instructors, usedCourses, busyTimes)**: This function creates a course program by matching the courses given with the classes and equipment.
- **isSlotAvailableForYear(slot, semesterYear)**: This function checks whether a particular time slot is available in a particular period.
- **isInstructorOccupied(slot, instructor)**: This function checks whether a particular clock slot is occupied by a particular teacher.
- **findAvailableClassroom(classrooms, day, time, numStudents)**: This function checks whether an empty class exists on a particular day and time.
- **markClassroomOccupied(classrooms, day, timeSlot, classroomName)**: This function, which finds an available classroom that can accommodate a specific number of students on a specific day and time.
- **assignServiceCourses(serviceCourses, availableSlots, classrooms, usedCourses, courses)**: This function assigns service courses to appropriate time slots in classrooms.
- **findAvailableClassroomService(classrooms, day, timeSlot)**: This function finds empty classes for additional service classes.
- **getInstructorByCourseCode(courses, courseCode)**: This function, which finds the assigned instructor by course code.

## Pseudocode

```java
INITIALIZE availableSlots
INITIALIZE usedCourses as an empty list

FOR EACH serviceCourse IN serviceCourses DO
    FIND available slot for serviceCourse based on its specific requirements
    ASSIGN serviceCourse to the found slot
    ADD serviceCourse's unique identifier to usedCourses list
    UPDATE the assigned instructor's busy times with this slot
END FOR

FOR EACH course IN courses DO
    IF course's unique identifier IS IN usedCourses THEN
        CONTINUE  
    ENDIF
    FIND the instructor assigned to this course
    FOR EACH day IN week DO
        IF the instructor IS busy on this day THEN
            CONTINUE  
        ENDIF
        FIND an available slot and classroom for this course on this day
        IF a suitable slot and classroom are found THEN
            SCHEDULE the course in this slot and classroom
            UPDATE the instructor's busy times to include this slot
            BREAK  
        ENDIF

    END FOR
    IF no suitable slot and classroom were found THEN
        PRINT("No available slot for", course's unique identifier)
    ENDIF
END FOR
RETURN the generated schedule
```
!([image_url](https://drive.google.com/file/d/1eSZK6f6kTE7iIzQsoD3G9GeFUq9Revpl/view?usp=drive_link))









