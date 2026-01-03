// controllers/seedController.js
const db = require("../models");
const { sequelize } = db;

/* -------------------- helpers -------------------- */
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

function makeIdGen() {
    let cur = randInt(1, 50000);
    return () => ++cur;
}

/* -------------------- pools -------------------- */
const FIRST_POOL = ["Maria", "Stefan", "Elia", "Anna", "Lukas", "Nina", "Tobias", "Sara", "David", "Mila", "Paul", "Lea"];
const LAST_POOL = ["Kadlec", "Hofer", "Gruber", "Mayer", "Huber", "Bauer", "Wagner", "Leitner", "Novak", "Schmid", "Fischer", "Berger"];

const ACCREDITATIONS_POOL = ["BMFWF", "OeAD", "IIBA", "PMI", "ISO", "ECQA", "AWS", "ISTQB", "SAP", "Oracle"];
const TUTOR_SPEC_POOL = ["Business Analyst", "Project Manager", "Scrum Master", "Data Analyst", "Architect", "Requirements Engineer"];

const PROGRAM_NAMES_POOL = ["Software Engineering", "Data & Analytics", "Business Informatics", "Project Management", "Cyber Security", "Cloud & DevOps"];
const COURSE_NAMES_POOL = [
    "Requirements Engineering and Elicitation",
    "Introduction to Data Analysis with SQL",
    "Agile in Real-Life Projects",
    "Behaviour Patterns Management",
    "Software Architecture Basics",
    "Business Process Modeling",
    "Data Quality Foundations",
    "Cloud Basics",
    "Database Systems",
    "UX Research",
];
const COURSE_FIELDS_POOL = ["SQL", "Agile", "Psychology", "Architecture", "Business Analysis", "Data Quality", "UX", "Cloud"];

const MODULE_NAMES_POOL = ["Intro", "Basics", "Workshop", "Case Study", "Hands-on Lab", "Exam Prep"];
const MODULE_SUBJECTS_POOL = [
    "Foundations and terminology",
    "Practical exercises and examples",
    "Common pitfalls and best practices",
    "Mini project with feedback",
    "Advanced topics and patterns",
];

/* -------------------- main seed -------------------- */
async function seedOnStartupRandom({ reset = true } = {}) {
    const needed = [
        "Program",
        "Course",
        "Module",
        "Tutor",
        "IsTaughtBy",
        "Member",
        "PrivateCustomer",
        "UniversityStudent",
        // ❌ Enrollment, Payment entfernt
    ];
    const missing = needed.filter((n) => !db[n]);
    if (missing.length) {
        throw new Error(`Missing models export: ${missing.join(", ")}`);
    }

    const {
        Program,
        Course,
        Module,
        Tutor,
        IsTaughtBy,
        Member,
        PrivateCustomer,
        UniversityStudent,
    } = db;

    const FIRST = shuffle(FIRST_POOL).slice(0, 6);
    const LAST = shuffle(LAST_POOL).slice(0, 6);
    const ACCREDITATIONS = shuffle(ACCREDITATIONS_POOL).slice(0, 6);
    const TUTOR_SPEC = shuffle(TUTOR_SPEC_POOL).slice(0, 6);

    const PROGRAM_NAMES = shuffle(PROGRAM_NAMES_POOL);
    const COURSE_NAMES = shuffle(COURSE_NAMES_POOL);
    const COURSE_FIELDS = shuffle(COURSE_FIELDS_POOL);

    const MODULE_NAMES = shuffle(MODULE_NAMES_POOL);
    const MODULE_SUBJECTS = shuffle(MODULE_SUBJECTS_POOL);

    const nextId = makeIdGen();

    // Mengen (kannst du anpassen)
    const cfg = {
        programs: 2,
        courses: 4,
        modulesMin: 2,
        modulesMax: 4,
        tutors: 6,
        members: 12,
        pctPrivate: 0.5,
        pctStudent: 0.4,
    };

    const t = await sequelize.transaction();
    try {
        if (reset) {
            // Reihenfolge: Child -> Parent
            await IsTaughtBy.destroy({ where: {}, transaction: t });
            await UniversityStudent.destroy({ where: {}, transaction: t });
            await PrivateCustomer.destroy({ where: {}, transaction: t });
            await Member.destroy({ where: {}, transaction: t });
            await Module.destroy({ where: {}, transaction: t });

            // Tutor Self-FK SupervisorId -> erst lösen, dann löschen
            await Tutor.update({ SupervisorId: null }, { where: {}, transaction: t });
            await Tutor.destroy({ where: {}, transaction: t });

            await Course.destroy({ where: {}, transaction: t });
            await Program.destroy({ where: {}, transaction: t });
        }

        /* -------- Program -------- */
        const programIds = [];
        for (let i = 0; i < cfg.programs; i++) {
            const p = await Program.create(
                {
                    Id: nextId(),
                    Name: `${PROGRAM_NAMES[i % PROGRAM_NAMES.length]} ${randInt(1, 99)}`,
                    Duration: randInt(3, 12),
                },
                { transaction: t }
            );
            programIds.push(p.Id);
        }

        /* -------- Course -------- */
        const courseIds = [];
        for (let i = 0; i < cfg.courses; i++) {
            const c = await Course.create(
                {
                    Id: nextId(),
                    ProgramId: rand(programIds),
                    Name: `${COURSE_NAMES[i % COURSE_NAMES.length]}`,
                    Field: rand(COURSE_FIELDS),
                    Price: randInt(1, 150),
                },
                { transaction: t }
            );
            courseIds.push(c.Id);
        }

        /* -------- Module (PK: CourseId + ModuleId) -------- */
        for (const cId of courseIds) {
            const count = randInt(cfg.modulesMin, cfg.modulesMax);
            for (let m = 1; m <= count; m++) {
                await Module.create(
                    {
                        CourseId: cId,
                        ModuleId: m,
                        Name: `${rand(MODULE_NAMES)} ${randInt(1, 20)}`,
                        Subject: rand(MODULE_SUBJECTS),
                    },
                    { transaction: t }
                );
            }
        }

        /* -------- Tutor -------- */
        const tutorIds = [];
        for (let i = 0; i < cfg.tutors; i++) {
            const id = nextId();
            const supervisorId = tutorIds.length > 0 && Math.random() < 0.4 ? rand(tutorIds) : null;

            const row = await Tutor.create(
                {
                    Id: id,
                    SupervisorId: supervisorId,
                    Name: FIRST[i % FIRST.length],
                    Surname: LAST[i % LAST.length],
                    Specialization: rand(TUTOR_SPEC),
                    Accreditation: ACCREDITATIONS[i % ACCREDITATIONS.length],
                },
                { transaction: t }
            );
            tutorIds.push(row.Id);
        }

        /* -------- IsTaughtBy -------- */
        const pairs = new Set();
        for (const tId of tutorIds) {
            const howMany = randInt(1, Math.min(2, courseIds.length));
            const picked = shuffle(courseIds).slice(0, howMany);
            for (const cId of picked) {
                const key = `${tId}::${cId}`;
                if (pairs.has(key)) continue;
                pairs.add(key);
                await IsTaughtBy.create({ TutorId: tId, CourseId: cId }, { transaction: t });
            }
        }

        /* -------- Member -------- */
        const memberIds = [];
        for (let i = 0; i < cfg.members; i++) {
            const m = await Member.create(
                {
                    Id: nextId(),
                    Name: rand(FIRST),
                    Surname: rand(LAST),
                    Age: randInt(18, 100),
                },
                { transaction: t }
            );
            memberIds.push(m.Id);
        }

        /* -------- PrivateCustomer / UniversityStudent -------- */
        const shuffledMembers = shuffle(memberIds);
        const nPrivate = Math.floor(cfg.members * cfg.pctPrivate);
        const nStudent = Math.floor(cfg.members * cfg.pctStudent);

        const privateIds = shuffledMembers.slice(0, nPrivate);
        const studentIds = shuffledMembers.slice(nPrivate, nPrivate + nStudent);

        for (const id of privateIds) {
            await PrivateCustomer.create(
                {
                    MemberId: id,
                    Occupation: rand(["Clerk", "Analyst", "Engineer", "Designer", "Consultant", "Manager"]),
                    Company: rand(["Kapsch", "OMV", "A1", "Wien Energie", "Erste Group", "Raiffeisen", "Siemens", "ÖBB"]),
                },
                { transaction: t }
            );
        }

        const usedStudentIds = new Set();
        for (const id of studentIds) {
            let sid;
            do sid = randInt(1, 999999);
            while (usedStudentIds.has(sid));
            usedStudentIds.add(sid);

            await UniversityStudent.create(
                {
                    MemberId: id,
                    StudentID: sid,
                    Degree: rand(["BSc", "MSc", "BA", "MA"]),
                },
                { transaction: t }
            );
        }

        await t.commit();
        console.log("[seed-random] OK:", {
            programs: programIds.length,
            courses: courseIds.length,
            tutors: tutorIds.length,
            members: memberIds.length,
            variantsEachStart: {
                tutorFirstNames: FIRST,
                tutorLastNames: LAST,
                accreditations: ACCREDITATIONS,
            },
        });
    } catch (err) {
        try { await t.rollback(); } catch {}
        console.error("[seed-random] FAILED:", err.message);
        throw err;
    }
}

module.exports = { seedOnStartupRandom };
