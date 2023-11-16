/**
 * Represents a single entry in the command line, containing an ID, lines of text, and starting position.
 */
export interface CommandLineEntry {
  id: string;
  lines: string[];
  starts_at: number;
}

/**
 * A class representing a command line interface.
 */
export class CommandLine {
  public current_line = 0;
  public entries: CommandLineEntry[] = [];

  constructor() {
    // Save the current cursor position
    process.stdout.write("\n");
  }

  /**
   * Clears the entire console screen and moves the cursor to the top left corner.
   */
  private _fullClear() {
    process.stdout.moveCursor(0, -this.current_line);
    this.current_line = 0;
    process.stdout.clearScreenDown();
  }

  private _fullRender() {
    this._fullClear();
    var line = 0;
    for (let entry of this.entries) {
      entry.starts_at = line;
      for (let content of entry.lines) {
        process.stdout.write(content + "\n");
        line += 1;
      }
    }
    this.current_line = line;
  }

  /**
   * Renders a single entry in the command line interface to the terminal. If
   * the entry has not been rendered before, it will be rendered at the bottom
   * of the terminal. If the entry has been rendered before, it will be
   * overwritten in place. If the entry has been rendered before, but is no
   * longer in the list of entries, it will be removed from the terminal.
   *
   * @param oldState Previous state of the entry
   * @param newState Next state of the entry
   * @returns void
   */
  private _renderEntry(
    oldState: CommandLineEntry | null,
    newState: CommandLineEntry | null
  ): void {
    // Render the new state
    this._fullRender();
  }

  /**
   * Adds a new entry to the command line history.
   * @param id - The ID of the new entry.
   * @param lines - The lines of text to add to the new entry.
   */
  private _add({ id, lines }: { id: string; lines: string[] }) {
    let newState = {
      id,
      lines,
      starts_at: this.current_line,
    };
    this.entries.push(newState);
    this._renderEntry(null, newState);
  }

  /**
   * Updates an existing command line entry with the given id.
   * @param {Object} options - The options object.
   * @param {string} options.id - The id of the entry to update.
   * @param {string[]} options.lines - The new lines of the entry.
   * @returns {void}
   */
  public set({ id, lines }: { id: string; lines: string[] }) {
    let oldState = this.entries.find((entry) => entry.id === id);
    if (!oldState) {
      this._add({ id, lines });
      return;
    }
    let newState = {
      ...oldState,
      lines,
    };
    this._renderEntry(oldState, newState);
  }

  /**
   * Removes an entry from the command line history by its ID.
   * @param {string} id - The ID of the entry to remove.
   */
  public unset({ id }: { id: string }) {
    let oldState = this.entries.find((entry) => entry.id === id);
    if (!oldState) return;
    this.entries = this.entries.filter((entry) => entry.id !== id);
    this._renderEntry(oldState, null);
  }
}
