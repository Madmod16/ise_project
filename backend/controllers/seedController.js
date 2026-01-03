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
const pad2 = (n) => String(n).padStart(2, "0");
const randomDateISO = (startYear = 2023, endYear = 2026) => {
    const y = randInt(startYear, endYear);
    const m = randInt(1, 12);
    const d = randInt(1, 28);
    return `${y}-${pad2(m)}-${pad2(d)}`;
};

function makeIdGen() {
    const used = new Set();
    const base = randInt(1_000_000, 1_800_000_000);
    return () => {
        let id;
        do {
            id = base + randInt(0, 150_000_000);
            if (id > 2_000_000_000) id = randInt(1_000_000, 2_000_000_000);
        } while (used.has(id));
        used.add(id);
        return id;
    };
}

function requireModels(names) {
    const missing = names.filter((n) => !db[n]);
    return { ok: missing.length === 0, missing };
}

function pkAttr(model) {
    if (!model) return null;
    return (
        model.primaryKeyAttribute ||
        (Array.isArray(model.primaryKeyAttributes) ? model.primaryKeyAttributes[0] : null)
    );
}

function isAutoInc(model) {
    if (!model) return false;
    const pk = pkAttr(model);
    if (!pk) return false;
    const ra = model.rawAttributes?.[pk];
    return Boolean(ra?.autoIncrement);
}

function pickAttr(model, candidates) {
    if (!model?.rawAttributes) return null;
    const keys = new Set(Object.keys(model.rawAttributes));
    for (const c of candidates) if (keys.has(c)) return c;
    return null;
}

/* -------------------- pools -------------------- */
const FIRST = ["Maria", "Stefan", "Elia", "Anna", "Lukas", "Nina", "Tobias", "Sara", "David", "Mila", "Paul", "Lea"];
const LAST = ["Kadlec", "Hofer", "Gruber", "Mayer", "Huber", "Bauer", "Wagner", "Leitner", "Novak", "Schmid"];

const COMPANIES = ["Kapsch", "OMV", "A1", "Wien Energie", "Erste Group", "Raiffeisen", "Siemens", "ÖBB"];
const OCCUPATIONS = ["Clerk", "Analyst", "Engineer", "Designer", "Consultant", "Manager", "Assistant"];

const UNIVERSITIES = ["Uni Wien", "TU Wien", "WU Wien", "FH Technikum", "Uni Graz"];
const DEGREES = ["BSc", "MSc", "BA", "MA", "PhD"];

const TUTOR_SPECIALIZATIONS = ["Business Analyst", "Project Manager", "Scrum Master", "Data Analyst", "Architect", "Requirements Engineer"];
const ACCREDITATIONS = ["BMFWF", "OeAD", "IIBA", "PMI", "ISO", "ECQA"];

const PROGRAM_NAMES = ["Software Engineering", "Data & Analytics", "Business Informatics", "Project Management", "Cyber Security"];
const COURSE_NAMES = [
    "Requirements Engineering",
    "SQL for Data Analysis",
    "Agile Methods",
    "Behaviour Patterns",
    "Software Architecture",
    "Business Process Modeling",
    "Data Quality",
    "UX Research",
    "Cloud Basics",
    "Database Systems",
];
const COURSE_FIELDS = ["SQL", "Agile", "Psychology", "Architecture", "Business Analysis", "Data Quality", "UX", "Cloud"];

const MODULE_NAMES = ["Intro", "Basics", "Workshop", "Case Study", "Hands-on Lab", "Exam Prep"];
const MODULE_SUBJECTS = [
    "Foundations and terminology",
    "Practical exercises and examples",
    "Common pitfalls and best practices",
    "Mini project with feedback",
    "Advanced topics and patterns",
];

/* -------------------- controller -------------------- */
const seedRandom = async (req, res) => {
    const needed = [
        "Program",
        "Course",
        "Tutor",
        "IsTaughtBy",
        "Member",
        "PrivateCustomer",
        "UniversityStudent",
        "Enrollment",
        "Payment",
        "Module",
    ];

    const chk = requireModels(needed);
    if (!chk.ok) {
        return res.status(500).json({
            ok: false,
            error: `Missing Sequelize models in models/index.js export: ${chk.missing.join(", ")}`,
        });
    }

    const {
        Program,
        Course,
        Tutor,
        IsTaughtBy,
        Member,
        PrivateCustomer,
        UniversityStudent,
        Enrollment,
        Payment,
        Module,
    } = db;

    const cfg = {
        reset: Boolean(req.body?.reset ?? false),
        programs: Number.isFinite(req.body?.programs) ? req.body.programs : 3,
        courses: Number.isFinite(req.body?.courses) ? req.body.courses : 10,
        tutors: Number.isFinite(req.body?.tutors) ? req.body.tutors : 6,
        members: Number.isFinite(req.body?.members) ? req.body.members : 18,
        enrollments: Number.isFinite(req.body?.enrollments) ? req.body.enrollments : 10,
        modulesMin: Number.isFinite(req.body?.modulesMin) ? req.body.modulesMin : 2,
        modulesMax: Number.isFinite(req.body?.modulesMax) ? req.body.modulesMax : 5,
        pctPrivateCustomer: Number.isFinite(req.body?.pctPrivateCustomer) ? req.body.pctPrivateCustomer : 0.45,
        pctUniversityStudent: Number.isFinite(req.body?.pctUniversityStudent) ? req.body.pctUniversityStudent : 0.45,
        pctPayments: Number.isFinite(req.body?.pctPayments) ? req.body.pctPayments : 0.9,
    };

    cfg.enrollments = Math.min(cfg.enrollments, cfg.courses);
    const nextId = makeIdGen();

    // PKs
    const ProgramPK = pkAttr(Program);
    const CoursePK = pkAttr(Course);
    const TutorPK = pkAttr(Tutor);
    const MemberPK = pkAttr(Member);
    const EnrollPK = pkAttr(Enrollment);

    // Course attrs
    const CourseProgramFK = pickAttr(Course, ["ProgramID", "ProgramId"]);
    const CourseName = pickAttr(Course, ["CourseName", "Name"]);

    // Tutor attrs
    const TutorNameAttr = pickAttr(Tutor, ["TutorName", "Name"]);
    const TutorSurnameAttr = pickAttr(Tutor, ["TutorSurname", "Surname"]);
    const TutorSupervisorFK = pickAttr(Tutor, ["SupervisorID", "SupervisorId"]);

    // Module attrs
    const ModuleCourseFK = pickAttr(Module, ["CourseID", "CourseId"]);
    const ModuleId = pickAttr(Module, ["Id", "ModuleID", "ModuleId"]);
    const ModuleNameAttr = pickAttr(Module, ["ModuleName", "Name"]);
    const ModuleTopicsAttr = pickAttr(Module, ["TopicsCovered", "Subject"]);

    // Member attrs
    const MemberNameAttr = pickAttr(Member, ["MemberName", "Name"]);
    const MemberSurnameAttr = pickAttr(Member, ["MemberSurname", "Surname"]);

    // Enrollment attrs (FIX: EnrollDate)
    const EnrollMemberFK = pickAttr(Enrollment, ["MemberID", "MemberId"]);
    const EnrollCourseFK = pickAttr(Enrollment, ["CourseID", "CourseId"]);
    const EnrollDateAttr = pickAttr(Enrollment, ["EnrollDate", "Date"]); // <- IMPORTANT

    // Payment attrs
    const PayEnrollFK = pickAttr(Payment, ["EnrollmentID", "EnrollmentId"]);
    const PayAmount = pickAttr(Payment, ["Amount", "TotalAmount"]);
    const PayDiscount = pickAttr(Payment, ["Discount"]);

    // Subtypes
    const UniMemberFK = pickAttr(UniversityStudent, ["MemberID", "MemberId", "Id"]);
    const UniStudentId = pickAttr(UniversityStudent, ["StudentID", "StudentId"]);
    const PrivMemberFK = pickAttr(PrivateCustomer, ["MemberID", "MemberId", "Id"]);

    // IsTaughtBy
    const ITBTutorFK = pickAttr(IsTaughtBy, ["TutorID", "TutorId"]);
    const ITBCourseFK = pickAttr(IsTaughtBy, ["CourseID", "CourseId"]);

    const missingAttrs = [];
    if (!ProgramPK) missingAttrs.push("Program PK");
    if (!CoursePK || !CourseProgramFK || !CourseName) missingAttrs.push("Course attrs");
    if (!TutorPK || !TutorNameAttr || !TutorSurnameAttr) missingAttrs.push("Tutor attrs");
    if (!MemberPK || !MemberNameAttr || !MemberSurnameAttr) missingAttrs.push("Member attrs");
    if (!EnrollPK || !EnrollMemberFK || !EnrollCourseFK || !EnrollDateAttr) missingAttrs.push("Enrollment attrs (EnrollDate)");
    if (!ModuleCourseFK || !ModuleId || !ModuleNameAttr || !ModuleTopicsAttr) missingAttrs.push("Module attrs");
    if (!PayEnrollFK || !PayAmount) missingAttrs.push("Payment attrs");
    if (!UniMemberFK || !UniStudentId) missingAttrs.push("UniversityStudent attrs");
    if (!PrivMemberFK) missingAttrs.push("PrivateCustomer attrs");
    if (!ITBTutorFK || !ITBCourseFK) missingAttrs.push("IsTaughtBy attrs");

    if (missingAttrs.length) {
        return res.status(500).json({
            ok: false,
            error: `Seeder cannot detect required model attributes: ${missingAttrs.join(", ")}`,
        });
    }

    const t = await sequelize.transaction();
    try {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;", { transaction: t });

        if (cfg.reset) {
            const order = [IsTaughtBy, Payment, Enrollment, Module, Course, Program, Tutor, UniversityStudent, PrivateCustomer, Member];
            for (const m of order) {
                await m.destroy({ where: {}, truncate: false, transaction: t });
            }
        }

        /* -------- Program -------- */
        const programIds = [];
        for (let i = 0; i < cfg.programs; i++) {
            const data = {
                ProgramName: `${rand(PROGRAM_NAMES)} ${randInt(1, 99)}`,
                Duration: randInt(1, 12),
            };
            if (!isAutoInc(Program)) data[ProgramPK] = nextId();
            const p = await Program.create(data, { transaction: t });
            programIds.push(p[ProgramPK]);
        }

        /* -------- Course -------- */
        const courseIds = [];
        for (let i = 0; i < cfg.courses; i++) {
            const data = {
                [CourseProgramFK]: rand(programIds),
                [CourseName]: `${rand(COURSE_NAMES)} ${randInt(1, 99)}`,
                Field: rand(COURSE_FIELDS),
                Price: randInt(30, 150),
            };
            if (!isAutoInc(Course)) data[CoursePK] = nextId();
            const c = await Course.create(data, { transaction: t });
            courseIds.push(c[CoursePK]);
        }

        /* -------- Module -------- */
        let moduleCount = 0;
        for (const cId of courseIds) {
            const mCount = randInt(cfg.modulesMin, cfg.modulesMax);
            for (let m = 1; m <= mCount; m++) {
                moduleCount++;
                await Module.create(
                    {
                        [ModuleCourseFK]: cId,
                        [ModuleId]: m,
                        [ModuleNameAttr]: `${rand(MODULE_NAMES)} ${randInt(1, 30)}`,
                        [ModuleTopicsAttr]: rand(MODULE_SUBJECTS),
                    },
                    { transaction: t }
                );
            }
        }

        /* -------- Tutor -------- */
        const tutorIds = [];
        for (let i = 0; i < cfg.tutors; i++) {
            const data = {
                [TutorNameAttr]: rand(FIRST),
                [TutorSurnameAttr]: rand(LAST),
                Specialization: rand(TUTOR_SPECIALIZATIONS),
                Accreditation: rand(ACCREDITATIONS),
            };
            if (TutorSupervisorFK) data[TutorSupervisorFK] = tutorIds.length > 0 && Math.random() < 0.5 ? rand(tutorIds) : null;
            if (!isAutoInc(Tutor)) data[TutorPK] = nextId();
            const tu = await Tutor.create(data, { transaction: t });
            tutorIds.push(tu[TutorPK]);
        }

        /* -------- IsTaughtBy -------- */
        const taughtPairs = new Set();
        let isTaughtByCount = 0;
        for (const tId of tutorIds) {
            const howMany = randInt(1, Math.min(4, courseIds.length));
            const picked = shuffle(courseIds).slice(0, howMany);
            for (const cId of picked) {
                const key = `${tId}::${cId}`;
                if (taughtPairs.has(key)) continue;
                taughtPairs.add(key);
                isTaughtByCount++;
                await IsTaughtBy.create({ [ITBTutorFK]: tId, [ITBCourseFK]: cId }, { transaction: t });
            }
        }

        /* -------- Member -------- */
        const memberIds = [];
        for (let i = 0; i < cfg.members; i++) {
            const data = {
                [MemberNameAttr]: rand(FIRST),
                [MemberSurnameAttr]: rand(LAST),
                Age: randInt(18, 65),
            };
            if (!isAutoInc(Member)) data[MemberPK] = nextId();
            const m = await Member.create(data, { transaction: t });
            memberIds.push(m[MemberPK]);
        }

        /* -------- PrivateCustomer / UniversityStudent -------- */
        const shuffledMembers = shuffle(memberIds);
        const nPrivate = Math.floor(cfg.members * cfg.pctPrivateCustomer);
        const nStudent = Math.floor(cfg.members * cfg.pctUniversityStudent);

        const privateIds = shuffledMembers.slice(0, nPrivate);
        const studentIds = shuffledMembers.slice(nPrivate, nPrivate + nStudent);

        let privateCount = 0;
        for (const id of privateIds) {
            privateCount++;
            await PrivateCustomer.create(
                { [PrivMemberFK]: id, Company: rand(COMPANIES), Occupation: rand(OCCUPATIONS) },
                { transaction: t }
            );
        }

        const usedStudentIds = new Set();
        let studentCount = 0;
        for (const id of studentIds) {
            studentCount++;
            let sid;
            do sid = randInt(100000, 999999);
            while (usedStudentIds.has(sid));
            usedStudentIds.add(sid);

            await UniversityStudent.create(
                { [UniMemberFK]: id, [UniStudentId]: sid, University: rand(UNIVERSITIES), Degree: rand(DEGREES) },
                { transaction: t }
            );
        }

        /* -------- Enrollment (FIXED: EnrollDate) -------- */
        const enrollmentCourseIds = shuffle(courseIds).slice(0, cfg.enrollments);
        const enrollmentIds = [];
        for (let i = 0; i < cfg.enrollments; i++) {
            const data = {
                [EnrollMemberFK]: rand(memberIds),
                [EnrollCourseFK]: enrollmentCourseIds[i],
                [EnrollDateAttr]: randomDateISO(2023, 2026),
                Validity: Math.random() < 0.85 ? 1 : 0,
            };
            if (!isAutoInc(Enrollment)) data[EnrollPK] = nextId();
            const e = await Enrollment.create(data, { transaction: t });
            enrollmentIds.push(e[EnrollPK]);
        }

        /* -------- Payment -------- */
        const payEnrollments = shuffle(enrollmentIds).slice(0, Math.floor(enrollmentIds.length * cfg.pctPayments));
        let paymentCount = 0;
        for (const enrollmentId of payEnrollments) {
            paymentCount++;
            const data = { [PayEnrollFK]: enrollmentId, [PayAmount]: randInt(50, 300) };
            if (PayDiscount) data[PayDiscount] = Math.random() < 0.35 ? randInt(5, 30) : null;
            await Payment.create(data, { transaction: t });
        }

        await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;", { transaction: t });
        await t.commit();

        return res.status(200).json({
            ok: true,
            inserted: {
                Program: programIds.length,
                Course: courseIds.length,
                Module: moduleCount,
                Tutor: tutorIds.length,
                IsTaughtBy: isTaughtByCount,
                Member: memberIds.length,
                PrivateCustomer: privateCount,
                UniversityStudent: studentCount,
                Enrollment: enrollmentIds.length,
                Payment: paymentCount,
            },
        });
    } catch (err) {
        try { await t.rollback(); } catch {}
        return res.status(500).json({ ok: false, error: err.message });
    }
};

module.exports = { seedRandom };
