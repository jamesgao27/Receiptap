/**
 * Record Date filter: inclusive custom range on the local calendar day of createdAt.
 * UI copy is English.
 */
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export type RecordDateRange = { start: string; end: string };

export const EMPTY_RECORD_DATE_RANGE: RecordDateRange = { start: '', end: '' };

export function isRecordDateRangeActive(range: RecordDateRange): boolean {
  return Boolean(range.start || range.end);
}

export function recordDateFilterCount(range: RecordDateRange): number {
  return isRecordDateRangeActive(range) ? 1 : 0;
}

function localDayKey(createdAt: string): string | null {
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function orderedBounds(range: RecordDateRange): { from: string; to: string } {
  let from = range.start;
  let to = range.end;
  if (from && to && from > to) {
    const swap = from;
    from = to;
    to = swap;
  }
  return { from, to };
}

/** True when the range is empty, or createdAt's local day falls inside the inclusive bounds. */
export function matchesRecordDateRange(
  createdAt: string | null | undefined,
  range: RecordDateRange,
): boolean {
  if (!isRecordDateRangeActive(range)) return true;
  if (!createdAt) return false;
  const day = localDayKey(createdAt);
  if (!day) return false;
  const { from, to } = orderedBounds(range);
  if (from && day < from) return false;
  if (to && day > to) return false;
  return true;
}

function parseYmd(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(n => parseInt(n, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}

function toYmd(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDisplay(ymd: string): string {
  if (!ymd) return 'Any';
  const d = parseYmd(ymd);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const webDateInputStyle: Record<string, string | number> = {
  width: '100%',
  boxSizing: 'border-box',
  fontSize: 13,
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #CED4DA',
  color: '#2D3436',
  backgroundColor: '#fff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  height: 36,
};

function DateBoundField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const [picking, setPicking] = useState(false);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        {React.createElement('input', {
          type: 'date',
          'aria-label': label,
          value,
          onChange: (e: { target: { value: string } }) => onChange(e.target.value || ''),
          style: webDateInputStyle,
        })}
      </View>
    );
  }

  return (
    <View style={styles.field}>
      <TouchableOpacity style={styles.nativeRow} onPress={() => setPicking(true)} activeOpacity={0.7}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, !value && styles.placeholder]}>{formatDisplay(value)}</Text>
      </TouchableOpacity>
      {picking && Platform.OS === 'android' ? (
        <DateTimePicker
          value={value ? parseYmd(value) : new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setPicking(false);
            if (event.type === 'dismissed' || !date) return;
            onChange(toYmd(date));
          }}
        />
      ) : null}
      {picking && Platform.OS === 'ios' ? (
        <View>
          <DateTimePicker
            value={value ? parseYmd(value) : new Date()}
            mode="date"
            display="spinner"
            onChange={(_, date) => {
              if (date) onChange(toYmd(date));
            }}
          />
          <TouchableOpacity onPress={() => setPicking(false)} style={styles.iosDone}>
            <Text style={styles.clearText}>Done</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

export default function RecordDateRangeFields({
  value,
  onChange,
}: {
  value: RecordDateRange;
  onChange: (next: RecordDateRange) => void;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.hint}>Includes the start and end dates.</Text>
      <DateBoundField
        label="From"
        value={value.start}
        onChange={start => onChange({ ...value, start })}
      />
      <DateBoundField
        label="To"
        value={value.end}
        onChange={end => onChange({ ...value, end })}
      />
      {isRecordDateRangeActive(value) ? (
        <TouchableOpacity onPress={() => onChange(EMPTY_RECORD_DATE_RANGE)} style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear dates</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    gap: 10,
  },
  hint: {
    fontSize: 12,
    color: '#95A5A6',
    lineHeight: 16,
  },
  field: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
  },
  nativeRow: {
    minHeight: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CED4DA',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 13,
    color: '#2D3436',
  },
  placeholder: {
    color: '#95A5A6',
  },
  clearBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 13,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  iosDone: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
