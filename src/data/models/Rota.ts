import * as mongoose from 'mongoose';
import * as types from '@/types';

import { Schema } from 'mongoose';

const ShiftSchema = new mongoose.Schema<types.Shift>({
  name: {type: String,required: true},
  string: { type: String, required: true },
  allday: { type: Boolean, required: true },
  start: { type: String, required: false },
  duration: { type: Number, required: false }
})

const RotaSchema = new Schema<types.Rota>({
  user: { type: String, required: true },
  spreadsheet: { type: String, required: true},
  sheet: {type: String, required: true},
  dates_column: { type: String, required: true},
  shifts_column: { type: String, required: true},
  start_row: { type: Number, required: true},
  end_row: { type: Number, required: true},
  shifts: [ShiftSchema],
  calendar_id: {type: String, required: false},
  date_format: {type: String, required: true}
});

export const Rota: mongoose.Model<types.Rota> = mongoose.models.Rota || mongoose.model('Rota', RotaSchema);