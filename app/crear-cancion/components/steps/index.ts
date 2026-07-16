// Eager loaded steps (1-4) - shown first, critical for initial experience
export { default as Step1SongType } from "./step-1-song-type"
export { default as Step2Occasion } from "./step-2-occasion"
export { default as Step3Name } from "./step-3-name"
export { default as Step4Relationship } from "./step-5-relationship"

// Steps 5-12 are lazy loaded in the main page using dynamic imports
// Note: Step numbers in filenames don't match new step order (legacy naming)
