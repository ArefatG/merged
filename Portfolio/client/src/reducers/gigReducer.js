export const INITIAL_STATE = {
    title: "",
    cat: "",
    cover: "",
    images: [],
    desc: "",
    address: "",
    phone: "",
    email: "",
    shortTitle: "",
    shortDesc: "",
    skills: [],
    specialties: [],
    experiences: [],
    educations: [],
    socialMedias: [],
    additionalInfo: [],
};

export const gigReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE_INPUT":
            return {
                ...state,
                [action.payload.name]: action.payload.value,
            };
        case "ADD_SKILL":
            return {
                ...state,
                skills: [...state.skills, action.payload],
            };
        case "REMOVE_SKILL":
            return {
                ...state,
                skills: state.skills.filter((skill) => skill !== action.payload),
            };
        case "ADD_SPECIALTY":
            return {
                ...state,
                specialties: [...state.specialties, action.payload],
            };
        case "REMOVE_SPECIALTY":
            return {
                ...state,
                specialties: state.specialties.filter((specialty) => specialty !== action.payload),
            };
        case "ADD_EXPERIENCE":
            return {
                ...state,
                experiences: [...state.experiences, action.payload],
            };
        case "REMOVE_EXPERIENCE":
            return {
                ...state,
                experiences: state.experiences.filter((experience) => experience !== action.payload),
            };
        case "ADD_EDUCATION":
            return {
                ...state,
                educations: [...state.educations, action.payload],
            };
        case "REMOVE_EDUCATION":
            return {
                ...state,
                educations: state.educations.filter((education) => education !== action.payload),
            };
        case "ADD_SOCIALMEDIA":
            return {
                ...state,
                socialMedias: [...state.socialMedias, action.payload],
            };
        case "REMOVE_SOCIALMEDIA":
            return {
                ...state,
                socialMedias: state.socialMedias.filter((socialMedia) => socialMedia !== action.payload),
            };
        case "ADD_IMAGES":
            return {
                ...state,
                cover: action.payload.cover,
                images: action.payload.images,
            };
        case "ADD_ADDITIONAL_INFO":
            return {
                ...state,
                additionalInfo: [...state.additionalInfo, action.payload],
            };
        case "REMOVE_ADDITIONAL_INFO":
            return {
                ...state,
                additionalInfo: state.additionalInfo.filter((_, index) => index !== action.payload),
            };
        default:
            return state;
    }
};