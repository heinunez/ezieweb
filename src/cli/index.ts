#!/usr/bin/env node
import inquirer, { Answers } from "inquirer";
import { coursesQuestion, passwordQuestion, studentsQuestion, usernameQuestion } from "./questions";
import { SieAuth } from "../sieAuth";
import { Course, SieClient, Student } from "../sieClient";

const baseUrl = "https://test/api";

inquirer.prompt(usernameQuestion).then((answers: Answers) => {
    const { username } = answers;
    promptPassword(username);
});

function promptPassword(username: string) {
    inquirer.prompt(passwordQuestion).then(async (answers: Answers) => {
        const { password } = answers;
        const auth = new SieAuth(baseUrl);
        const token = await auth.getToken(username, password);
        const client = new SieClient(baseUrl, token);
        const students = await client.getStudents();
        promptStudents(client, students);
    });
}

function promptStudents(client: SieClient, students: Student[]) {
    inquirer.prompt(studentsQuestion(students)).then(async (answers: Answers) => {
        const student: Student = answers.student;
        const courses = await client.getCourses(student.levelId);
        promptCourses(client, courses);
    });
}

function promptCourses(client: SieClient, courses: Course[]) {
    inquirer.prompt(coursesQuestion(courses)).then(async (answers: Answers) => {
        const course: Course = answers.course;
        console.log(course);
    });
}


