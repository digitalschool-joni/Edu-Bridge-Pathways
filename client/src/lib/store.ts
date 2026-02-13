import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EduBridgeState } from '@shared/schema';

interface AppState extends EduBridgeState {
  // Actions
  updateUserProfile: (profile: NonNullable<EduBridgeState['userProfile']>) => void;
  updateInitialSurvey: (survey: NonNullable<EduBridgeState['initialSurvey']>) => void;
  updateStudyPlan: (plan: NonNullable<EduBridgeState['studyPlan']>) => void;
  addMoodEntry: (entry: EduBridgeState['moodEntries'][number]) => void;
  updateFinalSurvey: (survey: NonNullable<EduBridgeState['finalSurvey']>) => void;
  addMeetingRequest: (request: any) => void;
  resetData: () => void;
}

const initialState: EduBridgeState = {
  userProfile: undefined,
  initialSurvey: undefined,
  diagnosticResults: undefined,
  studyPlan: undefined,
  moodEntries: [],
  finalSurvey: undefined,
  careerMatches: [],
  universityMatches: [],
  meetingRequests: [],
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      updateUserProfile: (profile) => 
        set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),

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

      resetData: () => set(initialState),
    }),
    {
      name: 'edubridge_state',
    }
  )
);
