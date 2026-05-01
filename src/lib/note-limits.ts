/** Maximum characters persisted per daily note. */
export const NOTE_MAX_CHARS = 1000;

/**
 * Draft may grow slightly past the save cap so pastes feel less abrupt;
 * value is clamped on change and always sliced to {@link NOTE_MAX_CHARS} on save.
 */
export const NOTE_DRAFT_MAX_CHARS = NOTE_MAX_CHARS + 50;
