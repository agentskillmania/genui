/**
 * JsonStreamAccumulator — accumulates raw text chunks and extracts
 * complete top-level JSON objects using brace/bracket depth counting
 * with string-escape awareness.
 */
export class JsonStreamAccumulator {
  private buffer = '';

  /**
   * Append a raw text chunk to the internal buffer.
   * @param chunk - Raw text received from the stream
   */
  append(chunk: string): void {
    this.buffer += chunk;
  }

  /**
   * Extract all complete top-level JSON objects from the buffer.
   *
   * Uses brace-depth and bracket-depth counting while tracking
   * string context to correctly handle braces/brackets inside
   * string values. When both depths return to 0, a complete
   * JSON boundary is detected.
   *
   * @returns Array of complete JSON strings, removed from the buffer
   */
  extractCompleteJson(): string[] {
    const results: string[] = [];
    let braceDepth = 0;
    let bracketDepth = 0;
    let inString = false;
    let startIdx = -1;
    let i = 0;

    while (i < this.buffer.length) {
      const ch = this.buffer[i];

      if (inString) {
        if (ch === '\\') {
          // Skip escaped character (next char is part of escape sequence)
          i += 2;
          continue;
        }
        if (ch === '"') {
          inString = false;
        }
        i++;
        continue;
      }

      // Outside string context
      if (ch === '"') {
        inString = true;
        if (braceDepth === 0 && bracketDepth === 0) {
          // A string at top level — not a JSON object/array start.
          // We don't track these; skip to closing quote.
          i++;
          continue;
        }
      } else if (ch === '{') {
        if (braceDepth === 0 && bracketDepth === 0) {
          startIdx = i;
        }
        braceDepth++;
      } else if (ch === '}') {
        braceDepth--;
        if (braceDepth === 0 && bracketDepth === 0 && startIdx !== -1) {
          results.push(this.buffer.substring(startIdx, i + 1));
          startIdx = -1;
        }
      } else if (ch === '[') {
        if (braceDepth === 0 && bracketDepth === 0) {
          startIdx = i;
        }
        bracketDepth++;
      } else if (ch === ']') {
        bracketDepth--;
        if (braceDepth === 0 && bracketDepth === 0 && startIdx !== -1) {
          results.push(this.buffer.substring(startIdx, i + 1));
          startIdx = -1;
        }
      }

      i++;
    }

    // Remove extracted portions from the buffer.
    // We need to remove from left to right, tracking offsets.
    if (results.length > 0) {
      let removeOffset = 0;
      let scanIdx = 0;
      let remaining = this.buffer;

      for (const extracted of results) {
        const extractStart = remaining.indexOf(extracted, scanIdx);
        if (extractStart !== -1) {
          // Keep everything after the extracted portion
          remaining = remaining.substring(extractStart + extracted.length);
          scanIdx = 0;
          removeOffset += extractStart + extracted.length;
        }
      }

      this.buffer = remaining;
    }

    return results;
  }

  /**
   * Returns the incomplete buffer tail that has not yet formed
   * a complete JSON object.
   */
  getPending(): string {
    return this.buffer;
  }

  /**
   * Reset the accumulator, clearing all buffered data.
   */
  reset(): void {
    this.buffer = '';
  }
}
