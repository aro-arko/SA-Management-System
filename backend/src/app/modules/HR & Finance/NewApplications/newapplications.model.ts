import { model, Schema } from 'mongoose';
import { TNewApplication } from './newapplications.interface';

const newApplicationSchema = new Schema<TNewApplication>(
  {
    fullName: { type: String, required: true },
    studentId: { type: Number, required: true },
    expectedGraduationDate: { type: Date, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    Faculty: { type: String, required: true },
    Major: { type: String, required: true },
    ResumeLink: { type: String, required: true },
    preferredUnit: { type: String, required: false },
    isChecked: { type: Boolean, default: false },
    checkedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const NewApplication = model<TNewApplication>(
  'NewApplication',
  newApplicationSchema,
);
