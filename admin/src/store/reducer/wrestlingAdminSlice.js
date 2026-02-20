import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

/* ===============================
   CREATE MATCH
================================ */
export const createWrestlingMatch = createAsyncThunk(
  "wrestlingAdmin/createMatch",
  async (
    {
      teamAName,
      teamBName,
      startTime,
      minbet,
      maxbet,
      betStatus,
      disqualify,          // ✅ NEW
      teamARates,
      teamASizes,
      teamBRates,
      teamBSizes,
      disqualifyRates,     // ✅ NEW
      disqualifySizes,     // ✅ NEW
      img,
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      formData.append("teamAName", teamAName);
      formData.append("teamBName", teamBName);
      formData.append(
        "startTime",
        new Date(startTime).toISOString()
      );
      formData.append("minbet", minbet);
      formData.append("maxbet", maxbet);

      // ✅ Betting Status
      formData.append("betStatus", betStatus);

      // ✅ Disqualify Status
      formData.append("disqualify", disqualify);

      /* SEND ARRAYS AS JSON */
      formData.append("teamARates", JSON.stringify(teamARates));
      formData.append("teamASizes", JSON.stringify(teamASizes));
      formData.append("teamBRates", JSON.stringify(teamBRates));
      formData.append("teamBSizes", JSON.stringify(teamBSizes));

      // ✅ Disqualify Market
      formData.append(
        "disqualifyRates",
        JSON.stringify(disqualifyRates)
      );
      formData.append(
        "disqualifySizes",
        JSON.stringify(disqualifySizes)
      );

      if (img) {
        formData.append("img", img);
      }

      const { data } = await api.post(
        "/wrestling/create-match",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!data.success) throw new Error(data.message);

      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ===============================
   GET ALL MATCHES
================================ */
export const fetchAllMatches = createAsyncThunk(
  "wrestlingAdmin/fetchAllMatches",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        "/wrestling/matches"
      );
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ===============================
   GET SINGLE MATCH
================================ */
export const fetchMatch = createAsyncThunk(
  "wrestlingAdmin/fetchMatch",
  async (matchId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/wrestling/match/${matchId}/closed`
      );
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ===============================
   CLOSE MATCH
================================ */
export const closeMatch = createAsyncThunk(
  "wrestlingAdmin/closeMatch",
  async (matchId, { rejectWithValue }) => {
    try {
      await api.put(
        `/wrestling/match/${matchId}/close`
      );
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to close match"
      );
    }
  }
);

/* ===============================
   OPEN MATCH
================================ */
export const openMatch = createAsyncThunk(
  "wrestlingAdmin/openMatch",
  async (matchId, { rejectWithValue }) => {
    try {
      await api.put(
        `/wrestling/match/${matchId}/open`
      );
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to open match"
      );
    }
  }
);

/* ===============================
   SLICE
================================ */

const wrestlingAdminSlice = createSlice({
  name: "wrestlingAdmin",

  initialState: {
    matches: [],
    match: null,
    createdMatch: null,
    success: false,
    loading: false,
    status: "",
    error: null,
  },

  reducers: {

    /* ===============================
       SOCKET: UPDATE BOX
    =================================*/
    updateBoxFromSocket: (state, action) => {
      const { tid, boxId, rate, size, timer } = action.payload;

      if (!state.match?.teams) return;

      const team = state.match.teams.find(
        (t) => String(t.tid) === String(tid)
      );
      if (!team) return;

      const box = team.boxes?.find(
        (b) => String(b.boxId) === String(boxId)
      );
      if (!box) return;

      if (rate !== undefined) box.rate = rate;
      if (size !== undefined) box.size = size;
      if (timer !== undefined) box.timer = timer;
    },

    /* ===============================
       SOCKET: UPDATE TEAM STATUS
    =================================*/
    updateTeamStatusFromSocket: (state, action) => {
      const { tid, status } = action.payload;

      if (!state.match?.teams) return;

      const team = state.match.teams.find(
        (t) => String(t.tid) === String(tid)
      );

      if (team) {
        team.status = status; // ACTIVE / SUSPENDED
      }
    },

    /* ===============================
       CLEAR STATUS
    =================================*/
    clearStatus: (state) => {
      state.status = "";
      state.error = null;
      state.success = false;
      state.createdMatch = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* CREATE MATCH */
      .addCase(createWrestlingMatch.pending, (state) => {
        state.loading = true;
        state.status = "⏳ Creating match...";
      })
      .addCase(createWrestlingMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.createdMatch = action.payload;
        state.matches.unshift(action.payload);
        state.status = "✅ Match created";
      })
      .addCase(createWrestlingMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "❌ " + action.payload;
      })

      /* FETCH ALL MATCHES */
      .addCase(fetchAllMatches.pending, (state) => {
        state.loading = true;
        state.status = "⏳ Loading matches...";
      })
      .addCase(fetchAllMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
        state.status = "✅ Matches loaded";
      })
      .addCase(fetchAllMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "❌ " + action.payload;
      })

      /* FETCH SINGLE MATCH */
      .addCase(fetchMatch.pending, (state) => {
        state.loading = true;
        state.status = "⏳ Loading match...";
      })
      .addCase(fetchMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.match = action.payload;
        state.status = "✅ Match loaded";
      })
      .addCase(fetchMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "❌ " + action.payload;
      })

      /* CLOSE MATCH */
      .addCase(closeMatch.fulfilled, (state) => {
        if (state.match) state.match.status = "CLOSED";
        state.status = "🔒 MATCH CLOSED";
      })

      /* OPEN MATCH */
      .addCase(openMatch.fulfilled, (state) => {
        if (state.match) state.match.status = "OPEN";
        state.status = "🔓 MATCH OPENED";
      });
  },
});

/* ===============================
   EXPORTS
================================ */

export const {
  updateBoxFromSocket,
  updateTeamStatusFromSocket,
  clearStatus,
} = wrestlingAdminSlice.actions;

export default wrestlingAdminSlice.reducer;