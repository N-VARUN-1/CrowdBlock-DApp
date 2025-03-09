import { createSlice } from '@reduxjs/toolkit';
export const campaignSlice = createSlice({
    name: 'campaign',
    initialState: {
        campaignId: null,
    },
    reducers: {
        setCampaign: (state, action) => {
            state.campaignId = action.payload;
        }
    }
})

export const { setCampaign } = campaignSlice.actions;

export default campaignSlice.reducer;