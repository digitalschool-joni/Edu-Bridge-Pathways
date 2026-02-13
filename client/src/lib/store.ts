import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EduBridgeState } from '@shared/schema';

interface AppState extends EduBridgeState {
  // Actions
  updateUserProfile: (profile: NonNullable<EduBridgeState['userProfile']>) => void;
  setSummaryComplete: (complete: boolean) => void;
  updateInitialSurvey: (survey: NonNullable<EduBridgeState['initialSurvey']>) => void;
  updateStudyPlan: (plan: NonNullable<EduBridgeState['studyPlan']>) => void;
  addMoodEntry: (entry: EduBridgeState['moodEntries'][number]) => void;
  updateFinalSurvey: (survey: NonNullable<EduBridgeState['finalSurvey']>) => void;
  addMeetingRequest: (request: any) => void;
  addMethodFeedback: (feedback: EduBridgeState['methodFeedback'][number]) => void;
  setScheduleCompletion: (entry: EduBridgeState['scheduleCompletions'][number]) => void;
  toggleSavedUniversity: (id: number) => void;
  toggleUniversityChecklistItem: (universityId: number, item: string) => void;
  resetData: () => void;
}

const initialState: EduBridgeState = {
  userProfile: undefined,
  summaryComplete: false,
  initialSurvey: undefined,
  diagnosticResults: undefined,
  studyPlan: undefined,
  moodEntries: [],
  finalSurvey: undefined,
  careerMatches: [],
  universityMatches: [],
  meetingRequests: [],
  methodFeedback: [],
  scheduleCompletions: [],
  savedUniversities: [],
  universityChecklist: {},
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      updateUserProfile: (profile) => 
        set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),

      setSummaryComplete: (complete) =>
        set(() => ({ summaryComplete: complete })),

      updateInitialSurvey: (survey) => 
        set((state) => ({ initialSurvey: { ...state.initialSurvey, ...survey } })),

      updateStudyPlan: (plan) => 
        set((state) => ({ studyPlan: plan })),

      addMoodEntry: (entry) => 
        set((state) => ({ moodEntries: [entry, ...state.moodEntries] })),

      updateFinalSurvey: (survey) => 
        set((state) => ({ finalSurvey: survey })),
        
      addMeetingRequest: (request) =>
        set((state) => ({ meetingRequests: [...state.meetingRequests, request] })),

      addMethodFeedback: (feedback) =>
        set((state) => ({ methodFeedback: [feedback, ...state.methodFeedback] })),

      setScheduleCompletion: (entry) =>
        set((state) => {
          const next = state.scheduleCompletions.filter(
            (item) => !(item.blockKey === entry.blockKey && item.date === entry.date)
          );
          return { scheduleCompletions: [entry, ...next] };
        }),

      toggleSavedUniversity: (id) =>
        set((state) => {
          const exists = state.savedUniversities.includes(id);
          return {
            savedUniversities: exists
              ? state.savedUniversities.filter((value) => value !== id)
              : [...state.savedUniversities, id],
          };
        }),

      toggleUniversityChecklistItem: (universityId, item) =>
        set((state) => {
          const key = String(universityId);
          const current = state.universityChecklist[key] ?? [];
          const hasItem = current.includes(item);
          return {
            universityChecklist: {
              ...state.universityChecklist,
              [key]: hasItem ? current.filter((entry) => entry !== item) : [...current, item],
            },
          };
        }),

      resetData: () => set(initialState),
    }),
    {
      name: 'edubridge_state',
    }
  )
);
