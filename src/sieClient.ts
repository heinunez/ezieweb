import axios from "axios";

export class SieClient {
    private baseUrl: string;
    private conf: { headers: { [h: string]: string } };

    constructor(baseUrl: string, token: string) {
        this.baseUrl = baseUrl;
        this.conf = { headers: { "Sie-Token": token } }
    }

    async getCourses(studentLevelId: string): Promise<Course[]> {
        const { data } = await axios.get<SieCourse[]>(`${this.baseUrl}/HyoAsignaprs/getCursosClase?nemo=${studentLevelId}`, this.conf);
        return data.map((c: SieCourse) => new Course(c));
    }

    async getStudents(): Promise<Student[]> {
        const { data } = await axios.get<SieStudents>(`${this.baseUrl}/Alumno/getEstudiantes`, this.conf);
        const students = data.estudiantes || [];
        if (students.length) {
            return students.map((s: SieStudent) => new Student(s));
        }
        return [];
    }

}

interface SieStudents {
    estudiantes: SieStudent[]
}

interface SieStudent {
    ALUCOD: string;
    NEMO: string;
    NOMCOMP: string;
}

interface SieCourse {
    CURSOCOD: string;
    GRUPOCOD: string;
    CURSONOM: string;
}

export class Student {
    id: string;
    levelId: string;
    name: string;

    constructor(sieStudent: SieStudent) {
        this.id = sieStudent.ALUCOD;
        this.levelId = sieStudent.NEMO;
        this.name = sieStudent.NOMCOMP;
    }
}

export class Course {
    id: string;
    group: string;
    name: string;

    constructor(sieCourse: SieCourse) {
        this.id = sieCourse.CURSOCOD;
        this.group = sieCourse.GRUPOCOD;
        this.name = sieCourse.CURSONOM;
    }
}
