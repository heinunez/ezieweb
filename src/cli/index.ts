#!/usr/bin/env node
import inquirer, { Answers } from "inquirer";
import { baseUrlQuestion, courseContentQuestion, coursePeriodsQuestion, coursesQuestion, isBack, passwordQuestion, rememberQuestion, studentsQuestion, usernameQuestion } from "./questions.js";
import { SieAuth } from "../sieAuth.js";
import { Content, Course, CoursePeriod, SieClient, Student } from "../sieClient.js";
import fs from "fs";
import { Prefs, savePrefs } from "./prefs.js";

export class SieCli {
    private client: SieClient = new SieClient();
    private student?: Student;
    private courses: Course[] = [];
    private course?: Course;
    private periods: CoursePeriod[] = [];
    private contents: Content[] = [];
    private token?: string;
    private baseUrl?: string;
    private prefs: Prefs | null;

    constructor(prefs: Prefs | null) {
        this.prefs = prefs;
    }

    async start() {
        if (this.prefs === null) {
            inquirer.prompt(baseUrlQuestion).then((answers: Answers) => {
                const { baseUrl } = answers;
                this.baseUrl = baseUrl;
                this.promptUsername();
            });
        } else {
            this.baseUrl = this.prefs.basePath;
            await this.login(this.prefs.username, this.prefs.password);
        }

    }

    private promptUsername() {
        inquirer.prompt(usernameQuestion).then((answers: Answers) => {
            const { username } = answers;
            this.promptPassword(username);
        });
    }

    private promptPassword(username: string) {
        inquirer.prompt(passwordQuestion).then(async (answers: Answers) => {
            const { password } = answers;
            await this.promptRemember(username, password);
        });
    }
    private promptRemember(username: string, password: string) {
        inquirer.prompt(rememberQuestion).then(async (answers: Answers) => {
            const { remember } = answers;
            if (remember) {
                savePrefs({ basePath: this.baseUrl || "", username: username, password: password });
            }
            await this.login(username, password);
        });
    }

    private async login(username: string, password: any) {
        const auth = new SieAuth(this.baseUrl);
        this.token = await auth.getToken(username, password);
        this.client = new SieClient(this.baseUrl, this.token);
        const students = await this.client.getStudents();
        this.promptStudents(students);
    }

    private promptStudents(students: Student[]) {
        inquirer.prompt(studentsQuestion(students)).then(async (answers: Answers) => {
            this.student = answers.student;
            this.courses = await this.client.getCourses(this.student?.levelId);
            this.promptCourses();
        });
    }

    private async promptCourses() {
        inquirer.prompt(coursesQuestion(this.courses)).then(async (answers: Answers) => {
            this.course = answers.course;
            this.periods = await this.client.getCoursePeriods(this.student?.levelId, this.course);
            this.promptCoursePeriods();
        });
    }

    private promptCoursePeriods() {
        inquirer.prompt(coursePeriodsQuestion(this.periods)).then(async (answers: Answers) => {
            const period: CoursePeriod | string = answers.period;
            if (isBack(period)) {
                this.promptCourses();
                return;
            }
            this.contents = await this.client.getContentList(this.student?.levelId, this.course, period as CoursePeriod);
            this.contents = this.contents.sort((c1, c2) => c1.id - c2.id);
            this.promptCourseContents();
        });
    }

    private promptCourseContents() {
        inquirer.prompt(courseContentQuestion(this.contents)).then(async (answers: Answers) => {
            const content: Content | string = answers.content;
            if (isBack(content)) {
                this.promptCoursePeriods();
                return;
            }
            await this.client.downloadContent(this.student?.id, (content as Content).id, this.token, async (name: string, file: ArrayBuffer) => {
                fs.writeFileSync(name, Buffer.from(file));
                console.log(name, "downloaded");
            });
            this.promptCourseContents();
        });
    }
}

