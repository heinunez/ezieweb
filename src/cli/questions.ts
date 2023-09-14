import inquirer, { ChoiceOptions, DistinctQuestion } from "inquirer";
import { Course, Student } from "../sieClient";

const notEmptyValidation = (input: string) => {
    if (input && input.length) {
        return true;
    }

    throw Error("please enter a value");
}

export const usernameQuestion: DistinctQuestion = {
    type: "input",
    name: "username",
    validate: notEmptyValidation
};

export const passwordQuestion: DistinctQuestion = {
    type: "password",
    name: "password",
    mask: "*",
    validate: notEmptyValidation
};

export const studentsQuestion = (students: Student[]): DistinctQuestion => {
    const choices: ChoiceOptions[] = students.map(s => ({ name: s.name, value: s }));
    return {
        type: 'list',
        name: 'student',
        message: 'select student',
        choices: choices,
    }
};

export const coursesQuestion = (courses: Course[]): DistinctQuestion => {
    const choices: ChoiceOptions[] = courses.map(c => ({ name: c.name, value: c }));
    return {
        type: 'list',
        name: 'course',
        message: 'select course',
        choices: choices,
    }
};
