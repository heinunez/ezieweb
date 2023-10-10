import { ChoiceOptions, DistinctQuestion } from "inquirer";
import { Content, Course, CoursePeriod, Student } from "../sieClient.js";

const backOption = { name: "↩", value: "↩" };

export const isBack = (value: any) => {
    return value === "↩";
}

const notEmptyValidation = (input: string) => {
    if (input && input.length) {
        return true;
    }

    throw Error("please enter a value");
}

export const baseUrlQuestion: DistinctQuestion = {
    type: "input",
    name: "baseUrl",
    validate: notEmptyValidation
};

export const rememberQuestion: DistinctQuestion = {
    type: "confirm",
    name: "remember",
    message: "remember?",
    default: false
};

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

export const coursePeriodsQuestion = (periods: CoursePeriod[]): DistinctQuestion => {
    const selected: CoursePeriod | undefined = periods.find(p => p.current);
    const choices: ChoiceOptions[] = periods.map(p => ({ name: p.name, value: p }));
    choices.push(backOption);
    return {
        type: 'list',
        name: 'period',
        message: 'select period',
        default: selected,
        choices: choices,
    }
};

export const courseContentQuestion = (contents: Content[]): DistinctQuestion => {
    const choices: ChoiceOptions[] = contents.map(c => ({ name: `${c.title} | ${c.description.replace(/<[^>]+>/g, '')}`, value: c }));
    choices.push(backOption);
    return {
        type: 'list',
        name: 'content',
        message: 'download content',
        choices: choices,
    }
};
