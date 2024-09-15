import { atom } from "recoil";
import { DEFUALT_LANGUAGE_CODE } from "../_constants/languageConstants";

export const environmentConstantsState = atom({
    key: "environmentConstantsState",
    default: undefined,
});

export const languageCodeState = atom({
    key: "languageCodeState",
    default: DEFUALT_LANGUAGE_CODE
});