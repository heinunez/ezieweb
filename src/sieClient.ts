import axios from "axios";

export class SieClient {
    private baseUrl: string | undefined;
    private conf: { headers: { [h: string]: string | undefined } };

    constructor(baseUrl?: string, token?: string) {
        this.baseUrl = baseUrl;
        this.conf = { headers: { "Sie-Token": token } }
    }

    async getCourses(studentLevelId?: string): Promise<Course[]> {
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

    async getCoursePeriods(studentLevel?: string, course?: Course): Promise<CoursePeriod[]> {
        const { data } = await axios.get<SiePeriods>(`${this.baseUrl}/contenido/getInfoCurso?nemo=${studentLevel}&cursocod=${course?.id}&grupocod=${course?.group}`, this.conf);
        if (data.periodos?.length) {
            return data.periodos.map(sp => new CoursePeriod(data.periodoActual, sp));
        }
        return [];
    }

    async getContentList(studentLevel?: string, course?: Course, period?: CoursePeriod): Promise<Content[]> {
        const { data } = await axios.get<SieContent[]>(`${this.baseUrl}/contenido?nemo=${studentLevel}&cursocod=${course?.id}&grupocod=${course?.group}&bimecod=${period?.id}&limit=15&offset=0`, this.conf);
        if (data.length) {
            return data.map(sc => new Content(sc));
        }
        return [];
    }

    async downloadContent(studentId: string | undefined, contentId: number, authToken: string | undefined, fileHandler: (name: string, file: ArrayBuffer) => void): Promise<void> {
        const { data } = await axios.get<SieAttachment>(`${this.baseUrl}/contenido/getContenidoById?id=${contentId}&lectura=true&alucod=${studentId}`, this.conf);
        const files = data.adjuntos.data.filter(f => f.extension && f.id && f.name);
        for (let file of files) {
            const { data } = await axios.get<ArrayBuffer>(`${this.baseUrl}/HyoContenido/archivo/${file.id}/${file.name}?sie-token=${authToken}`, { responseType: "arraybuffer", ...this.conf });
            fileHandler(file.name, data);
        }
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

interface SiePeriods {
    periodoActual: string;
    periodos: SiePeriod[];
}

interface SiePeriod {
    BIMECOD: string;
    BIMEDES: string;
}

interface SieContent {
    ID_CONTENIDO: number;
    ID_CONTENIDO_TIPO: number;
    TITULO: string;
    DESCRIPCION: string;
}

interface SieAttachment {
    adjuntos: {
        data: SieFile[]
    };
}

interface SieFile {
    id: number;
    name: string;
    extension: string;
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

export class CoursePeriod {
    id: string;
    name: string;
    current: boolean;

    constructor(currentPeriod: string, siePeriod: SiePeriod) {
        this.id = siePeriod.BIMECOD;
        this.name = siePeriod.BIMEDES;
        this.current = currentPeriod === this.id;
    }
}

export class Content {
    id: number;
    typeId: number;
    title: string;
    description: string;

    constructor(sieContent: SieContent) {
        this.id = sieContent.ID_CONTENIDO;
        this.typeId = sieContent.ID_CONTENIDO_TIPO;
        this.title = sieContent.TITULO;
        this.description = sieContent.DESCRIPCION;
    }
}
