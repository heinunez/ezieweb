import axios from "axios";

export class SieClient {
    private baseUrl: string;
    private conf: { headers: { [h: string]: string } };

    constructor(baseUrl: string, token: string) {
        this.baseUrl = baseUrl;
        this.conf = { headers: { "Sie-Token": token } }
    }

    async getStudent(): Promise<Student> {
        const students = await this.getStudents();
        if (students.length) {
            return new Student(students[0]);
        } else {
            throw new Error("Students not found");
        }
    }

    async getCourses(studentLevelId: string): Promise<Course[]> {
        const { data } = await axios.get<SieCourse[]>(`${this.baseUrl}/HyoAsignaprs/getCursosClase?nemo=${studentLevelId}`, this.conf);
        return data.map((c: SieCourse) => new Course(c));
    }

    private async getStudents(): Promise<SieStudent[]> {
        const { data } = await axios.get<SieStudents>(`${this.baseUrl}/Alumno/getEstudiantes`, this.conf);
        return data.estudiantes || [];
    }

}

interface SieStudents {
    estudiantes: SieStudent[]
}

interface SieStudent {
    ALUCOD: string;
    NEMO: string;
}

interface SieCourse {
    CURSOCOD: string;
    GRUPOCOD: string;
    CURSONOM: string;
}

class Student {
    id: string;
    levelId: string;

    constructor(sieStudent: SieStudent) {
        this.id = sieStudent.ALUCOD;
        this.levelId = sieStudent.NEMO;
    }
}

class Course {
    id: string;
    group: string;
    name: string;

    constructor(sieCourse: SieCourse) {
        this.id = sieCourse.CURSOCOD;
        this.group = sieCourse.GRUPOCOD;
        this.name = sieCourse.CURSONOM;
    }
}
